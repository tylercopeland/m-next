
import React from 'react';
import { useSelector } from 'react-redux';
import { useAttachmentsTranslation } from '@m-next/runtime-interface';
import type { AttachmentsControl } from '@m-next/runtime-interface';
import { Attachments } from '@m-next/attachments';

// screenLayoutSlice is not typed yet
import { selectControls, selectBaseModel, selectActiveRecordId } from '../../../common/services/screenLayoutSlice';
 
// @ts-ignore
import { selectAccountName } from '../../../common/services/sessionSlice';
 
// @ts-ignore
import { selectScreenId } from '../../../common/services/appSlice';
 
// @ts-ignore
import { useGetDocumentsQuery } from '../../../common/services/documentsApi';
import { RootState } from '../../../types/screenLayoutTypes';

// Attachments designer wrapper props
export interface AttachmentsDesignerWrapperProps {
  id: string;
  onControlClick: (id: string) => void;
}

const AttachmentsDesignerWrapper: React.FC<AttachmentsDesignerWrapperProps> = ({ id, onControlClick }) => {
  const controls = useSelector((state) => selectControls(state as RootState));
  const control = controls ? controls[id] : null;
  const screenBaseModel = useSelector(selectBaseModel);
  const accountName = useSelector(selectAccountName);
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);

  const { data, isFetching } = useGetDocumentsQuery(
    { accountName, screenBaseModel, screenId, activeRecordId },
    { skip: !control },
  );

  const handleControlClick = () => {
    onControlClick(id);
  };

  // Create a properly typed AttachmentsControl object with all required properties
  const attachmentsControl: AttachmentsControl = (control as AttachmentsControl) || {
    id: '',
    type: 'attachments',
    visible: true,
    disabled: false,
    isBound: false,
    isWorking: false,
    enableEmailAttachment: false,
    hideCaption: true,
    caption: '',
    name: 'attachments',
    classes: '',
    widthType: 'auto',
    width: null,
    height: null,
    defaultValue: null,
  };

  const { widgetProps } = useAttachmentsTranslation(attachmentsControl, handleControlClick);

  if (!control) {
    return null;
  }

  return (
    <Attachments
      {...widgetProps}
      onUploadEnd={() => {}}
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAttachmentUpload={(acceptedFiles: File[], rejectedFiles: File[], errorMessages: string[]) => {}}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAttachmentDelete={(documentId: string) => {}}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onAttachmentClick={(documentId: string, url: string) => {}}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onToggleEmailAttachment={(documentId: string, attachToEmail: boolean) => {}}
      data={data || []}
      isLoading={isFetching}
      visible
      disableDropZone
    />
  );
};

export default AttachmentsDesignerWrapper;
