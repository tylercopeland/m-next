import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function SettingsIcon3({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.004 10.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m-5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.386 9.576a1 1 0 1 0-.765 1.848 1 1 0 0 0 .765-1.848M7.003 8.5a2 2 0 1 1 .002 4 2 2 0 0 1-.002-4m-3.999-3a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.614 3.538a2 2 0 0 1 2.39 1.962 2 2 0 0 1-2.001 2 2 2 0 0 1-.39-3.962m.772 1.038a1 1 0 1 0-.765 1.848 1 1 0 0 0 .765-1.848'
        fill={color}
      />
    </svg>
  );
}
SettingsIcon3.propTypes = propTypes;
export default SettingsIcon3;
