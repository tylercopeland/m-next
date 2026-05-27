import { Artifact, ChatMessage, isArtifactContent } from "@m-next/api-interface";

/**
 * Get the latest spec document artifact from a list of messages.
 */
export function getLatestSpecDocInMessages(messages: ChatMessage[]): Artifact | null {
  let latestSpecDoc = null;
  let latestTimestamp = null;

  // Loop through all messages
  for (const message of messages) {
    // Check if message has content array
    if (message.content && Array.isArray(message.content)) {
      // Loop through content items
      for (const contentItem of message.content) {
        // Check if it's an artifact of type spec_document
        if (
          contentItem.type === 'artifact' && 
          contentItem.artifact && 
          contentItem.artifact.visualizer === 'spec_document'
        ) {
          // Compare timestamps to find the latest
          const messageTimestamp = new Date(message.timestamp);
          
          if (!latestTimestamp || messageTimestamp > latestTimestamp) {
            latestSpecDoc = contentItem.artifact;
            latestTimestamp = messageTimestamp;
          }
        }
      }
    }
  }

  return latestSpecDoc;
}

/**
 * Filter out artifacts from chat messages so they don't appear as empty messages in the chat panel.
 */
export function filterOutArtifactsFromMessages(messages: ChatMessage[]): ChatMessage[] {
  const messagesFiltered: ChatMessage[] = []
  
  for(const message of messages) {
    if (message.content) {
      const filteredContent = message.content.filter(contentItem => !isArtifactContent(contentItem));

      if (filteredContent.length > 0) {
        messagesFiltered.push({ ...message, content: filteredContent });
      }
    } 
  }
  return messagesFiltered;
}
