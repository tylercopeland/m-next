import React, { useRef, useEffect, forwardRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/tokens';
import * as s from './RadioButton.styles';

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

const RadioButton = forwardRef(function RadioButton(props, ref) {
  const {
    id: idProp,
    label,
    name,
    value,
    checked = false,
    direction,
    disabled = false,
    isFocused,
    widthType,
    rowItemWidth,
    onChange,
    tabIndex = 0,
    color: colorProp,
    customFontSize = null,
    style,
    narrow,
    labelStyle,
    hint,
    bold,
    marginBottom,

    // Standard ARIA pass-through
    'aria-checked': ariaCheckedAttr,
    'aria-labelledby': ariaLabelledByAttr,

    // Soft-shimmed legacy props
    ariaChecked: legacyAriaChecked,
    forwardRef: legacyForwardRef,
    customColor: legacyCustomColor,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-radio-button-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let color = colorProp;
  if (legacyCustomColor != null && color == null) {
    warnOnce(
      'radio-button-customColor',
      '@m-next/radio-button: `customColor` is deprecated. Use `color`.',
    );
    color = legacyCustomColor;
  }
  if (color == null) color = colors.blue.base;

  let ariaChecked = ariaCheckedAttr;
  if (legacyAriaChecked !== undefined && ariaChecked === undefined) {
    warnOnce(
      'radio-button-ariaChecked',
      '@m-next/radio-button: `ariaChecked` is deprecated. Use the standard `aria-checked` attribute.',
    );
    ariaChecked = legacyAriaChecked;
  }

  if (legacyForwardRef) {
    warnOnce(
      'radio-button-forwardRef-prop',
      '@m-next/radio-button: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Refs ============

  const buttonRef = useRef();

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(buttonRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = buttonRef.current;
    }
  }, [ref, legacyForwardRef]);

  useEffect(() => {
    if (isFocused && checked) buttonRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonRef.current, isFocused]);

  // If an option needs (Recommended) text appended at the end of the label, add value of the option to the array
  const recommendedOptions = ['CurrentPanel'];
  const isRecommended = recommendedOptions.indexOf(value) > -1;

  // V4 styling is always on — pin isV4Design=true at the style boundary so legacy
  // styled components keep their V4 branches without exposing the flag to consumers.
  return (
    <s.RadioButtonWrapper
      customColor={color}
      direction={direction}
      widthType={widthType}
      width={rowItemWidth}
      disabled={disabled}
      checked={checked}
      aria-checked={ariaChecked}
      tabIndex={-1}
      aria-labelledby={ariaLabelledByAttr ?? `${id}-lbl`}
      isV4Design
      narrow={narrow}
      marginBottom={marginBottom}
    >
      <s.NativeRadioButton
        ref={buttonRef}
        type='radio'
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        aria-checked={ariaChecked}
        tabIndex={tabIndex}
        aria-labelledby={ariaLabelledByAttr ?? `${id}-lbl`}
        isV4Design
        customColor={color}
        style={style}
        {...rest}
      />
      <>
        <div className='radio-btn-indicator-container' style={{ position: 'relative' }}>
          <s.StyledIndicator
            className='radio-btn-indicator'
            customColor={color}
            disabled={disabled}
            isV4Design
            style={style}
            narrow={narrow}
          />
        </div>
        <s.Text
          id={`${id}-lbl`}
          isRecommended={isRecommended}
          direction={direction}
          customColor={color}
          customFontSize={customFontSize}
          isV4Design
          narrow={narrow}
          style={labelStyle}
          bold={bold}
        >
          {label}
        </s.Text>
      </>

      {hint && (
        <>
          <s.ValidationIcon name='info-sign' size={14} tooltip={hint} tooltipId={`${id}-tooltip`} />
          <Tooltip id={`${id}-tooltip`} place='right' />
        </>
      )}
    </s.RadioButtonWrapper>
  );
});

RadioButton.displayName = 'RadioButton';

export default RadioButton;
