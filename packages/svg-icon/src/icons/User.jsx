import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function User({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' width={width} height={height} fill={color}>
      <path
        d='M512 64c-106.038 0-192 85.962-192 192s85.962 192 192 192c106.038 0 192-85.962 192-192s-85.962-192-192-192zM256 256c0-141.385 114.615-256 256-256 141.382 0 256 114.615 256 256s-114.618 256-256 256c-141.385 0-256-114.615-256-256z M512 608c-101.843 0-199.515 40.454-271.529 112.474-72.014 72.013-112.471 169.683-112.471 271.526 0 17.67-14.327 32-32 32s-32-14.33-32-32c0-118.816 47.2-232.768 131.216-316.781 84.017-84.019 197.967-131.219 316.784-131.219s232.768 47.2 316.781 131.219c84.019 84.013 131.219 197.965 131.219 316.781 0 17.67-14.33 32-32 32s-32-14.33-32-32c0-101.843-40.454-199.514-112.474-271.526-72.013-72.019-169.683-112.474-271.526-112.474z'
        stroke={color}
      />
    </svg>
  );
}

User.propTypes = propTypes;
export default User;
