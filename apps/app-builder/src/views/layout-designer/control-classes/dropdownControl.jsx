import { widgets, complexValueTypes } from '@m-next/types';
import { createBaseControl, createBasePaging, createBaseFilter, ValidationRuleTypes } from '@m-next/runtime-interface';

export const dropdownVersion = '2.0.1';

const createDropdownModel = (
  data = {
    columns: [],
    viewName: null,
    distinct: false,
    paging: null,
    viewFilter: null,
  },
) => ({
  columns: data?.columns || [],
  viewName: data?.viewName || null,
  distinct: data?.distinct || false,
  paging: data?.paging || createBasePaging({ pageNumber: 1, pageSize: 50 }),
  viewFilter: data?.viewFilter || createBaseFilter({ filterName: 'DrpFilter', viewName: data?.viewName }),
});

const addPreventMaliciousValuesValidationRule = (control) => {
  if (!control?.validationRules || control.validationRules.length === 0) {
    return [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }];
  }
  if (
    control.validationRules.length > 0 &&
    !control.validationRules.some((rule) => rule.rule === ValidationRuleTypes.MaliciousValues)
  ) {
    return [...control.validationRules, { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }];
  }
  return control.validationRules;
};

export const createDropdownControl = (
  base = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'dropdown',
    widthType: 'full',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
    placeholder: null,
    model: null,
    validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
    onBlur: null,
    onLoseFocus: null,
    onCustomRowClick: null,
    onChange: null,
    customRowText: null,
  },
) => ({
    ...createBaseControl(base),
    model: { ...createDropdownModel(data?.model) },
    type: widgets.DROPDOWN,
    placeholder: data.placeholder || null,
    validationRules: addPreventMaliciousValuesValidationRule(data),
    onBlur: data.onBlur || null,
    onLoseFocus: data.onLoseFocus || null,
    onCustomRowClick: data.onCustomRowClick || null,
    onChange: data.onChange || null,
    customRowText: data.customRowText || null,
  });

export const migrateDropdownControl = (oldControl) => {
  if (oldControl.version === dropdownVersion) {
    return null;
  }

  const updated = { ...oldControl, version: dropdownVersion };
  if (updated.defaultValue && typeof updated.defaultValue === 'string') {
    updated.defaultValue = {
      value: updated.defaultValue,
      valueType: complexValueTypes.Text,
    };
  }

  updated.validationRules = addPreventMaliciousValuesValidationRule(updated);

  return updated;
};

export default createDropdownControl;
