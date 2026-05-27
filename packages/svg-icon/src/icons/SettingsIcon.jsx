import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function SettingsIcon({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width={width} height={height}>
      <g
        fill='none'
        className='nc-icon-wrapper'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
      >
        <path
          className='a'
          x={0.751}
          y={0.75}
          width={22.5}
          height={22.5}
          rx={1.5}
          ry={1.5}
          d='M1.501 0.5H14.501A1 1 0 0 1 15.501 1.5V14.5A1 1 0 0 1 14.501 15.5H1.501A1 1 0 0 1 0.501 14.5V1.5A1 1 0 0 1 1.501 0.5z'
        />
        <path className='a' d='M8.501 10.5h4m-9 0h2' />
        <path className='b' d='M8.501 10.5A1.5 1.5 0 1 1 7 9a1.5 1.5 0 0 1 1.501 1.5z' />
        <path className='a' d='M9.501 5.5h-6' />
        <path className='b' d='M12.501 5.5A1.5 1.5 0 1 0 11 7a1.501 1.501 0 0 0 1.501 -1.5z' />
      </g>
    </svg>
  );
}
SettingsIcon.propTypes = propTypes;
export default SettingsIcon;
