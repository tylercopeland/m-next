import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ButtonWidget({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#clip0_496_186860)'>
        <path
          d='M9.54913 7.83784L9.81846 14.3025C9.82202 14.3862 9.84653 14.4677 9.88975 14.5395C9.93296 14.6112 9.9935 14.671 10.0658 14.7133C10.1381 14.7557 10.2199 14.7792 10.3037 14.7817C10.3874 14.7842 10.4704 14.7656 10.5452 14.7277L12.2749 12.2186L15.1682 12.3727C15.2418 12.3352 15.3049 12.28 15.352 12.2122C15.3991 12.1443 15.4286 12.0658 15.4379 11.9838C15.4473 11.9017 15.4361 11.8186 15.4055 11.7419C15.3749 11.6652 15.3258 11.5973 15.2625 11.5442L10.3704 7.43606C10.2963 7.37377 10.2057 7.33434 10.1096 7.32256C10.0135 7.31078 9.91602 7.32716 9.82905 7.36971C9.74207 7.41226 9.66932 7.47915 9.61963 7.56225C9.56994 7.64535 9.54545 7.74109 9.54913 7.83784Z'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M7.47856 8.96338H5.38956C3.2508 8.96338 1.517 7.22958 1.517 5.09082C1.517 2.95207 3.2508 1.21826 5.38956 1.21826H12.3804C14.5192 1.21826 16.253 2.95207 16.253 5.09082C16.253 6.46122 15.5412 7.66537 14.4671 8.35369'
          stroke={color}
          strokeLinecap='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_496_186860'>
          <rect width='16' height='16' fill='white' transform='translate(0.88501)' />
        </clipPath>
      </defs>
    </svg>
  );
}
ButtonWidget.propTypes = propTypes;
export default ButtonWidget;
