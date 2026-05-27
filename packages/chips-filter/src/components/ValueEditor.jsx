import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldTypeNames, Predicate, Tag, basicOperationId, complexValueTypes, dateRanges } from '@m-next/types';
import NumberValueEditor from './NumberValueEditor';
import DropdownValueEditor from './DropdownValueEditor';
import TagsValueEditor from './TagsValueEditor';
import TextValueEditor from './TextValueEditor';
import YesNoValueEditor from './YesNoValueEditor';
import DateValueEditor from './DateValueEditor';
import TimeValueEditor from './TimeValueEditor';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  third: Predicate,
  fieldType: PropTypes.string,
  onChange: PropTypes.func,
  onChangeThird: PropTypes.func,
  onKeyUp: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  searchText: PropTypes.string,
  onSearch: PropTypes.func,
  tagsList: PropTypes.arrayOf(Tag),
  forcedTimeZone: PropTypes.string,
  tooltipId: PropTypes.string,
  firstField: Field,
};

function ValueEditor({
  id,
  first,
  operation,
  second,
  third,
  fieldType,
  onChange,
  onChangeThird,
  onKeyUp,
  options,
  searchText,
  onSearch,
  tagsList,
  forcedTimeZone,
  tooltipId,
  firstField,
}) {
  const selectedDateRange = useMemo(() => {
    switch (second.type) {
      case complexValueTypes.Date:
        return { value: -1, label: 'Exact date' };
      case complexValueTypes.Time:
        return { value: -1, label: 'Exact time' };
      case complexValueTypes.DateTime:
        return { value: -1, label: 'Exact date and time' };
      default:
        if ([undefined, null].includes(second.value)) return null;
    }
    if (second.type === complexValueTypes.DateRange) {
      return { value: second.value, label: dateRanges[second.value] };
    }
  }, [second.value, second.type]);

  const dateRangeOptions = useMemo(() => {
    if (['Is', 'IsNot'].some((k) => basicOperationId[k] === operation)) {
      return [
        {
          label: '',
          options: [
            { value: -1, label: 'Exact date' },
            { value: 10, label: 'Yesterday' },
            { value: 9, label: 'Today' },
            { value: 11, label: 'Tomorrow' },
          ],
        },
        {
          label: '',
          options: [
            { value: 13, label: 'Last week' },
            { value: 12, label: 'This week' },
            { value: 14, label: 'Next week' },
          ],
        },
        {
          label: '',
          options: [
            { value: 2, label: 'Last month' },
            { value: 1, label: 'This month' },
            { value: 3, label: 'Next month' },
          ],
        },
        {
          label: '',
          options: [
            { value: 6, label: 'Last year' },
            { value: 5, label: 'This year' },
            { value: 7, label: 'Next year' },
            { value: 8, label: 'Year to date' },
          ],
        },
      ];
    }
    if (['Less', 'LessEqual', 'Greater', 'GreaterEqual'].some((k) => basicOperationId[k] === operation)) {
      return [
        { value: -1, label: 'Exact date' },
        { value: 9, label: 'Today' },
      ];
    }
    return [{ value: -1, label: 'Exact date' }];
  }, [operation]);

  const handleInputChange = (e) => onChange(e.target.value);

  const handleSetDateRange = (item) => {
    let correctType = complexValueTypes.DateRange;
    if (item.value === -2) correctType = complexValueTypes.DateTime;
    if (item.value === -1) correctType = complexValueTypes.Date;
    onChange(item.value, correctType);
  };

  const handleYesNoChange = (e, value) => onChange(value);

  const render = () => {
    if (['IsEmpty', 'IsNotEmpty', 'IsTrue', 'IsFalse'].some((k) => basicOperationId[k] === operation)) return null;
    if (fieldType === FieldTypeNames.DropDown || fieldType === FieldTypeNames.User || first.value === 'AssignedTo') {
      return (
        <DropdownValueEditor
          id={id}
          value={second.value}
          options={options}
          onChange={onChange}
          searchText={searchText}
          onSearch={onSearch}
          field={first.value}
          tooltipId={tooltipId}
        />
      );
    }

    if (fieldType === FieldTypeNames.Tags || first.value === 'TagList') {
      return (
        <TagsValueEditor
          id={id}
          value={second.value}
          options={options}
          onChange={onChange}
          tagsList={tagsList}
          tooltipId={tooltipId}
        />
      );
    }
    if (second.type === complexValueTypes.YesNo)
      return (
        <YesNoValueEditor
          id={`${id}-value`}
          name={`${id}-value`}
          selectedValue={second.value}
          field={firstField}
          onChange={handleYesNoChange}
          direction='column'
          disabled={first.value === null || first.value === undefined}
        />
      );
    if (second.type === complexValueTypes.Text || second.type === complexValueTypes.SharedResult)
      return <TextValueEditor id={id} value={second.value} onChange={handleInputChange} onKeyUp={onKeyUp} />;
    if (second.type === complexValueTypes.Number)
      return (
        <NumberValueEditor
          id={id}
          minimum={second}
          maximum={third}
          onMinimumChange={onChange}
          onMaximumChange={onChangeThird}
          onKeyUp={onKeyUp}
          isBetween={operation === basicOperationId.Between}
          fieldType={fieldType}
        />
      );
    if (['DateTime', 'Date', 'DateRange'].some((k) => complexValueTypes[k] === second.type))
      return (
        <DateValueEditor
          id={id}
          dateRangeOptions={dateRangeOptions}
          dateRangeValue={selectedDateRange}
          startDate={second}
          endDate={third}
          onDateRangeChange={handleSetDateRange}
          onStartDateChange={onChange}
          onEndDateChange={onChangeThird}
          showDatePicker={second.type === complexValueTypes.Date}
          isBetween={operation === basicOperationId.Between}
          forcedTimeZone={forcedTimeZone}
        />
      );
    if (second.type === complexValueTypes.Time)
      return (
        <TimeValueEditor
          id={id}
          startTime={second}
          endTime={third}
          onStartTimeChange={onChange}
          onEndTimeChange={onChangeThird}
          isBetween={operation === basicOperationId.Between}
          forcedTimeZone={forcedTimeZone}
        />
      );
    return null;
  };

  return render();
}

ValueEditor.propTypes = propTypes;
export default ValueEditor;
