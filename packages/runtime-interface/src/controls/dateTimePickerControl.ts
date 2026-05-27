import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';
import { widgets } from '@m-next/types';

export interface DateTimePickerComplexValue {
  Value?: string;
  value?: string;
  ValueType?: string;
  valueType?: string;
}

export interface DateTimePickerControl extends Omit<BaseControl, 'defaultValue'> {
  value?: string | Date | null;
  format?: string;
  showTime?: boolean;
  placeholder?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  timeFormat?: '12' | '24';
  componentVersion?: string;
  useDateFormatPlaceholder?: boolean;
  dtFormat?: string;
  formatType?: string;
  defaultValue?: string | DateTimePickerComplexValue | null;
}

export interface DateTimePickerControlInput extends Omit<BaseControlInput, 'defaultValue'> {
  value?: string | Date | null;
  format?: string;
  showTime?: boolean;
  placeholder?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  timeFormat?: '12' | '24';
  componentVersion?: string;
  useDateFormatPlaceholder?: boolean;
  dtFormat?: string;
  formatType?: string;
  defaultValue?: string | DateTimePickerComplexValue | null;
}

export const createDateTimePickerControl = (data: DateTimePickerControlInput = {}): DateTimePickerControl => {
  const baseControl = createBaseControl({
    id: data.id,
    type: data.type,
    typeOverride: data.typeOverride,
    hideCaption: data.hideCaption,
    caption: data.caption,
    classes: data.classes,
    className: data.className,
    name: data.name,
    widthType: data.widthType,
    width: data.width,
    height: data.height,
    visible: data.visible,
    disabled: data.disabled,
    isBound: data.isBound,
    isWorking: data.isWorking,
  });

  return {
    ...baseControl,
    type: data.type || widgets.DATETIMEPICKER,
    name: data.name || 'datetimepicker',
    value: data.value ?? undefined,
    format: data.format || 'MM/dd/yyyy',
    showTime: data.showTime || false,
    placeholder: data.placeholder || 'Select date',
    minDate: data.minDate ?? undefined,
    maxDate: data.maxDate ?? undefined,
    timeFormat: data.timeFormat || '12',
    componentVersion: data.componentVersion,
    useDateFormatPlaceholder: data.useDateFormatPlaceholder,
    dtFormat: data.dtFormat,
    formatType: data.formatType,
    defaultValue: data.defaultValue,
  };
};

export default createDateTimePickerControl;
