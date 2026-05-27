import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGatewayUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGatewayUrl()}documents/`,
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
    getDocuments: builder.query({
      query(model) {
        const { activeRecordId, screenId, screenBaseModel } = model;
        return {
          url: `${model.accountName}`,
          method: 'POST',
          body: {
            viewName: screenBaseModel,
            encryptedRecordId: activeRecordId,
            screenId,
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDocumentsQuery } = documentsApi;
