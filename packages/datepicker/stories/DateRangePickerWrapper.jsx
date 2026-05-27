import React, { useState } from 'react';
import { DateRangePicker } from '../src';

const DateRangePickerWrapper = () => {
  const [startDate, setStartDate] = useState(new Date(2022, 11, 8));
  const [endDate, setEndDate] = useState(new Date(2022, 11, 11));

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <DateRangePicker
      id='test'
      onStartDateChange={handleStartDateChange}
      onEndDateChange={handleEndDateChange}
      startDateValue={startDate}
      endDateValue={endDate}
    />
  );
};

export default DateRangePickerWrapper;
