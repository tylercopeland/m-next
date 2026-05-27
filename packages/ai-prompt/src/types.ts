/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { ChatMessage } from '@m-next/api-interface';

export interface AiPromptProps {
  /** GUID for the assistant ID */
  assistantId: string;
  /** Placeholder text for the input area */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
  /** Button text (defaults to "Send") */
  buttonText?: string;
  /** Whether the prompt is disabled */
  disabled?: boolean;
  /** Maximum character limit for the prompt */
  maxLength?: number;
  /** Minimum rows for the textarea */
  minRows?: number;
  /** Maximum rows for the textarea */
  maxRows?: number;
  /** Loading state indicator */
  isLoading?: boolean;
  /** Icon for the send button */
  buttonIcon?: ReactNode;
  /** Callback when prompt is submitted */
  onSubmit?: (prompt: string, attachments?: File[]) => void;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Additional context to send with the prompt */
  context?: any;
  /** Whether to show only the icon in the button */
  iconOnly?: boolean;
  /** Whether to clear input on submit */
  shouldClearOnSubmit?: boolean;
}

export interface AiPromptResponse {
  /** Success status */
  success: boolean;
  /** Response data from the AI */
  data?: any;
  /** Error message if failed */
  error?: string;
}

export interface AiPromptState {
  /** Current input value */
  value: string;
  /** Whether a request is in progress */
  isSubmitting: boolean;
  /** Any error that occurred */
  error: string | null;
}

export interface TaskProgressItem {
  /** Unique identifier for the task */
  id: string;
  /** Task label/name */
  label: string;
  /** Whether the task is completed */
  isCompleted: boolean;
  inProgress: boolean;
}

export interface AiChatBoxProps {
  /** Array of chat messages using api-interface format */
  messages?: ChatMessage[];
  /** Whether the chat is loading */
  isLoading?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Additional CSS class name */
  className?: string;
  /** User name to display for human messages */
  userName?: string;
  /** AI assistant name to display */
  assistantName?: string;
  /** Task progress items to display */
  taskProgress?: TaskProgressItem[];
  /** Title for task progress section */
  taskProgressTitle?: string;
  /** Callback when a new message is sent */
  onSendMessage?: (message: string) => void;
  /** Callback when files are attached */
  onFileAttach?: (files: FileList) => void;
  /** Callback when a task is clicked */
  onTaskClick?: (task: TaskProgressItem) => void;
  /** Test ID for the component */
  'data-testid'?: string;
}
