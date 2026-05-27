import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function HtmlEditorWidget({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <path
        d='M.5 13.423A1.08 1.08 0 0 0 1.576 14.5H14.5a1 1 0 0 0 1-1m0-9V2.577A1.08 1.08 0 0 0 14.423 1.5H1.571A1.075 1.075 0 0 0 .5 2.571V4.5m0 0h15m-10 7v-5m-1 0h2m-6 5v-5m2 5v-5m-2 3h2m11-3v4a1 1 0 0 0 1 1h1m-4 0v-5L10 9 8.5 6.5v5'
        stroke={color}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
HtmlEditorWidget.propTypes = propTypes;
export default HtmlEditorWidget;
