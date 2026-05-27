import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDesignerUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const copilotApi = createApi({
  reducerPath: 'copilotApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getDesignerUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenRTC } = getState().session;
      headers.set('Authorization', `Bearer ${tokenRTC}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generateFormula: builder.mutation({
      query(model) {
        const { appId, screenId, versionId, body } = model;
        return {
          url: `api/v1/copilot/${appId}/${screenId}/${versionId}/formula`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGenerateFormulaMutation } = copilotApi;
