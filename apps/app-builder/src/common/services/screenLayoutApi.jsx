import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getDesignerUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const screenLayoutApi = createApi({
  reducerPath: 'screenLayoutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getDesignerUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenRTC } = getState().session;
      headers.set('Authorization', `Bearer ${tokenRTC}`);
      return headers;
    },
  }),
  tagTypes: ['screen', 'ribbons'],
  endpoints: (builder) => ({
    getScreenLayout: builder.query({
      query: (model) => `api/v1/layout/${model.appId}/${model.screenId}/${model.versionId}`,
      providesTags: (result) => (result ? [{ type: 'screen', id: result.versionId }, 'screen'] : ['screen']),
      transformResponse: (response) => {
        const controls = {};
        const transformed = response;

        // Helper function to convert object keys to camelCase (non-recursive for safety)
        const convertKeyToCamelCase = (key) => key.charAt(0).toLowerCase() + key.slice(1);

        // Helper function to convert nested object keys (used for specific properties like defaultValue)
        const convertNestedToCamelCase = (obj) => {
          if (obj === null || obj === undefined) return obj;
          if (Array.isArray(obj)) {
            return obj.map(convertNestedToCamelCase);
          }
          if (typeof obj === 'object') {
            const converted = {};
            Object.keys(obj).forEach((key) => {
              converted[convertKeyToCamelCase(key)] = convertNestedToCamelCase(obj[key]);
            });
            return converted;
          }
          return obj;
        };

        Object.keys(response?.controls).forEach((key) => {
          const item = response.controls[key];
          const cleaned = {};
          Object.keys(item).forEach((element) => {
            const camelCase = convertKeyToCamelCase(element);
            // Only recursively convert specific nested properties that need it
            if (camelCase === 'defaultValue' || camelCase === 'styles') {
              cleaned[camelCase] = convertNestedToCamelCase(item[element]);
            } else {
              cleaned[camelCase] = item[element];
            }
          });

          // // For LayoutContainer controls (L-CON), map enableCompaction to staticLayout (inverted semantics)
          // // enableCompaction: true = items compact together (not static)
          // // staticLayout: true = items stay where placed (no compaction)
          // // Default to staticLayout: true if enableCompaction is undefined
          // if (cleaned.type === 'L-CON') {
          //   cleaned.staticLayout = !cleaned.enableCompaction;
          // }

          controls[key] = cleaned;
        });

        transformed.controls = controls;

        // V4 LAYOUT API: Transform layoutV4 from PascalCase to camelCase
        if (response?.layoutV4) {
          const convertToCamelCase = (obj) => {
            if (Array.isArray(obj)) {
              return obj.map(convertToCamelCase);
            }
            if (obj && typeof obj === 'object') {
              const converted = {};
              Object.keys(obj).forEach((key) => {
                const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
                converted[camelKey] = convertToCamelCase(obj[key]);
              });
              return converted;
            }
            return obj;
          };

          transformed.layoutV4 = convertToCamelCase(response.layoutV4);
        }

        // Map backend EnableCompaction to frontend staticLayout (inverted semantics)
        // EnableCompaction: true = items compact together (not static)
        // staticLayout: true = items stay where placed (no compaction)
        // When enableCompaction is undefined/null, default to staticLayout: true
        transformed.staticLayout = !response.enableCompaction;
        transformed.specDocId = response.specDocId;

        return transformed;
      },
    }),
    updateScreenLayout: builder.mutation({
      query(model) {
        const { appId, body } = model;
        return {
          url: `api/v1/layout/${appId}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['screen'],
    }),
    duplicateRibbon: builder.mutation({
      query(model) {
        const { appId, screenId, ribbonId } = model;
        return {
          url: `api/v1/ribbon/${appId}/${screenId}/${ribbonId}`,
          method: 'POST',
        };
      },
      invalidatesTags: ['ribbons'],
    }),
    deleteRibbon: builder.mutation({
      query(model) {
        const { appId, screenId, ribbonId } = model;
        return {
          url: `api/v1/ribbon/${appId}/${screenId}/${ribbonId}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['ribbons'],
    }),
    setDraft: builder.mutation({
      query(model) {
        const { appId, screenId, versionId } = model;
        return {
          url: `/api/v1/Designer/${appId}/${screenId}/${versionId}/setDraft`,
          method: 'POST',
        };
      },
      invalidatesTags: ['screen'],
    }),
    getScreenData: builder.query({
      query: (model) => ({
        url: `api/v1/Designer/${model.appId}/${model.screenId}/${model.versionId}`,
        headers: {
          Accept: '*/*',
        },
      }),
    }),
    getDesignerPayload: builder.query({
      query: (model) => ({
        url: `api/v1/Designer/${model.appId}/${model.screenId}/${model.versionId}`,
        headers: {
          Accept: '*/*',
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetScreenLayoutQuery,
  useUpdateScreenLayoutMutation,
  useDeleteRibbonMutation,
  useDuplicateRibbonMutation,
  useSetDraftMutation,
  useGetScreenDataQuery,
  useGetDesignerPayloadQuery,
} = screenLayoutApi;
