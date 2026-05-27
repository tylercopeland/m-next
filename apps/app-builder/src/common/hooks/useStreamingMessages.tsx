import { useCallback, useRef } from 'react';
import useAblySubscription from './useAblySubscription';
import MessageHandlerRegistry from '../streaming/messageHandlerRegistry';
import type * as Ably from 'ably';

/**
 * Streaming message data structure received from Ably
 */
export interface StreamingMessageData {
  /** Type of the message (e.g., 'chunk', 'progress', 'complete', 'error') */
  type: string;
  /** The actual data payload */
  data: unknown;
}

/**
 * Information about a handled message
 */
export interface MessageHandledInfo {
  /** Type of the message that was handled */
  type: string;
  /** Whether the message was successfully handled */
  handled: boolean;
  /** The data from the message */
  data: unknown;
}

/**
 * Options for the streaming messages hook
 */
export interface UseStreamingMessagesOptions {
  /** Whether the subscription is enabled (default: true) */
  enabled?: boolean;
  /** Callback after a message is handled */
  onMessageHandled?: (info: MessageHandledInfo) => void;
}

/**
 * Return type for the streaming messages hook
 */
export interface UseStreamingMessagesResult {
  /** The message handler registry */
  registry: MessageHandlerRegistry;
  /** Whether the Ably connection is active */
  isConnected: boolean;
  /** The Ably client instance */
  client: Ably.Realtime | null;
}

/**
 * Custom hook to manage streaming message subscription and handling
 * @param channelName - The Ably channel name
 * @param sessionId - The session ID (used as event name)
 * @param options - Configuration options
 * @returns Streaming message state and controls including registry, connection status, and client
 */
function useStreamingMessages(
  channelName: string,
  sessionId: string,
  options: UseStreamingMessagesOptions = {},
): UseStreamingMessagesResult {
  const { enabled = true, onMessageHandled } = options;

  // Create a stable registry instance
  const registryRef = useRef<MessageHandlerRegistry | null>(null);
  if (!registryRef.current) {
    registryRef.current = new MessageHandlerRegistry();
  }

  const registry = registryRef.current;

  // Handle incoming Ably messages
  const handleMessage = useCallback(
    (message: Ably.Message) => {
      const data = message?.data as StreamingMessageData | undefined;

      if (!data) {
        console.warn('[useStreamingMessages] Received message with no data:', message);
        return;
      }

      // Dispatch to registry
      const handled = registry.handle(data);

      // Notify if handler provided
      if (onMessageHandled) {
        onMessageHandled({
          type: data.type,
          handled,
          data: data.data,
        });
      }
    },
    [registry, onMessageHandled],
  );

  // Subscribe to Ably channel
  const { client, isConnected } = useAblySubscription(channelName, sessionId, handleMessage, {
    enabled: enabled && !!sessionId,
  });

  return {
    registry,
    isConnected,
    client,
  };
}

export default useStreamingMessages;
