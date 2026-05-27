import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGatewayUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGatewayUrl()}tags/`,
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
    getTagSuggestions: builder.query({
      query: (model) => `management/${model.accountName}/suggestions`,
      transformResponse: (response) => {
        const transformed = {};
        const computedOthers =
          response?.others && Array.isArray(response.others)
            ? response.others.map((item) => ({
                colour: item.Colour,
                name: item.Name,
              }))
            : [];
        if (response) {
          transformed.suggestions = response.suggestions;
          transformed.others = computedOthers;
        }
        return transformed;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTagSuggestionsQuery } = tagsApi;
