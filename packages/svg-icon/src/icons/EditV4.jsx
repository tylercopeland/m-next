import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function EditV4({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 16 16' fill='none'>
      <g clipPath='url(#a)' fillRule='evenodd' clipRule='evenodd' fill={color}>
        <path d='M13.062 0a2.93 2.93 0 0 1 2.084.852l-.353.354.355-.353a2.924 2.924 0 0 1-.026 4.155l-9.665 9.665a.5.5 0 0 1-.23.13L.625 15.984a.5.5 0 0 1-.608-.608l1.18-4.604a.5.5 0 0 1 .13-.23L10.991.879A2.93 2.93 0 0 1 13.061 0m1.378 1.56a1.925 1.925 0 0 0-2.736.02l-.004.003-9.57 9.57-.936 3.653 3.653-.937 9.574-9.574a1.926 1.926 0 0 0 .019-2.735' />
        <path d='M10.717 1.153a.5.5 0 0 1 .707 0l3.423 3.422a.5.5 0 1 1-.708.708L10.717 1.86a.5.5 0 0 1 0-.707m-9.391 9.39a.5.5 0 0 1 .707 0l3.426 3.42a.5.5 0 0 1-.707.707l-3.426-3.42a.5.5 0 0 1 0-.707' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h16v16H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}

EditV4.propTypes = propTypes;
export default EditV4;
