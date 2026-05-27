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
};

const Inline = ({
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
  children,
  ...rest
}) => (
  <Box
    {...rest}
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: `${spacing[gap] ?? gap}px`,
      alignItems: alignMap[align] || align,
      justifyContent: justifyMap[justify] || justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      ...style,
    }}
  >
    {children}
  </Box>
);

export default Inline;
