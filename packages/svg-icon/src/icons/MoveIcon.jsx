import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function MoveIcon({ width, height, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 6 8' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.251953 6.875C0.251953 6.25368 0.755633 5.75 1.37695 5.75C1.99827 5.75 2.50195 6.25368 2.50195 6.875C2.50195 7.49632 1.99827 8 1.37695 8C0.755633 8 0.251953 7.49632 0.251953 6.875Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.251953 1.125C0.251953 0.50368 0.755633 0 1.37695 0C1.99827 0 2.50195 0.50368 2.50195 1.125C2.50195 1.74632 1.99827 2.25 1.37695 2.25C0.755633 2.25 0.251953 1.74632 0.251953 1.125Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.251953 4C0.251953 3.37868 0.755633 2.875 1.37695 2.875C1.99827 2.875 2.50195 3.37868 2.50195 4C2.50195 4.62132 1.99827 5.125 1.37695 5.125C0.755633 5.125 0.251953 4.62132 0.251953 4Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.50195 6.875C3.50195 6.25368 4.00563 5.75 4.62695 5.75C5.24827 5.75 5.75195 6.25368 5.75195 6.875C5.75195 7.49632 5.24827 8 4.62695 8C4.00563 8 3.50195 7.49632 3.50195 6.875Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.50195 1.125C3.50195 0.50368 4.00563 0 4.62695 0C5.24827 0 5.75195 0.50368 5.75195 1.125C5.75195 1.74632 5.24827 2.25 4.62695 2.25C4.00563 2.25 3.50195 1.74632 3.50195 1.125Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.50195 4C3.50195 3.37868 4.00563 2.875 4.62695 2.875C5.24827 2.875 5.75195 3.37868 5.75195 4C5.75195 4.62132 5.24827 5.125 4.62695 5.125C4.00563 5.125 3.50195 4.62132 3.50195 4Z'
        fill={color}
      />
    </svg>
  );
}
MoveIcon.propTypes = propTypes;
export default MoveIcon;
