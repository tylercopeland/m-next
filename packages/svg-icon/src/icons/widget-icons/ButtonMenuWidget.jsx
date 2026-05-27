import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function ButtonMenuWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='m8.664 7.838.27 6.465a.5.5 0 0 0 .726.425l1.73-2.51 2.893.155a.5.5 0 0 0 .095-.829L9.485 7.436a.5.5 0 0 0-.82.402'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6.594 8.963h-2.09a3.873 3.873 0 1 1 0-7.745h6.992a3.873 3.873 0 0 1 2.086 7.136'
        stroke={color}
        strokeLinecap='round'
      />
      <path
        d='M12.492 4.114a.375.375 0 0 1 .48.572L11.7 5.993l-.001-.001a.46.46 0 0 1-.662 0l-1.27-1.306-.049-.06a.376.376 0 0 1 .528-.512l.057.049 1.065 1.093 1.064-1.093z'
        fill={color}
      />
    </svg>
  );
}
ButtonMenuWidget.propTypes = propTypes;
export default ButtonMenuWidget;
