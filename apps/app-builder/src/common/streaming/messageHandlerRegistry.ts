/**
 * Registry for streaming message type handlers
 * Provides a pluggable system for handling different message types and content types
 */

/**
 * Message structure expected by the registry
 */
export interface StreamingMessage {
  /** Type of the message (e.g., 'chunk', 'progress', 'complete', 'error') */
  type: string;
  /** The actual data payload */
  data: unknown;
}

/**
 * Handler function type for processing message data
 */
export type MessageHandler = (data: unknown, context?: Record<string, unknown>) => void;

/**
 * Registry for streaming message type handlers
 * Provides a pluggable system for handling different message types and content types
 */
class MessageHandlerRegistry {
  /**
   * Map of message type to handler function
   */
  private handlers: Map<string, MessageHandler>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register a handler for a specific message type
   * @param messageType - The type of message to handle (e.g., 'chunk', 'progress', 'complete')
   * @param handler - The handler function to execute
   */
  register(messageType: string, handler: MessageHandler): void {
    if (!messageType || typeof handler !== 'function') {
      console.warn('[MessageHandlerRegistry] Invalid registration:', { messageType, handler });
      return;
    }

    this.handlers.set(messageType, handler);
    console.log(`[MessageHandlerRegistry] Registered handler for type: ${messageType}`);
  }

  /**
   * Unregister a handler for a specific message type
   * @param messageType - The type of message to unregister
   */
  unregister(messageType: string): void {
    this.handlers.delete(messageType);
    console.log(`[MessageHandlerRegistry] Unregistered handler for type: ${messageType}`);
  }

  /**
   * Handle a message by dispatching to the appropriate handler
   * @param message - The message to handle
   * @param context - Additional context for handlers
   * @returns Whether the message was handled
   */
  handle(message: StreamingMessage, context: Record<string, unknown> = {}): boolean {
    const { type, data } = message || {};

    if (!type) {
      console.warn('[MessageHandlerRegistry] Message missing type field:', message);
      return false;
    }

    const handler = this.handlers.get(type);

    if (!handler) {
      console.warn(`[MessageHandlerRegistry] No handler registered for message type: ${type}`);
      return false;
    }

    try {
      handler(data, context);
      return true;
    } catch (error) {
      console.error(`[MessageHandlerRegistry] Error handling message type '${type}':`, error);
      return false;
    }
  }

  /**
   * Check if a handler is registered for a message type
   * @param messageType - The message type to check
   * @returns Whether a handler is registered
   */
  has(messageType: string): boolean {
    return this.handlers.has(messageType);
  }

  /**
   * Get all registered message types
   * @returns Array of registered message types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Clear all registered handlers
   */
  clear(): void {
    this.handlers.clear();
    console.log('[MessageHandlerRegistry] Cleared all handlers');
  }
}

export default MessageHandlerRegistry;
