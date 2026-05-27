import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

function CustomDashboardIconLight({ height, width, color }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox='0 0 22 22' fill='none'>
      <g clipPath='url(#clip0_2812_247913)'>
        <path
          d='M8.71094 15.125H1.3776C0.871343 15.125 0.460938 15.5354 0.460938 16.0416V20.625C0.460938 21.1312 0.871343 21.5416 1.3776 21.5416H8.71094C9.2172 21.5416 9.6276 21.1312 9.6276 20.625V16.0416C9.6276 15.5354 9.2172 15.125 8.71094 15.125Z'
          stroke={color}
          strokeWidth='0.916667'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13.2969 21.5416H20.6302C21.1365 21.5416 21.5469 21.1312 21.5469 20.625V10.5416C21.5469 10.0354 21.1365 9.62496 20.6302 9.62496L13.2969 9.62496C12.7906 9.62496 12.3802 10.0354 12.3802 10.5416L12.3802 20.625C12.3802 21.1312 12.7906 21.5416 13.2969 21.5416Z'
          stroke={color}
          strokeWidth='0.916667'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13.2969 6.87495L20.6302 6.87495C21.1365 6.87495 21.5469 6.46455 21.5469 5.95829V1.37495C21.5469 0.868693 21.1365 0.458288 20.6302 0.458288L13.2969 0.458288C12.7906 0.458288 12.3802 0.868693 12.3802 1.37495V5.95829C12.3802 6.46455 12.7906 6.87495 13.2969 6.87495Z'
          stroke={color}
          strokeWidth='0.916667'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M8.71094 0.458282H1.3776C0.871343 0.458282 0.460938 0.868688 0.460938 1.37495V11.4583C0.460938 11.9645 0.871343 12.3749 1.3776 12.3749H8.71094C9.2172 12.3749 9.6276 11.9645 9.6276 11.4583V1.37495C9.6276 0.868688 9.2172 0.458282 8.71094 0.458282Z'
          stroke={color}
          strokeWidth='0.916667'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_2812_247913'>
          <rect width='22' height='22' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}
CustomDashboardIconLight.propTypes = propTypes;
export default CustomDashboardIconLight;
