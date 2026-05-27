/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import { Grid as FluidGrid, useTheme } from '@mui/material';

// types
const propTypes = {
  isLoading: PropTypes.bool,
  appRibbonType: PropTypes.number,
  layout: PropTypes.instanceOf(Object),
  children: PropTypes.instanceOf(Object),
};

function ResponsiveCanvas({ isLoading, children}) {
  const theme = useTheme();
  return (
    <Container id='layout-designer' isRound scrollable style={{ backgroundColor: theme.background.page }}>
      {isLoading && <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
      {!isLoading && (
        <div style={{  padding: 16 }}>
          <FluidGrid container spacing={2} columns={{ xs: 4, sm: 6, md: 12 }}>
            {children}
          </FluidGrid>
        </div>
      )}
    </Container>
  );
}

ResponsiveCanvas.propTypes = propTypes;
export default ResponsiveCanvas;
