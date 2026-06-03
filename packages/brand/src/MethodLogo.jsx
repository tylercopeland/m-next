import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';

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

// Canonical asset URLs. The default points at the white wordmark hosted by
// Method on their own CDN — single source of truth. Consumers wanting a
// different variant (icon-only, dark surface, etc.) can override via `src`.
const DEFAULT_SRC = 'https://www.method.me/wp-content/uploads/2021/10/Logo-Method-white.svg';

// Natural aspect ratio of the wordmark asset (viewBox 514.9 × 125.3).
const NATURAL_RATIO = 514.9 / 125.3;

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  /** Asset URL. Defaults to the white-wordmark variant on Method's CDN. */
  src: PropTypes.string,
  /** Height in pixels. Width is derived from the natural aspect ratio. */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Explicit width override. Use either `height` or `width`. */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Accessible label. Defaults to "Method". */
  ariaLabel: PropTypes.string,
  /** When true, the logo is decorative — sets aria-hidden, no role. */
  decorative: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
};

/**
 * MethodLogo — wraps the Method wordmark asset with the standard m-next
 * envelope (size, accessibility, ref forwarding). The asset itself is
 * referenced by URL so this package doesn't carry a private copy of the
 * brand mark; the source of truth lives on Method's CDN.
 *
 * Pull this into any chrome surface (Sidebar.Header, AppBar.Start, login
 * splash) where the Method brand belongs. Pass `height` (typical) and the
 * natural aspect ratio gives you the width. Pass `src` to swap variants
 * (icon-only, dark-surface, etc.) once Method publishes them.
 *
 * Default asset:
 *   https://www.method.me/wp-content/uploads/2021/10/Logo-Method-white.svg
 */
const MethodLogo = forwardRef(function MethodLogo(props, ref) {
  const {
    id: idProp,
    src = DEFAULT_SRC,
    height = 24,
    width,
    ariaLabel = 'Method',
    decorative = false,
    style,

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
    internalIdRef.current = `m-next-method-logo-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'method-logo-forwardRef-prop',
      '@m-next/brand: `forwardRef` prop on MethodLogo is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Derive whichever dimension wasn't explicitly set, preserving the
  // natural aspect ratio.
  let resolvedHeight = height;
  let resolvedWidth = width;
  if (resolvedWidth == null && resolvedHeight != null) {
    const heightNum =
      typeof resolvedHeight === 'number' ? resolvedHeight : parseFloat(resolvedHeight);
    if (!Number.isNaN(heightNum)) {
      resolvedWidth = heightNum * NATURAL_RATIO;
    }
  } else if (resolvedHeight == null && resolvedWidth != null) {
    const widthNum =
      typeof resolvedWidth === 'number' ? resolvedWidth : parseFloat(resolvedWidth);
    if (!Number.isNaN(widthNum)) {
      resolvedHeight = widthNum / NATURAL_RATIO;
    }
  }

  return (
    <img
      ref={ref}
      id={id}
      src={src}
      alt={decorative ? '' : ariaLabel}
      width={resolvedWidth}
      height={resolvedHeight}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      {...rest}
    />
  );
});

MethodLogo.displayName = 'MethodLogo';
MethodLogo.propTypes = propTypes;

export default MethodLogo;
