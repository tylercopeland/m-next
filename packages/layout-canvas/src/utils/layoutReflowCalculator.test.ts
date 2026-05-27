/**
 * Tests for the layout reflow calculator.
 *
 * Key scenarios:
 *  - Proportional width scaling
 *  - Row grouping and left-pack placement
 *  - Wrap-to-next-line when items overflow target cols
 *  - Vertical gap preservation
 *  - Full-width (w=sourceCols) items expand to fill targetCols
 *  - Container-scoped reflow (children reflowed independently per container)
 *  - The "New Box" screen layout from the NCNG-831 bug report
 */
import { scaleWidth, reflowItems, buildReflowLookup, ReflowItem } from './layoutReflowCalculator';

// ---------------------------------------------------------------------------
// scaleWidth
// ---------------------------------------------------------------------------

describe('scaleWidth', () => {
  it('scales proportionally from 12 to 8', () => {
    expect(scaleWidth(3, 12, 8)).toBe(2); // 3*8/12 = 2
    expect(scaleWidth(6, 12, 8)).toBe(4); // 6*8/12 = 4
    expect(scaleWidth(9, 12, 8)).toBe(6); // 9*8/12 = 6
  });

  it('expands full-width items to fill target', () => {
    expect(scaleWidth(12, 12, 8)).toBe(8);
    expect(scaleWidth(12, 12, 4)).toBe(4);
  });

  it('enforces minimum width of 1', () => {
    expect(scaleWidth(1, 12, 8)).toBe(1); // 1*8/12 ≈ 0.67 → max(1, round(0.67)) = 1
  });

  it('rounds to nearest column', () => {
    expect(scaleWidth(5, 12, 8)).toBe(3); // 5*8/12 ≈ 3.33 → 3
    expect(scaleWidth(7, 12, 8)).toBe(5); // 7*8/12 ≈ 4.67 → 5
  });

  it('returns same width when sourceCols === targetCols', () => {
    expect(scaleWidth(4, 8, 8)).toBe(4);
  });

  it('scales from 12 to 4 (mobile)', () => {
    expect(scaleWidth(12, 12, 4)).toBe(4);
    expect(scaleWidth(6, 12, 4)).toBe(2);
    expect(scaleWidth(3, 12, 4)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// reflowItems — basic cases
// ---------------------------------------------------------------------------

describe('reflowItems', () => {
  it('returns empty array for empty input', () => {
    expect(reflowItems([], 12, 8)).toEqual([]);
  });

  it('returns same items when sourceCols === targetCols', () => {
    const items: ReflowItem[] = [{ id: 'a', x: 0, y: 0, width: 4, height: 2 }];
    const result = reflowItems(items, 8, 8);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 'a', x: 0, y: 0, width: 4, height: 2 });
  });

  it('scales a single item proportionally', () => {
    const items: ReflowItem[] = [{ id: 'a', x: 0, y: 0, width: 6, height: 2 }];
    const result = reflowItems(items, 12, 8);
    expect(result[0]!.width).toBe(4); // 6*8/12=4
    expect(result[0]!.x).toBe(0);
    expect(result[0]!.y).toBe(0);
  });

  it('places two items side by side when they fit', () => {
    const items: ReflowItem[] = [
      { id: 'a', x: 0, y: 0, width: 6, height: 2 },
      { id: 'b', x: 6, y: 0, width: 6, height: 2 },
    ];
    const result = reflowItems(items, 12, 8);
    const a = result.find((r) => r.id === 'a')!;
    const b = result.find((r) => r.id === 'b')!;
    expect(a.x).toBe(0);
    expect(a.width).toBe(4);
    expect(b.x).toBe(4);
    expect(b.width).toBe(4);
    // Both on same row
    expect(a.y).toBe(b.y);
  });

  it('wraps third item to next row when row is full', () => {
    // Three items of width 4 (12 cols): all fit on one line at desktop.
    // Scaled to 8 cols: each → round(4*8/12) = 3. Three of them = 9 > 8, so third wraps.
    const items: ReflowItem[] = [
      { id: 'a', x: 0, y: 0, width: 4, height: 2 },
      { id: 'b', x: 4, y: 0, width: 4, height: 2 },
      { id: 'c', x: 8, y: 0, width: 4, height: 2 },
    ];
    const result = reflowItems(items, 12, 8);
    const a = result.find((r) => r.id === 'a')!;
    const b = result.find((r) => r.id === 'b')!;
    const c = result.find((r) => r.id === 'c')!;
    expect(a.y).toBe(0);
    expect(b.y).toBe(0);
    // c wraps
    expect(c.y).toBe(2); // pushed down by height of first line (2)
    expect(c.x).toBe(0); // left-packed
  });

  it('preserves height unchanged', () => {
    const items: ReflowItem[] = [{ id: 'a', x: 0, y: 0, width: 12, height: 5 }];
    const result = reflowItems(items, 12, 8);
    expect(result[0]!.height).toBe(5);
  });

  it('full-width item expands to fill targetCols', () => {
    const items: ReflowItem[] = [{ id: 'a', x: 0, y: 0, width: 12, height: 3 }];
    const result = reflowItems(items, 12, 8);
    expect(result[0]!.width).toBe(8);
    expect(result[0]!.x).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// reflowItems — vertical gap preservation
// ---------------------------------------------------------------------------

describe('reflowItems — vertical gaps', () => {
  it('preserves vertical gap between rows', () => {
    // Row 1 at y=0, height=3, so ends at y=3.
    // Row 2 starts at y=6 → gap of 3.
    // Scaled gap: round(3*8/12) = 2. So row 2 should start at 3+2=5.
    const items: ReflowItem[] = [
      { id: 'a', x: 0, y: 0, width: 6, height: 3 },
      { id: 'b', x: 0, y: 6, width: 6, height: 2 },
    ];
    const result = reflowItems(items, 12, 8);
    const a = result.find((r) => r.id === 'a')!;
    const b = result.find((r) => r.id === 'b')!;
    expect(a.y).toBe(0);
    // b starts at: a.y + a.height + scaledGap = 0 + 3 + round(3*8/12) = 3 + 2 = 5
    expect(b.y).toBe(5);
  });

  it('places contiguous rows without extra gap', () => {
    // Row 1 ends at y=2, row 2 starts at y=2 — no gap
    const items: ReflowItem[] = [
      { id: 'a', x: 0, y: 0, width: 6, height: 2 },
      { id: 'b', x: 0, y: 2, width: 6, height: 2 },
    ];
    const result = reflowItems(items, 12, 8);
    const a = result.find((r) => r.id === 'a')!;
    const b = result.find((r) => r.id === 'b')!;
    expect(a.y).toBe(0);
    expect(b.y).toBe(2); // no gap → placed immediately after
  });
});

// ---------------------------------------------------------------------------
// reflowItems — NCNG-831 bug scenario
// ---------------------------------------------------------------------------

describe('reflowItems — NCNG-831 New Box screen', () => {
  /**
   * y=8: BoxName(x=0,w=5), isActive(x=6,w=1), BoxCategory(x=8,w=3)
   * Desktop 12 cols → tablet 8 cols.
   * Scaled widths:
   *   BoxName:     round(5*8/12) = round(3.33) = 3
   *   isActive:    round(1*8/12) = round(0.67) = 1
   *   BoxCategory: round(3*8/12) = round(2)    = 2
   * Total: 3+1+2 = 6 ≤ 8 — all fit on one line without wrapping.
   */
  it('avoids overlap on row with three items (BoxName, isActive, BoxCategory)', () => {
    const items: ReflowItem[] = [
      { id: 'boxName', x: 0, y: 8, width: 5, height: 4 },
      { id: 'isActive', x: 6, y: 8, width: 1, height: 4 },
      { id: 'boxCategory', x: 8, y: 8, width: 3, height: 4 },
    ];
    const result = reflowItems(items, 12, 8);
    const bName = result.find((r) => r.id === 'boxName')!;
    const isActive = result.find((r) => r.id === 'isActive')!;
    const bCat = result.find((r) => r.id === 'boxCategory')!;

    // All items must be on the same row
    expect(bName.y).toBe(isActive.y);
    expect(bName.y).toBe(bCat.y);

    // No overlaps — each item starts after the previous ends
    expect(isActive.x).toBe(bName.x + bName.width);
    expect(bCat.x).toBe(isActive.x + isActive.width);

    // Should fit within 8 cols
    expect(bCat.x + bCat.width).toBeLessThanOrEqual(8);
  });

  /**
   * y=39: conButtons container (x=0, w=12) containing Button(x=10, w=2).
   * Container at desktop w=12 → scaled to 8.
   * Child button at desktop x=10, w=2 within 12-col container:
   *   Within the container, scaleWidth(2, 12, 8) = round(2*8/12) = 1
   *   Container is 8 cols wide.  x=10 is beyond 8 cols — naive clamp would push to x=6.
   *   Reflow algorithm: single item in row → placed at x=0 (left-pack).
   *
   * When reflowed independently within the container scope, the button should NOT disappear.
   */
  it('does not lose child button inside conButtons container', () => {
    // Container itself (top-level)
    const containerItem: ReflowItem = { id: 'conButtons', x: 0, y: 39, width: 12, height: 4 };
    const containerResult = reflowItems([containerItem], 12, 8);
    expect(containerResult[0]!.width).toBe(8);

    // Children reflowed within container scope (12-col internal space → 8-col)
    const childItems: ReflowItem[] = [{ id: 'saveBtn', x: 10, y: 0, width: 2, height: 2 }];
    const childResult = reflowItems(childItems, 12, 8);

    // Button must exist (not disappear)
    expect(childResult).toHaveLength(1);
    expect(childResult[0]!.id).toBe('saveBtn');
    // Left-packed (only item in row → x=0)
    expect(childResult[0]!.x).toBe(0);
    expect(childResult[0]!.width).toBeGreaterThanOrEqual(1);
  });

  /**
   * Full layout test using buildReflowLookup: all top-level items from the
   * "New Box" screen, with conButtons and its child handled via container scope.
   *
   * Desktop layout (12 cols):
   *   y=0:  Container(x=0,w=11) — back(x=0,w=1) + save(x=9,w=2)
   *   y=3:  Label(x=0,w=3)
   *   y=8:  BoxName(x=0,w=5), isActive(x=6,w=1), BoxCategory(x=8,w=3)
   *   y=12: Description(x=0,w=7)
   *   y=39: conButtons(x=0,w=12) — Button(x=10,w=2)
   */
  it('correctly reflows the entire New Box screen to 8 cols', () => {
    // Top-level items (null containerId)
    const topLevel: ReflowItem[] = [
      { id: 'container', x: 0, y: 0, width: 11, height: 3 },
      { id: 'label', x: 0, y: 3, width: 3, height: 5 },
      { id: 'boxName', x: 0, y: 8, width: 5, height: 4 },
      { id: 'isActive', x: 6, y: 8, width: 1, height: 4 },
      { id: 'boxCategory', x: 8, y: 8, width: 3, height: 4 },
      { id: 'description', x: 0, y: 12, width: 7, height: 27 },
      { id: 'conButtons', x: 0, y: 39, width: 12, height: 4 },
    ];

    // Children of 'container'
    const containerChildren: ReflowItem[] = [
      { id: 'back', x: 0, y: 0, width: 1, height: 2 },
      { id: 'save', x: 9, y: 0, width: 2, height: 2 },
    ];

    // Children of 'conButtons'
    const conButtonsChildren: ReflowItem[] = [{ id: 'button', x: 10, y: 0, width: 2, height: 2 }];

    // All items with container scoping
    interface ItemWithContainer extends ReflowItem {
      containerId: string | null;
    }
    const allItems: ItemWithContainer[] = [
      ...topLevel.map((item) => ({ ...item, containerId: null })),
      ...containerChildren.map((item) => ({ ...item, containerId: 'container' })),
      ...conButtonsChildren.map((item) => ({ ...item, containerId: 'conButtons' })),
    ];

    const lookup = buildReflowLookup(allItems, (item) => (item as ItemWithContainer).containerId, 12, 8);

    // All items must be present in lookup
    expect(lookup.size).toBe(allItems.length);

    // No item should overflow the 8-col grid (x + width <= 8)
    lookup.forEach((item) => {
      expect(item.x + item.width).toBeLessThanOrEqual(8);
      expect(item.x).toBeGreaterThanOrEqual(0);
    });

    // The "button" child in conButtons should not have disappeared
    const button = lookup.get('button');
    expect(button).toBeDefined();
    expect(button!.width).toBeGreaterThanOrEqual(1);

    // The back+save children should not overlap each other
    const back = lookup.get('back')!;
    const save = lookup.get('save')!;
    // They're in the same row — save starts after back
    expect(save.x).toBeGreaterThanOrEqual(back.x + back.width);
  });
});

// ---------------------------------------------------------------------------
// buildReflowLookup
// ---------------------------------------------------------------------------

describe('buildReflowLookup', () => {
  it('returns empty map for empty items', () => {
    const lookup = buildReflowLookup([], () => null, 12, 8);
    expect(lookup.size).toBe(0);
  });

  it('reflows top-level and container children independently', () => {
    interface ExtItem extends ReflowItem {
      containerId: string | null;
    }
    const items: ExtItem[] = [
      // top-level: one wide item
      { id: 'top', x: 0, y: 0, width: 12, height: 2, containerId: null },
      // inside container-A: button at far right (x=10)
      { id: 'child', x: 10, y: 0, width: 2, height: 2, containerId: 'container-A' },
    ];

    const lookup = buildReflowLookup(items, (item) => (item as ExtItem).containerId, 12, 8);

    expect(lookup.size).toBe(2);

    // Top-level item: full width should map to 8
    expect(lookup.get('top')!.width).toBe(8);

    // Child item: x=10 in a 12-col container → reflowed to x=0 (left-pack)
    const child = lookup.get('child')!;
    expect(child.x).toBe(0);
    expect(child.width).toBeGreaterThanOrEqual(1);
  });

  it('handles multiple items in the same container scope', () => {
    interface ExtItem extends ReflowItem {
      containerId: string | null;
    }
    const items: ExtItem[] = [
      { id: 'a', x: 0, y: 0, width: 6, height: 2, containerId: null },
      { id: 'b', x: 6, y: 0, width: 6, height: 2, containerId: null },
    ];

    const lookup = buildReflowLookup(items, (item) => (item as ExtItem).containerId, 12, 8);

    const a = lookup.get('a')!;
    const b = lookup.get('b')!;

    // Both scaled to width 4 and placed side by side
    expect(a.width).toBe(4);
    expect(b.width).toBe(4);
    expect(a.x).toBe(0);
    expect(b.x).toBe(4);
  });
});
