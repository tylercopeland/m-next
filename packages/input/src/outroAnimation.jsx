import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-4px);
  }
`;

const AnimatedWrapper = styled.div`
  animation: ${({ isExiting }) => (isExiting ? fadeOutUp : 'none')} ${({ duration }) => duration}ms ease-out forwards;
`;

const propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool.isRequired,
  exitDuration: PropTypes.number,
};

function OutroAnimation({ children, show, exitDuration = 200 }) {
  // combination of show and isExiting needed as one variable
  // to prevent re-render flickers
  const [shouldRender, setShouldRender] = useState(show);
  const [isExiting, setIsExiting] = useState(false);
  const cachedChildrenRef = useRef(show ? children : null);
  const exitTimerRef = useRef(null);

  // Always update cache when children change and we're showing (not exiting)
  if (show && !isExiting) {
    cachedChildrenRef.current = children;
  }

  useEffect(() => {
    // Clear any pending exit timer
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (show) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      // Start exit animation
      setIsExiting(true);
      exitTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
        exitTimerRef.current = null;
      }, exitDuration);
    }

    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, [show, exitDuration, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatedWrapper isExiting={isExiting} duration={exitDuration}>
      {cachedChildrenRef.current}
    </AnimatedWrapper>
  );
}

OutroAnimation.propTypes = propTypes;
export default OutroAnimation;
