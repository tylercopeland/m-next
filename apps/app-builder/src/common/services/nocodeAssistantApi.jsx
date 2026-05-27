import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getNodeCodeAssistantUrl } from './urlServce';

// Define a service using a base URL and expected endpoints
export const nocodeAssistantApi = createApi({
  reducerPath: 'nocodeAssistantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getNodeCodeAssistantUrl(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    startSession: builder.mutation({
      query: ({ accountName, v2Token, rtcToken }) => ({
        url: '/session/start',
        method: 'POST',
        body: { accountName, v2Token, rtcToken },
      }),
    }),
    validateSession: builder.query({
      query: ({ sessionId, accountName, rtcToken }) => ({
        url: '/session/validate',
        method: 'GET',
        params: { sessionId, accountName, rtcToken },
      }),
    }),
    refreshSession: builder.mutation({
      query: ({ sessionId, accountName, v2Token, rtcToken }) => ({
        url: '/session/refresh',
        method: 'POST',
        body: { sessionId, accountName, v2Token, rtcToken },
      }),
    }),
    loadSession: builder.query({
      query: ({ sessionId, accountName, v2Token, rtcToken }) => ({
        url: `/session/conversations/${sessionId}`,
        method: 'GET',
        params: { sessionId, accountName, v2Token, rtcToken },
      }),
    }),
    sendChatMessage: builder.mutation({
      query: (model) => {
        const { message, attachments, conversationHistory, session, metadata } = model;
        return {
          url: '/chat',
          method: 'POST',
          body: {
            message,
            ...(attachments && { attachments }),
            session: {
              sessionId: session.sessionId,
              accountName: session.accountName,
            },
            ...(metadata && { metadata }),
            conversationHistory: conversationHistory || [],
          },
        };
      },
    }),
    stopChatRequest: builder.mutation({
      query: ({ session }) => ({
        url: '/chat/abort',
        method: 'POST',
        body: {
          session: {
            sessionId: session.sessionId,
            accountName: session.accountName,
          },
        },
      }),
    }),
    getSpecDocument: builder.query({
      query: ({ docId, sessionId, accountName }) => ({
        url: `/spec-doc/${docId}`,
        method: 'GET',
        params: { sessionId, accountName },
      }),
    }),
    buildApp: builder.mutation({
      query: ({ specDocId, session }) => ({
        url: '/build',
        method: 'POST',
        body: {
          specDocId,
          session,
        },
      }),
    }),
    buildScreen: builder.mutation({
      query: ({ viewName, screenIntent, appId, screenId, versionId, metadata, session }) => ({
        url: '/build-screen',
        method: 'POST',
        body: {
          viewName,
          screenIntent,
          ...(appId && { appId }),
          ...(screenId && { screenId }),
          ...(versionId && { versionId }),
          ...(metadata && { metadata }),
          session,
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useStartSessionMutation,
  useValidateSessionQuery,
  useRefreshSessionMutation,
  useSendChatMessageMutation,
  useLoadSessionQuery,
  useGetSpecDocumentQuery,
  useStopChatRequestMutation,
  useBuildAppMutation,
  useBuildScreenMutation,
} = nocodeAssistantApi;
