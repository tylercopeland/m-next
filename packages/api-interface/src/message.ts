/**
 * Message types for API interface
 * Defines the structure for chat messages between human and assistant
 */

import type { FileAttachment, MessageContent } from './content';

// Message role types
export const MessageRole = {
  HUMAN: 'human',
  ASSISTANT: 'assistant',
  TOOL_RESULT: 'tool_result',
  AGENT: 'agent',
} as const;

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];

/**
 * Chat message interface
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;

  /** Role of the message sender */
  role: MessageRole;
  userName?: string;
  userId?: string;
  /** Source agent identifier (for agent role messages) */
  source?: string;

  /** Array of content blocks in this message */
  content: MessageContent[];

  /** ISO timestamp when the message was created */
  timestamp: string;

  /** Optional metadata for the message */
  metadata?: {
    /** Model used to generate this message (for assistant messages) */
    model?: string;

    /** Token usage information */
    tokenUsage?: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };

    /** Processing time in milliseconds */
    processingTimeMs?: number;

    /** Additional metadata fields */
    [key: string]: unknown;
  };
}

/**
 * Type guards for message roles
 */
export const isHumanMessage = (message: ChatMessage): boolean => message.role === MessageRole.HUMAN;

export const isAssistantMessage = (message: ChatMessage): boolean => message.role === MessageRole.ASSISTANT;

export const isToolResultMessage = (message: ChatMessage): boolean => message.role === MessageRole.TOOL_RESULT;

export const isAgentMessage = (message: ChatMessage): boolean => message.role === MessageRole.AGENT;

/**
 * Utility functions for creating messages
 */
export function createHumanMessage(content: MessageContent[], userName?: string, userId?: string): ChatMessage {
  return {
    id: `human_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role: MessageRole.HUMAN,
    userName,
    userId,
    content,
    timestamp: new Date().toISOString(),
  };
}

export function createAssistantMessage(content: MessageContent[], metadata?: ChatMessage['metadata']): ChatMessage {
  const message: ChatMessage = {
    id: `assistant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role: MessageRole.ASSISTANT,
    content,
    timestamp: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    message.metadata = metadata;
  }

  return message;
}

export function createToolResultMessage(content: MessageContent[], metadata?: ChatMessage['metadata']): ChatMessage {
  const message: ChatMessage = {
    id: `tool_result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role: MessageRole.TOOL_RESULT,
    content,
    timestamp: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    message.metadata = metadata;
  }

  return message;
}

export function createAgentMessage(
  content: MessageContent[],
  source: string,
  metadata?: ChatMessage['metadata'],
): ChatMessage {
  const message: ChatMessage = {
    id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role: MessageRole.AGENT,
    source,
    content,
    timestamp: new Date().toISOString(),
  };

  if (metadata !== undefined) {
    message.metadata = metadata;
  }

  return message;
}

/**
 * Utility to get all text content from a message
 */
export function getMessageText(message: ChatMessage): string {
  return typeof message.content === 'string'
    ? message.content
    : message.content
        .filter((content): content is Extract<MessageContent, { type: 'text' }> => content.type === 'text')
        .map((content) => content.text)
        .join(' ');
}

/**
 * Utility to get all file attachments from a message
 */
export function getMessageAttachments(message: ChatMessage): FileAttachment[] {
  if (!Array.isArray(message.content)) {
    return [];
  }
  return message.content
    .filter((content): content is Extract<MessageContent, { type: 'text' }> => content.type === 'text')
    .flatMap((content) => content.attachments || []);
}

/**
 * Utility to get all artifacts from a message
 */
export function getMessageArtifacts(message: ChatMessage) {
  return message.content
    .filter((content): content is Extract<MessageContent, { type: 'artifact' }> => content.type === 'artifact')
    .map((content) => content.artifact);
}

/**
 * Utility to check if a message has artifacts
 */
export function hasArtifacts(message: ChatMessage): boolean {
  // Handle legacy format where content might be a string
  if (!Array.isArray(message.content)) {
    return false;
  }
  return message.content.some((content) => content.type === 'artifact');
}
