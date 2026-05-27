/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type InputIntent = 'error' | 'warning' | 'informative';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
  id?: string;
  label?: string | null;
  name?: string | null;
  type?: string;
  value?: string | number | object | null;
  placeholder?: string | null;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  tabIndex?: number;

  /** Optional leading icon (ReactNode). */
  leftIcon?: React.ReactNode;
  /** Optional trailing content (text, button, badge — any ReactNode). */
  rightContent?: React.ReactNode;

  /** When set, the input shows an error state and renders this as a validation message. */
  errorMessage?: string | React.ReactNode | null;
  /** Visual intent for the message. Use 'informative' to render below-input hints instead of errors. */
  intent?: InputIntent;
  /** Hide the label visually (still announced via aria-label). */
  hideLabel?: boolean;

  width?: string | number;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  minLength?: number;
  maxLength?: number;
  minValue?: number | null;
  maxValue?: number | null;
  selectOnFocus?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `readOnly` (React casing). */
  readonly?: boolean;
  /** @deprecated Use `leftIcon` as a ReactNode. */
  prefixIcon?: string;
  /** @deprecated Use `rightContent` ReactNode. */
  suffixText?: string;
  /** @deprecated Use the standard `aria-describedby` attribute. */
  ariaDescribedby?: string;
  /** @deprecated Use `hideLabel`. */
  hideCaption?: boolean;
  /** @deprecated Use `intent`. */
  infoLevel?: InputIntent;
  /** @deprecated Use `errorMessage`. */
  validationMessage?: string | React.ReactNode | null;
  /** @deprecated The Validation orchestration is still available via this flag, but the recommended pattern is consumer-driven validation that sets `errorMessage` directly. */
  useValidation?: boolean;
  /** @deprecated Use consumer-driven validation. */
  onValidation?: (e: any) => void;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render instead. */
  hidden?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect. */
  isLabelBolded?: boolean;
  /** @deprecated No longer has any effect — wrap the input in a styled container yourself. */
  innerStyle?: React.CSSProperties;
  /** @deprecated No longer has any effect. */
  background?: string;
}

export interface DebouncedInputProps extends InputProps {
  caption?: string;
  onRawChange?: (value: string | number | object) => void;
  onBlur?: (value: any) => void;
  onChange?: (value: any) => void;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  resetOnBlank?: boolean;
  updateRawValue?: boolean;
  infoMessage?: string;
  initialValue?: string | number | object;
  truncate?: boolean;
  onLengthValid?: (isValid: boolean) => void;
}

export const Input: React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
>;
export const DebouncedInput: React.FC<DebouncedInputProps>;
export default Input;
