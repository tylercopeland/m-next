import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TextAlignJustify({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M15.6248 1.5H1.625M15.6248 5.5H1.625M15.6248 9.5H1.625M15.6248 13.5H1.625'
        stroke={color}
        strokeWidth='1.4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

TextAlignJustify.propTypes = propTypes;
export default TextAlignJustify;
