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

/**
 * DatePickerCalendar — a text DatePicker (date-only) above an inline calendar.
 * Same shape as DateRangePicker but for a single date.
 *
 * Note: a forwardRef API will be added once @m-next/datepicker's DatePicker is
 * itself Phase-3 cleaned. Until then, the legacy `forwardRef` prop warns once
 * but is otherwise a no-op.
 */
function DatePickerCalendar(props) {
  const {
    id: idProp,
    value,
    caption,
    onChange,
    forcedTimeZone,
    autoFocus = false,

    // Standard DOM envelope — forwarded to the Group root.
    className,
    style,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-date-picker-calendar-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'date-picker-calendar-forwardRef-prop',
      '@m-next/datepicker: `forwardRef` prop on DatePickerCalendar is not yet supported. It will be enabled when DatePicker itself is Phase-3 cleaned. For now, this prop is ignored.',
    );
  }

  const handleChange = (data) => {
    onChange(data);
  };

  return (
    <Group {...rest} className={className} style={style}>
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

DatePickerCalendar.displayName = 'DatePickerCalendar';
DatePickerCalendar.propTypes = propTypes;
export default DatePickerCalendar;
