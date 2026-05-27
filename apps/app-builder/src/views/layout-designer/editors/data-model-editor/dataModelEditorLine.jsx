import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import Input from '@m-next/input';
import Dropdown from '@m-next/dropdown';
import { interactions } from '@m-next/utilities';
import { Field } from '@m-next/types';
import { colors, lightTheme } from '@m-next/styles';

import * as s from './dataModelEditor.styles';
// types
const propTypes = {
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  field: Field,
  index: PropTypes.number,
  id: PropTypes.string,
  isDragging: PropTypes.bool,
  onDisableDragging: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  isSelected: PropTypes.bool,
  addedField: PropTypes.bool,
};

function DataModelLine({
  id,
  field,
  onChange,
  index,
  onDelete,
  isDragging,
  onDisableDragging,
  onSelect,
  open,
  isSelected,
  addedField,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ignoreScroll, setIgnoreScroll] = useState(false);

  const [initial, setInitial] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    if (open) setIsOpen(true);
  }, [open]);

  useEffect(() => {
    if (isSelected && !ignoreScroll) {
      headerRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIgnoreScroll(false);
  }, [ignoreScroll, isSelected]);

  useEffect(() => {
    if (addedField) {
      setInitial(true);
      setTimeout(() => {
        setInitial(false);
      }, 100);
    }
  }, [addedField]);

  const handleFieldChange = (property, value) => {
    if (property.includes('.')) {
      const parts = property.split('.');
      if (!field[parts[0]]) {
        const updated = { ...field };
        updated[parts[0]] = {};
        updated[parts[0]][parts[1]] = value;
        onChange(updated, index);
      } else {
        const updated = {
          ...field,
          [parts[0]]: {
            ...field[parts[0]],
            [parts[1]]: value,
          },
        };

        onChange(updated, index);
      }
    } else {
      const updated = { ...field };
      updated[property] = value;
      onChange(updated, index);
    }
  };
  const handleDeleteClick = () => {
    onDelete(field, index);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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

  const handleMouseEnter = () => {
    onDisableDragging(index);
  };
  const handleMouseLeave = () => {
    onDisableDragging(null);
  };

  const handleOnClick = () => {
    if (onSelect) onSelect(field.name);
    setIgnoreScroll(true);
  };

  return (
    <s.Wrapper
      isOpen={isOpen}
      id={`data-model-wrapper-${id}`}
      data-testid={`data-model-wrapper-${id}`}
      onKeyUp={interactions.handleEnterKey(toggleOpen)}
      tabIndex={0}
      isSelected={isSelected}
      onClick={handleOnClick}
      initial={initial}
    >
      <s.Header
        id={`data-model-header-${id}`}
        data-testid={`data-model-header-${id}`}
        onClick={toggleOpen}
        isOpen={isOpen}
        ref={headerRef}
      >
        <SvgIcon
          id={`data-model-drag-${id}`}
          name='drag'
          size={16}
          color={lightTheme.content.primary}
          style={{ cursor: 'grab' }}
        />

        <span style={{ flexGrow: 1, lineBreak: 'anywhere' }} id={`data-model-name-${id}`}>
          {field.caption}
        </span>
        <SvgIcon
          id={`data-model-header-state-icon-${id}`}
          name={isOpen ? 'chevron-up-V4' : 'chevron-down-V4'}
          size={20}
          color={lightTheme.content.subtle}
        />
      </s.Header>
      <s.Content
        isOpen={isOpen}
        id={`data-model-content-${id}`}
        data-testid={`data-model-content-${id}`}
        type={field.type}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <s.Spacer />
        <Input
          compactStyle
          id={`data-model-caption-${id}`}
          value={field.caption}
          label='Caption'
          onChange={(e) => {
            handleFieldChange('caption', e.target.value);
          }}
          background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
        />
        {field.type === 'DateTime' && (
          <Dropdown
            id={`data-model-date-format-${id}`}
            caption='Date format'
            value={dateFormat}
            options={dateFormatOptions}
            isV4Design
            onChange={handleDateFormatChange}
            dropdownStyle='single'
            style={{ marginTop: 8 }}
            background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
          />
        )}
        {field.type === 'Decimal' && (
          <Input
            compactStyle
            background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
            id={`data-model-decimal-rounding-${id}`}
            label='Decimal rounding'
            value={field.displayOptions?.decimalRounding}
            type='number'
            onChange={(e) => {
              handleFieldChange('displayOptions.decimalRounding', e.target.value);
            }}
            minValue={0}
            maxValue={14}
            useValidation
            style={{ marginTop: 8 }}
            placeholder='0'
          />
        )}
        {field.type === 'YesNo' && (
          <>
            <Input
              compactStyle
              background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
              id={`data-model-true-value-${id}`}
              label='True value'
              value={field.displayOptions?.trueValue}
              onChange={(e) => {
                handleFieldChange('displayOptions.trueValue', e.target.value);
              }}
              style={{ marginTop: 8 }}
              placeholder='True'
            />
            <Input
              compactStyle
              background={isDragging ? colors['blue-lighter'] : lightTheme.background.primary}
              id={`data-model-false-value-${id}`}
              label='False value'
              value={field.displayOptions?.falseValue}
              onChange={(e) => {
                handleFieldChange('displayOptions.falseValue', e.target.value);
              }}
              style={{ marginTop: 8 }}
              placeholder='False'
            />
          </>
        )}

        <s.FieldWrapper>
          <strong style={{ margin: 0 }}>Field Name</strong>
          <p id={`data-model-field-name-${id}`} style={{ margin: 0 }}>
            {field.name}
            {field.isLinked ? `(${field.sourceModel}.${field.sourceField})` : null}
          </p>
        </s.FieldWrapper>
        <s.FieldWrapper>
          <strong style={{ margin: 0 }}>Field Type</strong>
          <p id={`data-model-field-type-${id}`} style={{ margin: 0 }}>
            {!field.isLinked && field.type !== 'DropDown' && field.type}
            {field.isLinked && `Linked(${field.type})`}
            {field.type === 'DropDown' && `Dropdown(${field.sourceModel}.${field.sourceField})`}
          </p>
        </s.FieldWrapper>
        <s.DeleteWraper>
          <SvgIcon
            id={`data-model-delete-${id}`}
            name='delete'
            size={16}
            color={lightTheme.content.primary}
            onClick={handleDeleteClick}
          />
        </s.DeleteWraper>
      </s.Content>
    </s.Wrapper>
  );
}

DataModelLine.propTypes = propTypes;
export default DataModelLine;
