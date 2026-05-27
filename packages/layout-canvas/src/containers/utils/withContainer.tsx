import React from 'react';
import type { ResponsiveComponent } from '../../rgl-integration/types';
import { ContainerManager } from './ContainerManager';
import { LayoutContainer } from '../LayoutContainer';
import type { LayoutContainerWrapperProps } from './containerMemoComparison';

/**
 * Higher-order component for container functionality.
 * Wraps a component so that if the given `container` prop is a container type,
 * it renders LayoutContainer instead of the wrapped component.
 */
export const withContainer = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return React.forwardRef<unknown, P & { container: ResponsiveComponent }>((props, ref) => {
    const { container, ...otherProps } = props;

    if (!ContainerManager.isContainer(container)) {
      return <WrappedComponent {...(otherProps as P)} ref={ref} />;
    }

    // For container components, we need to provide the required props
    const defaultProps: Partial<LayoutContainerWrapperProps> = {
      childComponents: [],
      onContainerClick: () => {},
      onChildClick: () => {},
      renderChildComponent: () => <div>Component</div>,
    };

    return (
      <LayoutContainer
        {...defaultProps}
        {...(otherProps as unknown as LayoutContainerWrapperProps)}
        container={container}
      />
    );
  });
};
