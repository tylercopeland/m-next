import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { DateRangePicker, DatePickerCalendar } from '@m-next/datepicker';
import styled from '@emotion/styled';
import { Predicate } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dateRangeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number, label: PropTypes.string })),
    }),
  ),
  dateRangeValue: PropTypes.shape({ value: PropTypes.number, label: PropTypes.string }),
  startDate: Predicate,
  endDate: Predicate,
  onDateRangeChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  showDatePicker: PropTypes.bool,
  isBetween: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
]);

function DateValueEditor({
  id,
  dateRangeOptions,
  dateRangeValue,
  startDate,
  endDate,
  onDateRangeChange,
  onStartDateChange,
  onEndDateChange,
  showDatePicker,
  isBetween,
  forcedTimeZone,
}) {
  const startDateValue = useMemo(() => (startDate?.value ? new Date(startDate.value) : null), [startDate?.value]);
  const endDateValue = useMemo(() => (endDate?.value ? new Date(endDate.value) : null), [endDate?.value]);
  const handeleStartTimeChange = (value) => {
    onStartDateChange(value);
  };

  const handleEndTimeChange = (value) => {
    onEndDateChange(value);
  };

  const render = () => (
    <Wrapper>
      {!isBetween && (
        <Dropdown
          id={`${id}-date-range`}
          options={dateRangeOptions}
          onChange={onDateRangeChange}
          placeholder='Choose date'
          dropdownStyle='single'
          value={dateRangeValue}
          required
          hasDividersInsteadOfHeaders
          isV4Design
        />
      )}

      {showDatePicker && isBetween && (
        <DateRangePicker
          id={id}
          startDateValue={startDateValue}
          endDateValue={endDateValue}
          onStartDateChange={handeleStartTimeChange}
          onEndDateChange={handleEndTimeChange}
          forcedTimeZone={forcedTimeZone}
        />
      )}
      {showDatePicker && !isBetween && (
        <DatePickerCalendar
          id={id}
          value={startDateValue}
          onChange={handeleStartTimeChange}
          caption='Start date'
          forcedTimeZone={forcedTimeZone}
          autoFocus
        />
      )}
    </Wrapper>
  );

  return render();
}

DateValueEditor.propTypes = propTypes;
export default DateValueEditor;
