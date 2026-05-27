import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Checkbox from '@m-next/checkbox';
import SvgIcon from '@m-next/svg-icon';
import { AttachmentItemProps } from '../../types';
import { useUploadProgress } from '../../hooks';
import { formatFileSize, getFileExtension } from '../../utils';
import { StatusNotifier } from '../StatusNotifier';
import * as S from './AttachmentItem.styles';
import { colors } from '@m-next/styles';

export const AttachmentItem: React.FC<AttachmentItemProps> = ({
  id,
  filename,
  fileExtension,
  url = '',
  size = 0,
  modifiedBy = '',
  createdDate = '',
  errorMessage = '',
  progress,
  uploading = false,
  float = false,
  disabled = false,
  displayCheckbox = false,
  isCheckboxChecked = false,
  minWidth = '224px',
  onLinkClick,
  onRemove,
  onToggleCheckbox,
  onUploadEnd,
}) => {
  const isUploading = Boolean(progress !== undefined || uploading);
  const hasError = Boolean(errorMessage);
  const displayProgressBar = progress !== undefined;

  useUploadProgress(isUploading, onUploadEnd);

  const handleClick = () => {
    if (!isUploading && !hasError && onLinkClick) {
      onLinkClick(id, url);
    }
  };

  const handleRemove = () => {
    if (!isUploading && onRemove) {
      onRemove(id);
    }
  };

  const getDescription = () => {
    if (isUploading) {
      return displayProgressBar ? `${progress}% uploading...` : 'Uploading...';
    }

    if (hasError) {
      return errorMessage;
    }

    const parts = [];
    if (createdDate) {
      parts.push(formatDistanceToNow(new Date(createdDate), { addSuffix: true }));
    }
    if (modifiedBy) {
      parts.push(`by ${modifiedBy}`);
    }
    if (size) {
      parts.push(`- ${formatFileSize(size)}`);
    }

    return parts.join(' ') || '';
  };

  const extension = fileExtension || getFileExtension(filename);

  return (
    <>
      <S.Container minWidth={minWidth} float={float}>
        {displayCheckbox && !hasError && (
          <Checkbox
            id={`${id}-checkbox`}
            testId={`${id}-checkbox`}
            disabled={disabled || isUploading}
            checked={isCheckboxChecked}
            onChange={(e) => onToggleCheckbox(id, e)}
            style={{ marginRight: '12px' }}
            hidden={!displayCheckbox || !!errorMessage}
            narrow
          />
        )}

        <S.FileIconWrapper isUploading={isUploading} hasError={hasError} onClick={handleClick}>
          {hasError ? (
            <SvgIcon
              id={`${id}-warning-icon`}
              testId={`${id}-warning-icon`}
              name='warning-sign'
              color={colors.red}
              size={20}
            />
          ) : (
            <>
              <SvgIcon
                id={`${id}-file-icon`}
                testId={`${id}-file-icon`}
                size={24}
                color={colors['grey-light']}
                name='common-file-empty-alternate-v4'
              />
              <S.FileExtention>{extension.slice(0, 3)}</S.FileExtention>
            </>
          )}
        </S.FileIconWrapper>

        <S.Content>
          <S.FileName
            id={`${id}-filename`}
            test-id={`${id}-filename`}
            isUploading={isUploading}
            hasError={hasError}
            onClick={handleClick}
            disabled={isUploading || hasError}
            title={filename}
          >
            {filename}
          </S.FileName>

          {displayProgressBar && <S.ProgressBar progress={progress || 0} />}

          <S.Description hasError={hasError}>{getDescription()}</S.Description>
        </S.Content>

        {!disabled && (
          <SvgIcon
            id={`${id}-remove-icon`}
            testId={`${id}-remove-icon`}
            name={'trash-V4'}
            size={16}
            onClick={handleRemove}
            isV4Design
            color={colors['grey-dark']}
            backgroundColor={colors.white}
            backgroundHoverColor={colors['grey-lighter']}
            isRound
          />
        )}
      </S.Container>

      <StatusNotifier
        pending={isUploading}
        messages={{
          idle: '',
          pending: 'uploading',
          done: 'upload complete',
        }}
      />
    </>
  );
};
