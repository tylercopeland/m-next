import { collides, CompactionItemIn, DynamicData, CompactionItem } from './compact';
import { simpleGrow } from './simpleGrow';
import { randomInt, formatDebug, formatGrid, formatSimpleGrowTrace } from './propertyHelpers';

// --- Generation parameters ---

const MAX_COORD = 3;
const MIN_SIZE = 1;
const MAX_SIZE = 2;
const MAX_ATTEMPTS = 7; // attempts to place a non-colliding component in base layout
const RUNS = 10000; // number of random layouts to test

// --- Helpers ---

function randomBool(): boolean {
  return Math.random() < 0.5;
}

function randomComponent(id: string): CompactionItemIn {
  return {
    id,
    x: randomInt(0, MAX_COORD),
    y: randomInt(0, MAX_COORD),
    w: randomInt(MIN_SIZE, MAX_SIZE),
    h: randomInt(MIN_SIZE, MAX_SIZE),
    hidden: randomBool(),
  };
}

/** Dynamic data for simpleGrow: visibility only — no height overrides. */
function randomDynamicData(component: CompactionItemIn): DynamicData {
  return { id: component.id, hidden: false };
}

function collidesinBase(a: CompactionItemIn, b: CompactionItemIn): boolean {
  const a_ = { ...a, h: a.hidden ? 0 : a.h };
  const b_ = { ...b, h: b.hidden ? 0 : b.h };
  return collides(a_, b_);
}

function hasBaseCollision(candidate: CompactionItemIn, existing: CompactionItemIn[]): boolean {
  for (const item of existing) {
    if (collidesinBase(candidate, item)) return true;
  }
  return false;
}

/** Only visible (h>0) items are checked — h=0 items have no spatial footprint. */
function hasOutputCollision(items: CompactionItem[]): { found: boolean; a?: CompactionItem; b?: CompactionItem } {
  const visible = items.filter((item) => item.h > 0);
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      if (collides(visible[i]!, visible[j]!)) return { found: true, a: visible[i], b: visible[j] };
    }
  }
  return { found: false };
}

function createRandomLayout(): CompactionItemIn[] {
  let localIdCounter = 0;
  const base: CompactionItemIn[] = [];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = randomComponent(`c${localIdCounter++}`);
    if (!hasBaseCollision(candidate, base)) {
      base.push(candidate);
    }
  }

  return base;
}

// --- Property Tests ---

describe('simpleGrow property: identity when dynamic matches base', () => {
  /**
   * When dynamic data mirrors the base (same hidden flags, no height overrides),
   * simpleGrow must return each item at exactly its base position.
   * Visible items keep their base x/y/w/h; hidden items appear with h=0 at their base x/y/w.
   */
  test(`holds for ${RUNS} random layouts`, () => {
    for (let run = 0; run < RUNS; run++) {
      const base = createRandomLayout();
      // Dynamic mirrors base exactly: same hidden flag, no height override.
      const dynamic: DynamicData[] = base.map((c) => ({ id: c.id, hidden: c.hidden }));

      let output: CompactionItem[];
      try {
        output = simpleGrow(base, dynamic);
      } catch (e) {
        const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));
        throw new Error(
          [
            `run: ${run}`,
            `FAIL: simpleGrow threw — ${e instanceof Error ? e.message : String(e)}`,
            '',
            formatGrid('BASE', base, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
          ].join('\n'),
        );
      }

      const baseMap = new Map(base.map((c) => [c.id, c]));
      for (const item of output) {
        const b = baseMap.get(item.id);
        if (!b) continue;
        const expectedH = b.hidden ? 0 : b.h;
        if (item.x !== b.x || item.y !== b.y || item.w !== b.w || item.h !== expectedH) {
          const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));
          throw new Error(
            [
              `run: ${run}`,
              `FAIL: identity — item "${item.id}" label="${idToShort.get(item.id)}" drifted`,
              `  base:   {x:${b.x}, y:${b.y}, w:${b.w}, h:${b.h}, hidden:${b.hidden}}`,
              `  output: {x:${item.x}, y:${item.y}, w:${item.w}, h:${item.h}}  (expectedH=${expectedH})`,
              '',
              formatGrid('BASE', base, idToShort),
              '',
              formatGrid('OUTPUT  ← should equal BASE (hidden → h=0)', output, idToShort),
              '',
              formatSimpleGrowTrace('TRACE', base, output, new Set(), idToShort),
              '',
              '--- raw ---',
              formatDebug('base', base),
              formatDebug('dynamic', dynamic),
              formatDebug('output', output),
            ].join('\n'),
          );
        }
      }
    }
  });
});

describe('simpleGrow property: no output collisions when hidden items become visible', () => {
  test(`holds for ${RUNS} random layouts`, () => {
    for (let run = 0; run < RUNS; run++) {
      const base = createRandomLayout();
      const dynamic = base.map(randomDynamicData);
      let output: CompactionItem[];
      try {
        output = simpleGrow(base, dynamic);
      } catch (e) {
        const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));
        throw new Error(
          [
            `run: ${run}`,
            `FAIL: simpleGrow threw — ${e instanceof Error ? e.message : String(e)}`,
            '',
            formatGrid('BASE', base, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
          ].join('\n'),
        );
      }

      const { found, a, b } = hasOutputCollision(output);
      if (found) {
        const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));
        const collidingIds = new Set<string>();
        for (let i = 0; i < output.length; i++) {
          for (let j = i + 1; j < output.length; j++) {
            if (output[i]!.h > 0 && output[j]!.h > 0 && collides(output[i]!, output[j]!)) {
              collidingIds.add(output[i]!.id);
              collidingIds.add(output[j]!.id);
            }
          }
        }
        throw new Error(
          [
            `run: ${run}`,
            `FAIL: no-collision — output collision between "${a!.id}" label="${idToShort.get(a!.id)}" and "${b!.id}" label="${idToShort.get(b!.id)}"`,
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('OUTPUT  ← collisions here!', output, idToShort),
            '',
            formatSimpleGrowTrace('TRACE (base → output)', base, output, collidingIds, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('output', output),
          ].join('\n'),
        );
      }
    }
  });
});
