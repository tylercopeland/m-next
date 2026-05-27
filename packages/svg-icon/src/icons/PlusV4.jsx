import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function PlusV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height} fill='none'>
      <path
        d='M8.005 15.68a.48.48 0 0 1-.48-.48V8.48H.805a.48.48 0 0 1 0-.96h6.72V.8a.48.48 0 1 1 .96 0v6.72h6.72a.48.48 0 1 1 0 .96h-6.72v6.72a.48.48 0 0 1-.48.48'
        fill={color}
      />
    </svg>
  );
}
PlusV4.propTypes = propTypes;
export default PlusV4;
