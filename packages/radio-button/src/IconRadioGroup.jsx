// vendors
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Caption from '@m-next/caption';
import IconRadioButton from './IconRadioButton';
import { IconRadioGroupWrapper } from './IconRadioButton.styles';

// Props
const TYPES = {
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.string,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthType: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.shape({}),
  caption: PropTypes.string,
  disabled: PropTypes.bool,
};

function IconRadioGroup({
  id,
  options = [],
  onChange,
  selectedValue,
  widthType = 'auto',
  width = 'auto',
  style = null,
  caption = null,
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
      <IconRadioGroupWrapper
        id={`${id}-RadioGroup`}
        role='radiogroup'
        widthType={widthType}
        width={width}
        style={style}
      >
        {options?.map((option) => (
          <IconRadioButton
            key={`${id}-${option.value}`}
            id={id}
            value={option.value}
            onChange={handleOnChange}
            selected={currentValue === option.value}
            icon={option.icon}
            label={option.label}
            disabled={disabled}
          />
        ))}
      </IconRadioGroupWrapper>
    </>
  );
}

IconRadioGroup.propTypes = TYPES;
export default IconRadioGroup;
