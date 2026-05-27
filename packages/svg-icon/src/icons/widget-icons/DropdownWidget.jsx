import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DropdownWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 17 16' fill='none'>
      <path
        d='M15.385 1H2.38501C1.83272 1 1.38501 1.44772 1.38501 2V4C1.38501 4.55228 1.83272 5 2.38501 5H15.385C15.9373 5 16.385 4.55228 16.385 4V2C16.385 1.44772 15.9373 1 15.385 1Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.38501 11C3.43446 11 3.48279 11.0147 3.5239 11.0421C3.56501 11.0696 3.59706 11.1086 3.61598 11.1543C3.6349 11.2 3.63985 11.2503 3.63021 11.2988C3.62056 11.3473 3.59675 11.3918 3.56179 11.4268C3.52682 11.4617 3.48228 11.4855 3.43378 11.4952C3.38529 11.5048 3.33502 11.4999 3.28934 11.481C3.24366 11.462 3.20461 11.43 3.17714 11.3889C3.14967 11.3478 3.13501 11.2994 3.13501 11.25C3.13501 11.1837 3.16135 11.1201 3.20823 11.0732C3.25512 11.0263 3.31871 11 3.38501 11Z'
        fill={color}
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.38501 7.5C3.43446 7.5 3.48279 7.51466 3.5239 7.54213C3.56501 7.5696 3.59706 7.60865 3.61598 7.65433C3.6349 7.70001 3.63985 7.75028 3.63021 7.79877C3.62056 7.84727 3.59675 7.89181 3.56179 7.92678C3.52682 7.96174 3.48228 7.98555 3.43378 7.9952C3.38529 8.00484 3.33502 7.99989 3.28934 7.98097C3.24366 7.96205 3.20461 7.93001 3.17714 7.88889C3.14967 7.84778 3.13501 7.79945 3.13501 7.75C3.13501 7.6837 3.16135 7.62011 3.20823 7.57322C3.25512 7.52634 3.31871 7.5 3.38501 7.5Z'
        fill={color}
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M5.63501 11.5H14.635' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5.63501 8H14.635' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
      <path
        d='M3.38501 14.5C3.43446 14.5 3.48279 14.5147 3.5239 14.5421C3.56501 14.5696 3.59706 14.6086 3.61598 14.6543C3.6349 14.7 3.63985 14.7503 3.63021 14.7988C3.62056 14.8473 3.59675 14.8918 3.56179 14.9268C3.52682 14.9617 3.48228 14.9855 3.43378 14.9952C3.38529 15.0048 3.33502 14.9999 3.28934 14.981C3.24366 14.962 3.20461 14.93 3.17714 14.8889C3.14967 14.8478 3.13501 14.7994 3.13501 14.75C3.13501 14.6837 3.16135 14.6201 3.20823 14.5732C3.25512 14.5263 3.31871 14.5 3.38501 14.5Z'
        fill={color}
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M5.63501 15H14.635' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
}
DropdownWidget.propTypes = propTypes;
export default DropdownWidget;
