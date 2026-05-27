import React, { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import { colors } from '@m-next/tokens';

const KEYFRAMES_ID = 'm-next-tooltip-keyframes';
const KEYFRAMES_CSS = `
@keyframes m-next-tooltip-fade-in { from { opacity: 0; } to { opacity: 1; } }
`;

const ensureKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
};

// Stable, unique id without depending on React 18's useId.
let tooltipIdCounter = 0;
const nextTooltipId = () => {
  tooltipIdCounter += 1;
  return `m-next-tooltip-${tooltipIdCounter}`;
};

const chain = (...fns) => (event) => {
  fns.forEach((fn) => {
    if (typeof fn === 'function') fn(event);
  });
};

const BUBBLE_BG = colors.grey.darkest;
const ARROW_SIZE = 8;
// Gap between trigger and bubble (room for the arrow + a hair of breathing room).
const OFFSET = ARROW_SIZE + 2;

// Container positions the bubble relative to the wrapper <span> (the trigger's bounding box).
const containerStyleForPlacement = (placement) => {
  switch (placement) {
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingTop: OFFSET,
        flexDirection: 'column',
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        paddingRight: OFFSET,
        flexDirection: 'row',
      };
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        paddingLeft: OFFSET,
        flexDirection: 'row',
      };
    case 'top':
    default:
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingBottom: OFFSET,
        flexDirection: 'column',
      };
  }
};

const arrowStyleForPlacement = (placement) => {
  // CSS-triangle arrow pointing AT the trigger (so it points away from the bubble).
  const base = { width: 0, height: 0, position: 'absolute' };
  switch (placement) {
    case 'bottom':
      return {
        ...base,
        top: OFFSET - ARROW_SIZE,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid ${BUBBLE_BG}`,
      };
    case 'left':
      return {
        ...base,
        right: OFFSET - ARROW_SIZE,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid transparent`,
        borderLeft: `${ARROW_SIZE}px solid ${BUBBLE_BG}`,
      };
    case 'right':
      return {
        ...base,
        left: OFFSET - ARROW_SIZE,
        top: '50%',
        transform: 'translateY(-50%)',
        borderTop: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid ${BUBBLE_BG}`,
      };
    case 'top':
    default:
      return {
        ...base,
        bottom: OFFSET - ARROW_SIZE,
        left: '50%',
        transform: 'translateX(-50%)',
        borderLeft: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid transparent`,
        borderTop: `${ARROW_SIZE}px solid ${BUBBLE_BG}`,
      };
  }
};

const Tooltip = ({ content, placement = 'top', delay = 300, children, style, ...rest }) => {
  useEffect(ensureKeyframes, []);

  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef(null);
  const idRef = useRef(null);
  if (idRef.current === null) idRef.current = nextTooltipId();
  const tooltipId = idRef.current;

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearShowTimer(), [clearShowTimer]);

  const showAfterDelay = useCallback(() => {
    clearShowTimer();
    if (delay <= 0) {
      setVisible(true);
      return;
    }
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      setVisible(true);
    }, delay);
  }, [delay, clearShowTimer]);

  const hideImmediately = useCallback(() => {
    clearShowTimer();
    setVisible(false);
  }, [clearShowTimer]);

  const showImmediately = useCallback(() => {
    clearShowTimer();
    setVisible(true);
  }, [clearShowTimer]);

  // Chain consumer handlers with ours so we don't clobber.
  const childProps = children && children.props ? children.props : {};
  const triggerProps = {
    onMouseEnter: chain(childProps.onMouseEnter, showAfterDelay),
    onMouseLeave: chain(childProps.onMouseLeave, hideImmediately),
    onFocus: chain(childProps.onFocus, showImmediately),
    onBlur: chain(childProps.onBlur, hideImmediately),
    'aria-describedby': visible
      ? [childProps['aria-describedby'], tooltipId].filter(Boolean).join(' ')
      : childProps['aria-describedby'],
  };

  const trigger = cloneElement(children, triggerProps);

  const wrapperStyle = {
    position: 'relative',
    display: 'inline-block',
    ...style,
  };

  const containerStyle = {
    position: 'absolute',
    display: 'flex',
    pointerEvents: 'none',
    zIndex: 1000,
    ...containerStyleForPlacement(placement),
  };

  const bubbleStyle = {
    position: 'relative',
    background: BUBBLE_BG,
    color: colors.white,
    fontSize: 12,
    lineHeight: 1.4,
    padding: '6px 10px',
    borderRadius: 6,
    maxWidth: 240,
    width: 'max-content',
    boxSizing: 'border-box',
    textAlign: 'left',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    animation: 'm-next-tooltip-fade-in 120ms ease-out',
  };

  return (
    <span style={wrapperStyle} {...rest}>
      {trigger}
      {visible && (
        <span style={containerStyle}>
          <span role="tooltip" id={tooltipId} style={bubbleStyle}>
            {content}
            <span aria-hidden="true" style={arrowStyleForPlacement(placement)} />
          </span>
        </span>
      )}
    </span>
  );
};

export default Tooltip;
