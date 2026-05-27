import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

export interface CheckboxControl extends BaseControl {
  checked?: boolean;
  indeterminate?: boolean;
  value?: boolean;
  label?: string;
  align?: 'left' | 'right' | 'center';
}

export interface CheckboxControlInput extends BaseControlInput {
  checked?: boolean;
  indeterminate?: boolean;
  value?: boolean;
  label?: string;
}

export const createCheckboxControl = (data: CheckboxControlInput = {}): CheckboxControl => ({
  ...createBaseControl(data),
  type: data.type || 'CHK',
  name: data.name || 'checkbox',
  checked: data.checked || false,
  indeterminate: data.indeterminate || false,
  value: data.value || false,
  label: data.label || '',
});

export default createCheckboxControl;
