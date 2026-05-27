/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import SvgIcon from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import { convertLegacyControlStyle } from '@m-next/styles';
import { format, isDate, parseISO, parse, getMonth, getYear, getDate } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { findIana } from 'windows-iana';
import { useEnableScroll } from '@m-next/utilities/src/hooks';
import { ValidationMessage } from '@m-next/validation';

import * as s from './DatePicker.styles';
import setFormat, { setPlaceholderFormat } from './util';
import './DatePicker.css';

// types
const propTypes = {
  block: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  id: PropTypes.string.isRequired,
  caption: PropTypes.string,
  legacyClass: PropTypes.string,
  disabled: PropTypes.bool,
  formatType: PropTypes.oneOf([
    'Short Date',
    'Short Date and Time',
    'Long Date and Time',
    'Time',
    'Long Date',
    'Hour',
    'Day',
    'Day of Week',
    'Month',
    'Month and Year',
    'Year',
  ]),
  hideCaption: PropTypes.bool,
  interval: PropTypes.number,
  placeholder: PropTypes.string,
  useDateFormatPlaceholder: PropTypes.bool,
  readOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  marginless: PropTypes.bool,
  isMobile: PropTypes.bool,
  forceOpen: PropTypes.bool,
  autoFocus: PropTypes.bool,
  isV4Design: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  containerStyle: PropTypes.instanceOf(Object),
  compactStyle: PropTypes.bool,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anchorEl: PropTypes.string,
  usePortal: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
  hideCalendar: PropTypes.bool,
  hideIcon: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  validationMessage: PropTypes.string,
  largeStyle: PropTypes.bool,
  inputPadding: PropTypes.number,
};

/**
 * Wrapper component around
 */
function DatePicker({
  id,
  caption = null,
  legacyClass = null,

  disabled = false,
  formatType = 'Short Date',
  hideCaption = false,
  interval = 15,
  placeholder = null,
  useDateFormatPlaceholder = false,
  readOnly = false,
  value = null,
  width = null,
  onChange = null,
  onFocus = null,
  onBlur = null,
  onKeyDown = null,
  marginless = false,
  block = false,
  isMobile = false,
  forceOpen,
  autoFocus = false,
  isV4Design = false,
  displayPreferences,
  containerStyle,
  compactStyle,
  fontSize,
  anchorEl,
  usePortal = false,
  forcedTimeZone = null,
  hideCalendar = false,
  hideIcon = false,
  minDate,
  required = false,
  validationMessage,
  largeStyle = false,
  inputPadding = null,
}) {
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const picker = useRef(null);
  const containerRef = useRef(null);
  const mobilePicker = useRef(null);
  const valueOnFocusRef = useRef(null);
  const pendingValueRef = useRef(null);

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera);
  const hasTimeComponent = formatType.toLowerCase().includes('time') || formatType.toLowerCase().includes('hour');

  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [controlValue, setControlValue] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typedValue, setTypedValue] = useState(value);
  const [isValid, setIsValid] = useState(!validationMessage);

  // Create default portal container if usePortal is true and no custom anchorEl provided
  useEffect(() => {
    if (usePortal && !anchorEl) {
      const portalId = 'datepicker-portal-root';
      if (!document.getElementById(portalId)) {
        const portalDiv = document.createElement('div');
        portalDiv.id = portalId;
        document.body.appendChild(portalDiv);
      }
    }
  }, [usePortal, anchorEl]);

  const showMonthYearPicker = formatType === 'Month and Year' || formatType === 'Month' || formatType === 'Year';

  const formatMode = useMemo(() => {
    switch (formatType) {
      case 'Short Date':
      case 'Long Date':
      case 'Day':
      case 'Day of Week':
      case 'Month':
      case 'Month and Year':
      case 'Year':
        return 'Date';
      case 'Time':
      case 'Hour':
        return 'Time';
      default:
        return 'DateTime';
    }
  }, [formatType]);

  const monthObjs = [
    { text: 'January', value: 0 },
    { text: 'February', value: 1 },
    { text: 'March', value: 2 },
    { text: 'April', value: 3 },
    { text: 'May', value: 4 },
    { text: 'June', value: 5 },
    { text: 'July', value: 6 },
    { text: 'August', value: 7 },
    { text: 'September', value: 8 },
    { text: 'October', value: 9 },
    { text: 'November', value: 10 },
    { text: 'December', value: 11 },
  ];

  useEnableScroll(containerRef, '.react-datepicker__time-list');
  useEnableScroll(yearRef);
  useEnableScroll(monthRef);

  const dateFormat = setFormat(formatType, formatMode, displayPreferences);
  const dateFormatPlaceHolder = setPlaceholderFormat(formatType, formatMode, displayPreferences);
  useEffect(() => {
    const rawdate = value;
    if (!rawdate) {
      setControlValue(null);
      return;
    }
    let date = rawdate;
    if (!isDate(date)) {
      date = parseISO(rawdate);
    }

    if (date.toString().toLowerCase().includes('invalid')) {
      date = new Date(Date.parse(rawdate));
      if (date.toString().toLowerCase().includes('invalid')) {
        date = null;
      }
    }
    setControlValue(date);
  }, [value]);

  useEffect(() => {
    setIsValid(!validationMessage);
  }, [validationMessage]);

  const forceStateUpdate = (date) => {
    picker.current.setState({
      preSelection: date,
    });
    setControlValue(date);
  };
  const setMobileValue = () => {
    if (controlValue === null) {
      return '';
    }

    switch (formatMode) {
      case 'Date':
        return format(controlValue, 'yyyy-MM-dd');
      case 'Time':
        return format(controlValue, 'HH:mm');
      case 'DateTime':
      default:
        return `${format(controlValue, 'yyyy-MM-dd')}T${format(controlValue, 'HH:mm')}`;
    }
  };

  const forceTimezone = (date) => {
    if (forcedTimeZone) {
      let currentForcedTimeZone = forcedTimeZone;
      // To consider https://cldr.unicode.org/development/development-process/design-proposals/extended-windows-olson-zid-mapping#h.omrd39cryxw5
      if (currentForcedTimeZone.toLowerCase() === 'Mid-Atlantic Standard Time'.toLowerCase())
        currentForcedTimeZone = 'Etc/GMT+2';

      const ianaEquivalences = findIana(currentForcedTimeZone);

      if (ianaEquivalences.length === 0)
        console.warn('No IANA equivalences found for forcedTimeZone=', currentForcedTimeZone); // eslint-disable-line

      const utcDate = fromZonedTime(date, ianaEquivalences[0]);
      return utcDate;
    }

    return null;
  };

  const handleSetState = (e, source) => {
    if (/^\d+$/.test(picker.current.input?.value) && isTyping) {
      const date = new Date();
      if (Number(picker.current.input?.value) <= 0) {
        forceStateUpdate(date);
      }
      if (Number(picker.current.input?.value) >= 0 && picker.current.input?.value.length === 4 && isTyping) {
        date.setFullYear(Number(picker.current.input?.value));
        forceStateUpdate(date);
      }
      return;
    }
    if (e === null || e === undefined) {
      setIsFocused(true);
      setControlValue(null);

      if (source?.currentTarget.ariaLabel === 'Close') {
        if (onChange) {
          onChange(e, forceTimezone(e));
        }
      } else if (!isFocused) {
        if (onChange && !isTyping) {
          onChange(e, forceTimezone(e));
        }
      }
    } else {
      let newDateTime = e;
      // eslint-disable-next-line eqeqeq
      if (e != 'Invalid Date') {
        if (formatMode === 'Date' && e !== null) {
          // Default current time if picker mode is Date
          newDateTime = new Date(getYear(newDateTime), getMonth(newDateTime), getDate(newDateTime));
        }

        if (isTyping) {
          // Check if Day is 0 for the short day format
          if (formatType === 'Short Date') {
            const mmm0Regex = /^([a-z]{3,9})(?:[-\s]0)?$/i;
            const match = picker.current.input?.value.match(mmm0Regex);
            if (match) {
              const monthStr = match[1].toLowerCase();
              const monthObj = monthObjs.find(
                (m) => m.text.toLowerCase() === monthStr || m.text.slice(0, 3).toLowerCase() === monthStr,
              );
              if (monthObj) {
                const currentDate = new Date();
                newDateTime = new Date(currentDate.getFullYear(), monthObj.value, 1);
                setControlValue(newDateTime);
                forceStateUpdate(newDateTime);
                return;
              }
            }
          }
          if (newDateTime?.getFullYear() === 2001 && !typedValue.includes('200')) {
            const currentDate = new Date();
            newDateTime.setFullYear(currentDate.getFullYear());
          }
        }

        setControlValue(newDateTime);

        if ((picker && picker.current.isCalendarOpen()) || isFocused) {
          if (onChange && (!isTyping || source?.type === 'click' || hideCalendar)) {
            onChange(newDateTime, forceTimezone(newDateTime));
          }
        }
      }
    }
  };

  const handleMonthYearPicker = (month, year, date) => {
    setMonthPickerOpen(month);
    setYearPickerOpen(year || false);

    if (date) {
      if (month && monthRef) {
        setTimeout(() => {
          monthRef.current.scrollTop = 32 * getMonth(date);
        }, 50);
      }

      if (year && yearRef) {
        setTimeout(() => {
          yearRef.current.scrollTop = 32 * 5;
        }, 50);
      }
    }
  };

  const handleBlur = () => {
    handleMonthYearPicker(false, false);
    setIsTyping(false);

    // iOS datetime fix: Commit value on blur (when user clicks outside time wheels or Done)
    // iOS suppresses change events after the first time wheel interaction,
    // so we read the native input value directly on blur to capture all changes
    if (isIOS && isMobile && hasTimeComponent && mobilePicker.current) {
      const inputValue = mobilePicker.current.value;

      // Get the value to commit: pendingValueRef (if set), parsed input value, or controlValue
      let valueToCommit = pendingValueRef.current;
      if (!valueToCommit && inputValue) {
        valueToCommit = parseISO(inputValue);
      }
      if (!valueToCommit) {
        valueToCommit = controlValue;
      }

      // Commit if we have a valid value and it differs from the current prop value
      if (valueToCommit) {
        const currentPropTimestamp = value ? new Date(value).getTime() : null;
        const newTimestamp = new Date(valueToCommit).getTime();

        if (!Number.isNaN(newTimestamp) && newTimestamp !== currentPropTimestamp && onChange) {
          onChange(valueToCommit, forceTimezone(valueToCommit));
        }
      }

      // Clear pending value after commit
      pendingValueRef.current = null;

      if (onBlur) {
        onBlur();
      }
      setIsFocused(false);
      return;
    }

    // Original behavior for non-iOS
    if (onChange && isFocused) {
      onChange(controlValue, forceTimezone(controlValue));
    }

    if (onBlur) {
      onBlur();
    }
    setIsFocused(false);
  };

  const handleChange = (e) => {
    // This handler is for the React DatePicker widget (desktop calendar)
    // Mobile native input uses handleMobileChange + handleBlur flow instead
    // eslint-disable-next-line eqeqeq
    if (e != 'Invalid Date') {
      setControlValue(e);
      if (onChange) {
        onChange(e, forceTimezone(e));
      }
    }

    if (isFocused) return;

    // Don't call handleBlur for iOS mobile datetime - it has separate blur handling
    if (!(isIOS && isMobile && hasTimeComponent)) {
      handleBlur();
    }
  };

  const handleOnSelect = (e) => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (e && e.toString() === (controlValue ? controlValue.toString() : '')) {
      return;
    }
    if ((picker && picker.current.isCalendarOpen()) || isFocused) {
      if (userAgent.match(/Mac OS/i)) {
        setIsFocused(false);
      }
    }
  };

  const handleMobileChange = (e) => {
    const currentValue = e.target.value;

    let date = null;

    switch (formatMode) {
      case 'Date':
        date = parse(
          `${e.target.value} ${controlValue === null ? '00:00' : format(controlValue, 'HH:mm')}`,
          'yyyy-MM-dd HH:mm',
          new Date(),
        );
        break;
      case 'Time':
        date = parse(`${format(new Date(), 'yyyy-MM-dd')} ${e.target.value}`, 'yyyy-MM-dd HH:mm', new Date());
        break;
      case 'DateTime':
      default:
        date = parseISO(currentValue);
        break;
    }

    // iOS datetime fix: Only update internal state, DON'T call onChange
    // This prevents React re-render from breaking iOS's event flow
    // The blur handler will commit when user is done
    if (isIOS && hasTimeComponent) {
      pendingValueRef.current = date; // Store synchronously for immediate access
      setControlValue(date); // Update state for UI
      return;
    }

    // Standard mobile behavior for non-iOS or non-datetime
    handleChange(date);
  };
  const tryParseTime = (rawInput) => {
    const dateTimeStr = rawInput;
    const timeOnlyRegex = /[\s]*[\d]+((:|\.)[\d]+)?[\s]*/i;
    const timePickerRegex = /[\d]+((:|\.)?[\d][\d])?[\s]?([([AP][M]?)?[\s]*/i;
    const timeRegex = formatMode === 'Time' ? timePickerRegex : /[\s]*[\d]+((:|\.)[\d]+)?(\s)?([AP][M]?)[\s]*/i;

    let dateOnlyStr = rawInput;
    let timeOnlyStr = null;

    if (dateTimeStr && dateTimeStr.match(timeRegex)) {
      // format time
      const timeStringMatch = dateTimeStr.match(timeRegex)[0];
      const timeString = timeStringMatch.toLowerCase().replace(/(^\s+|\s+$)/g, '');

      // get am/pm
      let isPm = timeString.indexOf('p') >= 0;

      if (timeString.match(timeOnlyRegex)) {
        timeOnlyStr = timeString.match(timeOnlyRegex)[0].replace(/(^\s+|\s+$)/g, '');
      }

      if (timeOnlyStr) {
        if (timeOnlyStr.length === 1) {
          timeOnlyStr = `${timeOnlyStr.padStart(2, '0')}:00`;
        }
        if (timeOnlyStr.length === 2) {
          if (timeOnlyStr > 12) {
            isPm = null;
            timeOnlyStr = `${timeOnlyStr}:00`;
          } else {
            timeOnlyStr = `${timeOnlyStr}:00`;
          }
        }
        if (timeOnlyStr.length > 2) {
          // parse time with divider
          let timeParts = null;
          if (timeOnlyStr.indexOf('.') > 0 || timeOnlyStr.indexOf(':') > 0) {
            if (timeOnlyStr.indexOf('.') > 0) {
              timeOnlyStr = timeOnlyStr.replace('.', ':');
            }

            timeParts = timeOnlyStr.split(':', 2);
            if (timeParts && timeParts.length === 2) {
              if (timeParts[0] > 12) {
                isPm = null;
              }
              timeOnlyStr =
                timeParts[0] < 10
                  ? `${timeParts[0].padStart(2, '0')}:${timeParts[1]}`
                  : `${timeParts[0]}:${timeParts[1]}`;
            }
          } else {
            // parse time no divider
            timeParts = [timeOnlyStr.slice(0, timeOnlyStr.length - 2), timeOnlyStr.slice(timeOnlyStr.length - 2)];
            if (timeParts[0].length === 1) {
              timeOnlyStr = `${timeParts[0].padStart(2, '0')}:${timeParts[1]}`;
            } else {
              if (timeParts[0] > 12) {
                isPm = null;
              }
              timeOnlyStr = `${timeParts[0]}:${timeParts[1]}`;
            }
          }
        }
      }

      let hrFormat = '';
      if (typeof isPm === 'boolean') hrFormat = isPm ? ' PM' : ' AM';
      timeOnlyStr = `${timeOnlyStr}${hrFormat}`;
      dateOnlyStr = dateOnlyStr.replace(timeString, '').trim();
    }

    return {
      dateStr: dateOnlyStr ? dateOnlyStr.trim() : dateOnlyStr,
      timeStr: timeOnlyStr || '',
    };
  };

  const parseDateTime = (rawInput) => {
    const parsed = tryParseTime(rawInput);
    if (parsed !== 'Invalid Date') {
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const dateTimeStr = `${parsed.dateStr || currentDate} ${parsed.timeStr || ''}`;
      if (!parsed.dateStr) {
        const datetimeFormat12h = 'yyyy-MM-dd hh:mm a';
        const datetimeFormat24h = 'yyyy-MM-dd HH:mm';
        return parse(
          `${format(new Date(), 'yyyy-MM-dd')} ${parsed.timeStr}`,
          parsed.timeStr.indexOf('P') >= 0 || parsed.timeStr.indexOf('A') >= 0 ? datetimeFormat12h : datetimeFormat24h,
          new Date(),
        );
      }
      const parsedDate = parse(dateTimeStr.trim(), dateFormat, new Date());
      return parsedDate;
    }
    return parse(rawInput, dateFormat, new Date());
  };

  const handleKeyDown = (e) => {
    if (!isTyping) setIsTyping(true);
    if (e.keyCode === 13 || e.keyCode === 9) {
      setIsTyping(false);
      picker.current.setOpen(false);
      handleChange(controlValue);
      setIsFocused(false);
    } else if (e.keyCode >= 33 && e.keyCode <= 40) {
      // ignore key press, navigating calendar with keyboard.
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleFocus = () => {
    // Store value when picker opens to detect iOS auto-population
    valueOnFocusRef.current = value;

    if (onFocus) {
      onFocus();
    }
    setIsFocused(true);
  };

  const handleIconClick = () => {
    if (isMobile) {
      if (mobilePicker.current) {
        mobilePicker.current.click();
        mobilePicker.current.focus();
      }
    } else {
      picker.current.setFocus();
    }
  };

  const handleMobileClick = () => {
    if (isMobile) {
      handleIconClick();
    }
  };

  const handleChangeRaw = (e) => {
    setTypedValue(e.target.value);
    if (!picker || !picker.current.isCalendarOpen()) {
      const parsedData = parseDateTime(e.target.value);
      // eslint-disable-next-line eqeqeq
      if (parsedData != 'Invalid Date') {
        handleSetState(parsedData, e);
      } else {
        handleSetState(controlValue, e);
      }
    }
  };

  const controlStyle = useMemo(() => convertLegacyControlStyle(legacyClass), [legacyClass]);

  const renderHeader = (
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    decreaseYear,
    increaseYear,
  ) => {
    const monthsList = monthObjs.map((item) => (
      <li
        key={item.value}
        onClick={() => {
          changeMonth(item.value);
          handleMonthYearPicker(false, false);
        }}
        className={format(date, 'MMMM') === item.text ? 'active' : ''}
      >
        {item.text}
      </li>
    ));

    const yearsList = [];
    for (let i = getYear(date) - 5; i <= getYear(date) + 10; i++) {
      yearsList.push(
        <li
          key={i}
          onClick={() => {
            changeYear(i);
            handleMonthYearPicker(false, false);
          }}
          className={getYear(date) === i ? 'active' : ''}
        >
          {i}
        </li>,
      );
    }

    const decrementFnc = formatMode === 'Year' ? decreaseYear : decreaseMonth;
    const incrementFnc = formatMode === 'Year' ? increaseYear : increaseMonth;

    return (
      <s.HeaderContainer
        mode={formatMode}
        disabled={disabled}
        formatType={formatType}
        backgroundColor={controlStyle && controlStyle.backgroundColor ? controlStyle.backgroundColor : null}
        color={controlStyle && controlStyle.color ? controlStyle.color : null}
        className={legacyClass}
        isV4Design={isV4Design}
        size={fontSize}
        onMouseDown={(e) => e.preventDefault()}
      >
        <s.HeaderWrapper>
          <s.ChevronWrapper onClick={decrementFnc} disabled={prevMonthButtonDisabled}>
            <SvgIcon size={8} name='chevron-left' />
          </s.ChevronWrapper>
          <s.DateWrapper>
            {formatMode !== 'Year' && (
              <s.SelectorWrapper rPadding='5px' onClick={() => handleMonthYearPicker(!monthPickerOpen, false, date)}>
                <label>{format(date, 'MMMM')}</label>
                <s.ChevronWrapper>
                  <SvgIcon size={8} name='chevron-down' />
                </s.ChevronWrapper>
              </s.SelectorWrapper>
            )}
            <s.SelectorWrapper lPadding='5px' onClick={() => handleMonthYearPicker(false, !yearPickerOpen, date)}>
              <label>{getYear(date)}</label>
              <s.ChevronWrapper rPadding='0'>
                <SvgIcon size={8} name='chevron-down' />
              </s.ChevronWrapper>
            </s.SelectorWrapper>
          </s.DateWrapper>
          <s.ChevronWrapper onClick={incrementFnc} disabled={nextMonthButtonDisabled}>
            <SvgIcon size={8} name='chevron-right' />
          </s.ChevronWrapper>
        </s.HeaderWrapper>
        <s.DropdownWrapper showTime={formatMode === 'DateTime'} visible={monthPickerOpen}>
          <ul ref={monthRef}>{monthsList}</ul>
        </s.DropdownWrapper>
        <s.DropdownWrapper showTime={formatMode === 'DateTime'} visible={yearPickerOpen}>
          <ul ref={yearRef}>{yearsList}</ul>
        </s.DropdownWrapper>
      </s.HeaderContainer>
    );
  };
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  return (
    <s.Wrapper
      block={block}
      id={id}
      width={width}
      style={containerStyle}
      isV4Design={isV4Design}
      compactStyle={compactStyle}
      disabled={disabled}
      isValid={isValid}
    >
      {caption && !hideCaption && (
        <Caption
          id={id}
          label={caption}
          legacyClass={legacyClass}
          isV4Design={isV4Design}
          elFor={`DTP-${id}`}
          disabled={disabled}
          float={isFocused || Boolean(placeholder || value || (useDateFormatPlaceholder && dateFormatPlaceHolder))}
          required={required}
          isValid={!isV4Design || !validationMessage}
          onClick={
            isFocused || Boolean(placeholder || value || (useDateFormatPlaceholder && dateFormatPlaceHolder))
              ? null
              : handleIconClick
          }
        />
      )}
      <s.ContainerWrapper marginless={marginless || compactStyle}>
        <s.Container
          marginless={marginless || compactStyle}
          mode={formatMode}
          disabled={disabled}
          formatType={formatType}
          ref={containerRef}
          //       style={controlStyle}
          backgroundColor={controlStyle && controlStyle.backgroundColor ? controlStyle.backgroundColor : null}
          color={controlStyle && controlStyle.color ? controlStyle.color : null}
          className={legacyClass}
          isV4Design={isV4Design}
          size={fontSize}
          id={`${id}-container`}
          isValid={!validationMessage}
          largeStyle={largeStyle}
          inputPadding={inputPadding}
        >
          {isMobile && (
            <input
              id={`${id}-DTP-MOBILE-INPUT`}
              ref={mobilePicker}
              disabled={disabled}
              readOnly={readOnly}
              type={formatMode === 'DateTime' ? 'datetime-local' : formatMode.toLowerCase()}
              value={setMobileValue()}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: controlValue === null ? '32px' : '64px',
                bottom: 0,
                zIndex: 2,
                opacity: 0,
                maxWidth: 'unset',
                width: controlValue === null ? '100%' : 'calc(100% - 64px)',
              }}
              onChange={handleMobileChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={handleMobileClick}
            />
          )}
          <ReactDatePicker
            id={`DTP-${id}`}
            name={`DTP-${id}`}
            popperPlacement='bottom-start'
            popperModifiers={{
              flip: {
                enabled: true,
                behavior: ['bottom-start', 'top-start'],
                crossAxis: false,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'viewport',
              },
              hide: {
                enabled: false,
              },
            }}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
              decreaseYear,
              increaseYear,
            }) =>
              renderHeader(
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
                decreaseYear,
                increaseYear,
              )
            }
            ref={picker}
            disabled={disabled}
            readOnly={isMobile || readOnly}
            fixedHeight
            isClearable={!disabled}
            timeIntervals={interval}
            showTimeSelect={formatMode === 'DateTime' || formatMode === 'Time'}
            showTimeSelectOnly={formatMode === 'Time'}
            showMonthYearPicker={showMonthYearPicker}
            dateFormat={dateFormat}
            selected={controlValue}
            placeholderText={useDateFormatPlaceholder ? dateFormatPlaceHolder || placeholder : placeholder}
            onChange={handleSetState}
            onChangeRaw={handleChangeRaw}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSelect={handleOnSelect}
            onCalendarClose={() => handleMonthYearPicker(false, false)}
            onKeyDown={handleKeyDown}
            autoComplete='off'
            autoFocus={autoFocus}
            tabIndex={0}
            title={caption}
            allowSameDay
            portalId={usePortal ? anchorEl || 'datepicker-portal-root' : undefined}
            popperProps={usePortal ? { strategy: 'fixed' } : undefined}
            open={hideCalendar ? false : forceOpen}
            minDate={minDate}
            className={largeStyle ? 'large-style' : ''}
          />
          {isMobile && userAgent.match(/Android/i) && controlValue !== '' && (
            <s.MobileTrigger onClick={handleIconClick} />
          )}
          {!hideIcon && (
            <s.IconWrapper disabled={disabled} isV4Design={isV4Design} onClick={handleIconClick}>
              <s.IconHolder>
                <SvgIcon size={16} name={isV4Design ? 'calendar-V4' : 'calendar'} color={controlStyle.color} />
              </s.IconHolder>
            </s.IconWrapper>
          )}
        </s.Container>
        <ValidationMessage
          id={`${id}-input-validation`}
          message={validationMessage}
          isV4Design={isV4Design}
          compactStyle
        />
      </s.ContainerWrapper>
    </s.Wrapper>
  );
}

DatePicker.propTypes = propTypes;
export default DatePicker;
