import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';

import { IconRadioButtonWrapper, IconWrapper } from './IconRadioButton.styles';

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

function IconRadioButton({ id, label, value, icon, selected, onChange, disabled }) {
  const handleOnClick = () => {
    onChange({ value, label, icon });
  };

  return (
    <IconRadioButtonWrapper id={`${id}-radio-button-${value}`} onClick={disabled ? null : handleOnClick}>
      <IconWrapper selected={selected}>
        <SvgIcon name={icon} color={colors.blue} size={48} />
      </IconWrapper>
      <Text style={{ fontSize: 12 }}> {label}</Text>
    </IconRadioButtonWrapper>
  );
}

IconRadioButton.propTypes = propTypes;
export default IconRadioButton;
