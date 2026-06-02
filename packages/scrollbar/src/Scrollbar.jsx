import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';

import * as s from './Scrollbar.styles';
import 'simplebar-react/dist/simplebar.min.css';

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

// Translate either a number ('56' → '56px') or a string ('56px', '3rem',
// 'var(--header)') into a CSS-safe length. Number-without-unit assumed px,
// matching how the rest of m-next normalises sizes.
const toCssLength = (value) => {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

const scrollbarPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /**
   * Vertical space reserved at the top of the scroll container. Translated
   * internally to `maxHeight: calc(100% - <offset>)`. Accepts a number
   * (treated as pixels) or any CSS length (`'56px'`, `'3rem'`, `var(...)`).
   *
   * This mirrors the original MethodUI `<Scrollbar offset="56px" />` API:
   * consumers used it to leave room for a fixed header that sat above the
   * scrollable region. `maxHeight` (below) takes precedence if both are set.
   */
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** When false, the component renders nothing. Matches the original API. */
  isVisible: PropTypes.bool,
  /**
   * Explicit max-height. Overrides any `offset`-derived calc. Accepts a
   * number (treated as pixels) or any CSS length.
   */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Explicit height. Useful when the scrollbar's parent does not have a
   * defined height (SimpleBar requires one). Accepts a number or CSS length.
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Extra class for the SimpleBar root. */
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Scrollbar — themed scroll container.
 *
 *   <Scrollbar offset='56px'>
 *     <LongList />
 *   </Scrollbar>
 *
 * Thin wrapper over `simplebar-react` (the same dep `@m-next/container`
 * uses for its `scrollable` mode) with m-next track/thumb styling and an
 * offset-aware height.
 *
 * The offset prop mirrors the original MethodUI `<Scrollbar offset="56px" />`
 * pattern — it's how consumers reserve vertical space at the top of the
 * scrollable region for a fixed header. Internally we translate it to
 * `maxHeight: calc(100% - <offset>)` and hand that to SimpleBar's style
 * prop. If the caller passes `maxHeight` directly, that wins.
 *
 * `isVisible={false}` returns `null` instead of rendering — matching the
 * original API. Consumers that want to keep the DOM around should toggle
 * `display: none` themselves.
 *
 * The `ref` points at the SimpleBar component instance (not the DOM node).
 * Call `ref.current.recalculate()` after content changes, or use
 * `ref.current.getScrollElement()` to attach a native scroll listener.
 */
const Scrollbar = forwardRef(function Scrollbar(props, ref) {
  const {
    id: idProp,
    offset,
    isVisible = true,
    maxHeight: maxHeightProp,
    height: heightProp,
    className,
    children,

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
    internalIdRef.current = `m-next-scrollbar-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'scrollbar-forwardRef-prop',
      '@m-next/scrollbar: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the SimpleBar instance.
  const internalSimpleBarRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalSimpleBarRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = internalSimpleBarRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  });

  if (!isVisible) return null;

  // Resolve the effective max-height. Explicit `maxHeight` wins; otherwise
  // we derive `calc(100% - <offset>)` from the offset prop (matching the
  // original `<CustomScroll heightRelativeToParent="calc(100% - ..." />`
  // pattern). If neither is set, leave it undefined and let the parent
  // height + SimpleBar do their thing.
  const cssOffset = toCssLength(offset);
  const cssMaxHeight = toCssLength(maxHeightProp);
  const cssHeight = toCssLength(heightProp);

  let effectiveMaxHeight = cssMaxHeight;
  if (!effectiveMaxHeight && cssOffset) {
    effectiveMaxHeight = `calc(100% - ${cssOffset})`;
  }

  // The styled wrapper exists solely to scope the SimpleBar theming. SimpleBar
  // itself is given an explicit style prop because that's the only way it
  // forwards size down to its internal `.simplebar-content-wrapper`.
  return (
    <s.ScrollbarRoot
      id={id}
      className={className}
      maxHeight={effectiveMaxHeight}
      height={cssHeight || '100%'}
    >
      <SimpleBar
        ref={internalSimpleBarRef}
        style={{
          height: cssHeight || '100%',
          ...(effectiveMaxHeight ? { maxHeight: effectiveMaxHeight } : {}),
        }}
        {...rest}
      >
        {children}
      </SimpleBar>
    </s.ScrollbarRoot>
  );
});

Scrollbar.displayName = 'Scrollbar';
Scrollbar.propTypes = scrollbarPropTypes;

export default Scrollbar;
