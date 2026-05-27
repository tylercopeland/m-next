import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { getRuntimeUrl } from './urlServce';

export const imagesApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: getRuntimeUrl(),
    prepareHeaders: (headers, { getState }) => {
      const { tokenRTC } = getState().session;
      headers['Authorization'] = `Bearer ${tokenRTC}`;
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query(model) {
        return {
          url: `api/v1/image?isImage=${model.isImage}&isBound=${model.isBound}`,
          method: 'POST',
          data: model.body,
          onUploadProgress: model.onUploadProgress,
        };
      },
    }),
    deleteImage: builder.mutation({
      query(model) {
        const { body } = model;
        return {
          url: 'api/v1/image',
          method: 'DELETE',
          body,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = imagesApi;
