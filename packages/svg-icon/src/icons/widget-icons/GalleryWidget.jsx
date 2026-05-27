import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function GalleryWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M6.333 9H1.167a.667.667 0 0 0-.667.667v5.166c0 .368.298.667.667.667h5.166A.667.667 0 0 0 7 14.833V9.667A.667.667 0 0 0 6.333 9M.5 13H7M6.334.5H1.167a.667.667 0 0 0-.667.667v5.166c0 .369.3.667.667.667h5.167A.667.667 0 0 0 7 6.333V1.167A.667.667 0 0 0 6.334.5M.5 4.5H7m7.833-4H9.667A.667.667 0 0 0 9 1.167v5.166c0 .369.298.667.667.667h5.166a.667.667 0 0 0 .667-.667V1.167A.667.667 0 0 0 14.833.5M9 4.5h6.5M14.833 9H9.667A.667.667 0 0 0 9 9.667v5.166c0 .368.298.667.667.667h5.166a.667.667 0 0 0 .667-.667V9.667A.667.667 0 0 0 14.833 9M9 13h6.5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
GalleryWidget.propTypes = propTypes;
export default GalleryWidget;
