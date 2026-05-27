import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getRuntimeUrl } from './urlServce';

const initialState = {
  accountName: null,
  accountFriendlyName: null,
  accountId: null,
  isDeveloper: null,
  userName: null,
  userId: null,
  methodIdentity: null,
  userEmail: null,
  tokenV2: null,
  tokenRTC: null,
  preferences: null,
  isAdmin: false,
  isCustomizer: false,
  featureFlags: null,
  exportedFunctions: null,
  nocodeAssistantSessionId: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionRefeshed(state, action) {
      state.accountName = action.payload.accountName;
      state.accountFriendlyName = action.payload.accountFriendlyName;
      state.accountId = action.payload.accountId;
      state.isDeveloper = action.payload.isDeveloper;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.userId = action.payload.userId;
      state.methodIdentity = action.payload.methodIdentity;
      state.tokenV2 = action.payload.tokenV2;
      state.tokenRTC = action.payload.tokenRTC;
      state.isAdmin = action.payload.isAdmin;
      state.isCustomizer = action.payload.isCustomizer;
      state.exportedFunctions = action.payload.exportedFunctions || null;
    },
    preferencesLoaded(state, action) {
      state.preferences = action.payload;
    },
    featureFlagsLoaded(state, action) {
      state.featureFlags = action.payload;
    },
    nocodeAssistantSessionSet(state, action) {
      state.nocodeAssistantSessionId = action.payload;
    },
  },
});

export const { sessionRefeshed, preferencesLoaded, featureFlagsLoaded, nocodeAssistantSessionSet } =
  sessionSlice.actions;

export const selectAccountName = (state) => state.session.accountName;
export const selectAccountId = (state) => state.session.accountId;
export const selectUserId = (state) => state.session.userId;
export const selectIsDeveloper = (state) => state.session.isDeveloper;
export const selectDisplayPreferences = (state) => state.session.preferences?.display;
export const selectCanCustomizer = (state) => state.session.isAdmin || state.session.isCustomizer;
export const selectFeatureFlags = (state) => state.session.featureFlags || {};
export const selectAreFeatureFlagsLoaded = (state) => state.session.featureFlags !== null;
export const selectMethodIdentity = (state) => state.session.methodIdentity;
export const selectTokenRTC = (state) => state.session.tokenRTC;
export const selectExportedFunctions = (state) => state.session.exportedFunctions;
export const selectTokenV2 = (state) => state.session.tokenV2;
export const selectNocodeAssistantSessionId = (state) => state.session.nocodeAssistantSessionId;
export const selectUserName = (state) => state.session.userName;

export const selectAuthContext = createSelector(
  [selectAccountName, selectMethodIdentity, selectTokenRTC],
  (accountName, methodIdentity, tokenRTC) => {
    const runtimeUrl = getRuntimeUrl();
    return {
      account: accountName || '',
      identity: methodIdentity || '',
      authToken: tokenRTC || '',
      runtimeCoreUrl: runtimeUrl,
      secureToken: accountName && methodIdentity && tokenRTC ? `${accountName}:${methodIdentity}:${tokenRTC}` : '',
    };
  },
);

export default sessionSlice.reducer;
