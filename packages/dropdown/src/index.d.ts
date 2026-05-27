/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type DropdownVariant = 'single' | 'icon' | 'multi' | 'multi-icon';

export interface DropdownOption {
  label: string;
  value: string | number | boolean;
  lines?: string[] | null;
  secondary?: string;
  icon?: string;
  color?: string;
  size?: number;
  /** Family name used to colour multi-value pills (blue, green, red, etc.). */
  colour?: string;
  /** Pin the value so the remove (×) is hidden. */
  isFixed?: boolean;
}

export interface DropdownOptionGroup {
  label: string;
  options: DropdownOption[];
  icon?: string;
  color?: string;
  size?: number;
}

export interface DropdownProps {
  id?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  width?: number | string;
  options: DropdownOption[] | DropdownOptionGroup[];
  value?: DropdownOption | DropdownOption[] | null;

  /** When set, the dropdown shows an error state and renders this as a validation message. */
  errorMessage?: string | null;

  /** Visual layout variant. */
  variant?: DropdownVariant;

  onChange?: (value: DropdownOption | DropdownOption[] | null, actionMeta?: any) => void;
  onBlur?: () => void;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onInputChange?: (value: string, actionMeta?: any) => void;
  onMenuScrollToBottom?: () => void;

  isMultiSelect?: boolean;
  isCreatable?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;

  onCreate?: (value: string) => void;
  actionButtonText?: string;
  onActionButtonClick?: () => void;

  isPortal?: boolean;
  openMenuOnFocus?: boolean;
  breakout?: boolean;
  hasDividersInsteadOfHeaders?: boolean;
  maxMenuHeight?: number | string;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  menuIsOpen?: boolean;
  open?: boolean;
  autoFocus?: boolean;
  clearOnSelect?: boolean;
  formatCreateLabel?: (input: string) => React.ReactNode;
  disableSearchHighlight?: boolean;
  menuMinWidth?: number | string;
  hideBorderWhenNotActive?: boolean;
  filterOption?: (option: any, inputValue: string) => boolean;
  hasValidation?: boolean;

  style?: React.CSSProperties;

  /** Standard accessible name when no visible label is rendered. */
  'aria-label'?: string;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use `variant`. */
  dropdownStyle?: DropdownVariant;
  /** @deprecated Use `errorMessage`. */
  validationMessage?: string;
  /** @deprecated Typo. Use `isCreatable`. */
  isCreateable?: boolean;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.RefObject<any>;
  /** @deprecated Use `aria-label` (standard React attr). */
  ariaLabel?: string;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect — V4 styling is always on. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  background?: string;
}

export interface ClickToEditDropdownProps {
  id?: string | number;
  options: DropdownOption[];
  value?: DropdownOption;
  onChange?: (value: DropdownOption) => void;
  disabled?: boolean;
  placeholder?: string;
  color?: string;
  style?: Record<string, any>;
  dropdownStyle?: string;
  styleDropdownComponent?: Record<string, any>;
  labelPlaceholder?: string;
  bold?: boolean;
  isPortal?: boolean;
}

export interface DropdownAsyncProps extends Omit<DropdownProps, 'onLoadData'> {
  onLoadData: (inputValue: string) => Promise<DropdownOption[]>;
}

export const Dropdown: React.ForwardRefExoticComponent<
  DropdownProps & React.RefAttributes<any>
>;
export const ClickToEditDropdown: React.FC<ClickToEditDropdownProps>;
export const DropdownAsync: React.FC<DropdownAsyncProps>;

export default Dropdown;
