import React, { forwardRef } from 'react';
import { spacing } from '@m-next/tokens';

const toPx = (val) => {
  if (val == null) return undefined;
  if (typeof val === 'number') return `${val}px`;
  if (spacing[val] != null) return `${spacing[val]}px`;
  return val;
};

/**
 * Box — the base layout primitive. Renders any HTML element (default div)
 * with consistent padding / margin / width / height props that accept
 * either a token name (e.g. 'md'), a number (px), or a CSS string.
 *
 * Forwards refs to the rendered element so consumers can attach DOM refs
 * (drag handles, scroll measurement, focus management, etc.).
 */
const Box = forwardRef(function Box(props, ref) {
  const {
    as: Component = 'div',
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    width,
    height,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    background,
    borderTop,
    borderBottom,
    borderColor = '#E0E0E0',
    overflow,
    display,
    style,
    children,
    ...rest
  } = props;
  const computed = {
    paddingTop: toPx(paddingTop ?? paddingY ?? padding),
    paddingBottom: toPx(paddingBottom ?? paddingY ?? padding),
    paddingLeft: toPx(paddingLeft ?? paddingX ?? padding),
    paddingRight: toPx(paddingRight ?? paddingX ?? padding),
    marginTop: toPx(marginTop ?? marginY ?? margin),
    marginBottom: toPx(marginBottom ?? marginY ?? margin),
    marginLeft: toPx(marginLeft ?? marginX ?? margin),
    marginRight: toPx(marginRight ?? marginX ?? margin),
    width: toPx(width),
    height: toPx(height),
    maxWidth: toPx(maxWidth),
    maxHeight: toPx(maxHeight),
    minWidth: toPx(minWidth),
    minHeight: toPx(minHeight),
    background,
    borderTop: borderTop ? `1px solid ${borderColor}` : undefined,
    borderBottom: borderBottom ? `1px solid ${borderColor}` : undefined,
    overflow,
    display,
    ...style,
  };
  return (
    <Component ref={ref} style={computed} {...rest}>
      {children}
    </Component>
  );
});

Box.displayName = 'Box';

export default Box;
