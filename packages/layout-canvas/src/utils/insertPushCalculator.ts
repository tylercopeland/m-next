/**
 * Insert Push Calculator
 *
 * Handles push-down logic for INSERT operations.
 * Reuses the collision resolution algorithm from verticalPushCalculator.
 *
 * Key difference from resize push:
 * - Resize: Component already exists, dimensions changed
 * - Insert: New component being placed, may cause collision
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import { LayoutItem, PushResult, resolvePushCollisions, checkCollision } from './verticalPushCalculator';

/**
 * Calculate push for INSERT operations.
 * When inserting a new component at a target position, push all
 * overlapping components down to make room.
 *
 * @param insertedItem - The item being inserted (at target position with dimensions)
 * @param existingLayout - Current layout (EXCLUDING the inserted item)
 * @returns PushResult with new layout including the inserted item
 */
export function calculateInsertPush(insertedItem: LayoutItem, existingLayout: LayoutItem[]): PushResult {
  // Check if any existing items collide with insert position
  const hasCollision = existingLayout.some((item) => checkCollision(insertedItem, item));

  // No collision = no push needed
  if (!hasCollision) {
    return {
      layout: [...existingLayout, insertedItem],
      hasPushed: false,
      iterations: 0,
    };
  }

  // Create layout with inserted item and resolve collisions
  // The inserted item acts as the "pusher" - it stays in place, others move
  const layoutWithInsert = [...existingLayout, insertedItem];
  return resolvePushCollisions(insertedItem, layoutWithInsert);
}

/**
 * Quick check if insert at position would require push.
 * Use for visual feedback during drag (before calculating full push).
 *
 * @param targetX - Target X position (column)
 * @param targetY - Target Y position (row)
 * @param width - Width of component being inserted
 * @param height - Height of component being inserted
 * @param layout - Current layout
 * @returns true if push would be required
 */
export function wouldInsertRequirePush(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  layout: LayoutItem[],
): boolean {
  const insertBounds = { x: targetX, y: targetY, w: width, h: height };
  return layout.some((item) => checkCollision(insertBounds, item));
}

/**
 * Get the IDs of components that would be pushed by an insert.
 * Useful for visual feedback showing which components will move.
 *
 * @param targetX - Target X position (column)
 * @param targetY - Target Y position (row)
 * @param width - Width of component being inserted
 * @param height - Height of component being inserted
 * @param layout - Current layout
 * @returns Array of component IDs that would be pushed
 */
export function getComponentsToPush(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  layout: LayoutItem[],
): string[] {
  const insertBounds = { x: targetX, y: targetY, w: width, h: height };
  return layout.filter((item) => checkCollision(insertBounds, item)).map((item) => item.i);
}
