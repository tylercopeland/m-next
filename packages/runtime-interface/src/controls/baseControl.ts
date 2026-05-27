import { Guid } from '@m-next/utilities';
import { ComplexValueType } from '@m-next/types';
import { ValidationRule } from '../validationRule';

// Control width types
export type WidthType = 'fixed' | 'auto' | 'full' | null;

// Default value types for controls
export type ControlValue = string | number | boolean | null | undefined | ComplexValueType;
export interface ControlListItem {
  id: string;
  name: string;
  isBound: boolean;
}

// Base control interface that all controls will extend
export interface BaseControl extends ControlListItem {
  type: string | null;
  typeOverride?: string | null;
  hideCaption: boolean;
  caption?: string;
  classes?: string; // Array of classes for styling
  widthType?: WidthType;
  width?: number | string | null;
  height?: number | string | null;
  visible: boolean;
  disabled: boolean;
  defaultValue?: ControlValue;
  styles?: Record<string, unknown> | null; // Styles can be any object, or null if not defined
  onClick?: string | null;
  onBlur?: string | null;
  onChange?: string | null;
  onFocus?: string | null;
  validationRules?: ValidationRule[] | unknown | null;
  validationError?: string | null;
  isWorking: boolean; // Indicates if the control is currently processing
  version?: string; // Optional version for control migrations
  containerId?: string; // Optional container ID for nested controls
}
// Input data interface - all properties are optional
export interface BaseControlInput {
  id?: string | null;
  type?: string | null;
  typeOverride?: string | null;
  hideCaption?: boolean;
  caption?: string;
  classes?: string;
  className?: string;
  name?: string;
  widthType?: WidthType;
  width?: number | string | null;
  height?: number | string | null;

  visible?: boolean;
  disabled?: boolean;
  isBound?: boolean;
  defaultValue?: ControlValue;
  isWorking?: boolean;
}

// Factory function with proper typing
export const createBaseControl = (data: BaseControlInput = {}): BaseControl => ({
  id: data.id || Guid.create(),
  type: data.type || null,
  typeOverride: data.typeOverride || null,
  hideCaption: data.hideCaption === undefined ? true : data.hideCaption,
  caption: data.caption || '',
  classes: data.classes || '',
  name: data.name || 'dropdown',
  widthType: data.widthType || 'auto',
  width: data.width || null,
  height: data.height || null,
  visible: data.visible === undefined ? true : data.visible,
  disabled: data.disabled === undefined ? false : data.disabled,
  isBound: data.isBound === undefined ? false : data.isBound,
  defaultValue: data.defaultValue || null,
  styles: null,
  onClick: null,
  onFocus: null,
  validationRules: null,
  validationError: null,
  isWorking: data.isWorking === undefined ? false : data.isWorking,
});

export default createBaseControl;
