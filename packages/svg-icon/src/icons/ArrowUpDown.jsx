import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ArrowUpDown({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height}>
      <path
        d='m.941 4.471 3.53-3.53m0 0L8 4.471M4.471.941v10.588m10.588 0-3.53 3.53m0 0L8 11.529m3.529 3.53V4.471'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={0.941}
      />
    </svg>
  );
}
ArrowUpDown.propTypes = propTypes;
export default ArrowUpDown;
