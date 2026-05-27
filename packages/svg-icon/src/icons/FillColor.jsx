import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function FillColor({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#a)'>
        <path
          d='M14.4 12.667H1.6c-.88 0-1.6.75-1.6 1.666C0 15.25.72 16 1.6 16h12.8c.88 0 1.6-.75 1.6-1.667s-.72-1.667-1.6-1.667'
          fill={color}
        />
        <path
          d='M4.454 4.757v-2.77a1.486 1.486 0 0 1 2.972 0m.435.227a.61.61 0 0 0-.865 0l-3.458 3.46a1.833 1.833 0 0 0 0 2.593l1.729 1.73a1.834 1.834 0 0 0 2.594 0l2.81-2.81 1.314-.146a.306.306 0 0 0 .182-.52zm4.223 6.461-.82 1.64a.915.915 0 1 0 1.64 0z'
          stroke='#545F67'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h16v16H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}
FillColor.propTypes = propTypes;
export default FillColor;
