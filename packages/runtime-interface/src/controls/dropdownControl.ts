import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownControl extends BaseControl {
  options?: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  value?: string | number | string[] | number[];
  onCustomRowClick?: string;
  customRowText?: string;
  isDisabled: boolean;
  isMultiSelect: boolean;
  isClearable: boolean;
  isFilterable?: boolean; // Backwards compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model?: any;
  // Backwards compatibility properties for LayoutCanvasWrapper
  selectedValue?: unknown;
  allowMultiple?: boolean;
}

export interface DropdownControlInput extends BaseControlInput {
  options?: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  value?: string | number | string[] | number[];
}

export const createDropdownControl = (data: DropdownControlInput = {}): DropdownControl => ({
  ...createBaseControl(data),
  type: data.type || 'DRP',
  name: data.name || 'dropdown',
  options: data.options || [],
  placeholder: data.placeholder || 'Select an option',
  searchable: data.searchable || false,
  clearable: data.clearable || false,
  multiple: data.multiple || false,
  value: data.value || undefined,
  isDisabled: false,
  isMultiSelect: false,
  isClearable: false,
});

export default createDropdownControl;
