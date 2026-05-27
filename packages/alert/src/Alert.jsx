import React from 'react';

const FONT_FAMILY = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const STATUS_COLORS = {
  info: { background: '#EAF3FB', accent: '#0D71C8', icon: 'ℹ' },
  success: { background: '#ECFDF5', accent: '#10B981', icon: '✓' },
  warning: { background: '#FEF3C7', accent: '#D97706', icon: '⚠' },
  error: { background: '#FEE2E2', accent: '#DC2626', icon: '✕' },
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
  const colors = STATUS_COLORS[status] || STATUS_COLORS.info;
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
        background: colors.background,
        borderLeft: `4px solid ${colors.accent}`,
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
          color: colors.accent,
          fontFamily: FONT_FAMILY,
        }}
      >
        {colors.icon}
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
              color: '#111827',
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
            color: '#374151',
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
            color: '#6b7280',
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
