import * as React from 'react';
import PropTypes from 'prop-types';
import * as s from './Menu.styles';

// types
const propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

/**
 * Wrapper component around
 */
function MenuItem({ id, children, style, className, onClick, selected, disabled, active }) {
  return (
    <s.MenuItemWrapper
      id={`${id}-item`}
      style={style}
      className={className}
      onClick={disabled ? null : onClick}
      selected={selected}
      active={active}
      disabled={disabled}
    >
      {children}
    </s.MenuItemWrapper>
  );
}

MenuItem.propTypes = propTypes;
export default MenuItem;
