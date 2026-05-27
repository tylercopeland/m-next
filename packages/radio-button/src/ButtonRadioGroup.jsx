// vendors
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Caption from '@m-next/caption';
import ButtonRadioButton from './ButtonRadioButton';
import { ButtonRadioGroupWrapper } from './ButtonRadioButton.styles';

// Props
const TYPES = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthType: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.shape({}),
  caption: PropTypes.string,
  buttonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOneLine: PropTypes.bool,
  disabled: PropTypes.bool,
};

function ButtonRadioGroup({
  id,
  options = [],
  onChange,
  selectedValue,
  widthType = 'auto',
  width = 'auto',
  style = null,
  caption = null,
  buttonWidth,
  isOneLine,
  disabled,
}) {
  const [currentValue, setCurrentValue] = useState(selectedValue);

  useEffect(() => {
    if (currentValue !== selectedValue) setCurrentValue(selectedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const handleOnChange = (item) => {
    setCurrentValue(item.value);
    if (onChange) onChange(item);
  };

  return (
    <>
      {caption && <Caption id={`${id}-RadioGroup`} label={caption} narrow />}
      <ButtonRadioGroupWrapper
        id={`${id}-RadioGroup`}
        role='radiogroup'
        widthType={widthType}
        width={width}
        style={style}
        isOneLine={isOneLine}
      >
        {options?.map((option) => (
          <ButtonRadioButton
            key={`${id}-${option.value}`}
            id={id}
            value={option.value}
            onChange={handleOnChange}
            selected={currentValue === option.value}
            label={option.label}
            isOneLine={isOneLine}
            width={buttonWidth}
            disabled={disabled}
          />
        ))}
      </ButtonRadioGroupWrapper>
    </>
  );
}

ButtonRadioGroup.propTypes = TYPES;
export default ButtonRadioGroup;
