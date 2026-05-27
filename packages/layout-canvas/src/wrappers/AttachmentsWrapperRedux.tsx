import React, { useEffect } from 'react';
import { useAttachmentsTranslation } from '@m-next/runtime-interface';
import type { AttachmentsControl } from '@m-next/runtime-interface';
import { Attachments } from '@m-next/attachments';
import type { ActionHandler } from '../actions/types';

// screenLayoutSlice is not typed yet
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { selectAccountName } from '../../../../apps/app-builder/src/common/services/sessionSlice';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { selectScreenId } from '../../../../apps/app-builder/src/common/services/appSlice';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useGetDocumentsQuery } from '../../../../apps/app-builder/src/common/services/documentsApi';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useDesignerContext } from '../contexts/DesignerContext';

// Attachments designer wrapper props
export interface AttachmentsDesignerWrapperProps {
  id: string;
  onControlClick?: (id: string) => void;
  control?: AttachmentsControl; // Control data passed in runtime mode
  mode?: 'designer' | 'runtime';
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, any>;
  runtimeUpdateControlValue?: ((controlId: string, value: any) => void) | null;
  runtimeUpdateControlProperty?: ((controlId: string, property: string, value: any) => void) | null;
}

const AttachmentsDesignerWrapper: React.FC<AttachmentsDesignerWrapperProps> = ({
  id,
  onControlClick,
  control: controlProp,
  mode = 'designer',
}) => {
  // Check for runtime context first
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  const handleControlClick = () => {
    if (onControlClick) {
      onControlClick(id);
    }
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

  // Exclude visible from widgetProps — visibility is handled by the canvas (showHiddenComponents toggle)
  const { visible: _visible, ...restWidgetProps } = widgetProps;

  if (!control) {
    return null;
  }

  // Load attachments when component mounts or control becomes visible (runtime mode only)
  useEffect(() => {
    if (mode === 'runtime' && control.visible && runtimeContext?.loadAttachmentsData) {
      runtimeContext.loadAttachmentsData(id);
    }
  }, [mode, control.visible, id]);

  // In runtime mode, attachments data comes from control.value
  const attachmentsData = mode === 'runtime' && control?.value && Array.isArray(control.value) ? control.value : [];

  const generateTempFileId = () => {
    try {
      return `temp_${crypto.randomUUID()}`;
    } catch {
      const ticks = Date.now();
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return `temp_${ticks}_${array[0]?.toString(16) || 'random'}`;
    }
  };

  // Wire up runtime handlers
  const handleAttachmentUpload = (acceptedFiles: File[], rejectedFiles: File[], errorMessages: string[]) => {
    if (mode !== 'runtime' || !runtimeContext) return;

    // Clear failed attachments first
    if (runtimeContext.clearFailedAttachments) {
      runtimeContext.clearFailedAttachments(id);
    }

    if (acceptedFiles.length > 0) {
      const fileWrappers = acceptedFiles.map((file) => {
        const wrapper = {
          _file: file,
          id: generateTempFileId(),
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        return wrapper;
      });

      fileWrappers.forEach((wrapper: any) => {
        if (runtimeContext.uploadAttachmentState) {
          runtimeContext.uploadAttachmentState(id, wrapper.id, wrapper.name, wrapper.size);
        }
        if (runtimeContext.triggerUploadAttachment) {
          runtimeContext.triggerUploadAttachment(id, fileWrappers, wrapper._file);
        }
      });
    }

    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file, index) => {
        const fileId = generateTempFileId();
        if (runtimeContext.uploadAttachmentState) {
          runtimeContext.uploadAttachmentState(id, fileId, file.name, file.size, errorMessages[index]);
        }
      });
    }
  };

  const handleAttachmentDelete = (documentId: string) => {
    if (mode === 'runtime' && runtimeContext?.deleteAttachment) {
      runtimeContext.deleteAttachment(id, documentId);
    }
  };

  const handleAttachmentClick = (documentId: string, url: string) => {
    if (mode === 'runtime' && runtimeContext?.onAttachmentClick) {
      runtimeContext.onAttachmentClick(documentId, url);
    }
  };

  const handleToggleEmailAttachment = (documentId: string, attachToEmail: boolean) => {
    if (mode === 'runtime' && runtimeContext?.onToggleEmailAttachment) {
      runtimeContext.onToggleEmailAttachment(id, documentId, attachToEmail);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <Attachments
        {...restWidgetProps}
        onAttachmentUpload={handleAttachmentUpload}
        onAttachmentDelete={handleAttachmentDelete}
        onAttachmentClick={handleAttachmentClick}
        onToggleEmailAttachment={handleToggleEmailAttachment}
        data={attachmentsData}
        isLoading={control?.isLoading}
        disableDropZone={!isRuntimeMode}
        //no op
        onUploadEnd={() => {}}
      />
    </div>
  );
};

export default AttachmentsDesignerWrapper;
