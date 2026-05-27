import React, { useRef } from 'react';
import { FileDropZoneProps } from '../../types';
import { useFileValidation } from '../../hooks';
import { sanitizeFilename } from '../../utils';
import * as S from './FileDropZone.styles';

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesAdded,
  disabled = false,
  maxFileSize,
  allowedExtensions,
  multiple = true,
  isMobile = false,
}) => {
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
      id='dropzone-container'
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
};
