/**
 * Shared responsive utilities for consistent breakpoint behavior
 * across App Builder and MethodUI Runtime.
 */

/**
 * Display layout enum for categorizing screen sizes.
 * Used by Runtime.js to determine layout behavior.
 */
export const DisplayLayout = {
  Desktop: 0,
  Tablet: 1,
  Mobile: 2,
} as const;

export type DisplayLayoutType = (typeof DisplayLayout)[keyof typeof DisplayLayout];

/**
 * Screen breakpoint thresholds in pixels.
 * These values are used consistently across App Builder and Runtime.
 *
 * - Mobile: < 768px (4 columns)
 * - Tablet: 768px - 1023px (8 columns)
 * - Desktop: >= 1024px (12 columns)
 */
export const SCREEN_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

export type Resolution = 'mobile' | 'tablet' | 'desktop';

/**
 * Determines the screen type based on container width.
 * Used for intelligent responsive layout selection,
 * especially important for modals/popups that may be various sizes.
 *
 * @param width - Container width in pixels
 * @returns Screen type string for LayoutCanvas resolution prop
 */
export function getScreenTypeFromWidth(width: number): Resolution {
  if (width < SCREEN_BREAKPOINTS.MOBILE) {
    return 'mobile';
  }
  if (width < SCREEN_BREAKPOINTS.TABLET) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Converts DisplayLayout enum to resolution string.
 *
 * @param displayLayout - DisplayLayout enum value
 * @returns Screen type string
 */
export function displayLayoutToResolution(displayLayout: DisplayLayoutType | number): Resolution {
  switch (displayLayout) {
    case DisplayLayout.Mobile:
      return 'mobile';
    case DisplayLayout.Tablet:
      return 'tablet';
    case DisplayLayout.Desktop:
    default:
      return 'desktop';
  }
}

/**
 * Gets grid columns based on resolution.
 * Matches app-builder layout designer for consistent responsive behavior.
 *
 * @param resolution - Screen type
 * @returns Number of grid columns (4 for mobile, 8 for tablet, 12 for desktop)
 */
export function getGridColumns(resolution: Resolution): 4 | 8 | 12 {
  switch (resolution) {
    case 'mobile':
      return 4;
    case 'tablet':
      return 8;
    default:
      return 12; // desktop
  }
}
