import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ButtonRadioGroup } from '@m-next/radio-button';
import Dropdown from '@m-next/dropdown';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { aggregateTypeIds, fieldTypeIdLookup } from '@m-next/types';
import { TextLine } from '@m-next/typeography';
import { ChartValidationModel, CountOfRecords } from './types';

const propTypes = {
  seriesLabel: PropTypes.string,
  seriesColumn: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    aggregate: PropTypes.number,
  }),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  formattedFieldList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
          icon: PropTypes.string,
        }),
      ),
    }),
  ),
  onChange: PropTypes.func,
  tableName: PropTypes.string,
  validation: ChartValidationModel,
};
function SeriesEditor({ seriesLabel, seriesColumn, fieldList, formattedFieldList, onChange, tableName, validation }) {
  const aggregateTypes = [
    {
      value: 2,
      label: 'Sum',
    },
    {
      value: 3,
      label: 'Average',
    },
    {
      value: 5,
      label: 'Min',
    },
    {
      value: 4,
      label: 'Max',
    },
  ];

  const adjustedFieldList = useMemo(() => {
    if (!formattedFieldList) return null;

    const grouped = [
      {
        label: 'Count',
        options: [
          {
            value: CountOfRecords,
            label: `Count of ${tableName} records`,
            icon: 'count-of',
          },
        ],
      },
    ];

    return [...grouped, ...formattedFieldList];
  }, [formattedFieldList, tableName]);

  const handleSeriesFieldChange = (field) => {
    if (field.value !== seriesColumn?.value) {
      let checkValue = field.value;
      if (field.value === CountOfRecords) {
        checkValue = 'RecordID';
      }
      const match = fieldList.filter((x) => x.name === checkValue);
      if (match !== null && match.length > 0) {
        const delta = { ...match[0] };
        delta.caption = 'SecondaryColumn';
        delta.aggregate = field.value === CountOfRecords ? aggregateTypeIds.Count : aggregateTypeIds.Sum;
        delta.fieldType = fieldTypeIdLookup(delta.type);
        onChange(delta, seriesLabel);
      }
    }
  };

  const handleSeriesAggregateChange = (field) => {
    if (field.value !== seriesColumn?.aggregate) {
      const match = fieldList.filter((x) => x.name === seriesColumn.value);
      if (match !== null && match.length > 0) {
        const delta = { ...match[0] };
        delta.caption = 'SecondaryColumn';
        delta.aggregate = field.value;
        delta.fieldType = fieldTypeIdLookup(delta.type);
        onChange(delta, seriesLabel);
      }
    }
  };

  return (
    <>
      <TextLine bold>How do you want to measure {tableName}?</TextLine>
      {!adjustedFieldList && <LoadingSkeleton count={1} height={24} />}
      {adjustedFieldList && (
        <Dropdown
          id='series-field'
          options={adjustedFieldList}
          onChange={handleSeriesFieldChange}
          placeholder='Search field'
          dropdownStyle='multi-icon'
          isV4Design
          value={seriesColumn}
          required
          hasValidation={!!validation?.columns[1]}
          validationMessage={validation?.columns[1]}
          style={{ marginBottom: 8 }}
        />
      )}
      {adjustedFieldList && seriesColumn?.value && seriesColumn?.value !== CountOfRecords && (
        <ButtonRadioGroup
          id='series-field-aggregate'
          selectedValue={seriesColumn?.aggregate}
          onChange={handleSeriesAggregateChange}
          options={aggregateTypes}
          caption='Calculate as'
          isOneLine
          buttonWidth={78}
        />
      )}
    </>
  );
}

SeriesEditor.propTypes = propTypes;

export default SeriesEditor;
