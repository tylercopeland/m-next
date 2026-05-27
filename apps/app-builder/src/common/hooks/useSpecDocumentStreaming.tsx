import { useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { nocodeAssistantSessionSet, selectNocodeAssistantSessionId } from '../services/sessionSlice';
import useStreamingMessages, { MessageHandledInfo } from './useStreamingMessages';
import {
  createSpecDocumentChunkHandler,
  createChatMessageCompleteHandler,
  PartialSpecDocument,
  StreamingSpecDocument,
} from '../streaming/specDocumentHandler';
import type { ChatMessage } from '@m-next/api-interface';
import type * as Ably from 'ably';

/**
 * Refs used by spec document streaming handlers
 */
export interface SpecDocumentRefs {
  /** Ref to store the current spec document */
  specDocumentRef: React.MutableRefObject<PartialSpecDocument | null>;
}

/**
 * Options for the spec document streaming hook
 */
export interface UseSpecDocumentStreamingOptions {
  /** Whether streaming is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for the spec document streaming hook
 */
export interface UseSpecDocumentStreamingResult {
  /** Whether the Ably connection is active */
  isConnected: boolean;
  /** The Ably client instance */
  client: Ably.Realtime | null;
}

/**
 * Custom hook to handle spec document streaming
 * Encapsulates all the handler registration logic for spec document messages
 *
 * @param sessionId - The session ID for the Ably subscription
 * @param setMessages - State setter for chat messages
 * @param setActiveSpecDoc - State setter for active spec document (StreamingSpecDocument format)
 * @returns Streaming state including connection status and Ably client
 */
function useSpecDocumentStreaming(
  sessionId: string,
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  setActiveSpecDoc: Dispatch<SetStateAction<StreamingSpecDocument | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
): UseSpecDocumentStreamingResult {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nocodeAssistantSessionId = useSelector(selectNocodeAssistantSessionId);
  
  // Refs for spec document streaming state
  const specDocumentRef = useRef<PartialSpecDocument | null>(null);

  // Store sessionId in Redux when it changes (for persistence across navigation)
  useEffect(() => {
    if (sessionId && sessionId !== nocodeAssistantSessionId) {
      dispatch(nocodeAssistantSessionSet(sessionId));
    }
  }, [sessionId, nocodeAssistantSessionId, dispatch]);

  /**
   * Helper to handle redirection when screen creation info is received
   */
  const handleScreenCreationRedirection = useCallback(
    (data) => {
      
      const { appId, screenInfo } = data || {};
      
      if (appId && Array.isArray(screenInfo) && screenInfo.length > 0) {
        const firstScreen = screenInfo[0];
        const screenId = firstScreen.screenId;
        
        if (screenId) {
          // Redirect to the first screen (versionId is the same as screenId)
          const urlParams = new URLSearchParams({ panel: 'screens' });
          if (sessionId) {
            urlParams.set('sessionId', sessionId);
          }
          const redirectUrl = `/${appId}/layout/${screenId}/${screenId}?${urlParams.toString()}`;
          console.log('[useSpecDocumentStreaming] Redirecting to:', redirectUrl);
          navigate(redirectUrl);
        } else {
          console.warn('[useSpecDocumentStreaming] No screenId found in first screen');
        }
      } else {
        console.warn('[useSpecDocumentStreaming] Missing appId or screenInfo:', { appId, screenInfo });
      }
    },
    [navigate, sessionId],
  );

  /**
   * Handle incoming streaming messages and watch for screen creation info
   */
  const onMessageHandled = useCallback(
    (info: MessageHandledInfo) => {
      console.log('[useSpecDocumentStreaming] onMessageHandled received:', info.type, info.data);
      
      // Case 1: screen_creation_info is sent as a top-level message type
      if (info.type === 'chunk') {
        const chunkData = info.data as unknown as { chunkType?: string; content?: unknown };
        console.log('[useSpecDocumentStreaming] Chunk message received, chunkType:', chunkData?.chunkType);
        
        if (chunkData?.chunkType === 'screen_creation_info') {
          console.log('[useSpecDocumentStreaming] Handling screen_creation_info (chunk)');
          handleScreenCreationRedirection(chunkData.content);
        }
      }
    },
    [handleScreenCreationRedirection],
  );

  // Initialize streaming message subscription
  const { registry, isConnected, client } = useStreamingMessages('no-code-assistant', sessionId, {
    enabled: !!sessionId,
    onMessageHandled,
  });

  // Register message handlers
  // Dependencies are stable: registry is from useRef, and React setState functions are stable
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    // Register handler for spec document chunks
    registry.register('chunk', createSpecDocumentChunkHandler(specDocumentRef, setActiveSpecDoc));

    // Register handler for chat message completion (with deduplication and spec doc artifact handling)
    registry.register('complete', createChatMessageCompleteHandler(setMessages, setIsLoading, setActiveSpecDoc));

    // Cleanup handlers on unmount or when sessionId changes
    return () => {
      registry.clear();
    };
    // Only re-register when sessionId or enabled changes
  }, [registry, sessionId, setMessages, setActiveSpecDoc, setIsLoading]);

  return {
    isConnected,
    client,
  };
}

export default useSpecDocumentStreaming;
