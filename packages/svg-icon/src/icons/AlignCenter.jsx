import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function AlignCenter({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M8 13.5v2m0-9v3m0-9v2m-5.833 7h11.666c.368 0 .667.298.667.667v2.666a.667.667 0 0 1-.667.667H2.167a.667.667 0 0 1-.667-.667v-2.666c0-.369.298-.667.667-.667m2-7h7.666c.368 0 .667.298.667.667v2.666a.667.667 0 0 1-.667.667H4.167a.667.667 0 0 1-.667-.667V3.167c0-.369.298-.667.667-.667'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

AlignCenter.propTypes = propTypes;
export default AlignCenter;
