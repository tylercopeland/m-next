import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function StarFilledV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='m8.485.797 2.23 4.42 4.294.425a.536.536 0 0 1 .333.916L11.81 10.06l1.31 4.759a.542.542 0 0 1-.767.623L8 13.287l-4.347 2.152a.543.543 0 0 1-.767-.623l1.31-4.759L.659 6.555a.537.537 0 0 1 .333-.916l4.294-.425L7.513.797a.546.546 0 0 1 .972 0'
        fill={color}
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

StarFilledV4.propTypes = propTypes;
export default StarFilledV4;
