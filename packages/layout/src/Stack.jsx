import React, { forwardRef } from 'react';
import { spacing } from '@m-next/tokens';
import Box from './Box';

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

/**
 * Stack — vertical flex container with consistent gap spacing.
 * Forwards refs to the underlying Box (which itself forwards to the
 * rendered HTML element).
 */
const Stack = forwardRef(function Stack(props, ref) {
  const { gap = 'md', align = 'stretch', style, children, ...rest } = props;
  return (
    <Box
      ref={ref}
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
});

Stack.displayName = 'Stack';

export default Stack;
