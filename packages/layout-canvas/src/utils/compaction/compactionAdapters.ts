import type { ResponsiveComponent } from '../../rgl-integration/types';
import type { CompactionItem, CompactionItemIn, DynamicData } from './compact';
import { getHiddenState } from '../currentStateHelper';
import type { Resolution, ScreenMode } from '../currentStateHelper';
import { reverseMap } from '.';

/**
 * Converts a pre-filtered component set to CompactionItemIn[].
 * The caller is responsible for providing only the components that should
 * participate in compaction (e.g. container children via getChildComponents).
 * For root-level components pass through componentsToGridItems instead.
 */
export function toCompactionBaseItems(
  components: ResponsiveComponent[],
  resolution: Resolution,
  mode: ScreenMode,
): CompactionItemIn[] {
  return components.map((c) => ({
    id: c.id,
    x: Number(c.x) || 0,
    y: Number(c.y) || 0,
    w: Number(c.width) || 1,
    h: Number(c.height) || 1,
    hidden: getHiddenState(c, c.responsive, resolution, mode),
  }));
}

/**
 * Builds DynamicData[] for runtime compaction from a pre-filtered component set.
 * For root-level components use buildDynamicData instead.
 */
export function toRuntimeDynamicData(
  components: ResponsiveComponent[],
  resolution: Resolution,
  mode: ScreenMode,
  observedHeights?: Map<string, number>,
): DynamicData[] {
  return components.map((c) => ({
    id: c.id,
    height: observedHeights?.get(c.id),
    hidden: getHiddenState(c, c.responsive, resolution, mode),
  }));
}

/**
 * Convert ResponsiveComponent[] to CompactionItemIn[] (base layout for compaction).
 *
 * CompactionItemIn represents the DESIGNED (base) layout with hidden state.
 * Only root-level components (containerId === null) participate.
 */
export function componentsToGridItems(
  components: ResponsiveComponent[],
  resolution: Resolution,
  mode: ScreenMode,
): CompactionItemIn[] {
  return toCompactionBaseItems(
    components.filter((c) => !c.containerId),
    resolution,
    mode,
  );
}

/**
 * Build DynamicData[] from ResponsiveComponent[] with optional observed heights.
 *
 * DynamicData represents the RUNTIME state: actual height (may differ from
 * base due to content growth) and current visibility.
 *
 * @param components - The full components array
 * @param resolution - Current breakpoint
 * @param mode - 'designer' or 'runtime'
 * @param observedHeights - Optional map of component ID → observed grid-unit height
 *                          (from RuntimeLayoutProvider / SizeObserverContext)
 */
export function buildDynamicData(
  components: ResponsiveComponent[],
  resolution: Resolution,
  mode: ScreenMode,
  observedHeights?: Map<string, number>,
): DynamicData[] {
  return toRuntimeDynamicData(
    components.filter((c) => !c.containerId),
    resolution,
    mode,
    observedHeights,
  );
}

/**
 * Apply compacted LayoutItem[] positions back to ResponsiveComponent[].
 *
 * Returns a new array. Components NOT in the compacted output (hidden and removed)
 * are passed through unchanged — they will be filtered from rendering separately.
 * Container children also pass through unchanged.
 */
export function applyCompactedLayout(
  components: ResponsiveComponent[],
  compactedLayout: CompactionItem[],
): ResponsiveComponent[] {
  const layoutMap = new Map(compactedLayout.map((item) => [item.id, item]));

  return components.map((comp) => {
    if (comp.containerId) return comp;

    const compacted = layoutMap.get(comp.id);
    if (!compacted) return comp;

    if (
      compacted.y === Number(comp.y) &&
      compacted.h === Number(comp.height) &&
      compacted.x === Number(comp.x) &&
      compacted.w === Number(comp.width)
    ) {
      return comp;
    }

    return {
      ...comp,
      x: compacted.x,
      y: compacted.y,
      width: compacted.w,
      height: compacted.h,
    };
  });
}

export function sortedByExistingOrder<T extends { id: string }>(existingItems: T[], newItems: T[]): T[] {
  const existingOrder = new Map(existingItems.map((item, index) => [item.id, index]));
  const existingInNew: T[] = [];
  const newOnly: T[] = [];

  for (const item of newItems) {
    if (existingOrder.has(item.id)) {
      existingInNew.push(item);
    } else {
      newOnly.push(item);
    }
  }

  existingInNew.sort((a, b) => existingOrder.get(a.id)! - existingOrder.get(b.id)!);

  return [...existingInNew, ...newOnly];
}

/**
 * Reverse-maps a layout change from presented (compacted) space back to base space,
 * returning a full ResponsiveComponent[] with updated positions.
 *
 * Converts base components to grid items, delegates to the reverse-mapping algorithm,
 * then merges the result back onto the full component objects.
 */
export function reverseMapBaseLayout(
  newPresented: ResponsiveComponent[],
  oldPresented: ResponsiveComponent[],
  base: ResponsiveComponent[],
  resolution: Resolution,
): ResponsiveComponent[] {
  const baseGridItems = componentsToGridItems(base, resolution, 'runtime');
  const remapped = reverseMap(newPresented, oldPresented, baseGridItems);
  const layout = applyCompactedLayout(base, remapped);
  const ordered = sortedByExistingOrder(base, layout); // so hidden components render in the same order each time
  return ordered;
}
