import React, { forwardRef, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Checkbox from '@m-next/checkbox';
import SvgIcon from '@m-next/svg-icon';
import { AttachmentItemProps } from '../../types';
import { useUploadProgress } from '../../hooks';
import { formatFileSize, getFileExtension } from '../../utils';
import { StatusNotifier } from '../StatusNotifier';
import * as S from './AttachmentItem.styles';
import { colors } from '@m-next/styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set<string>();
  return (key: string, message: string) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// Extended props — soft-shim layer in addition to AttachmentItemProps.
type ExtendedAttachmentItemProps = Omit<AttachmentItemProps, 'id'> & {
  /** Optional — auto-generated when omitted. */
  id?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<HTMLDivElement> | null;
  // Silently ignored legacy ghosts
  isV4Design?: boolean;
  legacyClass?: string | null;
  displayAuto?: boolean;
  compactStyle?: boolean;
  hidden?: boolean;
};

/**
 * AttachmentItem — single row in the Attachments list. Renders a file icon,
 * filename, optional progress bar, optional checkbox, and a remove control.
 * Pairs an aria-live StatusNotifier alongside for upload state.
 */
export const AttachmentItem = forwardRef<HTMLDivElement, ExtendedAttachmentItemProps>(
  function AttachmentItem(props, ref) {
    const {
      id: idProp,
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

      // Soft-shimmed legacy props
      forwardRef: legacyForwardRef,

      // Silently ignored legacy ghosts
      isV4Design: _isV4Design,
      legacyClass: _legacyClass,
      displayAuto: _displayAuto,
      compactStyle: _compactStyle,
      hidden: _hidden,
    } = props;

    // Auto-generate id if not provided.
    const internalIdRef = useRef<string | null>(null);
    if (internalIdRef.current === null) {
      // eslint-disable-next-line no-plusplus
      internalIdRef.current = `m-next-attachment-item-${++autoIdCounter}`;
    }
    const id = idProp ?? internalIdRef.current;

    if (legacyForwardRef) {
      warnOnce(
        'attachment-item-forwardRef-prop',
        '@m-next/attachments: `forwardRef` prop on AttachmentItem is deprecated. Use the React forwardRef API — pass `ref` directly.',
      );
    }

    // Chain modern ref + legacy forwardRef prop onto the rendered root element.
    const internalElRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const assign = (target: typeof ref | typeof legacyForwardRef) => {
        if (!target) return;
        if (typeof target === 'function') {
          target(internalElRef.current);
        } else {
          // eslint-disable-next-line no-param-reassign
          (target as React.MutableRefObject<HTMLDivElement | null>).current = internalElRef.current;
        }
      };
      assign(ref);
      assign(legacyForwardRef);
    }, [ref, legacyForwardRef]);

    const setRef = (node: HTMLDivElement | null) => {
      internalElRef.current = node;
    };

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
        <S.Container ref={setRef} id={id} minWidth={minWidth} float={float}>
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
  },
);

AttachmentItem.displayName = 'AttachmentItem';
