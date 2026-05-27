import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';

// types
const propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  caption: PropTypes.string,
  onChange: PropTypes.func,
  forcedTimeZone: PropTypes.string,
  autoFocus: PropTypes.bool,
};

const Group = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

function DatePickerCalendar({ id, value, caption, onChange, forcedTimeZone, autoFocus = false }) {
  const handleChange = (data) => {
    onChange(data);
  };

  return (
    <Group>
      <DatePicker
        id={`${id}-value`}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        isV4Design
        fontSize='13px'
        compactStyle
        marginless
        hideCalendar
        hideIcon
        caption={caption}
        forcedTimeZone={forcedTimeZone}
        popperPlacement='bottom-start'
        popperModifiers={{
          flip: {
            behavior: ['top-start'],
            crossAxis: false,
          },
          preventOverflow: {
            enabled: false, // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
          },
          hide: {
            enabled: false, // turn off since needs preventOverflow to be enabled
          },
        }}
      />

      <ReactDatePicker id={`${id}-calendar`} onChange={handleChange} inline selected={value} />
    </Group>
  );
}

DatePickerCalendar.propTypes = propTypes;
export default DatePickerCalendar;
