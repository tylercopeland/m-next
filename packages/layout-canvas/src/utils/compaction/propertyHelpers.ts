/**
 * Compact position-trace table — the critical complement to the spatial grids.
 *
 * The grids show WHERE items are; this table shows WHY reverseMapToBase computed
 * the wrong result.  Key columns:
 *
 *   base_y          — designed (ground-truth) y in base
 *   op_y (op_h)     — y / h in old presented  (simpleGrow output for dynamic1)
 *   np_y (np_h)     — y / h in new presented  (simpleGrow output for dynamic2)
 *   old_dy          — np_y − op_y  (what the old code applied to base_y)
 *   newBase_y       — base_y + old_dy  (what the old code produced)
 *   expect_y        — base_y  (what the result MUST equal when only visibility changed)
 *   status          — ✓ or ✗ DRIFT
 *
 * When old_dy ≠ 0 on a visibility-only run it means simpleGrow shifted the item
 * differently in dynamic1 vs dynamic2 (different row-group compaction offsets).
 * That shift is NOT user intent and must not be applied to the base.
 */
export function formatPositionTrace(
  label: string,
  base: Array<{ id: string; y: number; h: number }>,
  oldPresented: Array<{ id: string; y: number; h: number }>,
  newPresented: Array<{ id: string; y: number; h: number }>,
  newBase: Array<{ id: string; y: number; h: number }>,
  idToShort: Map<string, string>,
): string {
  const opMap = new Map(oldPresented.map((c) => [c.id, c]));
  const npMap = new Map(newPresented.map((c) => [c.id, c]));
  const nbMap = new Map(newBase.map((c) => [c.id, c]));

  const COL = { id: 4, baseY: 7, opYH: 11, npYH: 11, dy: 8, nbY: 11, expY: 8, st: 10 };
  const p = (s: string | number, w: number) => String(s).padStart(w);
  const header = [
    p('id', COL.id),
    p('base_y h', COL.baseY + 2),
    p('op_y  h', COL.opYH),
    p('np_y  h', COL.npYH),
    p('old_dy', COL.dy),
    p('newBase_y', COL.nbY),
    p('expect_y', COL.expY),
    p('status', COL.st),
  ].join(' | ');
  const divider = '-'.repeat(header.length);

  const rows = base.map((b) => {
    const short = idToShort.get(b.id) ?? b.id;
    const op = opMap.get(b.id);
    const np = npMap.get(b.id);
    const nb = nbMap.get(b.id);
    const opY = op?.y ?? '?';
    const opH = op?.h ?? '?';
    const npY = np?.y ?? '?';
    const npH = np?.h ?? '?';
    const old_dy = op != null && np != null ? np.y - op.y : '?';
    const nbY = nb?.y ?? '?';
    const ok = nb != null && nb.y === b.y && nb.h === b.h;
    const status = ok ? '✓' : `✗ DRIFT`;
    return [
      p(short, COL.id),
      p(`${b.y} ${b.h}`, COL.baseY + 2),
      p(`${opY}  ${opH}`, COL.opYH),
      p(`${npY}  ${npH}`, COL.npYH),
      p(old_dy, COL.dy),
      p(nbY, COL.nbY),
      p(b.y, COL.expY),
      p(status, COL.st),
    ].join(' | ');
  });

  return [`=== ${label} ===`, header, divider, ...rows].join('\n');
}

/**
 * Per-item trace table for simpleGrow property tests.
 *
 * Columns:
 *   id            — short label
 *   base          — designed position (x y w h, h=hidden-in-base)
 *   output        — simpleGrow output position
 *   expected_h    — h hidden-in-base items should get (0), visible items keep base h
 *   status        — ✓ if output matches expected, ✗ DRIFT if not, ✗ COLLIDES if involved in collision
 */
export function formatSimpleGrowTrace(
  label: string,
  base: Array<{ id: string; x: number; y: number; w: number; h: number; hidden?: boolean }>,
  output: Array<{ id: string; x: number; y: number; w: number; h: number }>,
  collidingIds: Set<string>,
  idToShort: Map<string, string>,
): string {
  const outMap = new Map(output.map((c) => [c.id, c]));

  const p = (s: string | number, w: number) => String(s).padStart(w);
  const header = [p('id', 4), p('base x y w h hidden', 22), p('out x y w h', 14), p('exp_h', 6), p('status', 14)].join(
    ' | ',
  );
  const divider = '-'.repeat(header.length);

  const rows = base.map((b) => {
    const short = idToShort.get(b.id) ?? b.id;
    const out = outMap.get(b.id);
    const expectedH = b.hidden ? 0 : b.h;
    const drifted = out && (out.x !== b.x || out.y !== b.y || out.w !== b.w || out.h !== expectedH);
    const collides = collidingIds.has(b.id);
    const status = collides ? '✗ COLLIDES' : drifted ? '✗ DRIFT' : '✓';
    const outStr = out ? `${out.x} ${out.y} ${out.w} ${out.h}` : 'MISSING';
    return [
      p(short, 4),
      p(`${b.x} ${b.y} ${b.w} ${b.h} ${b.hidden ? 'hidden' : ''}`, 22),
      p(outStr, 14),
      p(expectedH, 6),
      p(status, 14),
    ].join(' | ');
  });

  return [`=== ${label} ===`, header, divider, ...rows].join('\n');
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDebug(label: string, obj: unknown): string {
  return `${label}: ${JSON.stringify(obj, null, 2)}`;
}

/**
 * Renders a 2D ASCII grid of layout items for visual debugging.
 *
 * Cell notation (labels are single-char IDs from idToShort, built once per iteration):
 *   N    — component N, visible
 *   Nh   — component N is HIDDEN IN BASE (CompactionItemIn.hidden === true)
 *   N~   — component N is COLLAPSED in a presented layout (h === 0);
 *           drawn as a single row at its y position (shows where it "sits")
 *   A/B  — components A and B both occupy this cell (overlap in base)
 *   .    — empty cell
 *
 * @param label      Short title for the grid, e.g. 'BASE', 'OLD PRESENTED'
 * @param items      Items to draw — CompactionItemIn has .hidden; CompactionItem does not
 * @param idToShort  Consistent id→label map built once from base IDs so the same component
 *                   always has the same digit label across all grids in one error message
 */
export function formatGrid(
  label: string,
  items: Array<{ id: string; x: number; y: number; w: number; h: number; hidden?: boolean }>,
  idToShort: Map<string, string>,
): string {
  if (items.length === 0) return `=== ${label} ===\n  (empty)`;

  const maxX = Math.max(6, ...items.map((c) => c.x + Math.max(c.w, 1)));
  const maxY = Math.max(4, ...items.map((c) => c.y + Math.max(c.h, 1)));

  // Build grid of cell strings; '.' = empty
  const grid: string[][] = Array.from({ length: maxY }, () => Array(maxX).fill('.'));

  for (const item of items) {
    const short = idToShort.get(item.id) ?? '?';
    const isBaseHidden = item.hidden === true;
    const isCollapsed = item.h === 0;

    if (isCollapsed) {
      // Collapsed: single-row marker at item.y showing the item is there but has no height
      for (let cx = item.x; cx < item.x + Math.max(item.w, 1); cx++) {
        if (cx >= maxX || item.y >= maxY) continue;
        const cur = grid[item.y]![cx]!;
        const mark = `${short}~`;
        grid[item.y]![cx] = cur === '.' ? mark : `${cur}/${mark}`;
      }
    } else {
      const mark = isBaseHidden ? `${short}h` : short;
      for (let cy = item.y; cy < item.y + item.h; cy++) {
        for (let cx = item.x; cx < item.x + item.w; cx++) {
          if (cx >= maxX || cy >= maxY) continue;
          const cur = grid[cy]![cx]!;
          grid[cy]![cx] = cur === '.' ? mark : `${cur}/${mark}`;
        }
      }
    }
  }

  // Dynamic cell width so all columns align regardless of overlap text length
  const cellW = Math.max(3, ...grid.flat().map((c) => c.length));
  const pad = (s: string) => s.padEnd(cellW);

  // Legend — only mention suffixes that actually appear in this layout
  const hasBaseHidden = items.some((c) => c.hidden === true);
  const hasCollapsed = items.some((c) => c.h === 0);
  const legendIds = [...idToShort.entries()].map(([id, s]) => `${s}=${id}`).join(', ');
  const legendSuffix = [hasBaseHidden ? 'h=hidden-in-base' : '', hasCollapsed ? '~=collapsed(h=0)' : '']
    .filter(Boolean)
    .join(', ');

  const header = `y\\x` + Array.from({ length: maxX }, (_, i) => ` ${pad(String(i))}`).join('');
  const divider = '   ' + Array.from({ length: maxX }, () => '-'.repeat(cellW + 1)).join('');
  const rows = grid.map((row, y) => `${String(y).padStart(3)}` + row.map((r) => ` ${pad(r)}`).join(''));

  return [
    `=== ${label} ===`,
    `  [${legendIds}${legendSuffix ? ' | ' + legendSuffix : ''}]`,
    header,
    divider,
    ...rows,
  ].join('\n');
}
