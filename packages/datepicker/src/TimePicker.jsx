import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';

// types
const propTypes = {
  id: PropTypes.string.isRequired,
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

function TimePicker({
  id,
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
}) {
  return (
    <DatePicker
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

TimePicker.propTypes = propTypes;
export default TimePicker;
