/**
 * Vertical Push Calculator
 *
 * Push-down functionality for static layout mode resize operations.
 * When a component is resized (height OR width increase), components that
 * would collide are pushed DOWN (never sideways).
 *
 * @see PL-60254: [Layout] Vertical Push - Resize (MVP)
 */

import { ResponsiveComponent } from '../rgl-integration/types';

// ============================================================================
// TYPES
// ============================================================================

export interface LayoutItem {
  i: string; // Component ID
  x: number; // X position (column)
  y: number; // Y position (row)
  w: number; // Width (columns)
  h: number; // Height (rows)
}

export interface PushResult {
  /** The new layout with pushed positions */
  layout: LayoutItem[];
  /** Whether any components were pushed */
  hasPushed: boolean;
  /** Number of iterations required to resolve */
  iterations: number;
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

/**
 * AABB (Axis-Aligned Bounding Box) collision detection
 * Checks if two rectangles overlap
 */
export function checkCollision(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * Check if two items overlap horizontally (X-axis only)
 * Used to quickly filter out items that can't possibly collide
 */
function hasHorizontalOverlap(a: { x: number; w: number }, b: { x: number; w: number }): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x;
}

// ============================================================================
// PUSH CALCULATION
// ============================================================================

/**
 * Resolve collisions by pushing items down (vertical push only)
 *
 * OPTIMIZED ALGORITHM (Y-sorted with early termination):
 * 1. Sort items by Y position (top to bottom) - O(n log n)
 * 2. Process pushers in order, only checking items below them
 * 3. Skip items with no horizontal overlap (can't collide)
 * 4. Early terminate when we hit a gap (items below don't overlap)
 *
 * Complexity: O(n log n + n × k) where k = avg items affected per push
 * For sparse layouts with gaps, k is small → near O(n log n)
 * For dense layouts, k approaches n → O(n²) worst case (same as before)
 *
 * @param resizedItem - The item being resized (at new dimensions)
 * @param layout - The current layout
 * @returns PushResult with new layout
 */
export function resolvePushCollisions(resizedItem: LayoutItem, layout: LayoutItem[]): PushResult {
  // Create mutable copy with resized item updated
  const itemMap = new Map<string, LayoutItem>();
  for (const item of layout) {
    if (item.i === resizedItem.i) {
      itemMap.set(item.i, { ...resizedItem });
    } else {
      itemMap.set(item.i, { ...item });
    }
  }

  const pushedIds = new Set<string>();
  let iterations = 0;
  const MAX_ITERATIONS = 50;

  // Queue of items that need to push things below them
  // Start with the resized item as the initial pusher
  let pushers: string[] = [resizedItem.i];

  while (pushers.length > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    const nextPushers: string[] = [];

    // Get all items sorted by Y for this iteration
    const sortedItems = Array.from(itemMap.values()).sort((a, b) => a.y - b.y);

    for (const pusherId of pushers) {
      const pusher = itemMap.get(pusherId);
      if (!pusher) continue;

      const pusherBottom = pusher.y + pusher.h;

      // Only check items that are at or below the pusher's bottom edge
      // Since sorted by Y, we can find the starting point efficiently
      for (const item of sortedItems) {
        // Skip self
        if (item.i === pusherId) continue;

        // Skip items that are completely above the pusher (no vertical overlap possible)
        // Since items are sorted by Y, once we're past pusherBottom with no overlap, we could
        // potentially break early, but we need to check horizontal overlap first
        if (item.y + item.h <= pusher.y) continue;

        // Skip items with no horizontal overlap (can never collide)
        if (!hasHorizontalOverlap(pusher, item)) continue;

        // Check for actual collision
        if (checkCollision(pusher, item)) {
          const newY = pusherBottom;

          // Only push if position actually changes
          if (newY !== item.y) {
            itemMap.set(item.i, { ...item, y: newY });
            pushedIds.add(item.i);

            // This item may now push things below it
            if (!nextPushers.includes(item.i)) {
              nextPushers.push(item.i);
            }
          }
        }
      }
    }

    pushers = nextPushers;
  }

  return {
    layout: Array.from(itemMap.values()),
    hasPushed: pushedIds.size > 0,
    iterations,
  };
}

// ============================================================================
// RESIZE PUSH CALCULATION
// ============================================================================

/**
 * Calculate push for resize operations.
 * Triggers push when height OR width increases and causes collision.
 *
 * @param resizedItem - The item after resize (with new dimensions)
 * @param originalWidth - Original width before resize
 * @param originalHeight - Original height before resize
 * @param layout - Current layout
 */
export function calculateResizePush(
  resizedItem: LayoutItem,
  originalWidth: number,
  originalHeight: number,
  layout: LayoutItem[],
): PushResult {
  const heightIncreased = resizedItem.h > originalHeight;
  const widthIncreased = resizedItem.w > originalWidth;

  // If shrinking or no change, no push needed
  if (!heightIncreased && !widthIncreased) {
    return {
      layout,
      hasPushed: false,
      iterations: 0,
    };
  }

  // Use the standard push resolution with the resized item
  return resolvePushCollisions(resizedItem, layout);
}

// ============================================================================
// CONVERSION HELPERS
// ============================================================================

/**
 * Convert ResponsiveComponent array to LayoutItem array
 */
export function componentsToLayoutItems(components: ResponsiveComponent[]): LayoutItem[] {
  return components.map((c) => ({
    i: c.id,
    x: c.x,
    y: c.y,
    w: c.width,
    h: c.height,
  }));
}

/**
 * Apply layout changes back to ResponsiveComponent array
 */
export function applyLayoutToComponents(
  components: ResponsiveComponent[],
  layout: LayoutItem[],
): ResponsiveComponent[] {
  const layoutMap = new Map(layout.map((item) => [item.i, item]));

  return components.map((component) => {
    const layoutItem = layoutMap.get(component.id);
    if (layoutItem) {
      return {
        ...component,
        x: layoutItem.x,
        y: layoutItem.y,
        width: layoutItem.w,
        height: layoutItem.h,
      };
    }
    return component;
  });
}
