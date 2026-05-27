import * as React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// types
const propTypes = {
  id: PropTypes.string,
  count: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  circle: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  duration: PropTypes.number,
};

/**
 * Wrapper component around
 */
function LoadingSkeleton({ id, count, height, width, circle, style, duration }) {
  return (
    <Skeleton id={id} count={count} height={height} circle={circle} style={style} duration={duration} width={width} />
  );
}

LoadingSkeleton.propTypes = propTypes;
export default LoadingSkeleton;
