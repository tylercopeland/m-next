import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function WarningV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path d='M8 12.2a0.233 0.233 0 1 0 0 0.467 0.233 0.233 0 0 0 0 -0.467' fill='#fff' />
      <path
        d='M8.796 12.433A0.795 0.795 0 1 1 8 11.639l0.079 0.003a0.8 0.8 0 0 1 0.425 0.177l0.059 0.053 0.053 0.057c0.115 0.141 0.18 0.32 0.18 0.504'
        fill='#fff'
      />
      <path d='M8 10.333v-4.667' stroke={color} strokeWidth={1} strokeMiterlimit={10} strokeLinecap='round' />
      <path
        d='M9.008 1.628a1.124 1.124 0 0 0 -2.016 0L1.097 13.636a0.947 0.947 0 0 0 0.849 1.364h12.107a0.947 0.947 0 0 0 0.849 -1.364z'
        stroke={color}
        strokeWidth={1}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
WarningV4.propTypes = propTypes;
export default WarningV4;
