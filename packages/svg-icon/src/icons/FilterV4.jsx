import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function FilterV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 17 17' fill='none'>
      <g clipPath='url(#clip0_4576_11355)'>
        <path
          d='M15.3124 0.949219H1.31491C1.03754 0.949219 0.77261 1.06831 0.583186 1.27797C0.393809 1.48756 0.296826 1.769 0.315311 2.0553L0.332043 2.26095C0.650978 5.6772 2.96616 8.52327 6.13006 9.44835L6.30731 9.49786L6.30776 15.9124C6.30791 16.3149 6.53283 16.6807 6.88485 16.8513C7.23686 17.0219 7.65245 16.9665 7.95112 16.709L9.9553 14.9807L10.0279 14.9118C10.2116 14.7191 10.3162 14.4577 10.3159 14.1837L10.3155 9.49786L10.4936 9.44861C13.722 8.50616 16.0676 5.56368 16.3109 2.05788C16.3292 1.76855 16.2321 1.48755 16.043 1.27818C15.8538 1.06882 15.5894 0.949754 15.3124 0.949219ZM1.33132 2.18171L1.31446 1.98617L15.3112 1.98691C15.086 5.23173 12.7983 7.92724 9.71483 8.57782C9.4815 8.62705 9.3139 8.83942 9.3139 9.08584L9.31438 14.1836L7.30981 15.9123V9.08584C7.30981 8.83951 7.14231 8.62718 6.90909 8.57786C3.88963 7.93937 1.63397 5.34005 1.33132 2.18171Z'
          fill={color}
        />
      </g>
      <defs>
        <clipPath id='clip0_4576_11355'>
          <rect width='16' height='16' fill='white' transform='translate(0.312988 0.949219)' />
        </clipPath>
      </defs>
    </svg>
  );
}
FilterV4.propTypes = propTypes;
export default FilterV4;
