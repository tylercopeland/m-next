import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase } from '@m-next/utilities';
import { getGatewayUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const appsApi = createApi({
  reducerPath: 'appsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGatewayUrl()}apps/`,
    prepareHeaders: (headers, { getState }) => {
      const { tokenV2 } = getState().session;

      // If we have a token set in state, let's assume that we should be passing it.
      //  if (tokenv2) {
      headers.set('Authorization', `Bearer ${tokenV2}`);
      //  }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getApps: builder.query({
      query: (model) => `app/${model.accountName}`,
      transformResponse: (response) => {
        const transformed = response.map((item) => ({
          id: item.appId,
          caption: item.caption,
          viewFriendlyName: item.viewFriendlyName,
        }));

        transformed.sort((a, b) => {
          if (a.caption < b.caption) {
            return -1;
          }
          if (a.caption > b.caption) {
            return 1;
          }
          return 0;
        });

        return transformed;
      },
    }),
    getApp: builder.query({
      query: (model) => `app/${model.accountName}/${model.appId}`,
      transformResponse: (response) => toCamelCase(response),
    }),
    getScreens: builder.query({
      query: (model) => `screen/${model.accountName}`,
      transformResponse: (response) => {
        const transformed = response
          .filter((item) => !item.isScreenlet && !item.name.startsWith('Panel -'))
          .map((item) => ({
            id: item.id,
            caption: item.name,
            viewFriendlyName: item.viewFriendlyName,
            appId: item.appId,
          }));

        transformed.sort((a, b) => {
          if (a.caption < b.caption) {
            return -1;
          }
          if (a.caption > b.caption) {
            return 1;
          }
          return 0;
        });

        return transformed;
      },
    }),
    copyScreen: builder.mutation({
      query(model) {
        const { account, body } = model;
        return {
          url: `copy/${account}/appscreen`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (response) => toCamelCase(response),

      invalidatesTags: ['screen'],
    }),
    copyScreenVersion: builder.mutation({
      query(model) {
        const { account, body } = model;
        return {
          url: `copy/${account}/appscreenversion`,
          method: 'POST',
          body,
        };
      },
      transformResponse: (response) => toCamelCase(response),

      invalidatesTags: ['screen'],
    }),
    getSpecDocs: builder.query({
      query: (model) => `app/${model.accountName}/spec`,
      transformResponse: (response) => toCamelCase(response),

      invalidatesTags: ['spec-docs'],
    }),
    getSpecDoc: builder.query({
      query: (model) => `app/${model.accountName}/spec/${model.appId}`,
      transformResponse: (response) => toCamelCase(response),

      invalidatesTags: ['spec-docs'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAppsQuery,
  useGetAppQuery,
  useGetScreensQuery,
  useCopyScreenMutation,
  useCopyScreenVersionMutation,
  useGetSpecDocsQuery,
  useGetSpecDocQuery,
} = appsApi;
