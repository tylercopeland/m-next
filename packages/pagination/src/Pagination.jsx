import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as s from './Pagination.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// ============================================================================
// Page-range computation
// ============================================================================
//
// Returns the sequence of "cells" rendered between Prev and Next: a mix of
// page numbers and ellipsis markers. Pages are 1-based throughout.
//
// Window shape (totalPages=10, currentPage=5, siblingCount=1):
//   [1, '…', 4, 5, 6, '…', 10]
//
// When the current page is near an edge the ellipsis on that side
// collapses so we never render two adjacent page numbers as "1 … 2":
//   currentPage=2, siblingCount=1 → [1, 2, 3, '…', 10]
//   currentPage=9, siblingCount=1 → [1, '…', 8, 9, 10]

const ELLIPSIS = 'ellipsis';

const range = (start, end) => {
  const out = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
};

export function getPageRange(currentPage, totalPages, siblingCount = 1) {
  // Total slots = first + last + current + 2*siblings + 2 ellipsis = 5 + 2*siblings
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  // Near the start: pin the window to the left edge, only ellipsis on the right.
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), ELLIPSIS, totalPages];
  }

  // Near the end: pin the window to the right edge, only ellipsis on the left.
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, ELLIPSIS, ...range(totalPages - rightCount + 1, totalPages)];
  }

  // Middle: both ellipsis, sliding window around current.
  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, totalPages];
}

// ============================================================================
// Inline SVGs — kept tiny, no icon dep required.
// ============================================================================

const ChevronLeft = () => (
  <svg viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M7 1 L3 5 L7 9' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M3 1 L7 5 L3 9' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const DoubleChevronLeft = () => (
  <svg viewBox='0 0 14 10' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M6 1 L2 5 L6 9 M11 1 L7 5 L11 9' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const DoubleChevronRight = () => (
  <svg viewBox='0 0 14 10' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    <path d='M3 1 L7 5 L3 9 M8 1 L12 5 L8 9' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

// ============================================================================
// Pagination — page navigator for paged data views.
// ============================================================================

const paginationPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /** 1-based index of the currently displayed page. */
  currentPage: PropTypes.number.isRequired,
  /** Total number of pages available. */
  totalPages: PropTypes.number.isRequired,
  /** Called with the new 1-based page index when the user clicks a page button. */
  onPageChange: PropTypes.func.isRequired,
  /** Number of page-number buttons shown on each side of the current page. */
  siblingCount: PropTypes.number,
  /** When true, render «« first / last »» buttons in addition to ‹ prev / next ›. */
  showFirstLast: PropTypes.bool,
  /** Accessible label for the <nav> landmark. */
  ariaLabel: PropTypes.string,
};

/**
 * Pagination — page navigator for paged data views (tables, grids, lists).
 *
 *   <Pagination
 *     currentPage={page}
 *     totalPages={totalPages}
 *     onPageChange={setPage}
 *   />
 *
 * Pages are **1-based** — `currentPage={1}` is the first page, and
 * `onPageChange` is always called with a 1-based index. This matches the
 * mental model most APIs and humans use ("page 1 of 10") and lines up with
 * the existing MethodUI pagination.
 *
 * Renders « ‹ 1 … 4 [5] 6 … 10 › » — first/prev/window/next/last. The
 * sliding page window is controlled by `siblingCount` (default 1 → 3-wide
 * window around current). Set `showFirstLast={false}` to drop the «»
 * jump-to-edge buttons.
 *
 * The component is controlled — it owns no internal page state. The
 * consumer holds `currentPage` and updates it from `onPageChange`. If
 * `totalPages <= 1`, the component renders nothing.
 */
const Pagination = forwardRef(function Pagination(props, ref) {
  const {
    id: idProp,
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    showFirstLast = true,
    ariaLabel = 'Pagination',

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-pagination-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'pagination-forwardRef-prop',
      '@m-next/pagination: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the rendered root.
  const internalElRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalElRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = internalElRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setRef = (node) => {
    internalElRef.current = node;
  };

  // Single-page or empty: render nothing. Keeps the consumer from having
  // to gate the component themselves on every paged view.
  if (!totalPages || totalPages < 1) return null;

  const clampedCurrent = Math.min(Math.max(currentPage, 1), totalPages);
  const isFirst = clampedCurrent === 1;
  const isLast = clampedCurrent === totalPages;

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === clampedCurrent) return;
    onPageChange(page);
  };

  const cells = getPageRange(clampedCurrent, totalPages, siblingCount);

  return (
    <s.Container
      ref={setRef}
      id={id}
      role='navigation'
      aria-label={ariaLabel}
      {...rest}
    >
      {showFirstLast && (
        <s.Button
          type='button'
          aria-label='Go to first page'
          title='First page'
          disabled={isFirst}
          onClick={() => goTo(1)}
        >
          <DoubleChevronLeft />
        </s.Button>
      )}
      <s.Button
        type='button'
        aria-label='Go to previous page'
        title='Previous page'
        disabled={isFirst}
        onClick={() => goTo(clampedCurrent - 1)}
      >
        <ChevronLeft />
      </s.Button>

      {cells.map((cell, i) => {
        if (cell === ELLIPSIS) {
          // eslint-disable-next-line react/no-array-index-key
          return <s.Ellipsis key={`ellipsis-${i}`} aria-hidden='true'>…</s.Ellipsis>;
        }
        const isActive = cell === clampedCurrent;
        return (
          <s.Button
            key={cell}
            type='button'
            active={isActive}
            aria-label={`Go to page ${cell}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => goTo(cell)}
          >
            {cell}
          </s.Button>
        );
      })}

      <s.Button
        type='button'
        aria-label='Go to next page'
        title='Next page'
        disabled={isLast}
        onClick={() => goTo(clampedCurrent + 1)}
      >
        <ChevronRight />
      </s.Button>
      {showFirstLast && (
        <s.Button
          type='button'
          aria-label='Go to last page'
          title='Last page'
          disabled={isLast}
          onClick={() => goTo(totalPages)}
        >
          <DoubleChevronRight />
        </s.Button>
      )}
    </s.Container>
  );
});

Pagination.displayName = 'Pagination';
Pagination.propTypes = paginationPropTypes;

export default Pagination;
