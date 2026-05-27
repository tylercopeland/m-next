import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SelectOption from './SelectOption';
import * as s from './Select.styles';

// types
const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isMobile: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};

function Select(props) {
  const { id, className, options = [], onChange, selectedValue, isMobile, size } = props;

  const [selection, setSelection] = useState(selectedValue);

  useEffect(() => {
    if (selection !== selectedValue) setSelection(selectedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  const handleOnChange = (option) => {
    setSelection(option.title);
    if (onChange) onChange(option);
  };

  return (
    <s.SelectWrapper id={`${id}-wrapper`} className={className}>
      {options?.map((option, idx) => {
        const key = `${id}-option-${idx}`;
        return (
          <SelectOption
            key={key}
            id={`${id}`}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selection === option.title}
            onSelection={handleOnChange}
            disabled={option.disabled}
            isMobile={isMobile}
            size={size}
          />
        );
      })}
    </s.SelectWrapper>
  );
}

Select.propTypes = propTypes;
export default Select;
