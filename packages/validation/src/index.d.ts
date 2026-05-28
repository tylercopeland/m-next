/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

// ============ Rule definitions ============

export interface ValidationRuleRequired {
  type: 'isRequired';
  /** Override the default "Field is required." message. */
  customMessage?: string;
}

export interface ValidationRuleEmail {
  type: 'isValidEmail';
  /** Override the default "Invalid email address." message. */
  customMessage?: string;
}

export interface ValidationRuleLength {
  type: 'isValidLength';
  /** Override the default generated message. */
  customMessage?: string;
  /** Minimum trimmed length. Zero / undefined means no lower bound. */
  minLength?: number;
  /** Maximum trimmed length. Zero / undefined means no upper bound. */
  maxLength?: number;
}

export interface ValidationRuleRange {
  type: 'isValidRange';
  /** Override the default generated message. */
  customMessage?: string;
  /** Minimum numeric value. Zero / undefined means no lower bound. */
  minValue?: number;
  /** Maximum numeric value. Zero / undefined means no upper bound. */
  maxValue?: number;
}

export type ValidationRule =
  | ValidationRuleRequired
  | ValidationRuleEmail
  | ValidationRuleLength
  | ValidationRuleRange;

// ============ ValidationMessage ============

export interface ValidationMessageProps {
  id?: string;
  /** Validation text. The primary prop — established React form-library convention. */
  message?: string | React.ReactNode;
  /** Alias for `message`. */
  children?: React.ReactNode;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
}

// ============ Validation (rule engine) ============

export interface ValidationProps {
  id?: string;
  /** Pre-resolved validation message. When set, takes precedence over rule output. */
  message?: string | React.ReactNode;
  /** Rules to evaluate against `value`. First failing rule wins. */
  rules?: ValidationRule[];
  /** Value to validate. */
  value?: string | number | null;
  /** Fires every render with the validity boolean — `true` when all rules pass. */
  onValidation?: (isValid: boolean) => void;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
}

export const Validation: React.FC<ValidationProps>;
export const ValidationMessage: React.FC<ValidationMessageProps>;
