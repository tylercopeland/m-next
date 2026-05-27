import { createSlice } from '@reduxjs/toolkit';
import {
  actionUpdated,
  controlUpdated,
  loadNewScreen,
  ribbonUpdated,
  ribbonVisualizationUpdated,
  saveScreen,
  screenLoaded,
  screenPropertiesUpdated,
  screenSaved,
  startScreenCopy,
} from './screenLayoutSlice';
import { sessionRefeshed } from './sessionSlice';

export const appStates = {
  uninitialized: 'uninitialized',
  idle: 'idle',
  ready: 'ready',
  editing: 'editing',
  saving: 'saving',
  error: 'error',
  loading: 'loading',
};
const initialState = {
  status: appStates.uninitialized,
  appName: null,
  screenName: null,
  versionNumber: null,
  accountingType: null,
  publishStatus: null,
  isReadOnly: null,
  appId: null,
  screenId: null,
  versionId: null,
  specDocId: null,
  isBuildingApp: false,

  dataModels: [],
  defaultScreen: null,
  description: null,
  creatorName: null,
  iconFileName: null,
  newScreen: null,
  projections: [],
  screens: [],
  updatedDate: null,
  userPreferenceScreen: null,
  viewScreen: null,
  listScreen: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appLoaded(state, action) {
      state.status = appStates.ready;
      state.appId = action.payload.appId;
      state.appName = action.payload.caption;
      state.dataModels = action.payload.dataModels;
      state.defaultScreen = action.payload.defaultScreen;
      state.description = action.payload.description;
      state.creatorName = action.payload.creatorName;
      state.iconFileName = action.payload.iconFileName;
      state.newScreen = action.payload.newScreen;
      state.projections = action.payload.projections;
      state.screens = action.payload.screens;
      state.updatedDate = action.payload.updatedDate;
      state.userPreferenceScreen = action.payload.userPreferenceScreen;
      state.viewScreen = action.payload.viewScreen;
      state.listScreen = action.payload.listScreen;
    },
    appNameUpdated(state, action) {
      state.appName = action.payload;
    },
    specDocIdUpdated(state, action) {
      state.specDocId = action.payload;
    },
    appIdUpdated(state, action) {
      state.appId = action.payload;
    },
    buildAppStarted(state) {
      state.isBuildingApp = true;
    },
    buildAppCompleted(state) {
      state.isBuildingApp = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(screenLoaded, (state, action) => {
      state.status = appStates.ready;
      state.appId = action.payload.appId;
      state.screenId = action.payload.screenId;
      state.versionId = action.payload.versionId;
      state.appName = action.payload.appName;
      state.screenName = action.payload.screenName;
      state.versionNumber = action.payload.versionNumber;
      state.accountingType = action.payload.accountingType;
      state.publishStatus = action.payload.publishStatus;
      state.isReadOnly = action.payload.isReadOnly;
      state.specDocId = action.payload.specDocId;
    });

    builder.addCase(controlUpdated, (state) => {
      if (state.publishStatus === 'Draft') {
        state.status = appStates.editing;
      }
    });
    builder.addCase(screenPropertiesUpdated, (state) => {
      if (state.publishStatus === 'Draft') {
        state.status = appStates.editing;
      }
    });
    builder.addCase(actionUpdated, (state) => {
      if (state.publishStatus === 'Draft') {
        state.status = appStates.editing;
      }
    });
    builder.addCase(ribbonUpdated, (state) => {
      if (state.publishStatus === 'Draft') {
        state.status = appStates.editing;
      }
    });
    builder.addCase(ribbonVisualizationUpdated, (state) => {
      if (state.publishStatus === 'Draft') {
        state.status = appStates.editing;
      }
    });
    builder.addCase(saveScreen, (state) => {
      state.status = appStates.saving;
    });
    builder.addCase(screenSaved, (state) => {
      state.status = appStates.ready;
    });
    builder.addCase(sessionRefeshed, (state) => {
      if (state.status === appStates.uninitialized) {
        state.status = appStates.idle;
      }
    });
    builder.addCase(loadNewScreen, (state) => {
      state.status = appStates.idle;
    });
    builder.addCase(startScreenCopy, (state) => {
      state.status = appStates.loading;
    });
  },
});

export const { appLoaded, appNameUpdated, specDocIdUpdated, appIdUpdated, buildAppStarted, buildAppCompleted } =
  appSlice.actions;

export const selectAppId = (state) => state.app.appId;
export const selectScreenId = (state) => state.app.screenId;
export const selectVersionId = (state) => state.app.versionId;
export const selectAppName = (state) => state.app.appName;
export const selectScreenName = (state) => state.app.screenName;
export const selectVersionNumber = (state) => state.app.versionNumber;
export const selectAccountingType = (state) => state.app.accountingType;
export const selectStatus = (state) => state.app.status;
export const selectPublishStatus = (state) => state.app.publishStatus;
export const selectSpecDocId = (state) => state.app.specDocId;
export const selectIsBuildingApp = (state) => state.app.isBuildingApp;

export const selectIsReadOnly = (state) => state.app.isReadOnly;

export const selectDefaultScreen = (state) => state.app.defaultScreen;
export const selectViewScreen = (state) => state.app.viewScreen;
export const selectListScreen = (state) => state.app.listScreen;
export const selectNewScreen = (state) => state.app.newScreen;
export const selectScreens = (state) => state.app.screens;

export default appSlice.reducer;
