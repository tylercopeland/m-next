import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function FontColor({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#a)'>
        <path
          d='M14.4 12.667H1.6c-.88 0-1.6.75-1.6 1.666C0 15.25.72 16 1.6 16h12.8c.88 0 1.6-.75 1.6-1.667s-.72-1.667-1.6-1.667'
          fill={color}
        />
        <path
          d='M9.807 6.47 7.972 2.1 6.137 6.47zM7.426.365 7.468.28l.056-.07.056-.056.07-.056.07-.042.084-.028L7.888 0h.168l.084.028.084.028.07.042.07.056.056.056.056.07.042.084 4.454 10.644.028.112v.113l-.028.111-.014.057-.056.098-.07.084-.084.084-.112.056-.112.028-.112.014h-.084l-.084-.028-.084-.028-.07-.042-.07-.056-.056-.056-.056-.07-.042-.084-1.57-3.754H5.648l-1.513 3.614-.056.098-.084.098-.084.07-.098.042-.112.042-.112.014-.112-.014-.112-.042-.112-.056-.084-.07-.07-.085-.056-.112-.028-.098L3 11.037l.014-.126.028-.112z'
          fill='#6B7280'
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
FontColor.propTypes = propTypes;
export default FontColor;
