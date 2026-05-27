/**
 * Testing Utilities for Action Execution
 *
 * Provides mock implementations and test helpers for action execution.
 * Useful for testing wrappers and runtime integration.
 *
 * @module actions/testing
 */

import type { ActionHandler, ActionContext, ActionResult, ActionEventType, SessionInfo } from './types';
import { createActionContext, createSuccessResult } from './types';

/**
 * Mock action handler for testing
 * Records all executed actions and returns configurable results
 */
export class MockActionHandler implements ActionHandler {
  /** History of all executed actions */
  public executedActions: ActionContext[] = [];

  /** Predefined results to return (by component ID + action name) */
  private results: Map<string, ActionResult> = new Map();

  /** Default result to return if no specific result configured */
  private defaultResult: ActionResult;

  constructor(defaultResult?: ActionResult) {
    this.defaultResult = defaultResult || createSuccessResult();
  }

  /**
   * Execute an action (records it and returns configured result)
   */
  async executeAction(context: ActionContext): Promise<ActionResult> {
    this.executedActions.push(context);

    const key = `${context.componentId}:${context.actionName}`;
    const result = this.results.get(key) || this.defaultResult;

    return { ...result };
  }

  /**
   * Configure a specific result for a component/action combination
   */
  setResult(componentId: string, actionName: ActionEventType, result: ActionResult): void {
    const key = `${componentId}:${actionName}`;
    this.results.set(key, result);
  }

  /**
   * Check if a specific action was executed
   */
  wasActionExecuted(componentId: string, actionName: ActionEventType): boolean {
    return this.executedActions.some((ctx) => ctx.componentId === componentId && ctx.actionName === actionName);
  }

  /**
   * Get the last executed action
   */
  getLastAction(): ActionContext | undefined {
    return this.executedActions[this.executedActions.length - 1];
  }

  /**
   * Clear execution history
   */
  clear(): void {
    this.executedActions = [];
    this.results.clear();
  }

  /**
   * Get all actions executed for a specific component
   */
  getActionsForComponent(componentId: string): ActionContext[] {
    return this.executedActions.filter((ctx) => ctx.componentId === componentId);
  }

  /**
   * Get count of actions executed for a specific component
   */
  getActionCount(componentId: string, actionName?: ActionEventType): number {
    return this.executedActions.filter(
      (ctx) => ctx.componentId === componentId && (!actionName || ctx.actionName === actionName),
    ).length;
  }
}

/**
 * Create a mock action handler with predefined behavior
 */
export function createMockActionHandler(options?: {
  defaultResult?: ActionResult;
  results?: Array<{
    componentId: string;
    actionName: ActionEventType;
    result: ActionResult;
  }>;
}): MockActionHandler {
  const handler = new MockActionHandler(options?.defaultResult);

  if (options?.results) {
    options.results.forEach(({ componentId, actionName, result }) => {
      handler.setResult(componentId, actionName, result);
    });
  }

  return handler;
}

/**
 * Create a test action context with minimal required fields
 */
export function createTestActionContext(overrides?: Partial<ActionContext>): ActionContext {
  return createActionContext({
    componentId: 'test-component',
    actionName: 'onClick',
    screenId: 'test-screen',
    recordId: 'test-record',
    actionData: {},
    ...overrides,
  });
}

/**
 * Create a mock session info for testing
 */
export function createMockSessionInfo(overrides?: Partial<SessionInfo>): SessionInfo {
  return {
    userId: 'test-user-id',
    userName: 'Test User',
    companyId: 'test-company-id',
    sessionToken: 'test-session-token',
    permissions: ['read', 'write'],
    ...overrides,
  };
}

/**
 * Spy action handler that wraps another handler and records calls
 */
export class SpyActionHandler implements ActionHandler {
  public executedActions: ActionContext[] = [];
  private wrappedHandler: ActionHandler;

  constructor(wrappedHandler: ActionHandler) {
    this.wrappedHandler = wrappedHandler;
  }

  async executeAction(context: ActionContext): Promise<ActionResult> {
    this.executedActions.push(context);
    return this.wrappedHandler.executeAction(context);
  }

  wasActionExecuted(componentId: string, actionName: ActionEventType): boolean {
    return this.executedActions.some((ctx) => ctx.componentId === componentId && ctx.actionName === actionName);
  }

  clear(): void {
    this.executedActions = [];
  }
}

/**
 * Create a spy handler that wraps an existing handler
 */
export function createSpyActionHandler(handler: ActionHandler): SpyActionHandler {
  return new SpyActionHandler(handler);
}
