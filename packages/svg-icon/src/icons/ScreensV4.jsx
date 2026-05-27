import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ScreensV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height} fill='none'>
      <g fill={color}>
        <path d='M1.504 10a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5zm-.5-1.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V4h-10zm10-5.5V1.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V3z' />
        <path d='M3.504 12a.5.5 0 0 1 0-1h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 1 1 0v7a1.5 1.5 0 0 1-1.5 1.5z' />
        <path d='M5.504 14a.5.5 0 0 1 0-1h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 1 1 0v7a1.5 1.5 0 0 1-1.5 1.5z' />
      </g>
    </svg>
  );
}
ScreensV4.propTypes = propTypes;
export default ScreensV4;
