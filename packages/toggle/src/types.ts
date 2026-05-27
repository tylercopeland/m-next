import type { Ref, CSSProperties } from 'react';

/** Display option for runtime toggle: no labels, or Yes/No, On/Off, True/False */
export type ToggleTextOpt = 'Blank' | 'Yes/No' | 'On/Off' | 'True/False';

/** Size variant for the toggle control */
export type ToggleSize = 'small' | 'medium' | 'large';

export interface ToggleProps {
  id: string;
  disabled?: boolean;
  checked?: boolean;
  // eslint-disable-next-line no-unused-vars -- callback param for type signature only
  onChange?: ((checked: boolean) => void) | null;
  onBlur?: (() => void) | null;
  onFocus?: (() => void) | null;
  alignRight?: boolean;
  isRuntime?: boolean;
  isV4Design?: boolean;
  textOpt?: ToggleTextOpt;
  width?: string;
  color?: string | null;
  label?: string | null;
  forwardRef?: Ref<HTMLInputElement> | null;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
  legacyClass?: string | null;
  bold?: boolean;
  tooltip?: string;
  tooltipId?: string;
  icon?: string;
  size?: ToggleSize;
}
