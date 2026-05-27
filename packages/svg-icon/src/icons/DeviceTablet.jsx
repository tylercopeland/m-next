import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DeviceTablet({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M5.39879 17.625H18.5988M6.60119 3H17.4012C18.0639 3 18.6012 3.53726 18.6012 4.2V19.8C18.6012 20.4627 18.0639 21 17.4012 21H6.60119C5.93845 21 5.40119 20.4627 5.40119 19.8V4.2C5.40119 3.53726 5.93845 3 6.60119 3Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DeviceTablet.propTypes = propTypes;
export default DeviceTablet;
