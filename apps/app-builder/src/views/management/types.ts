/**
 * Type definitions for App Studio components
 *
 * Note: SpecDocument types are imported from @m-next/api-interface
 * These types are for component-specific props and state
 */

import { SpecDocumentContent, UserContext } from '@m-next/api-interface';

/**
 * App status type
 */
export type AppStatus = 'Planning' | 'Draft' | 'Published';

/**
 * App information displayed in the App Studio
 */
export interface App {
  appId: string;
  name: string;
  description?: string;
  lastModifiedDate: string;
  status: AppStatus;
  profileImageUrl?: string;
  isGenerating?: boolean;
}

/**
 * Error information with retry capability
 */
export interface AppStudioError {
  message: string;
  canRetry: boolean;
}

/**
 * Props for AppStudioView component
 */
export interface AppStudioViewProps {
  onGenerateClick: (prompt: string) => void | Promise<void>;
  isInitializing?: boolean;
  error?: AppStudioError | null;
  userName?: string;
  onRetry?: () => void;
  onOpenApp?: (appId: string) => void;
  apps?: App[];
}

/**
 * Props for AppStudioCard component
 */
export interface AppStudioCardProps {
  appId: string;
  appName: string;
  description?: string;
  onOpenApp: (appId: string) => void;
  lastModifiedDate: string;
  status: AppStatus;
  profileImageUrl?: string;
  isGenerating?: boolean;
}


/**
 * Props for ChatPanel component
 */
export interface ChatPanelProps {
  sessionId: string | null;
  specDocId?: string | null;
}

/**
 * Props for SpecDocViewer component
 * Accepts any object with partial spec document content (works for both complete and streaming documents)
 */
export interface SpecDocViewerProps {
  specDocument: { content: Partial<SpecDocumentContent> } | null;
  activeTab?: DetailTab;
  onTabChange?: (tab: DetailTab) => void;
  onAskMethod?: (context: UserContext) => void;
  onDownloadPdf?: () => void;
  disableDownloadPdf?: boolean;
  onCreateDataEntitiesClick?: () => void;
  isCreateLoading?: boolean;
  disableCreate?: boolean;
  onBuildApp?: () => void;
  disableBuildApp?: boolean;
}

/**
 * Detail tab types for SpecDocDetails component
 */
export type DetailTab = 'userRoles' | 'features' | 'dataEntities' | 'businessRules' | 'screens';

/**
 * Build App Response Types
 */

export interface FieldResult {
  field: string;
  status?: string;
  error?: string;
}

export interface TableResultData {
  tableCreated: boolean;
  tableAlreadyExists: boolean;
  fieldsCreated: number;
  fieldsSuccessful: FieldResult[];
  fieldsFailed: FieldResult[];
  totalFields: number;
}

export interface TableResult {
  tableName: string;
  status: 'success' | 'error';
  result: {
    success: boolean;
    status: 'success' | 'error';
    message: string;
    data: TableResultData;
  };
}

export interface BuildResponseData {
  results: TableResult[];
  successCount: number;
  failureCount: number;
  totalProcessed: number;
  specFormat: string;
}

export interface BuildMetadata {
  executionTime: number;
  agentId: string;
  agentVersion: string;
  timestamp: string;
  debugInfo: {
    normalizedSpecCount: number;
    successCount: number;
    failureCount: number;
  };
}

export interface BuildAppResponse {
  status: 'success' | 'partial' | 'error';
  result: {
    data: BuildResponseData;
    summary: string;
    confidence: number;
  };
  messages: unknown[];
  metadata: BuildMetadata;
}
