import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ArrowUpCircle({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#clip0_1721_88944)'>
        <path d='M10.5 6.5L8 4L5.5 6.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
        <path d='M8 11.5V4' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
        <path
          d='M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_1721_88944'>
          <rect width={width} height={height} fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
}

ArrowUpCircle.propTypes = propTypes;
export default ArrowUpCircle;
