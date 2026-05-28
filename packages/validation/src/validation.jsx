import React, { useMemo, useRef } from 'react';
import ValidationMessage from './validationMessage';
import { isRequiredRule, isValidEmailRule, isValidLengthRule, isValidRangeRule } from './rules';
import warnOnce from './_warnOnce';

const RULE_TYPES = {
  isRequired: 'isRequired',
  isValidEmail: 'isValidEmail',
  isValidLength: 'isValidLength',
  isValidRange: 'isValidRange',
};

let autoIdCounter = 0;

function Validation(props) {
  const {
    id: idProp,
    message = null,
    rules = [],
    value = null,
    onValidation = null,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    compactStyle: _compactStyle,
    isMobile: _isMobile,
    legacyClass: _legacyClass,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-validation-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'validation-forwardRef-prop',
      '@m-next/validation: Validation `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const internalMessage = useMemo(() => {
    if (!rules || rules.length === 0) return null;

    let errorMessage = null;
    rules.forEach((rule) => {
      if (errorMessage) return;

      if (rule.type === RULE_TYPES.isRequired) {
        errorMessage = isRequiredRule(value, rule.customMessage);
      } else if (rule.type === RULE_TYPES.isValidEmail) {
        errorMessage = isValidEmailRule(value, rule.customMessage);
      } else if (rule.type === RULE_TYPES.isValidLength) {
        errorMessage = isValidLengthRule(value, rule.minLength, rule.maxLength, rule.customMessage);
      } else if (rule.type === RULE_TYPES.isValidRange) {
        errorMessage = isValidRangeRule(value, rule.minValue, rule.maxValue, rule.customMessage);
      }
    });

    if (onValidation) {
      onValidation(errorMessage === null);
    }

    return errorMessage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const displayMessage = message || internalMessage;
  if (!displayMessage) return null;

  return <ValidationMessage id={id} message={displayMessage} {...rest} />;
}

export default Validation;
