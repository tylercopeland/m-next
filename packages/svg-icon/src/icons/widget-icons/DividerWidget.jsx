import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DividerWidget({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.5 8H15.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
DividerWidget.propTypes = propTypes;
export default DividerWidget;
