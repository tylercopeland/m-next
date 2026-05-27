import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import Dialog from '@m-next/dialog';
import { Text, TextLine } from '@m-next/typeography';
import { selectScreenName } from '../../common/services/appSlice';

const ReadOnlyWarningDialog = ({ isOpen, onClose, onCopyScreen, isStock, draftInfo, versionId }) => {
  const screenName = useSelector(selectScreenName);

  const content = useMemo(() => {
    if (isStock) {
      return (
        <TextLine>
          This is a default screen, to make changes, create a copy.
          <br /> Creating a copy allows you to customize while keeping the original screen intact and accessible.
        </TextLine>
      );
    }

    if (draftInfo && versionId !== draftInfo?.versionId) {
      return (
        <TextLine>
          This screen is currently published. To make changes, continue editing the current draft{' '}
          <Text bold>{screenName}</Text> |<Text bold> Ver. {draftInfo.versionNumber}</Text>, which was last edited by{' '}
          <Text bold>{draftInfo.lastModifiedBy}</Text> on{' '}
          <Text bold>{format(new Date(draftInfo.lastModifiedDate), 'MMMM d, yyyy')}</Text>.
        </TextLine>
      );
    }

    return (
      <TextLine>
        This screen is currently published. To make changes, create a draft.
        <br /> Creating a draft lets you customize it safely without affecting other users. You can always return to the
        published version if needed.
      </TextLine>
    );
  }, [draftInfo, isStock, screenName, versionId]);

  const buttonLabel = useMemo(() => {
    if (isStock) {
      return 'Create copy';
    }

    if (draftInfo && versionId !== draftInfo?.versionId) {
      return 'Edit existing draft';
    }

    return 'Create draft';
  }, [draftInfo, isStock, versionId]);

  return (
    <Dialog
      title='This screen is read-only'
      isOpen={isOpen}
      onClose={onClose}
      hideDismissButton
      footer={{
        primaryButtonLabel: buttonLabel,
        onPrimaryButtonClick: onCopyScreen,
        secondaryButtonLabel: 'View screen',
        onSecondaryButtonClick: onClose,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {content}
        <TextLine>Note: Free technical support is limited for customizations.</TextLine>
        <TextLine>
          <a
            href='https://help.method.me/en/collections/1419698-customization-concepts#screen-management'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn more about screen drafts
          </a>
        </TextLine>
      </div>
    </Dialog>
  );
};

export default ReadOnlyWarningDialog;
