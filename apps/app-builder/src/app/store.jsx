import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import sessionReducer from '../common/services/sessionSlice';
import appReducer from '../common/services/appSlice';
import { tablesFieldsApi } from '../common/services/tablesFieldsApi';
import { runtimeApi } from '../common/services/runtimeApi';
import { screenLayoutApi } from '../common/services/screenLayoutApi';
import { sessionApi } from '../common/services/sessionApi';
import { preferencesApi } from '../common/services/preferencesApi';
import { tagsApi } from '../common/services/tagsApi';
import { documentsApi } from '../common/services/documentsApi';
import { imagesApi } from '../common/services/imagesApi';
import { calendarApi } from '../common/services/calendarApi';

import screenLayoutSlice from '../common/services/screenLayoutSlice';
import { appsApi } from '../common/services/appsApi';
import { actionApi } from '../common/services/actionApi';
import { dataModelApi } from '../common/services/dataModelApi';
import { managementApi } from '../common/services/managementApi';
import dataSlice from '../common/services/dataSlice';
import { copilotApi } from '../common/services/copilotApi';
import { nocodeAssistantApi } from '../common/services/nocodeAssistantApi';

export const store = configureStore({
  reducer: {
    [tablesFieldsApi.reducerPath]: tablesFieldsApi.reducer,
    [runtimeApi.reducerPath]: runtimeApi.reducer,
    [screenLayoutApi.reducerPath]: screenLayoutApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [preferencesApi.reducerPath]: preferencesApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [appsApi.reducerPath]: appsApi.reducer,
    [actionApi.reducerPath]: actionApi.reducer,
    [dataModelApi.reducerPath]: dataModelApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [copilotApi.reducerPath]: copilotApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
    [nocodeAssistantApi.reducerPath]: nocodeAssistantApi.reducer,

    session: sessionReducer,
    app: appReducer,
    screenLayout: screenLayoutSlice,
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { warnAfter: 128 }, // default 32ms causes unit test issues
      immutableCheck: { warnAfter: 128 }, // default 32ms causes unit test issues
    })
      .concat(tablesFieldsApi.middleware)
      .concat(runtimeApi.middleware)
      .concat(screenLayoutApi.middleware)
      .concat(sessionApi.middleware)
      .concat(preferencesApi.middleware)
      .concat(tagsApi.middleware)
      .concat(appsApi.middleware)
      .concat(actionApi.middleware)
      .concat(dataModelApi.middleware)
      .concat(managementApi.middleware)
      .concat(copilotApi.middleware)
      .concat(documentsApi.middleware)
      .concat(imagesApi.middleware)
      .concat(calendarApi.middleware)
      .concat(nocodeAssistantApi.middleware),
});

setupListeners(store.dispatch);
