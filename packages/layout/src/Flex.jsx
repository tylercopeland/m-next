import React from 'react';
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

const Flex = ({
  direction = 'row',
  gap,
  align,
  justify,
  wrap = false,
  style,
  children,
  ...rest
}) => (
  <Box
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

export default Flex;
