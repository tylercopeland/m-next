import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CheckboxWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='m4.834 8.544 1.088 1.545a.466.466 0 0 0 .76.023l3.485-4.41'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.833 3H3.167a.667.667 0 0 0-.667.667v8.666c0 .368.298.667.667.667h8.666a.667.667 0 0 0 .667-.667V3.667A.667.667 0 0 0 11.833 3'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
CheckboxWidget.propTypes = propTypes;
export default CheckboxWidget;
