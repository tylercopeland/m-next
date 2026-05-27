import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function TrashV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M6.282 12.429a.57.57 0 0 1-.571-.572V7.286a.571.571 0 1 1 1.143 0v4.571a.57.57 0 0 1-.572.572m3.43 0a.57.57 0 0 1-.571-.572V7.286a.571.571 0 0 1 1.143 0v4.571a.57.57 0 0 1-.572.572'
        fill={color}
      />
      <path
        d='M4 15.857a1.716 1.716 0 0 1-1.714-1.714V4.429H.57a.571.571 0 1 1 0-1.143h4v-.572A1.716 1.716 0 0 1 6.286 1h3.428a1.716 1.716 0 0 1 1.715 1.714v.572h4a.571.571 0 0 1 0 1.143h-1.715v9.714A1.716 1.716 0 0 1 12 15.857zm-.571-1.714c0 .315.256.571.571.571h8a.57.57 0 0 0 .571-.571V4.429H3.43zm6.857-10.857v-.572a.57.57 0 0 0-.572-.571H6.286a.57.57 0 0 0-.572.571v.572z'
        fill={color}
      />
    </svg>
  );
}

TrashV4.propTypes = propTypes;
export default TrashV4;
