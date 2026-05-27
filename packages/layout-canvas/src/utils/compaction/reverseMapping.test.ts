import { type CompactionItemIn } from './compact';
import { reverseMapToBase } from './reverseMapping';
import type { ResponsiveComponent } from '../../rgl-integration/types';

function makeComp(id: string, x: number, y: number, w: number, h: number): ResponsiveComponent {
  return {
    id,
    x,
    y,
    width: w,
    height: h,
    type: 'BTN' as any,
    content: '',
    currentState: 'normal' as any,
    containerId: null,
    static: false,
  };
}

function makeBase(id: string, x: number, y: number, w: number, h: number, hidden: boolean = false): CompactionItemIn {
  return { id, x, y, w, h, hidden };
}

describe('reverseMapToBase', () => {
  it('returns empty array for empty base with empty presented', () => {
    expect(reverseMapToBase([], [], [])).toEqual([]);
  });

  it('maps visible item position directly from presented', () => {
    const base: CompactionItemIn[] = [makeBase('a', 0, 0, 2, 2)];
    const old = [makeComp('a', 0, 0, 2, 2)];
    const updated = [makeComp('a', 1, 3, 2, 2)];
    const result = reverseMapToBase(updated, old, base);
    expect(result).toEqual([{ id: 'a', x: 1, y: 3, w: 2, h: 2, hidden: false }]);
  });

  it('preserves designed h/w for hidden-in-base items when collapsed in presented', () => {
    const base: CompactionItemIn[] = [makeBase('a', 0, 2, 2, 3, true)];
    const old = [makeComp('a', 0, 2, 2, 0)]; // collapsed
    const updated = [makeComp('a', 0, 2, 2, 0)]; // still collapsed
    const result = reverseMapToBase(updated, old, base);
    expect(result).toEqual([{ id: 'a', x: 0, y: 2, w: 2, h: 3, hidden: true }]);
  });

  it('omits items deleted from presented', () => {
    const base: CompactionItemIn[] = [makeBase('a', 0, 0, 2, 2), makeBase('b', 3, 0, 2, 2)];
    const old = [makeComp('a', 0, 0, 2, 2), makeComp('b', 3, 0, 2, 2)];
    const updated = [makeComp('a', 0, 0, 2, 2)]; // b removed
    const result = reverseMapToBase(updated, old, base);
    expect(result.find((c) => c.id === 'b')).toBeUndefined();
  });

  it('adds new items from presented not in base', () => {
    const base: CompactionItemIn[] = [makeBase('a', 0, 0, 2, 2)];
    const old = [makeComp('a', 0, 0, 2, 2)];
    const updated = [makeComp('a', 0, 0, 2, 2), makeComp('new', 3, 0, 1, 1)];
    const result = reverseMapToBase(updated, old, base);
    expect(result.find((c) => c.id === 'new')).toMatchObject({ id: 'new', x: 3, y: 0, w: 1, h: 1, hidden: false });
  });
});
