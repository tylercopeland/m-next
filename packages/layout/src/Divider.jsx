import React, { forwardRef } from 'react';
import { spacing } from '@m-next/tokens';

const toPx = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  return spacing[val] ?? 0;
};

/**
 * Divider — horizontal or vertical separator with role="separator" +
 * aria-orientation. Forwards refs to the rendered <div>.
 */
const Divider = forwardRef(function Divider(props, ref) {
  const {
    orientation = 'horizontal',
    variant = 'solid',
    color = '#E5E7EB',
    spacing: spacingProp = 'md',
    size = 1,
    style,
    ...rest
  } = props;
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
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      style={{ ...computed, ...style }}
      {...rest}
    />
  );
});

Divider.displayName = 'Divider';

export default Divider;
