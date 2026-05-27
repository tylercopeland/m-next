import React, { useState, useCallback } from 'react';
import { AiPromptProps } from '../types';
import { AiPromptContainer, ErrorMessage } from './AiPrompt.styles';
import { PromptInput } from './PromptInput';

const DEFAULT_PLACEHOLDER = 'Enter your prompt...';
const DEFAULT_BUTTON_TEXT = 'Ask AI';
const DEFAULT_MAX_LENGTH = 12000;
const DEFAULT_MIN_ROWS = 1;

export function AiPrompt({
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  buttonText = DEFAULT_BUTTON_TEXT,
  disabled = false,
  maxLength = DEFAULT_MAX_LENGTH,
  minRows = DEFAULT_MIN_ROWS,
  isLoading = false,
  onSubmit,
  onChange,
  shouldClearOnSubmit = true,
}: AiPromptProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (promptText: string, attachments?: File[]) => {
      setError(null);
      if (onSubmit) {
        onSubmit(promptText, attachments);
      }
    },
    [onSubmit],
  );

  const handleInputChange = useCallback(
    (newValue: string) => {
      setError(null);
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <AiPromptContainer className={className} isLoading={isLoading} data-testid='ai-prompt-container'>
      <PromptInput
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isLoading}
        maxLength={maxLength}
        minRows={minRows}
        buttonText={buttonText}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        data-testid='ai-prompt-input'
        shouldClearOnSubmit={shouldClearOnSubmit}
      />

      {error && (
        <ErrorMessage id='ai-prompt-error' role='alert' data-testid='ai-prompt-error'>
          {error}
        </ErrorMessage>
      )}
    </AiPromptContainer>
  );
}

export default AiPrompt;
