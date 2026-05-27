/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
    },
    preferencesLoaded(state, action) {
      state.preferences = action.payload;
    },
  },
});

export const { sessionRefeshed, preferencesLoaded } = sessionSlice.actions;

export const selectAccountName = (state) => state.session.accountName;
export const selectAccountId = (state) => state.session.accountId;
export const selectUserId = (state) => state.session.userId;
export const selectIsDeveloper = (state) => state.session.isDeveloper;
export const selectDisplayPreferences = (state) => state.session.preferences?.display;

export default sessionSlice.reducer;
