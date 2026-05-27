import { expect } from '@jest/globals';
import { collides, CompactionItemIn, DynamicData, CompactionItem } from './compact';
import { simpleGrow } from './simpleGrow';
import { reverseMapToBase } from './reverseMapping';
import type { ResponsiveComponent } from '../../rgl-integration/types';
import { randomInt, formatDebug, formatGrid, formatPositionTrace } from './propertyHelpers';

// --- Generation parameters ---

const MAX_COORD = 4;
const MIN_SIZE = 1;
const MAX_SIZE = 3;
const HEIGHT_DELTAS = [-2, -1, -1, +1, +1, +2] as const;
const WIDTH_DELTAS = [-2, -1, +1, +2] as const;
const MOVE_DELTAS = [-3, -2, -1, +1, +2, +3] as const;
const RUNS = 10000;

// --- Helpers ---

function hasBaseCollision(items: CompactionItemIn[]): boolean {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]!;
      const b = items[j]!;
      if (collides({ ...a, h: a.hidden ? 0 : a.h }, { ...b, h: b.hidden ? 0 : b.h })) return true;
    }
  }
  return false;
}

function hasNegativeCoords(items: CompactionItemIn[]): boolean {
  return items.some((item) => item.x < 0 || item.y < 0);
}

function hasOutputCollision(items: CompactionItem[]): boolean {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (collides(items[i]!, items[j]!)) return true;
    }
  }
  return false;
}

function toResponsive(c: CompactionItem | CompactionItemIn): ResponsiveComponent {
  return {
    id: c.id,
    x: c.x,
    y: c.y,
    width: c.w,
    height: c.h,
    type: 'BTN' as any,
    content: '',
    currentState: 'normal' as any,
    containerId: null,
    static: false,
  };
}

/**
 * Build 3 non-colliding base items, all visible (hidden=false).
 * Dynamic has all hidden=false and no height override.
 */
function buildRandomLayout(): { base: CompactionItemIn[]; dynamic: DynamicData[] } | null {
  const base: CompactionItemIn[] = [];
  for (let k = 0; k < 3; k++) {
    let attempts = 0;
    let candidate: CompactionItemIn;
    do {
      candidate = {
        id: `comp-${k}`,
        x: randomInt(0, MAX_COORD),
        y: randomInt(0, MAX_COORD),
        w: randomInt(MIN_SIZE, MAX_SIZE),
        h: randomInt(MIN_SIZE, MAX_SIZE),
        hidden: false,
      };
      attempts++;
    } while (attempts < 50 && hasBaseCollision([...base, candidate]));

    if (hasBaseCollision([...base, candidate])) return null;
    base.push(candidate);
  }

  const dynamic: DynamicData[] = base.map((c) => ({ id: c.id, hidden: false }));
  return { base, dynamic };
}

/**
 * Apply a random positional/size mutation to one visible item.
 * Returns null if the result has output collisions or is otherwise invalid.
 */
function applyRandomMutation(
  oldPresented: CompactionItem[],
): { newPresented: CompactionItem[]; targetId: string } | null {
  const visible = oldPresented.filter((item) => item.h > 0);
  if (visible.length === 0) return null;

  const target = visible[randomInt(0, visible.length - 1)]!;

  type Mutation =
    | { kind: 'height'; dh: number }
    | { kind: 'width'; dw: number }
    | { kind: 'xmove'; dx: number }
    | { kind: 'ymove'; dy: number };

  const mutKind = (['height', 'width', 'xmove', 'ymove'] as const)[randomInt(0, 3)]!;
  let mutation: Mutation;
  switch (mutKind) {
    case 'height':
      mutation = { kind: 'height', dh: HEIGHT_DELTAS[randomInt(0, HEIGHT_DELTAS.length - 1)]! };
      break;
    case 'width':
      mutation = { kind: 'width', dw: WIDTH_DELTAS[randomInt(0, WIDTH_DELTAS.length - 1)]! };
      break;
    case 'xmove':
      mutation = { kind: 'xmove', dx: MOVE_DELTAS[randomInt(0, MOVE_DELTAS.length - 1)]! };
      break;
    case 'ymove':
      mutation = { kind: 'ymove', dy: MOVE_DELTAS[randomInt(0, MOVE_DELTAS.length - 1)]! };
      break;
  }

  if (mutation.kind === 'xmove' && target.x + mutation.dx < 0) return null;
  if (mutation.kind === 'ymove' && target.y + mutation.dy < 0) return null;

  const newPresented: CompactionItem[] = oldPresented.map((item) => {
    if (item.id !== target.id) return item;
    switch (mutation.kind) {
      case 'height':
        return { ...item, h: Math.max(1, item.h + mutation.dh) };
      case 'width':
        return { ...item, w: Math.max(1, item.w + mutation.dw) };
      case 'xmove':
        return { ...item, x: item.x + mutation.dx };
      case 'ymove':
        return { ...item, y: item.y + mutation.dy };
    }
  });

  if (hasOutputCollision(newPresented)) return null;
  return { newPresented, targetId: target.id };
}

/**
 * Assert that reverseMapToBase wrote the correct x, w, and h values for each item.
 *
 * Rules:
 *   x  — always taken from newPresented
 *   w  — always taken from newPresented
 *   h  — taken from newPresented when the item is visible there (np.h > 0);
 *        when the item is hidden (np.h === 0) h must NOT change to 0 — it keeps base.h
 *
 * Items absent from base (new insertions) or absent from newPresented (deletions) are skipped.
 */
function checkXWH(
  iteration: number,
  label: string,
  base: CompactionItemIn[],
  newPresented: CompactionItem[],
  newBase: CompactionItemIn[],
  idToShort: Map<string, string>,
  getExtra: () => string[],
): void {
  const npMap = new Map(newPresented.map((c) => [c.id, c]));
  const baseMap = new Map(base.map((b) => [b.id, b]));
  for (const nb of newBase) {
    const np = npMap.get(nb.id);
    const b = baseMap.get(nb.id);
    if (!np || !b) continue;
    const xOk = nb.x === np.x;
    const wOk = nb.w === np.w;
    const hOk = np.h > 0 ? nb.h === np.h : nb.h === b.h;
    if (!xOk || !wOk || !hOk) {
      const issues: string[] = [];
      if (!xOk) issues.push(`x: newBase=${nb.x} ≠ np.x=${np.x}`);
      if (!wOk) issues.push(`w: newBase=${nb.w} ≠ np.w=${np.w}`);
      if (!hOk) {
        if (np.h > 0) {
          issues.push(`h: newBase=${nb.h} ≠ np.h=${np.h}  (visible → h must come from presented)`);
        } else {
          issues.push(`h: newBase=${nb.h} ≠ base.h=${b.h}  (hidden → h must not change to 0)`);
        }
      }
      throw new Error(
        [
          `iteration: ${iteration}`,
          `FAIL ${label} x/w/h — id=${nb.id} label="${idToShort.get(nb.id)}"`,
          ...issues.map((s) => `  ${s}`),
          '',
          formatGrid('BASE', base, idToShort),
          '',
          formatGrid('NEW PRESENTED', newPresented, idToShort),
          '',
          formatGrid('NEW BASE', newBase, idToShort),
          '',
          '--- raw ---',
          ...getExtra(),
        ].join('\n'),
      );
    }
  }
}

// --- Property tests ---

describe('apply visibility data to simple grow -> reverseMap returns same base', () => {
  /**
   * With all-visible base items and no height overrides, simpleGrow is a near-identity:
   * each item stays at its base y (no insertFirst growth, so cumulativeOffset is 0 or
   * determined only by visible-item heights). Toggling hidden flags in dynamic therefore
   * produces no positional delta, so reverseMapToBase must return base unchanged.
   */
  test(`holds for ${RUNS} iterations`, () => {
    let skipped = 0;

    for (let iteration = 0; iteration < RUNS; iteration++) {
      const layout = buildRandomLayout();
      if (!layout) {
        skipped++;
        continue;
      }
      const { base } = layout;

      // dynamic1: randomly hide some items (no height override)
      const dynamic1: DynamicData[] = base.map((c) => ({
        id: c.id,
        hidden: Math.random() < 0.5,
      }));
      const oldPresented = simpleGrow(base, dynamic1);

      // dynamic2: independently toggle hidden (no height override)
      const dynamic2: DynamicData[] = base.map((c) => ({
        id: c.id,
        hidden: Math.random() < 0.5,
      }));
      const newPresented = simpleGrow(base, dynamic2);

      const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

      const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

      if (hasNegativeCoords(newBase)) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            'FAIL P1: newBase has negative x or y coordinates',
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('NEW BASE  ← negative coords here!', newBase, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }

      for (const item of base) {
        const newItem = newBase.find((c) => c.id === item.id);
        const mismatch =
          !newItem || newItem.x !== item.x || newItem.y !== item.y || newItem.w !== item.w || newItem.h !== item.h;
        if (mismatch) {
          throw new Error(
            [
              `iteration: ${iteration}`,
              `FAIL P1: base drifted for id=${item.id} label="${idToShort.get(item.id)}"`,
              `  base:    {x:${item.x}, y:${item.y}, w:${item.w}, h:${item.h}}`,
              newItem
                ? `  newBase: {x:${newItem.x}, y:${newItem.y}, w:${newItem.w}, h:${newItem.h}}  ← should equal base`
                : '  newBase: MISSING',
              '',
              formatGrid('BASE', base, idToShort),
              '',
              formatGrid('OLD PRESENTED (dynamic1)', oldPresented, idToShort),
              '',
              formatGrid('NEW PRESENTED (dynamic2)', newPresented, idToShort),
              '',
              formatGrid('NEW BASE  ← should equal BASE', newBase, idToShort),
              '',
              formatPositionTrace(
                'POSITION TRACE (old_dy = np_y − op_y; should be 0 for visibility-only changes)',
                base,
                oldPresented,
                newPresented,
                newBase,
                idToShort,
              ),
              '',
              '--- raw ---',
              formatDebug('base', base),
              formatDebug('dynamic1', dynamic1),
              formatDebug('dynamic2', dynamic2),
              formatDebug('oldPresented', oldPresented),
              formatDebug('newPresented', newPresented),
              formatDebug('newBase', newBase),
            ].join('\n'),
          );
        }
      }

      checkXWH(iteration, 'P1', base, newPresented, newBase, idToShort, () => [
        formatDebug('base', base),
        formatDebug('dynamic2', dynamic2),
        formatDebug('newPresented', newPresented),
        formatDebug('newBase', newBase),
      ]);
    }

    expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
  });
});

describe('apply random mutation -> reverseMap. new base should not have any collisions', () => {
  /**
   * Same setup as P1 but with all-visible dynamic and a single-item mutation applied
   * in presented space. The base produced by reverseMapToBase must be collision-free
   * (treating hidden items as h=0).
   */
  test(`holds for ${RUNS} iterations`, () => {
    let skipped = 0;

    for (let iteration = 0; iteration < RUNS; iteration++) {
      const layout = buildRandomLayout();
      if (!layout) {
        skipped++;
        continue;
      }
      const { base, dynamic } = layout;

      const oldPresented = simpleGrow(base, dynamic);

      const mut = applyRandomMutation(oldPresented);
      if (!mut) {
        skipped++;
        continue;
      }
      const { newPresented } = mut;

      const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

      const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

      if (hasNegativeCoords(newBase)) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            'FAIL P3: newBase has negative x or y coordinates',
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('OLD PRESENTED', oldPresented, idToShort),
            '',
            formatGrid('NEW PRESENTED (after mutation)', newPresented, idToShort),
            '',
            formatGrid('NEW BASE  ← negative coords here!', newBase, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('oldPresented', oldPresented),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }

      if (hasBaseCollision(newBase)) {
        // Identify which pairs collide so the trace can annotate them
        const collidingIds = new Set<string>();
        for (let i = 0; i < newBase.length; i++) {
          for (let j = i + 1; j < newBase.length; j++) {
            const a = newBase[i]!;
            const b2 = newBase[j]!;
            if (collides({ ...a, h: a.hidden ? 0 : a.h }, { ...b2, h: b2.hidden ? 0 : b2.h })) {
              collidingIds.add(a.id);
              collidingIds.add(b2.id);
            }
          }
        }
        const collisionPairs: string[] = [];
        for (let i = 0; i < newBase.length; i++) {
          for (let j = i + 1; j < newBase.length; j++) {
            const a = newBase[i]!;
            const b2 = newBase[j]!;
            if (collides({ ...a, h: a.hidden ? 0 : a.h }, { ...b2, h: b2.hidden ? 0 : b2.h })) {
              collisionPairs.push(
                `  ${idToShort.get(a.id)}=${a.id} (y:${a.y} h:${a.h}) ↔ ${idToShort.get(b2.id)}=${b2.id} (y:${b2.y} h:${b2.h})`,
              );
            }
          }
        }
        throw new Error(
          [
            `iteration: ${iteration}`,
            'FAIL P3: newBase has collisions among visible items',
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('OLD PRESENTED', oldPresented, idToShort),
            '',
            formatGrid('NEW PRESENTED (after mutation)', newPresented, idToShort),
            '',
            formatGrid('NEW BASE  ← collisions here!', newBase, idToShort),
            '',
            formatPositionTrace(
              'POSITION TRACE (DRIFT expected for mutated item; flag = collides in newBase)',
              base,
              oldPresented,
              newPresented,
              newBase,
              idToShort,
            ),
            '',
            'colliding pairs in newBase:',
            ...collisionPairs,
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('oldPresented', oldPresented),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }

      checkXWH(iteration, 'P3', base, newPresented, newBase, idToShort, () => [
        formatDebug('base', base),
        formatDebug('dynamic', dynamic),
        formatDebug('newPresented', newPresented),
        formatDebug('newBase', newBase),
      ]);
    }

    expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
  });
});

describe('apply random mutation -> reverseMap -> simpleGrow: mutated item round-trips to same position', () => {
  /**
   * With all-visible dynamic, simpleGrow is effectively an identity (no hidden-item
   * gaps, so cumulativeOffset stays 0). After a single-item mutation in presented
   * space, reverseMapToBase writes the delta back to base; re-running simpleGrow on
   * the new base must reproduce the exact mutated position for the target item.
   * Other items are not checked — they may legitimately shift due to collision
   * resolution inside reverseMapToBase.
   */
  test(`holds for ${RUNS} iterations`, () => {
    let skipped = 0;

    for (let iteration = 0; iteration < RUNS; iteration++) {
      const layout = buildRandomLayout();
      if (!layout) {
        skipped++;
        continue;
      }
      const { base, dynamic } = layout;

      const oldPresented = simpleGrow(base, dynamic);

      const mut = applyRandomMutation(oldPresented);
      if (!mut) {
        skipped++;
        continue;
      }
      const { newPresented, targetId } = mut;

      const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);
      const presented2 = simpleGrow(newBase, dynamic);

      const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

      const expected = newPresented.find((c) => c.id === targetId)!;
      const actual = presented2.find((c) => c.id === targetId);

      const mismatch =
        !actual ||
        actual.x !== expected.x ||
        actual.y !== expected.y ||
        actual.w !== expected.w ||
        actual.h !== expected.h;

      if (mismatch) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            `FAIL P4: round-trip mismatch for id=${targetId} label="${idToShort.get(targetId)}"`,
            `  expected (newPresented): {x:${expected.x}, y:${expected.y}, w:${expected.w}, h:${expected.h}}`,
            actual
              ? `  actual   (presented2):  {x:${actual.x}, y:${actual.y}, w:${actual.w}, h:${actual.h}}`
              : '  actual   (presented2):  MISSING',
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('OLD PRESENTED', oldPresented, idToShort),
            '',
            formatGrid('NEW PRESENTED (after mutation)', newPresented, idToShort),
            '',
            formatGrid('NEW BASE (reverseMap)', newBase, idToShort),
            '',
            formatGrid(
              'PRESENTED2 (simpleGrow of newBase)  ← target item should match NEW PRESENTED',
              presented2,
              idToShort,
            ),
            '',
            formatPositionTrace(
              'POSITION TRACE (mutated item should round-trip; others may drift)',
              base,
              oldPresented,
              newPresented,
              newBase,
              idToShort,
            ),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('oldPresented', oldPresented),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
            formatDebug('presented2', presented2),
          ].join('\n'),
        );
      }

      checkXWH(iteration, 'P4', base, newPresented, newBase, idToShort, () => [
        formatDebug('base', base),
        formatDebug('dynamic', dynamic),
        formatDebug('newPresented', newPresented),
        formatDebug('newBase', newBase),
      ]);
    }

    expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
  });
});

describe('insert new item -> reverseMap: inserted item appears in base at presented position, no collisions', () => {
  /**
   * newPresented is built by inserting a new item at a random position using the
   * push-down rule: if the item collides with any existing presented item, all items
   * at y >= newItem.y are first shifted down by newItem.h to make room.
   *
   * After reverseMapToBase:
   *   P5a: the inserted item is present in newBase at its exact presented position
   *   P5b: newBase is collision-free
   */
  test(`holds for ${RUNS} iterations`, () => {
    let skipped = 0;

    for (let iteration = 0; iteration < RUNS; iteration++) {
      const layout = buildRandomLayout();
      if (!layout) {
        skipped++;
        continue;
      }
      const { base, dynamic } = layout;
      const oldPresented = simpleGrow(base, dynamic);

      const newItem: CompactionItem = {
        id: 'inserted',
        x: randomInt(0, MAX_COORD),
        y: randomInt(0, MAX_COORD),
        w: randomInt(MIN_SIZE, MAX_SIZE),
        h: randomInt(MIN_SIZE, MAX_SIZE),
      };

      // Push-down rule: if newItem collides with any existing item, shift all items
      // at y >= newItem.y down by newItem.h before inserting.
      const hasCollisionWithExisting = oldPresented.some((op) => collides(newItem, op));
      const shifted = hasCollisionWithExisting
        ? oldPresented.map((op) => (op.y >= newItem.y ? { ...op, y: op.y + newItem.h } : op))
        : oldPresented;
      const newPresented: CompactionItem[] = [...shifted, newItem];

      // Skip if spanning items still cause a collision after the shift.
      if (hasOutputCollision(newPresented)) {
        skipped++;
        continue;
      }

      const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

      const allIds = new Map<string, string>([
        ...base.map((c, i): [string, string] => [c.id, String(i)]),
        [newItem.id, 'N'],
      ]);

      // P5a: inserted item must appear in newBase at its presented position
      const insertedInBase = newBase.find((nb) => nb.id === newItem.id);
      if (
        !insertedInBase ||
        insertedInBase.x !== newItem.x ||
        insertedInBase.y !== newItem.y ||
        insertedInBase.w !== newItem.w ||
        insertedInBase.h !== newItem.h
      ) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            !insertedInBase
              ? 'FAIL P5a: inserted item missing from newBase'
              : 'FAIL P5a: inserted item has wrong position in newBase',
            !insertedInBase ? '' : `  expected: {x:${newItem.x}, y:${newItem.y}, w:${newItem.w}, h:${newItem.h}}`,
            !insertedInBase
              ? ''
              : `  actual:   {x:${insertedInBase.x}, y:${insertedInBase.y}, w:${insertedInBase.w}, h:${insertedInBase.h}}`,
            '',
            formatGrid('BASE', base, allIds),
            '',
            formatGrid('OLD PRESENTED', oldPresented, allIds),
            '',
            formatGrid(`NEW PRESENTED (${hasCollisionWithExisting ? 'push-down ' : ''}insert N)`, newPresented, allIds),
            '',
            formatGrid('NEW BASE  ← N should be at presented position', newBase, allIds),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('newItem', newItem),
            formatDebug('hadCollision', hasCollisionWithExisting),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }

      // P5b: newBase must be collision-free
      if (hasBaseCollision(newBase)) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            'FAIL P5b: newBase has collisions after insert',
            '',
            formatGrid('BASE', base, allIds),
            '',
            formatGrid('OLD PRESENTED', oldPresented, allIds),
            '',
            formatGrid(`NEW PRESENTED (${hasCollisionWithExisting ? 'push-down ' : ''}insert N)`, newPresented, allIds),
            '',
            formatGrid('NEW BASE  ← collisions here!', newBase, allIds),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('newItem', newItem),
            formatDebug('hadCollision', hasCollisionWithExisting),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }
    }

    expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
  });
});

describe('delete item -> reverseMap: deleted item absent, others preserved', () => {
  /**
   * When newPresented omits an item that was in oldPresented and base, reverseMapToBase
   * must not include that item in newBase. All other base items must still be present.
   */
  test(`holds for ${RUNS} iterations`, () => {
    let skipped = 0;

    for (let iteration = 0; iteration < RUNS; iteration++) {
      const layout = buildRandomLayout();
      if (!layout) {
        skipped++;
        continue;
      }
      const { base, dynamic } = layout;
      const oldPresented = simpleGrow(base, dynamic);

      // Drop a random item from presented (simulate user delete)
      const deleteIdx = randomInt(0, base.length - 1);
      const deletedId = base[deleteIdx]!.id;
      const newPresented = oldPresented.filter((c) => c.id !== deletedId);

      const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

      const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

      // P6a: deleted item must NOT be in newBase
      const deletedInBase = newBase.find((nb) => nb.id === deletedId);
      if (deletedInBase) {
        throw new Error(
          [
            `iteration: ${iteration}`,
            `FAIL P6a: deleted item ${deletedId} label="${idToShort.get(deletedId)}" still present in newBase`,
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('NEW PRESENTED (item deleted)', newPresented, idToShort),
            '',
            formatGrid('NEW BASE  ← deleted item should be gone!', newBase, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('deletedId', deletedId),
            formatDebug('newPresented', newPresented),
            formatDebug('newBase', newBase),
          ].join('\n'),
        );
      }

      // P6b: all other base items must still be in newBase
      for (const b of base) {
        if (b.id === deletedId) continue;
        const nb = newBase.find((c) => c.id === b.id);
        if (!nb) {
          throw new Error(
            [
              `iteration: ${iteration}`,
              `FAIL P6b: non-deleted item ${b.id} label="${idToShort.get(b.id)}" missing from newBase`,
              '',
              formatGrid('BASE', base, idToShort),
              '',
              formatGrid('NEW PRESENTED (item deleted)', newPresented, idToShort),
              '',
              formatGrid('NEW BASE  ← item should be here!', newBase, idToShort),
              '',
              '--- raw ---',
              formatDebug('base', base),
              formatDebug('dynamic', dynamic),
              formatDebug('deletedId', deletedId),
              formatDebug('newPresented', newPresented),
              formatDebug('newBase', newBase),
            ].join('\n'),
          );
        }
      }
    }

    expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
  });
});

// describe('P1 – hidden toggle does not drift base', () => {
//   /**
//    * When only hidden flags are toggled (no height changes, no base-hidden items),
//    * simpleGrow y-positions for all items equal their base positions (no group grows,
//    * so cumulativeOffset stays 0). reverseMapToBase therefore sees no positional delta
//    * and must return base unchanged.
//    */
//   test(`holds for ${RUNS} iterations`, () => {
//     let skipped = 0;

//     for (let iteration = 0; iteration < RUNS; iteration++) {
//       const layout = buildRandomLayout();
//       if (!layout) {
//         skipped++;
//         continue;
//       }
//       const { base } = layout;

//       // dynamic1: randomly hide some items (no height override)
//       const dynamic1: DynamicData[] = base.map((c) => ({
//         id: c.id,
//         hidden: Math.random() < 0.5,
//       }));
//       const oldPresented = simpleGrow(base, dynamic1);

//       // dynamic2: independently toggle hidden (no height override)
//       const dynamic2: DynamicData[] = base.map((c) => ({
//         id: c.id,
//         hidden: Math.random() < 0.5,
//       }));
//       const newPresented = simpleGrow(base, dynamic2);

//       const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

//       const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

//       for (const item of base) {
//         const newItem = newBase.find((c) => c.id === item.id);
//         const mismatch =
//           !newItem ||
//           newItem.x !== item.x ||
//           newItem.y !== item.y ||
//           newItem.w !== item.w ||
//           newItem.h !== item.h;
//         if (mismatch) {
//           throw new Error(
//             [
//               `iteration: ${iteration}`,
//               `FAIL P1: base drifted for id=${item.id} label="${idToShort.get(item.id)}"`,
//               `  base:    {x:${item.x}, y:${item.y}, w:${item.w}, h:${item.h}}`,
//               newItem
//                 ? `  newBase: {x:${newItem.x}, y:${newItem.y}, w:${newItem.w}, h:${newItem.h}}  ← should equal base`
//                 : '  newBase: MISSING',
//               '',
//               formatGrid('BASE', base, idToShort),
//               '',
//               formatGrid('OLD PRESENTED (dynamic1)', oldPresented, idToShort),
//               '',
//               formatGrid('NEW PRESENTED (dynamic2)', newPresented, idToShort),
//               '',
//               formatGrid('NEW BASE  ← should equal BASE', newBase, idToShort),
//               '',
//               '--- raw ---',
//               formatDebug('base', base),
//               formatDebug('dynamic1', dynamic1),
//               formatDebug('dynamic2', dynamic2),
//               formatDebug('oldPresented', oldPresented),
//               formatDebug('newPresented', newPresented),
//               formatDebug('newBase', newBase),
//             ].join('\n'),
//           );
//         }
//       }
//     }

//     expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
//   });
// });

// describe('P2 – move round-trip', () => {
//   /**
//    * With all items visible and no height overrides, simpleGrow is an identity
//    * (cumulativeOffset stays 0). After a single-item mutation in presented space,
//    * reverseMapToBase should map it back to base; re-running simpleGrow on the new
//    * base must reproduce the mutated presented position.
//    */
//   test(`holds for ${RUNS} iterations`, () => {
//     let skipped = 0;

//     for (let iteration = 0; iteration < RUNS; iteration++) {
//       const layout = buildRandomLayout();
//       if (!layout) {
//         skipped++;
//         continue;
//       }
//       const { base, dynamic } = layout;

//       // simpleGrow with all-visible, no-height-override = identity (base positions)
//       const oldPresented = simpleGrow(base, dynamic);

//       const mut = applyRandomMutation(oldPresented);
//       if (!mut) {
//         skipped++;
//         continue;
//       }
//       const { newPresented, targetId } = mut;

//       const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

//       // simpleGrow(newBase, dynamic) should also be identity — no growth possible
//       const presented2 = simpleGrow(newBase, dynamic);

//       const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

//       const p2Item = presented2.find((c) => c.id === targetId);
//       const expected = newPresented.find((c) => c.id === targetId)!;

//       const mismatch =
//         !p2Item ||
//         p2Item.x !== expected.x ||
//         p2Item.y !== expected.y ||
//         p2Item.w !== expected.w ||
//         p2Item.h !== expected.h;

//       if (mismatch) {
//         throw new Error(
//           [
//             `iteration: ${iteration}`,
//             `FAIL P2: round-trip mismatch for id=${targetId} label="${idToShort.get(targetId)}"`,
//             `  expected (newPresented): {x:${expected.x}, y:${expected.y}, w:${expected.w}, h:${expected.h}}`,
//             p2Item
//               ? `  actual   (presented2):  {x:${p2Item.x}, y:${p2Item.y}, w:${p2Item.w}, h:${p2Item.h}}`
//               : '  actual   (presented2):  MISSING',
//             '',
//             formatGrid('BASE', base, idToShort),
//             '',
//             formatGrid('OLD PRESENTED', oldPresented, idToShort),
//             '',
//             formatGrid('NEW PRESENTED (after mutation)', newPresented, idToShort),
//             '',
//             formatGrid('NEW BASE (reverseMap)', newBase, idToShort),
//             '',
//             formatGrid('PRESENTED2 (simpleGrow of newBase)  ← should match NEW PRESENTED', presented2, idToShort),
//             '',
//             '--- raw ---',
//             formatDebug('base', base),
//             formatDebug('dynamic', dynamic),
//             formatDebug('oldPresented', oldPresented),
//             formatDebug('newPresented', newPresented),
//             formatDebug('newBase', newBase),
//             formatDebug('presented2', presented2),
//           ].join('\n'),
//         );
//       }
//     }

//     expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
//   });
// });

// describe('P3 – no collisions in base after mutation', () => {
//   /**
//    * Same setup as P2. The base produced by reverseMapToBase must be
//    * collision-free (treating hidden items as h=0).
//    */
//   test(`holds for ${RUNS} iterations`, () => {
//     let skipped = 0;

//     for (let iteration = 0; iteration < RUNS; iteration++) {
//       const layout = buildRandomLayout();
//       if (!layout) {
//         skipped++;
//         continue;
//       }
//       const { base, dynamic } = layout;

//       const oldPresented = simpleGrow(base, dynamic);

//       const mut = applyRandomMutation(oldPresented);
//       if (!mut) {
//         skipped++;
//         continue;
//       }
//       const { newPresented } = mut;

//       const newBase = reverseMapToBase(newPresented.map(toResponsive), oldPresented.map(toResponsive), base);

//       const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

//       if (hasBaseCollision(newBase)) {
//         throw new Error(
//           [
//             `iteration: ${iteration}`,
//             'FAIL P3: newBase has collisions among visible items',
//             '',
//             formatGrid('BASE', base, idToShort),
//             '',
//             formatGrid('OLD PRESENTED', oldPresented, idToShort),
//             '',
//             formatGrid('NEW PRESENTED (after mutation)', newPresented, idToShort),
//             '',
//             formatGrid('NEW BASE  ← collisions here!', newBase, idToShort),
//             '',
//             '--- raw ---',
//             formatDebug('base', base),
//             formatDebug('dynamic', dynamic),
//             formatDebug('oldPresented', oldPresented),
//             formatDebug('newPresented', newPresented),
//             formatDebug('newBase', newBase),
//           ].join('\n'),
//         );
//       }
//     }

//     expect(skipped).toBeLessThan(Math.round(RUNS * 0.95));
//   });
// });
