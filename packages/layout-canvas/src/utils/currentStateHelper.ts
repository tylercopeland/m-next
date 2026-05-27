import { CurrentState } from '@m-next/types';
import type { ResponsiveLayoutItem } from './structureConverters';

/**
 * Responsive data structure for a control (extracted from ResponsiveLayoutItem)
 */
export type ResponsiveData = Pick<ResponsiveLayoutItem, 'desktop' | 'tabletOverride' | 'mobileOverride'>;

/**
 * Control data with visibility properties
 */
export interface ControlData {
  visible?: boolean;
  isHidden?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

export type Resolution = 'desktop' | 'tablet' | 'mobile';

export type ScreenMode = 'designer' | 'runtime';

/**
 * Pure function to derive the current state (isHidden, disabled) from control, responsive data, and resolution.
 * Prefers control values, but if those are default (isHidden = false, disabled = false),
 * it returns the responsive values based on the current resolution (defaults to desktop if mobile/tablet is undefined).
 *
 * @param control - The control object with visible and disabled properties
 * @param responsiveData - The responsive data object with desktop, tabletOverride, and mobileOverride
 * @param resolution - The current resolution ('desktop', 'tablet', or 'mobile')
 * @returns Object with isHidden and disabled properties
 */

export function getHiddenState(
  control: Record<string, any>,
  responsiveData: ResponsiveData | null | undefined,
  resolution: Resolution,
  mode: ScreenMode,
): boolean {
  // Source of truth at runtime. On load, data is loaded from responsive object
  // into control data to maintain compatability with actions.
  if (mode === 'runtime') {
    return control.visible === false;
  } // null = visible
  // Designer mode
  if (!responsiveData || !responsiveData.desktop) {
    // Fallback: if no responsive data, check control.isHidden or visible
    return control?.isHidden === true || control?.visible === false;
  }
  let responsive = responsiveData.desktop; // default
  if (resolution === 'tablet' && responsiveData.tabletOverride) {
    responsive = responsiveData.tabletOverride;
  } else if (resolution === 'mobile' && responsiveData.mobileOverride) {
    responsive = responsiveData.mobileOverride;
  }
  const currentState = responsive.currentState;
  return currentState === CurrentState.HIDDEN;
}

export function getDisabledState(
  control: ControlData,
  responsiveData: ResponsiveData | null | undefined,
  resolution: Resolution,
  mode: ScreenMode,
): boolean {
  // On load, data is loaded from responsive object into control data to
  // maintain compatability with actions
  if (mode === 'runtime') {
    return !!control.disabled;
  }
  // Designer mode
  if (!responsiveData || !responsiveData.desktop) {
    // Fallback: if no responsive data, check control.disabled
    return control?.disabled === true;
  }
  let responsive = responsiveData.desktop; // default
  if (resolution === 'tablet' && responsiveData.tabletOverride) {
    responsive = responsiveData.tabletOverride;
  } else if (resolution === 'mobile' && responsiveData.mobileOverride) {
    responsive = responsiveData.mobileOverride;
  }
  const currentState = responsive.currentState;
  return currentState === CurrentState.DISABLED;
}
