import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function AlignRight({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M1.167 13.512h11.666a.667.667 0 0 0 .667-.667v-2.679a.667.667 0 0 0-.667-.666H1.167a.667.667 0 0 0-.667.666v2.68c0 .367.298.666.667.666m5.5-7.012h6.166a.667.667 0 0 0 .667-.667V3.155a.667.667 0 0 0-.667-.667H6.667A.667.667 0 0 0 6 3.155v2.678c0 .369.298.667.667.667M15.5.5v15'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

AlignRight.propTypes = propTypes;
export default AlignRight;
