/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'onBlur' | 'onFocus' | 'onKeyDown'> {
  /** Auto-generated if not supplied. */
  id?: string;
  name?: string | null;
  label?: string | React.ReactNode | null;
  checked?: boolean | string;
  /** Indeterminate / tri-state visual. */
  halfChecked?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number;

  /** Layout alignment of the box vs its label. */
  align?: 'left' | 'center' | 'right';
  /** Rounded square (8px radius) instead of the default 4px. */
  rounded?: boolean;
  /** Removes the default 14px bottom margin. */
  narrow?: boolean;
  /** Stretch the label to fill remaining horizontal space. */
  fullWidth?: boolean;
  /** Bold label text. */
  bold?: boolean;
  /** Hide the label visually (still announced via aria). */
  hideLabel?: boolean;
  /** When true (default), the label dims to 50% opacity when disabled. */
  disableLabel?: boolean;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;

  /** Receives the new boolean state. */
  onChange?: (checked: boolean) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. Still receives an imperative handle of `{ blur, focus, select }`. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `hideLabel`. */
  hideCaption?: boolean;
  /** @deprecated Use `id`. Was used to give the label its own id; now derived from `id`. */
  controlId?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — use CSS media queries / responsive containers. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect — don't render the component instead. */
  hidden?: boolean;
  /** @deprecated No longer has any effect. Color/font variants previously toggled via class names should be expressed via theme or props. */
  legacyClasses?: string;
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
}

export interface CheckboxGroupItem extends CheckboxProps {
  id: string;
}

export interface CheckboxGroupProps {
  align?: 'vertical' | 'horizontal';
  items?: CheckboxGroupItem[];
  name?: string;
}

export const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLInputElement>
>;
export const CheckboxGroup: React.FC<CheckboxGroupProps>;
export default Checkbox;
