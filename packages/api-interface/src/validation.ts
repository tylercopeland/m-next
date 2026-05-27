/**
 * Validation schemas and utilities for API interface types
 *
 * This module provides Zod schemas for runtime validation of API requests and responses,
 * ensuring type safety at API boundaries.
 */

import { z } from 'zod';
import type { ChatRequest } from './api';

// Session validation schema - matches the ChatRequest interface
const SessionSchema = z.object({
  sessionId: z.string().uuid('Session ID must be a valid UUID'),
  accountName: z.string(),
});

// UserContext validation schema
const UserContextSchema = z.object({
  type: z.enum(['screen', 'spec-section', 'document', 'component', 'general'] as const).optional(),
  identifier: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Metadata validation schema - matches ChatRequest interface
const MetadataSchema = z
  .object({
    context: UserContextSchema.optional(),
  })
  .optional();

// Import ChatMessage type for validation
import type { ChatMessage } from './message';

// ChatMessage validation schema
const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['human', 'assistant', 'tool_result', 'agent'] as const),
  source: z.string().optional(), // For agent messages
  content: z.array(z.any()), // MessageContent[] - using z.any() for content blocks for now
  timestamp: z.string(),
  metadata: z
    .object({
      model: z.string().optional(),
      tokenUsage: z
        .object({
          inputTokens: z.number(),
          outputTokens: z.number(),
          totalTokens: z.number(),
        })
        .optional(),
      processingTimeMs: z.number().optional(),
    })
    .passthrough()
    .optional(),
});

// ChatRequest validation schema - exactly matches the interface
export const ChatRequestSchema = z.object({
  message: z.string(),
  session: SessionSchema,
  metadata: MetadataSchema,
});

// Type-safe parsing function for ChatRequest
export function safeParseChatRequest(
  data: unknown,
): { success: true; data: ChatRequest } | { success: false; error: z.ZodError } {
  const result = ChatRequestSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Clean up the parsed data to satisfy exactOptionalPropertyTypes
  const parsed = result.data;
  const cleanedRequest: ChatRequest = {
    message: parsed.message,
    session: parsed.session as ChatRequest['session'],
  };

  if (parsed.metadata !== undefined) {
    // Clean up metadata by removing undefined optional properties
    const metadata: ChatRequest['metadata'] = {};
    if (parsed.metadata.context !== undefined) {
      metadata.context = parsed.metadata.context;
    }

    cleanedRequest.metadata = metadata;
  }

  return { success: true, data: cleanedRequest };
}

// Type-safe parsing function that throws on error
export function parseChatRequest(data: unknown): ChatRequest {
  const parsed = ChatRequestSchema.parse(data);
  // Build result without undefined optional properties to satisfy exactOptionalPropertyTypes
  const result: ChatRequest = {
    message: parsed.message,
    session: parsed.session as ChatRequest['session'],
  };

  if (parsed.metadata !== undefined) {
    // Clean up metadata by removing undefined optional properties
    const metadata: ChatRequest['metadata'] = {};
    if (parsed.metadata.context !== undefined) {
      metadata.context = parsed.metadata.context;
    }

    result.metadata = metadata;
  }

  return result;
}

// Type-safe parsing function for ChatMessage
export function safeParseChatMessage(
  data: unknown,
): { success: true; data: ChatMessage } | { success: false; error: z.ZodError } {
  const result = ChatMessageSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  // Clean up the parsed data to satisfy exactOptionalPropertyTypes
  const parsed = result.data;
  const cleanedMessage: ChatMessage = {
    id: parsed.id as string,
    role: parsed.role,
    content: parsed.content,
    timestamp: parsed.timestamp as string,
  };

  if (parsed.source !== undefined) {
    cleanedMessage.source = parsed.source;
  }
  if (parsed.metadata !== undefined) {
    // Clean up metadata by removing undefined optional properties
    const metadata: ChatMessage['metadata'] = {};
    if (parsed.metadata.model !== undefined) {
      metadata.model = parsed.metadata.model;
    }
    if (parsed.metadata.tokenUsage !== undefined) {
      metadata.tokenUsage = parsed.metadata.tokenUsage as NonNullable<ChatMessage['metadata']>['tokenUsage'];
    }
    if (parsed.metadata.processingTimeMs !== undefined) {
      metadata.processingTimeMs = parsed.metadata.processingTimeMs;
    }

    cleanedMessage.metadata = metadata;
  }

  return { success: true, data: cleanedMessage };
}

// Type-safe parsing function that throws on error
export function parseChatMessage(data: unknown): ChatMessage {
  const parsed = ChatMessageSchema.parse(data);
  // Build result without undefined optional properties to satisfy exactOptionalPropertyTypes
  const result: ChatMessage = {
    id: parsed.id as string,
    role: parsed.role,
    content: parsed.content,
    timestamp: parsed.timestamp as string,
  };

  if (parsed.source !== undefined) {
    result.source = parsed.source;
  }
  if (parsed.metadata !== undefined) {
    // Clean up metadata by removing undefined optional properties
    const metadata: ChatMessage['metadata'] = {};
    if (parsed.metadata.model !== undefined) {
      metadata.model = parsed.metadata.model;
    }
    if (parsed.metadata.tokenUsage !== undefined) {
      metadata.tokenUsage = parsed.metadata.tokenUsage as NonNullable<ChatMessage['metadata']>['tokenUsage'];
    }
    if (parsed.metadata.processingTimeMs !== undefined) {
      metadata.processingTimeMs = parsed.metadata.processingTimeMs;
    }

    result.metadata = metadata;
  }

  return result;
}

// Validation helpers
export function isValidChatRequest(data: unknown): data is ChatRequest {
  return ChatRequestSchema.safeParse(data).success;
}

export function isValidChatMessage(data: unknown): data is ChatMessage {
  return ChatMessageSchema.safeParse(data).success;
}

// Export schema types
export type ValidatedChatRequest = z.infer<typeof ChatRequestSchema>;
export type ValidatedChatMessage = z.infer<typeof ChatMessageSchema>;
export type ValidatedSession = z.infer<typeof SessionSchema>;
