/**
 * Insert Push Calculator Tests
 *
 * Tests for the push-down functionality when inserting new components.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import { calculateInsertPush, wouldInsertRequirePush, getComponentsToPush } from './insertPushCalculator';
import { LayoutItem } from './verticalPushCalculator';

describe('Insert Push Calculator', () => {
  describe('calculateInsertPush', () => {
    it('should not push when inserting into empty space', () => {
      const existingLayout: LayoutItem[] = [
        { i: 'a', x: 0, y: 0, w: 4, h: 2 },
        { i: 'b', x: 0, y: 6, w: 4, h: 2 }, // Gap between y=2 and y=6
      ];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 3, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(false);
      expect(result.layout).toHaveLength(3);

      // All items should keep their original positions
      const itemA = result.layout.find((l) => l.i === 'a');
      const itemB = result.layout.find((l) => l.i === 'b');
      expect(itemA?.y).toBe(0);
      expect(itemB?.y).toBe(6);
    });

    it('should push component down when inserting at collision position', () => {
      const existingLayout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const existingItem = result.layout.find((l) => l.i === 'existing');
      expect(existingItem?.y).toBe(2); // Pushed down by height of inserted item
    });

    it('should cascade push when multiple components are stacked', () => {
      const existingLayout: LayoutItem[] = [
        { i: 'first', x: 0, y: 0, w: 4, h: 2 },
        { i: 'second', x: 0, y: 2, w: 4, h: 2 },
        { i: 'third', x: 0, y: 4, w: 4, h: 2 },
      ];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const first = result.layout.find((l) => l.i === 'first');
      const second = result.layout.find((l) => l.i === 'second');
      const third = result.layout.find((l) => l.i === 'third');

      // All should be pushed down in cascade
      expect(first?.y).toBe(2);
      expect(second?.y).toBe(4);
      expect(third?.y).toBe(6);
    });

    it('should only push horizontally overlapping components', () => {
      const existingLayout: LayoutItem[] = [
        { i: 'left', x: 0, y: 0, w: 4, h: 2 },
        { i: 'right', x: 6, y: 0, w: 4, h: 2 }, // No horizontal overlap
      ];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const left = result.layout.find((l) => l.i === 'left');
      const right = result.layout.find((l) => l.i === 'right');

      expect(left?.y).toBe(2); // Pushed down
      expect(right?.y).toBe(0); // Not pushed (no horizontal overlap)
    });

    it('should handle insert at row 0 (top of canvas)', () => {
      const existingLayout: LayoutItem[] = [
        { i: 'top', x: 0, y: 0, w: 12, h: 4 },
        { i: 'bottom', x: 0, y: 4, w: 12, h: 2 },
      ];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 12, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const newItem = result.layout.find((l) => l.i === 'new');
      const top = result.layout.find((l) => l.i === 'top');
      const bottom = result.layout.find((l) => l.i === 'bottom');

      expect(newItem?.y).toBe(0); // New item at top
      expect(top?.y).toBe(2); // Original top pushed down
      expect(bottom?.y).toBe(6); // Cascaded push
    });

    it('should handle insert at bottom of canvas (no push needed)', () => {
      const existingLayout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 10, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(false);

      const existing = result.layout.find((l) => l.i === 'existing');
      expect(existing?.y).toBe(0); // Unchanged
    });

    it('should handle partial vertical overlap', () => {
      const existingLayout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 4 }];
      // Insert that overlaps with bottom part of existing
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 4, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const existing = result.layout.find((l) => l.i === 'existing');
      const newItem = result.layout.find((l) => l.i === 'new');

      // Existing should be pushed below the new item
      expect(newItem?.y).toBe(4);
      expect(existing?.y).toBe(6);
    });

    it('should handle empty layout', () => {
      const existingLayout: LayoutItem[] = [];
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 4, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(false);
      expect(result.layout).toHaveLength(1);
      expect(result.layout[0]?.i).toBe('new');
    });

    it('should handle wide component insert pushing multiple columns', () => {
      const existingLayout: LayoutItem[] = [
        { i: 'left', x: 0, y: 0, w: 4, h: 2 },
        { i: 'middle', x: 4, y: 0, w: 4, h: 2 },
        { i: 'right', x: 8, y: 0, w: 4, h: 2 },
      ];
      // Full-width insert
      const insertedItem: LayoutItem = { i: 'new', x: 0, y: 0, w: 12, h: 2 };

      const result = calculateInsertPush(insertedItem, existingLayout);

      expect(result.hasPushed).toBe(true);

      const left = result.layout.find((l) => l.i === 'left');
      const middle = result.layout.find((l) => l.i === 'middle');
      const right = result.layout.find((l) => l.i === 'right');

      // All should be pushed down
      expect(left?.y).toBe(2);
      expect(middle?.y).toBe(2);
      expect(right?.y).toBe(2);
    });
  });

  describe('wouldInsertRequirePush', () => {
    it('should return true when insert would collide', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      const result = wouldInsertRequirePush(0, 0, 4, 2, layout);

      expect(result).toBe(true);
    });

    it('should return false when insert would not collide', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      const result = wouldInsertRequirePush(0, 5, 4, 2, layout);

      expect(result).toBe(false);
    });

    it('should return false for empty layout', () => {
      const result = wouldInsertRequirePush(0, 0, 4, 2, []);
      expect(result).toBe(false);
    });

    it('should detect partial overlap', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 2, y: 0, w: 4, h: 2 }];

      // Partial horizontal overlap
      const result = wouldInsertRequirePush(0, 0, 4, 2, layout);

      expect(result).toBe(true);
    });
  });

  describe('getComponentsToPush', () => {
    it('should return IDs of components that would be pushed', () => {
      const layout: LayoutItem[] = [
        { i: 'collide1', x: 0, y: 0, w: 4, h: 2 },
        { i: 'collide2', x: 2, y: 0, w: 4, h: 2 },
        { i: 'safe', x: 8, y: 0, w: 4, h: 2 },
      ];

      const result = getComponentsToPush(0, 0, 6, 2, layout);

      expect(result).toContain('collide1');
      expect(result).toContain('collide2');
      expect(result).not.toContain('safe');
    });

    it('should return empty array when no collisions', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      const result = getComponentsToPush(0, 10, 4, 2, layout);

      expect(result).toHaveLength(0);
    });
  });
});
