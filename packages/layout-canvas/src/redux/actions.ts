/**
 * Local Redux actions for layout-canvas package
 *
 * These actions provide access to Redux actions without importing from app-builder,
 * breaking the circular dependency.
 *
 * Note: These are lightweight action creators that match the signatures used by app-builder.
 * The actual Redux actions are processed by app-builder's screenLayoutSlice.
 */

export interface ControlSelectedAction {
  type: string;
  payload: {
    controlId: string;
    property: Record<string, unknown>;
  };
}

/**
 * Action creator for selecting a control with specific properties
 * Used by CalendarWrapperRedux and other wrappers that need to dispatch control selection
 */
export const controlSelected = (payload: {
  controlId: string;
  property: Record<string, unknown>;
}): ControlSelectedAction => ({
  type: 'screenLayout/controlSelected',
  payload,
});

/**
 * Action creator for clearing the last control updated state
 * Used by FieldBlockWrapperRedux to reset the forceOpen state after a control is updated
 */
export const clearLastControlUsed = () => ({
  type: 'screenLayout/clearLastControlUsed',
});
