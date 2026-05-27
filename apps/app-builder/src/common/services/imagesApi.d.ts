import { Api } from '@reduxjs/toolkit/query/react';

interface ImageRequest {
  accountName: string;
  imageId?: string;
  category?: string;
}

interface ImageData {
  id: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  category?: string;
}

interface ImagesResponse {
  data: ImageData[];
  totalCount: number;
}

type ImagesEndpoints = 'getImages' | 'uploadImage' | 'deleteImage';

export declare const imagesApi: Api<import('@reduxjs/toolkit/query').BaseQueryFn, Record<string, unknown>, ImagesEndpoints, string>;

export declare const useGetImagesQuery: <T = ImagesResponse>(
  arg: ImageRequest
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  isFetching: boolean;
};

export declare const useUploadImageMutation: () => {
  mutate: (data: FormData) => Promise<ImageData>;
  isLoading: boolean;
};

export declare const useDeleteImageMutation: () => {
  mutate: (imageId: string) => Promise<void>;
  isLoading: boolean;
};
