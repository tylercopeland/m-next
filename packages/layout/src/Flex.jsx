import React, { forwardRef } from 'react';
import { spacing } from '@m-next/tokens';
import Box from './Box';

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
};

const directionMap = {
  row: 'row',
  column: 'column',
  rowReverse: 'row-reverse',
  columnReverse: 'column-reverse',
};

/**
 * Flex — generic flex container with full direction/align/justify/wrap
 * control. Use Stack/Inline for the constrained common cases. Forwards
 * refs to the underlying Box.
 */
const Flex = forwardRef(function Flex(props, ref) {
  const {
    direction = 'row',
    gap,
    align,
    justify,
    wrap = false,
    style,
    children,
    ...rest
  } = props;
  return (
    <Box
      ref={ref}
      {...rest}
      style={{
        display: 'flex',
        flexDirection: directionMap[direction] || direction,
        gap: gap != null ? `${spacing[gap] ?? gap}px` : undefined,
        alignItems: align != null ? alignMap[align] || align : undefined,
        justifyContent: justify != null ? justifyMap[justify] || justify : undefined,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </Box>
  );
});

Flex.displayName = 'Flex';

export default Flex;
