/**
 * Shared canvas configuration constants.
 *
 * Single source of truth for resolution breakpoints, grid columns,
 * and canvas dimensions used by both the layout designer and runtime.
 */

export type Resolution = 'desktop' | 'tablet' | 'mobile';

/** Width of the tab panel layout (appRibbonType === 2) */
export const TAB_PANEL_WIDTH = 440;

/** Canvas dimension constraints per resolution */
export const CANVAS_DIMENSIONS = {
  desktop: { minWidth: 976, maxWidth: 1200 },
  tablet: { width: 768 },
  mobile: { width: 375 },
} as const;

/** Grid column counts per resolution */
export const GRID_COLUMNS: Record<Resolution, number> = {
  desktop: 12,
  tablet: 8,
  mobile: 4,
};

/**
 * Returns the grid column count for a given resolution.
 */
export function getGridColumns(resolution: Resolution): number {
  return GRID_COLUMNS[resolution] ?? GRID_COLUMNS.desktop;
}

/**
 * Returns the canonical canvas width for a given resolution.
 * Desktop returns maxWidth (1200), tablet and mobile return their fixed widths.
 */
export function getCanvasWidth(resolution: Resolution): number {
  switch (resolution) {
    case 'tablet':
      return CANVAS_DIMENSIONS.tablet.width;
    case 'mobile':
      return CANVAS_DIMENSIONS.mobile.width;
    default:
      return CANVAS_DIMENSIONS.desktop.maxWidth;
  }
}
