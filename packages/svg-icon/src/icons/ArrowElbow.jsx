import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ArrowElbow({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 12 12' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M.75 0a.75.75 0 0 1 .75.75v6.5h7.94l-.97-.97a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H.75A.75.75 0 0 1 0 8V.75A.75.75 0 0 1 .75 0'
        fill={color}
      />
    </svg>
  );
}

ArrowElbow.propTypes = propTypes;
export default ArrowElbow;
