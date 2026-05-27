import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

interface Props {
  height?: number;
  width?: number;
  color?: string;
}

function BackIcon({ height, width, color }: Props) {
  return (
    <svg width={width} height={height} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M15.9831 12.0036H2.04001M2.04001 12.0036L5.35979 15.3233M2.04001 12.0036L5.35979 8.68377M8.67954 15.9837V19.9675C8.66437 20.3035 8.7829 20.6318 9.00919 20.8807C9.23548 21.1295 9.55112 21.2786 9.88705 21.2954H20.752C21.0878 21.2784 21.4032 21.1292 21.6293 20.8804C21.8554 20.6315 21.9738 20.3033 21.9587 19.9675V4.0325C21.9741 3.69658 21.8558 3.36823 21.6296 3.11935C21.4035 2.87047 21.0879 2.72133 20.752 2.70459H9.88705C9.55112 2.72133 9.23548 2.87044 9.00919 3.11929C8.7829 3.36815 8.66437 3.69649 8.67954 4.0325V8.01624'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

BackIcon.propTypes = propTypes;
export default BackIcon;
