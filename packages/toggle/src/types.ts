import type { Ref, CSSProperties } from 'react';

/** Display option for runtime toggle: no labels, or Yes/No, On/Off, True/False */
export type ToggleTextOpt = 'Blank' | 'Yes/No' | 'On/Off' | 'True/False';

/** Size variant for the toggle control */
export type ToggleSize = 'small' | 'medium' | 'large';

export interface ToggleProps {
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
