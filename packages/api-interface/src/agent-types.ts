import type { Artifact } from './artifact';
import type { ChatMessage } from './message';

/**
 * Canonical session information type used across all agents and services.
 * This is the standard type for passing session context between components.
 * Contains all essential properties needed for authentication, authorization, and data scoping.
 */
export interface SessionInfo extends SessionData {
  sessionRunId?: string;
}

/**
 * Complete session data stored in Redis
 */
export interface SessionData {
  /** Unique session identifier (UUID v4) */
  sessionId: string;
  /** Method account name */
  accountName: string;
  /** Method API v2 token for downstream calls */
  v2Token: string;
  /** Database name for the account */
  dbName: string;
  /** Company/Account ID (UUID) */
  companyId: string;
  /** Whether the account is active */
  isActive: boolean;
  /** Method Identity ID (UUID) */
  userId: string;
  /** User email address */
  email: string;
  /** User first name */
  firstName: string;
  /** User last name */
  lastName: string;
  /** User timezone (e.g., "Eastern Standard Time") */
  timezone: string;
  /** Profile photo URL/reference */
  profilePhotoUrl: string;
  /** Current state in conversation flow (default: "welcome") */
  stateName: string;
  /** List of artifact IDs associated with this session */
  artifactIds: string[];
  /** Additional context metadata for extensibility */
  contextMetadata: Record<string, unknown>;
  /** ISO timestamp when session was created */
  createdAt: string;
  /** ISO timestamp when session was last accessed */
  lastAccessedAt: string;
}

export interface AgentRequest {
  intent: string;
  type?: string;
  input?: Record<string, unknown>;
  context: {
    userSession: SessionInfo;
    relevantData?: Record<string, unknown>;
    timestamp: string;
    requestId: string;
  };
  streaming: {
    enabled: boolean;
    sessionId: string;
    channelName: string;
  };
}

export interface AgentResponse {
  status: 'success' | 'failed' | 'partial';
  result?: {
    data: Record<string, unknown>;
    summary: string;
    confidence: number;
    type?: 'data' | 'action' | 'analysis' | 'recommendation';
  };
  messages?: ChatMessage[];
  error?: {
    code: string;
    message: string;
    recoverable?: boolean;
    suggestedActions?: string[];
  };
  metadata?: {
    executionTime?: number;
    agentId?: string;
    agentVersion?: string;
    timestamp?: string;
  };
}

/**
 * Response from task execution
 */
export interface TaskExecutionResponse {
  status: 'success' | 'partial' | 'failed' | 'requires_input' | 'delegated';
  result?: TaskResult;
  messages: ChatMessage[];
  artifacts?: Artifact[];
  nextTasks?: PlannedTask[];
  userPrompt?: UserPrompt;
  error?: TaskError;
  metadata: TaskMetadata;
}

/**
 * Result data from a successful task execution
 */
export interface TaskResult {
  data: Record<string, unknown>;
  summary: string;
  confidence: number; // 0-1
  type?: 'data' | 'action' | 'analysis' | 'recommendation';
}
/**
 * A planned task ready for execution
 */
export interface PlannedTask {
  id: string;
  capability: string;
  intent: string;
  input: Record<string, unknown>;
  dependencies?: string[]; // Other task IDs this depends on
  agent: string; // Assigned agent ID
  requiresUserInput?: boolean;
}

/**
 * Request for user input during task execution
 */
export interface UserPrompt {
  id: string;
  message: string;
  type: 'confirmation' | 'input' | 'choice' | 'clarification';
  options?: string[];
  timeout?: number; // seconds
}

/**
 * Error information from failed task execution
 */
export interface TaskError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  recoverable?: boolean;
  suggestedActions?: string[];
}

/**
 * Metadata about task execution
 */
export interface TaskMetadata {
  executionTime: number; // milliseconds
  agentId: string;
  agentVersion: string;
  timestamp: string;
  resourceUsage?: ResourceUsage;
  debugInfo?: Record<string, unknown>;
}

/**
 * Resource usage information
 */
export interface ResourceUsage {
  computeUnits?: number;
  memoryUsed?: number; // bytes
  networkCalls?: number;
  storageUsed?: number; // bytes
}
