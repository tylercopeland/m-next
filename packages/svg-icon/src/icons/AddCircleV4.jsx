import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function AddCircleV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height}>
      <g
        fill='none'
        className='nc-icon-wrapper'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path className='a' d='M8 5v6M5 8h6m4.5 0A7.5 7.5 0 0 1 8 15.5 7.5 7.5 0 0 1 .5 8a7.5 7.5 0 0 1 15 0z' />
      </g>
    </svg>
  );
}
AddCircleV4.propTypes = propTypes;
export default AddCircleV4;
