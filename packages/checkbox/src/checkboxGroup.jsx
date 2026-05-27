import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './checkBox';
import * as s from './checkBox.styles';

const propTypes = {
  align: PropTypes.oneOf(['vertical', 'horizontal']),
  items: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Object)]),
  name: PropTypes.string,
};

function CheckboxGroup({ align = 'vertical', items = [], name = null }) {
  return (
    <s.GroupContainer align={align}>
      {items.map((item) => (
        <Checkbox key={item.id} {...item} name={name} />
      ))}
    </s.GroupContainer>
  );
}

CheckboxGroup.propTypes = propTypes;

export default CheckboxGroup;
