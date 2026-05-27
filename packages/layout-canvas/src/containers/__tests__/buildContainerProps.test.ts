import React from 'react';
import { buildContainerProps, ContainerPropsContext } from '../utils/buildContainerProps';
import type { ResponsiveComponent } from '../../rgl-integration/types';
import type { CurrentStateValue } from '@m-next/types';
import { CurrentState } from '@m-next/types';

// Widget type constants
const WIDGET_TYPES = {
  BUTTON: 'BTN',
  LAYOUT_CONTAINER: 'L-CON',
  SECTION: 'SEC',
  TEXTBOX: 'TXT',
};

/** Helper to create a minimal ResponsiveComponent */
function makeComponent(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return {
    id: 'comp-1',
    type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'],
    x: 0,
    y: 2,
    width: 4,
    height: 2,
    content: 'Test',
    containerId: null,
    static: false,
    currentState: CurrentState.REGULAR as CurrentStateValue,
    ...overrides,
  };
}

function makeContainer(overrides: Partial<ResponsiveComponent> = {}): ResponsiveComponent {
  return makeComponent({
    id: 'container-1',
    type: WIDGET_TYPES.LAYOUT_CONTAINER as ResponsiveComponent['type'],
    width: 8,
    height: 12,
    container: {
      direction: 'column',
      children: [],
    },
    ...overrides,
  });
}

/** Create a minimal context for buildContainerProps */
function makeContext(overrides: Partial<ContainerPropsContext> = {}): ContainerPropsContext {
  return {
    components: [],
    componentsRef: { current: [] },
    isDraggable: true,
    isResizable: true,
    resolution: 'desktop',
    mode: 'designer',
    selectedComponentId: null,
    rowHeight: 30,
    showHiddenComponents: false,
    dragOverContainerId: null,
    onComponentClick: null,
    onComponentsChange: null,
    onLayoutV4Change: null,
    dragOverCanvas: null,
    onNestedDrop: undefined,
    onNestedDragOver: undefined,
    onNestedDragLeave: undefined,
    onComponentDragStart: undefined,
    clearAllDragStates: jest.fn(),
    ReactGridLayout: 'MockGridLayout' as unknown,
    ...overrides,
  };
}

const mockRenderComponent = (_component: ResponsiveComponent) => React.createElement('div', null, 'mock');

describe('buildContainerProps', () => {
  describe('non-container components', () => {
    it('returns an empty object for a BUTTON', () => {
      const component = makeComponent({ type: WIDGET_TYPES.BUTTON as ResponsiveComponent['type'] });
      const result = buildContainerProps(component, makeContext(), mockRenderComponent);
      expect(result).toEqual({});
    });

    it('returns an empty object for a TEXTBOX', () => {
      const component = makeComponent({ type: WIDGET_TYPES.TEXTBOX as ResponsiveComponent['type'] });
      const result = buildContainerProps(component, makeContext(), mockRenderComponent);
      expect(result).toEqual({});
    });
  });

  describe('container components', () => {
    it('returns container props for LAYOUT_CONTAINER', () => {
      const container = makeContainer();
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);
      expect(result).toHaveProperty('container');
      expect(result).toHaveProperty('childComponents');
      expect(result).toHaveProperty('isEmpty');
    });

    it('returns container props for SECTION', () => {
      const section = makeContainer({ type: WIDGET_TYPES.SECTION as ResponsiveComponent['type'] });
      const result = buildContainerProps(section, makeContext(), mockRenderComponent);
      expect(result).toHaveProperty('container');
      expect(result).toHaveProperty('childComponents');
    });
  });

  describe('child components', () => {
    it('includes child components that belong to the container', () => {
      const container = makeContainer({ id: 'container-1' });
      const child1 = makeComponent({ id: 'child-1', containerId: 'container-1' });
      const child2 = makeComponent({ id: 'child-2', containerId: 'container-1' });
      const unrelated = makeComponent({ id: 'other', containerId: null });

      const ctx = makeContext({ components: [container, child1, child2, unrelated] });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      const children = result.childComponents as ResponsiveComponent[];
      expect(children).toHaveLength(2);
      expect(children.map((c) => c.id)).toEqual(['child-1', 'child-2']);
    });

    it('returns empty childComponents for a container with no children', () => {
      const container = makeContainer({ id: 'container-1' });
      const ctx = makeContext({ components: [container] });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.childComponents).toEqual([]);
      expect(result.isEmpty).toBe(true);
    });

    it('sets isEmpty to false when container has children', () => {
      const container = makeContainer({ id: 'container-1' });
      const child = makeComponent({ id: 'child-1', containerId: 'container-1' });
      const ctx = makeContext({ components: [container, child] });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.isEmpty).toBe(false);
    });
  });

  describe('container numeric dimensions', () => {
    it('ensures container dimensions are numeric', () => {
      const container = makeContainer({
        width: '6' as unknown as number,
        height: '10' as unknown as number,
        x: '2' as unknown as number,
        y: '3' as unknown as number,
      });
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);

      const containerProp = result.container as ResponsiveComponent;
      expect(containerProp.width).toBe(6);
      expect(containerProp.height).toBe(10);
      expect(containerProp.x).toBe(2);
      expect(containerProp.y).toBe(3);
    });

    it('falls back to defaults for NaN dimensions', () => {
      const container = makeContainer({
        width: NaN,
        height: NaN,
        x: NaN,
        y: NaN,
      });
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);

      const containerProp = result.container as ResponsiveComponent;
      expect(containerProp.width).toBe(8);
      expect(containerProp.height).toBe(12);
      expect(containerProp.x).toBe(0);
      expect(containerProp.y).toBe(0);
    });
  });

  describe('passthrough props', () => {
    it('passes isDraggable, isResizable, mode, resolution', () => {
      const container = makeContainer();
      const ctx = makeContext({
        isDraggable: true,
        isResizable: false,
        mode: 'runtime',
        resolution: 'tablet',
      });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.isDraggable).toBe(true);
      expect(result.isResizable).toBe(false);
      expect(result.mode).toBe('runtime');
      expect(result.resolution).toBe('tablet');
    });

    it('passes selectedComponentId from context selectedComponentId', () => {
      const container = makeContainer();
      const ctx = makeContext({ selectedComponentId: 'some-child' });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.selectedComponentId).toBe('some-child');
    });

    it('passes rowHeight', () => {
      const container = makeContainer();
      const ctx = makeContext({ rowHeight: 25 });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.rowHeight).toBe(25);
    });

    it('passes containerConfig from component.container', () => {
      const containerConfig = { direction: 'row' as const, children: ['a', 'b'] };
      const container = makeContainer({ container: containerConfig });
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);

      expect(result.containerConfig).toBe(containerConfig);
    });

    it('passes compactType as null', () => {
      const container = makeContainer();
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);
      expect(result.compactType).toBeNull();
    });
  });

  describe('drag/drop callbacks in designer mode', () => {
    it('includes drag/drop callbacks when isDraggable is true', () => {
      const onNestedDrop = jest.fn();
      const onNestedDragOver = jest.fn();
      const onNestedDragLeave = jest.fn();
      const onComponentDragStart = jest.fn();

      const container = makeContainer();
      const ctx = makeContext({
        isDraggable: true,
        dragOverCanvas: 'some-canvas',
        onNestedDrop,
        onNestedDragOver,
        onNestedDragLeave,
        onComponentDragStart,
      });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.dragOverCanvas).toBe('some-canvas');
      expect(result.onNestedDrop).toBe(onNestedDrop);
      expect(result.onNestedDragOver).toBe(onNestedDragOver);
      expect(result.onNestedDragLeave).toBe(onNestedDragLeave);
      expect(result.onComponentDragStart).toBe(onComponentDragStart);
    });
  });

  describe('drag/drop callbacks in runtime mode', () => {
    it('sets drag callbacks to null/undefined when isDraggable is false', () => {
      const container = makeContainer();
      const ctx = makeContext({
        isDraggable: false,
        dragOverCanvas: 'some-canvas',
        onNestedDrop: jest.fn(),
        onNestedDragOver: jest.fn(),
        onNestedDragLeave: jest.fn(),
        onComponentDragStart: jest.fn(),
      });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.dragOverCanvas).toBeNull();
      expect(result.onNestedDrop).toBeUndefined();
      expect(result.onNestedDragOver).toBeUndefined();
      expect(result.onNestedDragLeave).toBeUndefined();
      expect(result.onComponentDragStart).toBeUndefined();
    });
  });

  describe('renderChildComponent', () => {
    it('passes the renderComponent function as renderChildComponent', () => {
      const container = makeContainer();
      const result = buildContainerProps(container, makeContext(), mockRenderComponent);

      expect(result.renderChildComponent).toBe(mockRenderComponent);
    });
  });

  describe('ReactGridLayout passthrough', () => {
    it('passes ReactGridLayout from context', () => {
      const MockRGL = () => null;
      const container = makeContainer();
      const ctx = makeContext({ ReactGridLayout: MockRGL });
      const result = buildContainerProps(container, ctx, mockRenderComponent);

      expect(result.ResponsiveGridLayout).toBe(MockRGL);
    });
  });

  describe('onNestedComponentsChange callback', () => {
    it('calls onComponentsChange with merged components when invoked', () => {
      const container = makeContainer({ id: 'container-1' });
      const child = makeComponent({ id: 'child-1', containerId: 'container-1', content: 'Original' });
      const components = [container, child];

      const onComponentsChange = jest.fn();
      const componentsRef = { current: components };

      const ctx = makeContext({
        components,
        componentsRef,
        onComponentsChange,
      });

      const result = buildContainerProps(container, ctx, mockRenderComponent);
      const onNestedComponentsChange = result.onNestedComponentsChange as (
        updatedChildren: ResponsiveComponent[],
      ) => void;

      // Simulate child update from inside container
      const updatedChild = { ...child, content: 'Updated' };
      onNestedComponentsChange([updatedChild]);

      expect(onComponentsChange).toHaveBeenCalledTimes(1);
      const updatedComponents = onComponentsChange.mock.calls[0][0] as ResponsiveComponent[];
      const mergedChild = updatedComponents.find((c) => c.id === 'child-1');
      expect(mergedChild?.content).toBe('Updated');
    });

    it('does nothing when onComponentsChange is null', () => {
      const container = makeContainer({ id: 'container-1' });
      const ctx = makeContext({ onComponentsChange: null });

      const result = buildContainerProps(container, ctx, mockRenderComponent);
      const onNestedComponentsChange = result.onNestedComponentsChange as (
        updatedChildren: ResponsiveComponent[],
      ) => void;

      // Should not throw
      expect(() => onNestedComponentsChange([])).not.toThrow();
    });

    it('uses componentsRef.current for latest state', () => {
      const container = makeContainer({ id: 'container-1' });
      const child1 = makeComponent({ id: 'child-1', containerId: 'container-1', content: 'V1' });
      const child2 = makeComponent({ id: 'child-2', containerId: 'container-1', content: 'New' });

      const initialComponents = [container, child1];
      // Simulate a ref that has been updated with a new child since the callback was created
      const laterComponents = [container, child1, child2];

      const onComponentsChange = jest.fn();
      const componentsRef = { current: initialComponents };

      const ctx = makeContext({
        components: initialComponents,
        componentsRef,
        onComponentsChange,
      });

      const result = buildContainerProps(container, ctx, mockRenderComponent);

      // Simulate ref update (as would happen on re-render)
      componentsRef.current = laterComponents;

      const onNestedComponentsChange = result.onNestedComponentsChange as (
        updatedChildren: ResponsiveComponent[],
      ) => void;
      onNestedComponentsChange([{ ...child1, content: 'Updated' }]);

      // Should use laterComponents (from ref), not initialComponents
      const updatedComponents = onComponentsChange.mock.calls[0][0] as ResponsiveComponent[];
      expect(updatedComponents).toHaveLength(3); // container + child1 (updated) + child2
    });

    it('suppresses immediate layout echoes for container-to-canvas ejections', () => {
      jest.useFakeTimers();
      try {
        const container = makeContainer({ id: 'container-1' });
        const child = makeComponent({ id: 'child-1', containerId: 'container-1' });
        const components = [container, child];

        const onComponentsChange = jest.fn();
        const componentsRef = { current: components };
        const skipNextLayoutChangeRef = { current: false };
        const pendingTimeout = setTimeout(() => {}, 1000);
        const layoutChangeTimeoutRef = { current: pendingTimeout as ReturnType<typeof setTimeout> | null };
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const ctx = makeContext({
          components,
          componentsRef,
          onComponentsChange,
          skipNextLayoutChangeRef,
          layoutChangeTimeoutRef,
        });

        const result = buildContainerProps(container, ctx, mockRenderComponent);
        const onNestedComponentsChange = result.onNestedComponentsChange as (
          updatedChildren: ResponsiveComponent[],
        ) => void;

        onNestedComponentsChange([{ ...child, containerId: null, x: 6, y: 4 }]);

        expect(clearTimeoutSpy).toHaveBeenCalledWith(pendingTimeout);
        expect(layoutChangeTimeoutRef.current).toBeNull();
        expect(skipNextLayoutChangeRef.current).toBe(true);

        jest.advanceTimersByTime(200);
        expect(skipNextLayoutChangeRef.current).toBe(false);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('disabled state inheritance', () => {
    it('sets disabledParent on children when container is disabled', () => {
      const container = makeContainer({
        id: 'container-1',
        responsive: {
          desktop: {
            ...makeComponent(),
            currentState: CurrentState.DISABLED as CurrentStateValue,
          },
        },
      });
      const child = makeComponent({ id: 'child-1', containerId: 'container-1' });
      const ctx = makeContext({ components: [container, child] });

      const result = buildContainerProps(container, ctx, mockRenderComponent);
      const children = result.childComponents as ResponsiveComponent[];

      expect((children[0] as unknown as Record<string, unknown>).disabledParent).toBe(true);
    });
  });
});
