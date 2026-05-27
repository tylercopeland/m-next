import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ScreenV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.6 1.6a.533.533 0 0 0-.533.533v11.734c0 .294.238.533.533.533h12.8a.533.533 0 0 0 .533-.534V2.133A.533.533 0 0 0 14.4 1.6zM0 2.133a1.6 1.6 0 0 1 1.6-1.6h12.8a1.6 1.6 0 0 1 1.6 1.6v11.734a1.6 1.6 0 0 1-1.6 1.6H1.6a1.6 1.6 0 0 1-1.6-1.6z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 4.266c0-.294.239-.533.533-.533h14.934a.533.533 0 0 1 0 1.067H.533A.533.533 0 0 1 0 4.266'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.867 3.733c.294 0 .533.239.533.533v10.667a.533.533 0 0 1-1.067 0V4.266c0-.294.24-.533.534-.533'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.333 9.6c0-.295.24-.533.534-.533h9.6a.533.533 0 1 1 0 1.066h-9.6a.533.533 0 0 1-.534-.533'
        fill={color}
      />
    </svg>
  );
}
ScreenV4.propTypes = propTypes;
export default ScreenV4;
