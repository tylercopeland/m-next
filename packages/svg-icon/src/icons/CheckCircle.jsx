import * as React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CheckCircle({ height, width, color }) {
  return (
    <svg width={width} height={height} viewBox='0 0 17 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12.6441 4.15975C12.8607 4.33098 12.8975 4.64542 12.7263 4.86206L7.5002 11.4741C7.38511 11.6242 7.23614 11.7449 7.06544 11.8265C6.89309 11.9088 6.70358 11.9488 6.51267 11.9431C6.32177 11.9373 6.13498 11.8861 5.96786 11.7937C5.80272 11.7023 5.6615 11.5733 5.55566 11.4171L3.9253 9.10332C3.76624 8.87759 3.82029 8.56565 4.04603 8.4066C4.27176 8.24754 4.58369 8.30159 4.74275 8.52732L6.37608 10.8453L6.38285 10.8552C6.40051 10.8815 6.42421 10.9033 6.45199 10.9187C6.47976 10.934 6.51081 10.9426 6.54254 10.9435C6.57427 10.9445 6.60576 10.9378 6.63441 10.9241C6.66305 10.9104 6.68801 10.8901 6.70722 10.8648L6.71309 10.8573L11.9418 4.24198C12.113 4.02534 12.4274 3.98852 12.6441 4.15975Z'
        fill={color}
      />
      <path
        d='M8.33398 0.999266C4.46799 0.999266 1.33398 4.13327 1.33398 7.99926C1.33398 11.8652 4.46799 14.9992 8.33398 14.9992C12.2 14.9992 15.334 11.8652 15.334 7.99926C15.334 4.13327 12.2 0.999266 8.33398 0.999266ZM0.333984 7.99926C0.333984 3.58098 3.91571 -0.000732422 8.33398 -0.000732422C12.7523 -0.000732422 16.334 3.58098 16.334 7.99926C16.334 12.4175 12.7523 15.9992 8.33398 15.9992C3.91571 15.9992 0.333984 12.4175 0.333984 7.99926Z'
        fill={color}
      />

      <defs>
        <clipPath id='clip0_2718_126852'>
          <rect width={width} height={height} fill='white' transform='translate(0.333984)' />
        </clipPath>
        <clipPath id='clip1_2718_126852'>
          <rect width={width} height={height} fill='white' transform='translate(0.333984)' />
        </clipPath>
      </defs>
    </svg>
  );
}
CheckCircle.propTypes = propTypes;
export default CheckCircle;
