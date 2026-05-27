import {
  componentsToGridItems,
  buildDynamicData,
  applyCompactedLayout,
  sortedByExistingOrder,
} from './compactionAdapters';
import { ResponsiveComponent } from '../../rgl-integration/types';
import { CurrentState } from '@m-next/types';
import type { CompactionItem } from './compact';

// Helper to create a minimal ResponsiveComponent
const createComponent = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  overrides?: Partial<ResponsiveComponent>,
): ResponsiveComponent => ({
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
  ...overrides,
});

const createHiddenComponent = (id: string, x: number, y: number, width: number, height: number): ResponsiveComponent =>
  createComponent(id, x, y, width, height, {
    responsive: {
      desktop: {
        ...createComponent(id, x, y, width, height),
        currentState: CurrentState.HIDDEN,
      },
    },
  });

describe('compactionAdapters', () => {
  describe('componentsToGridItems', () => {
    it('converts root components to CompactionItemIn format', () => {
      const components = [createComponent('a', 0, 0, 4, 2), createComponent('b', 4, 0, 4, 2)];
      const result = componentsToGridItems(components, 'desktop', 'designer');
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: 'a', x: 0, y: 0, w: 4, h: 2, hidden: false },
        { id: 'b', x: 4, y: 0, w: 4, h: 2, hidden: false },
      ]);
    });

    it('filters out container children', () => {
      const components = [
        createComponent('root', 0, 0, 12, 4),
        createComponent('child', 0, 0, 4, 2, { containerId: 'root' }),
      ];
      const result = componentsToGridItems(components, 'desktop', 'designer');
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('root');
    });

    it('derives hidden=true for HIDDEN currentState (desktop)', () => {
      const components = [createHiddenComponent('a', 0, 0, 4, 2)];
      const result = componentsToGridItems(components, 'desktop', 'designer');
      expect(result[0]!.hidden).toBe(true);
    });

    it('derives hidden=false for REGULAR currentState (desktop)', () => {
      const components = [createComponent('a', 0, 0, 4, 2)];
      const result = componentsToGridItems(components, 'desktop', 'designer');
      expect(result[0]!.hidden).toBe(false);
    });

    it('respects tablet override when resolution is tablet', () => {
      const comp = createComponent('a', 0, 0, 4, 2, {
        responsive: {
          desktop: { ...createComponent('a', 0, 0, 4, 2), currentState: CurrentState.REGULAR },
          tabletOverride: { ...createComponent('a', 0, 0, 4, 2), currentState: CurrentState.HIDDEN },
        },
      });
      const desktopResult = componentsToGridItems([comp], 'desktop', 'designer');
      expect(desktopResult[0]!.hidden).toBe(false);

      const tabletResult = componentsToGridItems([comp], 'tablet', 'designer');
      expect(tabletResult[0]!.hidden).toBe(true);
    });

    it('uses runtime visibility (control.visible) in runtime mode', () => {
      const comp = createComponent('a', 0, 0, 4, 2, { visible: false } as any);
      const result = componentsToGridItems([comp], 'desktop', 'runtime');
      expect(result[0]!.hidden).toBe(true);
    });
  });

  describe('buildDynamicData', () => {
    it('omits height when no observed data', () => {
      const components = [createComponent('a', 0, 0, 4, 3)];
      const result = buildDynamicData(components, 'desktop', 'designer');
      expect(result).toEqual([{ id: 'a', height: undefined, hidden: false }]);
    });

    it('uses max(base, observed) for height', () => {
      const components = [createComponent('a', 0, 0, 4, 2)];
      const observed = new Map([['a', 5]]);
      const result = buildDynamicData(components, 'desktop', 'designer', observed);
      expect(result[0]!.height).toBe(5);
    });

    it('passes observed height through (min-height enforced in compact())', () => {
      const components = [createComponent('a', 0, 0, 4, 4)];
      const observed = new Map([['a', 2]]);
      const result = buildDynamicData(components, 'desktop', 'designer', observed);
      expect(result[0]!.height).toBe(2);
    });

    it('filters container children', () => {
      const components = [
        createComponent('root', 0, 0, 12, 4),
        createComponent('child', 0, 0, 4, 2, { containerId: 'root' }),
      ];
      const result = buildDynamicData(components, 'desktop', 'designer');
      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('root');
    });

    it('derives hidden state for each component', () => {
      const components = [createComponent('a', 0, 0, 4, 2), createHiddenComponent('b', 4, 0, 4, 2)];
      const result = buildDynamicData(components, 'desktop', 'designer');
      expect(result[0]!.hidden).toBe(false);
      expect(result[1]!.hidden).toBe(true);
    });
  });

  describe('sortedByExistingOrder', () => {
    it('returns existing items in the same relative order as existingItems', () => {
      const existing = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const newItems = [{ id: 'c' }, { id: 'a' }, { id: 'b' }];
      const result = sortedByExistingOrder(existing, newItems);
      expect(result.map((r) => r.id)).toEqual(['a', 'b', 'c']);
    });

    it('appends new items after existing items', () => {
      const existing = [{ id: 'a' }, { id: 'b' }];
      const newItems = [{ id: 'b' }, { id: 'new1' }, { id: 'a' }, { id: 'new2' }];
      const result = sortedByExistingOrder(existing, newItems);
      expect(result.map((r) => r.id)).toEqual(['a', 'b', 'new1', 'new2']);
    });

    it('does not return items deleted from newItems', () => {
      const existing = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const newItems = [{ id: 'a' }, { id: 'c' }]; // 'b' deleted
      const result = sortedByExistingOrder(existing, newItems);
      expect(result.map((r) => r.id)).toEqual(['a', 'c']);
    });

    it('preserves the full object (generic type T)', () => {
      type Item = { id: string; value: number };
      const existing: Item[] = [
        { id: 'x', value: 1 },
        { id: 'y', value: 2 },
      ];
      const newItems: Item[] = [
        { id: 'y', value: 99 },
        { id: 'x', value: 42 },
      ];
      const result = sortedByExistingOrder(existing, newItems);
      expect(result).toEqual([
        { id: 'x', value: 42 },
        { id: 'y', value: 99 },
      ]);
    });

    it('returns only new items when existing is empty', () => {
      const result = sortedByExistingOrder([], [{ id: 'a' }, { id: 'b' }]);
      expect(result.map((r) => r.id)).toEqual(['a', 'b']);
    });

    it('returns empty array when newItems is empty', () => {
      const result = sortedByExistingOrder([{ id: 'a' }], []);
      expect(result).toHaveLength(0);
    });
  });

  describe('applyCompactedLayout', () => {
    it('updates y/h for compacted items', () => {
      const components = [createComponent('a', 0, 0, 4, 2), createComponent('b', 0, 4, 4, 2)];
      const compacted: CompactionItem[] = [
        { id: 'a', x: 0, y: 0, w: 4, h: 2 },
        { id: 'b', x: 0, y: 2, w: 4, h: 2 },
      ];
      const result = applyCompactedLayout(components, compacted);
      expect(result[1]!.y).toBe(2);
      expect(result[1]!.height).toBe(2);
    });

    it('preserves reference equality when position unchanged', () => {
      const comp = createComponent('a', 0, 0, 4, 2);
      const compacted: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 4, h: 2 }];
      const result = applyCompactedLayout([comp], compacted);
      expect(result[0]).toBe(comp);
    });

    it('returns new object when position changed', () => {
      const comp = createComponent('a', 0, 4, 4, 2);
      const compacted: CompactionItem[] = [{ id: 'a', x: 0, y: 2, w: 4, h: 2 }];
      const result = applyCompactedLayout([comp], compacted);
      expect(result[0]).not.toBe(comp);
      expect(result[0]!.y).toBe(2);
    });

    it('passes through container children untouched', () => {
      const parent = createComponent('root', 0, 0, 12, 6);
      const child = createComponent('child', 0, 0, 4, 2, { containerId: 'root' });
      const compacted: CompactionItem[] = [{ id: 'root', x: 0, y: 0, w: 12, h: 6 }];
      const result = applyCompactedLayout([parent, child], compacted);
      expect(result[1]).toBe(child);
    });

    it('passes through hidden items not in compacted output', () => {
      const visible = createComponent('a', 0, 0, 4, 2);
      const hidden = createHiddenComponent('b', 0, 2, 4, 2);
      const compacted: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 4, h: 2 }];
      const result = applyCompactedLayout([visible, hidden], compacted);
      expect(result[0]).toBe(visible);
      expect(result[1]).toBe(hidden);
    });
  });
});
