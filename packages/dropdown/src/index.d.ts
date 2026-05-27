/* eslint-disable no-unused-vars */
import * as React from 'react';

export interface DropdownOption {
  label: string;
  value: string | number | boolean;
  lines?: string[] | null;
  secondary?: string;
  icon?: string;
  color?: string;
  size?: number;
}

export interface DropdownOptionGroup {
  label: string;
  options: DropdownOption[];
}

export interface DropdownProps {
  id?: string;
  displayAuto?: boolean;
  width?: number | string;
  validationMessage?: string;
  isV4Design?: boolean;
  caption?: string;
  required?: boolean;
  legacyClass?: string;
  isMobile?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options: DropdownOption[] | DropdownOptionGroup[];
  value?: DropdownOption | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: DropdownOption, actionMeta: any) => void;
  onBlur?: () => void;
  hasValidation?: boolean;
  dropdownStyle?: 'single' | 'icon' | 'multi' | 'multi-icon';
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: Record<string, any>;
  background?: string;
  isMultiSelect?: boolean;
  isCreateable?: boolean;
  isSearchable?: boolean;
  onCreate?: (value: string) => void;
  actionButtonText?: string;
  isPortal?: boolean;
  onActionButtonClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef?: React.RefObject<any>;
  openMenuOnFocus?: boolean;
  breakout?: boolean;
  isLoading?: boolean;
  hasDividersInsteadOfHeaders?: boolean;
  isClearable?: boolean;
  maxMenuHeight?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInputChange?: (value: string, actionMeta?: any) => void;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  menuIsOpen?: boolean;
  ariaLabel?: string;
  open?: boolean;
  autoFocus?: boolean;
  menuMinWidth?: number | string;
  hideBorderWhenNotActive?: boolean;
  onMenuScrollToBottom?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOption?: (option: any, inputValue: string) => boolean;
}

export interface ClickToEditDropdownProps {
  id?: string | number;
  options: DropdownOption[];
  value?: DropdownOption;
  onChange?: (value: DropdownOption) => void;
  disabled?: boolean;
  placeholder?: string;
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: Record<string, any>;
  dropdownStyle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styleDropdownComponent?: Record<string, any>;
  labelPlaceholder?: string;
  bold?: boolean;
  isPortal?: boolean;
}

export interface DropdownAsyncProps extends Omit<DropdownProps, 'onLoadData'> {
  onLoadData: (inputValue: string) => Promise<DropdownOption[]>;
}

export const Dropdown: React.FC<DropdownProps>;
export const ClickToEditDropdown: React.FC<ClickToEditDropdownProps>;
export const DropdownAsync: React.FC<DropdownAsyncProps>;

export default Dropdown;
