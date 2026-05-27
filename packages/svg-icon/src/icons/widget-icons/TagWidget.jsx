import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TagWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M.707 1.707v4.171a2 2 0 0 0 .586 1.414L9 15a1 1 0 0 0 1.414 0L15 10.414A1 1 0 0 0 15 9L7.293 1.292A2 2 0 0 0 5.879.707H1.707a1 1 0 0 0-1 1'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M4.207 5.207a1 1 0 1 0 0-2 1 1 0 0 0 0 2' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
TagWidget.propTypes = propTypes;
export default TagWidget;
