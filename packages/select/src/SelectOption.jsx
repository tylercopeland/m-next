import React from 'react';
import Typeography from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import * as s from './Select.styles';

function SelectOption({
  id,
  icon,
  title,
  description,
  selected,
  onSelection,
  disabled,
  size = 'lg',
}) {
  // size is normalized at the parent (`sm`/`lg`); guard here too for direct consumers.
  const resolvedSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : size;

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
      size={resolvedSize}
      selected={selected}
      onClick={disabled ? null : handleSelection}
      onKeyDown={disabled ? null : handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="radio"
      aria-checked={Boolean(selected)}
      aria-disabled={disabled || undefined}
    >
      <s.SelectIcon size={resolvedSize} selected={selected} style={{ display: 'inherit' }}>
        <SvgIcon
          id={`${id}-${title}-icon`}
          className='select-option-icon'
          name={icon}
          size={resolvedSize === 'lg' ? 40 : 20}
          color={colors.blue.base}
        />
      </s.SelectIcon>
      <s.ContentContainer size={resolvedSize}>
        {title && (
          <Typeography
            id={`${id}-${title}-title`}
            variant='h3'
            style={{ marginTop: resolvedSize === 'lg' ? 16 : 8 }}
          >
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

export default SelectOption;
