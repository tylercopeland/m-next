import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';
import { ValidationRule } from '../validationRule';

export interface InputControl extends BaseControl {
  rows?: number;
  placeholder?: string;
  inputType: string;
  validationRules?: ValidationRule[];
  formatRounding?: number;
}

export interface InputControlInput extends BaseControlInput {
  rows?: number;
  placeholder?: string;
  inputType?: string;
  validationRules?: ValidationRule[];
}

export const createInputControl = (data: InputControlInput = {}): InputControl => ({
  ...createBaseControl(data),
  type: data.type || 'input',
  name: data.name || 'input',
  rows: data.rows || undefined,
  placeholder: data.placeholder || '',
  inputType: data.inputType || 'text',
  validationRules: data.validationRules || [],
});

export default createInputControl;
