import { complexValueTypes, sessionLookup } from '@m-next/types';

const toBooleanYesNo = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === '') return false;
  }
  return Boolean(value);
};

const getComplexValueValue = (complexValue) => complexValue.value ?? complexValue.Value;

/**
 * Extracts value from a control based on its properties
 * @param {string} controlId - ID of the control
 * @param {Object} controlList - List of all controls
 * @returns {string} - Extracted value
 */
const getValueFromControl = (controlId, controlList) => {
  if (!controlId || !controlList || !controlList[controlId]) {
    return '';
  }

  const control = controlList[controlId];

  // For control values, check properties in order of priority
  if (control.defaultValue && typeof control.defaultValue === 'object') {
    // If the control has a complex defaultValue, recursively extract its value
    // eslint-disable-next-line no-use-before-define
    return getValueFromComplexValue(control.defaultValue, controlList);
  }

  if (control.defaultValue !== undefined && control.defaultValue !== null && control.defaultValue !== '') {
    // If the control has a simple defaultValue, use it
    return control.defaultValue;
  }

  if (control.value !== undefined && control.value !== null && control.value !== '') {
    // If the control has a value property, use it
    return control.value;
  }

  return '';
};

/**
 * Extracts value from a session key
 * @param {string} sessionKey - Session key
 * @returns {string} - Extracted value
 */
const getValueFromSession = (sessionKey) => {
  if (!sessionKey) {
    return '';
  }

  if (sessionLookup && sessionLookup[sessionKey]) {
    return sessionLookup[sessionKey] || '';
  }

  return sessionKey || '';
};

/**
 * Extracts value from a complex value object
 * @param {Object} complexValue - Complex value object
 * @param {Object} controlList - List of all controls
 * @returns {string} - Extracted value
 */
const getValueFromComplexValue = (complexValue, controlList) => {
  if (!complexValue) {
    return '';
  }

  if (typeof complexValue === 'string' || typeof complexValue === 'number' || typeof complexValue === 'boolean') {
    return complexValue;
  }

  // Handle different value types
  switch (complexValue.valueType ?? complexValue.ValueType) {
    case complexValueTypes.Text:
      return getComplexValueValue(complexValue) ?? '';

    case complexValueTypes.Control:
      return getValueFromControl(getComplexValueValue(complexValue), controlList);

    case complexValueTypes.Session:
      return getValueFromSession(getComplexValueValue(complexValue));

    case complexValueTypes.YesNo:
      return toBooleanYesNo(getComplexValueValue(complexValue)) ? 'true' : 'false';

    default:
      return getComplexValueValue(complexValue) ?? '';
  }
};

export { getValueFromComplexValue, getValueFromControl, getValueFromSession };
