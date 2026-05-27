import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Input from '@m-next/input';
import { colors } from '@m-next/styles';
import { FieldTypeNames, Predicate } from '@m-next/types';

// Maximum character length for integer fields (matches backend constraint)
const INTEGER_MAX_LENGTH = 10;

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minimum: Predicate,
  maximum: Predicate,
  onMinimumChange: PropTypes.func,
  onMaximumChange: PropTypes.func,
  onKeyUp: PropTypes.func,
  isBetween: PropTypes.bool,
  fieldType: PropTypes.string,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    gap: 8,
  },
]);

// Check if field type is an integer type (Integer or Id/Record ID)
const isIntegerFieldType = (fieldType) => fieldType === FieldTypeNames.Integer || fieldType === FieldTypeNames.Id;

// Only allow numeric characters: digits, signs, and decimal point (no scientific notation)
const isNumericInput = (value) => /^[0-9+\-.]*$/.test(value);

// For integer fields: only allow digits and signs (no decimal point)
const isIntegerInput = (value) => /^[0-9+-]*$/.test(value);

// Get the numeric digits from a value (excluding sign) for length validation
const getNumericDigits = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  return String(value).replace(/[^0-9]/g, '');
};

function NumberValueEditor({ id, minimum, maximum, onMinimumChange, onMaximumChange, onKeyUp, isBetween, fieldType }) {
  const isIntegerField = isIntegerFieldType(fieldType);
  // Validate range for Between operation (min should be less than max)
  const rangeValidationError = useMemo(() => {
    if (!isBetween) return null;
    const minVal = minimum?.value;
    const maxVal = maximum?.value;
    if (minVal === '' || minVal === null || minVal === undefined) return null;
    if (maxVal === '' || maxVal === null || maxVal === undefined) return null;
    const minNum = Number(minVal);
    const maxNum = Number(maxVal);
    if (Number.isNaN(minNum) || Number.isNaN(maxNum)) return null;
    if (minNum >= maxNum) return 'Invalid range';
    return null;
  }, [isBetween, minimum?.value, maximum?.value]);

  const handleInputChange = (e) => {
    const { value } = e.target;

    // Block invalid input based on field type
    if (value !== '') {
      if (isIntegerField) {
        // For integer fields: only allow digits and signs
        if (!isIntegerInput(value)) {
          return;
        }
        // Enforce max length for integer fields
        const digits = getNumericDigits(value);
        if (digits.length > INTEGER_MAX_LENGTH) {
          return;
        }
      } else if (!isNumericInput(value)) {
        // For decimal/money fields: allow digits, signs, and decimal point
        return;
      }
    }

    onMinimumChange(value);
  };

  const handleInputMaximumChange = (e) => {
    const { value } = e.target;

    // Block invalid input based on field type
    if (value !== '') {
      if (isIntegerField) {
        // For integer fields: only allow digits and signs
        if (!isIntegerInput(value)) {
          return;
        }
        // Enforce max length for integer fields
        const digits = getNumericDigits(value);
        if (digits.length > INTEGER_MAX_LENGTH) {
          return;
        }
      } else if (!isNumericInput(value)) {
        // For decimal/money fields: allow digits, signs, and decimal point
        return;
      }
    }

    onMaximumChange(value);
  };

  const render = () => {
    if (isBetween)
      return (
        <Wrapper>
          <Input
            id={`${id}-min-value`}
            value={minimum.value}
            type='text'
            onChange={handleInputChange}
            onKeyUp={onKeyUp}
            style={{ backgroundColor: colors.white }}
            inputStyle={{ fontSize: 13 }}
            compactStyle
            isV4Design
            label='Minimum'
            autoFocus
          />
          <Input
            id={`${id}-max-value`}
            value={maximum?.value}
            type='text'
            onChange={handleInputMaximumChange}
            onKeyUp={onKeyUp}
            style={{ backgroundColor: colors.white }}
            inputStyle={{ fontSize: 13 }}
            compactStyle
            isV4Design
            label='Maximum'
            validationMessage={rangeValidationError}
          />
        </Wrapper>
      );

    return (
      <Input
        id={`${id}-value`}
        value={minimum.value}
        type='text'
        onChange={handleInputChange}
        onKeyUp={onKeyUp}
        style={{ backgroundColor: colors.white }}
        inputStyle={{ fontSize: 13 }}
        compactStyle
        isV4Design
        label='Value'
        autoFocus
      />
    );
  };

  return render();
}

NumberValueEditor.propTypes = propTypes;
export default NumberValueEditor;
