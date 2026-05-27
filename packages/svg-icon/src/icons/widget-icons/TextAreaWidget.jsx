import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TextAreaWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M3.5 11.015h4m-4-3h5m-5-3h9m-11 8.97a1 1 0 0 1-1-1v-9.97a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v8a1 1 0 0 1-.284.698l-1.922 1.97a1 1 0 0 1-.716.302z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
TextAreaWidget.propTypes = propTypes;
export default TextAreaWidget;
