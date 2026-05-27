import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function Tabs({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height} fill='none'>
      <path
        d='M14.668 5.333h-4.334m0 0H6.001V2.667m4.333 2.666V2.667'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M1.334 11.81V4.19c0-.842.664-1.524 1.482-1.524h10.37c.819 0 1.482.683 1.482 1.525v7.618c0 .842-.663 1.524-1.481 1.524H2.816c-.818 0-1.482-.682-1.482-1.524Z'
        stroke={color}
      />
    </svg>
  );
}
Tabs.propTypes = propTypes;
export default Tabs;
