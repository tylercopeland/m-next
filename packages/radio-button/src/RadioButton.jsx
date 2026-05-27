import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import * as s from './RadioButton.styles';

const propTypes = {
  ariaChecked: PropTypes.bool,
  isV4Design: PropTypes.bool,
  id: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['row', 'column']),
  widthType: PropTypes.string,
  rowItemWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  checked: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool,
  isFocused: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  customColor: PropTypes.string,
  customFontSize: PropTypes.string,
  narrow: PropTypes.bool,
  style: PropTypes.shape({}),
  hint: PropTypes.string,
  labelStyle: PropTypes.instanceOf(Object),
  bold: PropTypes.bool,
  marginBottom: PropTypes.number,
};

function RadioButton(props) {
  const {
    id,
    label,
    name,
    value,
    checked,
    direction,
    ariaChecked,
    isV4Design,
    disabled,
    isMobile,
    isFocused,
    widthType,
    rowItemWidth,
    onChange,
    tabIndex,
    customColor,
    customFontSize = null,
    style,
    narrow,
    labelStyle,
    hint,
    bold,
    marginBottom,
  } = props;

  // If an option needs (Recommended) text appended at the end of the label, add value of the option to the array
  const recommendedOptions = ['CurrentPanel'];
  const isRecommended = recommendedOptions.indexOf(value) > -1;
  const buttonRef = useRef();

  useEffect(() => {
    if (isFocused && checked) buttonRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonRef.current, isFocused]);

  return (
    <s.RadioButtonWrapper
      customColor={customColor}
      direction={direction}
      widthType={widthType}
      width={rowItemWidth}
      disabled={disabled}
      checked={checked}
      aria-checked={ariaChecked}
      tabIndex={-1}
      aria-labelledby={`${id}-lbl`}
      isV4Design={isV4Design}
      isMobile={isMobile}
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
        aria-labelledby={`${id}-lbl`}
        isMobile={isMobile}
        isV4Design={isV4Design}
        customColor={customColor}
        style={style}
      />
      <>
        <div className='radio-btn-indicator-container' style={{ position: 'relative' }}>
          <s.StyledIndicator
            className='radio-btn-indicator'
            isMobile={isMobile}
            customColor={customColor}
            disabled={disabled}
            isV4Design={isV4Design}
            style={style}
            narrow={narrow}
          />
        </div>
        <s.Text
          id={`${id}-lbl`}
          isMobile={isMobile}
          isRecommended={isRecommended}
          direction={direction}
          customColor={customColor}
          customFontSize={customFontSize}
          isV4Design={isV4Design}
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
}

RadioButton.propTypes = propTypes;
export default RadioButton;
