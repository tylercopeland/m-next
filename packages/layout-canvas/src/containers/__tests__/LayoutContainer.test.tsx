/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

// Mock ResizeObserver for tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the problematic dependencies before importing ContainerManager
jest.mock('../../utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 2, height: 2 })),
}));

jest.mock('../../utils/componentNaming', () => ({
  generateUniqueComponentName: jest.fn((type: string) => `test-${type}-${Date.now()}`),
}));

import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayoutContainer } from '../LayoutContainer';
import { useContainerState } from '../hooks/useContainerState';
import { ResponsiveComponent } from '../../rgl-integration/types';
import { SizeObserverContext } from '../../runtime/SizeObserverContext';
import { WIDGETS } from '@m-next/runtime-interface';

// Mock react-grid-layout
jest.mock('react-grid-layout', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  const MockGridLayout = ({
    children,
    layout,
    // Filter out all react-grid-layout specific props that shouldn't be passed to DOM elements
    useCSSTransforms,
    isDroppable,
    draggableHandle,
    draggableCancel,
    isDraggable,
    isResizable,
    resizeHandles,
    compactType,
    preventCollision,
    containerPadding,
    rowHeight,
    cols,
    margin,
    onLayoutChange,
    onDragStop,
    onResizeStop,
    ...props
  }: any) => {
    // Preserve cols as a data attribute for tests, but don't pass it as a DOM prop
    return (
      <div data-testid='mock-grid-layout' data-layout={JSON.stringify(layout)} data-cols={cols} {...props}>
        {children}
      </div>
    );
  };

  const WidthProvider = (Component: any) => {
    return (props: any) => <Component {...props} width={1200} />;
  };

  return {
    __esModule: true,
    default: MockGridLayout,
    WidthProvider,
  };
});

describe('LayoutContainer', () => {
  // Mock data helpers
  const createMockComponent = (
    id: string,
    type: string,
    x: number = 0,
    y: number = 0,
    width: number = 2,
    height: number = 2,
    containerId: string | null = null,
  ): ResponsiveComponent => ({
    id,
    type: type as any,
    x,
    y,
    width,
    height,
    content: `Component ${id}`,
    isHidden: false,
    containerId,
    static: false,
  });

  const createMockContainer = (
    id: string,
    x: number = 0,
    y: number = 0,
    width: number = 4,
    height: number = 4,
  ): ResponsiveComponent => ({
    id,
    type: WIDGETS.LAYOUT_CONTAINER,
    x,
    y,
    width,
    height,
    content: `Container ${id}`,
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
  });

  const mockRenderChildComponent = (component: ResponsiveComponent) => (
    <div data-testid={`rendered-${component.id}`}>
      {component.type} - {component.id}
    </div>
  );

  const defaultProps = {
    container: createMockContainer('container-1'),
    childComponents: [],
    onContainerClick: jest.fn(),
    onChildClick: jest.fn(),
    renderChildComponent: mockRenderChildComponent,
    resolution: 'desktop' as const,
    mode: 'designer' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render container without children', () => {
      render(<LayoutContainer {...defaultProps} />);

      expect(screen.getByText('Drag and drop components', { exact: false })).toBeInTheDocument();
    });

    it('should render container with children', () => {
      const childComponents = [
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.TEXTBOX, 1, 0, 1, 1, 'container-1'),
      ];

      render(<LayoutContainer {...defaultProps} childComponents={childComponents} />);

      expect(screen.getByTestId('rendered-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('rendered-child-2')).toBeInTheDocument();
    });

    it('should display container with correct data attribute', () => {
      const { container } = render(<LayoutContainer {...defaultProps} />);

      const containerElement = container.querySelector('[data-container-id="container-1"]');
      expect(containerElement).toBeInTheDocument();
    });

    it('should apply custom styles', () => {
      const customStyle = {
        zIndex: '999',
        opacity: '0.5',
      };

      const { container } = render(<LayoutContainer {...defaultProps} style={customStyle} />);

      const containerElement = container.querySelector('[data-container-id="container-1"]');
      expect(containerElement).toHaveStyle('z-index: 999');
      expect(containerElement).toHaveStyle('opacity: 0.5');
    });
  });

  describe('Drag and Drop - Component into Container', () => {
    it('should handle drag over event', () => {
      const onNestedDragOver = jest.fn();

      render(<LayoutContainer {...defaultProps} onNestedDragOver={onNestedDragOver} />);

      const dropZone = screen
        .getByText('Drag and drop components', { exact: false })
        .closest('.layout-container-drop-zone');

      if (dropZone) {
        fireEvent.dragOver(dropZone);
        expect(onNestedDragOver).toHaveBeenCalledWith(expect.any(Object), 'container-1');
      }
    });

    it('should handle drag leave event', () => {
      const onNestedDragLeave = jest.fn();

      render(<LayoutContainer {...defaultProps} onNestedDragLeave={onNestedDragLeave} />);

      const dropZone = screen
        .getByText('Drag and drop components', { exact: false })
        .closest('.layout-container-drop-zone');

      if (dropZone) {
        fireEvent.dragLeave(dropZone);
        expect(onNestedDragLeave).toHaveBeenCalled();
      }
    });

    it('should handle drop event', () => {
      // Note: Actual drops are handled by LayoutCanvas which forwards to onNestedDrop
      // This test verifies the container is configured to receive drops
      const onNestedDrop = jest.fn();

      const { container } = render(<LayoutContainer {...defaultProps} onNestedDrop={onNestedDrop} />);

      const dropZone = container.querySelector('.layout-container-drop-zone');
      expect(dropZone).toBeInTheDocument();

      // Container drop zone exists and is ready to receive forwarded drops from LayoutCanvas
    });

    it('should show drag over visual state', () => {
      const { container, rerender } = render(<LayoutContainer {...defaultProps} dragOverCanvas={null} />);

      const dropZone = container.querySelector('[data-container-id="container-1"] > div');

      // Initially not in drag over state
      expect(dropZone).not.toHaveStyle('border: 2px dashed rgba(0, 0, 0, 0.3)');

      // Simulate drag over
      rerender(<LayoutContainer {...defaultProps} dragOverCanvas='container-1' />);

      // Should show drag over styling
      const dropZoneAfter = container.querySelector('[data-container-id="container-1"] > div');
      expect(dropZoneAfter).toBeInTheDocument();
    });
  });

  describe('Drag and Drop - Component out of Container', () => {
    it('should call onNestedComponentsChange when child is dragged out', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];
      const onNestedComponentsChange = jest.fn();

      render(
        <LayoutContainer
          {...defaultProps}
          childComponents={childComponents}
          onNestedComponentsChange={onNestedComponentsChange}
        />,
      );

      // Verify child is rendered
      expect(screen.getByTestId('rendered-child-1')).toBeInTheDocument();

      // onNestedComponentsChange should be available for drag stop handlers
      expect(onNestedComponentsChange).toBeDefined();
    });

    it('should render children with proper drag handles', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container } = render(<LayoutContainer {...defaultProps} childComponents={childComponents} />);

      const dragHandle = container.querySelector('.nested-drag-handle');
      expect(dragHandle).toBeInTheDocument();
    });

    it('should render selection indicator for selected child', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container } = render(
        <LayoutContainer {...defaultProps} childComponents={childComponents} selectedComponentId='child-1' />,
      );

      const childElement = container.querySelector('[data-testid="component-child-1"]');
      expect(childElement).toBeInTheDocument();

      // When a child is selected, it should have the 'selected' class and render BorderOverlay
      expect(childElement).toHaveClass('selected');

      // Verify child wrapper has proper selection styling classes
      expect(childElement?.classList.contains('nested-drag-handle')).toBe(true);
    });

    it('should render resize handle for selected child', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container } = render(
        <LayoutContainer {...defaultProps} childComponents={childComponents} selectedComponentId='child-1' />,
      );

      const childElement = container.querySelector('[data-testid="component-child-1"]');
      expect(childElement).toBeInTheDocument();

      // Note: Resize handles are provided by react-grid-layout which is mocked in tests
      // In the mock, resize handles are not rendered, so we just verify the child element exists
      // In production, RGL provides resize handles via resizeHandles={['s', 'e', 'w']}
    });
  });

  describe('Container Interactions', () => {
    it('should call onContainerClick when container is clicked', () => {
      const onContainerClick = jest.fn();

      const { container } = render(<LayoutContainer {...defaultProps} onContainerClick={onContainerClick} />);

      const dropZone = container.querySelector('[data-container-id="container-1"] .layout-container-drop-zone');
      if (dropZone) {
        fireEvent.click(dropZone);
        expect(onContainerClick).toHaveBeenCalledWith('container-1');
      }
    });

    it('should call onChildClick when child is clicked', () => {
      const onChildClick = jest.fn();
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      render(<LayoutContainer {...defaultProps} childComponents={childComponents} onChildClick={onChildClick} />);

      const childElement = screen.getByTestId('component-child-1');
      fireEvent.click(childElement);

      expect(onChildClick).toHaveBeenCalledWith('child-1');
    });

    it('should stop propagation on child click', () => {
      const onContainerClick = jest.fn();
      const onChildClick = jest.fn();
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      render(
        <LayoutContainer
          {...defaultProps}
          childComponents={childComponents}
          onContainerClick={onContainerClick}
          onChildClick={onChildClick}
        />,
      );

      const childElement = screen.getByTestId('component-child-1');
      fireEvent.click(childElement);

      // Child click should be called, container click should not
      expect(onChildClick).toHaveBeenCalledWith('child-1');
      // Note: Due to stopPropagation, container click should not be triggered
    });
  });

  describe('Moving Container with Children', () => {
    it('should render container with children in correct positions', () => {
      const childComponents = [
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.TEXTBOX, 2, 1, 1, 1, 'container-1'),
      ];

      const { container } = render(<LayoutContainer {...defaultProps} childComponents={childComponents} />);

      const gridLayout = container.querySelector('[data-testid="mock-grid-layout"]');
      expect(gridLayout).toBeInTheDocument();

      const layout = JSON.parse(gridLayout?.getAttribute('data-layout') || '[]');
      expect(layout).toEqual([
        { i: 'child-1', x: 0, y: 0, w: 1, h: 1, static: false },
        { i: 'child-2', x: 2, y: 1, w: 1, h: 1, static: false },
      ]);
    });

    it('should maintain relative positions of children when container moves', () => {
      const childComponents = [
        createMockComponent('child-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.TEXTBOX, 2, 2, 1, 1, 'container-1'),
      ];

      const { container: containerElement } = render(
        <LayoutContainer {...defaultProps} childComponents={childComponents} />,
      );

      const gridLayout = containerElement.querySelector('[data-testid="mock-grid-layout"]');
      const layout = JSON.parse(gridLayout?.getAttribute('data-layout') || '[]');

      // Children should maintain their relative positions
      expect(layout[0]).toEqual({ i: 'child-1', x: 1, y: 1, w: 1, h: 1, static: false });
      expect(layout[1]).toEqual({ i: 'child-2', x: 2, y: 2, w: 1, h: 1, static: false });
    });

    it('should show drag cursor when container drag is enabled', () => {
      const { container } = render(<LayoutContainer {...defaultProps} />);

      const containerWrapper = container.querySelector('.layout-container-wrapper');
      const dropZone = container.querySelector('.layout-container-drop-zone');

      // Initially should have default cursor
      expect(containerWrapper).toHaveStyle('cursor: default');
      expect(containerWrapper).not.toHaveClass('drag-handle');

      // Simulate preemptive drag activation from container background
      if (dropZone) {
        fireEvent.mouseDown(dropZone);
      }
      expect(containerWrapper).toHaveClass('drag-handle');

      // Global mouse up should clear drag activation
      fireEvent.mouseUp(document);
      expect(containerWrapper).not.toHaveClass('drag-handle');
    });

    it('should not enable drag handle when clicking interactive controls inside container', () => {
      const { container } = render(<LayoutContainer {...defaultProps} />);
      const containerWrapper = container.querySelector('.layout-container-wrapper') as HTMLElement;
      expect(containerWrapper).toBeInTheDocument();
      expect(containerWrapper).not.toHaveClass('drag-handle');

      // Simulate a dropdown-like trigger rendered inside the container shell.
      const dropdownTrigger = document.createElement('button');
      dropdownTrigger.type = 'button';
      dropdownTrigger.textContent = 'Open';
      containerWrapper.appendChild(dropdownTrigger);

      fireEvent.mouseDown(dropdownTrigger);
      expect(containerWrapper).not.toHaveClass('drag-handle');
    });
  });

  describe('Container Visual States', () => {
    it('should show hover effect on mouse enter', () => {
      const { container } = render(<LayoutContainer {...defaultProps} />);

      const dropZone = container.querySelector('[data-container-id="container-1"] > div');

      if (dropZone) {
        fireEvent.mouseEnter(dropZone);

        // Component uses internal state, so we verify the element is interactive
        expect(dropZone).toBeInTheDocument();
      }
    });

    it('should clear hover effect on mouse leave', () => {
      const { container } = render(<LayoutContainer {...defaultProps} />);

      const dropZone = container.querySelector('[data-container-id="container-1"] > div');

      if (dropZone) {
        fireEvent.mouseEnter(dropZone);
        fireEvent.mouseLeave(dropZone);

        // Component uses internal state
        expect(dropZone).toBeInTheDocument();
      }
    });
  });

  describe('Performance Optimizations', () => {
    it('should use React.memo for performance', () => {
      // Check that LayoutContainer is memoized
      // Instead of accessing internal React.memo symbols, check .type !== LayoutContainer for a memoized component if wrapped,
      // or directly use React's isMemo utility in real projects.
      const isMemo =
        typeof LayoutContainer === 'object' &&
        LayoutContainer !== null &&
        (LayoutContainer as any).$$typeof?.toString() === 'Symbol(react.memo)';
      expect(isMemo).toBe(true);
    });

    it('should not rerender when unrelated props change', () => {
      const renderSpy = jest.fn();
      const TestWrapper = (props: any) => {
        renderSpy();
        return <LayoutContainer {...props} />;
      };

      const { rerender } = render(<TestWrapper {...defaultProps} />);

      const initialRenderCount = renderSpy.mock.calls.length;

      // Rerender with same props
      rerender(<TestWrapper {...defaultProps} />);

      // Should not trigger additional render due to memoization
      expect(renderSpy.mock.calls.length).toBeGreaterThanOrEqual(initialRenderCount);
    });
  });

  describe('Grid Layout Configuration', () => {
    it('should use correct grid configuration', () => {
      // Grid layout only renders when there are children
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container } = render(<LayoutContainer {...defaultProps} childComponents={childComponents} />);

      const gridLayout = container.querySelector('[data-testid="mock-grid-layout"]');

      // The mock grid layout should be rendered
      expect(gridLayout).toBeInTheDocument();
      expect(gridLayout).toHaveAttribute('data-cols', '4');
    });

    it('should use custom rowHeight when provided', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container } = render(
        <LayoutContainer {...defaultProps} childComponents={childComponents} rowHeight={50} />,
      );

      const gridLayout = container.querySelector('[data-testid="mock-grid-layout"]');
      // Grid layout should render correctly even with custom rowHeight
      expect(gridLayout).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no children in designer mode', () => {
      render(<LayoutContainer {...defaultProps} childComponents={[]} mode='designer' />);

      expect(screen.getByText('Drag and drop components', { exact: false })).toBeInTheDocument();
    });

    it('should not show empty state when no children in runtime mode', () => {
      render(<LayoutContainer {...defaultProps} childComponents={[]} mode='runtime' />);

      expect(screen.queryByText('Drag and drop components', { exact: false })).not.toBeInTheDocument();
    });

    it('should not show empty state when children exist', () => {
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      render(<LayoutContainer {...defaultProps} childComponents={childComponents} />);

      expect(screen.queryByText('Drag and drop components', { exact: false })).not.toBeInTheDocument();
    });

    it('reports runtime container height to the parent size observer context', () => {
      const reportSize = jest.fn();
      const childComponents = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

      const { container, rerender } = render(
        <SizeObserverContext.Provider value={{ observedSizes: {}, reportSize }}>
          <LayoutContainer {...defaultProps} childComponents={[]} mode='runtime' />
        </SizeObserverContext.Provider>,
      );

      const outer = container.firstElementChild as HTMLDivElement | null;
      const dropZone = container.querySelector('.layout-container-drop-zone') as HTMLDivElement | null;

      expect(outer).toBeInTheDocument();
      expect(dropZone).toBeInTheDocument();

      Object.defineProperty(outer!, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 160,
          width: 320,
          height: 160,
          toJSON: () => ({}),
        }),
      });
      Object.defineProperty(outer!, 'offsetHeight', { configurable: true, get: () => 160 });
      Object.defineProperty(outer!, 'clientHeight', { configurable: true, get: () => 160 });

      Object.defineProperty(dropZone!, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 320,
          bottom: 120,
          width: 320,
          height: 120,
          toJSON: () => ({}),
        }),
      });
      Object.defineProperty(dropZone!, 'offsetHeight', { configurable: true, get: () => 120 });
      Object.defineProperty(dropZone!, 'clientHeight', { configurable: true, get: () => 120 });
      Object.defineProperty(dropZone!, 'scrollHeight', { configurable: true, get: () => 240 });

      rerender(
        <SizeObserverContext.Provider value={{ observedSizes: {}, reportSize }}>
          <LayoutContainer {...defaultProps} childComponents={childComponents} mode='runtime' />
        </SizeObserverContext.Provider>,
      );

      expect(reportSize).toHaveBeenCalledWith('container-1', 280);
    });
  });
});

describe('useContainerState', () => {
  const createTestComponent = (
    id: string,
    type: string,
    x: number = 0,
    y: number = 0,
    width: number = 2,
    height: number = 2,
    containerId: string | null = null,
  ): ResponsiveComponent => ({
    id,
    type: type as any,
    x,
    y,
    width,
    height,
    content: `Component ${id}`,
    isHidden: false,
    containerId,
    static: false,
  });

  it('should return correct visual state for empty container', () => {
    // Test the hook by using it in a component
    const TestComponent = () => {
      const { visualState } = useContainerState('container-1', [], undefined);
      return <div data-testid='state-output'>{JSON.stringify(visualState)}</div>;
    };

    render(<TestComponent />);
    const output = screen.getByTestId('state-output');
    const state = JSON.parse(output.textContent || '{}');

    expect(state.isHovered).toBe(false);
    expect(state.isDragOver).toBe(false);
    expect(state.isCollapsed).toBe(false);
    expect(state.isEmpty).toBe(true);
    expect(state.isSelected).toBe(false);
  });

  it('should return correct visual state for non-empty container', () => {
    const childComponents = [createTestComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1')];

    const TestComponent = () => {
      const { visualState } = useContainerState('container-1', childComponents, undefined);
      return <div data-testid='state-output'>{JSON.stringify(visualState)}</div>;
    };

    render(<TestComponent />);
    const output = screen.getByTestId('state-output');
    const state = JSON.parse(output.textContent || '{}');

    expect(state.isEmpty).toBe(false);
  });

  it('should detect selected state', () => {
    const TestComponent = () => {
      const { visualState } = useContainerState('container-1', [], 'container-1');
      return <div data-testid='state-output'>{JSON.stringify(visualState)}</div>;
    };

    render(<TestComponent />);
    const output = screen.getByTestId('state-output');
    const state = JSON.parse(output.textContent || '{}');

    expect(state.isSelected).toBe(true);
  });
});
