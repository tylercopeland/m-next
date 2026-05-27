/**
 * Artifact types for API interface
 * Defines the structure for artifacts that can be embedded in chat messages
 */

import type { TableSchemaContent } from './artifacts/table-schema';
import type { SpecDocumentContent } from './artifacts/spec-document';
import { Guid } from '@m-next/utilities';

// Visualizer types for different artifact content
export const ArtifactVisualizer = {
  CHART: 'chart',
  GRID: 'grid',
  CODE: 'code',
  CANVAS: 'canvas',
  TABLE_SCHEMA: 'table_schema',
  SPEC_DOCUMENT: 'spec_document',
} as const;

export type ArtifactVisualizer = (typeof ArtifactVisualizer)[keyof typeof ArtifactVisualizer];

export interface ArtifactMetadata {
  createdAt?: string;
  lastModified?: string;
  size?: 'small' | 'medium' | 'large';
  docId?: string;
  isInitialSchemaCreated?: boolean;
}

/**
 * Generic artifact interface for all visualizations and expandable content
 */
export interface Artifact {
  /** Unique identifier (lowercase with underscores) */
  id: string;

  /** UUID v4 for this version of the artifact */
  versionId: string;

  /** Incremental version number for display */
  versionNumber: number;

  /** Display name for the artifact */
  title: string;

  /** Type of visualizer to use for rendering */
  visualizer: ArtifactVisualizer;

  /** Programming language for code artifacts (e.g., 'typescript', 'sql', 'markdown') */
  language?: string;

  /** Raw content of the artifact (text or structured data) */
  content: string | TableSchemaContent | SpecDocumentContent | Record<string, unknown>;

  /** Whether this artifact has been approved by the user (for schemas, etc.) */
  approved?: boolean;

  /** Optional metadata for the artifact */
  metadata?: ArtifactMetadata;
}

/**
 * Utility to generate a UUID v4 for artifact versions
 * Uses Node.js crypto.randomUUID() for cryptographically secure UUIDs
 */
export function generateVersionId(): string {
  // Use Node.js built-in crypto.randomUUID() for secure, compliant UUID v4 generation
  return Guid.create().toString();
}
/**
 * Create a new artifact with auto-generated metadata
 */
export function createArtifact(
  title: string,
  visualizer: ArtifactVisualizer,
  content: string | TableSchemaContent | SpecDocumentContent | Record<string, unknown>,
  language?: string,
  approved?: boolean,
): Artifact {
  // Generate ID from title: lowercase, replace non-alphanumeric with underscore, trim underscores
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
  const now = new Date().toISOString();

  const artifact: Artifact = {
    id,
    versionId: generateVersionId(),
    versionNumber: 1,
    title,
    visualizer,
    content,
    metadata: {
      createdAt: now,
      lastModified: now,
      size: 'medium',
    },
  };

  // Only add optional properties if they are defined
  if (language !== undefined) {
    artifact.language = language;
  }
  if (approved !== undefined) {
    artifact.approved = approved;
  }

  return artifact;
}

/**
 * Type guards for artifact visualizers
 */
export const isChartArtifact = (artifact: Artifact): boolean => artifact.visualizer === ArtifactVisualizer.CHART;

export const isGridArtifact = (artifact: Artifact): boolean => artifact.visualizer === ArtifactVisualizer.GRID;

export const isCodeArtifact = (artifact: Artifact): boolean => artifact.visualizer === ArtifactVisualizer.CODE;

export const isCanvasArtifact = (artifact: Artifact): boolean => artifact.visualizer === ArtifactVisualizer.CANVAS;

export const isTableSchemaArtifact = (artifact: Artifact): boolean =>
  artifact.visualizer === ArtifactVisualizer.TABLE_SCHEMA;

export const isSpecDocumentArtifact = (artifact: Artifact): boolean =>
  artifact.visualizer === ArtifactVisualizer.SPEC_DOCUMENT;
