import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function GridV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 17 17' fill='none'>
      <path
        d='M1.063 2.125h13.812v12.75H1.062V2.125ZM6.375 8.5v2.125h3.188V8.5H6.374Zm3.188-1.063V5.313H6.374v2.125h3.188Zm-4.25 0V5.313H2.124v2.125h3.188ZM2.124 8.5v2.125h3.188V8.5H2.124Zm3.188 5.313v-2.126H2.124v2.126h3.188Zm4.25 0v-2.126H6.374v2.126h3.188Zm4.25 0v-2.126h-3.188v2.126h3.188Zm0-3.188V8.5h-3.188v2.125h3.188Zm0-3.188V5.313h-3.188v2.125h3.188ZM2.124 4.25h11.688V3.187H2.124V4.25Z'
        fill={color}
      />
    </svg>
  );
}
GridV4.propTypes = propTypes;
export default GridV4;
