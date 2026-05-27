import React from 'react';
import useStreamingMessages from '../../common/hooks/useStreamingMessages';
import { useSearchParams } from 'react-router-dom';
import ChatPanel from './ChatPanel';

/**
 * Container component that manages session state via hook
 * and passes it to the presentational AppCreationPromptView component
 */
function AppStudio() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const specDocId = searchParams.get('specDocId');

  // Subscribe to streaming messages when session exists but ChatPanel is not loaded
  // This allows us to receive background messages (e.g., notifications) before chat starts
  // Once ChatPanel loads, it manages its own subscription via useSpecDocumentStreaming
  useStreamingMessages('no-code-assistant', sessionId, {
    enabled: !!sessionId,
    onMessageHandled: (info) => {
      console.log('[AppStudio] Message handled:', info);
    },
  });

  return (
    <ChatPanel
      sessionId={sessionId}
      specDocId={specDocId}
    />
  );

}

export default AppStudio;
