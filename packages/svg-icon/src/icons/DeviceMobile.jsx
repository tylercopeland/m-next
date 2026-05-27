import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DeviceMobile({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.60001 6.375H17.4M6.60001 17.625H17.4M9.00001 3H15C16.3255 3 17.4 4.07452 17.4 5.4V18.6C17.4 19.9255 16.3255 21 15 21H9.00001C7.67452 21 6.60001 19.9255 6.60001 18.6V5.4C6.60001 4.07452 7.67452 3 9.00001 3Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DeviceMobile.propTypes = propTypes;
export default DeviceMobile;
