import React from 'react';
import { spacing } from '@m-next/tokens';

const toPx = (val) => {
  if (val == null) return undefined;
  if (typeof val === 'number') return `${val}px`;
  if (spacing[val] != null) return `${spacing[val]}px`;
  return val;
};

const Box = ({
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
}) => {
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
    <Component style={computed} {...rest}>
      {children}
    </Component>
  );
};

export default Box;
