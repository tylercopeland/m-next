import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ResetV4({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g fillRule='evenodd' clipRule='evenodd' fill={color}>
        <path d='M7.963 1.366A5.11 5.11 0 0 0 1.58 3.524a.375.375 0 1 1-.649-.376 5.86 5.86 0 1 1-.79 2.94.375.375 0 1 1 .75 0 5.11 5.11 0 1 0 7.072-4.722' />
        <path d='M1.202.227c.207 0 .375.167.375.375v2.367h2.368a.375.375 0 0 1 0 .75H1.202a.375.375 0 0 1-.375-.375V.602c0-.208.168-.375.375-.375' />
      </g>
    </svg>
  );
}

ResetV4.propTypes = propTypes;
export default ResetV4;
