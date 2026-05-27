import React from 'react';
import { colors } from '@m-next/tokens';

// Base hues per colorScheme. `subtle` derives a pale tint (~12%) for bg
// and uses the base hue for text. `outline` uses base hue for border + text.
const PALETTE = {
  neutral: { base: colors.grey.base, subtleBg: colors.grey.lighter, subtleText: colors.grey.dark },
  blue: { base: colors.blue.base, subtleBg: colors.blue.lighter, subtleText: colors.blue.base },
  green: { base: colors.green.dark, subtleBg: colors.green.lighter, subtleText: colors.green.dark },
  yellow: { base: colors.yellow.dark, subtleBg: colors.yellow.lighter, subtleText: colors.yellow.dark },
  red: { base: colors.red.dark, subtleBg: colors.red.lighter, subtleText: colors.red.dark },
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
        color: colors.white,
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
