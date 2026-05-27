/**
 * Content types for chat messages
 * Defines the structure for different types of content within messages
 */

import type { Artifact } from './artifact';

// Content type discriminators
export const ContentType = {
  TEXT: 'text',
  ARTIFACT: 'artifact',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

/**
 * Timing information for content blocks
 */
export interface ContentTiming {
  /** ISO timestamp when content generation/processing started */
  startTime: string;

  /** ISO timestamp when content generation/processing completed */
  endTime: string;

  /** Duration in milliseconds */
  durationMs: number;
}

/**
 *  File attachment in a Message
 */
export interface FileAttachment {
  name: string;
  url: string;
  size?: number;
}

/**
 * Base content interface
 */
interface BaseContent {
  /** Unique identifier for this content block */
  id: string;

  /** Type discriminator */
  type: ContentType;

  /** Timing information for this content block */
  timing?: ContentTiming;
}

/**
 * Text content block
 */
export interface TextContent extends BaseContent {
  type: typeof ContentType.TEXT;

  /** The text content */
  text: string;

  /** Optional attachments for this text content */
  attachments?: FileAttachment[];

  /** Optional metadata for text formatting */
  metadata?: {
    /** Text format hint */
    format?: 'plain' | 'markdown' | 'html';

    /** Whether this text contains citations */
    hasCitations?: boolean;

    /** Additional text metadata */
    [key: string]: unknown;
  };
}

/**
 * Artifact content block
 */
export interface ArtifactContent extends BaseContent {
  type: typeof ContentType.ARTIFACT;

  /** The artifact data */
  artifact: Artifact;

  /** Optional description of the artifact */
  description?: string;
}

/**
 * Union type for all content types
 */
export type MessageContent = TextContent | ArtifactContent;

/**
 * Type guards for content types
 */
export const isTextContent = (content: MessageContent): content is TextContent => content.type === ContentType.TEXT;

export const isArtifactContent = (content: MessageContent): content is ArtifactContent =>
  content.type === ContentType.ARTIFACT;

/**
 * Utility functions for creating content
 */
export function createTextContent(
  text: string,
  format?: 'plain' | 'markdown' | 'html',
  timing?: ContentTiming,
  attachments?: FileAttachment[],
): TextContent {
  const content: TextContent = {
    id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: ContentType.TEXT,
    text,
  };

  // Only add optional properties if they are defined
  if (format) {
    content.metadata = { format };
  }
  if (timing) {
    content.timing = timing;
  }

  if (attachments) {
    content.attachments = attachments;
  }

  return content;
}

export function createArtifactContent(
  artifact: Artifact,
  description?: string,
  timing?: ContentTiming,
): ArtifactContent {
  const content: ArtifactContent = {
    id: `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: ContentType.ARTIFACT,
    artifact,
  };

  // Only add optional properties if they are defined
  if (description !== undefined) {
    content.description = description;
  }
  if (timing) {
    content.timing = timing;
  }

  return content;
}

/**
 * Create timing information for a content block
 * Validates that dates are valid and endTime >= startTime
 */
export function createContentTiming(startTime: string, endTime?: string): ContentTiming {
  const end = endTime || new Date().toISOString();
  const start = new Date(startTime);
  const finish = new Date(end);

  // Validate dates are valid
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start time: ${startTime}`);
  }
  if (isNaN(finish.getTime())) {
    throw new Error(`Invalid end time: ${end}`);
  }

  const durationMs = finish.getTime() - start.getTime();

  // Validate duration is not negative
  if (durationMs < 0) {
    throw new Error(`End time (${end}) must be after start time (${startTime})`);
  }

  return {
    startTime,
    endTime: end,
    durationMs,
  };
}

/**
 * Create timing information from a start time and duration
 * Validates that the start time is valid and duration is non-negative
 */
export function createContentTimingFromDuration(startTime: string, durationMs: number): ContentTiming {
  const start = new Date(startTime);

  // Validate start time is valid
  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start time: ${startTime}`);
  }

  // Validate duration is non-negative
  if (durationMs < 0) {
    throw new Error(`Duration must be non-negative, got: ${durationMs}ms`);
  }

  const end = new Date(start.getTime() + durationMs);

  return {
    startTime,
    endTime: end.toISOString(),
    durationMs,
  };
}

/**
 * Create timing for content that was generated instantly
 */
export function createInstantTiming(): ContentTiming {
  const now = new Date().toISOString();
  return {
    startTime: now,
    endTime: now,
    durationMs: 0,
  };
}
