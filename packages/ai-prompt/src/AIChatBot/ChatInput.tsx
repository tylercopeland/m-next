import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowUp, FileIcon, Paperclip, X } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { UserContext } from '@m-next/api-interface';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import {
  InputContainer,
  InputWrapper,
  InputInner,
  HiddenFileInput,
  StyledTextArea,
  ButtonRow,
  InputActions,
  AttachButton,
  SendButton,
  AttachedFilesContainer,
  AttachedFile,
  FileIconContainer,
  AttachmentMeta,
  ContextPill,
  ContextLabel,
  ContextRemoveButton,
  ContextName,
  AttachmentContent,
} from './AIChatBot.styles';
import formatFileSize from '../utils/fileSize';

export interface ChatInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Accepted file types */
  acceptedFileTypes?: string;
  /** Maximum number of files that can be attached */
  maxFiles?: number;
  /** Callback when message is submitted */
  onSubmit?: (message: string, attachments?: File[], context?: UserContext) => void;
  /** Callback when a running request should be stopped/cancelled */
  onStop?: () => void;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Additional CSS class name */
  className?: string;
  /** Input value (controlled) */
  value?: string;
  /** Whether this is a controlled component */
  controlled?: boolean;
  /** Attached context to display */
  context?: UserContext | null;
  /** Callback when context is removed */
  onRemoveContext?: () => void;
  /** Tooltip message to show when disabled */
  disabledTooltip?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}

export function ChatInput({
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  maxLength = 12000,
  acceptedFileTypes = '.csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  maxFiles = 5,
  onSubmit,
  onStop,
  onChange,
  className,
  value: controlledValue,
  controlled = false,
  context,
  onRemoveContext,
  disabledTooltip,
  'data-testid': testId,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachedFilesContainerRef = useRef<HTMLDivElement>(null);

  const value = controlled ? controlledValue || '' : internalValue;
  const isSubmitting = isLoading;

  const showStopButton = isSubmitting && !!onStop;
  const canSubmit = value.trim().length > 0 && !disabled && !isSubmitting;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const ta = textareaRef.current;
      // reset to auto to correctly measure scrollHeight
      ta.style.height = 'auto';
      const maxHeight = 200;
      ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  // Auto-scroll to bottom when new files are attached
  useEffect(() => {
    if (attachedFilesContainerRef.current && attachedFiles.length > 0) {
      attachedFilesContainerRef.current.scrollTo({
        top: attachedFilesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [attachedFiles]);

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

      if (!canSubmit) return;

      const promptText = value.trim();
      if (!controlled) {
        setInternalValue('');
      }

      onSubmit?.(promptText, attachedFiles, context || undefined);
      setAttachedFiles([]);
    },
    [canSubmit, value, onSubmit, controlled, attachedFiles, context],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles((existing) => existing.filter((_, i) => i !== index));
  }, []);

  const handleWrapperClick = useCallback(() => {
    textareaRef.current?.focus();
  }, []);

  const containerTestId = testId || 'chat-input';

  return (
    <InputContainer className={className} data-testid={containerTestId}>
      {attachedFiles.length > 0 && (
        <AttachedFilesContainer ref={attachedFilesContainerRef}>
          {attachedFiles.map((file, index) => (
            <AttachedFile key={`${file.name}-${file.size}-${file.lastModified}`}>
              <AttachmentContent>
                <FileIconContainer>
                  <FileIcon size={24} color={colors['grey-dark']} />
                </FileIconContainer>
                <AttachmentMeta>
                  <span>{file.name}</span>
                  <span>{formatFileSize(file.size)}</span>
                </AttachmentMeta>
              </AttachmentContent>
              <button
                className='delete-file-button'
                type='button'
                onClick={() => handleRemoveFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <SvgIcon name='close-compact' size={8} color={colors['grey-darker']} />
              </button>
            </AttachedFile>
          ))}
        </AttachedFilesContainer>
      )}
      {context && (
        <>
          <ContextPill
            data-tooltip-id='chat-input-tooltip'
            data-tooltip-content='Ask questions or request changes about this section'
          >
            <ContextLabel>
              <SvgIcon name='ai-chat' size={16} color='#7B2FF7' />
              Ask:
            </ContextLabel>
            <ContextName>{context.identifier}</ContextName>
            <ContextRemoveButton
              type='button'
              onClick={onRemoveContext}
              aria-label='Remove context'
              data-tooltip-id='chat-input-tooltip'
              data-tooltip-content='Remove context'
            >
              <X size={16} />
            </ContextRemoveButton>
          </ContextPill>
          <Tooltip
            id='chat-input-tooltip'
            place='top'
            style={{
              backgroundColor: colors['grey-darkest'],
              borderRadius: '2px',
              padding: '4px 8px',
              fontSize: '12px',
              zIndex: 100,
            }}
          />
        </>
      )}
      <InputWrapper
        onClick={handleWrapperClick}
        data-tooltip-id={disabled && disabledTooltip ? 'chat-input-disabled-tooltip' : undefined}
        data-tooltip-content={disabled && disabledTooltip ? disabledTooltip : undefined}
        disabled={disabled}
      >
        <InputInner>
          <HiddenFileInput
            type='file'
            multiple
            accept={acceptedFileTypes}
            ref={fileInputRef}
            onChange={handleFileChange}
            data-testid={`${containerTestId}-file-input`}
          />

          <StyledTextArea
            id='chat-input-textarea'
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={1}
            aria-label='Message input'
            data-testid={`${containerTestId}-textarea`}
          />
          <ButtonRow>
            <AttachButton
              type='button'
              onClick={handleAttachClick}
              title='Attach file'
              data-testid={`${containerTestId}-attach-button`}
              disabled={disabled}
            >
              <Paperclip size={24} color='#6B7280' />
            </AttachButton>
            <InputActions>
              <SendButton
                type='button'
                canSend={canSubmit}
                showStop={showStopButton}
                disabled={!canSubmit && !showStopButton}
                onClick={showStopButton ? onStop : handleSubmit}
                aria-label={showStopButton ? 'Stop request' : 'Send message'}
                title={showStopButton ? 'Stop' : 'Send'}
                data-testid={`${containerTestId}-send-button`}
              >
                {showStopButton ? (
                  <SvgIcon name='box-rounded' size={10} color='#ffffff' />
                ) : (
                  <ArrowUp size={16} color='#ffffff' />
                )}
              </SendButton>
            </InputActions>
          </ButtonRow>
        </InputInner>
      </InputWrapper>
      {disabled && disabledTooltip && (
        <Tooltip
          id='chat-input-disabled-tooltip'
          place='top'
          style={{
            backgroundColor: colors['grey-darkest'],
            borderRadius: '2px',
            padding: '4px 8px',
            fontSize: '12px',
            zIndex: 100,
          }}
        />
      )}
    </InputContainer>
  );
}

export default ChatInput;
