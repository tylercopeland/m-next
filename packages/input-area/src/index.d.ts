/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type TextareaIntent = 'error' | 'warning' | 'informative';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> {
  id?: string;
  label?: string | null;
  name?: string | null;
  value?: string | number | null;
  placeholder?: string | null;
  required?: boolean;
  disabled?: boolean;
  tabIndex?: number;

  /** When set, the textarea shows an error state and renders this as a validation message. */
  errorMessage?: string | React.ReactNode | null;
  /** Visual intent for the message. */
  intent?: TextareaIntent;
  /** Hide the label visually (still announced via aria-label). */
  hideLabel?: boolean;
  /** Read-only state. */
  readOnly?: boolean;

  /** Auto-grow the textarea height as content increases (up to `maxHeight`). */
  autoGrow?: boolean;
  /** Disable user resize handle. Native `resize` prop still wins if provided. */
  disableResize?: boolean;
  /** Native CSS `resize` value: 'none' | 'both' | 'horizontal' | 'vertical'. */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /** Max height in pixels for `autoGrow`. */
  maxHeight?: number;
  /** Starting height in pixels. */
  initialHeight?: number;
  /** Native rows attribute. */
  rows?: number;
  /** Native cols attribute. */
  cols?: number;

  width?: string | number;
  style?: React.CSSProperties;

  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;

  /** Selects content when focused. */
  selectOnFocus?: boolean;
  /** Editable grid up/down navigation callback. */
  navigateGrid?: (direction: 'up' | 'down') => void;
  /** Blur the textarea on Enter (used in editable grid cells). */
  isBlurOnSubmit?: boolean;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `readOnly` (React casing). */
  readonly?: boolean;
  /** @deprecated Use the standard `aria-describedby` attribute. */
  ariaDescribedby?: string;
  /** @deprecated Use the standard `aria-label` attribute. */
  ariaLabel?: string;
  /** @deprecated Use `hideLabel`. */
  hideCaption?: boolean;
  /** @deprecated Use `intent`. */
  infoLevel?: TextareaIntent;
  /** @deprecated Use `errorMessage`. */
  validationMessage?: string | React.ReactNode | null;

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
}

/** @deprecated Prefer `TextareaProps`. */
export type InputAreaProps = TextareaProps;

export interface DebouncedTextareaProps extends TextareaProps {
  onChange?: (value: string | number) => void;
}

/** @deprecated Prefer `DebouncedTextareaProps`. */
export type DebouncedInputAreaProps = DebouncedTextareaProps;

export const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
>;
export const InputArea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
>;
export const DebouncedTextarea: React.FC<DebouncedTextareaProps>;
export const DebouncedInputArea: React.FC<DebouncedTextareaProps>;
export default InputArea;
