import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getRuntimeUrl } from './urlServce';
// Define a service using a base URL and expected endpoints

let session = null;
try {
  session = JSON.parse(localStorage.getItem('userSession'));
} catch {
  /* empty */
}

export const runtimeApi = createApi({
  reducerPath: 'runtimeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getRuntimeUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenRTC } = getState().session;

      // If we have a token set in state, let's assume that we should be passing it.
      //  if (tokenv2) {
      headers.set('Authorization', `Bearer ${tokenRTC}`);
      //  }
      return headers;
    },
  }),
  tagTypes: ['screen', 'ribbons'],
  endpoints: (builder) => ({
    getData: builder.query({
      query: (model) => {
        if (!model.isV4Control) {
          return `api/v1/data/legacy/${model.dataModelId}/${model.screenId}/${model.activeRecordId}${
            model.joinKey ? `?joinKey=${model.joinKey}` : ''
          }`;
        }
        if (model.screenId && model.activeRecordId)
          return `api/v1/data/${model.dataModelId}/${model.screenId}/${model.activeRecordId}${
            model.joinKey ? `?joinKey=${model.joinKey}` : ''
          }`;
        if (model.screenId)
          return `api/v1/data/${model.dataModelId}/${model.screenId}${
            model.joinKey ? `?joinKey=${model.joinKey}` : ''
          }`;
        return `api/v1/data/${model.dataModelId}`;
      },
    }),
    getRibbons: builder.query({
      query: (model) => `api/v1/AppRibbon/${model.screenId}/${model.activeRecordId}`,
      providesTags: ['ribbons'],
    }),
    // this is where we load grid data in appbuilder
    getDataLegacy: builder.query({
      query: (model) =>
        `api/v1/data/legacy/${model.dataModelId}/${model.screenId}/${model.activeRecordId}${
          model.joinKey ? `?joinKey=${model.joinKey}` : ''
        }`,
    }),
    getDropdownDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v2/dropdown/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getGridDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v1/datatable/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getTotalGridRecordsLegacy: builder.mutation({
      query: (model) => ({
        url: `api/v1/datatable/total/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getChipsDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v1/datatable/chips/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getChartDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v1/chart/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getReadOnlyGridDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v1/grid/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getGalleryDataLegacy: builder.query({
      query: (model) => ({
        url: `api/v1/gallery/${model.screenId}${model.activeRecordId ? `/${model.activeRecordId}` : ''}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    getCalendarData: builder.query({
      query: (model) => ({
        url: `api/v2/calendar/${model.screenId}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    postAnalytics: builder.mutation({
      query: (model) => ({
        url: `api/v1/analytics/${model.name}/AppBuilder/${session ? session.id : ''}/${model.screenId}`,
        method: 'POST',
        body: model.body,
      }),
    }),
    validateFormula: builder.mutation({
      query: (model) => {
        const { body } = model;

        return {
          url: `api/v1/formula`,
          method: 'POST',
          body,
        };
      },
    }),
    getSharedUsers: builder.query({
      query: () => `api/v1/security/sharedusers`,
    }),
    uploadFiles: builder.mutation({
      query(files) {
        // Browser API, so can be ignored by eslint
        // eslint-disable-next-line no-undef
        const formData = new FormData();

        if (Array.isArray(files)) {
          files.forEach((file) => {
            formData.append('file', file);
          });
        } else {
          formData.append('file', files);
        }

        return {
          url: 'api/v1/documents/simple',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDataQuery,
  useGetDataLegacyQuery,
  useGetRibbonsQuery,
  useGetChartDataLegacyQuery,
  useGetGridDataLegacyQuery,
  useGetChipsDataLegacyQuery,
  useGetTotalGridRecordsLegacyMutation,
  useGetReadOnlyGridDataLegacyQuery,
  usePostAnalyticsMutation,
  useValidateFormulaMutation,
  useGetDropdownDataLegacyQuery,
  useLazyGetDropdownDataLegacyQuery,
  useGetGalleryDataLegacyQuery,
  useGetCalendarDataQuery,
  useGetSharedUsersQuery,
  useUploadFilesMutation,
} = runtimeApi;
