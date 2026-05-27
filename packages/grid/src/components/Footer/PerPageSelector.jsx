import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import * as s from './PerPageSelector.styles';

function PerPageSelector({ disabled, id, selected, onChange }) {
  const stockOptions = useMemo(() => [5, 10, 25, 50, 100], []);
  const [options, setOptions] = useState(stockOptions);

  const handleOnChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    const current = stockOptions
      .concat(selected && !stockOptions.includes(selected) ? [selected] : [])
      .sort((a, b) => a - b);
    setOptions(current);
  }, [selected, stockOptions]);

  const stopEvent = (e) => e.stopPropagation();

  return (
    <s.Container id={`${id}-PAGE-SELECTOR-WRAPPER`}>
      Per Page
      <s.Selector
        disabled={disabled}
        id={`${id}-PAGE-SELECTOR`}
        aria-label={`${id}-PAGE-SELECTOR`}
        //  defaultValue={selected}
        onChange={handleOnChange}
        onMouseDown={stopEvent} // FireFox bug fix, do not remove without testing
        value={selected}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </s.Selector>
      <div
        style={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none', // This makes clicks pass through to the selector
        }}
      >
        <SvgIcon name='chevron-down-V4' size={16} />
      </div>
    </s.Container>
  );
}

PerPageSelector.defaultProps = {
  disabled: false,
  id: null,
  selected: null,
  onChange: null,
};

PerPageSelector.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  selected: PropTypes.number,
  onChange: PropTypes.func,
};

export default PerPageSelector;
