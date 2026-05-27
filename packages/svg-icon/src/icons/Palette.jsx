import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function Palette({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M10.6811 10.416C10.8811 12.9867 14.6904 11.216 14.3891 12.1094C12.7058 17.0967 5.95709 15.8994 3.07842 12.886C1.74311 11.5249 0.996287 9.69345 0.999031 7.78669C1.00177 5.87993 1.75386 4.05064 3.09309 2.69336C5.91176 -0.12531 10.6878 -0.329976 13.2851 2.67869C18.3731 8.57202 10.5051 8.12202 10.6811 10.416Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.79312 9.88604C5.35277 9.88604 5.80645 9.43236 5.80645 8.87271C5.80645 8.31306 5.35277 7.85938 4.79312 7.85938C4.23347 7.85938 3.77979 8.31306 3.77979 8.87271C3.77979 9.43236 4.23347 9.88604 4.79312 9.88604Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.29995 13.1093C7.8596 13.1093 8.31329 12.6557 8.31329 12.096C8.31329 11.5364 7.8596 11.0827 7.29995 11.0827C6.74031 11.0827 6.28662 11.5364 6.28662 12.096C6.28662 12.6557 6.74031 13.1093 7.29995 13.1093Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9.72378 4.95474C10.2834 4.95474 10.7371 4.50105 10.7371 3.9414C10.7371 3.38175 10.2834 2.92807 9.72378 2.92807C9.16413 2.92807 8.71045 3.38175 8.71045 3.9414C8.71045 4.50105 9.16413 4.95474 9.72378 4.95474Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.42642 6.02926C5.98607 6.02926 6.43975 5.57558 6.43975 5.01593C6.43975 4.45628 5.98607 4.00259 5.42642 4.00259C4.86677 4.00259 4.41309 4.45628 4.41309 5.01593C4.41309 5.57558 4.86677 6.02926 5.42642 6.02926Z'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

Palette.propTypes = propTypes;
export default Palette;
