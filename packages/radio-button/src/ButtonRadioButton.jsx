import React from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import { ButtonRadioButtonWrapper } from './ButtonRadioButton.styles';

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

function ButtonRadioButton({ id, label, value, selected, onChange, width, disabled }) {
  const handleOnClick = () => {
    onChange({ value, label });
  };

  return (
    <ButtonRadioButtonWrapper id={`${id}-radio-button-wrapper-${value}`}>
      <Button
        id={`${id}-radio-button-${value}`}
        value={label}
        buttonStyle={selected ? 'radio-selected' : 'radio'}
        width={width}
        onClick={handleOnClick}
        disabled={disabled}
      />
    </ButtonRadioButtonWrapper>
  );
}

ButtonRadioButton.propTypes = propTypes;
export default ButtonRadioButton;
