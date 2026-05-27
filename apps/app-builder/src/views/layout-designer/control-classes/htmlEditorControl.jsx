import { complexValueTypes, widgets } from '@m-next/types';
import { createBaseControl, ValidationRuleTypes } from '@m-next/runtime-interface';

export const htmlEditorVersion = '1.0.0';

const addDefaultValidationRules = (control) => {
  if (!control?.validationRules || control.validationRules.length === 0) {
    return [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ];
  }
  return control.validationRules;
};

export const createHtmlEditorControl = (
  base = {
    id: null,
    hideCaption: false,
    caption: '',
    classes: '',
    name: 'htmlEditor',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
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
  type: widgets.HTMLEDITOR,
  validationRules: addDefaultValidationRules(data),
  onBlur: data.onBlur || null,
  onChange: data.onChange || null,
  onClick: data.onClick || null,
  onFocus: data.onFocus || null,
});

export const migrateHtmlEditorControl = (oldControl) => {
  if (oldControl.version === htmlEditorVersion) {
    return null;
  }

  const updated = { ...oldControl, version: htmlEditorVersion };

  if (updated.defaultValue && typeof updated.defaultValue === 'string') {
    updated.defaultValue = {
      value: updated.defaultValue,
      valueType: complexValueTypes.Text,
    };
  }

  updated.validationRules = addDefaultValidationRules(updated);

  return updated;
};

export default createHtmlEditorControl; 