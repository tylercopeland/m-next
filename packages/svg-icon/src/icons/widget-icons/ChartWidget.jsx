import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ChartWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M.5 14.5h15M4 7.5H2a.5.5 0 0 0-.5.5v6.5h3V8a.5.5 0 0 0-.5-.5m5-6H7a.5.5 0 0 0-.5.5v12.5h3V2a.5.5 0 0 0-.5-.5m5 3h-2a.5.5 0 0 0-.5.5v9.5h3V5a.5.5 0 0 0-.5-.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
ChartWidget.propTypes = propTypes;
export default ChartWidget;
