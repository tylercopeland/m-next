// vendors
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { colors, convertClass } from '@m-next/styles';

// components
import Caption from '@m-next/caption';
import RadioButton from './RadioButton';
import * as s from './RadioButton.styles';

// Props
const TYPES = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      subtext: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    }),
  ).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool,
  direction: PropTypes.oneOf(['row', 'column']),
  widthType: PropTypes.string,
  width: PropTypes.string,
  isV4Design: PropTypes.bool,
  isFocused: PropTypes.bool,
  isRuntime: PropTypes.bool,
  labelledBy: PropTypes.string,
  customColor: PropTypes.string,
  customFontSize: PropTypes.string,

  legacyClass: PropTypes.string,
  style: PropTypes.shape({}),
  className: PropTypes.string,
  wrapperStyle: PropTypes.instanceOf(Object),
  labelStyle: PropTypes.instanceOf(Object),
  narrow: PropTypes.bool,
  bold: PropTypes.bool,
  gap: PropTypes.number,
  caption: PropTypes.string,
  hideCaption: PropTypes.bool,
  minWidth: PropTypes.number,
  allowWrap: PropTypes.bool,
};

/* --------------------------------------------- */

function RadioGroup(props) {
  const {
    id,
    name,
    options = [],
    onChange,
    disabled,
    isFocused = false,
    isMobile,
    selectedValue,
    direction = 'column',
    widthType = 'auto',
    width = 'auto',
    isV4Design = true,
    isRuntime = false,
    labelledBy = null,
    customColor = colors.blue,
    legacyClass = null,
    style = null,
    customFontSize = null,
    className = null,
    wrapperStyle = null,
    narrow = false,
    labelStyle,
    bold,
    gap = 16,
    caption = '',
    hideCaption = false,
    minWidth = null,
    allowWrap = true,
  } = props;

  const [noRadioSelected, setNoRadioSelected] = useState(false);
  const [rightAlign, setRightAlign] = useState(false);

  useEffect(() => {
    if (!noRadioSelected && options) {
      const radioSelected = options.some((option) => selectedValue === option.value);
      if (!radioSelected) setNoRadioSelected(true);
    }

    if (
      !isV4Design &&
      document.getElementById(`${id}-RadioGroup`) &&
      getComputedStyle(document.getElementById(`${id}-RadioGroup`), null).textAlign === 'right'
    ) {
      setRightAlign(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (e) => {
    if (onChange) {
      // The HTML name is `${name}-${id}` for uniqueness, but form managers need the original name
      // Create a new event object with the original field name for form manager compatibility
      const target = {
        name,
        value: e.target.value,
        checked: e.target.checked,
      };

      const formEvent = {
        target,
        currentTarget: target,
        type: e.type,
      };
      onChange(formEvent, e.target.value);
    }
  };

  return (
    <s.RadioGroupWrapper
      id={`${id}-RadioGroup`}
      role='radiogroup'
      direction={direction}
      isV4Design={isV4Design}
      widthType={widthType}
      width={width}
      minWidth={minWidth}
      aria-labelledby={isRuntime ? `${id}-Caption` : labelledBy}
      rightAlign={rightAlign}
      className={className}
      style={wrapperStyle}
      narrow={narrow}
      allowWrap={allowWrap}
    >
      {!hideCaption && isV4Design && caption && (
        <Caption id={id} label={caption} legacyClass={legacyClass} style={isV4Design ? { width: 'auto' } : null} />
      )}
      <s.RadioGroupInnerWrapper
        direction={direction}
        isV4Design={isV4Design}
        rightAlign={rightAlign}
        narrow={narrow}
        allowWrap={allowWrap}
      >
        {options?.map((option, idx) => (
          <Fragment key={`${id}-${option.value}`}>
            <RadioButton
              key={`${id}-${option.value}`}
              id={`${name ?? ''}${id}${idx}`}
              name={`${name ?? ''}-${id}`}
              onChange={handleOnChange}
              disabled={disabled || option.disabled}
              isMobile={isMobile}
              value={option.value}
              label={option.label}
              hint={option.hint}
              checked={selectedValue === option.value}
              ariaChecked={selectedValue === option.value} // React rendering complete after read by NVDA - ALWAYS TRUE is correct in this scenario
              tabIndex={noRadioSelected && idx === 0 ? 0 : selectedValue === option.value ? 0 : -1} // eslint-disable-line
              direction={direction}
              widthType={widthType}
              isFocused={isFocused}
              rowItemWidth={widthType === 'full' ? `${(100 / options.length).toFixed(4)}%` : 'inherit'}
              isV4Design={isV4Design}
              customColor={customColor}
              customFontSize={customFontSize}
              style={{ ...convertClass(legacyClass), ...style }}
              narrow={narrow}
              labelStyle={labelStyle}
              bold={bold}
              marginBottom={
                // eslint-disable-next-line no-nested-ternary
                (idx === options.length - 1 && direction === 'column') || option.subtext || narrow
                  ? 0
                  : isV4Design
                    ? gap
                    : 10
              }
            />
            {option.subtext && (
              <s.Subtext key={`${id}-${option.value}-text`} last={idx === options.length - 1} gap={gap}>
                {option.subtext}
              </s.Subtext>
            )}
          </Fragment>
        ))}
      </s.RadioGroupInnerWrapper>
    </s.RadioGroupWrapper>
  );
}

RadioGroup.propTypes = TYPES;
export default RadioGroup;
