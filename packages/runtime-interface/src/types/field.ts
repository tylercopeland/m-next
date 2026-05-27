// Import field types from the centralized location
import { FieldTypeId, FieldTypeName, DateFormatType } from './fieldTypes';

// Display options interfaces
export interface DateDisplayOptions {
  dateFormat: DateFormatType;
}

export interface DecimalDisplayOptions {
  decimalRounding: number;
}

export interface IconColorValue {
  icon: string;
  color: string;
}

export interface YesNoDisplayOptions {
  trueValue: string | IconColorValue;
  falseValue: string | IconColorValue;
}

export type DisplayOptions = DateDisplayOptions | DecimalDisplayOptions | YesNoDisplayOptions;

// Main Field interface - supports both ID and name-based field types
export interface Field {
  name: string;
  caption?: string;
  type: FieldTypeName;
  fieldTypeId?: FieldTypeId;
  value?: string | number | object;
  placeHolder?: string | number | object;
  isLinked?: boolean;
  isVisible?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  displayAs?: string;
  displayOptions?: DisplayOptions;
  size?: number;
}

// Runtime field interface with numeric field type ID
export interface RuntimeField extends Omit<Field, 'type' | 'fieldTypeId'> {
  fieldType: FieldTypeId;
  type?: FieldTypeName; // Optional for backward compatibility
}

export default Field;
