import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CloseCircleV4({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.8306 6.1693L6.17376 11.8262M6.17378 6.1693L11.8306 11.8262M3.34315 14.6569C0.218951 11.5327 0.218951 6.46734 3.34315 3.34315C6.46734 0.218951 11.5327 0.218951 14.6569 3.34315C17.781 6.46734 17.781 11.5327 14.6569 14.6569C11.5327 17.781 6.46734 17.781 3.34315 14.6569Z'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}
CloseCircleV4.propTypes = propTypes;
export default CloseCircleV4;
