import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';

// types
const propTypes = {
  id: PropTypes.string.isRequired,
  startDateValue: PropTypes.instanceOf(Date),
  endDateValue: PropTypes.instanceOf(Date),
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  disabled: PropTypes.bool,
  interval: PropTypes.number,
  readOnly: PropTypes.bool,
  isMobile: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  anchorEl: PropTypes.string,
  forcedTimeZone: PropTypes.string,
};

const Group = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

const Row = styled.div(({ isValid }) => [
  {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    maxWidth: 300,
    paddingRight: 8,
    marginBottom: isValid ? 16 : 0,
  },
]);

const Column = styled.div(() => [
  {
    flexBasis: '50%',
    flexShrink: '0',
    flexGrow: '0',
  },
]);

const CalendarWrapper = styled.div`
  .react-datepicker__month-container {
    float: unset;
  }
`;

function DateRangePicker({
  id,
  startDateValue,
  endDateValue,
  onStartDateChange,
  onEndDateChange,
  disabled,
  interval,
  readOnly,
  isMobile,
  displayPreferences,
  containerStyle,
  anchorEl,
  forcedTimeZone,
}) {
  const handleChange = (data) => {
    const [start, end] = data;
    onStartDateChange(start);
    onEndDateChange(end);
  };

  const handleStartDateChange = (date) => {
    onStartDateChange(date);
    if (date > endDateValue || date === null) {
      onEndDateChange(null);
    }
  };

  return (
    <Group>
      <Row isValid={!endDateValue || endDateValue > startDateValue}>
        <Column>
          <DatePicker
            id={`${id}-start-value`}
            value={startDateValue}
            onChange={handleStartDateChange}
            isV4Design
            fontSize='13px'
            compactStyle
            marginless
            hideCalendar
            hideIcon
            caption='Start date'
            disabled={disabled}
            interval={interval}
            readOnly={readOnly}
            isMobile={isMobile}
            displayPreferences={displayPreferences}
            containerStyle={containerStyle}
            anchorEl={anchorEl}
            onBlur={handleStartDateChange}
            forcedTimeZone={forcedTimeZone}
          />
        </Column>

        <Column>
          <DatePicker
            id={`${id}-end-value`}
            value={endDateValue}
            onChange={onEndDateChange}
            isV4Design
            fontSize='13px'
            compactStyle
            marginless
            hideCalendar
            hideIcon
            minDate={startDateValue}
            caption='End date'
            validationMessage={endDateValue && endDateValue < startDateValue ? 'Invalid range' : null}
            disabled={disabled}
            interval={interval}
            readOnly={readOnly}
            isMobile={isMobile}
            displayPreferences={displayPreferences}
            containerStyle={containerStyle}
            anchorEl={anchorEl}
            onBlur={onEndDateChange}
            forcedTimeZone={forcedTimeZone}
          />
        </Column>
      </Row>

      <CalendarWrapper>
        <ReactDatePicker
          id={`${id}-calendar`}
          onChange={handleChange}
          inline
          selectsRange
          selected={endDateValue}
          startDate={startDateValue}
          endDate={endDateValue}
        />
      </CalendarWrapper>
    </Group>
  );
}

DateRangePicker.propTypes = propTypes;
export default DateRangePicker;
