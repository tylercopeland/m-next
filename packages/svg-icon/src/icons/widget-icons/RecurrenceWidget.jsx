import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function RecurrenceWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M5.5 11.5h-4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v3m-11-1h11m-8-2v-2m5 2v-2m1.5 12H7.5V15'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.111 12.99a3.715 3.715 0 0 1-7.16-.49m5.049-2h2.5V8'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M7.889 10.012a3.715 3.715 0 0 1 7.16.489' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
RecurrenceWidget.propTypes = propTypes;
export default RecurrenceWidget;
