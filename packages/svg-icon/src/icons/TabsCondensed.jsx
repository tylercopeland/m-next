import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TabsCondensed({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height}>
      <path
        d='M15.979 10.356v-.005l-1.393-4.638A.99.99 0 0 0 13.628 5H13a.5.5 0 0 0 0 1h.628l1.2 4h-1.953l-1.29-4.287A.99.99 0 0 0 10.629 5H10a.5.5 0 1 0 0 1h.628l1.2 4H9.875l-1.29-4.287A.99.99 0 0 0 7.629 5H2.375a.99.99 0 0 0-.96.713L.022 10.35v.008A.5.5 0 0 0 0 10.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .479-.644M2.375 6h5.256l1.2 4h-7.66z'
        fill={color}
      />
    </svg>
  );
}
TabsCondensed.propTypes = propTypes;
export default TabsCondensed;
