/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export interface ButtonGroupDataItem {
  /** Stable value associated with the item — used for `selected` matching. */
  value: string | number | boolean;
  label?: string | React.ReactNode;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
  labelStyle?: React.CSSProperties;
}

export interface ButtonGroupProps {
  /** Items rendered in the group. The shape mirrors the legacy API and is
   *  retained for source compatibility — the architectural cleanup is tracked
   *  separately. */
  data: ButtonGroupDataItem[];
  /** Visual treatment for the primary button. */
  buttonStyle?: 'primary' | 'ghost' | 'plain' | 'calendarMenu';
  disabled?: boolean;
  /** Optional — auto-generated when omitted. */
  id?: string;
  /** Render in split-button / dropdown mode. The primary action toggles the menu. */
  isDropdown?: boolean;
  label?: string;
  margin?: string;
  onClick?: (item: ButtonGroupDataItem, index: number) => void;
  showCaption?: boolean;
  width?: string;
  forceOpenUp?: boolean;
  hasMenuLabel?: boolean;
  menuLabel?: string;
  size?: 'small' | 'medium';
  fillWidth?: boolean;
  /** Accessible name for the group. Falls back to `label`, then the primary
   *  button text, then a generic 'Button group'. */
  'aria-label'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;
  /** @deprecated Use `style` or compose the variant you need. */
  legacyClass?: string;
  /** @deprecated Use `buttonStyle` or pass `style` for one-off escape hatches. */
  backgroundColor?: string;
  /** @deprecated Use `buttonStyle` or pass `style` for one-off escape hatches. */
  color?: string;
  /** @deprecated Use `buttonStyle` or pass `style` for one-off escape hatches. */
  borderColor?: string;
  /** @deprecated Use `buttonStyle` or pass `style` for one-off escape hatches. */
  fontSize?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is now always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export interface ButtonGroupRowProps {
  data: ButtonGroupDataItem[];
  /** Optional — auto-generated when omitted. */
  id?: string;
  selected?: string | number | boolean;
  onClick?: (item: ButtonGroupDataItem, index: number) => void;
  tooltipId?: string;
  tooltipPlace?: string;
  width?: string | number;
  /** Accessible name for the row. Defaults to 'Button group'. */
  'aria-label'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect. */
  isMobile?: boolean;
  /** @deprecated Use `style` or compose the variant you need. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export const ButtonGroup: React.ForwardRefExoticComponent<
  ButtonGroupProps & React.RefAttributes<HTMLDivElement>
>;
export const ButtonGroupRow: React.ForwardRefExoticComponent<
  ButtonGroupRowProps & React.RefAttributes<HTMLDivElement>
>;
export default ButtonGroup;
