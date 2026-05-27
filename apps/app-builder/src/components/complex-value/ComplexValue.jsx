import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { complexValueTypes, fieldTypeNameLookup } from '@m-next/types';
import styled from '@emotion/styled';
import { toCamelCase } from '@m-next/utilities';
import ValueTypeEditor from './ValueTypeEditor';
import ValueEditor from './ValueEditor';

const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  fieldType: PropTypes.number,
  includeControls: PropTypes.bool,
  includeCurrentDate: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  includeNone: PropTypes.bool,
  complexValue: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.instanceOf(Object)]),
    valueType: PropTypes.number,
    property: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    childProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  }),
  onChange: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  controlId: PropTypes.string,
  formatType: PropTypes.string,
};

export const ComplexValueWrapper = styled.div(({ width }) => ({
  width,
  display: 'flex',
  gap: 16,
  flexDirection: 'column',
}));

const ComplexValue = ({
  id,
  fieldType,
  complexValue,
  includeControls,
  includeNone,
  includeCurrentDate,
  includeSessionVariables,
  controlList,
  fieldListOptions,
  onChange,
  width,
  controlId,
  formatType,
}) => {
  const [internalValue, setInternalValue] = useState(null);

  const fieldTypeName = useMemo(() => fieldTypeNameLookup(fieldType), [fieldType]);

  useEffect(() => {
    // Handle controlId changes
    setInternalValue(null);
  }, [controlId]);

  useEffect(() => {
    const updated = toCamelCase(complexValue);
    if (updated && (updated.value === null || updated.value === undefined || updated.value === '')) {
      setInternalValue(null);
    } else {
      setInternalValue(updated);
    }
  }, [complexValue]);

  const handleFieldTypeChange = (valueType) => {
    if (valueType.value === internalValue?.valueType) {
      return;
    }

    if (valueType.value === '') {
      onChange(null);
      setInternalValue(null);
    } else if (valueType.value === complexValueTypes.CurrentDate) {
      onChange({
        value: 'today',
        valueType: complexValueTypes.CurrentDate,
      });
    } else {
      const updated = {
        value: valueType.value === complexValueTypes.YesNo ? 'false' : null,
        valueType: valueType.value,
        property: null,
        childProperty: null,
      };
      setInternalValue(updated);
      if (valueType.value === complexValueTypes.YesNo) {
        onChange(updated);
      }
    }
  };

  const handleValueChange = (item, type) => {
    const updated = { ...internalValue };

    if (type !== null && type !== undefined) {
      updated.valueType = type;
    }

    if (updated.valueType === complexValueTypes.Control) {
      updated.value = item.parentId || item.value;
      updated.property = item.property;
      updated.childProperty = item.childProperty;
    } else if (updated.valueType === complexValueTypes.Session) {
      updated.value = item.value;
    } else if (updated.valueType === complexValueTypes.YesNo) {
      updated.value = item;
    } else if (updated.valueType === complexValueTypes.Number) {
      updated.value = item !== null && item !== '' && item !== undefined ? Number(item) : item;
    } else if (updated.valueType === complexValueTypes.DateRange) {
      updated.value = item;
    } else if (updated.valueType === complexValueTypes.DateTime || updated.valueType === complexValueTypes.Date) {
      updated.value = item && item !== -1 && item !== -2 ? item.toISOString() : null;
    } else {
      updated.value = item;
    }

    setInternalValue(updated);
    onChange(updated);
  };

  return (
    <ComplexValueWrapper id={id} width={width}>
      <ValueTypeEditor
        id={`${id}-value-type`}
        fieldType={fieldTypeName}
        onChange={handleFieldTypeChange}
        type={internalValue?.valueType || null}
        includeCurrentDate={includeCurrentDate}
        includeControls={includeControls}
        includeSessionVariables={includeSessionVariables}
        includeNone={includeNone}
      />
      {internalValue && internalValue.valueType !== complexValueTypes.Unset && internalValue !== 'today' && (
        <ValueEditor
          id={`${id}-value`}
          complexValue={internalValue}
          fieldListOptions={fieldListOptions}
          controlList={controlList}
          onChange={handleValueChange}
          fieldType={fieldTypeName}
          controlId={controlId}
          formatType={formatType}
        />
      )}
    </ComplexValueWrapper>
  );
};

ComplexValue.propTypes = propTypes;
export default ComplexValue;
