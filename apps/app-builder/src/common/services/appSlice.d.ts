import { PayloadAction } from '@reduxjs/toolkit';

export declare const appStates: {
  uninitialized: 'uninitialized';
  idle: 'idle';
  ready: 'ready';
  editing: 'editing';
  saving: 'saving';
  error: 'error';
  loading: 'loading';
};

export interface AppState {
  status: string;
  appName: string | null;
  screenName: string | null;
  versionNumber: string | null;
  accountingType: string | null;
  publishStatus: string | null;
  isReadOnly: boolean | null;
  appId: string | null;
  screenId: string | null;
  versionId: string | null;
  specDocId: string | null;
  isBuildingApp: boolean;
  dataModels: unknown[];
  defaultScreen: string | null;
  description: string | null;
  creatorName: string | null;
  iconFileName: string | null;
  newScreen: string | null;
  projections: unknown[];
  screens: unknown[];
  updatedDate: string | null;
  userPreferenceScreen: string | null;
  viewScreen: string | null;
  listScreen: string | null;
}

export interface AppLoadedPayload {
  appId: string;
  caption: string;
  dataModels: unknown[];
  defaultScreen: string;
  description: string;
  creatorName: string;
  iconFileName: string;
  newScreen: string;
  projections: unknown[];
  screens: unknown[];
  updatedDate: string;
  userPreferenceScreen: string;
  viewScreen: string;
  listScreen: string;
}

export declare const appLoaded: (payload: AppLoadedPayload) => PayloadAction<AppLoadedPayload>;

export declare const appNameUpdated: (payload: string) => PayloadAction<string>;

export declare const specDocIdUpdated: (payload: string | null) => PayloadAction<string | null>;

export declare const appIdUpdated: (payload: string | null) => PayloadAction<string | null>;

export declare const buildAppStarted: () => PayloadAction<void>;

export declare const buildAppCompleted: () => PayloadAction<void>;

export declare const selectAppId: (state: { app: AppState }) => string | null;
export declare const selectScreenId: (state: { app: AppState }) => string | null;
export declare const selectVersionId: (state: { app: AppState }) => string | null;
export declare const selectAppName: (state: { app: AppState }) => string | null;
export declare const selectScreenName: (state: { app: AppState }) => string | null;
export declare const selectVersionNumber: (state: { app: AppState }) => string | null;
export declare const selectAccountingType: (state: { app: AppState }) => string | null;
export declare const selectStatus: (state: { app: AppState }) => string;
export declare const selectPublishStatus: (state: { app: AppState }) => string | null;
export declare const selectSpecDocId: (state: { app: AppState }) => string | null;
export declare const selectIsBuildingApp: (state: { app: AppState }) => boolean;
export declare const selectIsReadOnly: (state: { app: AppState }) => boolean | null;
export declare const selectDefaultScreen: (state: { app: AppState }) => string | null;
export declare const selectViewScreen: (state: { app: AppState }) => string | null;
export declare const selectListScreen: (state: { app: AppState }) => string | null;
export declare const selectNewScreen: (state: { app: AppState }) => string | null;

declare const appSliceReducer: (state: AppState | undefined, action: PayloadAction<unknown>) => AppState;
export default appSliceReducer;
