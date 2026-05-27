import React, { useCallback, useEffect, useRef, useState } from 'react';
import { colors } from '@m-next/tokens';

const FONT_FAMILY = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const STATUS_COLORS = {
  info: {
    background: colors.blue.lighter,
    accent: colors.blue.base,
    icon: 'ℹ',
  },
  success: {
    background: colors.green.lighter,
    accent: colors.green.base,
    icon: '✓',
  },
  warning: {
    background: colors.yellow.lighter,
    accent: colors.yellow.dark,
    icon: '⚠',
  },
  error: {
    background: colors.red.lighter,
    accent: colors.red.base,
    icon: '✕',
  },
};

// Each (position, status) pair gets its entrance animation derived from the side
// the toast stack lives on. We name a single 'slide-in' for each side; the X/Y
// translation is implicit in the keyframes.
const ENTRANCE_ANIMATION = {
  'top-right': 'm-next-toast-slide-in-right',
  'bottom-right': 'm-next-toast-slide-in-right',
  'top-left': 'm-next-toast-slide-in-left',
  'bottom-left': 'm-next-toast-slide-in-left',
  'top-center': 'm-next-toast-slide-in-top',
  'bottom-center': 'm-next-toast-slide-in-bottom',
};

const EXIT_ANIMATION = {
  'top-right': 'm-next-toast-slide-out-right',
  'bottom-right': 'm-next-toast-slide-out-right',
  'top-left': 'm-next-toast-slide-out-left',
  'bottom-left': 'm-next-toast-slide-out-left',
  'top-center': 'm-next-toast-slide-out-top',
  'bottom-center': 'm-next-toast-slide-out-bottom',
};

const EXIT_DURATION = 140;

const Toast = ({
  id,
  status = 'info',
  title,
  message,
  action,
  duration,
  position = 'top-right',
  onDismiss,
}) => {
  const statusColors = STATUS_COLORS[status] || STATUS_COLORS.info;
  const role = status === 'error' ? 'alert' : 'status';

  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const beginExit = useCallback(() => {
    clearTimer();
    setExiting(true);
    // Allow the exit animation to play before removal.
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      if (typeof onDismiss === 'function') onDismiss(id);
    }, EXIT_DURATION);
  }, [clearTimer, id, onDismiss]);

  const startAutoDismiss = useCallback(
    (ms) => {
      clearTimer();
      if (ms === null || ms === undefined || ms <= 0) return;
      startedAtRef.current = Date.now();
      remainingRef.current = ms;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        beginExit();
      }, ms);
    },
    [beginExit, clearTimer]
  );

  // Kick off the auto-dismiss timer on mount.
  useEffect(() => {
    if (duration === null || duration === undefined) return undefined;
    startAutoDismiss(duration);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hover-pause: clear the timer when mouse enters, resume with remaining time on leave.
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current === null) return;
    if (startedAtRef.current !== null) {
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    clearTimer();
  }, [clearTimer]);

  const handleMouseLeave = useCallback(() => {
    if (exiting) return;
    if (duration === null || duration === undefined) return;
    if (remainingRef.current > 0) {
      startAutoDismiss(remainingRef.current);
    }
  }, [duration, exiting, startAutoDismiss]);

  const handleDismissClick = useCallback(() => {
    beginExit();
  }, [beginExit]);

  const entrance = ENTRANCE_ANIMATION[position] || ENTRANCE_ANIMATION['top-right'];
  const exit = EXIT_ANIMATION[position] || EXIT_ANIMATION['top-right'];
  const animation = exiting
    ? `${exit} ${EXIT_DURATION}ms ease-in forwards`
    : `${entrance} 180ms ease-out`;

  return (
    <div
      role={role}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        background: statusColors.background,
        borderLeft: `4px solid ${statusColors.accent}`,
        borderRadius: 6,
        fontFamily: FONT_FAMILY,
        boxSizing: 'border-box',
        minWidth: 280,
        maxWidth: 360,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        pointerEvents: 'auto',
        animation,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: '0 0 auto',
          fontSize: 16,
          lineHeight: 1.5,
          color: statusColors.accent,
          fontFamily: FONT_FAMILY,
        }}
      >
        {statusColors.icon}
      </span>

      <div
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          paddingRight: 24,
        }}
      >
        {title ? (
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.grey.darkest,
              marginBottom: 4,
              fontFamily: FONT_FAMILY,
              lineHeight: 1.4,
            }}
          >
            {title}
          </div>
        ) : null}

        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: colors.grey.dark,
            lineHeight: 1.5,
            fontFamily: FONT_FAMILY,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </div>

        {action ? (
          <div style={{ marginTop: 8, fontFamily: FONT_FAMILY }}>{action}</div>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Dismiss"
        onClick={handleDismissClick}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'transparent',
          border: 'none',
          padding: 2,
          color: colors.grey.base,
          borderRadius: 4,
          cursor: 'pointer',
          lineHeight: 1,
          fontSize: 16,
          fontFamily: FONT_FAMILY,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
