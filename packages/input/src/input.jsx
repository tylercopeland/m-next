// vendors
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import { ValidationMessage, Validation } from '@m-next/validation';
import { colors, convertLegacyControlStyle } from '@m-next/styles';
// components
import * as s from './input.styles';

/* --------------------------------------------------*/

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hideCaption: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  inputStyle: PropTypes.instanceOf(Object),
  tabIndex: PropTypes.number,
  type: PropTypes.oneOf(['text', 'email', 'search', 'number', 'password', 'tel', 'url']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  width: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  validationMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  displayAuto: PropTypes.bool,
  legacyClass: PropTypes.string,
  isV4Design: PropTypes.bool,
  isMobile: PropTypes.bool,
  hidden: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
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
  innerStyle: PropTypes.instanceOf(Object),
  autoFocus: PropTypes.bool,
  suffixText: PropTypes.string,
  infoLevel: PropTypes.oneOf(['error', 'warning', 'informative']),
};

function Input({
  id,
  hideCaption,
  className,
  disabled = false,
  forwardRef = null,
  label = null,
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
  prefixIcon = '',
  useValidation = false,
  minLength = 0,
  maxLength = 0,
  compactStyle = false,
  onValidation = null,
  background = null,
  minValue = null,
  maxValue = null,
  selectOnFocus = false,
  isLabelBolded = true,
  innerStyle = null,
  autoFocus = false,
  suffixText = null,
  infoLevel = 'error',
}) {
  const [focused, setFocus] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);

  // const [currentValue, setCurrentValue] = useState(value === undefined || value === null ? '' : value);
  const inputRef = useRef(null);

  // Sync the forwardRef with inputRef
  useEffect(() => {
    if (forwardRef) {
      if (typeof forwardRef === 'function') {
        forwardRef(inputRef.current);
      } else if (forwardRef) {
        // eslint-disable-next-line no-param-reassign
        forwardRef.current = inputRef.current;
      }
    }
  }, [forwardRef]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (infoLevel !== 'informative') {
      setIsValid(!validationMessage);
    }
  }, [validationMessage, infoLevel]);

  // Check for length and set info message visibility
  useEffect(() => {
    const currentValue = value === undefined || value === null ? '' : value;
    const valueLength = String(currentValue).length;

    if (infoLevel === 'informative' && valueLength >= 30) {
      setShowInfoMessage(true);
    } else {
      setShowInfoMessage(false);
    }
  }, [value, infoLevel]);

  // Build info message dynamically
  const getInfoMessage = () => {
    if (infoLevel === 'informative' && maxLength > 0) {
      return `Max length ${maxLength}`;
    }
    return '';
  };

  // useEffect(() => {
  //   setCurrentValue(value === undefined || value === null ? '' : value);
  // }, [value]);

  const handleChange = (e) => {
    if (maxLength > 0 && infoLevel === 'informative' && e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }

    if (onChange) onChange(e);
    if (!touched) setTouched(true);
    // setCurrentValue(e.target.value);
  };

  const handleFocus = (e) => {
    if (selectOnFocus) e.target.select();
    if (onFocus) onFocus(e);
    setFocus(true);
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);
    setFocus(false);
  };

  const getAutoCompleteDisplay = () => {
    if (type === 'password') return autoComplete;
    if (autoComplete !== 'off') return 'on';
    return 'chrome-off';
  };

  const handleValidation = (e) => {
    if (onValidation) onValidation(e);
    //  setIsValid(e);
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
      {!hideCaption && label && (
        <Caption
          id={`${id}-input-caption`}
          required={required}
          label={label}
          legacyClass={legacyClass}
          isValid={!isV4Design || isValid}
          isV4Design={isV4Design}
          isMobile={isMobile}
          float={focused || Boolean(placeholder || value || prefixIcon)}
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
        style={innerStyle}
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
          ref={inputRef}
          type={type}
          tabIndex={tabIndex}
          name={name}
          value={value === undefined || value === null ? '' : value}
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
          style={{ ...convertLegacyControlStyle(legacyClass), ...inputStyle }}
          aria-label={label || name}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled}
          data-testid={`${id}-Input`}
          min={minValue}
          max={maxValue}
          maxLength={maxLength > 0 && infoLevel === 'informative' ? maxLength : undefined}
        />
        {suffixText && <s.SuffixWrapper>{suffixText}</s.SuffixWrapper>}
      </s.InnerWrapper>
      {showInfoMessage && (
        <s.InfoMessageWrapper compactStyle={compactStyle}>
          <SvgIcon
            id={`${id}-info-icon`}
            name='warning-sign'
            size={14}
            color={colors.grey}
            style={{ paddingRight: '4px' }}
          />
          <s.InfoMessage id={`${id}-info`} compactStyle={compactStyle}>
            {getInfoMessage()}
          </s.InfoMessage>
        </s.InfoMessageWrapper>
      )}
      {useValidation && touched ? (
        <Validation
          id={`${id}-input-validation`}
          message={validationMessage}
          isV4Design={isV4Design}
          rules={GetValidationRules()}
          value={value}
          onValidation={handleValidation}
        />
      ) : (
        <ValidationMessage id={`${id}-input-validation`} message={validationMessage} isV4Design={isV4Design} />
      )}
    </s.Container>
  );
}

Input.propTypes = propTypes;

export default Input;
