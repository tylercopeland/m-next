import React, { useState, useEffect, useRef, forwardRef } from 'react';
import SvgIcon from '@m-next/svg-icon';
import Caption from '@m-next/caption';
import { ValidationMessage, Validation } from '@m-next/validation';
import { colors } from '@m-next/tokens';
import * as s from './Input.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/button.
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

const Input = forwardRef(function Input(props, ref) {
  const {
    id: idProp,
    label,
    name = null,
    type = 'text',
    value = '',
    placeholder = null,
    required = false,
    disabled = false,
    autoFocus = false,
    autoComplete = 'off',
    tabIndex = 0,

    // Clean API
    leftIcon: leftIconProp,
    rightContent: rightContentProp,
    errorMessage: errorMessageProp,
    intent: intentProp,
    hideLabel: hideLabelProp,
    readOnly: readOnlyProp,

    width = '100%',
    style,
    inputStyle,

    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,

    // Native attrs that pass through to <input>
    minLength = 0,
    maxLength = 0,
    minValue = null,
    maxValue = null,
    selectOnFocus = false,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    readonly: legacyReadonly,
    prefixIcon,
    suffixText,
    ariaDescribedby: legacyAriaDescribedby,
    hideCaption,
    infoLevel,
    validationMessage,
    useValidation = false,
    onValidation,

    // Standard ARIA pass-through
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    hidden: _hidden,
    displayAuto: _displayAuto,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,
    isLabelBolded: _isLabelBolded,
    innerStyle: _innerStyle,
    background: _background,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-input-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let hideLabel = hideLabelProp;
  if (hideCaption !== undefined && hideLabel === undefined) {
    warnOnce('input-hideCaption', '@m-next/input: `hideCaption` is deprecated. Use `hideLabel`.');
    hideLabel = hideCaption;
  }

  let errorMessage = errorMessageProp;
  if (validationMessage != null && errorMessage == null) {
    warnOnce(
      'input-validationMessage',
      '@m-next/input: `validationMessage` is deprecated. Use `errorMessage`.',
    );
    errorMessage = validationMessage;
  }

  let intent = intentProp;
  if (infoLevel != null && intent == null) {
    warnOnce('input-infoLevel', '@m-next/input: `infoLevel` is deprecated. Use `intent`.');
    intent = infoLevel;
  }
  if (intent == null) intent = 'error';

  let leftIcon = leftIconProp;
  if (prefixIcon && !leftIcon) {
    warnOnce(
      'input-prefixIcon',
      '@m-next/input: `prefixIcon` (string icon name) is deprecated. Use `leftIcon` ReactNode.',
    );
    leftIcon = <SvgIcon name={prefixIcon} size={16} color={colors.grey.base} />;
  }

  let rightContent = rightContentProp;
  if (suffixText != null && rightContent == null) {
    warnOnce(
      'input-suffixText',
      '@m-next/input: `suffixText` is deprecated. Use `rightContent` ReactNode.',
    );
    rightContent = suffixText;
  }

  let resolvedAriaDescribedby = ariaDescribedby;
  if (legacyAriaDescribedby && !resolvedAriaDescribedby) {
    warnOnce(
      'input-ariaDescribedby',
      '@m-next/input: `ariaDescribedby` is deprecated. Use `aria-describedby` (standard React attr).',
    );
    resolvedAriaDescribedby = legacyAriaDescribedby;
  }

  let readOnly = readOnlyProp ?? false;
  if (legacyReadonly !== undefined && readOnly === false) {
    warnOnce('input-readonly', '@m-next/input: `readonly` is deprecated. Use `readOnly` (React casing).');
    readOnly = legacyReadonly;
  }

  if (legacyForwardRef) {
    warnOnce(
      'input-forwardRef-prop',
      '@m-next/input: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ State ============

  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [touched, setTouched] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const inputRef = useRef(null);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(inputRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = inputRef.current;
    }
  }, [ref, legacyForwardRef]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (intent !== 'informative') {
      setIsValid(!errorMessage);
    }
  }, [errorMessage, intent]);

  useEffect(() => {
    const currentValue = value === undefined || value === null ? '' : value;
    const valueLength = String(currentValue).length;
    setShowInfoMessage(intent === 'informative' && valueLength >= 30);
  }, [value, intent]);

  const getInfoMessage = () => {
    if (intent === 'informative' && maxLength > 0) {
      return `Max length ${maxLength}`;
    }
    return '';
  };

  // ============ Handlers ============

  const handleChange = (e) => {
    if (maxLength > 0 && intent === 'informative' && e.target.value.length > maxLength) {
      // eslint-disable-next-line no-param-reassign
      e.target.value = e.target.value.slice(0, maxLength);
    }
    if (onChange) onChange(e);
    if (!touched) setTouched(true);
  };

  const handleFocus = (e) => {
    if (selectOnFocus) e.target.select();
    if (onFocus) onFocus(e);
    setFocused(true);
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(e);
    setFocused(false);
  };

  const getAutoCompleteDisplay = () => {
    if (type === 'password') return autoComplete;
    if (autoComplete !== 'off') return 'on';
    return 'chrome-off';
  };

  const handleValidation = (e) => {
    if (onValidation) onValidation(e);
  };

  const getValidationRules = () => {
    const rules = [];
    if (required) rules.push({ type: 'isRequired' });
    if (type === 'email') rules.push({ type: 'isValidEmail' });
    if (minLength || maxLength) rules.push({ type: 'isValidLength', minLength, maxLength });
    if (minValue || maxValue) rules.push({ type: 'isValidRange', minValue, maxValue });
    return rules;
  };

  // ============ Render ============

  return (
    <s.Container id={`${id}-TextInput`} role="none" style={style} width={width} isValid={isValid}>
      {!hideLabel && label && (
        <Caption
          id={`${id}-input-caption`}
          required={required}
          label={label}
          isValid={isValid}
          isV4Design
          float={focused || Boolean(placeholder || value || leftIcon)}
          focused={focused}
          elFor={`${id}-Input`}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      <s.InnerWrapper
        isValid={isValid}
        focused={focused}
        prefix={leftIcon}
        readOnly={readOnly}
        disabled={disabled}
      >
        {leftIcon ? <div className="mi-textinput-prefix">{leftIcon}</div> : null}
        <input
          id={`${id}-Input`}
          ref={inputRef}
          type={type}
          tabIndex={tabIndex}
          name={name}
          value={value === undefined || value === null ? '' : value}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={getAutoCompleteDisplay()}
          style={inputStyle}
          aria-label={ariaLabel ?? (label || name) ?? undefined}
          aria-describedby={resolvedAriaDescribedby}
          aria-disabled={disabled || undefined}
          aria-invalid={!isValid || undefined}
          data-testid={`${id}-Input`}
          min={minValue}
          max={maxValue}
          maxLength={maxLength > 0 && intent === 'informative' ? maxLength : undefined}
          {...rest}
        />
        {rightContent && <s.SuffixWrapper>{rightContent}</s.SuffixWrapper>}
      </s.InnerWrapper>
      {showInfoMessage && (
        <s.InfoMessageWrapper>
          <SvgIcon
            id={`${id}-info-icon`}
            name="warning-sign"
            size={14}
            color={colors.grey.base}
            style={{ paddingRight: '4px' }}
          />
          <s.InfoMessage id={`${id}-info`}>{getInfoMessage()}</s.InfoMessage>
        </s.InfoMessageWrapper>
      )}
      {useValidation && touched ? (
        <Validation
          id={`${id}-input-validation`}
          message={errorMessage}
          isV4Design
          rules={getValidationRules()}
          value={value}
          onValidation={handleValidation}
        />
      ) : (
        <ValidationMessage id={`${id}-input-validation`} message={errorMessage} isV4Design />
      )}
    </s.Container>
  );
});

Input.displayName = 'Input';

export default Input;
