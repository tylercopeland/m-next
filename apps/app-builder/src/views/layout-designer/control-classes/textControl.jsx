import { complexValueTypes, widgets } from '@m-next/types';
import { createBaseControl, ValidationRuleTypes } from '@m-next/runtime-interface';

export const textVersion = '1.0.0';

const addDefaultValidationRules = (control) => {
  if (!control?.validationRules || control.validationRules.length === 0) {
    return [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ];
  }
  return control.validationRules;
};

export const createTextControl = (    
  base = {
    id: null,
    hideCaption: false,
    caption: '',
    content: '',
    classes: '',
    name: 'text',
    widthType: 'full',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
    onBlur: null,
    onChange: null,
    onClick: null,
    onFocus: null,
  },
) => ({
  ...createBaseControl(base),
  type: widgets.LABEL,
  validationRules: addDefaultValidationRules(data),
  onBlur: data.onBlur || null,
  onChange: data.onChange || null,
  onClick: data.onClick || null,
  onFocus: data.onFocus || null,
});

const migrateTextStyles = (control) => {
  // Extract style properties from classes
  const extractFontWeight = (classes) => {
    if (classes?.includes('mi-text-bold')) return 'bold';
    if (classes?.includes('mi-text-bolder')) return 'bolder';
    return 'regular';
  };

  const extractFontColor = (classes) => {
    if (classes?.includes('mi-caption-grey')) return 'grey-light';
    if (classes?.includes('mi-caption-dark-grey')) return 'grey-darker';
    if (classes?.includes('mi-caption-alert')) return 'red';
    if (classes?.includes('mi-caption-pink')) return 'fuchsia';
    if (classes?.includes('mi-caption-purple')) return 'purple';
    if (classes?.includes('mi-caption-primary')) return 'blue';
    if (classes?.includes('mi-caption-aqua')) return 'teal';
    if (classes?.includes('mi-caption-success')) return 'green';
    if (classes?.includes('mi-caption-yellow')) return 'yellow';
    if (classes?.includes('mi-caption-caution')) return 'orange';
    if (classes?.includes('mi-caption-black')) return 'black';
    if (classes?.includes('mi-caption-white')) return 'white';
    if (classes?.includes('mi-caption-navigation')) return 'blue-darker';
    return 'grey-darker'; // default
  };

  const extractTextAlignment = (classes) => {
    if (classes?.includes('mi-text-center')) return 'center';
    if (classes?.includes('mi-text-right')) return 'right';
    if (classes?.includes('mi-text-justify')) return 'justify';
    if (classes?.includes('mi-text-left')) return 'left';
    return null; // default, theres something called 'Regular'
  };

  const extractTextSize = (classes) => {
    if (classes?.includes('mi-caption-font-xxlarge')) return 'XX-Large';
    if (classes?.includes('mi-caption-font-xlarge')) return 'X-Large';
    if (classes?.includes('mi-caption-font-large')) return 'Large';
    if (classes?.includes('mi-caption-font-normal')) return 'Normal';
    if (classes?.includes('mi-caption-font-small')) return 'Small';
    if (classes?.includes('mi-caption-font-x-small')) return 'X-Small';
    if (classes?.includes('mi-caption-font-xx-small')) return 'XX-Small';
    return 'Regular'; // default
  };

  return {
    fontWeight: extractFontWeight(control.classes),
    fontColor: extractFontColor(control.classes),
    textAlignment: extractTextAlignment(control.classes),
    textSize: extractTextSize(control.classes),
  };
};

export const migrateTextControl = (oldControl) => {
  if (oldControl.version === textVersion) {
    return null;
  }

  let migrated = false;
  const updated = {
    ...oldControl,
    widthType: oldControl.widthType ?? 'full',
    version: textVersion
  };

  // Migrate styles from top-level properties or classes to styles object
  if (!updated.styles || Object.keys(updated.styles).length === 0) {
    migrated = true;
    
    // Priority: top-level properties > classes > defaults
    const extractedStyles = migrateTextStyles(oldControl);
    updated.styles = {
      fontWeight: oldControl.fontWeight || extractedStyles.fontWeight,
      fontColor: oldControl.fontColor || extractedStyles.fontColor,
      textAlignment: oldControl.textAlignment || extractedStyles.textAlignment,
      textSize: oldControl.textSize || extractedStyles.textSize,
      fontSize: oldControl.fontSize || undefined,
    };

    // Remove top-level style properties after migration
    delete updated.fontWeight;
    delete updated.fontColor;
    delete updated.textAlignment;
    delete updated.textSize;
    delete updated.fontSize;
  }

  // Handle defaultValue migration
  if (updated.defaultValue && typeof updated.defaultValue === 'string') {
    updated.defaultValue = {
      value: updated.defaultValue,
      valueType: complexValueTypes.Text,
    };
  }

  updated.validationRules = addDefaultValidationRules(updated);

  return migrated ? updated : null;
};

export default createTextControl;
