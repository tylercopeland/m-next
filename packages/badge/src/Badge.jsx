import React from 'react';

// Base hues per colorScheme. `subtle` derives a pale tint (~12%) for bg
// and uses the base hue for text. `outline` uses base hue for border + text.
const PALETTE = {
  neutral: { base: '#6b7280', subtleBg: '#f3f4f6', subtleText: '#374151' },
  blue: { base: '#0D71C8', subtleBg: '#e3f0fa', subtleText: '#0D71C8' },
  green: { base: '#137E58', subtleBg: '#dff1e9', subtleText: '#137E58' },
  yellow: { base: '#D97706', subtleBg: '#fdeed5', subtleText: '#92400E' },
  red: { base: '#8A1F1F', subtleBg: '#f5dede', subtleText: '#8A1F1F' },
};

const SIZE_STYLES = {
  sm: { fontSize: 10, padding: '2px 6px', lineHeight: 1.2 },
  md: { fontSize: 12, padding: '3px 8px', lineHeight: 1.2 },
};

const getVariantStyles = (variant, scheme) => {
  const palette = PALETTE[scheme] || PALETTE.neutral;
  switch (variant) {
    case 'subtle':
      return {
        backgroundColor: palette.subtleBg,
        color: palette.subtleText,
        border: '1px solid transparent',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: palette.base,
        border: `1px solid ${palette.base}`,
      };
    case 'solid':
    default:
      return {
        backgroundColor: palette.base,
        color: '#ffffff',
        border: '1px solid transparent',
      };
  }
};

const Badge = ({
  variant = 'solid',
  colorScheme = 'neutral',
  size = 'md',
  dot = false,
  children,
  style,
  ...rest
}) => {
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;
  const variantStyle = getVariantStyles(variant, colorScheme);

  const dotColor = variantStyle.color;
  const dotStyle = {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: dotColor,
    marginRight: 4,
    flexShrink: 0,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        fontWeight: 600,
        fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        boxSizing: 'border-box',
        ...sizeStyle,
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={dotStyle} aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
