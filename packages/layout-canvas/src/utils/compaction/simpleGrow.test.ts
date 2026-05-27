import { expect } from '@jest/globals';
import { collides, CompactionItem, CompactionItemIn, DynamicData } from './compact';
import { simpleGrow } from './simpleGrow';
import { areCompactionItemArraysEqual } from './gridItemArrayEqualityTester';

function assertNoOutputCollisions(output: CompactionItem[]): void {
  const visible = output.filter((item) => item.h > 0);
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const a = visible[i]!;
      const b = visible[j]!;
      if (collides(a, b)) {
        throw new Error(
          `collision between ${a.id} {x:${a.x},y:${a.y},w:${a.w},h:${a.h}} and ${b.id} {x:${b.x},y:${b.y},w:${b.w},h:${b.h}}`,
        );
      }
    }
  }
}

describe('simpleGrow', () => {
  beforeAll(() => {
    expect.addEqualityTesters([areCompactionItemArraysEqual]);
  });

  it('returns empty array for empty base', () => {
    expect(simpleGrow([], [])).toEqual([]);
  });

  /*
   * Regression: all items hidden in base, all become visible in dynamic.
   * Several items share the same base y=0, others are below.
   * The simpleGrow output had c4 (x=1,y=4,w=1,h=2) colliding with
   * c6 (x=0,y=5,w=2,h=1) at cell (1,5).
   *
   * === BASE ===
   *   [c0..c6 | all hidden-in-base]
   * y\x 0        1
   *    ----------------
   *   0 c1/c3/c5 c3
   *   1 c3/c6    c3/c6
   *   2 .        c0
   *   3 .        c4
   *   4 .        c4
   */
  /*
   * === BASE ===
   *   [vis=visible, ins=hidden-in-base] — same row (y=0), same column (x=0)
   * y\x 0
   *    ---
   *   0 vis / ins(h)
   *   1 vis
   *
   * === DYNAMIC ===
   *   ins becomes visible (hidden=false)
   *
   * === EXPECTED ===
   *   ins placed first (insertFirst ordering) → ins.y=0, vis pushed to y=1
   *   i.e. ins.y <= vis.y in output
   */
  it('base-hidden item revealed in the same row is placed above the base-visible item', () => {
    const base: CompactionItemIn[] = [
      { id: 'vis', x: 0, y: 0, w: 1, h: 2, hidden: false },
      { id: 'ins', x: 0, y: 0, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'vis', hidden: false },
      { id: 'ins', hidden: false },
    ];
    const output = simpleGrow(base, dynamic);
    const insItem = output.find((item) => item.id === 'ins')!;
    const visItem = output.find((item) => item.id === 'vis')!;
    expect(insItem).toBeDefined();
    expect(visItem).toBeDefined();
    expect(insItem.y).toBeLessThanOrEqual(visItem.y);
    assertNoOutputCollisions(output);
  });

  /*
   * === BASE ===
   *   [h1=hidden, h2=hidden] — different rows, overlapping x-column
   * y\x 0
   *    ---
   *   0 h1(h)
   *   1 h1(h) / h2(h)
   *
   * === DYNAMIC ===
   *   h1 and h2 both become visible
   *
   * === EXPECTED ===
   *   h1 stays at y=0 (h=2), h2 is pushed below h1 to y=2
   */
  it('hidden item in a later row is pushed below a revealed hidden item in an earlier row', () => {
    const base: CompactionItemIn[] = [
      { id: 'h1', x: 0, y: 0, w: 1, h: 2, hidden: true },
      { id: 'h2', x: 0, y: 1, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'h1', hidden: false },
      { id: 'h2', hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'h1', x: 0, y: 0, w: 1, h: 2 },
      { id: 'h2', x: 0, y: 2, w: 1, h: 0 },
    ];
    expect(simpleGrow(base, dynamic)).toEqual(expected);
  });

  it('all-hidden items becoming visible produce no output collisions', () => {
    const base: CompactionItemIn[] = [
      { id: 'c0', x: 1, y: 2, w: 1, h: 1, hidden: true },
      { id: 'c1', x: 0, y: 0, w: 1, h: 1, hidden: true },
      { id: 'c3', x: 0, y: 0, w: 2, h: 2, hidden: true },
      { id: 'c4', x: 1, y: 3, w: 1, h: 2, hidden: true },
      { id: 'c5', x: 0, y: 0, w: 1, h: 2, hidden: true },
      { id: 'c6', x: 0, y: 1, w: 2, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = base.map((c) => ({ id: c.id, hidden: false }));
    assertNoOutputCollisions(simpleGrow(base, dynamic));
  });
});
