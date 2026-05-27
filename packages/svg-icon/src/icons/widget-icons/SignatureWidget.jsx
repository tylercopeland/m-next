import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function SignatureWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='m5.66 7.51 4.242-4.242 2.122 2.121L7.78 9.632zm8.84-4.596.706.707a1 1 0 0 1 0 1.414l-3.182 3.182'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='m12.024 5.39 2.475-2.476a1 1 0 0 0 0-1.414l-.707-.707a1 1 0 0 0-1.414 0L9.903 3.267M6.72 10.693c-.585.585-2.827.707-2.827.707s.12-2.243.706-2.828a1.5 1.5 0 1 1 2.122 2.121M2.5 12.5H2a1.5 1.5 0 1 0 0 3h10.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
SignatureWidget.propTypes = propTypes;
export default SignatureWidget;
