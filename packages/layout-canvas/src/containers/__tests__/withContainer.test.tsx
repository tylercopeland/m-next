/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// Mock ResizeObserver for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('../../utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 2, height: 2 })),
}));

jest.mock('../../utils/componentNaming', () => ({
  generateUniqueComponentName: jest.fn((type: string) => `test-${type}-${Date.now()}`),
}));

// Mock react-grid-layout
jest.mock('react-grid-layout', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  const MockGridLayout = ({ children, layout, ...props }: any) => (
    <div data-testid='mock-grid-layout' data-layout={JSON.stringify(layout)} {...props}>
      {children}
    </div>
  );

  const WidthProvider = (Component: any) => (props: any) => <Component {...props} width={1200} />;

  return { __esModule: true, default: MockGridLayout, WidthProvider };
});

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { withContainer } from '../utils/withContainer';
import { WIDGETS } from '@m-next/runtime-interface';
import type { ResponsiveComponent } from '../../rgl-integration/types';

describe('withContainer', () => {
  const MockComponent = React.forwardRef<HTMLDivElement, any>((props, ref) => (
    <div ref={ref} data-testid='mock-wrapped'>
      Wrapped Component
    </div>
  ));
  MockComponent.displayName = 'MockComponent';

  it('should render LayoutContainer when component is a container', () => {
    const Enhanced = withContainer(MockComponent);

    const container: ResponsiveComponent = {
      id: 'c1',
      type: WIDGETS.LAYOUT_CONTAINER,
      x: 0,
      y: 0,
      width: 8,
      height: 12,
      content: '',
      isHidden: false,
      containerId: null,
      static: false,
      container: {
        direction: 'column',
        children: [],
        wrap: true,
        gap: 4,
        alignItems: 'start',
        justifyContent: 'start',
      },
    };

    render(
      <Enhanced
        container={container}
        childComponents={[]}
        onContainerClick={jest.fn()}
        onChildClick={jest.fn()}
        renderChildComponent={jest.fn()}
        resolution='desktop'
        mode='designer'
      />,
    );

    // Should render LayoutContainer (with empty state text), not the wrapped component
    expect(screen.getByText('Drag and drop components', { exact: false })).toBeInTheDocument();
    expect(screen.queryByTestId('mock-wrapped')).not.toBeInTheDocument();
  });

  it('should render wrapped component when component is not a container', () => {
    const Enhanced = withContainer(MockComponent);

    const nonContainer: ResponsiveComponent = {
      id: 'btn-1',
      type: 'BTN' as any,
      x: 0,
      y: 0,
      width: 2,
      height: 2,
      content: '',
      isHidden: false,
      containerId: null,
      static: false,
    };

    render(<Enhanced container={nonContainer} />);

    expect(screen.getByTestId('mock-wrapped')).toBeInTheDocument();
    expect(screen.queryByText('Drag and drop components', { exact: false })).not.toBeInTheDocument();
  });
});
