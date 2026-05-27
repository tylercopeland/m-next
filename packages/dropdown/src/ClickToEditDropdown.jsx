import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@m-next/typeography';
import { ClickOutside } from '@m-next/utilities';
import Dropdown from './dropdown';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        icon: PropTypes.string,
      }),
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
        lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        icon: PropTypes.string,
      }),
    ]),
  ),
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    }),
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    }),
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      icon: PropTypes.string,
    }),
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      lines: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
      icon: PropTypes.string,
    }),
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  dropdownStyle: PropTypes.string,
  styleDropdownComponent: PropTypes.instanceOf(Object),
  labelPlaceholder: PropTypes.string,
  bold: PropTypes.bool,
  isPortal: PropTypes.bool,
};

function ClickToEditDropdown({
  id,
  options,
  onChange,
  value,
  disabled,
  placeholder,
  style,
  color,
  dropdownStyle,
  styleDropdownComponent,
  labelPlaceholder = 'Empty',
  bold = false,
  isPortal = false,
}) {
  const [active, setActive] = useState(false);

  const paperRef = useRef();
  const dropdownRef = useRef();

  const handleClick = () => {
    if (!disabled) {
      setActive(true);

      setTimeout(() => {
        dropdownRef.current.focus();
      }, 50);
    }
  };

  return (
    <div ref={paperRef} style={style}>
      <ClickOutside parentRef={paperRef} onClickOutsideHandler={() => setActive(false)}>
        {!active && (
          <Text
            id={id}
            style={{
              opacity: disabled ? 0.65 : 1,
              cursor: disabled ? 'unset' : 'pointer',
              padding: '8px 0px',
            }}
            onClick={handleClick}
            color={color}
            bold={bold}
          >
            {value ? value.label : labelPlaceholder}
          </Text>
        )}
        {active && (
          <Dropdown
            id={id}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            dropdownStyle={dropdownStyle}
            isV4Design
            value={value}
            style={styleDropdownComponent}
            forwardRef={dropdownRef}
            openMenuOnFocus
            isPortal={isPortal}
            breakout
          />
        )}
      </ClickOutside>
    </div>
  );
}

ClickToEditDropdown.propTypes = propTypes;
export default ClickToEditDropdown;
