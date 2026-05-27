import React from 'react';
import SimpleBar from 'simplebar-react';
import { AttachmentsProps } from '../../types';
import { DEFAULT_CAPTION, DEFAULT_MAX_FILE_SIZE } from '../../utils/constants';
import { AttachmentItem } from '../AttachmentItem';
import { FileDropZone } from '../FileDropZone';
import { StatusNotifier } from '../StatusNotifier';
import * as S from './Attachments.styles';

export const Attachments: React.FC<AttachmentsProps> = ({
  data = [],
  id,
  visible = true,
  disabled = false,
  disableDropZone = false,
  isLoading = false,
  hideTitle = false,
  caption = DEFAULT_CAPTION,
  className = '',
  enableEmailAttachment = false,
  widthType = 'auto',
  width,
  isMobile = false,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedFileTypes,
  onAttachmentUpload,
  onAttachmentDelete,
  onAttachmentClick,
  onToggleEmailAttachment,
  onUploadEnd,
}) => {
  if (!visible) return null;

  const attachments = data.filter(Boolean);
  const hasAttachments = attachments.length > 0;
  const hasErrors = attachments.some((file) => file.errorMessage);

  const handleFilesAdded = (accepted: File[], rejected: File[], errorMessages: string[]) => {
    if (onAttachmentUpload) {
      onAttachmentUpload(accepted, rejected, errorMessages);
    }
  };

  const handleToggleCheckbox = (fileId: string, checked: boolean) => {
    onToggleEmailAttachment(fileId, checked);
  };

  const containerWidth = widthType === 'fixed' && width ? width : undefined;
  const showEmailDescription = enableEmailAttachment && hasAttachments && !hasErrors;

  let statusMessage = '';
  if (isLoading) {
    statusMessage = 'loading attachments...';
  } else if (disabled && !hasAttachments) {
    statusMessage = 'No attachments found';
  } else if (hasAttachments) {
    statusMessage = `${attachments.length} attachment${attachments.length === 1 ? '' : 's'} loaded`;
  }

  return (
    <S.Container width={containerWidth} className={`attachments ${className} ${isMobile ? 'is-mobile' : ''}`}>
      <S.Header visible={!hideTitle} hasMargin={hasAttachments}>
        {caption && <S.Title>{caption}</S.Title>}
        <S.Description visible={showEmailDescription}>
          Select the attachments below to be included in your email.
        </S.Description>
      </S.Header>

      <S.LoadingMessage visible={isLoading}>Loading files...</S.LoadingMessage>

      <S.EmptyMessage visible={disabled && !hasAttachments && !isLoading}>No attachments found</S.EmptyMessage>

      <StatusNotifier
        ariaLive='polite'
        pending={isLoading}
        messages={{
          idle: '',
          pending: 'loading attachment files...',
          done: statusMessage,
        }}
      />

      <S.AttachmentsList visible={hasAttachments}>
        <SimpleBar
          style={{ maxHeight: 248, overflowX: 'hidden', paddingRight: attachments?.length > 4 ? '16px' : '0' }}
        >
          {attachments.map((file, index) => {
            const isCheckboxChecked = file.links?.[0]?.attachToEmail || false;

            return (
              <S.AttachmentWrapper key={file.id} isLast={index === attachments.length - 1}>
                <AttachmentItem
                  id={file.id}
                  key={file.id}
                  parentId={id}
                  filename={file.filename}
                  fileExtension={file.fileExtension}
                  url={file.url}
                  size={file.size}
                  modifiedBy={file.modifiedBy}
                  createdDate={file.createdDate}
                  errorMessage={file.errorMessage}
                  progress={file.progress}
                  uploading={file.uploading}
                  disabled={disabled}
                  displayCheckbox={enableEmailAttachment}
                  isCheckboxChecked={isCheckboxChecked}
                  checkboxLabel='Include in email'
                  minWidth={width}
                  onLinkClick={onAttachmentClick}
                  onRemove={onAttachmentDelete}
                  onToggleCheckbox={handleToggleCheckbox}
                  onUploadEnd={onUploadEnd}
                />
              </S.AttachmentWrapper>
            );
          })}
        </SimpleBar>
      </S.AttachmentsList>

      <S.DropZoneWrapper visible={!disabled && !isLoading}>
        <FileDropZone
          onFilesAdded={handleFilesAdded}
          disabled={disabled || disableDropZone}
          maxFileSize={maxFileSize}
          allowedExtensions={allowedFileTypes}
          multiple={true}
          isMobile={isMobile}
        />
      </S.DropZoneWrapper>
    </S.Container>
  );
};
