import { compact, collides, CompactionItemIn, DynamicData, CompactionItem } from './compact';
import { randomInt, formatDebug, formatGrid } from './propertyHelpers';

//  npm run test --passWithNoTest compactionAlgorithmProperty.test.ts

// --- Generation parameters ---

const MAX_COORD = 3; // max x/y position
const MIN_SIZE = 1; // min w/h
const MAX_SIZE = 2; // max w/h
const MAX_HEIGHT_DELTA = 2; // extra height added to base h in dynamic data
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

function randomDynamicData(component: CompactionItemIn): DynamicData {
  return {
    id: component.id,
    height: component.h + randomInt(0, MAX_HEIGHT_DELTA),
    hidden: randomBool(),
  };
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

function hasOutputCollision(items: CompactionItem[]): { found: boolean; a?: CompactionItem; b?: CompactionItem } {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (collides(items[i]!, items[j]!)) {
        return { found: true, a: items[i], b: items[j] };
      }
    }
  }
  return { found: false };
}

function createRandomLayout(): { base: CompactionItemIn[]; dynamic: DynamicData[]; output: CompactionItem[] } {
  let localIdCounter = 0;
  const base: CompactionItemIn[] = [];

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = randomComponent(`c${localIdCounter++}`);
    if (!hasBaseCollision(candidate, base)) {
      base.push(candidate);
    }
  }

  const dynamic = base.map(randomDynamicData);
  const output = compact(base, dynamic);
  return { base, dynamic, output };
}

// --- Property Tests ---

describe('Compaction Algorithm - Property Tests', () => {
  it(`satisfies core invariants for ${RUNS} random layouts`, () => {
    for (let run = 0; run < RUNS; run++) {
      const { base, dynamic, output } = createRandomLayout();

      // Consistent label map: same digit for the same component across every grid in this error
      const idToShort = new Map(base.map((c, i) => [c.id, String(i)]));

      // Property 1: all components are present in output
      for (const baseItem of base) {
        const outputItem = output.find((item) => item.id === baseItem.id);
        if (outputItem === undefined) {
          throw new Error(
            [
              `run: ${run}`,
              `FAIL (1): all-present — component "${baseItem.id}" label="${idToShort.get(baseItem.id)}" from base is missing from output`,
              '',
              formatGrid('BASE', base, idToShort),
              '',
              formatGrid('OUTPUT  ← missing item!', output, idToShort),
              '',
              '--- raw ---',
              formatDebug('base', base),
              formatDebug('dynamic', dynamic),
              formatDebug('output', output),
            ].join('\n'),
          );
        }
      }

      // Property 2: items hidden in dynamic have h=0
      for (const dynData of dynamic) {
        if (dynData.hidden) {
          const outputItem = output.find((item) => item.id === dynData.id);
          if (outputItem !== undefined && outputItem.h !== 0) {
            throw new Error(
              [
                `run: ${run}`,
                `FAIL (2): hidden-h0 — component "${dynData.id}" label="${idToShort.get(dynData.id)}" is hidden in dynamic but h=${outputItem.h} in output (expected 0)`,
                '',
                formatGrid('BASE', base, idToShort),
                '',
                formatGrid('OUTPUT  ← hidden item has h>0!', output, idToShort),
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

      // Property 3: no collisions in output
      const { found, a, b } = hasOutputCollision(output);
      if (found) {
        throw new Error(
          [
            `run: ${run}`,
            `FAIL (3): no-collision — output collision between "${a!.id}" label="${idToShort.get(a!.id)}" and "${b!.id}" label="${idToShort.get(b!.id)}"`,
            '',
            formatGrid('BASE', base, idToShort),
            '',
            formatGrid('OUTPUT  ← collisions here!', output, idToShort),
            '',
            '--- raw ---',
            formatDebug('base', base),
            formatDebug('dynamic', dynamic),
            formatDebug('output', output),
          ].join('\n'),
        );
      }

      // Property 4: all input coordinates are non-negative
      for (const baseItem of base) {
        if (baseItem.x < 0 || baseItem.y < 0 || baseItem.w < 0 || baseItem.h < 0) {
          throw new Error(
            [
              `run: ${run}`,
              `FAIL (4): non-negative-base — base item "${baseItem.id}" label="${idToShort.get(baseItem.id)}" has negative coordinate (x=${baseItem.x}, y=${baseItem.y}, w=${baseItem.w}, h=${baseItem.h})`,
              '',
              formatGrid('BASE  ← negative coord!', base, idToShort),
              '',
              '--- raw ---',
              formatDebug('base', base),
              formatDebug('dynamic', dynamic),
            ].join('\n'),
          );
        }
      }

      // Property 5: all output coordinates are non-negative
      for (const outputItem of output) {
        if (outputItem.x < 0 || outputItem.y < 0 || outputItem.w < 0 || outputItem.h < 0) {
          throw new Error(
            [
              `run: ${run}`,
              `FAIL (5): non-negative-output — output item "${outputItem.id}" label="${idToShort.get(outputItem.id)}" has negative coordinate (x=${outputItem.x}, y=${outputItem.y}, w=${outputItem.w}, h=${outputItem.h})`,
              '',
              formatGrid('BASE', base, idToShort),
              '',
              formatGrid('OUTPUT  ← negative coord!', output, idToShort),
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
