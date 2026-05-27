/**
 * Runtime Action Handler Implementation
 *
 * This is a reference implementation of ActionHandler that can be used by
 * MethodUI runtime or extended for custom action execution logic.
 *
 * @module actions/RuntimeActionHandler
 */

import type {
  ActionHandler,
  ActionContext,
  ActionResult,
  ActionConfig,
  ActionEventType,
  ActionStep,
  ActionStepType,
} from './types';
import { createSuccessResult, createErrorResult } from './types';

/**
 * Configuration for RuntimeActionHandler
 */
export interface RuntimeActionHandlerConfig {
  /**
   * Function to get action configuration for a component
   * Should look up actionset from control definition
   */
  getActionConfig: (componentId: string, actionName: ActionEventType) => ActionConfig | null;

  /**
   * Function to execute individual action steps
   * Implement this to integrate with your runtime API
   */
  executeStep: (step: ActionStep, context: ActionContext) => Promise<Partial<ActionResult>>;

  /**
   * Optional function to evaluate conditional expressions
   * Used for action/step condition evaluation
   */
  evaluateCondition?: (condition: string, context: ActionContext) => boolean;

  /**
   * Optional error handler for action execution failures
   */
  onError?: (error: Error, context: ActionContext) => void;

  /**
   * Optional logger for debugging
   */
  logger?: {
    debug: (message: string, data?: unknown) => void;
    info: (message: string, data?: unknown) => void;
    warn: (message: string, data?: unknown) => void;
    error: (message: string, data?: unknown) => void;
  };
}

/**
 * Runtime Action Handler
 *
 * Executes actionsets in response to user interactions.
 * Designed to be framework-agnostic and adaptable to different runtimes.
 *
 * @example
 * ```typescript
 * const actionHandler = new RuntimeActionHandler({
 *   getActionConfig: (componentId, actionName) => {
 *     const control = getControl(componentId);
 *     return control[actionName]; // e.g., control.onClick
 *   },
 *   executeStep: async (step, context) => {
 *     switch (step.type) {
 *       case 'ShowMessage':
 *         return { messages: [{ type: 'info', message: step.parameters.message }] };
 *       case 'UpdateRecord':
 *         await updateRecord(step.parameters);
 *         return { success: true };
 *       // ... handle other step types
 *     }
 *   }
 * });
 *
 * // In wrapper component:
 * const result = await actionHandler.executeAction({
 *   componentId: 'btn_save',
 *   actionName: 'onClick',
 *   actionData: {},
 *   screenId: 'screen_customers',
 *   recordId: '12345'
 * });
 * ```
 */
export class RuntimeActionHandler implements ActionHandler {
  private config: RuntimeActionHandlerConfig;

  constructor(config: RuntimeActionHandlerConfig) {
    this.config = config;
  }

  /**
   * Execute an actionset
   */
  async executeAction(context: ActionContext): Promise<ActionResult> {
    try {
      this.log('debug', 'Executing action', { componentId: context.componentId, actionName: context.actionName });

      // 1. Get action configuration
      const actionConfig = this.config.getActionConfig(context.componentId, context.actionName);
      if (!actionConfig) {
        this.log('debug', 'No action configured', { componentId: context.componentId, actionName: context.actionName });
        return createSuccessResult(); // No action configured is not an error
      }

      // 2. Check action condition
      if (actionConfig.condition && !this.evaluateCondition(actionConfig.condition, context)) {
        this.log('debug', 'Action condition not met', { condition: actionConfig.condition });
        return createSuccessResult(); // Condition not met is not an error
      }

      // 3. Execute action steps
      const result = actionConfig.parallel
        ? await this.executeStepsParallel(actionConfig.steps, context)
        : await this.executeStepsSequential(actionConfig.steps, context, actionConfig.continueOnError);

      this.log('info', 'Action executed successfully', { componentId: context.componentId, success: result.success });
      return result;
    } catch (error) {
      this.log('error', 'Action execution failed', error);
      this.config.onError?.(error as Error, context);
      return createErrorResult({
        code: 'ACTION_EXECUTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      });
    }
  }

  /**
   * Execute steps sequentially (default behavior)
   */
  private async executeStepsSequential(
    steps: ActionStep[],
    context: ActionContext,
    continueOnError = false,
  ): Promise<ActionResult> {
    let aggregatedResult: ActionResult = createSuccessResult();

    for (const step of steps) {
      try {
        // Check step condition
        if (step.condition && !this.evaluateCondition(step.condition, context)) {
          this.log('debug', 'Step condition not met, skipping', { type: step.type, condition: step.condition });
          continue;
        }

        // Execute step
        this.log('debug', 'Executing step', { type: step.type, parameters: step.parameters });
        const stepResult = await this.config.executeStep(step, context);

        // Merge step result into aggregated result
        aggregatedResult = this.mergeResults(aggregatedResult, stepResult);

        // Stop if step failed and stopOnError is true
        if (!stepResult.success && step.stopOnError && !continueOnError) {
          this.log('warn', 'Step failed and stopOnError=true, halting execution', { type: step.type });
          return aggregatedResult;
        }
      } catch (error) {
        this.log('error', 'Step execution failed', { type: step.type, error });

        const stepError = createErrorResult({
          code: 'STEP_EXECUTION_ERROR',
          message: `Step "${step.type}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error,
        });

        aggregatedResult = this.mergeResults(aggregatedResult, stepError);

        if (step.stopOnError && !continueOnError) {
          return aggregatedResult;
        }
      }
    }

    return aggregatedResult;
  }

  /**
   * Execute steps in parallel
   */
  private async executeStepsParallel(steps: ActionStep[], context: ActionContext): Promise<ActionResult> {
    const stepPromises = steps.map(async (step) => {
      try {
        // Check step condition
        if (step.condition && !this.evaluateCondition(step.condition, context)) {
          return createSuccessResult();
        }

        // Execute step
        this.log('debug', 'Executing step (parallel)', { type: step.type });
        const stepResult = await this.config.executeStep(step, context);
        return stepResult;
      } catch (error) {
        this.log('error', 'Step execution failed (parallel)', { type: step.type, error });
        return createErrorResult({
          code: 'STEP_EXECUTION_ERROR',
          message: `Step "${step.type}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error,
        });
      }
    });

    const results = await Promise.all(stepPromises);

    // Merge all results
    let aggregatedResult: ActionResult = createSuccessResult();
    for (const result of results) {
      aggregatedResult = this.mergeResults(aggregatedResult, result);
    }

    return aggregatedResult;
  }

  /**
   * Merge two action results
   */
  private mergeResults(base: ActionResult, update: Partial<ActionResult>): ActionResult {
    return {
      ...base,
      ...update,
      success: base.success && (update.success ?? true),
      screenState: { ...base.screenState, ...update.screenState },
      recordData: { ...base.recordData, ...update.recordData },
      controlUpdates: { ...base.controlUpdates, ...update.controlUpdates },
      messages: [...(base.messages || []), ...(update.messages || [])],
      error: update.error || base.error,
    };
  }

  /**
   * Evaluate conditional expression
   */
  private evaluateCondition(condition: string, context: ActionContext): boolean {
    if (this.config.evaluateCondition) {
      return this.config.evaluateCondition(condition, context);
    }

    // Default: always true if no evaluator provided
    this.log('warn', 'No condition evaluator provided, defaulting to true', { condition });
    return true;
  }

  /**
   * Check if action can be executed
   */
  async canExecuteAction(context: ActionContext): Promise<boolean> {
    const actionConfig = this.config.getActionConfig(context.componentId, context.actionName);
    if (!actionConfig) {
      return false;
    }

    if (actionConfig.condition) {
      return this.evaluateCondition(actionConfig.condition, context);
    }

    return true;
  }

  /**
   * Get action configuration for a component
   */
  getActionConfig(componentId: string, actionName: ActionEventType): ActionConfig | null {
    return this.config.getActionConfig(componentId, actionName);
  }

  /**
   * Log message using configured logger or console
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    if (this.config.logger) {
      this.config.logger[level](message, data);
    } else if (process.env.NODE_ENV !== 'production') {
      console[level](`[RuntimeActionHandler] ${message}`, data || '');
    }
  }
}

/**
 * Example step executor for common action types
 * Use this as a starting point for your runtime implementation
 */
export const createBasicStepExecutor = (api: {
  showMessage: (message: string, type: string) => void;
  navigate: (screenId: string, recordId?: string) => void;
  updateRecord: (data: Record<string, unknown>) => Promise<void>;
  insertRecord: (data: Record<string, unknown>) => Promise<string>;
  deleteRecord: (recordId: string) => Promise<void>;
  setFieldValue: (fieldName: string, value: unknown) => void;
}) => {
  return async (step: ActionStep): Promise<Partial<ActionResult>> => {
    switch (step.type as ActionStepType) {
      case 'ShowMessage':
        api.showMessage(step.parameters.message as string, (step.parameters.type as string) || 'info');
        return {
          success: true,
          messages: [
            {
              type: ((step.parameters.type as string) || 'info') as 'success' | 'error' | 'warning' | 'info',
              message: step.parameters.message as string,
              title: step.parameters.title as string | undefined,
            },
          ],
        };

      case 'NavigateToScreen':
        api.navigate(step.parameters.screenId as string, step.parameters.recordId as string | undefined);
        return {
          success: true,
          navigation: {
            screenId: step.parameters.screenId as string,
            recordId: step.parameters.recordId as string | undefined,
            mode: (step.parameters.mode as 'replace' | 'push' | 'modal' | 'newTab') || 'push',
          },
        };

      case 'UpdateRecord':
        await api.updateRecord(step.parameters.data as Record<string, unknown>);
        return {
          success: true,
          recordData: step.parameters.data as Record<string, unknown>,
        };

      case 'InsertRecord': {
        const newRecordId = await api.insertRecord(step.parameters.data as Record<string, unknown>);
        return {
          success: true,
          recordData: { ...(step.parameters.data as Record<string, unknown>), recordId: newRecordId } as Record<
            string,
            unknown
          >,
        };
      }

      case 'DeleteRecord':
        await api.deleteRecord(step.parameters.recordId as string);
        return {
          success: true,
          messages: [{ type: 'success', message: 'Record deleted successfully' }],
        };

      case 'SetFieldValue':
        api.setFieldValue(step.parameters.fieldName as string, step.parameters.value);
        return {
          success: true,
          recordData: { [step.parameters.fieldName as string]: step.parameters.value },
        };

      case 'RefreshScreen':
        return {
          success: true,
          refreshScreen: true,
        };

      case 'CloseScreen':
        return {
          success: true,
          closeScreen: true,
        };

      default:
        return createErrorResult({
          code: 'UNSUPPORTED_STEP_TYPE',
          message: `Step type "${step.type}" is not supported`,
        });
    }
  };
};
