import React from 'react';
import { spacing } from '@m-next/tokens';

const toPx = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  return spacing[val] ?? 0;
};

const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = '#E5E7EB',
  spacing: spacingProp = 'md',
  size = 1,
  style,
  ...rest
}) => {
  const spacePx = toPx(spacingProp);
  const isVertical = orientation === 'vertical';

  const computed = isVertical
    ? {
        alignSelf: 'stretch',
        width: 0,
        borderLeft: `${size}px ${variant} ${color}`,
        marginLeft: spacePx,
        marginRight: spacePx,
      }
    : {
        height: 0,
        borderTop: `${size}px ${variant} ${color}`,
        marginTop: spacePx,
        marginBottom: spacePx,
      };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      style={{ ...computed, ...style }}
      {...rest}
    />
  );
};

export default Divider;
