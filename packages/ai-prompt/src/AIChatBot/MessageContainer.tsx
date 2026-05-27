import React from 'react';
import { ChatMessage, MessageRole, getMessageAttachments, getMessageText } from '@m-next/api-interface';
import { MessageBubble } from './MessageBubble';

export interface MessageContainerProps {
  /** The message object from api-interface */
  message: ChatMessage;
  /** Optional sender name override */
  senderName?: string;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}

export function MessageContainer({ message, senderName, className, 'data-testid': testId }: MessageContainerProps) {
  const messageText = getMessageText(message);
  const attachments = getMessageAttachments(message);
  const isAssistant = message.role === MessageRole.ASSISTANT;

  const containerTestId = testId || `message-container-${message.id}`;

  return (
    <MessageBubble
      isAssistant={isAssistant}
      content={messageText}
      attachments={attachments}
      senderName={senderName}
      timestamp={message.timestamp}
      className={className}
      data-testid={containerTestId}
    />
  );
}

export default MessageContainer;
