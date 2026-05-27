import PropTypes from 'prop-types';
import React from 'react';
import { components } from 'react-select';

const CustomMultiValueRemove = (props) => {
  const { data } = props;
  if (data?.isFixed) {
    return null;
  }
  return <components.MultiValueRemove {...props} />;
};

CustomMultiValueRemove.propTypes = {
  data: PropTypes.instanceOf(Object),
};

export default CustomMultiValueRemove;
