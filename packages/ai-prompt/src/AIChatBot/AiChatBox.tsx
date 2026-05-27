import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole, UserContext } from '@m-next/api-interface';
import {
  ChatSidebarContainer,
  MessagesScrollArea,
  MessagesWrapper,
  LoadingDots,
  MessageBubbleStyled,
  MessageGroup,
  MessageMeta,
} from './AIChatBot.styles';
import { TaskProgress, TaskProgressItem } from './TaskProgress';
import { AIHeader } from './AIHeader';
import { MessageContainer } from './MessageContainer';
import { ChatInput } from './ChatInput';

export interface AiChatBoxProps {
  /** Array of chat messages using api-interface format */
  messages?: ChatMessage[];
  /** Whether the chat is loading */
  isLoading?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
  /** User name to display for human messages */
  userName?: string;
  /** AI assistant name to display */
  assistantName?: string;
  /** Task progress items to display */
  taskProgress?: TaskProgressItem[];
  /** Title for task progress section */
  taskProgressTitle?: string;
  /** Number of messages after which task progress should be inserted (e.g., 2 = after 2nd message). null = after all messages */
  taskProgressInsertIndex?: number | null;
  /** Callback when a new message is sent */
  onSendMessage?: (message: string, attachments?: File[], context?: UserContext) => void;
  /** Callback to stop a running request */
  onStopRequest?: () => void;
  /** Callback when a task is clicked */
  onTaskClick?: (task: TaskProgressItem) => void;
  /** Callback when the close button is clicked */
  onCloseClick?: () => void;
  /** Currently attached context */
  attachedContext?: UserContext | null;
  /** Callback when context is removed */
  onRemoveContext?: () => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Tooltip message to show when disabled */
  disabledTooltip?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}

export function AiChatBox({
  messages = [],
  isLoading = false,
  placeholder = 'Type your message...',
  className,
  userName = 'You',
  assistantName = 'Method AI',
  taskProgress,
  taskProgressTitle,
  taskProgressInsertIndex = null,
  onSendMessage,
  onTaskClick,
  onCloseClick,
  onRemoveContext,
  attachedContext,
  onStopRequest,
  disabled = false,
  disabledTooltip,
  'data-testid': testId,
}: AiChatBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const containerTestId = testId || 'ai-chatbox';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSubmit = useCallback(
    (message: string, attachments?: File[], ctx?: UserContext) => {
      setInputValue('');
      onSendMessage?.(message, attachments, ctx);
    },
    [onSendMessage],
  );

  const getSenderName = (role: string): string => (role === MessageRole.ASSISTANT ? assistantName : userName);

  return (
    <ChatSidebarContainer className={className} data-testid={containerTestId}>
      <AIHeader title={assistantName} data-testid={`${containerTestId}-header`} onClose={onCloseClick} />

      <MessagesScrollArea ref={scrollAreaRef} data-testid={`${containerTestId}-messages`}>
        <MessagesWrapper>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <MessageContainer
                message={message}
                senderName={getSenderName(message.role)}
                data-testid={`${containerTestId}-message-${message.id}`}
              />
              {/* Insert task progress after the specified message index */}
              {taskProgress &&
                taskProgress.length > 0 &&
                taskProgressInsertIndex !== null &&
                index === taskProgressInsertIndex - 1 && (
                  <TaskProgress
                    title={taskProgressTitle}
                    tasks={taskProgress}
                    onTaskClick={onTaskClick}
                    data-testid={`${containerTestId}-task-progress`}
                  />
                )}
            </React.Fragment>
          ))}

          {/* Show at the end if no insert index specified or after all messages */}
          {taskProgress && taskProgress.length > 0 && taskProgressInsertIndex === null && (
            <TaskProgress
              title={taskProgressTitle}
              tasks={taskProgress}
              onTaskClick={onTaskClick}
              data-testid={`${containerTestId}-task-progress`}
            />
          )}

          {isLoading && (
            <MessageGroup isUser={false} data-testid={`${containerTestId}-loading`}>
              <MessageMeta isUser={false}>
                <span>{assistantName}</span>
                <span>
                  {new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </MessageMeta>
              <MessageBubbleStyled isUser={false}>
                <LoadingDots>
                  <div />
                  <div />
                  <div />
                </LoadingDots>
              </MessageBubbleStyled>
            </MessageGroup>
          )}

          <div ref={messagesEndRef} />
        </MessagesWrapper>
      </MessagesScrollArea>

      <ChatInput
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={onStopRequest}
        onChange={handleInputChange}
        value={inputValue}
        controlled
        context={attachedContext}
        onRemoveContext={onRemoveContext}
        disabledTooltip={disabledTooltip}
        data-testid={`${containerTestId}-input`}
      />
    </ChatSidebarContainer>
  );
}

export default AiChatBox;
