import React, { useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
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

/**
 * DateRangePicker — two text DatePickers (Start date / End date) above an
 * inline ReactDatePicker calendar that supports range selection by clicking
 * two dates. End date validates against start date.
 *
 * Note: a forwardRef API will be added once @m-next/datepicker's DatePicker is
 * itself Phase-3 cleaned. Until then, the legacy `forwardRef` prop warns once
 * but is otherwise a no-op.
 */
function DateRangePicker(props) {
  const {
    id: idProp,
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

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-date-range-picker-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'date-range-picker-forwardRef-prop',
      '@m-next/datepicker: `forwardRef` prop on DateRangePicker is not yet supported. It will be enabled when DatePicker itself is Phase-3 cleaned. For now, this prop is ignored.',
    );
  }

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

DateRangePicker.displayName = 'DateRangePicker';
DateRangePicker.propTypes = propTypes;
export default DateRangePicker;
