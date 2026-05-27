import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function FilterGroup({ height, width, color }) {
  return (
    <svg width={height} height={width} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.777 9.299h1.004c0.284 0 0.515 -0.231 0.515 -0.515s-0.231 -0.515 -0.515 -0.515h-1.004v-1.068c0 -0.276 -0.223 -0.499 -0.499 -0.499 -0.276 0 -0.499 0.223 -0.499 0.499v1.068h-1.004c-0.284 0 -0.515 0.231 -0.515 0.515s0.231 0.515 0.515 0.515h1.004v1.068c0 0.276 0.223 0.499 0.499 0.499 0.276 0 0.499 -0.223 0.499 -0.499v-1.068ZM1.037 2.382c-0.249 0.257 -0.37 0.557 -0.37 0.916v9.403c0 0.359 0.121 0.66 0.37 0.917C1.286 13.875 1.577 14 1.925 14h12.15c0.348 0 0.64 -0.125 0.889 -0.381 0.249 -0.257 0.369 -0.558 0.369 -0.917V4.866c0 -0.359 -0.121 -0.66 -0.37 -0.916 -0.249 -0.257 -0.541 -0.382 -0.889 -0.382h-6.183L6.373 2H1.925c-0.348 0 -0.64 0.125 -0.888 0.382Zm0.628 0.648H5.963l1.519 1.567h6.854v8.373H1.665V3.03Z'
        fill={color}
      />
    </svg>
  );
}
FilterGroup.propTypes = propTypes;
export default FilterGroup;
