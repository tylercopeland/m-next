import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as s from './Loader.styles';

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

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
};

/**
 * Loader — animated "Loading content" spinner shown inside the grid body
 * while data is fetching. Tiny presentational primitive; previously had no
 * public props.
 *
 * Note: this is the public Loader from @m-next/grid. Many props that look
 * legacy on the Grid family (isV4Design, isMobile, legacyClass, compactStyle)
 * are load-bearing on the parent Grid component — they are silently ignored
 * here only because this leaf component never used them.
 */
const Loader = forwardRef(function Loader(props, ref) {
  const {
    id: idProp,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-grid-loader-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'grid-loader-forwardRef-prop',
      '@m-next/grid: `forwardRef` prop is deprecated on <Loader>. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the rendered root element.
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

  return (
    <s.Loader id={id} ref={setRef}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path
          d='M12,5.247c-0.414,0-0.75-0.336-0.75-0.75v-3.75c0-0.414,0.336-0.75,0.75-0.75s0.75,0.336,0.75,0.75v3.75
                C12.75,4.911,12.414,5.247,12,5.247z'
        />
        <path
          d='M12,23.997c-0.414,0-0.75-0.336-0.75-0.75v-3.75c0-0.414,0.336-0.75,0.75-0.75s0.75,0.336,0.75,0.75v3.75
                C12.75,23.661,12.414,23.997,12,23.997z'
        />
        <path
          d='M6.697,7.444c-0.2,0-0.389-0.078-0.53-0.22L3.515,4.572c-0.142-0.142-0.22-0.33-0.22-0.53c0-0.2,0.078-0.389,0.22-0.53
                c0.141-0.142,0.33-0.22,0.53-0.22l0,0c0.2,0,0.389,0.078,0.53,0.22l2.652,2.652c0.142,0.142,0.22,0.33,0.22,0.53
                c0,0.2-0.078,0.389-0.22,0.53C7.086,7.366,6.897,7.444,6.697,7.444z'
        />
        <path
          d='M19.955,20.702c-0.2,0-0.389-0.078-0.53-0.22l-2.652-2.651c-0.142-0.141-0.22-0.33-0.22-0.53c0-0.2,0.078-0.389,0.22-0.53
                s0.33-0.22,0.53-0.22s0.389,0.078,0.53,0.22l2.652,2.651c0.142,0.141,0.22,0.33,0.22,0.53c0,0.2-0.078,0.389-0.22,0.53
                S20.155,20.702,19.955,20.702z'
        />
        <path
          d='M0.75,12.747c-0.414,0-0.75-0.336-0.75-0.75s0.336-0.75,0.75-0.75H4.5c0.414,0,0.75,0.336,0.75,0.75s-0.336,0.75-0.75,0.75
                H0.75z'
        />
        <path
          d='M19.5,12.747c-0.414,0-0.75-0.336-0.75-0.75s0.336-0.75,0.75-0.75h3.75c0.414,0,0.75,0.336,0.75,0.75
                s-0.336,0.75-0.75,0.75H19.5z'
        />
        <path
          d='M4.045,20.702c-0.2,0-0.389-0.078-0.53-0.22c-0.142-0.142-0.22-0.33-0.22-0.531s0.078-0.389,0.22-0.53l2.652-2.651
                c0.142-0.142,0.33-0.22,0.53-0.22c0.2,0,0.389,0.078,0.53,0.22c0.142,0.142,0.22,0.33,0.22,0.531s-0.078,0.389-0.22,0.53
                l-2.652,2.651C4.434,20.624,4.245,20.702,4.045,20.702z'
        />
        <path
          d='M17.303,7.444c-0.2,0-0.389-0.078-0.53-0.22c-0.142-0.141-0.22-0.33-0.22-0.53s0.078-0.389,0.22-0.53l2.652-2.652
                c0.142-0.142,0.33-0.22,0.53-0.22l0,0c0.2,0,0.389,0.078,0.53,0.22c0.142,0.141,0.22,0.33,0.22,0.53s-0.078,0.389-0.22,0.53
                l-2.652,2.652C17.692,7.366,17.503,7.444,17.303,7.444z'
        />
      </svg>
      <s.LoadingText>Loading content</s.LoadingText>
    </s.Loader>
  );
});

Loader.displayName = 'Loader';
Loader.propTypes = propTypes;

export default Loader;
