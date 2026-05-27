import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TextInputWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 17 16' fill='none'>
      <path
        d='M15.385 4.5H2.38501C1.83273 4.5 1.38501 4.94772 1.38501 5.5V10.5C1.38501 11.0523 1.83273 11.5 2.38501 11.5H15.385C15.9373 11.5 16.385 11.0523 16.385 10.5V5.5C16.385 4.94772 15.9373 4.5 15.385 4.5Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M12.385 12.5V3.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      <path
        d='M9.38501 15.5C10.1807 15.5 10.9437 15.1839 11.5063 14.6213C12.0689 14.0587 12.385 13.2956 12.385 12.5C12.385 13.2956 12.7011 14.0587 13.2637 14.6213C13.8263 15.1839 14.5894 15.5 15.385 15.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.38501 0.5C10.1807 0.5 10.9437 0.816071 11.5063 1.37868C12.0689 1.94129 12.385 2.70435 12.385 3.5C12.385 2.70435 12.7011 1.94129 13.2637 1.37868C13.8263 0.816071 14.5894 0.5 15.385 0.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
TextInputWidget.propTypes = propTypes;
export default TextInputWidget;
