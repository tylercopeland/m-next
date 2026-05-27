import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SimpleBar from 'simplebar-react';
import { interactions } from '@m-next/utilities';

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
  onScroll: PropTypes.func,
  isRound: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  scrollable: PropTypes.bool,
  scrollableRef: PropTypes.instanceOf(Object),
  borderless: PropTypes.bool,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

/**
 * Wrapper component around
 */
const Container = ({
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
  onScroll = null,
  isRound = true,
  forwardRef = null,
  scrollable = false,
  scrollableRef = null,
  borderless = true,
  padding = null,
  height = 'unset',
  maxHeight,
}) => {
  const internalSimpleBarRef = React.useRef(null);
  const simpleBarRef = scrollableRef || internalSimpleBarRef;
  const [recalcTimer, setRecalcTimer] = React.useState(null);

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
          ref={forwardRef}
          borderless={borderless}
          padding={padding}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          hoverStyle={hoverStyle}
          maxHeight={maxHeight}
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
      ref={forwardRef}
      borderless={borderless}
      padding={padding}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      hoverStyle={hoverStyle}
      maxHeight={maxHeight}
    >
      {isVisible && (!isLoading || hasChildLoading) && children}
      {isVisible && isLoading && !hasChildLoading && (
        <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />
      )}
    </s.Container>
  );
};

Container.propTypes = propTypes;
export default Container;
