import React, { forwardRef, useEffect, useCallback, useRef, useState } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SimpleBar from 'simplebar-react';
import { interactions } from '@m-next/utilities';

import * as s from './container.styles';
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

/**
 * Container — a surface wrapper. Renders a padded, optionally bordered/elevated
 * `<div>` with optional scroll behavior, hover styling, and a skeleton loading
 * state. The base surface for Card, Insight cards, ContentCard, and any panel
 * that needs the m-next surface treatment.
 */
const Container = forwardRef(function Container(props, ref) {
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
    onScroll = null,
    isRound = true,
    scrollable = false,
    scrollableRef = null,
    borderless = true,
    padding = null,
    height = 'unset',
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
    internalIdRef.current = `m-next-container-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'container-forwardRef-prop',
      '@m-next/container: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }
  // The effective ref chains the modern ref API and the legacy forwardRef prop.
  const effectiveRef = ref ?? legacyForwardRef;

  const internalSimpleBarRef = useRef(null);
  const simpleBarRef = scrollableRef || internalSimpleBarRef;
  const [recalcTimer, setRecalcTimer] = useState(null);

  const handleResize = useCallback(() => {
    // Queue a command to recalculate the scrolling needs; Placed to the end of the execution stack (timeout).
    if (simpleBarRef?.current) setRecalcTimer(setTimeout(() => simpleBarRef.current.recalculate()));
  }, [simpleBarRef]);

  useEffect(() => {
    // Hooking window resize gives convenient way to trigger scrollbar fix from anywhere in the app.
    window.addEventListener('resize', handleResize);
    const simplebar = simpleBarRef?.current;

    // Add scroll event listener if onScroll is provided and component is scrollable
    if (onScroll && scrollable && simplebar) {
      const scrollElement = simplebar.getScrollElement();
      if (scrollElement) {
        scrollElement.addEventListener('scroll', onScroll);
      }
    }

    return () => {
      // cleanup
      window.removeEventListener('resize', handleResize);
      if (onScroll && scrollable && simplebar) {
        const scrollElement = simplebar.getScrollElement();
        if (scrollElement) {
          scrollElement.removeEventListener('scroll', onScroll);
        }
      }
      clearTimeout(recalcTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleBarRef, onScroll, scrollable]); // Don't add recalcTimer as dependency (infinite loop).

  if (scrollable)
    return (
      <SimpleBar style={{ height: height !== 'unset' ? height : '100%', width, maxHeight }} ref={simpleBarRef}>
        <s.Container
          id={id ? `${id}-container` : undefined}
          isLoading={isLoading}
          isVisible={isVisible}
          className={className}
          width={width}
          style={style}
          onClick={onClick}
          onKeyDown={interactions.handleEnterKey(onClick)}
          isRound={isRound}
          ref={effectiveRef}
          borderless={borderless}
          padding={padding}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          hoverStyle={hoverStyle}
          maxHeight={maxHeight}
          {...rest}
        >
          {isVisible && (!isLoading || hasChildLoading) && children}
          {isVisible && isLoading && !hasChildLoading && (
            <LoadingSkeleton count={1} width={width} height='100%' circle={false} duration={1.4} />
          )}
        </s.Container>
      </SimpleBar>
    );

  return (
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
      isRound={isRound}
      ref={effectiveRef}
      borderless={borderless}
      padding={padding}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      hoverStyle={hoverStyle}
      maxHeight={maxHeight}
      {...rest}
    >
      {isVisible && (!isLoading || hasChildLoading) && children}
      {isVisible && isLoading && !hasChildLoading && (
        <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />
      )}
    </s.Container>
  );
});

Container.displayName = 'Container';

export default Container;
