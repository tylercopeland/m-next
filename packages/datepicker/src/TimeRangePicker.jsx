import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import DatePicker from './DatePicker';

// types
const propTypes = {
  id: PropTypes.string.isRequired,
  startTimeValue: PropTypes.instanceOf(Date),
  endTimeValue: PropTypes.instanceOf(Date),
  onStartTimeChange: PropTypes.func,
  onEndTimeChange: PropTypes.func,
  block: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  interval: PropTypes.number,
  readOnly: PropTypes.bool,
  isMobile: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  wrapperStyle: PropTypes.instanceOf(Object),
  rowStyle: PropTypes.instanceOf(Object),
  anchorEl: PropTypes.string,
  usePortal: PropTypes.bool,
  hideCaption: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const Group = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

const Row = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    maxWidth: '280px',
  },
]);

const Column = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flexBasis: '50%',
    flexShrink: '0',
    flexGrow: '0',
  },
]);

function TimeRangePicker({
  id,
  startTimeValue,
  endTimeValue,
  onStartTimeChange,
  onEndTimeChange,
  block,

  disabled,
  interval,
  readOnly,
  isMobile,
  displayPreferences,
  containerStyle,
  wrapperStyle,
  rowStyle,
  anchorEl,
  usePortal,
  hideCaption,
  forcedTimeZone,
}) {
  return (
    <Group style={wrapperStyle}>
      <Row style={rowStyle}>
        <Column>
          <DatePicker
            id={`${id}-start-value`}
            value={startTimeValue}
            formatType='Time'
            onChange={onStartTimeChange}
            isV4Design
            fontSize='13px'
            compactStyle
            marginless
            largeStyle
            block={block}
            caption={hideCaption ? null : 'Start time'}
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
        </Column>

        <Column>
          <DatePicker
            id={`${id}-end-value`}
            value={endTimeValue}
            formatType='Time'
            onChange={onEndTimeChange}
            isV4Design
            fontSize='13px'
            compactStyle
            marginless
            largeStyle
            block={block}
            caption={hideCaption ? null : 'End time'}
            disabled={disabled}
            interval={interval}
            readOnly={readOnly}
            isMobile={isMobile}
            displayPreferences={displayPreferences}
            containerStyle={containerStyle}
            anchorEl={anchorEl}
            usePortal={usePortal}
            forcedTimeZone={forcedTimeZone}
          />
        </Column>
      </Row>
    </Group>
  );
}

TimeRangePicker.propTypes = propTypes;
export default TimeRangePicker;
