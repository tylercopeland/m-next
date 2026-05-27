import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useStreamingMessages, { MessageHandledInfo } from './useStreamingMessages';
// @ts-ignore - managementApi is a .jsx file without TypeScript definitions
import { managementApi } from '../services/managementApi';
// @ts-ignore - screenLayoutSlice is a .jsx file without TypeScript definitions
import { triggerScreenRefetch } from '../services/screenLayoutSlice';
import type * as Ably from 'ably';

/**
 * Data structure for screen_built messages
 */
interface ScreenBuiltData {
  screenId: string;
  screenName: string;
  versionId: string;
  status: 'completed';
}

/**
 * Options for the app build streaming hook
 */
export interface UseAppBuildStreamingOptions {
  /** Whether streaming is enabled (default: true) */
  enabled?: boolean;
  /** Current screen ID being viewed (for refetch logic) */
  currentScreenId?: string | null;
}

/**
 * Return type for the app build streaming hook
 */
export interface UseAppBuildStreamingResult {
  /** Whether the Ably connection is active */
  isConnected: boolean;
  /** The Ably client instance */
  client: Ably.Realtime | null;
}

/**
 * Custom hook to handle app building streaming from the AI backend
 * Listens for 'screen_built' messages and updates the screens panel and refetches if needed
 *
 * @param sessionId - The session ID for the Ably subscription
 * @param options - Configuration options including current screen ID
 * @returns Streaming state including connection status and Ably client
 */
function useAppBuildStreaming(
  sessionId: string,
  options: UseAppBuildStreamingOptions = {},
): UseAppBuildStreamingResult {
  const { enabled = true, currentScreenId = null } = options;
  const dispatch = useDispatch();

  /**
   * Handle incoming screen_built chunk messages
   */
  const onMessageHandled = useCallback(
    (info: MessageHandledInfo) => {
      // Screen_built messages come as 'chunk' type with chunkType: 'screen_built'
      // We check regardless of info.handled since the spec doc handler may not process it
      if (info.type === 'chunk') {
        const chunkData = info.data as { chunkType?: string; content?: unknown };
        
        if (chunkData?.chunkType === 'screen_built') {
          const data = chunkData.content as ScreenBuiltData;
          
          console.log('[useAppBuildStreaming] Screen build completed:', data);

          // Invalidate the screens list to update the screens panel
          dispatch(managementApi.util.invalidateTags(['Screens']));

          // If the user is currently viewing this screen, trigger a refetch
          if (currentScreenId && data.screenId === currentScreenId) {
            console.log('[useAppBuildStreaming] Triggering refetch for current screen');
            dispatch(triggerScreenRefetch());
          }
        }
      }
    },
    [dispatch, currentScreenId],
  );

  // Initialize streaming message subscription
  const { registry, isConnected, client } = useStreamingMessages('no-code-assistant', sessionId, {
    enabled: enabled && !!sessionId,
    onMessageHandled,
  });

  // Register a handler for 'chunk' messages to ensure they get processed
  useEffect(() => {
    if (!sessionId || !enabled) {
      return;
    }

    console.log('[useAppBuildStreaming] Registering chunk handler for sessionId:', sessionId);

    // Register handler for 'chunk' messages
    // This handler filters for screen_built chunks and lets others pass through
    registry.register('chunk', (data: unknown) => {
      const chunkData = data as { chunkType?: string; content?: unknown };
      
      // Only handle screen_built chunks, return false for others
      // so they can be handled by other hooks (e.g., spec doc streaming)
      if (chunkData?.chunkType === 'screen_built') {
        const screenBuiltData = chunkData.content as ScreenBuiltData;
        console.log('[useAppBuildStreaming] Processing screen_built chunk:', screenBuiltData);
        return true;
      }
      
      // Return false for other chunk types
      return false;
    });

    return () => {
      console.log('[useAppBuildStreaming] Unregistering chunk handler');
      registry.unregister('chunk');
    };
  }, [registry, sessionId, enabled]);

  return {
    isConnected,
    client,
  };
}

export default useAppBuildStreaming;
