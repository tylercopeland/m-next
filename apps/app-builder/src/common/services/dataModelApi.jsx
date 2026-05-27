import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toCamelCase } from '@m-next/utilities';
import { getDesignerUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const dataModelApi = createApi({
  reducerPath: 'dataModelApi',
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
    getDataModelList: builder.query({
      query: () => `api/v1/dataModel`,
      transformResponse: (response) => {
        const transformed = toCamelCase(response);
        return transformed;
      },
    }),
    getDataModel: builder.query({
      query: (model) => `api/v1/dataModel/${model.dataModelId}`,
      transformResponse: (response) => {
        const transformed = toCamelCase(response);
        return transformed;
      },
    }),
    updateDataModel: builder.mutation({
      query(model) {
        const { body } = model;
        return {
          url: `api/v1/dataModel`,
          method: 'PUT',
          body,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDataModelListQuery, useGetDataModelQuery, useUpdateDataModelMutation } = dataModelApi;
