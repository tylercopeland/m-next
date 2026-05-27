import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';
import { ValidationRule } from '../validationRule';

export interface TextAreaControl extends BaseControl {
  rows?: number;
  placeholder?: string;
  validationRules?: ValidationRule[];
  maxLength?: number;
  minLength?: number;
  resizable?: boolean;
}

export interface TextAreaControlInput extends BaseControlInput {
  rows?: number;
  placeholder?: string;
  validationRules?: ValidationRule[];
  maxLength?: number;
  minLength?: number;
  resizable?: boolean;
}

export const createTextAreaControl = (data: TextAreaControlInput = {}): TextAreaControl => ({
  ...createBaseControl(data),
  type: data.type || 'textArea',
  name: data.name || 'textArea',
  rows: data.rows || 4,
  placeholder: data.placeholder || 'Enter text...',
  validationRules: data.validationRules || [],
  maxLength: data.maxLength,
  minLength: data.minLength,
  resizable: data.resizable !== undefined ? data.resizable : false,
});

export default createTextAreaControl;
