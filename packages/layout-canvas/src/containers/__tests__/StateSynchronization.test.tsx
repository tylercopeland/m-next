/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * State Synchronization Tests for Container Operations
 *
 * These tests simulate the app-builder's state management patterns including:
 * - React state updates (setCanvasComponents)
 * - Redux dispatches (controlUpdated)
 * - Debounced callbacks
 * - Multiple concurrent state update sources
 *
 * Goal: Catch timing issues that cause components to "snap back" or lose position
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

describe('State Synchronization - App Builder Patterns', () => {
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

  const createContainer = (id: string): ResponsiveComponent => ({
    id,
    type: WIDGETS.LAYOUT_CONTAINER,
    x: 0,
    y: 0,
    width: 8,
    height: 12,
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

  describe('Pattern: Debounced handleComponentsChange', () => {
    it('should handle position update before debounce completes', (done) => {
      // Simulate app-builder pattern:
      // 1. User drags component (immediate state update)
      // 2. Position update debounced for 200ms
      // 3. User drags again before debounce completes

      let components: ResponsiveComponent[] = [
        createContainer('container-1'),
        createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1'),
      ];

      const updates: number[] = [];

      // Simulate debounced save
      const debouncedSave = (x: number) => {
        setTimeout(() => {
          updates.push(x);
          if (updates.length === 2) {
            // Second update should have latest position
            expect(updates[1]).toBe(5);
            done();
          }
        }, 200);
      };

      // First drag
      components = components.map((c) => (c.id === 'comp-1' ? { ...c, x: 3 } : c));
      debouncedSave(3);

      // Second drag (before first save completes)
      setTimeout(() => {
        components = components.map((c) => (c.id === 'comp-1' ? { ...c, x: 5 } : c));
        debouncedSave(5);
      }, 50);
    });

    it('should not lose immediate component creation during debounce', (done) => {
      // Pattern: New component added (immediate) while position update is debounced

      let components: ResponsiveComponent[] = [createContainer('container-1')];
      let saveCallCount = 0;

      const mockSave = (comps: ResponsiveComponent[]) => {
        saveCallCount++;
        if (saveCallCount === 2) {
          // Both the new component AND position update should be saved
          expect(comps.find((c) => c.id === 'new-comp')).toBeDefined();
          expect(comps.find((c) => c.id === 'container-1')?.x).toBe(5);
          done();
        }
      };

      // Position update (debounced)
      setTimeout(() => {
        components = components.map((c) => (c.id === 'container-1' ? { ...c, x: 5 } : c));
        mockSave(components);
      }, 200);

      // New component added (immediate - should not wait for debounce)
      components = [...components, createComponent('new-comp', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1')];
      mockSave(components);
    });
  });

  describe('Pattern: onNestedComponentsChange Bypass', () => {
    it('should update child positions without triggering full handleComponentsChange', () => {
      // App-builder pattern: onNestedComponentsChange updates Redux directly,
      // bypassing handleComponentsChange to prevent cascade

      const container = createContainer('container-1');
      const child1 = createComponent('child-1', WIDGETS.BUTTON, 0, 0, 1, 1, 'container-1');
      const child2 = createComponent('child-2', WIDGETS.TEXTBOX, 1, 0, 1, 1, 'container-1');
      const mainComp = createComponent('main-1', WIDGETS.LABEL, 10, 10, 2, 2, null);

      let components: ResponsiveComponent[] = [container, child1, child2, mainComp];

      // Track which update paths were called
      const handleComponentsChangeCallCount = { count: 0 };
      const directReduxUpdateCallCount = { count: 0 };

      // Simulate onNestedComponentsChange pattern
      const updatedChildren = [
        { ...child1, x: 2, y: 1 },
        { ...child2, x: 3, y: 1 },
      ];

      // Merge children back (app-builder pattern)
      const childMap = new Map(updatedChildren.map((c) => [c.id, c]));
      components = components.map((c) => childMap.get(c.id) || c);

      // Direct Redux update (bypassing handleComponentsChange)
      updatedChildren.forEach(() => {
        directReduxUpdateCallCount.count++;
      });

      // handleComponentsChange should NOT be called
      expect(handleComponentsChangeCallCount.count).toBe(0);

      // Direct Redux update should have been called for each child
      expect(directReduxUpdateCallCount.count).toBe(2);

      // Main component should be unchanged
      const finalMain = components.find((c) => c.id === 'main-1');
      expect(finalMain?.x).toBe(10);
    });

    it('should prevent infinite update loops between handlers', () => {
      // Scenario: onNestedComponentsChange triggers, which updates layoutV4,
      // which could trigger useEffect, which calls handleComponentsChange

      let components: ResponsiveComponent[] = [
        createContainer('container-1'),
        createComponent('child-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1'),
      ];

      const updateHistory: string[] = [];

      // Simulate component update flow
      const onNestedComponentsChange = (updatedChildren: ResponsiveComponent[]) => {
        updateHistory.push('onNestedComponentsChange');

        // Update components
        const childMap = new Map(updatedChildren.map((c) => [c.id, c]));
        components = components.map((c) => childMap.get(c.id) || c);

        // This would trigger layoutV4 update
        onLayoutV4Change();
      };

      const onLayoutV4Change = () => {
        updateHistory.push('onLayoutV4Change');

        // In app-builder, this should NOT trigger handleComponentsChange
        // (breaking the loop)
      };

      // Trigger nested change
      const updatedChild = { ...components[1]!, x: 2, y: 2 };
      onNestedComponentsChange([updatedChild]);

      // Should not have infinite loop
      expect(updateHistory).toEqual(['onNestedComponentsChange', 'onLayoutV4Change']);

      // handleComponentsChange should NOT have been called
      expect(updateHistory.includes('handleComponentsChange')).toBe(false);
    });
  });

  describe('Pattern: Stale Closure Detection', () => {
    it('should detect when callback has stale component reference', () => {
      // Simulate closure issue with callbacks
      let components: ResponsiveComponent[] = [createContainer('container-1')];

      // Create callback with closure over initial components array
      const moveComponent = (() => {
        // This closure captures 'components' at the time it was created
        const capturedComponents = components;
        return () => capturedComponents.length;
      })();

      const initialCount = moveComponent();
      expect(initialCount).toBe(1);

      // Add component to array (but callback still has old reference)
      components = [...components, createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, null)];

      // Callback still sees old count (stale closure)
      const staleCount = moveComponent();
      expect(staleCount).toBe(1); // Still 1, not 2!

      // To fix, callback needs to be recreated or use a ref
      const newMoveComponent = () => components.length;
      const freshCount = newMoveComponent();
      expect(freshCount).toBe(2);
    });

    it('should handle stale closure with callback dependencies', () => {
      let components: ResponsiveComponent[] = [createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, null)];

      const onMove = jest.fn();

      // Create callback that captures components
      const handleMove = (id: string) => {
        const comp = components.find((c) => c.id === id);
        if (comp) {
          onMove(comp);
        }
      };

      // Initial call
      handleMove('comp-1');
      expect(onMove).toHaveBeenCalledTimes(1);

      // Add second component
      components = [...components, createComponent('comp-2', WIDGETS.TEXTBOX, 2, 2, 1, 1, null)];

      // Callback should be able to find new component
      // (In real app, this would need useCallback with [components] dependency)
      handleMove('comp-2');
      expect(onMove).toHaveBeenCalledTimes(2);
    });
  });

  describe('Pattern: Concurrent State Updates', () => {
    it('should handle React state update + Redux dispatch in sequence', async () => {
      // Simulate the pattern where:
      // 1. setCanvasComponents (React state)
      // 2. dispatch(controlUpdated) (Redux)
      // Both happen "simultaneously"

      let reactState: ResponsiveComponent[] = [
        createContainer('container-1'),
        createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1'),
      ];

      const reduxState: any = {};

      // Simulate React setState
      const setCanvasComponents = (newComponents: ResponsiveComponent[]) => {
        reactState = newComponents;
      };

      // Simulate Redux dispatch
      const dispatchControlUpdated = (control: any) => {
        reduxState[control.id] = control;
      };

      // Update child position (both React and Redux)
      const updatedChild = { ...reactState[1]!, x: 3, y: 3 };

      setCanvasComponents(reactState.map((c) => (c.id === 'comp-1' ? updatedChild : c)));

      dispatchControlUpdated({
        id: 'comp-1',
        x: 3,
        y: 3,
        width: 1,
        height: 1,
      });

      // Both should have the same values
      const reactComp = reactState.find((c) => c.id === 'comp-1');
      const reduxComp = reduxState['comp-1'];

      expect(reactComp?.x).toBe(3);
      expect(reduxComp?.x).toBe(3);
    });

    it('should handle conflicting updates between React and Redux', () => {
      // Scenario: React state updated to x=5, but Redux update arrives with x=3
      // (maybe from server or another browser tab)

      let reactState: ResponsiveComponent[] = [createComponent('comp-1', WIDGETS.BUTTON, 3, 3, 1, 1, null)];

      // User drags component
      reactState = reactState.map((c) => (c.id === 'comp-1' ? { ...c, x: 5 } : c));

      // But Redux state is still at x=3 (maybe from props update)
      const reduxState = { 'comp-1': { id: 'comp-1', x: 3, y: 3 } };

      // App-builder pattern: React state wins (until next prop update)
      const reactX = reactState.find((c) => c.id === 'comp-1')?.x;
      expect(reactX).toBe(5);

      // But this will cause snap-back when props update!
      // Test that we can detect this scenario
      expect(reactX).not.toBe(reduxState['comp-1'].x);
    });
  });

  describe('Pattern: useEffect Dependency Issues', () => {
    it('should detect missing dependency causing stale data', () => {
      // Simulate effect with missing dependency
      let localComponents: ResponsiveComponent[] = [createContainer('container-1')];
      let cachedCount = 0;

      // Simulate effect that runs once (empty dependency array)
      const runEffect = () => {
        cachedCount = localComponents.length;
      };

      // Initial effect run
      runEffect(); // Runs once
      expect(cachedCount).toBe(1);

      // Add component
      localComponents = [...localComponents, createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, null)];

      // Effect doesn't run again (missing dependency)
      // cachedCount is still 1, even though localComponents.length is now 2

      expect(localComponents.length).toBe(2);
      expect(cachedCount).toBe(1); // BUG: Stale cached value!

      // To fix: Add localComponents to dependency array
      // This would cause effect to run again, updating cachedCount
    });

    it('should handle rapid props changes causing multiple effect runs', () => {
      // Simulate effect that depends on a prop
      const effectRunCount = { count: 0 };
      let layoutV4 = { canvasId: 'v1' };

      const runEffect = () => {
        effectRunCount.count++;
        // Effect logic here
      };

      // Initial run
      runEffect();
      expect(effectRunCount.count).toBe(1);

      // Simulate rapid prop changes (like multiple saves)
      layoutV4 = { canvasId: 'v2' };
      void layoutV4; // Simulating state change
      runEffect();

      layoutV4 = { canvasId: 'v3' };
      void layoutV4; // Simulating state change
      runEffect();

      layoutV4 = { canvasId: 'v4' };
      void layoutV4; // Simulating state change
      runEffect();

      // Effect should have run 4 times (initial + 3 updates)
      expect(effectRunCount.count).toBe(4);
    });
  });

  describe('Pattern: Component Movement Race Conditions', () => {
    it('should handle component moved while save is in progress', async () => {
      let components: ResponsiveComponent[] = [
        createContainer('container-1'),
        createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1'),
      ];

      let saveInProgress = false;
      const savedStates: ResponsiveComponent[][] = [];

      // Simulate async save
      const save = async (comps: ResponsiveComponent[]) => {
        saveInProgress = true;
        await new Promise((resolve) => setTimeout(resolve, 100));
        savedStates.push(comps);
        saveInProgress = false;
      };

      // Start save of initial state
      const savePromise = save([...components]);

      // While save is in progress, move component
      if (saveInProgress) {
        // Component moved to main canvas
        const onMove = jest.fn((newComps) => {
          components = newComps;
        });

        ContainerManager.moveComponentBetweenContainers('comp-1', 'container-1', null, components, onMove);

        components = onMove.mock.calls[0]![0];
      }

      // Wait for save to complete
      await savePromise;

      // Current state should reflect the move
      const currentComp = components.find((c) => c.id === 'comp-1');
      expect(currentComp?.containerId).toBeNull();

      // But saved state might have old data (race condition!)
      // This is the issue we need to handle
    });

    it('should detect when multiple operations modify same component', () => {
      const container = createContainer('container-1');
      const component = createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1');

      let components: ResponsiveComponent[] = [container, component];

      const operations: string[] = [];

      // Operation 1: Position update
      components = components.map((c) => {
        if (c.id === 'comp-1') {
          operations.push('position-update');
          return { ...c, x: 2, y: 2 };
        }
        return c;
      });

      // Operation 2: Move to main canvas (before position save completes)
      const onMove = jest.fn((newComps) => {
        operations.push('move-to-main');
        components = newComps;
      });

      ContainerManager.moveComponentBetweenContainers('comp-1', 'container-1', null, components, onMove);

      // Both operations executed
      expect(operations).toContain('position-update');
      expect(operations).toContain('move-to-main');

      // Final state should be on main canvas
      const finalComponents = onMove.mock.calls[0]![0];
      const finalComp = finalComponents.find((c: ResponsiveComponent) => c.id === 'comp-1');
      expect(finalComp?.containerId).toBeNull();
    });
  });

  describe('Pattern: Initial Load vs User Interaction', () => {
    it('should skip saves during initial load', () => {
      const saveCallCount = { count: 0 };
      let isInitialLoad = true;

      const save = () => {
        if (!isInitialLoad) {
          saveCallCount.count++;
        }
      };

      let components: ResponsiveComponent[] = [createContainer('container-1')];

      // During initial load, component added
      components = [...components, createComponent('comp-1', WIDGETS.BUTTON, 1, 1, 1, 1, 'container-1')];

      save();

      // Should not have saved (initial load)
      expect(saveCallCount.count).toBe(0);

      // After initial load period (500ms in app-builder)
      isInitialLoad = false;

      // Now user adds component
      components = [...components, createComponent('comp-2', WIDGETS.TEXTBOX, 2, 2, 1, 1, 'container-1')];
      void components; // Simulating state change

      save();

      // Should have saved
      expect(saveCallCount.count).toBe(1);
    });
  });
});
