import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TargetV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M8.001 11.264v3.733m0-13.998v3.733M4.735 7.999H1.002m13.999 0h-3.733M8 13.132A5.133 5.133 0 1 0 8 2.865a5.133 5.133 0 0 0 0 10.267'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.001 7.248a.749.749 0 1 1 0 1.5.749.749 0 0 1 0-1.5'
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
TargetV4.propTypes = propTypes;
export default TargetV4;
