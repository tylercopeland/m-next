import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

export interface ToggleControl extends BaseControl {
  checked?: boolean;
  value?: boolean;
  onLabel?: string;
  offLabel?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface ToggleControlInput extends BaseControlInput {
  checked?: boolean;
  value?: boolean;
  onLabel?: string;
  offLabel?: string;
  size?: 'small' | 'medium' | 'large';
}

export const createToggleControl = (data: ToggleControlInput = {}): ToggleControl => ({
  ...createBaseControl(data),
  type: data.type || 'toggle',
  name: data.name || 'toggle',
  checked: data.checked || false,
  value: data.value || false,
  onLabel: data.onLabel || 'On',
  offLabel: data.offLabel || 'Off',
  size: data.size || 'medium',
});

export default createToggleControl;
