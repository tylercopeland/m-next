/**
 * Centralized Z-Index Constants
 *
 * Defines a non-overlapping layering hierarchy for the App Builder.
 * All z-index values should reference these constants instead of ad-hoc numbers.
 *
 * Layer ranges:
 *   CANVAS (1-90)       — Grid item stacking on the canvas
 *   COMPONENT (5-25)    — Within-item stacking (relative to parent grid item)
 *   UI (10-300)         — Surrounding chrome (toolbar, header, ribbon, drag overlays)
 *   POPUP (1000-2000)   — Portaled overlays (popovers, tooltips, dropdowns, color pickers)
 *   MODAL (4000+)       — Full-screen overlays (dialogs, action editor)
 */

/** Canvas-level: grid item stacking order */
export const Z_CANVAS = {
  ITEM_NORMAL: undefined,
  PLACEHOLDER: 2,
  CONTAINER: 5,
  ITEM_TOP_ROW: 20,
  ITEM_SELECTED: 30,
  ITEM_HOVERED: 40,
  ITEM_DRAGGED: 50,
  ITEM_FOCUS_WITHIN: 60,
  RGL_DRAGGING: 70,
  CROSS_GRID_DRAG: 80,
  DROP_TARGET: 90,
} as const;

/** Component-level: within a grid item (relative to parent) */
export const Z_COMPONENT = {
  DASHED_BORDER: 5,
  BORDER: 10,
  BORDER_HOVERED: 11,
  INVALID_DROP: 12,
  BADGE_TOP: 15,
  BADGE_BOTTOM: 16,
  BADGE_INSIDE: 17,
  HIDDEN_BADGE: 18,
  UNCONFIGURED_BADGE: 19,
  PROTECTED_BADGE: 20,
  RESIZE_HANDLE: 21,
  INVALID_DROP_OVERLAY: 25,
} as const;

/** UI chrome surrounding the canvas */
export const Z_UI = {
  EMPTY_CANVAS: 10,
  RIGHT_PANEL: 100,
  RIBBON: 120,
  TOOLBAR: 150,
  HEADER: 200,
  PALETTE_DRAG: 300,
  INSERT_INDICATOR: 300,
} as const;

/** Portaled overlays (rendered outside normal flow) */
export const Z_POPUP = {
  POPOVER: 1000,
  TOOLTIP: 1100,
  GRID_FILTER: 1200,
  SCREEN_SELECTOR: 1300,
  COLOR_PICKER: 2000,
} as const;

/** Full-screen modal overlays */
export const Z_MODAL = {
  INVALID_SCREEN: 4000,
  DIALOG: 9001,
  ACTION_EDITOR: 9500,
} as const;
