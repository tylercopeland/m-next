import { ResponsiveComponent } from '../../rgl-integration/types';
import { CompactionItemIn, DynamicData, collides } from './compact';
import { simpleGrow } from './simpleGrow';
import { getHiddenState, type Resolution, type ScreenMode } from '../currentStateHelper';

export function reverseMapToBase(
  newPresented: ResponsiveComponent[],
  _oldPresented: ResponsiveComponent[],
  base: CompactionItemIn[],
): CompactionItemIn[] {
  if (!base.length) {
    return newPresented.map((np) => ({
      id: np.id,
      x: np.x,
      y: np.y,
      w: np.width,
      h: np.height,
      hidden: np.height === 0,
    }));
  }

  const newMap = new Map(newPresented.map((np) => [np.id, np]));
  const baseMap = new Map(base.map((b) => [b.id, b]));

  // Phase A: build result by computing positional deltas and applying them onto base positions.
  //
  // simpleGrow never changes x, so np.x is taken directly.
  //
  // For y, we compute dy = np.y − expected.y, where expected = simpleGrow(base, inferred_dynamic).
  // "expected" is what simpleGrow would produce for the new visibility state if the user had
  // made NO positional edits. Subtracting it out isolates only user-intent changes (drag/resize)
  // and removes compaction-induced shifts, which must NOT be written back to the base.
  //
  // Why not use (np.y − op.y)?  simpleGrow can shift VISIBLE items when other items' visibility
  // changes (row-group compaction offsets differ between dynamic states).  That shift is not
  // user intent and would drift base positions over time.
  //
  // Hidden-in-base items and dynamically-hidden items preserve their designed w/h.
  // Only items visible in both base and presented take w/h from the presented layout.

  // Infer the dynamic state from newPresented: hidden iff presented height is 0;
  // height override if presented height exceeds base height (user resized a visible item).
  const inferredDynamic: DynamicData[] = newPresented.map((np) => {
    const b = baseMap.get(np.id);
    const baseH = b ? b.h : 0;
    return {
      id: np.id,
      hidden: np.height === 0,
      height: np.height > baseH ? np.height : undefined,
    };
  });
  const expectedPresented = simpleGrow(base, inferredDynamic);
  const expectedMap = new Map(expectedPresented.map((e) => [e.id, e]));

  const result = new Map<string, CompactionItemIn>();

  for (const b of base) {
    const np = newMap.get(b.id);
    if (!np) continue; // item deleted from presented — omit from base'

    const exp = expectedMap.get(b.id);
    const dy = exp ? np.y - exp.y : 0;

    if (b.hidden || np.height === 0) {
      // Hidden-in-base or dynamically-hidden: preserve designed h/w, apply delta for y.
      result.set(b.id, { ...b, x: np.x, y: Math.max(0, b.y + dy) });
    } else {
      // Visible in base and in presented: take x/w/h from presented, apply delta for y.
      result.set(b.id, { ...b, x: np.x, y: Math.max(0, b.y + dy), w: np.width, h: np.height });
    }
  }

  // New items: present in newPresented but absent from base (e.g. newly added component).
  for (const np of newPresented) {
    if (!baseMap.has(np.id)) {
      result.set(np.id, { id: np.id, x: np.x, y: np.y, w: np.width, h: np.height, hidden: false });
    }
  }

  // Phase B+C: resolve all collisions in the base result.
  //
  // Two classes of collision can arise after Phase A:
  //
  //   B. A hidden-in-base item's full h-range overlaps a visible item that was
  //      moved into that range.  (The hidden item appeared as h=0 in presented,
  //      so the overlap was not visible to the user.)
  //
  //   C. Two visible items collide because an x-move placed the dragged item in
  //      a column that overlaps another item at the same base-y range.  In the
  //      presented layout this was hidden by the compaction offset (the dragged
  //      item was pushed below the other item by simpleGrow), but those offsets
  //      are absent in base space.
  //
  // Resolution rule — determines which item "yields" by moving down:
  //   • hidden item always yields to a visible item
  //   • among two visible items, the one with the higher y (further down) yields
  //   • tie-break by id for determinism
  //
  // Termination: every push strictly increases the yielding item's y; no y ever
  // decreases; the loop converges.
  //
  // Note: item.h in the result already holds the correct height —
  //   hidden items carry b.h (from `...b` in Phase A),
  //   visible items carry np.height — so collides() is called directly.
  const items = Array.from(result.values());
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      for (let j = 0; j < items.length; j++) {
        if (i === j) continue;
        const other = items[j]!;

        // Does `item` yield to `other`?
        const itemYields =
          (item.hidden && !other.hidden) ||
          (!item.hidden && !other.hidden && item.y > other.y) ||
          (!item.hidden && !other.hidden && item.y === other.y && item.id > other.id);

        if (!itemYields) continue;
        if (!collides(item, other)) continue;

        item.y = other.y + other.h;
        changed = true;
        continue outer;
      }
    }
  }

  return items;
}

/**
 * Builds DynamicData[] for the compaction algorithm in designer mode.
 *
 * Hidden components are given height=0 (collapsed) unless they are expanded
 * via showHiddenComponents toggle or by being the currently selected component.
 * Visible components pass through with their base height.
 */
export function mapHiddenToDynamic(
  components: ResponsiveComponent[],
  resolution: Resolution,
  mode: ScreenMode,
  showHiddenComponents: boolean,
  selectedComponentId: string | null,
): DynamicData[] {
  return components.map((comp) => {
    const isHidden = getHiddenState(comp, comp.responsive, resolution, mode);

    if (!isHidden) {
      return { id: comp.id, hidden: false };
    }

    // Hidden component: expand if toggle is on or if this is the selected component
    const isExpanded = showHiddenComponents || comp.id === selectedComponentId;

    return { id: comp.id, hidden: !isExpanded };
  });
}
