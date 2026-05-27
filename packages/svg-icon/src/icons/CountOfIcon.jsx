import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CountOfIcon({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 24 24'>
      <title>count of icon</title>
      <g fill={color} className='nc-icon-wrapper'>
        <defs />
        <path
          className='a'
          d='M22.91 6.953L12.7 1.672a1.543 1.543 0 0 0-1.416 0L1.076 6.953a.615.615 0 0 0 0 1.094l10.209 5.281a1.543 1.543 0 0 0 1.416 0L22.91 8.047a.616.616 0 0 0 0-1.094z'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5px'
        />
        <path
          className='a'
          d='M.758 12.75l10.527 5.078a1.543 1.543 0 0 0 1.416 0l10.557-5.078'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5px'
        />
        <path
          className='a'
          d='M.758 17.25l10.527 5.078a1.543 1.543 0 0 0 1.416 0l10.557-5.078'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.5px'
        />
      </g>
    </svg>
  );
}
CountOfIcon.propTypes = propTypes;
export default CountOfIcon;
