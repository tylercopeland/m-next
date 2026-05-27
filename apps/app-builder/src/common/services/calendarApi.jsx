import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGatewayUrl } from './urlServce';

export const calendarApi = createApi({
  reducerPath: 'calendarApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getGatewayUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenV2 } = getState().session;

      if (tokenV2) {
        headers.set('Authorization', `Bearer ${tokenV2}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStatuses: builder.query({
      query: (model) => `calendar/preferences/${model.accountName}/statuses`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetStatusesQuery } = calendarApi;
