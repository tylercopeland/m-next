import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function SyncWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M3.282 13.142H.504a.5.5 0 0 1 0-1h1.758a7 7 0 0 1-1.25-4.146A6.96 6.96 0 0 1 3.17 3.09a6.97 6.97 0 0 1 4.843-1.944c.925 0 1.829.18 2.685.536a.498.498 0 0 1-.192.962.5.5 0 0 1-.192-.04 6 6 0 0 0-2.301-.458 5.98 5.98 0 0 0-4.152 1.666 5.96 5.96 0 0 0-1.85 4.205 6 6 0 0 0 .993 3.439V9.642a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5h-.159l-.03.002zM8 16.144a7 7 0 0 1-2.692-.539.498.498 0 0 1-.16-.816.5.5 0 0 1 .544-.108A6 6 0 0 0 8 15.144a5.97 5.97 0 0 0 4.156-1.672 5.96 5.96 0 0 0 1.845-4.207 6 6 0 0 0-.998-3.439v1.816a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 1 1 0 1h-1.756a7 7 0 0 1 1.255 4.144 6.96 6.96 0 0 1-2.152 4.908A6.97 6.97 0 0 1 8 16.144'
        fill={color}
      />
    </svg>
  );
}
SyncWidget.propTypes = propTypes;
export default SyncWidget;
