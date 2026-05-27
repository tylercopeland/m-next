import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ValidationMessage from './validationMessage';
import { isRequiredRule, isValidEmailRule, isValidLengthRule, isValidRangeRule } from './rules';

const isRequired = 'isRequired';
const isValidEmail = 'isValidEmail';
const isValidLength = 'isValidLength';
const isValidRange = 'isValidRange';

const propTypes = {
  id: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isV4Design: PropTypes.bool,
  compactStyle: PropTypes.bool,
  onValidation: PropTypes.func,
  rules: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.oneOf([isRequired, isValidEmail]).isRequired,
        customMessage: PropTypes.string,
      }),
      PropTypes.shape({
        type: PropTypes.oneOf([isValidLength]).isRequired,
        customMessage: PropTypes.string,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
      }),
      PropTypes.shape({
        type: PropTypes.oneOf([isValidRange]).isRequired,
        customMessage: PropTypes.string,
        minValue: PropTypes.number,
        maxValue: PropTypes.number,
      }),
    ]),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function Validation({
  message = null,
  id = null,
  isV4Design = true,
  rules = [],
  value = null,
  compactStyle = false,
  onValidation = null,
}) {
  const internalMessage = useMemo(() => {
    if (!rules || rules.length === 0) {
      return null;
    }

    let errorMessage = null;
    rules.forEach((rule) => {
      if (!errorMessage) {
        if (rule.type === isRequired) {
          errorMessage = isRequiredRule(value, rule.customMessage);
        }

        if (rule.type === isValidEmail) {
          errorMessage = isValidEmailRule(value, rule.customMessage);
        }

        if (rule.type === isValidLength) {
          errorMessage = isValidLengthRule(value, rule.minLength, rule.maxLength, rule.customMessage);
        }

        if (rule.type === isValidRange) {
          errorMessage = isValidRangeRule(value, rule.minValue, rule.maxValue, rule.customMessage);
        }
      }
    });

    if (onValidation) {
      onValidation(errorMessage === null);
    }

    return errorMessage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const render = () => {
    if (message)
      return <ValidationMessage id={id} isV4Design={isV4Design} message={message} compactStyle={compactStyle} />;
    if (internalMessage)
      return (
        <ValidationMessage id={id} isV4Design={isV4Design} message={internalMessage} compactStyle={compactStyle} />
      );

    return null;
  };

  return render();
}

Validation.propTypes = propTypes;

export default Validation;
