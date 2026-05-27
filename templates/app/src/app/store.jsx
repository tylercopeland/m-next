import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import sessionReducer from '../common/services/sessionSlice';
import { sessionApi } from '../common/services/sessionApi';

export const store = configureStore({
  reducer: {
    [sessionApi.reducerPath]: sessionApi.reducer,

    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionApi.middleware),
});

setupListeners(store.dispatch);

export default store;
