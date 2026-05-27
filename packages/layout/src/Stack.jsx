import React from 'react';
import { spacing } from '@m-next/tokens';
import Box from './Box';

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const Stack = ({ gap = 'md', align = 'stretch', style, children, ...rest }) => (
  <Box
    {...rest}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${spacing[gap] ?? gap}px`,
      alignItems: alignMap[align] || align,
      ...style,
    }}
  >
    {children}
  </Box>
);

export default Stack;
