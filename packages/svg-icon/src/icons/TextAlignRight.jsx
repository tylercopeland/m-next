import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TextAlignRight({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M15 2H1m14 4H5m10 4H1m14 4H9'
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

TextAlignRight.propTypes = propTypes;
export default TextAlignRight;
