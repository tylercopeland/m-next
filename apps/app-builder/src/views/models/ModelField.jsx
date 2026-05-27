import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { DebouncedInput } from '@m-next/input';
import { Field, getIcon } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import Pill from '@m-next/pill';
import * as s from './Model.styles';

const propTypes = {
  field: Field,
  onChange: PropTypes.func,
};

function ModelField({ field, onChange }) {
  const handleFieldChange = (property, value) => {
    if (property.includes('.')) {
      const parts = property.split('.');
      if (!field[parts[0]]) {
        const updated = { ...field };
        updated[parts[0]] = {};
        updated[parts[0]][parts[1]] = value;
        onChange(updated);
      } else {
        const updated = {
          ...field,
          [parts[0]]: {
            ...field[parts[0]],
            [parts[1]]: value,
          },
        };

        onChange(updated);
      }
    } else {
      const updated = { ...field };
      updated[property] = value;
      onChange(updated);
    }
  };

  /*
const handleVisibilityClick = () =>{
  handleFieldChange('isVisible', !field.isVisible);
}
*/

  const dateFormatOptions = [
    { value: 0, label: 'Short date' },
    { value: 1, label: 'Short date and time' },
    { value: 2, label: 'Long date and time' },
    { value: 3, label: 'Time' },
  ];

  const getDateformatValue = () => {
    if (!field.displayOptions || !field.displayOptions.dateFormat) {
      return dateFormatOptions[1];
    }
    return dateFormatOptions[field.displayOptions.dateFormat];
  };
  const [dateFormat, setDateFormat] = useState(getDateformatValue());

  const handleDateFormatChange = (format) => {
    setDateFormat(format);
    handleFieldChange('displayOptions.dateFormat', format.value);
  };

  return (
    <s.ModelFieldWrapper>
      <s.ModelFieldContent>
        <SvgIcon name={getIcon(field.type)} size={16} />
        <s.ModelFieldSummary>
          <DebouncedInput
            compactStyle
            id='data-model-caption'
            value={field.caption}
            caption='Caption'
            onChange={(value) => {
              handleFieldChange('caption', value);
            }}
            disabled
          />
          <Text fontSize='small'>{field.name}</Text>
          <s.ModelFieldPropertiesWrapper>
            {field.isSync && (
              <Pill
                variant='subtle'
                size='narrow'
                colorScheme='green'
                tooltip='Sync with accounting package'
                tooltipId='model-tooltip'
              >
                Accounting
              </Pill>
            )}
            {field.isRequired && (
              <Pill
                variant='subtle'
                size='narrow'
                colorScheme='red'
                tooltip='Sync with accounting package'
                tooltipId='model-tooltip'
              >
                Required
              </Pill>
            )}
          </s.ModelFieldPropertiesWrapper>
        </s.ModelFieldSummary>
        <s.ModelFieldDisplayOptions>
          <TextLine bold>Display Options</TextLine>
          <s.ModelFieldDisplayOptionsContent>
            {field.type === 'DateTime' && (
              <Dropdown
                id='data-model-date-format'
                caption='Date format'
                value={dateFormat}
                options={dateFormatOptions}
                isV4Design
                onChange={handleDateFormatChange}
                dropdownStyle='single'
                disabled
              />
            )}
            {field.type === 'Decimal' && (
              <DebouncedInput
                compactStyle
                id='data-model-decimal-rounding'
                caption='Decimal rounding'
                value={field.displayOptions?.decimalRounding}
                type='number'
                onChange={(value) => {
                  handleFieldChange('displayOptions.decimalRounding', value);
                }}
                minValue={0}
                maxValue={14}
                useValidation
                style={{ marginTop: 8 }}
                placeholder='0'
                disabled
              />
            )}
            {field.type === 'YesNo' && (
              <>
                <DebouncedInput
                  compactStyle
                  id='data-model-true-value'
                  caption='True value'
                  value={field.displayOptions?.trueValue}
                  onChange={(value) => {
                    handleFieldChange('displayOptions.trueValue', value);
                  }}
                  style={{ marginTop: 8 }}
                  placeholder='True'
                  disabled
                />
                <DebouncedInput
                  compactStyle
                  id='data-model-false-value'
                  caption='False value'
                  value={field.displayOptions?.falseValue}
                  onChange={(value) => {
                    handleFieldChange('displayOptions.falseValue', value);
                  }}
                  style={{ marginTop: 8 }}
                  placeholder='False'
                  disabled
                />
              </>
            )}
          </s.ModelFieldDisplayOptionsContent>
        </s.ModelFieldDisplayOptions>
      </s.ModelFieldContent>
    </s.ModelFieldWrapper>
  );
}

ModelField.propTypes = propTypes;
export default ModelField;

/*
  
*/
