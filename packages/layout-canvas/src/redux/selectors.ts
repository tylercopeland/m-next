/**
 * Local Redux selectors for layout-canvas package
 *
 * These selectors provide access to Redux state without importing from app-builder,
 * breaking the circular dependency.
 *
 * Note: These are lightweight wrappers that simply access state.screenLayout.controls
 * The actual Redux state is managed by app-builder's screenLayoutSlice.
 */

import type { RootState } from './types';

/**
 * Select all controls from the Redux store
 * This mirrors app-builder's selectControls but is defined locally
 *
 * Note: Returns empty object if state structure doesn't match (e.g. in Runtime mode)
 */
export const selectControls = (state: RootState): Record<string, unknown> => {
  // Safely handle missing or differently structured state
  try {
    return state?.screenLayout?.controls || {};
  } catch {
    return {};
  }
};

/**
 * Select a single control by ID
 * Convenience selector for wrappers that need a specific control
 */
export const selectControl = (state: RootState, id: string): unknown => {
  const controls = selectControls(state);
  return controls[id] || null;
};

/**
 * Select the base model from the Redux store
 * Used by AttachmentsWrapper, GalleryWrapper
 */
export const selectBaseModel = (state: RootState): string | null => {
  try {
    return ((state?.screenLayout as Record<string, unknown>)?.baseModel as string | null) || null;
  } catch {
    return null;
  }
};

/**
 * Select the active record ID from the Redux store
 * Used by AttachmentsWrapper, GalleryWrapper
 */
export const selectActiveRecordId = (state: RootState): string | null => {
  try {
    return ((state?.screenLayout as Record<string, unknown>)?.activeRecordId as string | null) || null;
  } catch {
    return null;
  }
};

/**
 * Select the selected control property from the Redux store
 * Used by CalendarWrapperRedux for control-specific properties
 */
export const selectSelectedControlProperty = (state: RootState): Record<string, unknown> | null => {
  try {
    return (
      ((state?.screenLayout as Record<string, unknown>)?.selectedControlProperty as Record<string, unknown> | null) ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Select the selected control ID from the Redux store
 * Used by GridWrapperRedux and other wrappers to determine which control is currently selected
 */
export const selectSelectedControlId = (state: RootState): string | null => {
  try {
    return ((state?.screenLayout as Record<string, unknown>)?.selectedControlId as string | null) || null;
  } catch {
    return null;
  }
};

/**
 * Select the last control that was updated
 * Used by FieldBlockWrapperRedux to force open a field block when it's updated
 */
export const selectLastControlUpdated = (state: RootState): string | null => {
  try {
    return ((state?.screenLayout as Record<string, unknown>)?.lastControlUpdated as string | null) || null;
  } catch {
    return null;
  }
};
