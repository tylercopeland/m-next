import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function AlignLeft({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M14.833 9.5H3.167a.667.667 0 0 0-.667.667v2.678c0 .368.298.667.667.667h11.666a.667.667 0 0 0 .667-.667v-2.678a.667.667 0 0 0-.667-.667m-5.5-7.012H3.167a.667.667 0 0 0-.667.667v2.679c0 .368.298.666.667.666h6.166A.667.667 0 0 0 10 5.834V3.155a.667.667 0 0 0-.667-.667M.5.5v15'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

AlignLeft.propTypes = propTypes;
export default AlignLeft;
