import React from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from './useOnClickOutside';

function ClickOutside({ id, parentRef, onClickOutsideHandler, children }) {
  useOnClickOutside(parentRef, onClickOutsideHandler, id);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default ClickOutside;

ClickOutside.propTypes = {
  id: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClickOutsideHandler: PropTypes.func,
  parentRef: PropTypes.instanceOf(Object),
};
