/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import { CSSProperties } from 'react';

export type RadioButtonDirection = 'row' | 'column';

export interface RadioButtonProps {
  /** Optional — auto-generated if absent. */
  id?: string;
  label: string;
  name?: string;
  value: string | number;
  /** Whether the radio is selected. */
  checked?: boolean;
  direction?: RadioButtonDirection;
  disabled?: boolean;
  /** When true and `checked` is true, the radio receives DOM focus on mount/update. */
  isFocused?: boolean;
  widthType?: string;
  rowItemWidth?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tabIndex?: number;
  /** Indicator color (border + fill). Defaults to `colors.blue.base`. */
  color?: string;
  customFontSize?: string;
  style?: CSSProperties;
  narrow?: boolean;
  labelStyle?: CSSProperties;
  /** Tooltip help text shown via an info icon. */
  hint?: string;
  bold?: boolean;
  marginBottom?: number;

  /** Standard React ARIA attributes — pass through to the native `<input type="radio">`. */
  'aria-checked'?: boolean | 'mixed';
  'aria-labelledby'?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use the standard `aria-checked` attribute. */
  ariaChecked?: boolean;
  /** @deprecated Use `color`. */
  customColor?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

// ===================================================================
// RadioGroup
// ===================================================================

export interface RadioGroupOption {
  id?: string;
  label: string;
  value: string | number;
  subtext?: React.ReactNode;
  disabled?: boolean;
  hint?: string;
}

export interface RadioGroupProps {
  /** Optional — auto-generated if absent. */
  id?: string;
  /** Native radio group name. Form-event payload uses this as `event.target.name`. */
  name?: string;
  options: RadioGroupOption[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
  selectedValue?: string | number;
  disabled?: boolean;
  direction?: RadioButtonDirection;
  widthType?: string;
  width?: string;
  /** When true and the selected radio is on screen, it receives DOM focus on mount. */
  isFocused?: boolean;
  /** Group accessible name. Renders a `<Caption>` and wires `aria-labelledby`. */
  label?: string;
  /** Indicator color forwarded to each `RadioButton`. Defaults to `colors.blue.base`. */
  color?: string;
  /** Label font size forwarded to each `RadioButton`. */
  fontSize?: string;
  style?: CSSProperties;
  className?: string;
  wrapperStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  narrow?: boolean;
  bold?: boolean;
  gap?: number;
  minWidth?: number;
  allowWrap?: boolean;

  /** Standard React ARIA attributes. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  /** Explicit override for `aria-labelledby`. Prefer the standard attr above. */
  labelledBy?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use `color`. */
  customColor?: string;
  /** @deprecated Use `fontSize`. */
  customFontSize?: string;
  /** @deprecated Use `className` / `style`. */
  legacyClass?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect. */
  isRuntime?: boolean;
  /** @deprecated No longer has any effect — omit `label` to hide the caption. */
  hideCaption?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — use `id`. */
  controlId?: string;
}

// ===================================================================
// ButtonRadioGroup
// ===================================================================

export interface ButtonRadioGroupOption {
  label: string;
  value: string | number;
}

export interface ButtonRadioGroupProps {
  /** Optional — auto-generated if absent. */
  id?: string;
  options: ButtonRadioGroupOption[];
  onChange?: (item: ButtonRadioGroupOption) => void;
  selectedValue?: string | number;
  widthType?: string;
  width?: string;
  style?: CSSProperties;
  buttonWidth?: string | number;
  isOneLine?: boolean;
  disabled?: boolean;
  /** Group accessible name. Renders a `<Caption>` and wires `aria-labelledby`. */
  label?: string;

  /** Standard React ARIA attributes. */
  'aria-label'?: string;
  'aria-labelledby'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — use `id`. */
  controlId?: string;
}

// ===================================================================
// IconRadioGroup
// ===================================================================

export interface IconRadioGroupOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface IconRadioGroupProps {
  /** Optional — auto-generated if absent. */
  id?: string;
  options: IconRadioGroupOption[];
  onChange?: (item: IconRadioGroupOption) => void;
  selectedValue?: string | number;
  widthType?: string;
  width?: string;
  style?: CSSProperties;
  disabled?: boolean;
  /** Group accessible name. Renders a `<Caption>` and wires `aria-labelledby`. */
  label?: string;

  /** Standard React ARIA attributes. */
  'aria-label'?: string;
  'aria-labelledby'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect — use `id`. */
  controlId?: string;
}

export const RadioButton: React.ForwardRefExoticComponent<
  RadioButtonProps & React.RefAttributes<HTMLInputElement>
>;
export const RadioGroup: React.ForwardRefExoticComponent<
  RadioGroupProps & React.RefAttributes<HTMLDivElement>
>;
export const ButtonRadioGroup: React.ForwardRefExoticComponent<
  ButtonRadioGroupProps & React.RefAttributes<HTMLDivElement>
>;
export const IconRadioGroup: React.ForwardRefExoticComponent<
  IconRadioGroupProps & React.RefAttributes<HTMLDivElement>
>;
export default RadioGroup;
