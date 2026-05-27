import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase } from '@m-next/utilities';
import { getDesignerUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const actionApi = createApi({
  reducerPath: 'actionApi',
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
  endpoints: (builder) => ({
    getAction: builder.query({
      query: (model) => `api/v1/action/${model.appId}/${model.screenId}/${model.versionId}/${model.id}`,
      transformResponse: (response) => toCamelCase(response),
    }),
    loadAction: builder.mutation({
      query: (model) => `api/v1/action/${model.appId}/${model.screenId}/${model.versionId}/${model.id}`,
      transformResponse: (response) => toCamelCase(response),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetActionQuery, useLoadActionMutation } = actionApi;
