import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function XIcon({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.8536 0.146447C16.0488 0.341709 16.0488 0.658291 15.8536 0.853553L0.853553 15.8536C0.658291 16.0488 0.341709 16.0488 0.146447 15.8536C-0.0488155 15.6583 -0.0488155 15.3417 0.146447 15.1464L15.1464 0.146447C15.3417 -0.0488155 15.6583 -0.0488155 15.8536 0.146447Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.146447 0.146447C0.341709 -0.0488155 0.658291 -0.0488155 0.853553 0.146447L15.8536 15.1464C16.0488 15.3417 16.0488 15.6583 15.8536 15.8536C15.6583 16.0488 15.3417 16.0488 15.1464 15.8536L0.146447 0.853553C-0.0488155 0.658291 -0.0488155 0.341709 0.146447 0.146447Z'
        fill={color}
      />
    </svg>
  );
}
XIcon.propTypes = propTypes;
export default XIcon;
