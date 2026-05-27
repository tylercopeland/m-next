import { BaseControl } from "@m-next/runtime-interface";
import { DefaultRootState } from "react-redux";

// Define SessionState interface locally to avoid circular imports
interface DisplayPreferences {
  [key: string]: unknown;
}
export interface ControlType {
  id: string;
  Type: string;
  // Use unknown instead of any for better type safety
  [key: string]: unknown;
}




interface UserPreferences {
  display?: DisplayPreferences;
  [key: string]: unknown;
}

interface FeatureFlags {
  [key: string]: boolean | string | number;
}

interface SessionState {
  accountName: string | null;
  accountFriendlyName: string | null;
  accountId: string | null;
  isDeveloper: boolean | null;
  userName: string | null;
  userId: string | null;
  methodIdentity: string | null;
  userEmail: string | null;
  tokenV2: string | null;
  tokenRTC: string | null;
  preferences: UserPreferences | null;
  isAdmin: boolean;
  isCustomizer: boolean;
  featureFlags: FeatureFlags | null;
}

// Screen layout state interface
export interface ScreenLayoutState {
  ribbonList: unknown;
  isStock: boolean;
  draftInfo: null | {
    versionId: string,
    versionNumber: number,
    lastModifiedDate: string,
    lastModifiedBy: string
  };
  screenFunctions: never[];
  defaultFocusControl: string | null;
  comments: string;
  onLoad: string | null;
  onFocus: string | null;
  onActiveRecordChange: string | null;
  staticLayout: boolean;
  status: string;
  id: string | null;
  versionId: string | null;
  controls: Record<string, BaseControl> | null;
  layout: unknown | null;
  appRibbonType: string | null;
  changes: Record<string, Record<string, unknown>>;
  actionUpserts: Record<string, Record<string, unknown>>;
  lastControlUpdated: string | null;
  activeRecordId: string | null;
  baseModel: string | null;
  fields: Array<{ type: string; name: string; caption: string; sourceModel?: string }>;
  baseModelJoins: Record<string, Array<{ value: string; label: string }>>;
  selectedControlId: string | null;
  selectedControlProperty: string | null;
  layoutV4: unknown[];
  isV4Screen: boolean;
  dataModels: Array<{ name: string; caption: string }>;
  projections: Array<{ name: string; caption: string }>;
  ribbonConfiguration: Record<string, Record<string, unknown>>;
  ribbonVisualization: Record<string, Record<string, unknown>>;
  ribbonStatus: string;
  hoveredControlId: string | null;
  hoverStack: string[];
  publishStatus: 'Draft' | 'Published' | 'Archived';
  data?: Record<string, unknown>;
  focusOn?: unknown;
  canvasClickDisabled?: boolean;
  resolution: 'desktop' | 'tablet' | 'mobile'; // TODO: use enum
}

// Combined root state interface that includes both session and screenLayout
export interface RootState extends DefaultRootState {
  session: SessionState;
  screenLayout: ScreenLayoutState;
}
