import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DeviceDesktop({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12 16.4444V20M7.19998 20H16.8M4.8 4H19.2C20.1941 4 21 4.79594 21 5.77778V14.6667C21 15.6485 20.1941 16.4444 19.2 16.4444H4.8C3.80589 16.4444 3 15.6485 3 14.6667V5.77778C3 4.79594 3.80589 4 4.8 4Z'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DeviceDesktop.propTypes = propTypes;
export default DeviceDesktop;
