/**
 * Utility types and functions for API interface
 */

import type { ChatMessage, MessageRole } from './message';
import type { MessageContent, ContentTiming } from './content';
import type { Artifact } from './artifact';
import type { ChatRequest, ChatResponse } from './api';

/**
 * Utility type for extracting content by type
 */
export type ContentByType<T extends MessageContent['type']> = Extract<MessageContent, { type: T }>;

/**
 * Helper functions for working with conversations
 */
export class ConversationUtils {
  /**
   * Get all messages of a specific role from conversation history
   */
  static getMessagesByRole(messages: ChatMessage[], role: MessageRole): ChatMessage[] {
    return messages.filter((message) => message.role === role);
  }

  /**
   * Get the last message in a conversation
   */
  static getLastMessage(messages: ChatMessage[]): ChatMessage | undefined {
    return messages[messages.length - 1];
  }

  /**
   * Get the last human message in a conversation
   */
  static getLastHumanMessage(messages: ChatMessage[]): ChatMessage | undefined {
    const humanMessages = this.getMessagesByRole(messages, 'human');
    return humanMessages[humanMessages.length - 1];
  }

  /**
   * Get the last assistant message in a conversation
   */
  static getLastAssistantMessage(messages: ChatMessage[]): ChatMessage | undefined {
    const assistantMessages = this.getMessagesByRole(messages, 'assistant');
    return assistantMessages[assistantMessages.length - 1];
  }

  /**
   * Count total tokens in conversation
   */
  static getTotalTokens(messages: ChatMessage[]): number {
    return messages.reduce((total, message) => {
      const usage = message.metadata?.tokenUsage;
      return total + (usage?.totalTokens || 0);
    }, 0);
  }

  /**
   * Get all artifacts from conversation
   */
  static getAllArtifacts(messages: ChatMessage[]): Artifact[] {
    const artifacts: Artifact[] = [];

    messages.forEach((message) => {
      message.content.forEach((content) => {
        if (content.type === 'artifact') {
          artifacts.push(content.artifact);
        }
      });
    });

    return artifacts;
  }

  /**
   * Get artifacts by visualizer type
   */
  static getArtifactsByType(messages: ChatMessage[], visualizer: Artifact['visualizer']): Artifact[] {
    return this.getAllArtifacts(messages).filter((artifact) => artifact.visualizer === visualizer);
  }

  /**
   * Extract all text content from a conversation
   */
  static extractAllText(messages: ChatMessage[]): string {
    return messages
      .flatMap((message) => message.content)
      .filter((content): content is Extract<MessageContent, { type: 'text' }> => content.type === 'text')
      .map((content) => content.text)
      .join('\n\n');
  }

  /**
   * Create a simple text-only conversation turn
   */
  static createTextConversation(humanText: string, assistantText: string): ChatMessage[] {
    const humanMessage: ChatMessage = {
      id: `human_${Date.now()}`,
      role: 'human',
      content: [
        {
          id: `text_${Date.now()}_1`,
          type: 'text',
          text: humanText,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    const assistantMessage: ChatMessage = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      content: [
        {
          id: `text_${Date.now()}_2`,
          type: 'text',
          text: assistantText,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return [humanMessage, assistantMessage];
  }

  /**
   * Get total processing time for all content blocks in conversation
   */
  static getTotalContentProcessingTime(messages: ChatMessage[]): number {
    return messages.reduce((total, message) => {
      const contentTime = message.content.reduce((contentTotal, content) => {
        return contentTotal + (content.timing?.durationMs || 0);
      }, 0);
      return total + contentTime;
    }, 0);
  }

  /**
   * Get content blocks with timing information
   */
  static getContentWithTiming(messages: ChatMessage[]): Array<MessageContent & { timing: ContentTiming }> {
    const timedContent: Array<MessageContent & { timing: ContentTiming }> = [];

    messages.forEach((message) => {
      message.content.forEach((content) => {
        if (content.timing) {
          timedContent.push(content as MessageContent & { timing: ContentTiming });
        }
      });
    });

    return timedContent;
  }

  /**
   * Get the slowest content block in the conversation
   */
  static getSlowestContent(messages: ChatMessage[]): (MessageContent & { timing: ContentTiming }) | undefined {
    const timedContent = this.getContentWithTiming(messages);
    return timedContent.reduce(
      (slowest, current) => {
        if (!slowest || current.timing.durationMs > slowest.timing.durationMs) {
          return current;
        }
        return slowest;
      },
      undefined as (MessageContent & { timing: ContentTiming }) | undefined,
    );
  }

  /**
   * Get the fastest content block in the conversation
   */
  static getFastestContent(messages: ChatMessage[]): (MessageContent & { timing: ContentTiming }) | undefined {
    const timedContent = this.getContentWithTiming(messages);
    return timedContent.reduce(
      (fastest, current) => {
        if (!fastest || current.timing.durationMs < fastest.timing.durationMs) {
          return current;
        }
        return fastest;
      },
      undefined as (MessageContent & { timing: ContentTiming }) | undefined,
    );
  }

  /**
   * Get average processing time per content block
   */
  static getAverageContentProcessingTime(messages: ChatMessage[]): number {
    const timedContent = this.getContentWithTiming(messages);
    if (timedContent.length === 0) return 0;

    const totalTime = timedContent.reduce((total, content) => total + content.timing.durationMs, 0);
    return totalTime / timedContent.length;
  }

  /**
   * Get timing statistics for a conversation
   */
  static getTimingStatistics(messages: ChatMessage[]): {
    totalContentTime: number;
    averageContentTime: number;
    contentBlocksWithTiming: number;
    totalContentBlocks: number;
    slowestContent?: MessageContent & { timing: ContentTiming };
    fastestContent?: MessageContent & { timing: ContentTiming };
  } {
    const timedContent = this.getContentWithTiming(messages);
    const totalContentBlocks = messages.reduce((total, msg) => total + msg.content.length, 0);
    const slowest = this.getSlowestContent(messages);
    const fastest = this.getFastestContent(messages);

    const result: {
      totalContentTime: number;
      averageContentTime: number;
      contentBlocksWithTiming: number;
      totalContentBlocks: number;
      slowestContent?: MessageContent & { timing: ContentTiming };
      fastestContent?: MessageContent & { timing: ContentTiming };
    } = {
      totalContentTime: this.getTotalContentProcessingTime(messages),
      averageContentTime: this.getAverageContentProcessingTime(messages),
      contentBlocksWithTiming: timedContent.length,
      totalContentBlocks,
    };

    if (slowest) {
      result.slowestContent = slowest;
    }
    if (fastest) {
      result.fastestContent = fastest;
    }

    return result;
  }
}

/**
 * Builder class for creating chat responses
 */
export class ChatResponseBuilder {
  private response: Partial<ChatResponse> = {
    status: 'success',
    messages: [],
  };

  /**
   * Set response status
   */
  setStatus(status: 'success' | 'error'): this {
    this.response.status = status;
    return this;
  }

  /**
   * Add a message to the response
   */
  addMessage(message: ChatMessage): this {
    if (!this.response.messages) {
      this.response.messages = [];
    }
    this.response.messages.push(message);
    return this;
  }

  /**
   * Add multiple messages to the response
   */
  addMessages(messages: ChatMessage[]): this {
    if (!this.response.messages) {
      this.response.messages = [];
    }
    this.response.messages.push(...messages);
    return this;
  }

  /**
   * Set error information
   */
  setError(code: string, message: string, details?: Record<string, unknown>): this {
    this.response.status = 'error';
    this.response.error = {
      code,
      message,
    };
    if (details !== undefined) {
      this.response.error.details = details;
    }
    return this;
  }

  /**
   * Set metadata
   */
  setMetadata(metadata: ChatResponse['metadata']): this {
    if (metadata !== undefined) {
      this.response.metadata = metadata;
    }
    return this;
  }

  /**
   * Build the final response
   */
  build(): ChatResponse {
    if (!this.response.messages) {
      this.response.messages = [];
    }

    // Ensure metadata exists and add timestamp
    const timestamp = new Date().toISOString();
    if (this.response.metadata) {
      this.response.metadata.timestamp = timestamp;
    } else {
      this.response.metadata = { timestamp };
    }

    return this.response as ChatResponse;
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validate a chat request
   */
  static validateChatRequest(request: unknown): request is ChatRequest {
    if (typeof request !== 'object' || request === null) {
      return false;
    }

    const req = request as Record<string, unknown>;
    return typeof req.message === 'string' && req.message.trim().length > 0;
  }

  /**
   * Validate a chat message
   */
  static validateChatMessage(message: unknown): message is ChatMessage {
    if (typeof message !== 'object' || message === null) {
      return false;
    }

    const msg = message as Record<string, unknown>;
    return (
      typeof msg.id === 'string' &&
      (msg.role === 'human' || msg.role === 'assistant') &&
      Array.isArray(msg.content) &&
      typeof msg.timestamp === 'string'
    );
  }

  /**
   * Validate message content
   */
  static validateMessageContent(content: unknown): content is MessageContent {
    if (typeof content !== 'object' || content === null) {
      return false;
    }

    const cont = content as Record<string, unknown>;
    if (typeof cont.id !== 'string' || typeof cont.type !== 'string') {
      return false;
    }

    if (cont.type === 'text') {
      return typeof cont.text === 'string';
    }

    if (cont.type === 'artifact') {
      return typeof cont.artifact === 'object' && cont.artifact !== null;
    }

    return false;
  }
}
