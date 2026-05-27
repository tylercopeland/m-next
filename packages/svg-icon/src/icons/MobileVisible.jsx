import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

function MobileVisible({ height, width }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 12 18' fill='none'>
      <path
        d='M10.125 2.8125C10.125 1.88052 9.36948 1.125 8.4375 1.125H2.8125C1.88052 1.125 1.125 1.88052 1.125 2.8125V15.1875C1.125 16.1195 1.88052 16.875 2.8125 16.875H8.4375C9.36948 16.875 10.125 16.1195 10.125 15.1875V2.8125ZM11.25 15.1875C11.25 16.7408 9.9908 18 8.4375 18H2.8125C1.2592 18 0 16.7408 0 15.1875V2.8125C0 1.2592 1.2592 1.93277e-07 2.8125 0H8.4375C9.9908 0 11.25 1.2592 11.25 2.8125V15.1875Z'
        fill='#545F67'
      />
      <path
        d='M10.6875 13.5C10.9982 13.5 11.25 13.7518 11.25 14.0625C11.25 14.3732 10.9982 14.625 10.6875 14.625H0.5625C0.25184 14.625 0 14.3732 0 14.0625C0 13.7518 0.25184 13.5 0.5625 13.5H10.6875Z'
        fill='#545F67'
      />
    </svg>
  );
}
MobileVisible.propTypes = propTypes;
export default MobileVisible;
