import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DocumentsWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path d='M8 15.5v-6M5.5 12 8 9.5l2.5 2.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5.5 12 8 9.5l2.5 2.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      <path
        d='M11.5 10.5h.75a3.25 3.25 0 1 0-1.842-5.923A5 5 0 1 0 4.501 10.4'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
DocumentsWidget.propTypes = propTypes;
export default DocumentsWidget;
