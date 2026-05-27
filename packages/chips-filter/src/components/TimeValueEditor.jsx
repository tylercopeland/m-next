import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { TimePicker, TimeRangePicker } from '@m-next/datepicker';
import { Predicate } from '@m-next/types';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startTime: Predicate,
  endTime: Predicate,
  onStartTimeChange: PropTypes.func,
  onEndTimeChange: PropTypes.func,
  isBetween: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

function TimeValueEditor({ id, startTime, endTime, onStartTimeChange, onEndTimeChange, isBetween, forcedTimeZone }) {
  const startTimeValue = useMemo(() => (startTime?.value ? new Date(startTime.value) : null), [startTime?.value]);
  const endTimeValue = useMemo(() => (endTime?.value ? new Date(endTime.value) : null), [endTime?.value]);

  const handeleStartTimeChange = (value) => {
    onStartTimeChange(value);
  };

  const handleEndTimeChange = (value) => {
    onEndTimeChange(value);
  };

  const render = () => (
    <Wrapper>
      {isBetween ? (
        <TimeRangePicker
          id={id}
          startTimeValue={startTimeValue}
          endTimeValue={endTimeValue}
          onStartTimeChange={handeleStartTimeChange}
          onEndTimeChange={handleEndTimeChange}
          forcedTimeZone={forcedTimeZone}
        />
      ) : (
        <TimePicker id={id} value={startTimeValue} onChange={handeleStartTimeChange} forcedTimeZone={forcedTimeZone} />
      )}
    </Wrapper>
  );

  return render();
}

TimeValueEditor.propTypes = propTypes;
export default TimeValueEditor;
