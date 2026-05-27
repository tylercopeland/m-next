import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DragV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M9.906 13.797a0.985 0.985 0 1 0 1.968 0 0.985 0.985 0 0 0 -1.969 0ZM4 13.797a0.985 0.985 0 1 0 1.969 0 0.985 0.985 0 0 0 -1.969 0ZM9.906 7.89a0.985 0.985 0 1 0 1.968 0 0.985 0.985 0 0 0 -1.969 0ZM4 7.891a0.985 0.985 0 1 0 1.969 0 0.985 0.985 0 0 0 -1.969 0ZM9.906 1.985a0.985 0.985 0 1 0 1.968 0 0.985 0.985 0 0 0 -1.969 0ZM4 1.984a0.985 0.985 0 1 0 1.969 0 0.985 0.985 0 0 0 -1.969 0Z'
        stroke={color}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DragV4.propTypes = propTypes;
export default DragV4;
