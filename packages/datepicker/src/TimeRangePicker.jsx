import React, { useRef } from 'react';
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

/**
 * TimeRangePicker — two TimePicker-style DatePickers side-by-side for selecting
 * a start/end time pair. Captions default to "Start time" / "End time"; pass
 * `hideCaption` to suppress them.
 *
 * Note: a forwardRef API will be added once @m-next/datepicker's DatePicker is
 * itself Phase-3 cleaned. Until then, the legacy `forwardRef` prop warns once
 * but is otherwise a no-op.
 */
function TimeRangePicker(props) {
  const {
    id: idProp,
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
    internalIdRef.current = `m-next-time-range-picker-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'time-range-picker-forwardRef-prop',
      '@m-next/datepicker: `forwardRef` prop on TimeRangePicker is not yet supported. It will be enabled when DatePicker itself is Phase-3 cleaned. For now, this prop is ignored.',
    );
  }

  return (
    <Group {...rest} className={className} style={{ ...wrapperStyle, ...style }}>
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

TimeRangePicker.displayName = 'TimeRangePicker';
TimeRangePicker.propTypes = propTypes;
export default TimeRangePicker;
