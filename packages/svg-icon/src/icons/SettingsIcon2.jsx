import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function SettingsIcon2({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height} fill='none'>
      <path
        d='M1.714 4.63h1.619m0 0a1.619 1.619 0 0 0 3.239 0m-3.239 0a1.619 1.619 0 1 1 3.239 0m0 0h8.098m0 6.479h-1.619m0 0a1.619 1.619 0 0 1 -3.239 0m3.239 0a1.619 1.619 0 0 0 -3.239 0m0 0H1.714'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
SettingsIcon2.propTypes = propTypes;
export default SettingsIcon2;
