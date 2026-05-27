import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ArrowUpV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height}>
      <g transform='scale(1,-1) translate(0,-16)'>
        <path d='m12.5 11-4.25 4m0 0-4.5-4m4.5 4V1' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      </g>
    </svg>
  );
}

ArrowUpV4.propTypes = propTypes;
export default ArrowUpV4;
