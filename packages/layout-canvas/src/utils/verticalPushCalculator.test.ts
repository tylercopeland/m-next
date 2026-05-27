/**
 * Vertical Push Calculator Tests
 *
 * Tests for the push-down functionality in static layout mode.
 * Covers resize scenarios where components need to be pushed down.
 *
 * @see PL-60254: [Layout] Vertical Push - Resize (MVP)
 */

import {
  checkCollision,
  resolvePushCollisions,
  calculateResizePush,
  componentsToLayoutItems,
  applyLayoutToComponents,
  LayoutItem,
} from './verticalPushCalculator';
import { ResponsiveComponent } from '../rgl-integration/types';
import { CurrentState } from '@m-next/types';

// Helper to create a minimal ResponsiveComponent for testing
const createComponent = (id: string, x: number, y: number, width: number, height: number): ResponsiveComponent => ({
  id,
  type: 'BTN',
  x,
  y,
  width,
  height,
  content: `Component ${id}`,
  currentState: CurrentState.REGULAR,
  containerId: null,
  static: false,
});

describe('Vertical Push Calculator', () => {
  describe('checkCollision', () => {
    it('should detect collision when rectangles overlap', () => {
      const a = { x: 0, y: 0, w: 4, h: 2 };
      const b = { x: 2, y: 1, w: 4, h: 2 };
      expect(checkCollision(a, b)).toBe(true);
    });

    it('should not detect collision when rectangles do not overlap', () => {
      const a = { x: 0, y: 0, w: 4, h: 2 };
      const b = { x: 5, y: 0, w: 4, h: 2 };
      expect(checkCollision(a, b)).toBe(false);
    });

    it('should not detect collision when rectangles are adjacent horizontally', () => {
      const a = { x: 0, y: 0, w: 4, h: 2 };
      const b = { x: 4, y: 0, w: 4, h: 2 };
      expect(checkCollision(a, b)).toBe(false);
    });

    it('should not detect collision when rectangles are adjacent vertically', () => {
      const a = { x: 0, y: 0, w: 4, h: 2 };
      const b = { x: 0, y: 2, w: 4, h: 2 };
      expect(checkCollision(a, b)).toBe(false);
    });

    it('should detect collision when one rectangle is inside another', () => {
      const a = { x: 0, y: 0, w: 8, h: 4 };
      const b = { x: 2, y: 1, w: 2, h: 2 };
      expect(checkCollision(a, b)).toBe(true);
    });
  });

  describe('resolvePushCollisions', () => {
    it('should push item down when there is a collision', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 4 },
        { i: 'below', x: 0, y: 2, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 4 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(true);
      const belowItem = result.layout.find((i) => i.i === 'below');
      expect(belowItem?.y).toBe(4);
    });

    it('should cascade push when multiple items need to move', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 4 },
        { i: 'first', x: 0, y: 2, w: 4, h: 2 },
        { i: 'second', x: 0, y: 4, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 4 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(true);
      const firstItem = result.layout.find((i) => i.i === 'first');
      const secondItem = result.layout.find((i) => i.i === 'second');
      expect(firstItem?.y).toBe(4);
      expect(secondItem?.y).toBe(6);
    });

    it('should not push items that do not collide', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 4 },
        { i: 'right', x: 6, y: 0, w: 4, h: 2 },
        { i: 'below', x: 0, y: 6, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 4 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(false);
      const rightItem = result.layout.find((i) => i.i === 'right');
      const belowItem = result.layout.find((i) => i.i === 'below');
      expect(rightItem?.y).toBe(0);
      expect(belowItem?.y).toBe(6);
    });
  });

  describe('calculateResizePush', () => {
    it('should not push when component is shrinking height', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 4 },
        { i: 'below', x: 0, y: 2, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 2 };
      const originalWidth = 4;
      const originalHeight = 4;

      const result = calculateResizePush(resizedItem, originalWidth, originalHeight, layout);

      expect(result.hasPushed).toBe(false);
    });

    it('should not push when component is shrinking width', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 6, h: 2 },
        { i: 'adjacent', x: 4, y: 0, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 2 };
      const originalWidth = 6;
      const originalHeight = 2;

      const result = calculateResizePush(resizedItem, originalWidth, originalHeight, layout);

      expect(result.hasPushed).toBe(false);
    });

    it('should push when height increases and causes collision', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 2 },
        { i: 'below', x: 0, y: 2, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 4 };
      const originalWidth = 4;
      const originalHeight = 2;

      const result = calculateResizePush(resizedItem, originalWidth, originalHeight, layout);

      expect(result.hasPushed).toBe(true);
      const belowItem = result.layout.find((i) => i.i === 'below');
      expect(belowItem?.y).toBe(4);
    });

    it('should push when width increases and causes collision', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 2 },
        { i: 'adjacent', x: 4, y: 0, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 6, h: 2 };
      const originalWidth = 4;
      const originalHeight = 2;

      const result = calculateResizePush(resizedItem, originalWidth, originalHeight, layout);

      expect(result.hasPushed).toBe(true);
      const adjacentItem = result.layout.find((i) => i.i === 'adjacent');
      // Width increase pushes DOWN, not sideways
      expect(adjacentItem?.y).toBe(2);
    });

    it('should not push when there is already enough gap', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 2 },
        { i: 'below', x: 0, y: 6, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 4, h: 4 };
      const originalWidth = 4;
      const originalHeight = 2;

      const result = calculateResizePush(resizedItem, originalWidth, originalHeight, layout);

      expect(result.hasPushed).toBe(false);
      const belowItem = result.layout.find((i) => i.i === 'below');
      expect(belowItem?.y).toBe(6);
    });
  });

  describe('componentsToLayoutItems', () => {
    it('should convert ResponsiveComponents to LayoutItems', () => {
      const components: ResponsiveComponent[] = [createComponent('a', 0, 0, 4, 2), createComponent('b', 4, 2, 6, 3)];

      const layoutItems = componentsToLayoutItems(components);

      expect(layoutItems).toEqual([
        { i: 'a', x: 0, y: 0, w: 4, h: 2 },
        { i: 'b', x: 4, y: 2, w: 6, h: 3 },
      ]);
    });
  });

  describe('applyLayoutToComponents', () => {
    it('should update component positions from layout', () => {
      const components: ResponsiveComponent[] = [createComponent('a', 0, 0, 4, 2), createComponent('b', 4, 2, 6, 3)];

      const layout: LayoutItem[] = [
        { i: 'a', x: 0, y: 0, w: 4, h: 2 },
        { i: 'b', x: 4, y: 6, w: 6, h: 3 },
      ];

      const updatedComponents = applyLayoutToComponents(components, layout);

      expect(updatedComponents[1]!.y).toBe(6);
      expect(updatedComponents[1]!.x).toBe(4);
    });

    it('should preserve all other component properties', () => {
      const components: ResponsiveComponent[] = [createComponent('a', 0, 0, 4, 2)];
      components[0]!.content = 'Test Content';

      const layout: LayoutItem[] = [{ i: 'a', x: 2, y: 3, w: 4, h: 2 }];

      const updatedComponents = applyLayoutToComponents(components, layout);

      expect(updatedComponents[0]!.content).toBe('Test Content');
      expect(updatedComponents[0]!.type).toBe('BTN');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty layout', () => {
      const layout: LayoutItem[] = [];
      const resizedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 4, h: 4 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(false);
      expect(result.iterations).toBe(1);
    });

    it('should handle complex cascade with multiple levels', () => {
      const layout: LayoutItem[] = [
        { i: 'source', x: 0, y: 0, w: 12, h: 4 },
        { i: 'level1a', x: 0, y: 2, w: 6, h: 2 },
        { i: 'level1b', x: 6, y: 2, w: 6, h: 2 },
        { i: 'level2', x: 0, y: 4, w: 12, h: 2 },
        { i: 'level3', x: 0, y: 6, w: 12, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'source', x: 0, y: 0, w: 12, h: 4 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(true);

      const level1a = result.layout.find((i) => i.i === 'level1a');
      const level1b = result.layout.find((i) => i.i === 'level1b');
      const level2 = result.layout.find((i) => i.i === 'level2');
      const level3 = result.layout.find((i) => i.i === 'level3');

      expect(level1a?.y).toBe(4);
      expect(level1b?.y).toBe(4);
      expect(level2?.y).toBeGreaterThanOrEqual(6);
      expect(level3?.y).toBeGreaterThanOrEqual(8);
    });

    it('should handle horizontal resize pushing components down', () => {
      const layout: LayoutItem[] = [
        { i: 'resized', x: 0, y: 0, w: 4, h: 2 },
        { i: 'adjacent', x: 4, y: 0, w: 4, h: 2 },
      ];
      const resizedItem: LayoutItem = { i: 'resized', x: 0, y: 0, w: 6, h: 2 };

      const result = resolvePushCollisions(resizedItem, layout);

      expect(result.hasPushed).toBe(true);
      const adjacentItem = result.layout.find((i) => i.i === 'adjacent');
      expect(adjacentItem?.y).toBe(2); // Pushed DOWN (not sideways)
    });
  });
});
