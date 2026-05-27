/**
 * Handler for spec document streaming chunks
 * Processes different chunk types and updates the spec document progressively
 */

import type { MutableRefObject, Dispatch, SetStateAction } from 'react';
import type { MessageHandler } from './messageHandlerRegistry';
import type {
  SpecDocumentContent,
  SpecDocUserRole,
  SpecDocWorkflow,
  SpecDocDataEntity,
  SpecDocDataEntityField,
  SpecDocBusinessRule,
  SpecDocScreenSummary,
  SpecDocIntegration,
  SpecDocAnalyticsRequirement,
  ChatMessage,
  ArtifactMetadata,
} from '@m-next/api-interface';
import { isArtifactContent, isSpecDocumentArtifact } from '@m-next/api-interface';

/**
 * Partial spec document being built incrementally during streaming
 * All fields are optional as they are populated progressively
 * Includes additional fields that may be streamed but aren't in the final spec
 */
export type PartialSpecDocument = Partial<SpecDocumentContent> & {
  /**
   * Progress tracking for table mappings
   */
  tableMappingsProgress?: {
    tables: SpecDocDataEntity[];
    totalTables: number;
    stage: string;
  };
  /**
   * Integrations (may be streamed during planning)
   */
  integrations?: SpecDocIntegration[];
  /**
   * Analytics requirements (may be streamed during planning)
   */
  analyticsRequirements?: SpecDocAnalyticsRequirement[];
  /**
   * Known limitations (may be streamed during planning)
   */
  knownLimitations?: string;
  /**
   * Future enhancements (may be streamed during planning)
   */
  futureEnhancements?: string;
};

/**
 * Streaming spec document format
 * Minimal structure needed for components to render streaming updates
 * Only includes the content field, not metadata or other SpecDocument fields
 */
export type StreamingSpecDocument = {
  content: PartialSpecDocument;
  versionId: string;
  metadata?: ArtifactMetadata;
  appId?: string;
};

/**
 * App identity chunk content
 */
interface AppIdentityContent {
  appName?: string;
  appPurpose?: string;
  appIcon?: string;
}

/**
 * Schema check progress chunk content
 */
interface SchemaCheckProgressContent {
  stage?: string;
  tables?: SpecDocDataEntity[];
  totalTables?: number;
}

/**
 * Field check progress chunk content
 */
interface FieldCheckProgressContent {
  stage?: string;
  tableName?: string;
  fields?: SpecDocDataEntityField[];
  totalFields?: number;
  existingFields?: number;
  newFields?: number;
}

/**
 * Chunk data structure
 */
interface ChunkData {
  chunkType?: string;
  content?: unknown;
}

/**
 * Complete data structure
 */
interface CompleteData {
  document?: PartialSpecDocument;
  message?: string;
  finalResult?: {
    status?: string;
    messages?: ChatMessage[];
    metadata?: unknown;
  };
}

/**
 * Process a chunk and update the spec document
 * @param updated - The current spec document state
 * @param chunkType - The type of chunk being processed
 * @param content - The chunk content
 * @returns The updated spec document
 */
export function processSpecDocumentChunk(
  updated: PartialSpecDocument,
  chunkType: string,
  content: unknown,
): PartialSpecDocument {
  const result = { ...updated };

  switch (chunkType) {
    case 'appIdentity': {
      const appIdentity = content as AppIdentityContent;
      result.appName = appIdentity.appName || '';
      result.appPurpose = appIdentity.appPurpose || '';
      result.appIcon = appIdentity.appIcon || '';
      break;
    }

    case 'userRoles':
      result.userRoles = (content as SpecDocUserRole[]) || [];
      break;

    case 'workflows':
      result.keyWorkflows = (content as SpecDocWorkflow[]) || [];
      break;

    case 'dataEntities':
      result.dataEntities = (content as SpecDocDataEntity[]) || [];
      break;

    case 'schema_check_progress': {
      // Handle table mappings streaming - preserve exact backend structure
      const progressContent = content as SchemaCheckProgressContent;
      const { stage, tables = [], totalTables = 0 } = progressContent || {};

      if (stage === 'table_mappings') {
        // Initialize dataEntities if not already
        if (!result.dataEntities) {
          result.dataEntities = [];
        }

        // Store table mappings metadata
        result.tableMappingsProgress = {
          tables,
          totalTables,
          stage: 'table_mappings',
        };

        // Store tables exactly as received from backend (no renaming)
        result.dataEntities = tables;
      }
      break;
    }

    case 'field_check_progress': {
      // Handle field mappings streaming - preserve exact backend structure
      const progressContent = content as FieldCheckProgressContent;
      const { stage, tableName, fields = [], totalFields = 0, existingFields = 0, newFields = 0 } = progressContent || {};

      if (stage === 'field_mappings') {
        // Initialize dataEntities if not already
        if (!result.dataEntities) {
          result.dataEntities = [];
        }

        // Find the table in dataEntities and update its fields
        const tableIndex = result.dataEntities.findIndex((entity) => entity.tableName === tableName);
        if (tableIndex !== -1) {
          // Store fields exactly as received from backend (no renaming)
          result.dataEntities[tableIndex].fields = fields;

          // Store field mappings progress (extends the type)
          (result.dataEntities[tableIndex] as SpecDocDataEntity & { fieldMappingsProgress?: unknown }).fieldMappingsProgress = {
            totalFields,
            existingFields,
            newFields,
            stage: 'field_mappings',
          };
        }
      }
      break;
    }

    case 'businessRules':
      result.businessRules = (content as SpecDocBusinessRule[]) || [];
      break;

    case 'screens':
      result.screens = (content as SpecDocScreenSummary[]) || [];
      break;

    case 'integrations':
      result.integrations = (content as SpecDocIntegration[]) || [];
      break;

    case 'analytics':
      result.analyticsRequirements = (content as SpecDocAnalyticsRequirement[]) || [];
      break;

    case 'limitations':
      result.knownLimitations = (content as string) || '';
      break;

    case 'enhancements':
      result.futureEnhancements = (content as string) || '';
      break;

    case 'screen_creation_info':
      // This is handled by useSpecDocumentStreaming for redirection, 
      // but we include it here to avoid "Unknown chunk type" warnings.
      break;

    default:
      console.warn('❓ [SpecDocumentHandler] Unknown chunk type:', chunkType);
  }

  return result;
}

/**
 * Create the handler for spec document chunk messages
 * @param specDocumentRef - Ref to store the spec document
 * @param setActiveSpecDoc - State setter for active spec document
 * @returns The handler function
 */
export function createSpecDocumentChunkHandler(
  specDocumentRef: MutableRefObject<PartialSpecDocument | null>,
  setActiveSpecDoc: Dispatch<SetStateAction<StreamingSpecDocument | null>>,
): MessageHandler {
  return (data: unknown) => {
    const chunkData = data as ChunkData;
    const { chunkType, content } = chunkData || {};

    console.log(`[SpecDocumentHandler] Received chunk: ${chunkType}`, content);

    // List of chunk types handled by app build streaming - don't process these
    const appBuildChunks = ['screen_built'];
    if (appBuildChunks.includes(chunkType || '')) {
      console.log(`[SpecDocumentHandler] Skipping app build chunk: ${chunkType}`);
      return false; // Let app build streaming handle it
    }

    // Update the spec document progressively in ref
    const updated = processSpecDocumentChunk(specDocumentRef.current || {}, chunkType || '', content);
    specDocumentRef.current = updated;

    // Wrap the content in a StreamingSpecDocument structure
    // This ensures components that expect SpecDocument.content.appName will work
    // Preserve the versionId from previous state during streaming updates
    setActiveSpecDoc((prev: StreamingSpecDocument | null) => ({
      content: updated,
      versionId: prev?.versionId || '',
      metadata: prev?.metadata,
      appId: prev?.appId,
    }));

    // Return true to indicate we handled this chunk
    return true;
  };
}

/**
 * Create the handler for spec document completion
 * @returns The handler function
 */
export function createSpecDocumentCompleteHandler(): MessageHandler {
  return (data: unknown) => {
    const completeData = data as CompleteData;
    console.log('[SpecDocumentHandler] Streaming complete:', completeData);

    // Handle the complete document if provided
    if (completeData?.document) {
      console.log('[SpecDocumentHandler] Complete document:', completeData.document);
    }
  };
}

/**
 * Deduplicate messages by ID
 * @param existingMessages - Current messages array
 * @param newMessages - New messages to add
 * @returns Combined array with duplicates removed (based on message ID)
 */
function deduplicateMessages(existingMessages: ChatMessage[], newMessages: ChatMessage[]): ChatMessage[] {
  const existingIds = new Set(existingMessages.map((msg) => msg.id));
  const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id));
  return [...existingMessages, ...uniqueNewMessages];
}

/**
 * Create the handler for chat message completion
 * Handles streaming chat message responses and deduplicates based on message ID
 * Also checks for spec_document artifacts and updates the active spec doc
 * @param setMessages - State setter for chat messages
 * @param setIsLoading - State setter for loading state
 * @param setActiveSpecDoc - State setter for active spec document
 * @returns The handler function
 */
export function createChatMessageCompleteHandler(
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setActiveSpecDoc?: Dispatch<SetStateAction<StreamingSpecDocument | null>>,
): MessageHandler {
  return (data: unknown) => {
    const completeData = data as CompleteData;

    // Extract messages from the finalResult
    const messages = completeData?.finalResult?.messages;

    if (messages && Array.isArray(messages) && messages.length > 0) {
      console.log('[SpecDocumentHandler] Adding messages with deduplication:', messages);
      
      // Check for spec_document artifacts in the messages
      for (const message of messages) {
        if (message.content && Array.isArray(message.content)) {
          for (const contentItem of message.content) {
            // Check if this is an artifact content with visualizer "spec_document"
            if (isArtifactContent(contentItem) && isSpecDocumentArtifact(contentItem.artifact)) {

              // Update the active spec doc with the artifact content, preserving metadata
              // Type assertion is safe here because isSpecDocumentArtifact confirms the content type
              if (setActiveSpecDoc && typeof contentItem.artifact.content === 'object') {
                setActiveSpecDoc((prev) => ({
                  content: contentItem.artifact.content as SpecDocumentContent,
                  versionId: contentItem.artifact.versionId || prev?.versionId || '',
                  metadata: contentItem.artifact.metadata || prev?.metadata,
                }));
              }
            }
          }
        }
      }

      // Update messages with deduplication
      setMessages((prevMessages) => {
        const safeMessages = Array.isArray(prevMessages) ? prevMessages : [];
        console.log({safeMessages})
        return deduplicateMessages(safeMessages, messages);
      });
    }
    console.log("[SpecDocumentHandler] Setting loading to false");
    setIsLoading(false);
  };
}
