/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock the problematic dependencies before importing ContainerManager
jest.mock('../../utils/componentSizing', () => ({
  getCustomComponentSize: jest.fn(() => ({ width: 2, height: 2 })),
}));

jest.mock('../../utils/componentNaming', () => ({
  generateUniqueComponentName: jest.fn((type: string) => `test-${type}-${Date.now()}`),
}));

import { ContainerManager } from '../utils/ContainerManager';
import { ResponsiveComponent } from '../../rgl-integration/types';
import { WIDGETS } from '@m-next/runtime-interface';

describe('ContainerManager', () => {
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
    currentState: 0,
    containerId,
    static: false,
  });

  const createMockContainer = (
    id: string,
    x: number = 0,
    y: number = 0,
    width: number = 4,
    height: number = 4,
    maxChildren?: number,
  ): ResponsiveComponent => ({
    id,
    type: WIDGETS.LAYOUT_CONTAINER,
    x,
    y,
    width,
    height,
    content: `Container ${id}`,
    currentState: 0,
    containerId: null,
    static: false,
    container: {
      direction: 'column',
      children: [],
      wrap: true,
      gap: 4,
      alignItems: 'start',
      justifyContent: 'start',
      maxChildren,
    },
  });

  describe('validateContainerDrop', () => {
    it('should prevent containers inside containers', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.LAYOUT_CONTAINER, components);

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Containers cannot be placed inside other containers');
    });

    it('should prevent sections inside containers', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.SECTION, components);

      expect(result.isValid).toBe(false);
      expect(result.reason).toContain('Containers cannot be placed inside other containers');
    });

    it('should allow regular components in containers', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.BUTTON, components);

      expect(result.isValid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should enforce maxChildren limit', () => {
      const container = createMockContainer('container-1', 0, 0, 4, 4, 2);
      const components: ResponsiveComponent[] = [
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.BUTTON, 1, 0, 1, 1, 'container-1'),
      ];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.TEXTBOX, components);

      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Container is full (max 2 children)');
    });

    it('should allow drop when under maxChildren limit', () => {
      const container = createMockContainer('container-1', 0, 0, 4, 4, 3);
      const components: ResponsiveComponent[] = [
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.BUTTON, 1, 0, 1, 1, 'container-1'),
      ];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.TEXTBOX, components);

      expect(result.isValid).toBe(true);
    });

    it('should allow drop when no maxChildren is set', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.BUTTON, 1, 0, 1, 1, 'container-1'),
        createMockComponent('child-3', WIDGETS.BUTTON, 2, 0, 1, 1, 'container-1'),
      ];

      const result = ContainerManager.validateContainerDrop(container, WIDGETS.TEXTBOX, components);

      expect(result.isValid).toBe(true);
    });
  });

  describe('calculateContainerBounds', () => {
    it('should calculate bounds correctly for container at origin', () => {
      const container = createMockContainer('container-1', 0, 0, 4, 4);
      const colWidth = 100;
      const rowHeight = 50;
      const margin = 4;
      const containerPadding = 8;

      const bounds = ContainerManager.calculateContainerBounds(
        container,
        colWidth,
        rowHeight,
        margin,
        containerPadding,
      );

      expect(bounds.left).toBe(8); // containerPadding
      expect(bounds.top).toBe(8); // containerPadding
      expect(bounds.width).toBe(412); // 4 * 100 + 3 * 4 (margins between columns)
      expect(bounds.height).toBe(212); // 4 * 50 + 3 * 4 (margins between rows)
      expect(bounds.right).toBe(420); // left + width
      expect(bounds.bottom).toBe(220); // top + height
    });

    it('should calculate bounds correctly for offset container', () => {
      const container = createMockContainer('container-1', 2, 3, 4, 4);
      const colWidth = 100;
      const rowHeight = 50;
      const margin = 4;
      const containerPadding = 8;

      const bounds = ContainerManager.calculateContainerBounds(
        container,
        colWidth,
        rowHeight,
        margin,
        containerPadding,
      );

      // left = padding + x * (colWidth + margin) = 8 + 2 * 104 = 216
      expect(bounds.left).toBe(216);
      // top = padding + y * (rowHeight + margin) = 8 + 3 * 54 = 170
      expect(bounds.top).toBe(170);
      expect(bounds.width).toBe(412);
      expect(bounds.height).toBe(212);
    });

    it('should handle small containers correctly', () => {
      const container = createMockContainer('container-1', 0, 0, 1, 1);
      const colWidth = 100;
      const rowHeight = 50;

      const bounds = ContainerManager.calculateContainerBounds(container, colWidth, rowHeight);

      expect(bounds.width).toBe(100); // 1 * 100 + 0 margins
      expect(bounds.height).toBe(50); // 1 * 50 + 0 margins
    });
  });

  describe('isPointWithinContainer', () => {
    const containerBounds = {
      left: 100,
      top: 100,
      right: 400,
      bottom: 300,
      width: 300,
      height: 200,
    };

    it('should return true for point inside container', () => {
      expect(ContainerManager.isPointWithinContainer(200, 150, containerBounds)).toBe(true);
      expect(ContainerManager.isPointWithinContainer(300, 250, containerBounds)).toBe(true);
    });

    it('should return true for point on container boundaries', () => {
      expect(ContainerManager.isPointWithinContainer(100, 100, containerBounds)).toBe(true); // top-left corner
      expect(ContainerManager.isPointWithinContainer(400, 300, containerBounds)).toBe(true); // bottom-right corner
      expect(ContainerManager.isPointWithinContainer(250, 100, containerBounds)).toBe(true); // top edge
      expect(ContainerManager.isPointWithinContainer(100, 200, containerBounds)).toBe(true); // left edge
    });

    it('should return false for point outside container', () => {
      expect(ContainerManager.isPointWithinContainer(50, 150, containerBounds)).toBe(false); // left of container
      expect(ContainerManager.isPointWithinContainer(450, 150, containerBounds)).toBe(false); // right of container
      expect(ContainerManager.isPointWithinContainer(200, 50, containerBounds)).toBe(false); // above container
      expect(ContainerManager.isPointWithinContainer(200, 350, containerBounds)).toBe(false); // below container
    });
  });

  describe('detectDropTarget', () => {
    it('should detect container as drop target when dropping inside', () => {
      const container = createMockContainer('container-1', 0, 0, 12, 12); // Much larger container
      const components: ResponsiveComponent[] = [container];

      // Drop point at (200, 160) with colWidth=80, rowHeight=40
      // Large container easily contains this point with badge offset applied.
      const result = ContainerManager.detectDropTarget(200, 160, WIDGETS.BUTTON, components, 80, 40);

      expect(result.type).toBe('container');
      expect(result.containerId).toBe('container-1');
      expect(result.validDrop).toBe(true);
    });

    it('should allow drops near container edges for palette items', () => {
      const container = createMockContainer('container-1', 0, 0, 12, 12);
      const components: ResponsiveComponent[] = [container];

      const result = ContainerManager.detectDropTarget(12, 20, WIDGETS.BUTTON, components, 80, 40, undefined, {
        width: 1,
        height: 1,
      });

      expect(result.type).toBe('container');
      expect(result.containerId).toBe('container-1');
      expect(result.validDrop).toBe(true);
    });

    it('should detect canvas as drop target when dropping outside containers', () => {
      const container = createMockContainer('container-1', 0, 0, 4, 4);
      const components: ResponsiveComponent[] = [container];

      // Drop point far outside container bounds
      const result = ContainerManager.detectDropTarget(1000, 1000, WIDGETS.BUTTON, components, 80, 40);

      expect(result.type).toBe('canvas');
      expect(result.validDrop).toBe(true);
      expect(result.containerId).toBeUndefined();
    });

    it('should detect invalid drop when trying to drop container in container', () => {
      const container = createMockContainer('container-1', 0, 0, 12, 12); // Much larger container
      const components: ResponsiveComponent[] = [container];

      // Large container easily contains this drop point
      const result = ContainerManager.detectDropTarget(200, 160, WIDGETS.LAYOUT_CONTAINER, components, 80, 40);

      expect(result.type).toBe('container');
      expect(result.validDrop).toBe(false);
      expect(result.reason).toBe('Containers cannot be placed inside other containers');
    });

    it('should check multiple containers and find the correct one', () => {
      const container1 = createMockContainer('container-1', 0, 0, 6, 6); // Larger containers
      const container2 = createMockContainer('container-2', 8, 8, 6, 6); // Further apart
      const components: ResponsiveComponent[] = [container1, container2];

      // Drop well inside container2's bounds
      const result = ContainerManager.detectDropTarget(800, 400, WIDGETS.BUTTON, components, 80, 40);

      expect(result.type).toBe('container');
      expect(result.containerId).toBe('container-2');
    });
  });

  describe('getChildComponents', () => {
    it('should return all children of a container', () => {
      const components: ResponsiveComponent[] = [
        createMockContainer('container-1'),
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
        createMockComponent('child-2', WIDGETS.TEXTBOX, 1, 0, 1, 1, 'container-1'),
        createMockComponent('child-3', WIDGETS.BUTTON, 0, 0, 1, 1, null), // not in container
      ];

      const children = ContainerManager.getChildComponents('container-1', components);

      expect(children).toHaveLength(2);
      expect(children[0]!.id).toBe('child-1');
      expect(children[1]!.id).toBe('child-2');
    });

    it('should return empty array for container with no children', () => {
      const components: ResponsiveComponent[] = [
        createMockContainer('container-1'),
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, null),
      ];

      const children = ContainerManager.getChildComponents('container-1', components);

      expect(children).toHaveLength(0);
    });

    it('should return empty array for non-existent container', () => {
      const components: ResponsiveComponent[] = [createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, null)];

      const children = ContainerManager.getChildComponents('non-existent', components);

      expect(children).toHaveLength(0);
    });
  });

  describe('isContainerEmpty', () => {
    it('should return true for empty container', () => {
      const components: ResponsiveComponent[] = [createMockContainer('container-1')];

      expect(ContainerManager.isContainerEmpty('container-1', components)).toBe(true);
    });

    it('should return false for container with children', () => {
      const components: ResponsiveComponent[] = [
        createMockContainer('container-1'),
        createMockComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1'),
      ];

      expect(ContainerManager.isContainerEmpty('container-1', components)).toBe(false);
    });
  });

  describe('calculateRelativePosition', () => {
    const containerBounds = {
      left: 100,
      top: 100,
      right: 400,
      bottom: 300,
      width: 300,
      height: 200,
    };

    it('should calculate relative grid position correctly', () => {
      const colWidth = 50;
      const rowHeight = 40;
      const margin = 4;

      // Drop at (154, 144) relative to canvas
      // Relative to container: (54, 44)
      // Grid position: x = floor(54 / 54) = 1, y = floor(44 / 44) = 1
      const result = ContainerManager.calculateRelativePosition(154, 144, containerBounds, colWidth, rowHeight, margin);

      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
    });

    it('should never return negative positions', () => {
      const colWidth = 50;
      const rowHeight = 40;

      // Drop at container edge
      const result = ContainerManager.calculateRelativePosition(100, 100, containerBounds, colWidth, rowHeight);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('should handle drops at container origin', () => {
      const colWidth = 50;
      const rowHeight = 40;

      const result = ContainerManager.calculateRelativePosition(100, 100, containerBounds, colWidth, rowHeight);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  describe('validateContainerConfig', () => {
    it('should validate correct container config', () => {
      const config = {
        direction: 'column',
        maxChildren: 5,
        gap: 4,
      };

      const result = ContainerManager.validateContainerConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid direction', () => {
      const config = {
        direction: 'invalid',
      };

      const result = ContainerManager.validateContainerConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid direction: must be row, column, row-reverse, or column-reverse');
    });

    it('should reject invalid maxChildren', () => {
      const config = {
        direction: 'column',
        maxChildren: -1,
      };

      const result = ContainerManager.validateContainerConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('maxChildren must be a positive number');
    });

    it('should reject invalid gap', () => {
      const config = {
        direction: 'column',
        gap: -5,
      };

      const result = ContainerManager.validateContainerConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('gap must be a non-negative number');
    });

    it('should collect multiple errors', () => {
      const config = {
        direction: 'invalid',
        maxChildren: -1,
        gap: -5,
      };

      const result = ContainerManager.validateContainerConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('createDefaultContainerConfig', () => {
    it('should create valid default config', () => {
      const config = ContainerManager.createDefaultContainerConfig();

      expect(config.direction).toBe('column');
      expect(config.children).toEqual([]);
      expect(config.wrap).toBe(true);
      expect(config.gap).toBe(4);
      expect(config.alignItems).toBe('start');
      expect(config.justifyContent).toBe('start');
      expect(config.maxChildren).toBeUndefined();
    });
  });

  describe('isContainer', () => {
    it('should return true for LAYOUT_CONTAINER', () => {
      const container = createMockContainer('container-1');
      expect(ContainerManager.isContainer(container)).toBe(true);
    });

    it('should return true for SECTION', () => {
      const section = createMockComponent('section-1', WIDGETS.SECTION);
      expect(ContainerManager.isContainer(section)).toBe(true);
    });

    it('should return false for regular components', () => {
      const button = createMockComponent('button-1', WIDGETS.BUTTON);
      expect(ContainerManager.isContainer(button)).toBe(false);
    });
  });

  describe('moveComponentBetweenContainers', () => {
    it('should move component from main canvas to container', () => {
      const container = createMockContainer('container-1');
      const component = createMockComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);
      const components: ResponsiveComponent[] = [container, component];

      const onComponentsChange = jest.fn();

      ContainerManager.moveComponentBetweenContainers(
        'comp-1',
        null, // from main canvas
        'container-1', // to container
        components,
        onComponentsChange,
      );

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];

      // Find the moved component
      const movedComponent = updatedComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(movedComponent).toBeDefined();
      expect(movedComponent.containerId).toBe('container-1');
    });

    it('should move component from container to main canvas', () => {
      const container = createMockContainer('container-1');
      const component = createMockComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');
      const components: ResponsiveComponent[] = [container, component];

      const onComponentsChange = jest.fn();

      ContainerManager.moveComponentBetweenContainers(
        'comp-1',
        'container-1', // from container
        null, // to main canvas
        components,
        onComponentsChange,
      );

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];

      const movedComponent = updatedComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(movedComponent).toBeDefined();
      expect(movedComponent.containerId).toBeNull();
    });

    it('should move component between two containers', () => {
      const container1 = createMockContainer('container-1');
      const container2 = createMockContainer('container-2');
      const component = createMockComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');
      const components: ResponsiveComponent[] = [container1, container2, component];

      const onComponentsChange = jest.fn();

      ContainerManager.moveComponentBetweenContainers(
        'comp-1',
        'container-1', // from container 1
        'container-2', // to container 2
        components,
        onComponentsChange,
      );

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];

      const movedComponent = updatedComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(movedComponent).toBeDefined();
      expect(movedComponent.containerId).toBe('container-2');
    });

    it('should do nothing when component is not found', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [container];

      const onComponentsChange = jest.fn();

      ContainerManager.moveComponentBetweenContainers(
        'non-existent',
        null,
        'container-1',
        components,
        onComponentsChange,
      );

      expect(onComponentsChange).not.toHaveBeenCalled();
    });
  });

  describe('handleNestedDrop', () => {
    afterEach(() => {
      // @ts-expect-error test cleanup
      delete (window as Record<string, unknown>).__draggedComponentType;
      // @ts-expect-error test cleanup
      delete (window as Record<string, unknown>).__draggedComponentConfig;
    });

    it('should add new component to container from palette', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [container];
      const onComponentsChange = jest.fn();

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          getData: jest.fn((key: string) => {
            if (key === 'componentType') return WIDGETS.BUTTON;
            return '';
          }),
        },
      } as any;

      ContainerManager.handleNestedDrop(mockEvent, 'container-1', components, onComponentsChange);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(onComponentsChange).toHaveBeenCalled();

      const updatedComponents = onComponentsChange.mock.calls[0][0];
      expect(updatedComponents).toHaveLength(2); // container + new component

      // Find the new component (it's the one that's not the container)
      const newComponent = updatedComponents.find((c: ResponsiveComponent) => c.id !== 'container-1');
      expect(newComponent).toBeDefined();
      expect(newComponent.type).toBe(WIDGETS.BUTTON);
      expect(newComponent.containerId).toBe('container-1');
    });

    it('should move existing component to container', () => {
      const container = createMockContainer('container-1');
      const component = createMockComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);
      const components: ResponsiveComponent[] = [container, component];
      const onComponentsChange = jest.fn();

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          getData: jest.fn((key: string) => {
            if (key === 'text/plain') return 'move:comp-1:main';
            return '';
          }),
        },
      } as any;

      ContainerManager.handleNestedDrop(mockEvent, 'container-1', components, onComponentsChange);

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];

      const movedComponent = updatedComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(movedComponent.containerId).toBe('container-1');
    });

    it('should create container when dropping on main canvas', () => {
      const components: ResponsiveComponent[] = [];
      const onComponentsChange = jest.fn();

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          getData: jest.fn((key: string) => {
            if (key === 'componentType') return WIDGETS.LAYOUT_CONTAINER;
            return '';
          }),
        },
      } as any;

      ContainerManager.handleNestedDrop(mockEvent, 'main', components, onComponentsChange);

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];

      // Find the new container (should be the only component)
      expect(updatedComponents).toHaveLength(1);
      const newContainer = updatedComponents[0];
      expect(newContainer).toBeDefined();
      expect(newContainer.type).toBe(WIDGETS.LAYOUT_CONTAINER);
      expect(newContainer.container).toBeDefined();
      expect(newContainer.containerId).toBe('main');
    });

    it('should add component using window drag globals when dataTransfer is missing', () => {
      const container = createMockContainer('container-1');
      const components: ResponsiveComponent[] = [container];
      const onComponentsChange = jest.fn();

      // @ts-expect-error test setup
      (window as Record<string, unknown>).__draggedComponentType = WIDGETS.BUTTON;
      // @ts-expect-error test setup
      (window as Record<string, unknown>).__draggedComponentConfig = JSON.stringify({ caption: 'My Button' });

      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: null,
      } as any;

      ContainerManager.handleNestedDrop(mockEvent, 'container-1', components, onComponentsChange);

      expect(onComponentsChange).toHaveBeenCalled();
      const updatedComponents = onComponentsChange.mock.calls[0][0];
      expect(updatedComponents).toHaveLength(2);

      const newComponent = updatedComponents.find((c: ResponsiveComponent) => c.id !== 'container-1');
      expect(newComponent).toBeDefined();
      expect(newComponent.type).toBe(WIDGETS.BUTTON);
      expect(newComponent.containerId).toBe('container-1');
      expect(newComponent.caption).toBe('My Button');
    });
  });

  describe('handleNestedDragOver', () => {
    it('should prevent default and set drag over state', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any;
      const setDragOverCanvas = jest.fn();

      ContainerManager.handleNestedDragOver(mockEvent, 'container-1', setDragOverCanvas);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(setDragOverCanvas).toHaveBeenCalledWith('container-1');
    });
  });

  describe('handleNestedDragLeave', () => {
    it('should prevent default and clear drag over state', () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any;
      const setDragOverCanvas = jest.fn();

      ContainerManager.handleNestedDragLeave(mockEvent, setDragOverCanvas);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(setDragOverCanvas).toHaveBeenCalledWith(null);
    });
  });

  describe('detectDragStopTarget', () => {
    it('detects another container when elementsFromPoint returns a nested child instead of the wrapper', () => {
      const draggedComponent = createMockComponent('comp-1', WIDGETS.BUTTON, 0, 0, 2, 2, 'container-1');

      const currentContainer = document.createElement('div');
      currentContainer.className = 'layout-container-wrapper';

      const targetWrapper = document.createElement('div');
      targetWrapper.className = 'layout-container-wrapper';
      targetWrapper.setAttribute('data-container-id', 'container-2');
      targetWrapper.setAttribute('data-container-cols', '8');
      targetWrapper.setAttribute('data-container-padding', '0');

      const targetDropZone = document.createElement('div');
      targetDropZone.className = 'layout-container-drop-zone';
      Object.defineProperty(targetDropZone, 'getBoundingClientRect', {
        value: () =>
          ({
            x: 0,
            y: 100,
            top: 100,
            left: 0,
            right: 320,
            bottom: 460,
            width: 320,
            height: 360,
            toJSON: () => ({}),
          }) as DOMRect,
      });

      const targetNestedLayout = document.createElement('div');
      targetNestedLayout.className = 'nested-layout';
      Object.defineProperty(targetNestedLayout, 'getBoundingClientRect', {
        value: () =>
          ({
            x: 0,
            y: 100,
            top: 100,
            left: 0,
            right: 320,
            bottom: 900, // overflowed nested content
            width: 320,
            height: 800,
            toJSON: () => ({}),
          }) as DOMRect,
      });

      const targetChild = document.createElement('div');
      targetChild.className = 'react-grid-item';
      targetNestedLayout.appendChild(targetChild);
      targetDropZone.appendChild(targetNestedLayout);
      targetWrapper.appendChild(targetDropZone);
      document.body.appendChild(targetWrapper);

      const originalElementsFromPoint = (document as any).elementsFromPoint;
      (document as any).elementsFromPoint = jest.fn(
        () => [targetChild, targetDropZone, document.body] as unknown as Element[],
      );

      try {
        const result = ContainerManager.detectDragStopTarget(
          new MouseEvent('mouseup', { clientX: 120, clientY: 180 }) as unknown as MouseEvent,
          draggedComponent,
          currentContainer,
          {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            right: 320,
            bottom: 90,
            width: 320,
            height: 90,
            toJSON: () => ({}),
          } as DOMRect,
          30,
          0,
          3,
        );

        expect(result).not.toBeNull();
        expect(result?.type).toBe('other-container');
        expect(result?.targetContainerId).toBe('container-2');
        expect(result?.position.y).toBeLessThanOrEqual(12);
      } finally {
        (document as any).elementsFromPoint = originalElementsFromPoint;
        document.body.removeChild(targetWrapper);
      }
    });
  });

  describe('getContainerStyleClasses', () => {
    it('should return correct classes for card style', () => {
      const classes = ContainerManager.getContainerStyleClasses('card');
      expect(classes).toContain('layout-container');
      expect(classes).toContain('container-card');
    });

    it('should return correct classes for panel style', () => {
      const classes = ContainerManager.getContainerStyleClasses('panel');
      expect(classes).toContain('layout-container');
      expect(classes).toContain('container-panel');
    });

    it('should return default classes for unknown style', () => {
      const classes = ContainerManager.getContainerStyleClasses('unknown');
      expect(classes).toContain('layout-container');
      expect(classes).toContain('container-default');
    });
  });
});
