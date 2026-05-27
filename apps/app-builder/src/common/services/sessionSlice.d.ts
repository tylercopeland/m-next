import { PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
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
  preferences: {
    display?: Record<string, unknown>;
  } | null;
  isAdmin: boolean;
  isCustomizer: boolean;
  featureFlags: Record<string, unknown> | null;
  exportedFunctions: Record<string, unknown> | null;
  nocodeAssistantSessionId: string | null;
}

export interface SessionPayload {
  accountName?: string;
  accountFriendlyName?: string;
  accountId?: string;
  isDeveloper?: boolean;
  userName?: string;
  userEmail?: string;
  userId?: string;
  methodIdentity?: string;
  tokenV2?: string;
  tokenRTC?: string;
  isAdmin?: boolean;
  isCustomizer?: boolean;
  exportedFunctions?: Record<string, unknown>;
}

export declare const sessionRefeshed: {
  type: string;
  payload: SessionPayload;
};

export declare const preferencesLoaded: {
  type: string;
  payload: Record<string, unknown>;
};

export declare const featureFlagsLoaded: {
  type: string;
  payload: Record<string, unknown>;
};

export declare const nocodeAssistantSessionSet: {
  type: string;
  payload: string;
};

export declare const selectAccountName: (state: { session: SessionState }) => string | null;
export declare const selectAccountId: (state: { session: SessionState }) => string | null;
export declare const selectUserId: (state: { session: SessionState }) => string | null;
export declare const selectIsDeveloper: (state: { session: SessionState }) => boolean | null;
export declare const selectDisplayPreferences: (state: { session: SessionState }) => Record<string, unknown> | undefined;
export declare const selectCanCustomizer: (state: { session: SessionState }) => boolean;
export declare const selectFeatureFlags: (state: { session: SessionState }) => Record<string, boolean>;
export declare const selectAreFeatureFlagsLoaded: (state: { session: SessionState }) => boolean;
export declare const selectMethodIdentity: (state: { session: SessionState }) => string | null;
export declare const selectTokenRTC: (state: { session: SessionState }) => string | null;
export declare const selectExportedFunctions: (state: { session: SessionState }) => Record<string, unknown> | null;
export declare const selectTokenV2: (state: { session: SessionState }) => string | null;
export declare const selectNocodeAssistantSessionId: (state: { session: SessionState }) => string | null;
export declare const selectAuthContext: () => { account?: string; authToken?: string; identity?: string; runtimeCoreUrl?: string; secureToken?: string;};
declare const sessionSliceReducer: (state: SessionState | undefined, action: PayloadAction<unknown>) => SessionState;
export default sessionSliceReducer;
