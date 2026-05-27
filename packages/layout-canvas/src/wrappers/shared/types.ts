/**
 * Shared Wrapper Types
 *
 * Common type definitions used across all component wrappers.
 * Provides consistent interface for both designer and runtime modes.
 *
 * @module wrappers/shared/types
 */

import type { ActionHandler } from '../../actions/types';

/**
 * Rendering mode for component wrappers
 * - designer: For app-builder (drag/drop, resize, edit)
 * - runtime: For MethodUI (execute actions, display data)
 */
export type WrapperMode = 'designer' | 'runtime';

/**
 * Base props that all wrapper components accept
 * Extended by control-specific wrapper prop interfaces
 */
export interface BaseWrapperProps {
  /**
   * Unique identifier for the component
   * Used to look up control data from Redux
   */
  id: string;

  /**
   * Rendering mode - determines behavior
   * @default 'designer'
   */
  mode?: WrapperMode;

  // ===== Designer Mode Props =====

  /**
   * Callback when component is clicked in designer mode
   * Used for component selection
   * @param id - Component ID that was clicked
   */
  onControlClick?: (id: string) => void;

  /**
   * Whether this component is currently selected in designer
   * Used to show selection outline
   */
  isSelected?: boolean;

  // ===== Runtime Mode Props =====

  /**
   * Action handler for executing actionsets in runtime mode
   * Required for runtime mode to function
   */
  actionHandler?: ActionHandler;

  /**
   * Current screen ID
   * Required for action execution context
   */
  screenId?: string;

  /**
   * Current record ID being viewed/edited
   * Optional - used for record-specific actions
   */
  recordId?: string;

  /**
   * Current screen state (form values, variables, etc.)
   * Optional - passed to action execution context
   */
  screenState?: Record<string, unknown>;
}

/**
 * Loading placeholder style
 * Used when control doesn't exist in Redux
 */
export interface LoadingPlaceholderStyle {
  padding: string;
  border: string;
  backgroundColor: string;
  color: string;
  fontSize: string;
  textAlign: 'center' | 'left' | 'right';
}

/**
 * Selection outline style for designer mode
 */
export interface SelectionStyle {
  outline?: string;
  outlineOffset?: string;
  backgroundColor?: string;
}
