import type { Ref, CSSProperties, InputHTMLAttributes } from 'react';

/** Display option for runtime toggle: no labels, or Yes/No, On/Off, True/False */
export type ToggleTextOpt = 'Blank' | 'Yes/No' | 'On/Off' | 'True/False';

/** Size variant for the toggle control */
export type ToggleSize = 'small' | 'medium' | 'large';

/**
 * Standard DOM envelope. `className`/`style` land on the wrapper root; any
 * remaining input-typed attributes (`name`, `aria-*`, `data-*`, …) are spread
 * onto the inner `<input>`. Keys that `ToggleProps` redefines with a different
 * shape are omitted to avoid type conflicts.
 */
type ToggleInputAttributes = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onBlur' | 'onFocus' | 'color' | 'size' | 'style' | 'checked' | 'disabled'
>;

export interface ToggleProps extends ToggleInputAttributes {
  /** Applied to the wrapper root element. */
  className?: string;
  /** Optional. Auto-generated when not provided. */
  id?: string;
  disabled?: boolean;
  checked?: boolean;
  // eslint-disable-next-line no-unused-vars -- callback param for type signature only
  onChange?: ((checked: boolean) => void) | null;
  onBlur?: (() => void) | null;
  onFocus?: (() => void) | null;
  alignRight?: boolean;
  isRuntime?: boolean;
  textOpt?: ToggleTextOpt;
  width?: string;
  color?: string | null;
  label?: string | null;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  bold?: boolean;
  tooltip?: string;
  tooltipId?: string;
  icon?: string;
  size?: ToggleSize;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: Ref<HTMLInputElement> | null;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 design is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string | null;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
}
