/**
 * Handler for error messages
 */

import type { MessageHandler } from './messageHandlerRegistry';

/**
 * Error data structure
 */
export interface ErrorData {
  /** Error code */
  code?: string;
  /** Error message */
  message?: string;
  /** Additional error details */
  details?: unknown;
}

/**
 * Error callback function type
 */
export type ErrorCallback = (data: ErrorData) => void;

/**
 * Create the handler for error messages
 * @param onError - Optional callback for error handling
 * @returns The handler function
 */
export function createErrorHandler(onError?: ErrorCallback): MessageHandler {
  return (data: unknown) => {
    console.error('[ErrorHandler] Streaming error:', data);

    if (onError && typeof onError === 'function') {
      onError(data as ErrorData);
    }
  };
}
