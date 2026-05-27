import { useEffect, useRef } from 'react';
import * as Ably from 'ably';

/**
 * Options for the Ably subscription hook
 */
export interface UseAblySubscriptionOptions {
  /** Whether the subscription is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for the Ably subscription hook
 */
export interface UseAblySubscriptionResult {
  /** The Ably client instance */
  client: Ably.Realtime | null;
  /** Whether the connection is active */
  isConnected: boolean;
}

/**
 * Ably message callback function type
 */
export type AblyMessageCallback = (message: Ably.Message) => void;

/**
 * Custom hook to manage Ably subscription lifecycle
 * @param channelName - The Ably channel name to subscribe to
 * @param eventName - The event name to subscribe to (typically the session ID)
 * @param onMessage - Callback function to handle incoming messages
 * @param options - Configuration options
 * @returns Subscription state including client and connection status
 */
function useAblySubscription(
  channelName: string,
  eventName: string,
  onMessage: AblyMessageCallback,
  options: UseAblySubscriptionOptions = {},
): UseAblySubscriptionResult {
  const { enabled = true } = options;

  const ablyClientRef = useRef<Ably.Realtime | null>(null);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);
  // Keep the latest onMessage in a ref so effect doesn't re-run when callback identity changes
  const onMessageRef = useRef<AblyMessageCallback | null>(null);
  onMessageRef.current = onMessage;

  useEffect(() => {
    // Only subscribe if enabled and we have required parameters
    if (!enabled || !channelName || !eventName) {
      return;
    }

    // Reuse existing client if present, otherwise create one
    if (!ablyClientRef.current) {
      ablyClientRef.current = new Ably.Realtime({
        key: 'uAFZfQ.lB74jg:vavcFBl3h7HrPX0p2u7UqbTCDa9COmsJ5KzGrLu4HZw',
      });
    }

    const ablyClient = ablyClientRef.current;

    // Get the channel
    const channel = ablyClient.channels.get(channelName);
    channelRef.current = channel;

    // Subscribe to messages, delegating to latest callback via ref
    const handler = (message: Ably.Message) => {
      console.log(`[Ably] Received message on channel '${channelName}' for event '${eventName}':`, message);
      if (onMessageRef.current) {
        onMessageRef.current(message);
      }
    };

    channel.subscribe(eventName, handler);

    console.log(`[Ably] Subscribed to channel '${channelName}' for event: ${eventName}`);

    // Cleanup function
    return () => {
      console.log(`[Ably] Unsubscribing from channel '${channelName}' for event: ${eventName}`);

      if (channelRef.current && eventName) {
        try {
          channelRef.current.unsubscribe(eventName, handler);
        } catch (e) {
          // best-effort
          console.warn(`[Ably] Error during unsubscription from channel '${channelName}' for event '${eventName}':`, e);
          channelRef.current.unsubscribe(eventName);
        }
      }

      channelRef.current = null;
    };
  }, [channelName, eventName, enabled]);

  return {
    client: ablyClientRef.current,
    isConnected: ablyClientRef.current?.connection?.state === 'connected',
  };
}

export default useAblySubscription;
