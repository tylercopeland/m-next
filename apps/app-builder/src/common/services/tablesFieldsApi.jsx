import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGatewayUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const tablesFieldsApi = createApi({
  reducerPath: 'tablesFieldsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGatewayUrl()}tables-fields/`,
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
    getFieldsForTable: builder.query({
      query: (model) =>
        `field/${model.accountName}/GetFieldNamesWithRestriction?viewFriendlyName=${model.tableName}&showComplexFields=${model.complexFields}`,
      transformResponse: (response) => {
        const data = response && response.Data ? response.Data : []; // ?.filter((item) => !item.Key.includes('_RecordID'));
        const transformed = data.map((item) => {
          const field = item.Value;
          let caption = item.Key.replace(/([a-z])([A-Z])/g, '$1 $2') // .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase();
          caption = caption.charAt(0).toUpperCase() + caption.slice(1);

          let type = field.fldType;
          if (item.Key === 'TagList') {
            type = 'Tags';
          }

          return {
            name: item.Key,
            caption, // field.linkedViaField ? `${field.linkedViaField}.${item.Key}` : item.Key,
            type,
            size: Number(field.fieldSize) ?? null,
            isVisible: true,
            isRequired: field.isReq,
            isLinked: field.isLinked,
            sourceModel: field.linkedViaField || field.viewFriendlyName,
            sourceField: field.columnNameRef,
          };
        });

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
    getTables: builder.query({
      query: (model) => `view/${model.accountName}/GetViews?page=1&rows=1000&tableType=Recent&IsSourceType=true`,
      transformResponse: (response) => {
        const transformed = response?.Data?.DataSource?.map((item) => {
          let caption = item.Name.replace(/([a-z])([A-Z])/g, '$1 $2') // .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase();
          caption = caption.charAt(0).toUpperCase() + caption.slice(1);

          return {
            name: item.Name,
            caption, // field.linkedViaField ? `${field.linkedViaField}.${item.Key}` : item.Key,
          };
        });

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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFieldsForTableQuery, useGetTablesQuery } = tablesFieldsApi;
