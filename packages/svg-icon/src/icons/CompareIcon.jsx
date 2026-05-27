import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CompareIcon({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height} fill='none'>
      <g clipPath='url(#clip0_6220_327128)'>
        <path
          d='M8.375 2.08317H3.41667C3.04094 2.08317 2.68061 2.23243 2.41493 2.4981C2.14926 2.76378 2 3.12411 2 3.49984V11.9998C2 12.3756 2.14926 12.7359 2.41493 13.0016C2.68061 13.2672 3.04094 13.4165 3.41667 13.4165H8.375M11.2083 2.08317H11.9167C12.2924 2.08317 12.6527 2.23243 12.9184 2.4981C13.1841 2.76378 13.3333 3.12411 13.3333 3.49984V4.20817M13.3333 11.2915V11.9998C13.3333 12.3756 13.1841 12.7359 12.9184 13.0016C12.6527 13.2672 12.2924 13.4165 11.9167 13.4165H11.2083M13.3333 7.0415V8.45817M7.66667 0.666504V14.8332'
          stroke={color}
          strokeWidth={1.41667}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_6220_327128'>
          <rect width={width} height={height} fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
CompareIcon.propTypes = propTypes;
export default CompareIcon;
