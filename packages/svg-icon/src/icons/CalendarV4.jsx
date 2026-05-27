import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CalendarV4({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#a)' fillRule='evenodd' clipRule='evenodd' fill={color}>
        <path d='M1.504 3a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5zm-1.5.5a1.5 1.5 0 0 1 1.5-1.5h13a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5z' />
        <path d='M.004 6.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1h-15a.5.5 0 0 1-.5-.5m4.5-6.5a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5m7 0a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h16v16H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}
CalendarV4.propTypes = propTypes;
export default CalendarV4;
