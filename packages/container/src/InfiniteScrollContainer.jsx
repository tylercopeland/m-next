import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { interactions } from '@m-next/utilities';
import SimpleBar from 'simplebar-react';

import * as s from './container.styles';
import 'simplebar-react/dist/simplebar.min.css';

// One-time deprecation warner — fires once per key, mirrors @m-next/container.
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

/**
 * InfiniteScrollContainer — a Container variant that auto-fires a `fetchData`
 * callback when a sentinel at the bottom of the scroll area becomes visible.
 * Used in list views to drive page-on-scroll record loading.
 */
const InfiniteScrollContainer = forwardRef(function InfiniteScrollContainer(props, ref) {
  const {
    id: idProp,
    className,
    style = {},
    hoverStyle = {},
    isLoading = false,
    children,
    isVisible = true,
    hasChildLoading,
    width = '100%',
    onClick = null,
    onMouseEnter = null,
    onMouseLeave = null,
    padding = '0px',
    height = 'unset',
    fetchData,
    error,
    scrollRef,
    tabIndex,
    maxHeight,

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
    internalIdRef.current = `m-next-infinite-scroll-container-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'infinite-scroll-container-forwardRef-prop',
      '@m-next/container (InfiniteScrollContainer): `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }
  const effectiveRef = ref ?? legacyForwardRef;

  const observerTarget = useRef(null);
  const simpleBarRef = useRef(null);
  const [recalcTimer, setRecalcTimer] = useState(null);

  const handleResize = useCallback(() => {
    // Queue a command to recalculate the scrolling needs; Placed to the end of the execution stack (timeout).
    if (simpleBarRef?.current) setRecalcTimer(setTimeout(() => simpleBarRef.current.recalculate()));
  }, []);

  useEffect(() => {
    // Hooking window resize gives convenient way to trigger scrollbar fix from anywhere in the app.
    window.addEventListener('resize', handleResize);
    return () => {
      // cleanup
      window.removeEventListener('resize', handleResize);
      clearTimeout(recalcTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleBarRef]); // Don't add recalcTimer as dependency (infinite loop).

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (fetchData) fetchData();
        }
      },
      { threshold: 1 },
    );

    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [fetchData, observerTarget]);

  return (
    <div style={{ overflow: 'hidden', maxHeight }} tabIndex={-1}>
      <SimpleBar
        style={{ maxHeight, height: height !== 'unset' ? height : '100%', width }}
        scrollableNodeProps={{ ref: scrollRef }}
        tabIndex={tabIndex}
        ref={simpleBarRef}
      >
        <s.Container
          id={id ? `${id}-container` : undefined}
          className={className}
          isLoading={isLoading}
          isVisible={isVisible}
          width={width}
          height={height}
          style={style}
          onClick={onClick}
          onKeyDown={interactions.handleEnterKey(onClick)}
          isRound={false}
          ref={effectiveRef}
          borderless
          padding={padding}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          hoverStyle={hoverStyle}
          tabIndex={tabIndex}
          {...rest}
        >
          {isVisible && (!isLoading || hasChildLoading) && children}
          {isVisible && isLoading && !hasChildLoading && (
            <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />
          )}
        </s.Container>
        {error && <p>Error: {error}</p>}
        <div ref={observerTarget} />
      </SimpleBar>
    </div>
  );
});

InfiniteScrollContainer.displayName = 'InfiniteScrollContainer';

export default InfiniteScrollContainer;
