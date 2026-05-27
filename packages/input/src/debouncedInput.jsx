// vendors
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import { ValidationMessage, Validation } from '@m-next/validation';
import { colors, convertClass } from '@m-next/styles';
import { useDebounce } from '@m-next/utilities/src/hooks';
import * as s from './input.styles';
import OutroAnimation from './outroAnimation';
// components
/* --------------------------------------------------*/

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hideCaption: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  id: PropTypes.string.isRequired,
  caption: PropTypes.string,
  name: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  inputStyle: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['text', 'email', 'search', 'number', 'password', 'tel', 'url', 'integer']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  width: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onRawChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  validationMessage: PropTypes.string,
  infoMessage: PropTypes.string,
  displayAuto: PropTypes.bool,
  legacyClass: PropTypes.string,
  isV4Design: PropTypes.bool,
  isMobile: PropTypes.bool,
  hidden: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  prefixIcon: PropTypes.string,
  useValidation: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  compactStyle: PropTypes.bool,
  onValidation: PropTypes.func,
  background: PropTypes.string,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  selectOnFocus: PropTypes.bool,
  isLabelBolded: PropTypes.bool,
  ariaLabel: PropTypes.string,
  suffixText: PropTypes.string,
  resetOnBlank: PropTypes.bool,
  updateRawValue: PropTypes.bool,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  truncate: PropTypes.bool, // Prevents text from exceeding max length if supplied.
  onLengthValid: PropTypes.func,
};

function DebouncedInput({
  id,
  hideCaption,
  className,
  disabled = false,
  forwardRef = null,
  caption = null,
  name = null,
  readonly = false,
  required = false,
  autoComplete = 'off',
  placeholder = null,
  style = null,
  inputStyle = null,
  tabIndex = 0,
  type = 'text',
  value = '',
  width = '100%',
  onBlur = null,
  onChange = null,
  onRawChange,
  onFocus = null,
  onKeyDown = null,
  onKeyUp = null,
  validationMessage = null,
  displayAuto = false,
  legacyClass = null,
  isV4Design = true,
  isMobile = false,
  hidden = false,
  ariaDescribedby = null,
  ariaLabelledBy = null,
  prefixIcon = '',
  useValidation = false,
  minLength = 0,
  maxLength = 0,
  compactStyle = true,
  onValidation = null,
  background = null,
  minValue = null,
  maxValue = null,
  selectOnFocus = false,
  isLabelBolded = true,
  ariaLabel = null,
  suffixText = null,
  resetOnBlank = false,
  updateRawValue = false,
  infoMessage = null,
  initialValue = null,
  truncate = false,
  onLengthValid = null,
}) {
  const [focused, setFocus] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [rawInput, setRawInput] = useState(value === undefined || value === null ? '' : value);

  const debouncedInput = useDebounce(rawInput, 500);

  // Refs to track latest values for unmount flush
  const rawInputRef = useRef(rawInput);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const resetOnBlankRef = useRef(resetOnBlank);
  rawInputRef.current = rawInput;
  valueRef.current = value;
  onChangeRef.current = onChange;
  resetOnBlankRef.current = resetOnBlank;

  useEffect(
    () => {
      const cleanValue = value ?? '';

      if (debouncedInput !== cleanValue && debouncedInput != null) {
        const shouldCallOnChange = !resetOnBlank || debouncedInput !== '';
        if (onChange && shouldCallOnChange) {
          onChange(debouncedInput);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedInput],
  );

  // Flush pending debounced value on unmount to prevent data loss
  useEffect(
    () => () => {
      const cleanValue = valueRef.current ?? '';
      const currentRawInput = rawInputRef.current;
      if (onChangeRef.current && currentRawInput !== cleanValue) {
        const shouldFlush = !resetOnBlankRef.current || currentRawInput !== '';
        if (shouldFlush) {
          onChangeRef.current(currentRawInput);
        }
      }
    },
    [],
  );

  useEffect(() => {
    setIsValid(!validationMessage);
  }, [validationMessage]);

  // TODO: Once React fixes bug with onBlur not always being triggered on unmount (https://github.com/facebook/react/issues/25194), see if we can revert this side-step
  // Instead of running onFocus and onBlur handlers directly on event, use effects that run on mount, change, and unmount, based on focused var set by event handlers
  // This allows iPad to run onBlur handler even when unmounting doesn't trigger onBlur event (see ticket: https://method.atlassian.net/browse/PL-38084)
  const unmountingForRealRef = useRef(false);
  const previouslyFocusedRef = useRef(false);
  useEffect(
    () => () => {
      unmountingForRealRef.current = true;
    },
    [],
  );

  useEffect(() => {
    if (value !== rawInput) {
      setRawInput(value === undefined || value === null ? '' : value);
      if (onRawChange) {
        onRawChange(value === undefined || value === null ? '' : value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, updateRawValue]);

  useEffect(() => {
    const processFocusChange = () => {
      if (focused && !previouslyFocusedRef.current && onFocus) onFocus(rawInput);
      if (
        ((!focused && previouslyFocusedRef.current && !unmountingForRealRef.current) ||
          (focused && unmountingForRealRef.current)) &&
        onBlur
      )
        onBlur(rawInput);
    };
    processFocusChange();
    previouslyFocusedRef.current = focused;
    return processFocusChange;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, onFocus, onBlur]);

  const handleChange = (e) => {
    let newValue = e.target.value;
    let lenIsValid = true;

    if (truncate && (maxLength || maxValue || minLength || minValue)) {
      if (type === 'integer') {
        newValue = newValue.replaceAll('.', '');
        if (Number(newValue) > maxValue) {
          newValue = maxValue;
          lenIsValid = false;
        }
        if (Number(newValue) < minValue) {
          newValue = minValue;
          lenIsValid = false;
        }
      } else if (type === 'number') {
        if (Number(newValue) > maxValue) {
          newValue = maxValue;
          lenIsValid = false;
        }
        if (Number(newValue) < minValue) {
          newValue = minValue;
          lenIsValid = false;
        }
      } else if (newValue.length > maxLength) {
        lenIsValid = false;
        newValue = newValue.substring(0, maxLength);
      }
    }

    onLengthValid?.(lenIsValid);
    setRawInput(newValue);
    if (!touched) setTouched(true);
  };

  const handleFocus = (e) => {
    if (selectOnFocus) e.target.select();
    setFocus(true);
    if (!touched) setTouched(true);
    if (rawInput === null || rawInput === undefined) setRawInput('');
  };

  const handleBlur = () => {
    setFocus(false);
    const cleanValue = value === undefined || value === null ? '' : value;
    if (resetOnBlank && cleanValue !== '' && rawInput === '') {
      setRawInput(initialValue ?? value);
    } else if (onChange && rawInput !== cleanValue) {
      onChange(rawInput);
    }
  };

  const getAutoCompleteDisplay = () => {
    if (type === 'password') return autoComplete;
    if (autoComplete !== 'off') return 'on';
    return 'chrome-off';
  };

  const handleValidation = (e) => {
    if (onValidation) onValidation(e);
  };

  const GetValidationRules = () => {
    const rules = [];
    if (required) {
      rules.push({ type: 'isRequired' });
    }
    if (type === 'email') {
      rules.push({ type: 'isValidEmail' });
    }

    if (minLength || maxLength) {
      rules.push({ type: 'isValidLength', minLength, maxLength });
    }
    if (minValue || maxValue) {
      rules.push({ type: 'isValidRange', minValue, maxValue });
    }
    return rules;
  };

  return (
    <s.Container
      id={`${id}-TextInput`}
      role='none'
      style={style}
      className={className}
      width={width}
      displayAuto={displayAuto}
      isValid={isValid} // no caption validation for old designs
      isV4Design={isV4Design}
      isHidden={hidden}
      compactStyle={compactStyle}
    >
      {!hideCaption && caption && (
        <Caption
          id={`${id}-input-caption`}
          required={required}
          label={caption}
          legacyClass={legacyClass}
          isValid={!isV4Design || isValid}
          isV4Design={isV4Design}
          isMobile={isMobile}
          float={focused || Boolean(placeholder || rawInput || prefixIcon)}
          focused={focused}
          elFor={`${id}-Input`}
          disabled={disabled}
          readOnly={readonly}
          background={background}
          isLabelBolded={isLabelBolded}
        />
      )}
      <s.InnerWrapper
        isValid={isValid}
        focused={focused}
        isV4Design={isV4Design}
        isMobile={isMobile}
        prefix={prefixIcon}
        readOnly={readonly}
        disabled={disabled}
      >
        {prefixIcon ? (
          <div className='mi-textinput-prefix'>
            {prefixIcon && <SvgIcon name={prefixIcon} size={16} color={colors['grey']} />}
          </div>
        ) : null}
        <input
          id={`${id}-Input`}
          ref={forwardRef}
          type={type === 'integer' ? 'number' : type}
          tabIndex={tabIndex}
          name={name}
          value={rawInput}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          readOnly={readonly}
          // setting placeholder to "off" does not disable autocomplete on chrome, more information here: https://gist.github.com/niksumeiko/360164708c3b326bd1c8
          autoComplete={getAutoCompleteDisplay()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          style={{ ...convertClass(legacyClass), ...inputStyle }}
          aria-label={caption || name || ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled}
          aria-labelledby={ariaLabelledBy}
          data-testid={`${id}-Input`}
          min={minValue}
          max={maxValue}
        />
        {suffixText && <s.SuffixWrapper>{suffixText}</s.SuffixWrapper>}
      </s.InnerWrapper>
      {useValidation && touched && !focused ? (
        <Validation
          id={`${id}-input-validation`}
          message={validationMessage}
          isV4Design={isV4Design}
          rules={GetValidationRules()}
          value={rawInput}
          onValidation={handleValidation}
          compactStyle={compactStyle}
        />
      ) : (
        <ValidationMessage
          id={`${id}-input-validation`}
          message={validationMessage}
          isV4Design={isV4Design}
          compactStyle={compactStyle}
        />
      )}
      <OutroAnimation show={Boolean(infoMessage)}>
        <s.InfoMessageWrapper compactStyle={compactStyle}>
          <SvgIcon
            id={`${id}-info-icon`}
            name='warning-sign'
            size={14}
            color={colors.grey}
            style={{ paddingRight: '4px' }}
          />
          <s.InfoMessage id={`${id}-info`} compactStyle={compactStyle}>
            {infoMessage}
          </s.InfoMessage>
        </s.InfoMessageWrapper>
      </OutroAnimation>
    </s.Container>
  );
}

DebouncedInput.propTypes = propTypes;

export default DebouncedInput;
