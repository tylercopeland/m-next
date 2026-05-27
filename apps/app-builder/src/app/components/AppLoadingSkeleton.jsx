import React from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import { lightTheme } from '@m-next/styles';

const AppLoadingSkeleton = ({ variant = 'default', ...props }) => {
  const baseProps = {
    circle: false,
    duration: 1.4,
    ...props,
  };

  switch (variant) {
    case 'header':
      return <LoadingSkeleton count={1} width='100%' height='45px' {...baseProps} />;

    case 'content':
      return <LoadingSkeleton count={1} width='100%' height='100%' {...baseProps} />;

    case 'layout-designer':
      return (
        <Container
          id='layout-designer'
          isRound
          scrollable
          style={{ backgroundColor: lightTheme.background.page, padding: 16 }}
        >
          <LoadingSkeleton count={1} width='100%' height='600px' {...baseProps} />
        </Container>
      );

    default:
      return <LoadingSkeleton count={1} width='100%' height='45px' {...baseProps} />;
  }
};

export default AppLoadingSkeleton;
