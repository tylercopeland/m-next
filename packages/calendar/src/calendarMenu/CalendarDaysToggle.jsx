import React from 'react';
import PropTypes from 'prop-types';
import Caption from '@m-next/caption';
import { Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';

import * as c from '../Calendar.styles';
import '../calendar.css';

function CalendarDaysToggle(props) {
  const {
    calendarDays = [], // Array of bools for each day of week
    setCalendarDays = () => {},
    isMobile,
    disabled = false,
    label = 'Days of the week',
    styles = {},
    useTextLabel = false,
  } = props;

  const toggleDay = (index) => {
    calendarDays[index] = !calendarDays[index];
    setCalendarDays([...calendarDays]);
  };

  const dayName = (index) => {
    switch (index) {
      case 0:
      case 6:
        return 'S';
      case 1:
        return 'M';
      case 2:
      case 4:
        return 'T';
      case 3:
        return 'W';
      case 5:
        return 'F';
      default:
        break;
    }
  };

  function calendarDay(toggle, index) {
    const isLastToggledOn =
      calendarDays.filter((day) => day === true).length === 1 &&
      calendarDays[index] === calendarDays.find((day) => day === true);
    return (
      <c.calendarDayWrapper
        index={index}
        toggle={toggle}
        isMobile={isMobile}
        isLastToggledOn={isLastToggledOn}
        className={`${isLastToggledOn ? '' : 'cal-day-select-hover'}${toggle ? ' selected' : ''}`}
        key={`${index}-day`}
        onClick={isLastToggledOn || disabled ? null : () => toggleDay(index)}
      >
        <c.calendarDay toggle={toggle}>{dayName(index)}</c.calendarDay>
      </c.calendarDayWrapper>
    );
  }
  return (
    <div style={{ paddingBottom: useTextLabel ? undefined : '16px' }}>
      {useTextLabel ? (
        <Text>{label}</Text>
      ) : (
        <Caption align='left' color={colors['method-darker']} label={label} style={{ fontSize: '16px' }} />
      )}
      <c.calendarDaysToggleWrapper
        style={{
          ...styles,
          marginTop: useTextLabel ? '16px' : undefined,
        }}
      >
        {calendarDays.map((toggle, index) => calendarDay(toggle, index))}
      </c.calendarDaysToggleWrapper>
    </div>
  );
}

const calDaysTogglepropTypes = {
  calendarDays: PropTypes.arrayOf(PropTypes.bool),
  setCalendarDays: PropTypes.func,
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  useTextLabel: PropTypes.bool,
};

CalendarDaysToggle.propTypes = calDaysTogglepropTypes;
export default CalendarDaysToggle;
