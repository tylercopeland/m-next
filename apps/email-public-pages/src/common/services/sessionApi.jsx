import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: window.location.origin,
  }),
  endpoints: (builder) => ({
    refreshSession: builder.query({
      query: () => `/apps/api/system/RefreshSession`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRefreshSessionQuery } = sessionApi;
