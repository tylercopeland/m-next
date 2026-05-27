import { widgets, complexValueTypes } from '@m-next/types';
import { createBaseControl, ValidationRuleTypes } from '@m-next/runtime-interface';

export const datetimePickerVersion = '1.0.0';

const addPreventMaliciousValuesValidationRule = (control) => {
  if (!control?.validationRules || control.validationRules.length === 0) {
    return [
      { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ];
  } 
  if (control.validationRules.length > 0 
    && !control.validationRules.some((rule) => rule.rule === ValidationRuleTypes.MaliciousValues)) 
  {
    return [
      ...control.validationRules,
      { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ];
  }
  return control.validationRules;
};

export const createDatetimePickerControl = (
  base = {
    id: null,
    hideCaption: false,
    caption: '',
    classes: '',
    name: 'datetimePicker',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
    dtFormat: 'MMM-DD-YYYY',
    formatType: 'Short Date',
    placeholder: null,
    useDateFormatPlaceholder: false,
    validationRules: [
      { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ],
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
  },
) => ({
  ...createBaseControl(base),
  type: widgets.DTP,
  dtFormat: data.dtFormat || 'MMM-DD-YYYY',
  formatType: data.formatType || 'Short Date',
  placeholder: data.placeholder || null,
  useDateFormatPlaceholder: data.useDateFormatPlaceholder || false,
  validationRules: addPreventMaliciousValuesValidationRule(data),
  onBlur: data.onBlur || null,
  onChange: data.onChange || null,
  onClick: data.onClick || null,
  onFocus: data.onFocus || null,
});

export const migrateDatetimePickerControl = (oldControl) => {
  if (oldControl.version === datetimePickerVersion) {
    return null;
  }

  const updated = { ...oldControl, version: datetimePickerVersion };
  if (updated.defaultValue && typeof updated.defaultValue === 'string') {
    if (updated.defaultValue === 'today') {
      updated.defaultValue = {
        value: 'today',
        valueType: complexValueTypes.CurrentDate,
      };
      updated.value = 'today';
    } else {
      updated.value = updated.defaultValue;
      updated.defaultValue = {
        value: updated.defaultValue,
        valueType: complexValueTypes.Date,
      };
    }
  }

  updated.validationRules = addPreventMaliciousValuesValidationRule(updated);

  return updated;
};

export default createDatetimePickerControl;
