import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TextAlignLeft({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M1 2h14M1 6h10M1 10h14M1 14h6'
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

TextAlignLeft.propTypes = propTypes;
export default TextAlignLeft;
