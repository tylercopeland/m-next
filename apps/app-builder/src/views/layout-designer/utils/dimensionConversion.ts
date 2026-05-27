/**
 * Centralized dimension conversion utilities for layout canvas components
 * Converts grid units to pixel dimensions consistently across all components
 */

// Layout canvas configuration from LayoutCanvasWrapper
export const LAYOUT_CANVAS_CONFIG = {
  ROW_HEIGHT: 36, // pixels per row
  COLUMN_WIDTH: 75, // pixels per column (900px / 12 columns = 75px per column)
  MIN_HEIGHT: 100, // minimum height in pixels
  MIN_WIDTH: 150,  // minimum width in pixels
};

/**
 * Converts grid height (rows) to pixel height
 * @param gridHeight - Height in grid rows
 * @returns Height in pixels
 */
export function convertGridHeightToPixels(gridHeight: number | undefined | null): number {
  if (!gridHeight || gridHeight <= 0) {
    return LAYOUT_CANVAS_CONFIG.MIN_HEIGHT;
  }
  
  const pixelHeight = gridHeight * LAYOUT_CANVAS_CONFIG.ROW_HEIGHT;
  return Math.max(pixelHeight, LAYOUT_CANVAS_CONFIG.MIN_HEIGHT);
}

/**
 * Converts grid width (columns) to pixel width
 * @param gridWidth - Width in grid columns
 * @returns Width in pixels
 */
export function convertGridWidthToPixels(gridWidth: number | undefined | null): number {
  if (!gridWidth || gridWidth <= 0) {
    return LAYOUT_CANVAS_CONFIG.MIN_WIDTH;
  }
  
  const pixelWidth = gridWidth * LAYOUT_CANVAS_CONFIG.COLUMN_WIDTH;
  return Math.max(pixelWidth, LAYOUT_CANVAS_CONFIG.MIN_WIDTH);
}

/**
 * Converts both grid dimensions to pixel dimensions
 * @param gridWidth - Width in grid columns
 * @param gridHeight - Height in grid rows
 * @returns Object with width and height in pixels
 */
export function convertGridDimensionsToPixels(
  gridWidth: number | undefined | null, 
  gridHeight: number | undefined | null
): { width: number; height: number } {
  return {
    width: convertGridWidthToPixels(gridWidth),
    height: convertGridHeightToPixels(gridHeight)
  };
}

/**
 * Enhanced control interface that includes pixel dimensions
 * for components that need pixel-based sizing
 */
 
export interface ControlWithPixelDimensions extends Record<string, unknown> {
  id: string;
  width?: number;  // Grid width (columns)
  height?: number; // Grid height (rows)
  pixelWidth: number;   // Converted pixel width
  pixelHeight: number;  // Converted pixel height
}

/**
 * Enhances a control object with pixel dimension properties
 * @param control - Original control object
 * @returns Control with added pixel dimensions
 */
 
export function enhanceControlWithPixelDimensions<T extends Record<string, unknown>>(control: T): T & ControlWithPixelDimensions {
  const gridWidth = typeof control?.width === 'number' ? control.width : null;
  const gridHeight = typeof control?.height === 'number' ? control.height : null;
  const { width, height } = convertGridDimensionsToPixels(gridWidth, gridHeight);

  return {
    ...control,
    id: control.id as string || 'unknown',
    pixelWidth: width,
    pixelHeight: height
  };
}
