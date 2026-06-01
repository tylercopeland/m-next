import React, { forwardRef, useEffect, useRef } from 'react';
import { FileDropZoneProps } from '../../types';
import { useFileValidation } from '../../hooks';
import { sanitizeFilename } from '../../utils';
import * as S from './FileDropZone.styles';

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

// Extended props — soft-shim layer in addition to FileDropZoneProps.
type ExtendedFileDropZoneProps = FileDropZoneProps & {
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
 * FileDropZone — drag/drop + click-to-pick file uploader surface. Validates
 * incoming files against size/extension constraints, sanitizes filenames,
 * and emits accepted/rejected lists via `onFilesAdded`.
 *
 * `isMobile` is kept as a real prop because it changes the affordance text
 * (tap-to-pick vs. drag/drop) — not a documented ghost.
 */
export const FileDropZone = forwardRef<HTMLDivElement, ExtendedFileDropZoneProps>(
  function FileDropZone(props, ref) {
    const {
      id: idProp,
      onFilesAdded,
      disabled = false,
      maxFileSize,
      allowedExtensions,
      multiple = true,
      isMobile = false,

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
    // NOTE: bumps the counter for tracking, but historically this component
    // rendered the literal id "dropzone-container" — preserved as the default
    // to avoid breaking selectors/tests that match on it.
    const internalIdRef = useRef<string | null>(null);
    if (internalIdRef.current === null) {
      // eslint-disable-next-line no-plusplus
      ++autoIdCounter;
      internalIdRef.current = 'dropzone-container';
    }
    const id = idProp ?? internalIdRef.current;

    if (legacyForwardRef) {
      warnOnce(
        'file-drop-zone-forwardRef-prop',
        '@m-next/attachments: `forwardRef` prop on FileDropZone is deprecated. Use the React forwardRef API — pass `ref` directly.',
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

    const [isDragActive, setIsDragActive] = React.useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { validateFile } = useFileValidation(maxFileSize, allowedExtensions);

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const processFiles = (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      const files = Array.from(fileList);
      const validFiles: File[] = [];
      const invalidFiles: File[] = [];
      const errorMessages: string[] = [];

      files.forEach((file) => {
        const sanitizedName = sanitizeFilename(file.name);
        const sanitizedFile = new File([file], sanitizedName, {
          type: file.type,
          lastModified: file.lastModified,
        });

        const { isValid, error } = validateFile(sanitizedFile);
        if (isValid) {
          validFiles.push(sanitizedFile);
        } else {
          invalidFiles.push(sanitizedFile);
          errorMessages.push(error || 'Invalid file');
        }
      });

      if (validFiles.length > 0 || invalidFiles.length > 0) {
        onFilesAdded(validFiles, invalidFiles, errorMessages);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      processFiles(e.dataTransfer.files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      e.target.value = '';
    };

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        handleClick();
      }
    };

    const maxSizeMB = maxFileSize ? Math.floor(maxFileSize / (1024 * 1024)) : 50;

    return (
      <S.DropZone
        ref={setRef}
        id={id}
        isDragActive={isDragActive}
        disabled={disabled}
        canUpload={!disabled}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role='button'
        aria-label={`Upload files. Individual file size limit is ${maxSizeMB}MB`}
      >
        <S.UploadText id='dropzone-text'>
          {isMobile ? (
            'Tap to upload files'
          ) : isDragActive ? (
            'Drop files here to upload'
          ) : (
            <>
              Drop files here or <span style={{ color: '#0066cc' }}>click to browse.</span>
            </>
          )}
        </S.UploadText>

        <S.UploadSubtext>Individual file size limit is {maxSizeMB} MB</S.UploadSubtext>

        <S.HiddenInput
          id='dropzone'
          ref={fileInputRef}
          type='file'
          multiple={multiple}
          onChange={handleFileInput}
          tabIndex={-1}
          accept={allowedExtensions?.map((ext) => `.${ext}`).join(',')}
        />
      </S.DropZone>
    );
  },
);

FileDropZone.displayName = 'FileDropZone';
