import React, { useRef } from 'react';
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
  onChange: PropTypes.func,

  block: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  caption: PropTypes.string,
  disabled: PropTypes.bool,
  interval: PropTypes.number,
  readOnly: PropTypes.bool,
  isMobile: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  anchorEl: PropTypes.string,
  usePortal: PropTypes.bool,
  required: PropTypes.bool,
  validationMessage: PropTypes.string,
  forcedTimeZone: PropTypes.string,
};

/**
 * TimePicker — thin wrapper around DatePicker that hardcodes `formatType="Time"`
 * with V4 design defaults. Use this when you only want time selection.
 *
 * Note: a forwardRef API will be added once @m-next/datepicker's DatePicker is
 * itself Phase-3 cleaned. Until then, the legacy `forwardRef` prop warns once
 * but is otherwise a no-op.
 */
function TimePicker(props) {
  const {
    id: idProp,
    value,
    onChange,
    block,
    caption,
    disabled,
    interval,
    readOnly,
    isMobile,
    displayPreferences,
    containerStyle,
    anchorEl,
    usePortal,
    required,
    validationMessage,
    forcedTimeZone,

    // Standard DOM envelope — forwarded through DatePicker to its s.Wrapper root.
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
    internalIdRef.current = `m-next-time-picker-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'time-picker-forwardRef-prop',
      '@m-next/datepicker: `forwardRef` prop on TimePicker is not yet supported. It will be enabled when DatePicker itself is Phase-3 cleaned. For now, this prop is ignored.',
    );
  }

  return (
    <DatePicker
      {...rest}
      className={className}
      style={style}
      id={`${id}-value`}
      value={value}
      formatType='Time'
      onChange={onChange}
      isV4Design
      fontSize='13px'
      compactStyle
      marginless
      largeStyle
      required={required}
      validationMessage={validationMessage}
      block={block}
      caption={caption}
      disabled={disabled}
      interval={interval}
      readOnly={readOnly}
      isMobile={isMobile}
      displayPreferences={displayPreferences}
      containerStyle={containerStyle}
      anchorEl={anchorEl}
      usePortal={usePortal}
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
  );
}

TimePicker.displayName = 'TimePicker';
TimePicker.propTypes = propTypes;
export default TimePicker;
