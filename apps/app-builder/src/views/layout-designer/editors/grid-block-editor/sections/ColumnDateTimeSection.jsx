import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { Text } from '@m-next/typeography';
import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import ComplexValue from '../../../../../components/complex-value/ComplexValue';

const formattingOptions = [
  { value: '', label: 'None' },
  { value: 'Short Date', label: 'Short Date' },
  { value: 'Short Date and Time', label: 'Short Date and Time' },
  { value: 'Long Date', label: 'Long Date' },
  { value: 'Long Date and Time', label: 'Long Date and Time' },
  { value: 'Time', label: 'Time' },
  { value: 'Hour', label: 'Hour' },
  { value: 'Day', label: 'Day' },
  { value: 'Day of Week', label: 'Day of Week' },
  { value: 'Month', label: 'Month' },
  { value: 'Month and Year', label: 'Month and Year' },
  { value: 'Year', label: 'Year' },
];

// types
const propTypes = {
  onChange: PropTypes.func,
  column: GridColumnModel,
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
};

const ColumnDateTimeSection = ({ column, onChange, fieldListOptions, controlList }) => {
  const selectedOption = useMemo(
    () =>
      column.format.type
        ? formattingOptions.find((option) => option.value === column.format.type)
        : formattingOptions[0],
    [column.format.type],
  );

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...column, [property]: { ...column[property], [child]: value } };
    onChange(updated);
  };

  return (
    <s.ContentWrapper>
      {!column.isLocked && (
        <s.LineWrapper align='flex-start'>
          <Text style={{ lineHeight: '32px' }}>Default value</Text>
          <ComplexValue
            id='default-value'
            complexValue={column.defaultValue}
            fieldListOptions={fieldListOptions}
            fieldType={column.fieldType}
            includeControls
            includeNone
            includeSessionVariables
            controlList={controlList}
            width={184}
            onChange={(e) => handlePropertyChange('defaultValue', e)}
            controlId={column.controlId}
          />
        </s.LineWrapper>
      )}
      <s.LineWrapper>
        <Text>Format as</Text>
        <Dropdown
          id='date-formatting'
          width='184px'
          value={selectedOption}
          onChange={(e) => handleChildPropertyChange('format', 'type', e.value)}
          isV4Design
          options={formattingOptions}
        />
      </s.LineWrapper>
    </s.ContentWrapper>
  );
};

ColumnDateTimeSection.propTypes = propTypes;
export default ColumnDateTimeSection;
