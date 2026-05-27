import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import { Text } from '@m-next/typeography';

import { IconRadioButtonWrapper, IconWrapper } from './IconRadioButton.styles';

function IconRadioButton({ id, label, value, icon, selected, onChange, disabled }) {
  const handleOnClick = () => {
    onChange({ value, label, icon });
  };

  return (
    <IconRadioButtonWrapper
      id={`${id}-radio-button-${value}`}
      onClick={disabled ? null : handleOnClick}
      role='radio'
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
    >
      <IconWrapper selected={selected}>
        <SvgIcon name={icon} color={colors.blue.base} size={48} />
      </IconWrapper>
      <Text style={{ fontSize: 12 }}> {label}</Text>
    </IconRadioButtonWrapper>
  );
}

export default IconRadioButton;
