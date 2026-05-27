import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ToggleWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        clipRule='evenodd'
        d='M12.25 11.25h-8.5A3.26 3.26 0 0 1 .5 8a3.26 3.26 0 0 1 3.25-3.25h8.5A3.26 3.26 0 0 1 15.5 8a3.26 3.26 0 0 1-3.25 3.25'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.75 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
ToggleWidget.propTypes = propTypes;
export default ToggleWidget;
