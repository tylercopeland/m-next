import React from 'react';
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

const Alert = ({
  status = 'info',
  title,
  children,
  action,
  onDismiss,
  style,
  ...rest
}) => {
  const statusColors = STATUS_COLORS[status] || STATUS_COLORS.info;
  const role = status === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
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
        ...style,
      }}
      {...rest}
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
          paddingRight: onDismiss ? 24 : 0,
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
          }}
        >
          {children}
        </div>

        {action ? (
          <div style={{ marginTop: 8, fontFamily: FONT_FAMILY }}>{action}</div>
        ) : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
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
      ) : null}
    </div>
  );
};

export default Alert;
