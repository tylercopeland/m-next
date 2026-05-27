import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { interactions } from '@m-next/utilities';
import SimpleBar from 'simplebar-react';

import * as s from './container.styles';
import 'simplebar-react/dist/simplebar.min.css';

// types
const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  hoverStyle: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  isVisible: PropTypes.bool,
  hasChildLoading: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  scrollRef: PropTypes.instanceOf(Object),
  forwardRef: PropTypes.instanceOf(Object),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fetchData: PropTypes.func,
  error: PropTypes.string,
  tabIndex: PropTypes.number,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

/**
 * Wrapper component around
 */
function InfiniteScrollContainer({
  id,
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
  forwardRef = null,
  padding = '0px',
  height = 'unset',
  fetchData,
  error,
  scrollRef,
  tabIndex,
  maxHeight,
}) {
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
          ref={forwardRef}
          borderless
          padding={padding}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          hoverStyle={hoverStyle}
          tabIndex={tabIndex}
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
}

InfiniteScrollContainer.propTypes = propTypes;
export default InfiniteScrollContainer;
