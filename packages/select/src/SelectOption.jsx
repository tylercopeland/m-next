import React from 'react';
import PropTypes from 'prop-types';
import Typeography from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './Select.styles';

// types
const propTypes = {
  id: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  selected: PropTypes.bool,
  onSelection: PropTypes.func,
  disabled: PropTypes.bool,
  isMobile: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};

function SelectOption({ id, icon, title, description, selected, onSelection, disabled, isMobile, size = 'large' }) {
  const handleSelection = () => {
    if (onSelection) {
      onSelection({ icon, title, description });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();

      if (onSelection) {
        onSelection({ icon, title, description });
      }
    }
  };

  return (
    <s.SelectOptionWrapper
      id={`${id}-${title}-option-wrapper`}
      size={size}
      selected={selected}
      onClick={disabled ? null : handleSelection}
      onKeyDown={disabled ? null : handleKeyDown}
      tabIndex={0}
    >
      <s.SelectIcon size={size} selected={selected} style={{ display: 'inherit' }}>
        <SvgIcon
          id={`${id}-${title}-icon`}
          className='select-option-icon'
          name={icon}
          size={size === 'large' ? 40 : 20}
          color={colors['blue']}
        />
      </s.SelectIcon>
      <s.ContentContainer size={size} isMobile={isMobile}>
        {title && (
          <Typeography id={`${id}-${title}-title`} variant='h3' style={{ marginTop: size === 'large' ? 16 : 8 }}>
            {title}
          </Typeography>
        )}
        {description && (
          <Typeography id={`${id}-${title}-description`} variant='body1' style={{ marginTop: 4 }}>
            {description}
          </Typeography>
        )}
      </s.ContentContainer>
    </s.SelectOptionWrapper>
  );
}

SelectOption.propTypes = propTypes;
export default SelectOption;
