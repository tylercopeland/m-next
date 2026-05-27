/**
 * Shared Wrapper Utilities
 *
 * Export barrel for all shared wrapper code.
 * Import from this file to get types, hooks, and utilities.
 *
 * @module wrappers/shared
 */

// Types
export type { BaseWrapperProps, WrapperMode, LoadingPlaceholderStyle, SelectionStyle } from './types';

// Hooks
export { useWrapperBase } from './useWrapperBase';
export type { WrapperBaseResult } from './useWrapperBase';

// Utilities
export {
  LoadingPlaceholder,
  ErrorFallback,
  isDefined,
  safeGet,
  mergeStyles,
  debounce,
  throttle,
  hasProperty,
  normalizeControlProperty,
  getControlType,
  getControlTypeOverride,
} from './utils';
