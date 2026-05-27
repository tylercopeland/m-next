import {
  buildRowGroups,
  collides,
  createDynamicGroups,
  CompactionItem,
  CompactionItemIn,
  DynamicData,
  RowGroup,
} from './compact';
// import { formatGrid } from './propertyHelpers';

// DEBUG: check that all items in a row group have no collisions
// function debugAssertNoGroupCollision(group: RowGroup): void {
//   const idToShort = new Map(group.items.map((item, i) => [item.id, String(i)]));
//   for (let i = 0; i < group.items.length; i++) {
//     for (let j = i + 1; j < group.items.length; j++) {
//       const a = group.items[i]!;
//       const b = group.items[j]!;
//       if (collides(a, b)) {
//         throw new Error(
//           [
//             `[simpleGrow DEBUG] Collision within group: row=${group.row}: collision between "${a.id}" and "${b.id}"`,
//             formatGrid('GROUP AFTER PLACEMENT', group.items, idToShort),
//             `--- raw ---`,
//             JSON.stringify(group.items, null, 2),
//           ].join('\n'),
//         );
//       }
//     }
//   }
// }

// Designer-mode layout function: when items that are hidden in the base are
// shown, shift all subsequent components down by the amount of height growth
// caused in this row. No collision cascade, no spacer blocking, no
// intersection post-processing.
export function simpleGrow(base: CompactionItemIn[], dynamic: DynamicData[]): CompactionItem[] {
  if (!base.length) return [];

  const { rowGroups: baseRowGroups, rowIds } = buildRowGroups(base);

  // Phase 1: insert hidden into row groups based on dynamic data
  const dynamicGroups = createDynamicGroups(rowIds, baseRowGroups, dynamic);

  // Phase 2: for each group, push subsequent groups whose items actually collide
  // with this group's items. Collision is checked at the item level (both x and y),
  // so groups in non-overlapping x-columns are never shifted against each other.
  // Cascading is handled naturally by the outer loop: after group B is pushed by A,
  // the next i-iteration checks if B's new position pushes C, and so on.
  for (let i = 0; i < rowIds.length; i++) {
    const idx = rowIds[i]!;
    const group = dynamicGroups[idx];
    if (!group || group.isSpacer || group.height === 0) continue;

    for (let j = i + 1; j < rowIds.length; j++) {
      const futureIdx = rowIds[j]!;
      const futureGroup = dynamicGroups[futureIdx];
      if (!futureGroup || futureGroup.isSpacer) continue;

      // Compute how much futureGroup must shift to clear all items in group.
      // Iterative: a single-pass max is insufficient because pushing futureGroup
      // down to clear one currentItem can bring it into a *lower* currentItem
      // (e.g. c2 pushes c1 to y:4 where c6 also sits). Re-check after each
      // push increase until no new collisions are found.
      let push = 0;
      let changed = true;
      while (changed) {
        changed = false;
        for (const futureItem of futureGroup.items) {
          // Check against ALL prior groups (0..i), not just the current group i.
          // A prior group's items may have been pushed to a higher y than their
          // base-row order suggests (e.g. an insertFirst item pushed far down in
          // Phase 1), so we must account for them when computing how far to push
          // futureGroup.
          for (let m = 0; m <= i; m++) {
            const priorGroup = dynamicGroups[rowIds[m]!];
            if (!priorGroup || priorGroup.isSpacer || priorGroup.height === 0) continue;
            for (const currentItem of priorGroup.items) {
              if (currentItem.h === 0) continue;
              const shiftedFuture = { ...futureItem, y: futureItem.y + push };
              if (collides(currentItem, shiftedFuture)) {
                const needed = currentItem.y + currentItem.h - futureItem.y;
                if (needed > push) {
                  push = needed;
                  changed = true;
                }
              }
            }
          }
        }
      }

      if (push > 0) {
        futureGroup.row += push;
        futureGroup.items = futureGroup.items.map((item) => ({ ...item, y: item.y + push }));
      }
    }
  }

  return dynamicGroups
    .filter((group): group is RowGroup => group !== undefined && !group.isSpacer)
    .flatMap((group) => group.items.map(({ hidden: _h, ...item }) => item));
}
