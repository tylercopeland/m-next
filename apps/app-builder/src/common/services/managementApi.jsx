import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase } from '@m-next/utilities';
import { getDesignerUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getDesignerUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenRTC } = getState().session;

      // If we have a token set in state, let's assume that we should be passing it.
      //  if (tokenv2) {
      headers.set('Authorization', `Bearer ${tokenRTC}`);
      //  }
      return headers;
    },
  }),
  tagTypes: ['Screens'],
  endpoints: (builder) => ({
    getV4Apps: builder.query({
      query: () => `api/v1/management/apps`,
      transformResponse: (response) => toCamelCase(response),
    }),
    getAppScreens: builder.query({
      query: (model) => `api/v1/management/screens/${model.appId}`,
      transformResponse: (response) => toCamelCase(response),
      providesTags: ['Screens'],
    }),

    createApp: builder.mutation({
      query(model) {
        const { body } = model;
        return {
          url: `api/v1/management/create`,
          method: 'POST',
          contentType: 'application/json',
          body,
        };
      },
      transformResponse: (response) => toCamelCase(response),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetV4AppsQuery, useGetAppScreensQuery, useCreateAppMutation } = managementApi;
