import { BaseControl } from '@m-next/runtime-interface';

export interface DateTimePickerModel extends BaseControl {
  id: string;
  name: string;
  caption: string;
  hideCaption: boolean;
  placeholder: string;
  useDateFormatPlaceholder: boolean;
  formatType: string;
  format: string;
  isBound: boolean;
  fieldType: string;
   
  defaultValue: unknown;
  onChange?: string;
   
  validationRules?: Array<{ rule: number; value: unknown; canDelete?: boolean }>;
}

export default DateTimePickerModel;
