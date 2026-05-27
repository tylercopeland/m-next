import React, { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import Dropdown from '@m-next/dropdown';
import { formatter } from '@m-next/utilities';
import { fieldTypeIcons, FieldTypeNames } from '@m-next/types';
import * as s from '../GridBlockEditor.styles';
import Accordion from '../../../../../components/accordion/Accordion';
import { createCardField } from '../../../control-classes/card';
import EditorInput from '../../common/components/editor-input/EditorInput';

const propTypes = {
  fieldName: PropTypes.string,
  cardField: PropTypes.shape({
    name: PropTypes.string,
    caption: PropTypes.string,
    type: PropTypes.string,
    formula: PropTypes.string,
    showCaption: PropTypes.bool,
    displayAs: PropTypes.string,
    displayOptions: PropTypes.shape({
      decimalRounding: PropTypes.number,
      dateFormat: PropTypes.number,
      trueValue: PropTypes.string,
      falseValue: PropTypes.string,
    }),
  }),
  onChange: PropTypes.func,
  fieldList: PropTypes.arrayOf(PropTypes.shape({})),
  viewFriendlyName: PropTypes.string,
};

const formattingOptions = [
  { value: null, label: 'None' },
  { value: 0, label: 'Short Date' },
  { value: 1, label: 'Short Date and Time' },
  { value: 4, label: 'Long Date' },
  { value: 2, label: 'Long Date and Time' },
  { value: 3, label: 'Time' },
  { value: 5, label: 'Hour' },
  { value: 6, label: 'Day' },
  { value: 7, label: 'Day of Week' },
  { value: 8, label: 'Month' },
  { value: 9, label: 'Month and Year' },
  { value: 10, label: 'Year' },
];

const ColumnCardFieldSection = ({ fieldName, cardField, onChange, fieldList, viewFriendlyName }) => {
  const [headerName, setHeaderName] = useState(cardField.caption);
  const [customYesNo, setCustomYesNo] = useState(
    cardField.displayOptions?.trueValue || cardField.displayOptions?.falseValue,
  );
  const [trueValue, setTrueValue] = React.useState(cardField.displayOptions?.trueValue || 'True');
  const [falseValue, setFalseValue] = React.useState(cardField.displayOptions?.falseValue || 'False');

  const filteredFieldList = useMemo(() => fieldList?.filter((item) => !item.name.includes('_RecordID')), [fieldList]);

  const fieldListOptions = useMemo(
    () =>
      formatter
        .formatFieldList(
          filteredFieldList,
          viewFriendlyName,
          null,
          {},
          {},
          fieldName === 'Image' ? [FieldTypeNames.Picture] : null,
          false,
          false,
          true,
        )
        .flatMap((section) => section.options),
    [fieldName, filteredFieldList, viewFriendlyName],
  );

  const selectedOption = useMemo(() => {
    const field = fieldListOptions.find((x) => x.value === cardField.name);
    return field ? { value: field.value, label: field.label, icon: fieldTypeIcons[field.fieldType] } : null;
  }, [cardField.name, fieldListOptions]);

  const selectedDateFormat = useMemo(() => {
    if (cardField.displayOptions?.dateFormat === null || cardField.displayOptions?.dateFormat === undefined) {
      return { value: null, label: 'None' };
    }
    return formattingOptions.find((x) => x.value === cardField.displayOptions?.dateFormat);
  }, [cardField.displayOptions?.dateFormat]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...cardField, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...cardField, [property]: { ...cardField[property], [child]: value } };
    onChange(updated);
  };

  const handleHeaderChange = (e) => {
    setHeaderName(e);
    if (e) {
      handlePropertyChange('caption', e);
    }
  };

  const handleFieldSelected = (option) => {
    if (!option) {
      onChange(null);
      return;
    }
    const updated = createCardField({ name: option.value, caption: option.label, type: option.fieldType });
    if (option.fieldType === FieldTypeNames.Decimal) {
      updated.displayOptions = {
        decimalPlaces: '2',
      };
    }
    if (option.fieldType === FieldTypeNames.Date || option.fieldType === FieldTypeNames.DateTime) {
      updated.displayOptions = {
        dateFormat: 1,
      };
    }
    setHeaderName(option.label);
    if (option.fieldType === FieldTypeNames.YesNo) {
      setCustomYesNo(false);
    }
    onChange(updated);
  };

  const handleCustomTrueValueChange = (e) => {
    setTrueValue(e);
    if (e) {
      handleChildPropertyChange('displayOptions', 'trueValue', e);
    }
  };

  const handleCustomFalseValueChange = (e) => {
    setFalseValue(e);
    if (e) {
      handleChildPropertyChange('displayOptions', 'falseValue', e);
    }
  };

  // hide icon options until we have a use case for it
  return (
    <>
      <TextLine>Edit {fieldName} within the card column</TextLine>
      <Accordion id='display' caption='Display' variant='left' open borderless>
        <s.LineWrapper>
          <Text>Mapped field</Text>
          <Dropdown
            id='add-card-column'
            width='184px'
            placeholder='SelectField'
            dropdownStyle='multi-icon'
            value={selectedOption}
            onChange={handleFieldSelected}
            isV4Design
            options={fieldListOptions}
            isClearable
          />
        </s.LineWrapper>
        {cardField.type === FieldTypeNames.Decimal && (
          <s.LineWrapper>
            <Text>Rounding</Text>
            <Dropdown
              id='decimal-places'
              width='184px'
              value={{
                value: cardField.displayOptions?.decimalRounding,
                label: cardField.displayOptions?.decimalRounding,
              }}
              onChange={(e) => handleChildPropertyChange('displayOptions', 'decimalRounding', e.value)}
              isV4Design
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
              ]}
            />
          </s.LineWrapper>
        )}
        {(cardField.type === FieldTypeNames.Date || cardField.type === FieldTypeNames.DateTime) && (
          <s.LineWrapper>
            <Text>Format as</Text>
            <Dropdown
              id='date-formatting'
              width='184px'
              value={selectedDateFormat}
              onChange={(e) => handleChildPropertyChange('displayOptions', 'dateFormat', e.value)}
              isV4Design
              options={formattingOptions}
            />
          </s.LineWrapper>
        )}
        {cardField.type === FieldTypeNames.YesNo && (
          <>
            <Toggle
              id='display-value'
              checked={customYesNo}
              onChange={(e) => setCustomYesNo(e)}
              label='Show alternative Yes/No'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
            {customYesNo && (
              <EditorInput
                id='true-value'
                value={trueValue}
                label='Value for true'
                onChange={handleCustomTrueValueChange}
                controlId={fieldName}
                maxLength={30}
              />
            )}
            {customYesNo && (
              <EditorInput
                id='false-value'
                value={falseValue}
                label='Value for false'
                onChange={handleCustomFalseValueChange}
                controlId={fieldName}
                maxLength={30}
              />
            )}
          </>
        )}
        {false && (
          <Toggle
            id='show-header'
            checked={cardField.showCaption}
            onChange={(e) => handlePropertyChange('showCaption', e)}
            label='Show title'
            width='100%'
            style={{ justifyContent: 'flex-start' }}
            labelStyle={{ flexBasis: '100%' }}
          />
        )}
        {false && (
          <EditorInput
            id='header'
            value={headerName}
            label='Caption'
            onChange={handleHeaderChange}
            controlId={fieldName}
            maxLength={30}
          />
        )}
      </Accordion>
    </>
  );
};

ColumnCardFieldSection.propTypes = propTypes;
export default ColumnCardFieldSection;
