/**
 * Drop Shadow Visibility Tests
 *
 * Tests for shadow visibility logic during drag operations.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import { shouldShowDropShadow, getDropShadowClassName } from './dropShadowVisibility';
import { LayoutItem } from './verticalPushCalculator';

describe('Drop Shadow Visibility', () => {
  describe('shouldShowDropShadow', () => {
    it('should show shadow when dragging into empty space', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      // Dragging into empty area below existing component
      const result = shouldShowDropShadow(0, 5, 4, 2, layout);

      expect(result).toBe(true);
    });

    it('should hide shadow when dragging would collide', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      // Dragging into same position as existing component
      const result = shouldShowDropShadow(0, 0, 4, 2, layout);

      expect(result).toBe(false);
    });

    it('should show shadow when layout is empty', () => {
      const result = shouldShowDropShadow(0, 0, 4, 2, []);
      expect(result).toBe(true);
    });

    it('should exclude dragged item from collision check', () => {
      const layout: LayoutItem[] = [
        { i: 'dragged', x: 0, y: 0, w: 4, h: 2 },
        { i: 'other', x: 0, y: 4, w: 4, h: 2 },
      ];

      // Moving dragged item - should not collide with itself
      const result = shouldShowDropShadow(0, 0, 4, 2, layout, 'dragged');

      expect(result).toBe(true);
    });

    it('should hide shadow when dragged item would collide with other items', () => {
      const layout: LayoutItem[] = [
        { i: 'dragged', x: 0, y: 0, w: 4, h: 2 },
        { i: 'other', x: 0, y: 4, w: 4, h: 2 },
      ];

      // Moving dragged item to position that collides with 'other'
      const result = shouldShowDropShadow(0, 4, 4, 2, layout, 'dragged');

      expect(result).toBe(false);
    });

    it('should handle partial horizontal overlap', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 2, y: 0, w: 4, h: 2 }];

      // Dragging with partial overlap
      const result = shouldShowDropShadow(0, 0, 4, 2, layout);

      expect(result).toBe(false);
    });

    it('should handle partial vertical overlap', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 4 }];

      // Dragging overlaps bottom portion
      const result = shouldShowDropShadow(0, 2, 4, 2, layout);

      expect(result).toBe(false);
    });

    it('should show shadow when adjacent but not overlapping', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      // Dragging right next to existing (no overlap)
      const result = shouldShowDropShadow(4, 0, 4, 2, layout);

      expect(result).toBe(true);
    });

    it('should show shadow when directly below existing component', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];

      // Dragging directly below (touching but not overlapping)
      const result = shouldShowDropShadow(0, 2, 4, 2, layout);

      expect(result).toBe(true);
    });
  });

  describe('getDropShadowClassName', () => {
    it('should return hidden class when in insert mode', () => {
      const result = getDropShadowClassName(true);
      expect(result).toBe('react-grid-item-drop-shadow-hidden');
    });

    it('should return visible class when not in insert mode', () => {
      const result = getDropShadowClassName(false);
      expect(result).toBe('react-grid-item-drop-shadow');
    });
  });
});
