import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function GridWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={height} height={width} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#a)' stroke={color} strokeLinecap='round' strokeLinejoin='round'>
        <path d='M14 .998H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1m-13 4h14m-7 10v-10m-7 5h14' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h16v16H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}
GridWidget.propTypes = propTypes;
export default GridWidget;
