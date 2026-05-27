// ==== MethodUI transpilation constraints ====
// The MethodUI build pipeline (as of 2026-03) does NOT support:
//   - for...of on Map/Set (Map/Set have no Symbol.iterator after transpilation)
//   - spreading a Set ([...set] fails for the same reason)
// Safe alternatives: Map.get/set/has/size, Set.add/has/size, Array-backed loops.
// Do NOT introduce Map-for-of, Set-for-of, or Set-spread in this file.
// =============================================

export interface CompactionItemIn {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hidden: boolean;
}

export interface CompactionItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DynamicData {
  id: string;
  height?: number; // CHANGED: made optional
  hidden: boolean;
}

export function collides(a: CompactionItem, b: CompactionItem): boolean {
  // Same element - can't collide with itself
  if (a.id === b.id) return false;

  // Check if bounding boxes don't overlap (any gap means no collision)
  if (a.x + a.w <= b.x) return false; // A is completely left of b
  if (a.x >= b.x + b.w) return false; // A is completely right of b
  if (a.y + a.h <= b.y) return false; // A is completely above b
  if (a.y >= b.y + b.h) return false; // A is completely below b

  // Bounding boxes overlap
  return true;
}

export type RowGroup = {
  row: number;
  items: CompactionItemIn[];
  height: number;
  isSpacer: boolean;
};

export function buildRowGroups(items: CompactionItemIn[]): {
  rowGroups: (RowGroup | undefined)[];
  rowIds: number[];
} {
  const rowIds: number[] = [];
  const rowGroups: (RowGroup | undefined)[] = [];

  items.forEach((item) => {
    const row = item.y;
    const existing = rowGroups[row];
    if (existing) {
      existing.items.push(item);
      existing.height = Math.max(existing.height, item.h);
    } else {
      rowGroups[row] = { row, items: [item], height: item.h, isSpacer: false };
      rowIds.push(row);
    }
  });

  rowIds.sort((a, b) => a - b);

  // insert spacers
  const first = rowGroups[rowIds[0]!]!;
  let segmentStart = first.row;
  let segmentStop = segmentStart + first.height;
  for (let i = 1; i < rowIds.length; i++) {
    const row = rowIds[i]!;
    const nextStart = row;
    const nextStop = nextStart + rowGroups[row]!.height;

    if (nextStart <= segmentStop) {
      segmentStop = Math.max(segmentStop, nextStop);
    } else {
      const spacerRow = segmentStop;
      if (!rowGroups[spacerRow]) {
        rowGroups[spacerRow] = { row: segmentStop, items: [], height: nextStart - spacerRow, isSpacer: true };
        rowIds.push(spacerRow);
      }
      segmentStart = nextStart;
      segmentStop = nextStop;
    }
  }

  rowIds.sort((a, b) => a - b);

  return { rowGroups, rowIds };
}

const HIDDEN_SIZE = 0;

export function createDynamicGroups(
  rowIds: number[],
  baseRowGroups: (RowGroup | undefined)[],
  dynamic: DynamicData[],
): (RowGroup | undefined)[] {
  const dynamicMap = new Map(dynamic.map((item) => [item.id, item]));

  const dynamicGroups: (RowGroup | undefined)[] = [];
  for (const id of rowIds) {
    const group = baseRowGroups[id];
    if (!group || group.isSpacer) {
      dynamicGroups[id] = group;
      continue;
    }

    let dynHeight = 0;
    // insertFirst (base-hidden → now visible), then insertAfter (base-visible)
    const insertFirst: CompactionItemIn[] = []; // base-hidden items
    const insertAfter: CompactionItemIn[] = []; // base-visible items
    for (const item of group.items) {
      const data = dynamicMap.get(item.id);
      let h = item.h;
      let hidden = item.hidden;
      if (data) {
        hidden = data.hidden;
        if (data.height !== undefined) h = Math.max(h, data.height); // do not shrink below base height
      }
      if (hidden) h = HIDDEN_SIZE;
      const newItem = { ...item, h, hidden };
      if (item.hidden) {
        insertFirst.push(newItem);
      } else {
        insertAfter.push(newItem);
      }
    }

    const placed: CompactionItemIn[] = [];
    for (const item of [...insertFirst, ...insertAfter]) {
      let placedY = item.y;
      let maxPush: number;
      // Items in group not guaranteed to be y-sorted.
      // Hence, an offset computed mid loop may collide with previous items.
      do {
        maxPush = 0;
        const candidate = { ...item, y: placedY };
        for (const existing of placed) {
          if (collides(candidate, existing)) {
            maxPush = Math.max(maxPush, existing.y + existing.h - placedY);
          }
        }
        placedY += maxPush;
      } while (maxPush > 0);
      const newItem = { ...item, y: placedY };
      placed.push(newItem);
      dynHeight = Math.max(dynHeight, newItem.y + newItem.h - group.row);
    }

    const newGroup = { ...group, items: placed, height: dynHeight };
    // debugAssertNoGroupCollision(newGroup);
    dynamicGroups[id] = newGroup;
  }
  return dynamicGroups;
}

// TODO: remove array requirement check in tsconfig

// Algorithm to fulfill the following requirements:
// - components that are y-axis aligned (row group) stay aligned after growth/expansion
// - if an element grows in height, rows are added to extend the size of the row
// group
// - a row where all components are hidden is removed
// - a row that was blank in the base layout is a spacer and continues to be
// function as a spacer after compaction
// - row extension is only triggered when an element collision occurs; extending
// into the free space of another row group does not add another row
export function compact(base: CompactionItemIn[], dynamic: DynamicData[]): CompactionItem[] {
  if (!base.length) return [];

  const { rowGroups: baseRowGroups, rowIds } = buildRowGroups(base);

  // apply dynamic data
  // - insert base then visible items into each row group. It may be now have
  // items with a y-position that is above the row
  // - compute dynamic height of each group
  const dynamicGroups = createDynamicGroups(rowIds, baseRowGroups, dynamic);

  // resolve collisions and push groups down.
  for (let i = 0; i < rowIds.length; i++) {
    const group = dynamicGroups[rowIds[i]!]!;
    if (!group) {
      continue;
    }
    if (group.isSpacer) continue;

    // compaction pass
    // - groups below have correct height and position
    // - groups above have correct height but not necessarily correct position
    if (group.height === 0) {
      continue;
    }

    // growth/collision pass
    let maxOffsetNeeded = 0;
    let groupToOffsetAt = Infinity;
    // For h=0 groups: track individual pairOffset to avoid over-push into visible items.
    // h=0 groups use their own pairOffset; h>0 groups use the global max (to preserve ordering).
    const perGroupOffset = new Map<number, number>();
    // Repeat until maxOffsetNeeded stabilises. A single forward pass can compute
    // pairOffset for group j based on the maxOffsetNeeded known at that moment,
    // then a later group j' > j raises maxOffsetNeeded further. Group j must be
    // re-checked at the new value because its actual applied offset will be the
    // global max — it may now collide with an insert item from a settled group.
    // Terminates because maxOffsetNeeded is a non-negative integer that strictly
    // increases each iteration and is bounded by the canvas height.
    let prevMaxOffset: number;
    do {
      prevMaxOffset = maxOffsetNeeded;
      for (let j = i + 1; j < rowIds.length; j++) {
        const checkidx = rowIds[j]!;
        const checkGroup = dynamicGroups[checkidx]!;
        if (!checkGroup) {
          continue;
        }
        // early return if height excludes possibility of collision
        if (checkGroup.row >= group.row + group.height) {
          break;
        }

        if (checkGroup.isSpacer) {
          const offsetNeeded = group.row + group.height - checkGroup.row;
          maxOffsetNeeded = Math.max(maxOffsetNeeded, offsetNeeded);
          groupToOffsetAt = Math.min(groupToOffsetAt, j);
          break;
        } else {
          // Iterative: after each push, re-check with shifted checkGroup positions.
          // Checks ALL previously-settled groups (0..i) so a push triggered by
          // group[i] cannot land group[j] inside an item from an earlier group
          // (e.g. an insert placed above group[i]'s natural row).
          //
          // For h>0 groups, the actual applied offset will be maxOffsetNeeded (not
          // pairOffset), to preserve group ordering. Start the collision check at
          // maxOffsetNeeded so we detect any new collisions that arise at the forced
          // position (e.g. an insert item in group[i] that sits below the group's
          // natural row can collide with a group pushed there by ordering).
          // h=0 groups use perGroupOffset (may be < maxOffsetNeeded) so they keep
          // starting at 0; the post-processing step handles residual overlaps.
          const startingPairOffset = checkGroup.height > 0 ? maxOffsetNeeded : 0;
          let pairOffset = startingPairOffset;
          let pairLoopRunning = true;
          pairLoop: while (pairLoopRunning) {
            for (let m = 0; m <= i; m++) {
              const prevGroup = dynamicGroups[rowIds[m]!];
              if (!prevGroup || prevGroup.isSpacer || prevGroup.height === 0) continue;
              for (let k = 0; k < prevGroup.items.length; k++) {
                const item = prevGroup.items[k]!;
                for (let l = 0; l < checkGroup.items.length; l++) {
                  const checkItem = checkGroup.items[l]!;
                  const shifted = { ...checkItem, y: checkItem.y + pairOffset };
                  if (collides(item, shifted)) {
                    const push = item.y + item.h - shifted.y;
                    if (push > 0) {
                      pairOffset += push;
                      continue pairLoop;
                    }
                  }
                }
              }
            }
            pairLoopRunning = false;
          }
          // Only update if the pairLoop found a new collision beyond the starting
          // offset. When re-running due to the do-while, startingPairOffset equals
          // maxOffsetNeeded; if no collision is found at that position, pairOffset
          // stays equal to startingPairOffset and nothing changes.
          if (pairOffset > startingPairOffset) {
            maxOffsetNeeded = Math.max(maxOffsetNeeded, pairOffset);
            groupToOffsetAt = Math.min(groupToOffsetAt, j);
          }
          // Store individual pairOffset for h=0 groups so the offset application
          // can use it instead of the global max (which can over-push h=0 items
          // into visible items from earlier groups).
          if (checkGroup.height === 0) {
            perGroupOffset.set(checkidx, pairOffset);
          }
        }
      }
    } while (maxOffsetNeeded > prevMaxOffset);

    // apply offset to all subsequent rows starting from groupToOffsetAt
    if (groupToOffsetAt < Infinity) {
      for (let j = groupToOffsetAt; j < rowIds.length; j++) {
        // offset row + y of each item
        const dynIdx = rowIds[j]!;
        const offsetGroup = dynamicGroups[dynIdx]!;
        // h=0 groups use their individually computed pairOffset to avoid being
        // over-pushed into visible items by a larger offset required by h>0 groups
        // further down. h>0 groups always use the global max to preserve ordering.
        const offset =
          offsetGroup.height === 0 && perGroupOffset.has(dynIdx) ? perGroupOffset.get(dynIdx)! : maxOffsetNeeded;
        offsetGroup.row += offset;
        offsetGroup.items = offsetGroup.items.map((item) => ({
          ...item,
          y: item.y + offset,
        }));
      }
    }
  }

  // compaction phase
  // remove hidden groups and apply offsets
  // - determine start index = .row of first group
  let startRow = Infinity;
  let endRow = 0;
  for (const idx of rowIds) {
    const group = dynamicGroups[idx];
    if (!group) continue;
    startRow = Math.min(startRow, group.row);
    endRow = Math.max(endRow, group.row + group.height);
  }

  if (startRow < Infinity && endRow > 0) {
    // - per row (not per row-group) - contains array of group indices that
    // occur in this row.
    const rows: number[][] = [];
    for (let i = startRow; i < endRow; i++) {
      rows[i] = [];
    }

    // - set of removable group ids
    const removableIdSet = new Set<number>();

    // - iterate over groups to:
    // - - fill in rows with group ids they contain
    // - - if group is hidden, add it to removable set
    // fill in rows array and removable group set
    for (const idx of rowIds) {
      const group = dynamicGroups[idx];
      if (!group) continue;

      const rowStart = group.row;
      let rowStop;

      if (group.height === 0) {
        removableIdSet.add(idx);

        const base = baseRowGroups[idx]!;
        rowStop = group.row + base.height;
      } else {
        rowStop = group.row + group.height;
      }

      for (let r = rowStart; r < rowStop; r++) {
        rows[r]?.push(idx);
      }
    }

    // - setup offset array = array of offsets for each row, initially 0
    const offsetArr = new Array<number>(endRow + 1).fill(0);

    for (let i = startRow; i < rows.length; i++) {
      if (rows[i]!.every((id) => removableIdSet.has(id))) {
        offsetArr[i] = 1;
      }
    }

    // - iterate over rows array to compute cumulative offsets
    let accumShiftUp = 0;
    for (let r = startRow; r < endRow; r++) {
      const newShift = accumShiftUp + offsetArr[r]!;
      offsetArr[r] = accumShiftUp;
      accumShiftUp = newShift;
    }

    // - apply offsets
    for (const idx of rowIds) {
      const group = dynamicGroups[idx]!;
      const offset = offsetArr[group.row]!;
      group.row = group.row - offset;
      group.items.forEach((item) => (item.y = item.y - offset));
    }
  }

  // Post-processing: move h=0 items that are strictly inside a visible (h>0)
  // item to the boundary just after that visible item ends.
  // This handles the case where a h=0 item inside a mixed-height group gets
  // over-pushed by the global maxOffsetNeeded and lands inside a visible item
  // from a previously-settled group.
  const visibleItems: CompactionItemIn[] = [];
  for (const idx of rowIds) {
    const g = dynamicGroups[idx];
    if (!g || g.isSpacer) continue;
    for (const item of g.items) {
      if (item.h > 0) visibleItems.push(item);
    }
  }
  for (const idx of rowIds) {
    const g = dynamicGroups[idx];
    if (!g || g.isSpacer) continue;
    for (const item of g.items) {
      if (item.h !== 0) continue;
      let changed = true;
      while (changed) {
        changed = false;
        for (const vis of visibleItems) {
          if (vis.x + vis.w <= item.x || vis.x >= item.x + item.w) continue;
          if (vis.y < item.y && item.y < vis.y + vis.h) {
            item.y = vis.y + vis.h;
            changed = true;
            break;
          }
        }
      }
    }
  }

  const result = dynamicGroups
    .filter((group): group is RowGroup => group !== undefined && !group.isSpacer)
    .flatMap((group) => group.items.map(({ hidden: _h, ...item }) => item));
  return result;
}
