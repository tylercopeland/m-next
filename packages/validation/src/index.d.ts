import { ReactNode } from 'react';

export interface ValidationMessageProps {
  id?: string;
  message?: string | ReactNode;
  isV4Design?: boolean;
  compactStyle?: boolean;
}

export interface ValidationRule {
  type: 'isRequired' | 'isValidEmail' | 'isValidLength' | 'isValidRange';
  customMessage?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export interface ValidationProps {
  id?: string;
  message?: string | ReactNode;
  isV4Design?: boolean;
  compactStyle?: boolean;
  onValidation?: (isValid: boolean) => void;
  rules?: ValidationRule[];
  value?: string | number;
}

export const ValidationMessage: React.FC<ValidationMessageProps>;
export const Validation: React.FC<ValidationProps>; 