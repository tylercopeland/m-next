/**
 * Insert Detection Tests
 *
 * Tests for detecting insert positions and calculating indicator placement.
 * Includes tests for boundary snapping behavior.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import {
  detectInsertPosition,
  calculateIndicatorWidth,
  snapToGrid,
  calculateInsertIndicator,
  InsertPosition,
} from './insertDetection';
import { LayoutItem } from './verticalPushCalculator';

describe('Insert Detection', () => {
  const rowHeight = 10;
  const colWidth = 50;
  const cols = 12;

  describe('detectInsertPosition', () => {
    it('should detect no push needed for empty layout', () => {
      const layout: LayoutItem[] = [];
      const result = detectInsertPosition(100, 50, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.wouldCausePush).toBe(false);
      expect(result.componentsToPush).toHaveLength(0);
    });

    it('should detect collision with existing component', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
      // Mouse at position that maps to grid (0, 0)
      const result = detectInsertPosition(25, 5, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.wouldCausePush).toBe(true);
      expect(result.componentsToPush).toContain('existing');
    });

    it('should not detect collision when dropping in empty space', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
      // Mouse at position well below the existing component
      const result = detectInsertPosition(25, 50, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.wouldCausePush).toBe(false);
      expect(result.componentsToPush).toHaveLength(0);
    });

    describe('collision detection', () => {
      it('should keep placeholder mode when approaching edge-to-edge from above', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 4, w: 4, h: 2 }];
        // Component at rows 4-5, dragged at row 3 with height 2 = rows 3-4
        // Pointer is still above component, so this should remain normal placeholder mode.
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(3);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should trigger insert when no edge-to-edge position is available and pointer is over target', () => {
        // Two components blocking edge-to-edge placement
        const layout: LayoutItem[] = [
          { i: 'above', x: 0, y: 0, w: 4, h: 3 }, // Rows 0-2
          { i: 'below', x: 0, y: 4, w: 4, h: 2 }, // Rows 4-5
        ];
        // Dragged at row 3 with height 2 = rows 3-4
        // Edge-to-edge above 'below' would be row 2, but 'above' extends to row 2
        // So insert at row 4 (top of 'below') is needed
        const result = detectInsertPosition(
          25,
          35, // candidate top row = 3
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          45, // pointer row = 4 (inside "below")
        );
        // Snaps to row 2 but that collides with 'above', OR snaps to row 4 which pushes 'below'
        // Nearest valid snap points: row 3 would be edge-to-edge above 'above' but... let's check
        // Actually insertion points are: 0, 3, 2, 4, 6 - snap from 3 picks 3 or 2
        // At row 3: collides with above (0-2)? No, above ends at row 2+3=3, so 3 touches edge
        // Actually above is y=0, h=3, so rows 0,1,2. Row 3 is clear of above.
        // Row 3 collides with below (4-5)? 4 < 3+2=5 AND 4+2=6 > 3 => collision
        // So wouldCausePush = true at row 3
        expect(result.wouldCausePush).toBe(true);
      });
      it('should keep placeholder mode when candidate top collides but pointer is not over component', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 10, w: 4, h: 2 }];
        // Candidate top row = 9 collides (rows 9-10), but pointer row = 8 is above.
        const result = detectInsertPosition(25, 90, 4, 2, layout, rowHeight, colWidth, cols, 85);
        expect(result.row).toBe(9);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should keep placeholder mode when approaching edge-to-edge from top even if pointer is over target', () => {
        const layout: LayoutItem[] = [{ i: 'target', x: 0, y: 6, w: 4, h: 2 }];
        // Candidate top row=5 collides, edge-to-edge-above row=4 is valid.
        // Pointer row=6 is over target (typical when dragging with pointer anchored inside component).
        const result = detectInsertPosition(25, 55, 4, 2, layout, rowHeight, colWidth, cols, 65);

        expect(result.row).toBe(4);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should keep placeholder mode for 3-row item when one row above target from top', () => {
        const layout: LayoutItem[] = [{ i: 'target', x: 0, y: 6, w: 4, h: 2 }];
        // Dragged component is 3 rows tall. Candidate top row=5 collides with target.
        // Valid edge-to-edge-above row is 3 and should remain placeholder mode.
        const result = detectInsertPosition(25, 55, 4, 3, layout, rowHeight, colWidth, cols, 65);

        expect(result.row).toBe(3);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should NOT trigger insert when there is a gap between components', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 6, w: 4, h: 2 }];
        // Component at rows 6-7, dragged at row 3 with height 2 = rows 3-4
        // Gap between 4 and 6, no collision
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(3);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should trigger insert inside gap when dragged height is larger than the gap', () => {
        const layout: LayoutItem[] = [
          { i: 'top', x: 0, y: 0, w: 4, h: 3 }, // Rows 0-2
          { i: 'bottom', x: 0, y: 5, w: 4, h: 2 }, // Rows 5-6
        ];
        // Gap is rows 3-4 (2 rows), dragged is 3 rows tall.
        // Hover at row 3 (inside gap): placement collides with "bottom", so insert should activate at row 3.
        const result = detectInsertPosition(25, 35, 4, 3, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(3);
        expect(result.wouldCausePush).toBe(true);
        expect(result.componentsToPush).toContain('bottom');
      });

      it('should use pointer-row collision fallback when placeholder top is shifted above a small gap', () => {
        const layout: LayoutItem[] = [
          { i: 'top', x: 0, y: 0, w: 4, h: 2 }, // Rows 0-1
          { i: 'bottom', x: 0, y: 6, w: 4, h: 2 }, // Rows 6-7
        ];
        // Pointer is in the gap at row 4, but placeholder top has shifted to row 2 (non-colliding edge-fit position).
        // A 4-row component at row 4 would collide with "bottom", so insert mode should still activate in the gap.
        const result = detectInsertPosition(
          25,
          25, // mouseY -> row 2 (shifted placeholder top)
          4,
          4,
          layout,
          rowHeight,
          colWidth,
          cols,
          45, // rawMouseY -> row 4 (actual pointer in gap)
        );

        expect(result.row).toBe(4);
        expect(result.wouldCausePush).toBe(true);
        expect(result.componentsToPush).toContain('bottom');
      });

      it('should trigger insert in top-edge gap when dragged height is larger than available space', () => {
        const layout: LayoutItem[] = [{ i: 'first', x: 0, y: 2, w: 4, h: 2 }]; // Rows 2-3
        // Top-edge gap is only 2 rows (rows 0-1), but dragged item is 3 rows tall.
        // Hovering in that top gap should activate insert mode.
        const result = detectInsertPosition(25, 5, 4, 3, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(0);
        expect(result.wouldCausePush).toBe(true);
        expect(result.componentsToPush).toContain('first');
      });

      it('should NOT trigger insert when mouse is above all components', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 2 }];
        // Component at rows 2-3, mouse at row 0 (not over component)
        const result = detectInsertPosition(25, 5, 4, 2, layout, rowHeight, colWidth, cols);

        // Mouse is NOT over component, so no insert mode
        expect(result.row).toBe(0);
        expect(result.wouldCausePush).toBe(false);
      });

      it('should trigger insert when mouse IS directly over component', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 2 }];
        // Component at rows 2-3, mouse at row 2 (directly over component)
        // mouseY = 25 → hoverRow = 2
        const result = detectInsertPosition(25, 25, 4, 2, layout, rowHeight, colWidth, cols);

        // Mouse IS over component, and dragged component would collide
        expect(result.wouldCausePush).toBe(true);
      });

      it('should NOT trigger insert when mouse is in different column', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
        // Component at columns 0-3, mouse at column 6 (mouseX=325 -> col 6)
        const result = detectInsertPosition(325, 5, 4, 2, layout, rowHeight, colWidth, cols);

        // Mouse is not over component horizontally
        expect(result.wouldCausePush).toBe(false);
      });

      it('should not trigger insert when aligned target overlaps but pointer is to the right of target columns', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
        // Aligned targetCol=1 (overlaps existing), but actual pointer is at col 6 (to the right).
        const result = detectInsertPosition(50, 5, 4, 2, layout, rowHeight, colWidth, cols, 5, 325);

        expect(result.wouldCausePush).toBe(false);
      });

      it('should allow slight right-edge pointer offset for insert detection', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
        // Existing component ends at x=200px; pointer is slightly outside at x=206px.
        // This should still count as "over" for edge-friendly insert activation.
        const result = detectInsertPosition(50, 5, 4, 2, layout, rowHeight, colWidth, cols, 5, 206);

        expect(result.wouldCausePush).toBe(true);
      });

      it('should treat exact right edge as neutral (no insert trigger)', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 0, w: 4, h: 2 }];
        // Existing component ends at x=200px; exact boundary should not count as "over".
        const result = detectInsertPosition(50, 5, 4, 2, layout, rowHeight, colWidth, cols, 5, 200);

        expect(result.wouldCausePush).toBe(false);
      });

      it('should NOT trigger insert when hovering over last row of component (snap to below)', () => {
        const layout: LayoutItem[] = [{ i: 'item', x: 0, y: 2, w: 4, h: 3 }];
        // item occupies rows 2-4; last row index = 4; bottom edge = 5
        // mouseRow=4, naturalSnap→5 (below item, non-colliding)
        const result = detectInsertPosition(25, 45, 4, 2, layout, rowHeight, colWidth, cols, 45);
        expect(result.wouldCausePush).toBe(false);
        expect(result.row).toBe(5);
      });

      it('should trigger insert when hovering over penultimate row of component', () => {
        const layout: LayoutItem[] = [{ i: 'item', x: 0, y: 2, w: 4, h: 3 }];
        // item occupies rows 2-4; mouseRow=3 (penultimate), naturalSnap→2 (top, collides)
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols, 35);
        expect(result.wouldCausePush).toBe(true);
        expect(result.row).toBe(2);
      });

      it('should push component below when hovering over last row and something is directly below', () => {
        const layout: LayoutItem[] = [
          { i: 'item', x: 0, y: 2, w: 4, h: 3 },
          { i: 'below', x: 0, y: 5, w: 4, h: 2 },
        ];
        // naturalSnap→5 (below item, collides with 'below') → collidingComponents non-empty → push
        const result = detectInsertPosition(25, 45, 4, 2, layout, rowHeight, colWidth, cols, 45);
        expect(result.wouldCausePush).toBe(true);
        expect(result.componentsToPush).toContain('below');
        expect(result.row).toBe(5);
      });
    });

    describe('boundary snapping', () => {
      it('should snap to nearest boundary when mouse IS over component', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 2 }];
        // Component at rows 2-3, mouse at row 3 (over component)
        // mouseY = 35 → hoverRow = 3, which is within rows 2-3
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols);

        // Row 3 is closer to boundary 4 (distance 1) than 2 (distance 1)
        // When equidistant, it picks the first one encountered (2)
        expect(result.wouldCausePush).toBe(true);
      });

      it('should not snap when hovering below component (not over it)', () => {
        const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 2 }];
        // Component is at y=2, h=2, so occupies rows 2-3
        // Mouse at row 5, not over any component
        const result = detectInsertPosition(25, 55, 4, 2, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(5); // No snapping when not over component
        expect(result.wouldCausePush).toBe(false);
      });

      it('should only consider horizontally overlapping components for boundaries', () => {
        const layout: LayoutItem[] = [
          { i: 'left', x: 0, y: 2, w: 4, h: 2 }, // Columns 0-3, rows 2-3
          { i: 'right', x: 8, y: 4, w: 4, h: 2 }, // Columns 8-11
        ];
        // Mouse at row 3, column 0 - directly over 'left' component
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols);

        // Valid boundaries from 'left': 0, 2 (top), 4 (bottom)
        // Row 3 is equidistant from 2 and 4, reduce picks first match (2)
        expect(result.row).toBe(2);
        expect(result.wouldCausePush).toBe(true);
      });

      it('should not trigger insert when between components (not over any)', () => {
        const layout: LayoutItem[] = [
          { i: 'top', x: 0, y: 0, w: 4, h: 2 }, // Rows 0-1
          { i: 'bottom', x: 0, y: 6, w: 4, h: 2 }, // Rows 6-7
        ];
        // Mouse at row 3 - between components, not over any
        const result = detectInsertPosition(25, 35, 4, 2, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(3); // No snapping when not over component
        expect(result.wouldCausePush).toBe(false);
      });

      it('should not snap inside a taller component when wide drag spans mixed-height columns', () => {
        const layout: LayoutItem[] = [
          { i: 'leftTall', x: 0, y: 0, w: 4, h: 5 }, // Rows 0-4
          { i: 'rightShort', x: 4, y: 3, w: 4, h: 2 }, // Rows 3-4
        ];
        // Wide drag overlaps both columns; raw nearest point would be row 3 (inside leftTall).
        const result = detectInsertPosition(25, 35, 8, 2, layout, rowHeight, colWidth, cols);

        expect(result.row).toBe(0); // Prefer nearest valid collision boundary (not inside components)
        expect(result.wouldCausePush).toBe(true);
      });
    });

    it('should calculate correct indicator Y at snapped position', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 0, y: 2, w: 4, h: 2 }];
      // Insert at row 2 (top of existing)
      const result = detectInsertPosition(25, 25, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.wouldCausePush).toBe(true);
      // Indicator should be at snapped row position
      expect(result.indicatorY).toBe(result.row * rowHeight);
    });

    it('should calculate indicator X based on target column', () => {
      const layout: LayoutItem[] = [{ i: 'existing', x: 2, y: 0, w: 4, h: 2 }];
      // Insert at column 2
      const result = detectInsertPosition(125, 5, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.indicatorX).toBe(100); // col 2 * 50px
    });

    it('should find multiple colliding components', () => {
      const layout: LayoutItem[] = [
        { i: 'a', x: 0, y: 0, w: 4, h: 2 },
        { i: 'b', x: 2, y: 0, w: 4, h: 2 },
      ];
      // Wide insert that overlaps both
      const result = detectInsertPosition(25, 5, 6, 2, layout, rowHeight, colWidth, cols);

      expect(result.wouldCausePush).toBe(true);
      expect(result.componentsToPush).toContain('a');
      expect(result.componentsToPush).toContain('b');
    });

    it('should clamp column to valid range', () => {
      const layout: LayoutItem[] = [];
      // Mouse way off to the right
      const result = detectInsertPosition(1000, 50, 4, 2, layout, rowHeight, colWidth, cols);

      // Should clamp to cols - draggedWidth = 12 - 4 = 8
      expect(result.col).toBe(8);
    });

    it('should handle negative mouse positions', () => {
      const layout: LayoutItem[] = [];
      const result = detectInsertPosition(-100, -50, 4, 2, layout, rowHeight, colWidth, cols);

      expect(result.row).toBe(0);
      expect(result.col).toBe(0);
    });

    describe('tall component half-detection (rawMouseY)', () => {
      // Tall component: 30 rows (3x a 2-row button = 6, so 30 >> 6)
      // rowHeight = 10, so tall component spans 300 pixels (rows 0-29)
      const tallComponent: LayoutItem = { i: 'tall', x: 0, y: 0, w: 12, h: 30 };

      it('should snap to TOP when mouse is in top half of tall component', () => {
        const layout: LayoutItem[] = [tallComponent];
        // Tall component at rows 0-29, midpoint at row 15
        // elementTopY places component at row 10, rawMouseY at row 5 (top half)
        // rawMouseY = 50 → row 5
        const result = detectInsertPosition(
          25, // mouseX
          100, // elementTopY (row 10)
          4, // draggedWidth
          2, // draggedHeight
          layout,
          rowHeight,
          colWidth,
          cols,
          50, // rawMouseY (row 5 - top half)
        );

        expect(result.row).toBe(0); // Snap to top of tall component
        expect(result.wouldCausePush).toBe(true);
      });

      it('should keep insert at TOP when bottom boundary has free space', () => {
        const layout: LayoutItem[] = [tallComponent];
        // Tall component at rows 0-29, midpoint at row 15
        // rawMouseY at row 20 (bottom half)
        const result = detectInsertPosition(
          25, // mouseX
          100, // elementTopY (row 10)
          4, // draggedWidth
          2, // draggedHeight
          layout,
          rowHeight,
          colWidth,
          cols,
          200, // rawMouseY (row 20 - bottom half)
        );

        expect(result.row).toBe(0); // Bottom boundary has free space, so keep collision-causing boundary
        expect(result.wouldCausePush).toBe(true);
      });

      it('should snap to BOTTOM when bottom boundary would collide', () => {
        const layout: LayoutItem[] = [
          tallComponent,
          { i: 'below', x: 0, y: 30, w: 12, h: 2 }, // Directly below tall component
        ];

        const result = detectInsertPosition(
          25,
          100,
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          200, // bottom half of tall component
        );

        expect(result.row).toBe(30); // Bottom boundary now causes push
        expect(result.wouldCausePush).toBe(true);
        expect(result.componentsToPush).toContain('below');
      });

      it('should keep insert at TOP at midpoint when bottom boundary has free space', () => {
        const layout: LayoutItem[] = [tallComponent];
        // Midpoint is row 15 (0 + 30/2)
        const result = detectInsertPosition(
          25,
          100,
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          150, // rawMouseY (row 15 - midpoint)
        );

        expect(result.row).toBe(0); // Bottom boundary has free space; keep collision-causing boundary
        expect(result.wouldCausePush).toBe(true);
      });

      it('should NOT apply half-detection to short components (< 3x dragged height)', () => {
        // Short component: 4 rows (less than 3x a 2-row button = 6)
        const shortComponent: LayoutItem = { i: 'short', x: 0, y: 0, w: 12, h: 4 };
        const layout: LayoutItem[] = [shortComponent];

        // Even with rawMouseY in "bottom half", should use normal snapping
        const result = detectInsertPosition(
          25,
          15, // elementTopY (row 1.5, over component)
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          35, // rawMouseY (row 3.5 - would be "bottom half" if detected)
        );

        // Should use normal nearest-boundary snapping, not half-detection
        // Row 1 is closer to boundary 0 (distance 1) than 4 (distance 3)
        expect(result.row).toBe(0);
      });

      it('should use normal snapping when rawMouseY is not provided', () => {
        const layout: LayoutItem[] = [tallComponent];
        // Without rawMouseY, uses nearest boundary snapping
        const result = detectInsertPosition(
          25,
          100, // elementTopY (row 10)
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          // No rawMouseY
        );

        // Row 10 is closer to boundary 0 (distance 10) than 30 (distance 20)
        expect(result.row).toBe(0);
      });

      it('should only apply when mouse is actually inside the tall component', () => {
        const layout: LayoutItem[] = [tallComponent];
        // Mouse is outside the tall component (row 35, component ends at row 30)
        const result = detectInsertPosition(
          25,
          350, // elementTopY (row 35 - outside)
          4,
          2,
          layout,
          rowHeight,
          colWidth,
          cols,
          350, // rawMouseY also outside
        );

        // Not over component, no insert mode
        expect(result.wouldCausePush).toBe(false);
      });
    });
  });

  describe('calculateIndicatorWidth', () => {
    it('should calculate width based on columns and column width', () => {
      const result = calculateIndicatorWidth(4, 50);
      expect(result).toBe(200);
    });

    it('should handle single column', () => {
      const result = calculateIndicatorWidth(1, 50);
      expect(result).toBe(50);
    });

    it('should handle full width (12 columns)', () => {
      const result = calculateIndicatorWidth(12, 50);
      expect(result).toBe(600);
    });

    it('should handle different column widths', () => {
      const result = calculateIndicatorWidth(6, 100);
      expect(result).toBe(600);
    });
  });

  describe('calculateInsertIndicator', () => {
    const mockInsertPosition: InsertPosition = {
      row: 2,
      col: 1,
      wouldCausePush: true,
      indicatorY: 20,
      indicatorX: 50,
      componentsToPush: ['comp1'],
    };

    const createMockRglElement = (itemWidth: number) => {
      const mockElement = {
        querySelectorAll: jest.fn().mockReturnValue([
          {
            getAttribute: jest.fn().mockReturnValue('component-test-id'),
            getBoundingClientRect: jest.fn().mockReturnValue({ width: itemWidth }),
          },
        ]),
      };
      return mockElement as unknown as Element;
    };

    it('should calculate indicator state with measured colWidth', () => {
      const rglElement = createMockRglElement(100); // 2-col item at 50px per col
      const components = [{ id: 'test-id', width: 2 }];

      const result = calculateInsertIndicator({
        insertPosition: mockInsertPosition,
        draggedWidth: 4,
        rowHeight: 10,
        fallbackColWidth: 50,
        rglElement,
        components,
      });

      expect(result.isActive).toBe(true);
      expect(result.indicatorX).toBe(8 + 1 * 50); // containerPadding + col * measuredColWidth
      expect(result.indicatorY).toBe(8 + 2 * 10); // containerPadding + row * rowHeight
      expect(result.indicatorWidth).toBe(4 * 50); // draggedWidth * measuredColWidth
      expect(result.targetRow).toBe(2);
      expect(result.targetCol).toBe(1);
    });

    it('should use fallback colWidth when no grid items found', () => {
      const rglElement = {
        querySelectorAll: jest.fn().mockReturnValue([]),
      } as unknown as Element;
      const components = [{ id: 'test-id', width: 2 }];

      const result = calculateInsertIndicator({
        insertPosition: mockInsertPosition,
        draggedWidth: 4,
        rowHeight: 10,
        fallbackColWidth: 60,
        rglElement,
        components,
      });

      expect(result.indicatorWidth).toBe(4 * 60); // Uses fallback
    });

    it('should use custom container padding', () => {
      const rglElement = createMockRglElement(100);
      const components = [{ id: 'test-id', width: 2 }];

      const result = calculateInsertIndicator({
        insertPosition: mockInsertPosition,
        draggedWidth: 4,
        rowHeight: 10,
        fallbackColWidth: 50,
        containerPadding: 16,
        rglElement,
        components,
      });

      expect(result.indicatorX).toBe(16 + 1 * 50); // Custom padding
      expect(result.indicatorY).toBe(16 + 2 * 10);
    });
  });

  describe('snapToGrid', () => {
    it('should snap mouse position to grid coordinates', () => {
      const result = snapToGrid(125, 35, rowHeight, colWidth, cols);

      expect(result.row).toBe(3);
      expect(result.col).toBe(2);
    });

    it('should handle position at grid boundaries', () => {
      const result = snapToGrid(100, 20, rowHeight, colWidth, cols);

      expect(result.row).toBe(2);
      expect(result.col).toBe(2);
    });

    it('should clamp negative values to zero', () => {
      const result = snapToGrid(-50, -30, rowHeight, colWidth, cols);

      expect(result.row).toBe(0);
      expect(result.col).toBe(0);
    });

    it('should clamp column to max columns - 1', () => {
      const result = snapToGrid(1000, 50, rowHeight, colWidth, cols);

      expect(result.col).toBe(11); // cols - 1
    });

    it('should handle zero position', () => {
      const result = snapToGrid(0, 0, rowHeight, colWidth, cols);

      expect(result.row).toBe(0);
      expect(result.col).toBe(0);
    });
  });
});
