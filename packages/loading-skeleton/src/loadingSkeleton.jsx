import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactLoadingSkeleton from 'react-loading-skeleton';
import { colors } from '@m-next/tokens';
import 'react-loading-skeleton/dist/skeleton.css';

// One-time deprecation warner — mirrors @m-next/button, @m-next/input.
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

// Default tokens — picks up the grey family from @m-next/tokens so the skeleton
// shimmer matches the rest of the m-next palette instead of react-loading-skeleton's
// default greys.
const DEFAULT_BASE_COLOR = colors.grey.lighter;
const DEFAULT_HIGHLIGHT_COLOR = colors.white;

const propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** 'text' | 'rect' | 'circle' — shape variant. */
  variant: PropTypes.oneOf(['text', 'rect', 'circle']),
  /** Custom base color for the shimmer. Defaults to colors.grey.lighter. */
  baseColor: PropTypes.string,
  /** Custom highlight color for the shimmer. Defaults to colors.white. */
  highlightColor: PropTypes.string,
  /** Border radius override (number or CSS string). */
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Animation duration in seconds. */
  duration: PropTypes.number,
  /** Render inline instead of as block-level. */
  inline: PropTypes.bool,
  /** Accessible label, announced by screen readers. */
  label: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
};

const LoadingSkeleton = forwardRef(function LoadingSkeleton(props, ref) {
  const {
    id: idProp,
    count = 1,
    width,
    height,
    variant,
    baseColor = DEFAULT_BASE_COLOR,
    highlightColor = DEFAULT_HIGHLIGHT_COLOR,
    borderRadius,
    duration,
    inline,
    label = 'Loading',
    style,
    className,

    // Soft-shimmed legacy props
    circle: legacyCircle,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-skeleton-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let resolvedVariant = variant;
  if (legacyCircle !== undefined && resolvedVariant === undefined) {
    warnOnce(
      'loading-skeleton-circle',
      '@m-next/loading-skeleton: `circle` prop is deprecated. Use `variant="circle"`.',
    );
    if (legacyCircle) resolvedVariant = 'circle';
  }

  if (legacyForwardRef) {
    warnOnce(
      'loading-skeleton-forwardRef-prop',
      '@m-next/loading-skeleton: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Ref chaining (forwardRef API + legacy forwardRef prop) ============

  const wrapperRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(wrapperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = wrapperRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ Variant → underlying props ============

  const isCircle = resolvedVariant === 'circle';

  return (
    <span
      ref={wrapperRef}
      id={id}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className={className}
      style={{ display: inline ? 'inline-block' : 'block', ...style }}
      {...rest}
    >
      <ReactLoadingSkeleton
        count={count}
        width={width}
        height={height}
        circle={isCircle}
        baseColor={baseColor}
        highlightColor={highlightColor}
        borderRadius={borderRadius}
        duration={duration}
        inline={inline}
      />
    </span>
  );
});

LoadingSkeleton.propTypes = propTypes;
LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
