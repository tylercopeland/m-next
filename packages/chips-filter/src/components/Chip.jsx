import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Pill from '@m-next/pill';
import { Text, TextDiv } from '@m-next/typeography';
import {
  Field,
  FieldTypeNames,
  Predicate,
  basicOperationId,
  complexValueTypes,
  dateRanges,
  lookupOperationChips,
} from '@m-next/types';
import { formatter, useEllipsisDetection } from '@m-next/utilities';
import { colors } from '@m-next/tokens';
import AddChip from './AddChip';

const propTypes = {
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  third: Predicate,
  fieldList: PropTypes.arrayOf(Field),
  displayPreferences: PropTypes.instanceOf(Object),
  index: PropTypes.number,
  set: PropTypes.number,
  hasValidSimpleExpression: PropTypes.bool,
  onClose: PropTypes.func,
  disableMaxWidth: PropTypes.bool,
  tooltipId: PropTypes.string,
};

const getValueLabel = (value, type, displayPreferences, field) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (type === complexValueTypes.YesNo) {
    if (field && field.displayAs === 'custom' && field.displayOptions) {
      return value && (value === true || value.toString().toLowerCase() === 'true')
        ? field.displayOptions?.trueValue
        : field.displayOptions?.falseValue;
    }
    return value && (value === true || value.toString().toLowerCase() === 'true') ? 'True' : 'False';
  }

  if (type === complexValueTypes.DateRange) {
    return dateRanges[value];
  }

  if (type === complexValueTypes.DateTime) {
    return formatter.formatFieldValue(
      FieldTypeNames.DateTime,
      { dateFormat: 'Short Date and Time' },
      value,
      displayPreferences,
    );
  }

  if (type === complexValueTypes.Date) {
    return formatter.formatFieldValue(FieldTypeNames.DateTime, { dateFormat: 'Short Date' }, value, displayPreferences);
  }

  if (type === complexValueTypes.Time) {
    return formatter.formatFieldValue(FieldTypeNames.DateTime, { dateFormat: 'Time' }, value, displayPreferences);
  }

  return value;
};

function Chip({
  id,
  isOpen,
  onClick,
  onDelete,
  first,
  operation,
  second,
  third,
  fieldList,
  displayPreferences,
  index,
  set,
  hasValidSimpleExpression,
  onClose,
  disableMaxWidth,
  tooltipId,
}) {
  const ref = useRef(null);
  const isEllipsed = useEllipsisDetection(ref);
  const field = useMemo(
    () =>
      !fieldList || !first?.value
        ? null
        : fieldList.find((f) => f.name === first.value && (first.metadata ? first.metadata?.type === f.type : true)),
    [fieldList, first],
  );

  const fieldCaption = useMemo(() => {
    if (!field) return first?.value || 'Field';
    return field.caption || field.name;
  }, [field, first?.value]);

  const secondLabel = useMemo(() => {
    if (!first.value) return 'condition';
    if (second.label === '' || second.label === null) return '(blank)';
    if (second.label) return second.label;
    if (
      operation === basicOperationId.IsEmpty ||
      operation === basicOperationId.IsNotEmpty ||
      operation === basicOperationId.IsTrue ||
      operation === basicOperationId.IsFalse
    ) {
      return '';
    }

    if (
      operation === basicOperationId.InList ||
      operation === basicOperationId.NotInList ||
      operation === basicOperationId.AllInList
    ) {
      return second.value ? second.value.split(',').length : '';
    }

    return getValueLabel(second.value, second.type, displayPreferences, field);
  }, [first.value, second.label, second.value, second.type, operation, displayPreferences, field]);

  const thirdLabel = useMemo(() => {
    if (!third?.value) return 'XX';
    return getValueLabel(third.value, third.type, displayPreferences, field);
  }, [third, displayPreferences, field]);

  const operationLabel = useMemo(() => {
    if (
      !second.value &&
      operation !== basicOperationId.IsEmpty &&
      operation !== basicOperationId.IsNotEmpty &&
      operation !== basicOperationId.IsTrue &&
      operation !== basicOperationId.IsFalse
    ) {
      return '';
    }
    let fieldType = null;
    if (field) {
      fieldType = field.type;
    }

    if (operation === null || operation === undefined) return null;
    if (fieldType === FieldTypeNames.Tags || first?.value === 'TagList') {
      let label = lookupOperationChips(operation, FieldTypeNames.Tags);
      label = label[0].toLowerCase() + label.slice(1);
      return label;
    }

    let label = lookupOperationChips(operation, fieldType);
    label = label[0].toLowerCase() + label.slice(1);
    if (fieldType === FieldTypeNames.DropDown && operation === basicOperationId.InList) {
      label = second.value.includes(',') ? 'is any of' : 'is';
    } else if (fieldType === FieldTypeNames.DropDown && operation === basicOperationId.NotInList) {
      label = second.value.includes(',') ? 'is none of' : 'is not';
    }
    return label;
  }, [field, first?.value, operation, second.value]);

  const valueLabel = useMemo(() => {
    let result = secondLabel;
    if (operation === basicOperationId.Between) {
      result += ` - ${thirdLabel}`;
    }
    return result;
  }, [operation, secondLabel, thirdLabel]);

  const handleDelete = () => {
    onDelete(index, set);
  };

  if (!first || !first.value)
    return (
      <AddChip
        id={`${id}-active-editing`}
        onClick={(e) => {
          onClose(e, true);
        }}
        showLabel={!hasValidSimpleExpression}
        isVisible
      />
    );

  return (
    <Pill
      id={`${id}-${isOpen ? 'active-editing' : first?.value}`}
      onClick={() => (onClick ? onClick(index) : null)}
      colorScheme='transparent'
      variant='ghost'
      bold={false}
      trailIcon={
        isOpen
          ? {
              name: 'chevron-down-V4',
              size: 12,
              color: colors.grey.base,
            }
          : null
      }
      fontSize={14}
      style={disableMaxWidth ? {} : { maxWidth: 280 }}
      onDelete={isOpen ? null : handleDelete}
      hasClick
    >
      <TextDiv
        id={`${id}-${first?.value}-label`}
        bold
        style={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
        ref={ref}
        tooltipId={tooltipId}
        tooltip={isEllipsed ? `${fieldCaption} ${operationLabel} ${valueLabel}` : null}
      >
        {fieldCaption} <Text style={{ cursor: 'pointer' }}>{operationLabel}</Text> {valueLabel}
      </TextDiv>
    </Pill>
  );
}

Chip.propTypes = propTypes;
export default Chip;
