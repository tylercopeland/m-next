import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@m-next/container';
import { AiChatBox, TaskProgressItem } from '@m-next/ai-prompt';
import {
  createHumanMessage,
  createAssistantMessage,
  createTextContent,
  ChatMessage,
  FileAttachment,
  UserContext,
  SpecDocumentContent,
} from '@m-next/api-interface';
import {
  useSendChatMessageMutation,
  useLoadSessionQuery,
  useStopChatRequestMutation,
} from '../../common/services/nocodeAssistantApi';
import { useGetSpecDocQuery } from '../../common/services/appsApi';
import { useUploadFilesMutation } from '../../common/services/runtimeApi';
import { selectAccountName, selectAreFeatureFlagsLoaded, selectFeatureFlags, selectTokenV2, selectTokenRTC } from '../../common/services/sessionSlice';
import { appNameUpdated, specDocIdUpdated, appIdUpdated, selectAppId, selectSpecDocId } from '../../common/services/appSlice';
import { ChatPanelProps, DetailTab, BuildAppResponse, TableResult, FieldResult } from './types';
import useSpecDocumentStreaming from '../../common/hooks/useSpecDocumentStreaming';
import { useBuildApp } from '../../common/hooks/useBuildApp';
import { StreamingSpecDocument } from '../../common/streaming/specDocumentHandler';
import { SpecDocViewer } from './spec-document';
import { Toolbar } from '../../components/Toolbar';
import { pdf } from '@react-pdf/renderer';
import { SpecDocPDF } from './spec-document/SpecDocPdf';
import { filterOutArtifactsFromMessages, getLatestSpecDocInMessages } from './utils';
import Dialog from '@m-next/dialog';
import Button from '@m-next/button';

function ChatPanel({ sessionId: initialSessionId, specDocId: initialSpecDocId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const stopRequestedRef = useRef(false);
  const currentRequestIdRef = useRef<number>(0);
  const stoppedRequestIdsRef = useRef<Set<number>>(new Set());
  const snapshotRef = useRef<{
    messages: ChatMessage[] | null;
    specDoc: StreamingSpecDocument | null;
  } | null>(null);
  const [activeSpecDoc, setActiveSpecDoc] = useState<StreamingSpecDocument | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isSpecDocGenerating, setIsSpecDocGenerating] = useState(false);
  const [buildResults, setBuildResults] = useState<BuildAppResponse | null>(null);
  const [showBuildResultsModal, setShowBuildResultsModal] = useState(false);
  const [sendChatMessage] = useSendChatMessageMutation();
  const [stopChatRequest] = useStopChatRequestMutation();
  const [uploadFiles] = useUploadFilesMutation();
  const taskProgressInsertIndexRef = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('userRoles');
  const [selectedTab, setSelectedTab] = useState<'spec-doc' | 'files'>('spec-doc');
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [specDocIdToFetch, setSpecDocIdToFetch] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId);
  const serverSpecDocAppliedRef = useRef(false);
  const sessionProcessedRef = useRef(false);
  const dispatch = useDispatch();

  // If specDocId is provided via query params/props, fetch it immediately
  useEffect(() => {
    if (initialSpecDocId && !serverSpecDocAppliedRef.current) {
      console.log('[ChatPanel] Fetching spec document from query param:', initialSpecDocId);
      setSpecDocIdToFetch(initialSpecDocId);
    }
  }, [initialSpecDocId]);

  // Get session data for API calls
  const accountName = useSelector(selectAccountName);
  const tokenV2 = useSelector(selectTokenV2);
  const tokenRTC = useSelector(selectTokenRTC);
  const featureFlags = useSelector(selectFeatureFlags);
  const areFeatureFlagsLoaded = useSelector(selectAreFeatureFlagsLoaded);
  const isAppStudioBuildEnabled = !!(featureFlags && featureFlags.appStudioBuild);
  const appId = useSelector(selectAppId);
  const specDocId = useSelector(selectSpecDocId);

  // Derive the effective specDocId from either streaming or Redux
  const effectiveSpecDocId = activeSpecDoc?.metadata?.docId || specDocId;

  // Build app hook for shared build logic
  const { buildApp, isBuildingApp } = useBuildApp({
    sessionId: sessionId || '',
    specDocId: effectiveSpecDocId,
    onBuildComplete: (response, hasFailures) => {
      if (hasFailures) {
        // Show modal with error details for tables and fields build
        setBuildResults(response);
        setShowBuildResultsModal(true);
      } 
    },
  });

  // Wrapper setters that respect the ignoreStreamingUpdatesRef flag
  // This allows us to optimistically rollback state when stopping a request, and ignore any updates that might have streamed before the abort completed
  const controlledSetMessages = useCallback((msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    if (stopRequestedRef.current) return;
    setMessages(msgs);
  }, []);

  const controlledSetActiveSpecDoc = useCallback(
    (doc: StreamingSpecDocument | null | ((prev: StreamingSpecDocument | null) => StreamingSpecDocument | null)) => {
      if (stopRequestedRef.current) return;
      setActiveSpecDoc(doc);
    },
    [],
  );

  const controlledSetIsLoading = useCallback((loading: boolean | ((prev: boolean) => boolean)) => {
    if (stopRequestedRef.current) return;
    setIsLoading(loading);
  }, []);

  // Initialize spec document streaming with controlled setters (only when sessionId exists)
  useSpecDocumentStreaming(sessionId || '', controlledSetMessages, controlledSetActiveSpecDoc, controlledSetIsLoading);

  // Reset session tracking when session changes
  useEffect(() => {
    sessionProcessedRef.current = false;
    serverSpecDocAppliedRef.current = false;
  }, [sessionId]);

  // Update app name in Redux when spec document changes
  useEffect(() => {
    if (activeSpecDoc?.content?.appName) {
      dispatch(appNameUpdated(activeSpecDoc.content.appName));
    }
  }, [activeSpecDoc?.content?.appName, dispatch]);

  // Update specDocId in Redux when it changes (but not on initial mount with null)
  useEffect(() => {
    // Only dispatch if we have an activeSpecDoc (even if docId is null)
    // This prevents dispatching null on initial component mount
    if (activeSpecDoc?.metadata?.docId) {
      dispatch(specDocIdUpdated(activeSpecDoc.metadata?.docId || null));
    }
  }, [activeSpecDoc?.metadata?.docId, activeSpecDoc, dispatch]);

  // Only run loadSession query when we have a valid sessionId to avoid requests with null
  const { data: loadedSession, error: loadSessionError } = useLoadSessionQuery(
    { sessionId, accountName, v2Token: tokenV2, rtcToken: tokenRTC },
    { skip: !sessionId || !accountName || !tokenV2 || !tokenRTC },
  );

  // Fetch latest spec document from server when an appId is available
  const { data: fetchedSpecDoc, error: fetchSpecDocError } = useGetSpecDocQuery(
    { appId: specDocIdToFetch, accountName },
    { skip: !specDocIdToFetch || !accountName },
  );

  // Generate task progress from spec doc state
  const taskProgress = useMemo((): TaskProgressItem[] | undefined => {
    // Only show task progress if we have spec doc content
    if (!activeSpecDoc?.content) return undefined;

    const content = activeSpecDoc.content;
    const tasks: TaskProgressItem[] = [];

    tasks.push({
      id: 'user-roles',
      label: 'User roles',
      isCompleted: !!(content.userRoles && content.userRoles.length > 0),
    });

    tasks.push({
      id: 'workflows',
      label: 'Features',
      isCompleted: !!(content.keyWorkflows && content.keyWorkflows.length > 0),
    });

    tasks.push({
      id: 'data-entities',
      label: 'Data entities',
      isCompleted: !!(content.dataEntities && content.dataEntities.length > 0),
    });

    tasks.push({
      id: 'business-rules',
      label: 'Business rules',
      isCompleted: !!(content.businessRules && content.businessRules.length > 0),
    });

    tasks.push({
      id: 'screens',
      label: 'Screens',
      isCompleted: !!(content.screens && content.screens.length > 0),
    });

    return tasks;
  }, [activeSpecDoc]);

  // Determine task progress title based on completion status
  const taskProgressTitle = useMemo(() => {
    if (!taskProgress) return undefined;

    const allCompleted = taskProgress.every((task) => task.isCompleted);
    return allCompleted ? "Your app's plan" : 'Building plan...';
  }, [taskProgress]);

  // Used to save the insert index of task progress when it first appears, so it doesn't jump around with newer messages
  const taskProgressInsertIndex = useMemo(() => {
    if (!taskProgress) {
      taskProgressInsertIndexRef.current = null;
      return null;
    }

    // If we already have a position saved, use it
    if (taskProgressInsertIndexRef.current !== null) {
      return taskProgressInsertIndexRef.current;
    }

    // First time seeing task progress - save current position
    taskProgressInsertIndexRef.current = messages.length;
    return taskProgressInsertIndexRef.current;
  }, [messages.length, taskProgress]);

  useEffect(() => {
    if (loadSessionError) {
      console.error('Error loading session:', loadSessionError);
      return;
    }

    if (!loadedSession || sessionProcessedRef.current) return;

    sessionProcessedRef.current = true;
    setMessages([...loadedSession.messages]);

    if (loadedSession.status === 'complete') {
      setIsLoading(false);
      const specDoc = getLatestSpecDocInMessages(loadedSession.messages);
      if (specDoc) {
        // Only use message artifact as fallback if server version hasn't been applied yet
        if (!serverSpecDocAppliedRef.current) {
          setActiveSpecDoc(specDoc as StreamingSpecDocument);
        }
        // Trigger server fetch for the latest version
        const docId = (specDoc as StreamingSpecDocument).metadata?.docId;
        if (docId) {
          setSpecDocIdToFetch(docId);
        }
      }
    }
  }, [loadedSession, loadSessionError]);

  // Update activeSpecDoc when server returns the latest version — this always takes precedence
  useEffect(() => {
    if (fetchedSpecDoc) {
      serverSpecDocAppliedRef.current = true;
      setActiveSpecDoc({
        content: fetchedSpecDoc.content,
        versionId: fetchedSpecDoc._id,
        appId: fetchedSpecDoc.appId,
        metadata: {
          docId: fetchedSpecDoc._id,
          isInitialSchemaCreated: fetchedSpecDoc.metadata?.isInitialSchemaCreated,
          lastModified: fetchedSpecDoc.metadata?.updatedAt,
          createdAt: fetchedSpecDoc.metadata?.createdAt,
        },
      });

      setSessionId(fetchedSpecDoc.metadata?.sessionId || '');
      dispatch(appIdUpdated(fetchedSpecDoc.appId));

      setSpecDocIdToFetch(null);
    }
    if (fetchSpecDocError) {
      console.error('Error fetching latest spec document:', fetchSpecDocError);
      setSpecDocIdToFetch(null);
    }
  }, [fetchedSpecDoc, fetchSpecDocError, dispatch]);

  const uploadAttachments = async (attachments?: File[]): Promise<FileAttachment[]> => {
    if (!attachments || attachments.length === 0) return [];

    let uploadedFiles: FileAttachment[] = [];
    try {
      const uploadResponse = await uploadFiles(attachments).unwrap();
      // Extract file URLs from the response
      if (uploadResponse && Array.isArray(uploadResponse)) {
        // Edge case - Do not map local file info to response if there is a mismatch in count
        if (uploadResponse.length !== attachments.length) {
          console.error('Upload response count mismatch');
          return uploadResponse.map((file, index) => ({
            name: file.name || 'unknown',
            url: file.url,
            ...(file.size ? { size: file.size } : { size: attachments[index].size }),
          }));
        }

        uploadedFiles = uploadResponse.map((file, index) => ({
          name: attachments[index].name,
          url: file.url,
          size: attachments[index].size,
        }));
      }
    } catch (uploadError) {
      // TODO: Design needed to display upload errors to user
      console.error('Error uploading files:', uploadError);
    }

    return uploadedFiles;
  };

  const handleSendMessage = async (message: string, attachments?: File[], context?: UserContext) => {
    const tempUrls: string[] = [];
    let userMessage: ChatMessage;

    // Generate unique ID for this request
    currentRequestIdRef.current = currentRequestIdRef.current + 1;
    const requestId = currentRequestIdRef.current;
    
    try {
      // reset stop flag when starting a new request
      stopRequestedRef.current = false;
      // snapshot current chat/spec-doc state so we can revert if user aborts
      snapshotRef.current = { messages, specDoc: activeSpecDoc };
      setIsLoading(true);
      // Create temp local file URLs for immediate display
      const attachmentsList: FileAttachment[] = attachments
        ? attachments.map((file) => {
            const tempUrl = URL.createObjectURL(file);
            tempUrls.push(tempUrl);
            return { name: file.name, url: tempUrl, size: file.size };
          })
        : [];

      // Add user message to chat
      userMessage = createHumanMessage([createTextContent(message, undefined, undefined, attachmentsList)]);
      const safeMessages = Array.isArray(messages) ? messages : [];
      const updatedMessages = [...safeMessages, userMessage];
      setMessages(updatedMessages);

      // Ensure we have a session ID before sending
      if (!sessionId) {
        console.error('No session ID available');
        const errorMessage = createAssistantMessage([
          createTextContent("I'm sorry, the session is not ready. Please wait a moment and try again."),
        ]);
        setMessages((prev) => (Array.isArray(prev) ? [...prev, errorMessage] : [errorMessage]));
        setIsLoading(false);
        // Clean up temp URLs
        tempUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      const uploadedFiles = await uploadAttachments(attachments);

      // Clean up temporary blob URLs after upload
      tempUrls.forEach((url) => URL.revokeObjectURL(url));

      // Send the message
      const response = await sendChatMessage({
        message,
        ...(attachments ? { attachments: uploadedFiles } : {}),
        session: {
          sessionId,
          accountName,
        },
        metadata: {
          context: context || { type: 'screen', description: 'The user is on the Spec Doc management screen.' },
        },
        conversationHistory: updatedMessages,
      }).unwrap();

      // Add assistant response to messages
      const assistantMessages = response.messages || [];
      setMessages([...updatedMessages, ...assistantMessages]);

      // Need to update metadata as that is not streamed during generation
      const latestSpec = getLatestSpecDocInMessages(assistantMessages);
      if (latestSpec && latestSpec.metadata) {
        setActiveSpecDoc((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            metadata: latestSpec.metadata,
          };
        });
        // Trigger server fetch for the authoritative version (same as reload path)
        if (latestSpec.metadata.docId) {
          setSpecDocIdToFetch(latestSpec.metadata.docId);
        }
      }
    } catch (error) {
      // If this specific request was stopped, suppress error messaging
      if (stoppedRequestIdsRef.current.has(requestId)) {
        // do nothing - stop handler will restore previous state
        stoppedRequestIdsRef.current.delete(requestId);
      } else {
        console.error('Error calling nocode assistant:', error);
        // Add error message
        const errorMessage = createAssistantMessage([
          createTextContent("I'm sorry, there was an error processing your request. Please try again."),
        ]);
        setMessages((prev) => (Array.isArray(prev) ? [...prev, errorMessage] : [errorMessage]));
      }
    } finally {
      if (stoppedRequestIdsRef.current.has(requestId)) {
      setIsLoading(false);
      snapshotRef.current = null;
      }
      stopRequestedRef.current = false;
    }
  };

  const handleStopRequest = useCallback(async () => {
    if (!sessionId || !accountName) {
      console.error('No session ID or account name available to stop request');
      return;
    }
    stopRequestedRef.current = true;
    // Mark the current request as stopped
    stoppedRequestIdsRef.current.add(currentRequestIdRef.current);

    // restore previous messages and spec doc state
    if (snapshotRef.current?.messages) {
      setMessages(snapshotRef.current.messages);
    }
    if (snapshotRef.current?.specDoc !== undefined) {
      setActiveSpecDoc(snapshotRef.current.specDoc);
    }

    // ensure loading flag cleared in UI
    setIsLoading(false);

    try {
      await stopChatRequest({
        session: {
          sessionId,
          accountName,
        },
      }).unwrap();
    } catch (error) {
      console.error('Error stopping chat request:', error);
    }
  }, [sessionId, accountName, stopChatRequest]);

  const handleTaskClick = (task: TaskProgressItem) => {
    // Map task ID to detail tab
    const detailTabMap: Record<string, DetailTab> = {
      'user-roles': 'userRoles',
      workflows: 'features',
      'data-entities': 'dataEntities',
      'business-rules': 'businessRules',
      screens: 'screens',
    };

    const detailTab = detailTabMap[task.id];
    if (detailTab) {
      setActiveTab(detailTab);
    }
  };

  const handleAskMethodClick = (userContext: UserContext) => {
    // Open chat panel if closed
    if (!isChatVisible) {
      setIsChatVisible(true);
    }

    // Attach context to the chat input
    setUserContext(userContext);
  };

  const onDownloadPdf = () => {
    if (!activeSpecDoc || !activeSpecDoc.content || isSpecDocGenerating) return;

    (async () => {
      try {
        // Assert as full SpecDoc if generation is complete
        const asPdf = pdf(<SpecDocPDF specContent={activeSpecDoc.content as SpecDocumentContent} />);
        const blob = await asPdf.toBlob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const filenameBase = activeSpecDoc.content.appName
          ? `${activeSpecDoc.content.appName}_Spec_${activeSpecDoc.versionId}`
          : 'spec';
        a.download = `${filenameBase}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Revoke after a short delay to ensure download started
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (err) {
        console.error('Error generating PDF', err);
      }
    })();
  };

  const handleBuildTablesAndFields = async () => {
    await buildApp({ skipScreens: true });
  };

  const handleBuildApp = async () => {
    await buildApp();
  };

  // Track when spec doc is actively being generated (not just present)
  useEffect(() => {
    if (activeSpecDoc && isLoading) {
      setIsSpecDocGenerating(true);
    } else if (!isLoading) {
      setIsSpecDocGenerating(false);
    }
  }, [activeSpecDoc, isLoading]);

  // Handle Escape key to abort message in progress
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isLoading) {
        handleStopRequest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleStopRequest, isLoading]);

  return (
    <Container
      id='create-app-screen'
      style={{
        display: 'flex',
        backgroundColor: 'transparent',
        padding: 0,
        height: '100%',
        flexDirection: 'row',
      }}
      isRound={false}
      borderless
    >
      <Toolbar
        topButtons={[
          {
            id: 'spec-doc',
            icon: 'book',
            label: 'Spec Doc',
            onClick: () => setSelectedTab('spec-doc'),
            isActive: selectedTab === 'spec-doc',
            isHighlighted: isSpecDocGenerating,
          },
          {
            id: 'files',
            icon: 'files-folder',
            label: 'Files',
            onClick: () => setSelectedTab('files'),
            disabled: true,
            isActive: selectedTab === 'files',
          },
        ]}
        aiButtonConfig={{
          isActive: isChatVisible,
          onClick: () => setIsChatVisible((visible) => !visible),
        }}
      />
      {isChatVisible && (
        <AiChatBox
          messages={filterOutArtifactsFromMessages(messages)}
          isLoading={isLoading}
          placeholder='Enter your prompt'
          onSendMessage={handleSendMessage}
          taskProgress={taskProgress}
          taskProgressTitle={taskProgressTitle}
          taskProgressInsertIndex={taskProgressInsertIndex}
          onTaskClick={handleTaskClick}
          data-testid='create-app-screen'
          onCloseClick={activeSpecDoc ? () => setIsChatVisible(false) : undefined}
          attachedContext={userContext}
          onRemoveContext={() => setUserContext(null)}
          onStopRequest={handleStopRequest}
          disabled={!!appId}
          disabledTooltip='Your spec is view-only. The plan cannot be modified after app generation has started.'
        />
      )}
      <div style={{ width: '100%' }}>
        <SpecDocViewer
          specDocument={areFeatureFlagsLoaded ? activeSpecDoc : null}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAskMethod={handleAskMethodClick}
          onDownloadPdf={onDownloadPdf}
          disableDownloadPdf={!taskProgress?.every((task) => task.isCompleted)}
          onCreateDataEntitiesClick={isAppStudioBuildEnabled ? handleBuildTablesAndFields : undefined}
          disableCreate={isLoading || isBuildingApp || !!activeSpecDoc?.metadata?.isInitialSchemaCreated || !isAppStudioBuildEnabled}
          onBuildApp={isAppStudioBuildEnabled ? handleBuildApp : undefined}
          disableBuildApp={isBuildingApp || !effectiveSpecDocId || !!appId || !isAppStudioBuildEnabled}
        />
      </div>

      {/* This is a temporary modal */}
      {showBuildResultsModal && buildResults && (
        <Dialog
          title='Tables and Fields Build Results'
          isOpen={showBuildResultsModal}
          onClose={() => setShowBuildResultsModal(false)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              width: '100%',
              maxHeight: '500px',
              overflow: 'auto',
            }}
          >
            <div style={{ margin: 32 }}>
              <div style={{ marginBottom: 16 }}>
                <strong>Summary:</strong> {buildResults.result?.data?.successCount || 0} succeeded,{' '}
                {buildResults.result?.data?.failureCount || 0} failed
              </div>

              {buildResults.result?.data?.results?.map((tableResult: TableResult, index: number) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${tableResult.tableName}-${index}`}
                  style={{
                    marginBottom: 16,
                    padding: 16,
                    backgroundColor: tableResult.status === 'error' ? '#fff4f4' : '#f4fff4',
                    borderRadius: 4,
                    border: tableResult.status === 'error' ? '1px solid #ffcccc' : '1px solid #ccffcc',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    {tableResult.status === 'error' ? '?' : '?'} {tableResult.tableName}
                  </div>

                  {tableResult.result?.message && (
                    <div style={{ marginBottom: 8, fontSize: '14px' }}>{tableResult.result.message}</div>
                  )}

                  {tableResult.result?.data?.fieldsSuccessful?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ color: '#28a745', fontSize: '14px', fontWeight: 'bold' }}>? Successful fields:</div>
                      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                        {tableResult.result.data.fieldsSuccessful.map((field: FieldResult, idx: number) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li key={`${field.field}-${idx}`} style={{ fontSize: '14px' }}>
                            {field.field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tableResult.result?.data?.fieldsFailed?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ color: '#dc3545', fontSize: '14px', fontWeight: 'bold' }}>? Failed fields:</div>
                      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                        {tableResult.result.data.fieldsFailed.map((field: FieldResult, idx: number) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li key={`${field.field}-${idx}`} style={{ fontSize: '14px' }}>
                            <strong>{field.field}:</strong> {field.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                justifyContent: 'flex-end',
                background: '#f5f5f5',
                margin: -16,
                padding: 16,
              }}
            >
              <Button id='close-build-results' value='Close' onClick={() => setShowBuildResultsModal(false)} />
            </div>
          </div>
        </Dialog>
      )}
    </Container>
  );
}

export default ChatPanel;
