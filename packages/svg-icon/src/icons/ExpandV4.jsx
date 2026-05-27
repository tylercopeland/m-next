import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ExpandV4({ height, width, color }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox={`0 0 ${height} ${width}`}
      fill='none'
    >
      <rect width={width} height={height} rx={height / 2} fill='#fff' />
      <g clipPath='url(#a)' stroke={color} strokeWidth={0.795} strokeLinecap='round' strokeLinejoin='round'>
        <path d='M21.079 13.124h-7.16a.795.795 0 0 0-.795.796v7.159c0 .44.356.795.795.795h7.16a.795.795 0 0 0 .795-.795v-7.16a.795.795 0 0 0-.795-.795Zm2.386-1.591 3.182-3.181M8.352 26.647l3.181-3.182m.796 3.182H8.352V22.67m18.295-10.341V8.35H22.67m.795 15.114 3.182 3.183M8.352 8.351l3.181 3.182m-3.181.796V8.35h3.977M22.67 26.647h3.977V22.67' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M7.954 7.955h19.091v19.091H7.954z' />
        </clipPath>
      </defs>
    </svg>
  );
}
ExpandV4.propTypes = propTypes;
export default ExpandV4;
