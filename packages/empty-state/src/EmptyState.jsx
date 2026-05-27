import React from 'react';
import { Stack } from '@m-next/layout';

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const VARIANT_STYLES = {
  subtle: {
    padding: 32,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
  },
  bordered: {
    padding: 48,
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
    borderRadius: 12,
  },
  banner: {
    padding: 32,
    background: '#f3f4f6',
    border: 'none',
    borderRadius: 8,
  },
};

const iconContainerStyle = {
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9ca3af',
  fontSize: 40,
  lineHeight: 1,
};

const titleStyle = {
  margin: 0,
  fontFamily,
  fontSize: 18,
  fontWeight: 600,
  color: '#111827',
  lineHeight: 1.3,
};

const descriptionStyle = {
  margin: 0,
  fontFamily,
  fontSize: 14,
  fontWeight: 400,
  color: '#6b7280',
  lineHeight: 1.5,
  maxWidth: 480,
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = 'subtle',
  style,
  ...rest
}) => {
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.subtle;

  return (
    <div
      role="region"
      aria-label={title}
      style={{
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily,
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      <Stack gap="md" align="center">
        {icon ? (
          <div aria-hidden="true" style={iconContainerStyle}>
            {icon}
          </div>
        ) : null}
        <h3 style={titleStyle}>{title}</h3>
        {description ? <p style={descriptionStyle}>{description}</p> : null}
        {action ? <div>{action}</div> : null}
      </Stack>
    </div>
  );
};

export default EmptyState;
