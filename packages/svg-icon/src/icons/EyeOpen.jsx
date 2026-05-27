import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function EyeOpen({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24' fill='none'>
      <path
        d='M12 4c5.438 0 10.087 3.363 12 8.123-1.913 4.76-6.562 8.122-12 8.122S1.913 16.882 0 12.123C1.913 7.363 6.562 4 12 4M1.986 12.025l-.048.098.048.098a11.15 11.15 0 0 0 20.028 0l.048-.098-.048-.098a11.15 11.15 0 0 0-20.028 0M12 9.007a3.116 3.116 0 1 1 0 6.231 3.116 3.116 0 0 1 0-6.23'
        fill={color}
      />
    </svg>
  );
}
EyeOpen.propTypes = propTypes;
export default EyeOpen;
