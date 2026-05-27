/**
 * Action Execution Infrastructure - Type Definitions
 *
 * This module defines the interfaces for executing actionsets in response to
 * user interactions with components. It provides a clean abstraction between
 * layout-canvas (rendering) and the runtime action execution engine.
 *
 * @module actions/types
 */

/**
 * Action event types that can be triggered by user interactions
 * Maps to control event handlers (onClick, onChange, onBlur, etc.)
 */
export type ActionEventType =
  | 'onClick'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onDoubleClick'
  | 'onKeyPress'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'onSubmit'
  | 'onSelect'
  | 'onDrop'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onRowClick'
  | 'onActiveRowChange'
  | 'onCustomRowClick';

/**
 * Context information passed to action handlers when an action is triggered
 * Contains all data needed to execute an actionset
 */
export interface ActionContext {
  /** Unique identifier of the component that triggered the action */
  componentId: string;

  /** Type of action event (onClick, onChange, etc.) */
  actionName: ActionEventType;

  /** Event-specific data (new value, event object, coordinates, etc.) */
  actionData: ActionEventData;

  /** Current screen ID */
  screenId: string;

  /** Current record ID (if viewing/editing a record) */
  recordId?: string;

  /** Current screen state (control values, variables, etc.) */
  screenState?: Record<string, unknown>;

  /** User identity/session information */
  sessionInfo?: SessionInfo;

  /** Optional metadata for debugging/logging */
  metadata?: {
    timestamp: number;
    userAgent?: string;
    componentType?: string;
    // Allow additional properties for component-specific data (e.g., gallery RecordID, Caption)
    [key: string]: unknown;
  };
}

/**
 * Event-specific data passed with action context
 * Type varies based on the action event type
 */
export interface ActionEventData {
  /** New value (for onChange events) */
  value?: unknown;

  /** Previous value (for onChange events) */
  oldValue?: unknown;

  /** Mouse/keyboard event details */
  event?: {
    type: string;
    target?: string;
    key?: string;
    button?: number;
    coordinates?: { x: number; y: number };
  };

  /** Grid-specific data (for grid actions) */
  gridData?: {
    rowIndex?: number;
    columnName?: string;
    cellValue?: unknown;
  };

  /** Dropdown-specific data */
  selectionData?: {
    selectedItems?: unknown[];
    selectedText?: string;
    selectedValue?: unknown;
  };

  /** File upload data */
  fileData?: {
    files?: File[];
    fileNames?: string[];
  };

  /** Additional custom data */
  [key: string]: unknown;
}

/**
 * Session information for action execution
 */
export interface SessionInfo {
  userId: string;
  userName: string;
  companyId: string;
  sessionToken: string;
  permissions?: string[];
}

/**
 * Result of action execution
 * Returned by ActionHandler.executeAction()
 */
export interface ActionResult {
  /** Whether the action executed successfully */
  success: boolean;

  /** Error message if action failed */
  error?: ActionError;

  /** Updated screen state after action execution */
  screenState?: Record<string, unknown>;

  /** Updated record data after action execution */
  recordData?: Record<string, unknown>;

  /** Navigation instruction (if action navigates to another screen) */
  navigation?: NavigationInstruction;

  /** Messages to display to user */
  messages?: UserMessage[];

  /** Whether to refresh the current screen */
  refreshScreen?: boolean;

  /** Whether to close the current screen */
  closeScreen?: boolean;

  /** Updated control values */
  controlUpdates?: Record<string, ControlUpdate>;

  /** Additional result data for complex actions */
  data?: unknown;
}

/**
 * Error information from failed action execution
 */
export interface ActionError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Detailed error information for debugging */
  details?: unknown;

  /** Stack trace (for development environments) */
  stack?: string;

  /** Control ID where error occurred (if applicable) */
  controlId?: string;

  /** Field name where error occurred (if applicable) */
  fieldName?: string;
}

/**
 * Navigation instruction for moving to another screen
 */
export interface NavigationInstruction {
  /** Target screen ID */
  screenId: string;

  /** Target record ID (if opening a specific record) */
  recordId?: string;

  /** Navigation mode */
  mode?: 'replace' | 'push' | 'modal' | 'newTab';

  /** Parameters to pass to target screen */
  parameters?: Record<string, unknown>;

  /** Whether to save current screen before navigating */
  saveBeforeNavigate?: boolean;
}

/**
 * User message to display after action execution
 */
export interface UserMessage {
  /** Message type determines visual styling */
  type: 'success' | 'error' | 'warning' | 'info';

  /** Message title */
  title?: string;

  /** Message content */
  message: string;

  /** Message duration in milliseconds (0 = persistent) */
  duration?: number;

  /** Whether message should be dismissible */
  dismissible?: boolean;
}

/**
 * Control value/state update
 */
export interface ControlUpdate {
  /** New value for the control */
  value?: unknown;

  /** Whether control should be visible */
  visible?: boolean;

  /** Whether control should be disabled */
  disabled?: boolean;

  /** Validation error to display */
  validationError?: string;

  /** Whether control is in loading state */
  loading?: boolean;
}

/**
 * Main interface for action execution
 * Implemented by runtime to handle action execution
 */
export interface ActionHandler {
  /**
   * Execute an actionset in response to a user interaction
   *
   * @param context - Action context with all execution details
   * @returns Promise resolving to action result
   *
   * @example
   * ```typescript
   * const result = await actionHandler.executeAction({
   *   componentId: 'btn_save',
   *   actionName: 'onClick',
   *   actionData: {},
   *   screenId: 'screen_edit_customer',
   *   recordId: '12345',
   *   screenState: { isDirty: true }
   * });
   *
   * if (result.success) {
   *   console.log('Action executed successfully');
   *   if (result.navigation) {
   *     // Navigate to another screen
   *   }
   * } else {
   *   console.error('Action failed:', result.error);
   * }
   * ```
   */
  executeAction(context: ActionContext): Promise<ActionResult>;

  /**
   * Validate whether an action can be executed
   * Optional method for pre-execution validation
   *
   * @param context - Action context to validate
   * @returns Promise resolving to validation result
   */
  canExecuteAction?(context: ActionContext): Promise<boolean>;

  /**
   * Get action configuration for a specific component and event
   * Optional method for runtime to inspect action configuration
   *
   * @param componentId - Component ID
   * @param actionName - Action event name
   * @returns Action configuration or null if not configured
   */
  getActionConfig?(componentId: string, actionName: ActionEventType): ActionConfig | null;
}

/**
 * Action configuration (actionset definition)
 * Describes what should happen when action is triggered
 */
export interface ActionConfig {
  /** Unique identifier for this action */
  id: string;

  /** Action name (for display/debugging) */
  name?: string;

  /** Action steps to execute in sequence */
  steps: ActionStep[];

  /** Whether to execute steps in parallel (vs sequential) */
  parallel?: boolean;

  /** Whether to continue execution if a step fails */
  continueOnError?: boolean;

  /** Condition that must be true for action to execute */
  condition?: string;
}

/**
 * Individual step in an actionset
 */
export interface ActionStep {
  /** Step type determines what operation to perform */
  type: ActionStepType;

  /** Step parameters (varies by step type) */
  parameters: Record<string, unknown>;

  /** Optional condition for step execution */
  condition?: string;

  /** Whether to stop execution if this step fails */
  stopOnError?: boolean;
}

/**
 * Action step types
 * Each type represents a different operation
 */
export type ActionStepType =
  | 'ShowMessage' // Display message to user
  | 'NavigateToScreen' // Navigate to another screen
  | 'InsertRecord' // Create new record
  | 'UpdateRecord' // Update existing record
  | 'DeleteRecord' // Delete record
  | 'ExecuteQuery' // Run database query
  | 'CallApi' // Call external API
  | 'SetFieldValue' // Update field value
  | 'SetControlValue' // Update control value
  | 'RunScript' // Execute JavaScript
  | 'OpenUrl' // Open URL in browser
  | 'CloseScreen' // Close current screen
  | 'RefreshScreen' // Reload screen data
  | 'DownloadFile' // Download file
  | 'UploadFile' // Upload file
  | 'SendEmail' // Send email
  | 'Loop' // Repeat steps
  | 'Condition'; // Conditional execution

/**
 * No-op action handler for testing and development
 * Returns success without executing any actions
 */
export class NoOpActionHandler implements ActionHandler {
  async executeAction(context: ActionContext): Promise<ActionResult> {
    console.log('[NoOpActionHandler] Action triggered:', context);
    return {
      success: true,
      messages: [
        {
          type: 'info',
          message: `Action "${context.actionName}" triggered on component "${context.componentId}"`,
        },
      ],
    };
  }
}

/**
 * Type guard to check if a value is an ActionHandler
 */
export function isActionHandler(value: unknown): value is ActionHandler {
  return (
    typeof value === 'object' &&
    value !== null &&
    'executeAction' in value &&
    typeof (value as ActionHandler).executeAction === 'function'
  );
}

/**
 * Helper function to create an ActionContext
 * Provides defaults for optional fields
 */
export function createActionContext(params: {
  componentId: string;
  actionName: ActionEventType;
  actionData?: Partial<ActionEventData>;
  screenId: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  sessionInfo?: SessionInfo;
}): ActionContext {
  return {
    componentId: params.componentId,
    actionName: params.actionName,
    actionData: params.actionData || {},
    screenId: params.screenId,
    recordId: params.recordId,
    screenState: params.screenState,
    sessionInfo: params.sessionInfo,
    metadata: {
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
  };
}

/**
 * Helper function to create a success ActionResult
 */
export function createSuccessResult(overrides?: Partial<ActionResult>): ActionResult {
  return {
    success: true,
    ...overrides,
  };
}

/**
 * Helper function to create an error ActionResult
 */
export function createErrorResult(error: string | ActionError, overrides?: Partial<ActionResult>): ActionResult {
  const errorObj: ActionError = typeof error === 'string' ? { code: 'UNKNOWN_ERROR', message: error } : error;

  return {
    success: false,
    error: errorObj,
    ...overrides,
  };
}
