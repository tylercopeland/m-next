/**
 * Action Execution Infrastructure
 *
 * Public API for action execution in layout-canvas.
 * Exports all types and utilities needed by both wrappers and runtime.
 *
 * @module actions
 */

// Core types
export type {
  ActionEventType,
  ActionContext,
  ActionEventData,
  SessionInfo,
  ActionResult,
  ActionError,
  NavigationInstruction,
  UserMessage,
  ControlUpdate,
  ActionHandler,
  ActionConfig,
  ActionStep,
  ActionStepType,
} from './types';

// Helper classes and functions
export {
  NoOpActionHandler,
  isActionHandler,
  createActionContext,
  createSuccessResult,
  createErrorResult,
} from './types';

// Runtime action handler implementation
export { RuntimeActionHandler } from './RuntimeActionHandler';

// Testing utilities
export { createMockActionHandler, createTestActionContext } from './testing';
