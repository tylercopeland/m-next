import { ReactNode } from 'react';

export interface ValidationMessageProps {
  /** Optional ID for the validation message */
  id?: string;
  /** The validation message content - can be a string or React node */
  message?: string | ReactNode;
  /** Whether to use V4 design styling */
  isV4Design?: boolean;
  /** Whether to use compact styling */
  compactStyle?: boolean;
}

declare const ValidationMessage: React.FC<ValidationMessageProps>;

export default ValidationMessage; 