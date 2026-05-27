/**
 * Layout Reflow Calculator
 *
 * Implements a whole-layout row-based proportional reflow algorithm for
 * converting desktop grid positions (12 cols) to tablet (8 cols) or
 * mobile (4 cols) without saved overrides.
 *
 * The naive per-component clamping approach causes overlaps and disappearing
 * components when items at the right side of the desktop grid are relocated.
 * This algorithm instead mirrors CSS flexbox wrap behaviour:
 *   - Group siblings into visual rows (items whose y-ranges overlap)
 *   - Scale widths proportionally
 *   - Place left-to-right; wrap to the next row when an item would overflow
 *
 * IMPORTANT: This is a pure function used at render time only.
 * Results are NEVER persisted — they do not affect tabletOverride / mobileOverride.
 */

export interface ReflowItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Returns the min/max y extent of a group of items */
function groupYRange(group: ReflowItem[]): { minY: number; maxY: number } {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < group.length; i++) {
    const item = group[i]!;
    if (item.y < minY) minY = item.y;
    const bottom = item.y + item.height;
    if (bottom > maxY) maxY = bottom;
  }
  return { minY, maxY };
}

/** Returns true if two groups share any y range (i.e. they visually overlap vertically) */
function rowsOverlap(groupA: ReflowItem[], groupB: ReflowItem[]): boolean {
  const a = groupYRange(groupA);
  const b = groupYRange(groupB);
  return a.minY < b.maxY && b.minY < a.maxY;
}

/**
 * Groups items into visual rows.
 * Two items belong to the same row if their y-ranges overlap (share any y value).
 * Uses an iterative merge approach until no more merges are possible.
 */
function groupIntoRows(items: ReflowItem[]): ReflowItem[][] {
  if (items.length === 0) return [];

  // Each item starts in its own group
  const groups: ReflowItem[][] = items.map((item) => [item]);

  let merged = true;
  while (merged) {
    merged = false;
    let foundMerge = false;
    for (let i = 0; i < groups.length && !foundMerge; i++) {
      for (let j = i + 1; j < groups.length && !foundMerge; j++) {
        const groupI = groups[i]!;
        const groupJ = groups[j]!;
        if (rowsOverlap(groupI, groupJ)) {
          // Merge group j into group i
          groups[i] = groupI.concat(groupJ);
          groups.splice(j, 1);
          merged = true;
          foundMerge = true;
        }
      }
    }
  }

  return groups;
}

/**
 * Scale a width proportionally from sourceCols to targetCols.
 * Full-width items (w === sourceCols) are expanded to fill the target.
 * Minimum width is 1.
 */
export function scaleWidth(width: number, sourceCols: number, targetCols: number): number {
  if (width >= sourceCols) return targetCols;
  return Math.max(1, Math.round((width * targetCols) / sourceCols));
}

/**
 * Reflow a flat list of sibling items (same container scope) from
 * sourceCols columns to targetCols columns.
 *
 * Returns a new array with updated x/y/width/height.
 * height is preserved (not scaled) because row heights are grid-unit-based
 * and we have no reason to change them.
 */
export function reflowItems(items: ReflowItem[], sourceCols: number, targetCols: number): ReflowItem[] {
  if (items.length === 0) return [];
  if (sourceCols === targetCols) return items.slice();

  // Group items into visual rows, ordered top-to-bottom
  const rows = groupIntoRows(items);
  rows.sort((a, b) => groupYRange(a).minY - groupYRange(b).minY);

  const result: ReflowItem[] = [];
  let currentRowY = 0;

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx]!;

    // Detect vertical gap between this row and the previous row
    const rowRange = groupYRange(row);
    if (rowIdx > 0) {
      const prevRowRange = groupYRange(rows[rowIdx - 1]!);
      const desktopGap = rowRange.minY - prevRowRange.maxY;
      if (desktopGap > 0) {
        // Preserve proportional vertical gap
        const scaledGap = Math.max(0, Math.round((desktopGap * targetCols) / sourceCols));
        currentRowY += scaledGap;
      }
    }

    // Sort items within the row by desktop x position (left-to-right)
    const rowItems = row.slice().sort((a, b) => a.x - b.x);

    // Place items sequentially, wrapping when they overflow targetCols
    let cursorX = 0;
    let cursorY = currentRowY;
    let lineHeight = 0; // tallest item on the current wrap-line

    for (let itemIdx = 0; itemIdx < rowItems.length; itemIdx++) {
      const item = rowItems[itemIdx]!;
      const scaledWidth = scaleWidth(item.width, sourceCols, targetCols);

      if (cursorX + scaledWidth > targetCols && cursorX > 0) {
        // Wrap to a new line
        cursorY += lineHeight;
        cursorX = 0;
        lineHeight = 0;
      }

      result.push({
        id: item.id,
        x: cursorX,
        y: cursorY,
        width: scaledWidth,
        height: item.height,
      });

      cursorX += scaledWidth;
      if (item.height > lineHeight) lineHeight = item.height;
    }

    // Advance currentRowY past the entire (possibly multi-line) row
    currentRowY = cursorY + lineHeight;
  }

  return result;
}

/**
 * Build a lookup map from item id to reflowed position.
 * Handles both top-level items and items scoped to a container
 * by grouping by containerId and running reflowItems per group.
 *
 * @param items          All items (can include items from multiple containers)
 * @param getContainerId Extractor for the container scope key (null = top-level)
 * @param sourceCols     Desktop column count (typically 12)
 * @param targetCols     Target column count (8 for tablet, 4 for mobile)
 */
export function buildReflowLookup(
  items: ReflowItem[],
  getContainerId: (arg: ReflowItem) => string | null,
  sourceCols: number,
  targetCols: number,
): Map<string, ReflowItem> {
  const lookup = new Map<string, ReflowItem>();

  // Group by container scope
  const groups = new Map<string | null, ReflowItem[]>();
  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const key = getContainerId(item);
    const existing = groups.get(key);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  // Reflow each scope independently
  groups.forEach((scopeItems) => {
    const reflowed = reflowItems(scopeItems, sourceCols, targetCols);
    for (let i = 0; i < reflowed.length; i++) {
      const r = reflowed[i]!;
      lookup.set(r.id, r);
    }
  });

  return lookup;
}
