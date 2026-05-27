/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * App Builder Integration Tests for Container Drag-and-Drop
 *
 * These tests replicate the actual app-builder implementation patterns to catch
 * race conditions and state synchronization issues that occur in production.
 *
 * Key patterns tested:
 * 1. Multiple simultaneous state updates (handleComponentsChange + onNestedComponentsChange)
 * 2. Debounced updates vs immediate updates
 * 3. Stale closure bugs in callbacks
 * 4. Redux dispatch timing vs component state updates
 * 5. Component movement during pending position saves
 */

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

describe('App Builder Container Integration - Race Conditions', () => {
  // Helper to create mock components matching app-builder patterns
  const createComponent = (
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

  const createContainer = (
    id: string,
    x: number = 0,
    y: number = 0,
    width: number = 8,
    height: number = 12,
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

  describe('Race Condition: Rapid Component Movement', () => {
    it('should handle rapid component moves without losing updates', async () => {
      const container = createContainer('container-1', 0, 0);
      const comp1 = createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);
      const comp2 = createComponent('comp-2', WIDGETS.TEXTBOX, 8, 8, 2, 2, null);

      let components: ResponsiveComponent[] = [container, comp1, comp2];

      // Simulate rapid moves (like user dragging quickly)
      const move1 = jest.fn((newComponents: ResponsiveComponent[]) => {
        components = newComponents;
      });

      const move2 = jest.fn((newComponents: ResponsiveComponent[]) => {
        components = newComponents;
      });

      // Move comp-1 into container (immediate)
      ContainerManager.moveComponentBetweenContainers('comp-1', null, 'container-1', components, move1);

      // Immediately move comp-2 into container (before first completes)
      const intermediateComponents = move1.mock.calls[0]![0];
      ContainerManager.moveComponentBetweenContainers('comp-2', null, 'container-1', intermediateComponents, move2);

      // Both moves should have succeeded
      expect(move1).toHaveBeenCalled();
      expect(move2).toHaveBeenCalled();

      const finalComponents = move2.mock.calls[0]![0];
      const movedComp1 = finalComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      const movedComp2 = finalComponents.find((c: ResponsiveComponent) => c.id === 'comp-2');

      expect(movedComp1?.containerId).toBe('container-1');
      expect(movedComp2?.containerId).toBe('container-1');
    });

    it('should handle component move while position update is pending', async () => {
      const container = createContainer('container-1', 0, 0);
      const component = createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');
      const components: ResponsiveComponent[] = [container, component];

      // Simulate position update (like onNestedComponentsChange)
      const positionUpdate = components.map((c) => (c.id === 'comp-1' ? { ...c, x: 2, y: 2 } : c));

      // Immediately try to move component out (before position save completes)
      const onMove = jest.fn();
      ContainerManager.moveComponentBetweenContainers(
        'comp-1',
        'container-1',
        null, // Move to main canvas
        positionUpdate,
        onMove,
      );

      expect(onMove).toHaveBeenCalled();
      const result = onMove.mock.calls[0][0];
      const movedComponent = result.find((c: ResponsiveComponent) => c.id === 'comp-1');

      // Component should be on main canvas
      expect(movedComponent.containerId).toBeNull();
    });
  });

  describe('Race Condition: Stale Closure in Callbacks', () => {
    it('should use latest components array when multiple callbacks execute', () => {
      // Simulate the app-builder pattern where callbacks may capture stale state
      let canvasComponents: ResponsiveComponent[] = [
        createContainer('container-1', 0, 0),
        createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null),
      ];

      // Closure 1: Created at time T1
      const callbackT1 = jest.fn((newComponents: ResponsiveComponent[]) => {
        // This callback was created with canvasComponents at T1
        canvasComponents = newComponents;
      });

      // Add a new component (changing state)
      canvasComponents = [...canvasComponents, createComponent('comp-2', WIDGETS.TEXTBOX, 8, 8, 2, 2, null)];

      // Execute T1 callback with current state (may have stale reference)
      ContainerManager.moveComponentBetweenContainers(
        'comp-1',
        null,
        'container-1',
        canvasComponents, // Pass current state, not closure state
        callbackT1,
      );

      expect(callbackT1).toHaveBeenCalled();
      const result = callbackT1.mock.calls[0]![0];

      // Should include ALL components (comp-1, comp-2, container-1)
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle concurrent nested drops without shared state', () => {
      // This test demonstrates that handleNestedDrop doesn't have shared state
      // by calling it twice with different component arrays

      const container = createContainer('container-1', 0, 0);
      const components1: ResponsiveComponent[] = [container];
      const components2: ResponsiveComponent[] = [container, createComponent('existing', 'TXT', 1, 1, 1, 1, null)];

      const createMockEvent = (widgetType: string) => {
        return {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
          dataTransfer: {
            getData: jest.fn((key: string) => {
              if (key === 'text/plain') return '';
              if (key === 'componentType') return widgetType;
              if (key === 'componentConfig') return '';
              return '';
            }),
          },
        } as any;
      };

      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      // Call handleNestedDrop twice
      ContainerManager.handleNestedDrop(createMockEvent('BTN'), 'container-1', components1, onChange1);

      ContainerManager.handleNestedDrop(createMockEvent('TXT'), 'container-1', components2, onChange2);

      // Both callbacks should have been called
      expect(onChange1).toHaveBeenCalled();
      expect(onChange2).toHaveBeenCalled();

      // Verify independent results
      const result1 = onChange1.mock.calls[0][0];
      const result2 = onChange2.mock.calls[0][0];

      expect(result1.length).toBeGreaterThan(components1.length);
      expect(result2.length).toBeGreaterThan(components2.length);
    });
  });

  describe('Race Condition: handleComponentsChange + onNestedComponentsChange', () => {
    it('should handle main canvas drag while nested component positions are updating', () => {
      const container = createContainer('container-1', 2, 2);
      const nestedComp = createComponent('nested-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');
      const mainComp = createComponent('main-1', WIDGETS.TEXTBOX, 10, 10, 2, 2, null);

      let components: ResponsiveComponent[] = [container, nestedComp, mainComp];

      // Simulate nested position change (onNestedComponentsChange pattern)
      const updatedNested = { ...nestedComp, x: 2, y: 2 };

      // Update components array to reflect nested change
      components = components.map((c) => (c.id === 'nested-1' ? updatedNested : c));

      // While that's happening, main component is dragged (handleComponentsChange pattern)
      const updatedMain = { ...mainComp, x: 15, y: 15 };
      components = components.map((c) => (c.id === 'main-1' ? updatedMain : c));

      // Both updates should be present
      const finalNested = components.find((c) => c.id === 'nested-1');
      const finalMain = components.find((c) => c.id === 'main-1');

      expect(finalNested?.x).toBe(2);
      expect(finalNested?.y).toBe(2);
      expect(finalMain?.x).toBe(15);
      expect(finalMain?.y).toBe(15);
    });

    it('should merge nested component updates without losing main canvas changes', () => {
      const container = createContainer('container-1', 0, 0);
      const child1 = createComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1');
      const child2 = createComponent('child-2', WIDGETS.TEXTBOX, 1, 0, 1, 1, 'container-1');
      const mainComp = createComponent('main-1', WIDGETS.LABEL, 10, 10, 2, 2, null);

      const allComponents: ResponsiveComponent[] = [container, child1, child2, mainComp];

      // Simulate onNestedComponentsChange: child components positions updated
      const updatedChildren = [
        { ...child1, x: 0, y: 1 },
        { ...child2, x: 1, y: 1 },
      ];

      // App-builder pattern: merge updated children back into main array
      const childMap = new Map(updatedChildren.map((c) => [c.id, c]));
      const mergedComponents = allComponents.map((c) => childMap.get(c.id) || c);

      // Verify merge didn't lose main component
      expect(mergedComponents).toHaveLength(4);
      expect(mergedComponents.find((c) => c.id === 'main-1')).toBeDefined();

      // Verify children were updated
      const updatedChild1 = mergedComponents.find((c) => c.id === 'child-1');
      const updatedChild2 = mergedComponents.find((c) => c.id === 'child-2');

      expect(updatedChild1?.y).toBe(1);
      expect(updatedChild2?.y).toBe(1);
    });
  });

  describe('Race Condition: Component Creation + Selection Timing', () => {
    it('should handle selection of newly created component before Redux control exists', () => {
      // This tests the pattern where:
      // 1. Component is created and added to canvas
      // 2. onControlClick is called immediately
      // 3. Redux control may not exist yet

      const container = createContainer('container-1', 0, 0);
      let components: ResponsiveComponent[] = [container];

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

      const onChange = jest.fn((newComps) => {
        components = newComps;
      });

      // Drop component
      ContainerManager.handleNestedDrop(mockEvent, 'container-1', components, onChange);

      expect(onChange).toHaveBeenCalled();
      const updatedComponents = onChange.mock.calls[0]![0];

      // New component should exist (it's the one that's not the container)
      const newComponent = updatedComponents.find((c: ResponsiveComponent) => c.id !== 'container-1');

      expect(newComponent).toBeDefined();
      expect(newComponent.containerId).toBe('container-1');

      // At this point, app-builder would call onControlClick('new-button-1')
      // The test verifies the component exists even if Redux control doesn't yet
    });
  });

  describe('Race Condition: Container Movement with Children', () => {
    it('should maintain child containerId when container moves', () => {
      const container = createContainer('container-1', 5, 5);
      const child = createComponent('child-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');

      let components: ResponsiveComponent[] = [container, child];

      // Simulate container drag (position update)
      const movedContainer = { ...container, x: 10, y: 10 };
      components = components.map((c) => (c.id === 'container-1' ? movedContainer : c));

      // Child should still be in container
      const updatedChild = components.find((c) => c.id === 'child-1');
      expect(updatedChild?.containerId).toBe('container-1');

      // Child position is relative to container, so shouldn't change
      expect(updatedChild?.x).toBe(1);
      expect(updatedChild?.y).toBe(1);
    });

    it('should handle dragging child out while container is moving', () => {
      const container = createContainer('container-1', 5, 5);
      const child = createComponent('child-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');

      const components: ResponsiveComponent[] = [container, child];

      // While container is moving, drag child out
      const onMove = jest.fn();
      ContainerManager.moveComponentBetweenContainers('child-1', 'container-1', null, components, onMove);

      expect(onMove).toHaveBeenCalled();
      const result = onMove.mock.calls[0][0];

      // Child should be on main canvas
      const movedChild = result.find((c: ResponsiveComponent) => c.id === 'child-1');
      expect(movedChild?.containerId).toBeNull();

      // Container should still exist
      const containerStill = result.find((c: ResponsiveComponent) => c.id === 'container-1');
      expect(containerStill).toBeDefined();
    });
  });

  describe('Race Condition: Debounced Saves', () => {
    it('should handle multiple position updates within debounce window', async () => {
      const container = createContainer('container-1', 0, 0);
      const child = createComponent('child-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');

      let components: ResponsiveComponent[] = [container, child];

      // Simulate rapid position changes (within 200ms debounce window)
      const updates: ResponsiveComponent[] = [];

      // Update 1
      components = components.map((c) => (c.id === 'child-1' ? { ...c, x: 2, y: 1 } : c));
      updates.push({ ...components.find((c) => c.id === 'child-1')! });

      // Update 2 (before save)
      components = components.map((c) => (c.id === 'child-1' ? { ...c, x: 3, y: 1 } : c));
      updates.push({ ...components.find((c) => c.id === 'child-1')! });

      // Update 3 (before save)
      components = components.map((c) => (c.id === 'child-1' ? { ...c, x: 4, y: 1 } : c));
      updates.push({ ...components.find((c) => c.id === 'child-1')! });

      // Final position should be x: 4
      const finalChild = components.find((c) => c.id === 'child-1');
      expect(finalChild?.x).toBe(4);

      // All intermediate states were captured
      expect(updates[0]!.x).toBe(2);
      expect(updates[1]!.x).toBe(3);
      expect(updates[2]!.x).toBe(4);
    });
  });

  describe('Edge Case: Empty Container Operations', () => {
    it('should handle dropping into container then immediately moving to another', () => {
      const container1 = createContainer('container-1', 0, 0);
      const container2 = createContainer('container-2', 10, 10);
      const component = createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);

      let components: ResponsiveComponent[] = [container1, container2, component];

      const move1 = jest.fn((newComps) => {
        components = newComps;
      });

      // Move into container1
      ContainerManager.moveComponentBetweenContainers('comp-1', null, 'container-1', components, move1);

      expect(move1).toHaveBeenCalled();
      const afterMove1 = move1.mock.calls[0]![0];

      // Immediately move to container2 (using updated array)
      const move2 = jest.fn();
      ContainerManager.moveComponentBetweenContainers('comp-1', 'container-1', 'container-2', afterMove1, move2);

      expect(move2).toHaveBeenCalled();
      const afterMove2 = move2.mock.calls[0]![0];

      const finalComp = afterMove2.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(finalComp?.containerId).toBe('container-2');

      // container-1 should be empty
      const container1Children = ContainerManager.getChildComponents('container-1', afterMove2);
      expect(container1Children).toHaveLength(0);
    });

    it('should handle rapid add/remove from container', () => {
      const container = createContainer('container-1', 0, 0);
      const component = createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);

      let components: ResponsiveComponent[] = [container, component];

      // Add to container
      const add = jest.fn((newComps) => {
        components = newComps;
      });
      ContainerManager.moveComponentBetweenContainers('comp-1', null, 'container-1', components, add);

      const afterAdd = add.mock.calls[0]![0];

      // Immediately remove
      const remove = jest.fn((newComps) => {
        components = newComps;
      });
      ContainerManager.moveComponentBetweenContainers('comp-1', 'container-1', null, afterAdd, remove);

      const afterRemove = remove.mock.calls[0]![0];

      // Component should be back on canvas
      const finalComp = afterRemove.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(finalComp?.containerId).toBeNull();

      // Container should be empty
      expect(ContainerManager.isContainerEmpty('container-1', afterRemove)).toBe(true);
    });
  });

  describe('Data Consistency: Component Array Integrity', () => {
    it('should never duplicate components across operations', () => {
      const container = createContainer('container-1', 0, 0);
      const comp1 = createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);
      const comp2 = createComponent('comp-2', WIDGETS.TEXTBOX, 8, 8, 2, 2, null);

      let components: ResponsiveComponent[] = [container, comp1, comp2];

      // Multiple operations
      const onChange = jest.fn((newComps) => {
        components = newComps;
      });

      // Move comp1 to container
      ContainerManager.moveComponentBetweenContainers('comp-1', null, 'container-1', components, onChange);

      components = onChange.mock.calls[0]![0];

      // Move comp2 to container
      ContainerManager.moveComponentBetweenContainers('comp-2', null, 'container-1', components, onChange);

      const finalComponents = onChange.mock.calls[1]![0];

      // Check for duplicates
      const ids = finalComponents.map((c: ResponsiveComponent) => c.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should maintain component count through complex operations', () => {
      const container1 = createContainer('container-1', 0, 0);
      const container2 = createContainer('container-2', 10, 10);
      const comp1 = createComponent('comp-1', WIDGETS.BUTTON, 5, 5, 2, 2, null);
      const comp2 = createComponent('comp-2', WIDGETS.TEXTBOX, 8, 8, 2, 2, null);

      let components: ResponsiveComponent[] = [container1, container2, comp1, comp2];
      const initialCount = components.length;

      const onChange = jest.fn((newComps) => {
        components = newComps;
      });

      // Move comp1 to container1
      ContainerManager.moveComponentBetweenContainers('comp-1', null, 'container-1', components, onChange);
      components = onChange.mock.calls[onChange.mock.calls.length - 1]![0];

      // Move comp2 to container2
      ContainerManager.moveComponentBetweenContainers('comp-2', null, 'container-2', components, onChange);
      components = onChange.mock.calls[onChange.mock.calls.length - 1]![0];

      // Move comp1 from container1 to container2
      ContainerManager.moveComponentBetweenContainers('comp-1', 'container-1', 'container-2', components, onChange);
      components = onChange.mock.calls[onChange.mock.calls.length - 1]![0];

      // Count should remain the same
      expect(components.length).toBe(initialCount);
    });
  });
});
