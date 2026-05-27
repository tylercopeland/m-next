import React from 'react';
import Button from '@m-next/button';
import { ButtonRadioButtonWrapper } from './ButtonRadioButton.styles';

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
        aria-pressed={selected}
        role='radio'
        aria-checked={selected}
      />
    </ButtonRadioButtonWrapper>
  );
}

export default ButtonRadioButton;
