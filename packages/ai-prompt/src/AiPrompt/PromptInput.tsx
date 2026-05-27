import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Paperclip } from 'lucide-react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { AiGradientButton } from '../AiGradientButton';
import { PromptInputContainer, InnerWrapper, StyledTextArea, AttachButton, ButtonRow } from './AiPrompt.styles';
import { FileList, FileChip, FileName, RemoveFileButton } from './PromptInput.styles';

export interface PromptInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum number of rows */
  minRows?: number;
  /** Button text for send button */
  buttonText?: string;
  /** Callback when message is submitted */
  onSubmit?: (message: string, attachments?: File[]) => void;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Accepted file types */
  acceptedFileTypes?: string;
  /** Maximum number of files that can be attached */
  maxFiles?: number;
  /** Additional CSS class name */
  className?: string;
  /** Input value (controlled) */
  value?: string;
  /** Whether this is a controlled component */
  controlled?: boolean;
  /** Test ID for the component */
  'data-testid'?: string;
  /** Whether to clear input on submit */
  shouldClearOnSubmit?: boolean;
}

export function PromptInput({
  placeholder = 'Enter your prompt...',
  disabled = false,
  isLoading = false,
  maxLength = 1000,
  minRows = 3,
  buttonText = 'Start building',
  onSubmit,
  onChange,
  acceptedFileTypes = '.csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  maxFiles = 5,
  className,
  value: controlledValue,
  controlled = false,
  'data-testid': testId,
  shouldClearOnSubmit = true,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileListRef = useRef<HTMLDivElement>(null);
  const value = controlled ? controlledValue || '' : internalValue;
  const isSubmitting = isLoading;
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Auto-scroll to last file when files are added
  useEffect(() => {
    if (fileListRef.current) {
      fileListRef.current.scrollLeft = fileListRef.current.scrollWidth;
    }
  }, [attachedFiles]);

  const canSubmit = value.trim().length > 0 && !disabled && !isSubmitting;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (!controlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [onChange, controlled],
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!canSubmit) return;

      const promptText = value.trim();
      if (!controlled && shouldClearOnSubmit) {
        setInternalValue('');
      }
      onSubmit?.(promptText, attachedFiles);
      setAttachedFiles([]); // Clear files after submit
    },
    [canSubmit, value, onSubmit, controlled, attachedFiles, shouldClearOnSubmit],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (files && files.length > 0) {
        const newFiles = Array.from(files);
        setAttachedFiles((existing) => {
          // Filter out duplicates based on name, size, and last modified time
          const uniqueNewFiles = newFiles.filter(
            (newFile) =>
              !existing.some(
                (existingFile) =>
                  existingFile.name === newFile.name &&
                  existingFile.size === newFile.size &&
                  existingFile.lastModified === newFile.lastModified,
              ),
          );
          const combined = [...existing, ...uniqueNewFiles];
          // Limit to maxFiles
          return combined.slice(0, maxFiles);
        });
      }
      // Reset the input so the same file can be selected again
      e.target.value = '';
    },
    [maxFiles],
  );

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleWrapperClick = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const containerTestId = testId || 'chat-input';

  return (
    <PromptInputContainer className={className} data-testid={containerTestId}>
      <InnerWrapper onClick={handleWrapperClick}>
        <StyledTextArea
          ref={textareaRef}
          id='ai-prompt-input'
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={minRows}
          maxLength={maxLength}
          aria-label='AI prompt input'
          data-testid={`${containerTestId}-textarea`}
          autoFocus
        />
        <ButtonRow>
          <AttachButton
            as='label'
            title='Attach file'
            data-testid={`${containerTestId}-attach-button`}
            style={{ cursor: 'pointer' }}
          >
            <Paperclip size={20} color='#6B7280' />
            <input
              type='file'
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
              tabIndex={-1}
              accept={acceptedFileTypes}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </AttachButton>
          {attachedFiles.length > 0 && (
            <FileList ref={fileListRef}>
              {attachedFiles.map((file, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <FileChip key={file.name + idx}>
                  <SvgIcon name='common-file-empty-alternate-v4' size={12} color={colors['grey-dark']} />
                  <FileName>{file.name}</FileName>
                  <RemoveFileButton
                    type='button'
                    aria-label='Remove file'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                  >
                    <SvgIcon name='close-compact' size={6} color={colors['grey-darker']} />
                  </RemoveFileButton>
                </FileChip>
              ))}
            </FileList>
          )}
          <AiGradientButton
            value={isSubmitting ? 'Loading...' : buttonText}
            onClick={handleSubmit}
            disabled={!canSubmit}
            type='submit'
          />
        </ButtonRow>
      </InnerWrapper>
    </PromptInputContainer>
  );
}

export default PromptInput;
