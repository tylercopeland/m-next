import React from 'react';
import { Stack } from '@m-next/layout';
import { colors } from '@m-next/tokens';

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
    background: colors.grey.lightest,
    border: `1px dashed ${colors.grey.light}`,
    borderRadius: 12,
  },
  banner: {
    padding: 32,
    background: colors.grey.lighter,
    border: 'none',
    borderRadius: 8,
  },
};

const iconContainerStyle = {
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.grey.light,
  fontSize: 40,
  lineHeight: 1,
};

const titleStyle = {
  margin: 0,
  fontFamily,
  fontSize: 18,
  fontWeight: 600,
  color: colors.grey.darkest,
  lineHeight: 1.3,
};

const descriptionStyle = {
  margin: 0,
  fontFamily,
  fontSize: 14,
  fontWeight: 400,
  color: colors.grey.base,
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
