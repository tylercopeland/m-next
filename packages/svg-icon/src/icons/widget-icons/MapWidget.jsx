import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function MapWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M8 .32A5.28 5.28 0 0 0 2.72 5.6c0 1.916.728 3.25 2.358 4.988l1.06 1.104c.286.307.61 1.008.918 1.932.152.46.281.91.38 1.296l.096.389c.116.495.822.494.936-.002l.073-.297.085-.325c.128-.47.271-.938.427-1.373.277-.776.562-1.355.814-1.624l.88-.916C12.5 8.94 13.28 7.582 13.28 5.6A5.28 5.28 0 0 0 8 .32m0 .96a4.32 4.32 0 0 1 4.32 4.32c0 1.615-.622 2.754-2.1 4.332l-1.055 1.1c-.367.393-.698 1.064-1.016 1.957l-.121.35-.028.087-.033-.104c-.35-1.053-.717-1.845-1.129-2.286l-.889-.924C4.349 8.442 3.68 7.276 3.68 5.6A4.32 4.32 0 0 1 8 1.28'
        fill={color}
      />
      <path
        d='M8 3.2A2.4 2.4 0 1 0 8 8a2.4 2.4 0 0 0 0-4.8m0 .96a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88'
        fill={color}
      />
    </svg>
  );
}
MapWidget.propTypes = propTypes;
export default MapWidget;
