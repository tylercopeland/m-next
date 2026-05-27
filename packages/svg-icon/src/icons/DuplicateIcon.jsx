import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function DuplicateIcon({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 13 15' fill='none'>
      <path
        d='M9.33333 0C8.40273 0 1.33333 0 1.33333 0C0.6 0 4.14992e-09 0.6 4.14992e-09 1.33333C4.14992e-09 1.33333 0 9.82207 4.14992e-09 10.6667C8.29994e-09 11.5113 1.33333 11.5113 1.33333 10.6667C1.33333 9.98987 1.33333 4.40457 1.33333 2.21199C1.33333 1.66839 1.33333 1.33333 1.33333 1.33333C1.33333 1.33333 1.67303 1.33333 2.21327 1.33333C4.13887 1.33333 8.61234 1.33333 9.33333 1.33333C10.2566 1.33333 10.2639 0 9.33333 0ZM11.3333 2.66667L4 2.66667C3.26667 2.66667 2.66667 3.26667 2.66667 4L2.66667 13.3333C2.66667 14.0667 3.26667 14.6667 4 14.6667L11.3333 14.6667C12.0667 14.6667 12.6667 14.0667 12.6667 13.3333L12.6667 4C12.6667 3.26667 12.0667 2.66667 11.3333 2.66667ZM11.3333 13.3333L4 13.3333L4 4L11.3333 4L11.3333 13.3333Z'
        fill={color}
      />
    </svg>
  );
}
DuplicateIcon.propTypes = propTypes;
export default DuplicateIcon;
