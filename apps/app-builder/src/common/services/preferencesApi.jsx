import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase } from '@m-next/utilities';
import { getGatewayUrl } from './urlServce';

// preferences/v3/User?accountId=35623&userId=1
// Define a service using a base URL and expected endpoints
export const preferencesApi = createApi({
  reducerPath: 'preferencesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGatewayUrl()}preferences/`,
    prepareHeaders: (headers, { getState }) => {
      const { tokenV2, accountId } = getState().session;

      // If we have a token set in state, let's assume that we should be passing it.
      //  if (tokenv2) {
      headers.set('Authorization', `Bearer ${tokenV2}`);
      headers.set('Account', accountId);
      //  }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserPreferences: builder.query({
      query: (model) => `v3/User?accountId=${model.accountId}&userId=${model.userId}`,

      transformResponse: (response) => {
        const transformed = {};
        response?.forEach((item) => {
          const camelCase = item.Category.charAt(0).toLowerCase() + item.Category.slice(1);
          if (!transformed[camelCase]) {
            transformed[camelCase] = {};
          }
          const camelCaseName = item.Name.charAt(0).toLowerCase() + item.Name.slice(1);

          if (
            (camelCaseName === 'shortDateFormat' ||
              camelCaseName === 'longDateFormat' ||
              camelCaseName === 'timeFormat') &&
            item.Value
          ) {
            transformed[camelCase][camelCaseName] = item.Value.replaceAll('d', 'E')
              .replaceAll('D', 'd')
              .replaceAll('Y', 'y')
              .replaceAll('A', 'a');
          } else {
            transformed[camelCase][camelCaseName] = item.Value;
          }
        });
        return transformed;
      },
    }),

    getUserFeatureFlags: builder.query({
      query: (model) => `v3/User/FeatureFlags?accountId=${model.accountId}&userId=${model.userId}`,

      transformResponse: (response) => toCamelCase(response),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserPreferencesQuery, useGetUserFeatureFlagsQuery } = preferencesApi;
