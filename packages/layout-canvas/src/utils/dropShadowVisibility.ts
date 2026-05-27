/**
 * Drop Shadow Visibility
 *
 * Controls whether the drag drop shadow should be visible during drag operations.
 * The shadow should be hidden when insert mode is active (overlapping components).
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import { LayoutItem, checkCollision } from './verticalPushCalculator';

/**
 * Determine if drop shadow should be visible during drag.
 *
 * Rules:
 * - Show shadow when dragging into empty space (no collision)
 * - Hide shadow when insert mode is active (would cause push)
 *
 * @param targetX - Target X position (column)
 * @param targetY - Target Y position (row)
 * @param width - Width of component being dragged (columns)
 * @param height - Height of component being dragged (rows)
 * @param layout - Current layout (excluding the dragged component if it exists)
 * @param draggedItemId - ID of item being dragged (to exclude from collision check)
 * @returns true if shadow should be visible, false to hide it
 */
export function shouldShowDropShadow(
  targetX: number,
  targetY: number,
  width: number,
  height: number,
  layout: LayoutItem[],
  draggedItemId?: string,
): boolean {
  const dragBounds = { x: targetX, y: targetY, w: width, h: height };

  // Filter out the dragged item itself from collision checks
  const layoutToCheck = draggedItemId ? layout.filter((item) => item.i !== draggedItemId) : layout;

  // Check if there's any collision
  const hasCollision = layoutToCheck.some((item) => checkCollision(dragBounds, item));

  // Show shadow only when there's no collision (not in insert mode)
  return !hasCollision;
}

/**
 * Get CSS class for drop shadow based on insert mode state.
 *
 * @param isInsertMode - Whether insert mode is currently active
 * @returns CSS class name for the drop shadow element
 */
export function getDropShadowClassName(isInsertMode: boolean): string {
  return isInsertMode ? 'react-grid-item-drop-shadow-hidden' : 'react-grid-item-drop-shadow';
}
