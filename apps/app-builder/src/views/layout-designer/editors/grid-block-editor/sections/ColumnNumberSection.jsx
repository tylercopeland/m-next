import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import { FieldTypeIds } from '@m-next/types';
import Dropdown from '@m-next/dropdown';

import * as s from '../GridBlockEditor.styles';
import { GridColumnModel } from '../type';
import ComplexValue from '../../../../../components/complex-value/ComplexValue';

const propTypes = {
  column: GridColumnModel,
  onChange: PropTypes.func,
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
};

const ColumnNumberSection = ({ column, onChange, fieldListOptions, controlList }) => {
  const formatAsOptions = [
    { value: 0, label: 'Number' },
    { value: 1, label: 'Money' },
  ];
  
  // Helper to get the selected format option
  const getSelectedFormat = () => {
    const formatValue = column.displayOptions?.numberFormat ?? 0;
    return formatAsOptions.find(opt => opt.value === formatValue) || formatAsOptions[0];
  };

  const currencyCodeSourceCols = useMemo(() => {
    if(!fieldListOptions) return [];
    
    return [
      {
        label: 'System Fields',
        size: 16,
        options: [{ value: 'CompanyAccountCurrency', label: 'Company Account Currency' }],
      },
      {
        label: 'Table Fields',
        size: 16,
        options: fieldListOptions
          .flatMap((flo) =>
            flo.options
              .filter((opt) => !opt.value.endsWith('_RecordID'))
              .map((opt) => {
                return { value: opt.value, label: opt.label };
              }),
          )
          .toSorted((a, b) => a.label.localeCompare(b.label)),
      },
    ];
  }, [fieldListOptions]);

  const selectedCurrencySourceColLabel = useMemo(() => {
    const foundOption = currencyCodeSourceCols
      .flatMap((group) => group.options)
      .find((opt) => opt.value === column.supportingColumns?.currency?.value);
    return foundOption ? foundOption.label : '';
  }, [column, currencyCodeSourceCols]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...column, [property]: value };
    onChange(updated);
  };

  const handleChildPropertyChange = (property, child, value) => {
    const updated = { ...column, [property]: { ...column[property], [child]: value } };
    onChange(updated);
  };

  const handleDecimalPlacesChange = (option) => {
    handleChildPropertyChange('format', 'rounding', option.value);
  };

  const _createSupportingColumn = (val) => {
    let type = 3;
    if (val === 'CompanyAccountCurrency') {
      type = 6;
    }

    return {
      Property: 'Text',
      ValueType: type,
      Value: val,
      ChildProperty: null,
      FontStyles: null,
      ValidationMessage: null,
    };
  };

  const _addSupportingColumn = (key, val) => {
    const newVal = _createSupportingColumn(val);
    handleChildPropertyChange('supportingColumns', key, newVal);
  };

  const handleCurrencySourceChange = (option) => {
    _addSupportingColumn('currency', option.value);
  };

  const handleFormatChangeToNumber = (newFormatOption) => {
    // We are removing certain properties, naming is done for readability
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currency: _currency, homeCurrency: _homeCurrency, displayOptions, ...rest } = column.supportingColumns || {};
    const updated = {
      ...column,
      displayOptions: { ...displayOptions, numberFormat: newFormatOption },
      supportingColumns: rest,
    };
    onChange(updated);
  };

  const handleFormatChangeToMoney = (newFormatOption) => {
    let defaultVal = 'CompanyAccountCurrency';
    if (currencyCodeSourceCols[1]?.options?.find((col) => col.value === 'Currency')) {
      // Index 1 is 'Table Fields' group; searching by value since that is actual name of column
      defaultVal = 'Currency';
    }

    const newCurrencyVal = _createSupportingColumn(defaultVal);
    const homeCurrencyVal = _createSupportingColumn('CompanyAccountCurrency');

    const updated = {
      ...column,
      displayOptions: { ...column.displayOptions, numberFormat: newFormatOption },
      supportingColumns: { ...column.supportingColumns, currency: newCurrencyVal, homeCurrency: homeCurrencyVal },
    };
    onChange(updated);
  };

  // NOTE: Refactor in the future if adding more format types
  // Basically on switching format type, remove any attributes used by the old
  // format type, and initialize attributes needed for the new format type
  const handleFormatChange = (e) => {
    // Reset currency source if switching from money to number
    if (e.value === 0 && column.displayOptions?.numberFormat !== 0) {
      handleFormatChangeToNumber(e.value);
    }
    // Assign default currency source if switching from number to money and no currency source set
    else if (e.value === 1 && column.displayOptions?.numberFormat !== 1) {
      handleFormatChangeToMoney(e.value);
    }
  };

  return (
    <>
      <s.LineWrapper>
        <Text>Format as</Text>
        <Dropdown
            id='number-format'
            width='184px'
            value={getSelectedFormat()}
            onChange={handleFormatChange}
            isV4Design
            options={formatAsOptions}
          />
      </s.LineWrapper>

      {column.fieldType === FieldTypeIds.Decimal && (
        <s.LineWrapper>
          <Text>Rounding</Text>
          <Dropdown
            id='decimal-places'
            width='184px'
            value={{ value: column.format.rounding, label: String(column.format.rounding) }}
            onChange={handleDecimalPlacesChange}
            isV4Design
            options={[
              { value: 0, label: '0' },
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ]}
          />
        </s.LineWrapper>
      )}

      {column.displayOptions.numberFormat === 1 && (
        <s.LineWrapper>
          <Text>Currency Code Source</Text>
          <Dropdown
            id='currency-code-source'
            width='184px'
            selected={{
              value: column.supportingColumns?.currency?.value,
              label: selectedCurrencySourceColLabel,
            }}
            value={{
              value: column.supportingColumns?.currency?.value,
              label: selectedCurrencySourceColLabel,
            }}
            onChange={handleCurrencySourceChange}
            isV4Design
            options={currencyCodeSourceCols}
          />
        </s.LineWrapper>
      )}

      <Toggle
        id='column-total'
        checked={column.hasColumnTotal}
        onChange={(e) => handlePropertyChange('hasColumnTotal', e)}
        label='Show column total'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />

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
            includeSessionVariables={column.fieldType !== FieldTypeIds.Money}
            controlList={controlList}
            width={184}
            onChange={(e) => handlePropertyChange('defaultValue', e)}
            controlId={column.controlId}
          />
        </s.LineWrapper>
      )}
    </>
  );
};

ColumnNumberSection.propTypes = propTypes;
export default ColumnNumberSection;
