/**
 * API interface types for chat assistant communication
 * Defines request and response structures for chat APIs
 */

import type { ChatMessage } from './message';

/**
 * Context information about what the user has selected on the screen
 */
export interface UserContext {
  /** Type of context being provided */
  type?: 'screen' | 'spec-section' | 'document' | 'component' | 'general';

  /** Name or identifier of the selected context (e.g., section name, doc name, component) */
  identifier?: string;

  /** Description of the context for the assistant */
  description?: string;

  /** The actual content or data from the selected context */
  content?: string;

  /** Additional metadata about the context */
  metadata?: Record<string, unknown>;
}

export interface ChatMetadata {
  /** User's current context on the screen */
  context?: UserContext;
}
/**
 * Chat request interface
 */
export interface ChatRequest {
  /** The human message content */
  message: string;
  /** Session information for authentication and context */
  session: {
    /** Session ID obtained from POST /session/start */
    sessionId: string;
    accountName: string;
    /** Additional session metadata */
    [key: string]: unknown;
  };

  /** Request metadata */
  metadata?: ChatMetadata;
}

/**
 * Chat response interface
 */
export interface ChatResponse {
  /** Response status */
  status: 'success' | 'error';

  /** Array of messages returned from the assistant */
  messages: ChatMessage[];

  /** Error information (if status is 'error') */
  error?: {
    /** Error code */
    code?: string;

    /** Human-readable error message */
    message: string;

    /** Detailed error information */
    details?: Record<string, unknown>;
  };

  /** Response metadata */
  metadata?: {
    /** Unique conversation identifier */
    conversationId?: string;

    /** Model used for generation */
    model?: string;

    /** Total token usage */
    tokenUsage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };

    /** Processing time in milliseconds */
    processingTimeMs?: number;

    /** Debug information (in development) */
    debug?: {
      /** Tool calls made during processing */
      toolCalls?: Array<{
        id: string;
        name: string;
        input: Record<string, unknown>;
        output?: string;
        success: boolean;
        executionTimeMs: number;
        timestamp: string;
        error?: string;
      }>;

      /** Total number of tool calls */
      totalToolCalls?: number;

      /** Total execution time for all tools */
      totalExecutionTimeMs?: number;

      /** Number of processing iterations */
      iterations?: number;
    };

    /** Response timestamp */
    timestamp?: string;

    /** Additional metadata */
    [key: string]: unknown;
  };
}

/**
 * Health check response interface
 */
export interface HealthResponse {
  /** Service status */
  status: 'healthy' | 'unhealthy';

  /** Service name */
  service: string;

  /** Service version */
  version: string;

  /** Uptime in milliseconds */
  uptimeMs: number;

  /** Additional health information */
  details?: {
    /** Database connectivity */
    database?: 'connected' | 'disconnected';

    /** External service dependencies */
    dependencies?: Record<string, 'healthy' | 'unhealthy'>;

    /** Memory usage */
    memory?: {
      used: number;
      total: number;
      percentage: number;
    };

    /** Additional health metrics */
    [key: string]: unknown;
  };

  /** Timestamp of health check */
  timestamp: string;
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

/**
 * Type guards for API responses
 */
export const isChatResponse = (response: unknown): response is ChatResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    'messages' in response &&
    Array.isArray((response as Record<string, unknown>).messages)
  );
};

export const isHealthResponse = (response: unknown): response is HealthResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    'service' in response &&
    'version' in response
  );
};

export const isApiError = (response: unknown): response is ApiErrorResponse => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    (response as Record<string, unknown>).status === 'error' &&
    'error' in response
  );
};
