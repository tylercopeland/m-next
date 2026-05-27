import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@m-next/dialog';
import { AiPrompt, AIHeader } from '@m-next/ai-prompt';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useBuildScreenMutation } from '../../../common/services/nocodeAssistantApi';
import { selectAppId, selectScreenId, selectVersionId } from '../../../common/services/appSlice';
import { selectAccountName, selectNocodeAssistantSessionId } from '../../../common/services/sessionSlice';
import { selectBaseModel } from '../../../common/services/screenLayoutSlice';
import useNocodeAssistantSession from '../../../common/hooks/useNocodeAssistantSession';

const AiBuildScreenDialog = ({ isOpen, onClose }) => {
  const [buildScreen, { isLoading }] = useBuildScreenMutation();
  const [searchParams] = useSearchParams();

  const appId = useSelector(selectAppId);
  const screenId = useSelector(selectScreenId);
  const versionId = useSelector(selectVersionId);
  const viewName = useSelector(selectBaseModel);
  const accountName = useSelector(selectAccountName);
  const existingSessionId = useSelector(selectNocodeAssistantSessionId) || searchParams.get('sessionId');

  // Initializes session automatically if sessionId is null
  const { sessionId, isInitializing } = useNocodeAssistantSession({ existingSessionId});

  const handleSendMessage = useCallback(
    async (message) => {
      if (!sessionId) {
        toast.error('AI session is not ready. Please wait and try again.');
        return;
      }

      try {
        await buildScreen({
          viewName,
          screenIntent: message,
          appId,
          screenId,
          versionId,
          session: {
            sessionId,
            accountName,
          },
        }).unwrap();

        toast.success('Screen built successfully!');
        onClose();
        window.location.reload();
      } catch {
        toast.error('AI build failed. Please try again.');
      }
    },
    [viewName, appId, screenId, versionId, sessionId, accountName, buildScreen, onClose],
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      id='ai-build-screen-dialog'
      isOpen={isOpen}
      onClose={handleClose}
      width={480}
      hideDefaultHeader
      hideDefaultBody
      hideDefaultFooter
      customStyles={{
        content: {
          borderRadius: '16px',
          overflow: 'hidden',
          padding: '8px',
        },
      }}
    >
      <AIHeader title='AI Screen Builder' onClose={handleClose} />
      <AiPrompt
        assistantId='app-creation-assistant'
        placeholder='Describe what you want the screen to look like...'
        buttonText='Build Screen'
        minRows={3}
        onSubmit={handleSendMessage}
        isLoading={isInitializing || isLoading}
        disabled={isInitializing || !sessionId || isLoading} 
        buttonIcon='ai-assistant'
        shouldClearOnSubmit={false}
      />
    </Dialog>
  );
};

AiBuildScreenDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AiBuildScreenDialog;
