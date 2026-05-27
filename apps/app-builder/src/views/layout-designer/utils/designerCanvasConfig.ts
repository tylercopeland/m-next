/**
 * Designer-specific canvas configuration.
 *
 * Wraps the shared canvas config from @m-next/layout-canvas with
 * designer-only concerns like appRibbonType (tab panel) overrides.
 */
import type { CSSProperties } from 'react';
import {
  type Resolution,
  TAB_PANEL_WIDTH,
  CANVAS_DIMENSIONS,
  getCanvasWidth as getBaseCanvasWidth,
} from '@m-next/layout-canvas';

/**
 * Returns CSS style properties for the designer OUTER container.
 *
 * For ribbon types (1 or 2), returns full width - LayoutCanvasWrapper
 * handles internal canvas/ribbon sizing.
 * Otherwise returns resolution-appropriate dimensions.
 */
export function getDesignerCanvasStyle(
  resolution: Resolution,
  appRibbonType?: number,
): CSSProperties {
  // For ribbon types, use full width outer container
  // The LayoutCanvasWrapper handles the internal canvas/ribbon sizing
  if (appRibbonType === 1 || appRibbonType === 2) {
    return {
      width: '100%',
      minWidth: CANVAS_DIMENSIONS.desktop.minWidth,
      maxWidth: CANVAS_DIMENSIONS.desktop.maxWidth,
    };
  }

  switch (resolution) {
    case 'tablet':
      return {
        width: CANVAS_DIMENSIONS.tablet.width,
        minWidth: CANVAS_DIMENSIONS.tablet.width,
        maxWidth: CANVAS_DIMENSIONS.tablet.width,
      };
    case 'mobile':
      return {
        width: CANVAS_DIMENSIONS.mobile.width,
        minWidth: CANVAS_DIMENSIONS.mobile.width,
        maxWidth: CANVAS_DIMENSIONS.mobile.width,
      };
    default:
      return {
        width: '100%',
        minWidth: CANVAS_DIMENSIONS.desktop.minWidth,
        maxWidth: CANVAS_DIMENSIONS.desktop.maxWidth,
      };
  }
}

/**
 * Returns the numeric canvas width for RGL calculations.
 *
 * When appRibbonType is 2 (tab panel), returns TAB_PANEL_WIDTH.
 * Otherwise delegates to the shared getCanvasWidth.
 */
export function getDesignerCanvasWidth(
  resolution: Resolution,
  appRibbonType?: number,
): number {
  if (appRibbonType === 2) {
    return TAB_PANEL_WIDTH;
  }
  return getBaseCanvasWidth(resolution);
}

/**
 * Clamps the nominal canvas width to the measured container width for desktop
 * resolution so that RGL does not position elements beyond the visible area
 * when the designer pane is narrower than the theoretical maximum (NCNG-831).
 *
 * Only applies to desktop — tablet and mobile have fixed widths that are always
 * fully visible and should not be clamped.
 *
 * @param nominalWidth - The theoretical maximum width from getDesignerCanvasWidth
 * @param containerMeasuredWidth - The actual measured pixel width of the container (from useResizeDetector)
 * @param resolution - The current device resolution
 * @returns The width RGL should use for element positioning
 */
export function clampCanvasWidth(
  nominalWidth: number,
  containerMeasuredWidth: number | undefined,
  resolution: Resolution,
): number {
  if (
    resolution === 'desktop' &&
    containerMeasuredWidth != null &&
    containerMeasuredWidth > 0
  ) {
    return Math.min(nominalWidth, containerMeasuredWidth);
  }
  return nominalWidth;
}
