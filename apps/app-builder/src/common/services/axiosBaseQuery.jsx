import axios from 'axios';

export const axiosBaseQuery =
  ({ baseUrl, prepareHeaders }) =>
  async ({ url, method, data, params, headers, onUploadProgress }, { getState }) => {
    const finalHeaders = prepareHeaders ? await prepareHeaders(headers || {}, { getState }) : headers;
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: finalHeaders,
        onUploadProgress,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
