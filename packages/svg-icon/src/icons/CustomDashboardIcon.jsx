import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

function CustomDashboardIcon({ height = 80, width = 112 }) {
  return (
    <svg
      width={width}
      height={height}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <g clipPath='url(#a)'>
        <g filter='url(#b)'>
          <path d='M494-48h-876v304h876V-48Z' fill='#000' />
        </g>
        <path d='M494-48h-876v304h876V-48Z' fill='#fff' />
        <path opacity={0.25} d='M96 0H56v40h40V0Z' fill='url(#c)' />
        <path
          d='M48 72c17.673 0 32-14.327 32-32C80 22.327 65.673 8 48 8 30.327 8 16 22.327 16 40c0 17.673 14.327 32 32 32Z'
          fill='#E6F1FA'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M53.636 52.265A2.242 2.242 0 0 1 51.4 54.51H33.526a2.24 2.24 0 0 1-2.234-2.245V27.538a2.241 2.241 0 0 1 2.237-2.246l17.875.03a2.242 2.242 0 0 1 2.232 2.245v24.698Zm-3-23.945-16.344-.027v23.218h16.344V28.32Z'
          fill='#022266'
        />
        <path
          d='M80.563 38.556a2.22 2.22 0 0 1-2.235 2.205H60.453a2.218 2.218 0 0 1-2.234-2.205v-11.03a2.218 2.218 0 0 1 2.23-2.204l17.874-.03a2.223 2.223 0 0 1 2.24 2.204v11.06Z'
          fill='#0D71C8'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M78.328 40.76a2.22 2.22 0 0 0 2.234-2.204v-11.06a2.223 2.223 0 0 0-2.239-2.204l-17.874.03a2.218 2.218 0 0 0-2.23 2.204v11.03a2.216 2.216 0 0 0 2.234 2.205h17.875Zm-17.11-3h16.344v-9.467l-16.343.027v9.44Zm-.785-9.438h.005-.005Z'
          fill='#022266'
        />
        <path
          d='M53.636 72.351a2.225 2.225 0 0 1-2.24 2.212l-17.874-.03a2.22 2.22 0 0 1-2.23-2.21v-11.02a2.221 2.221 0 0 1 2.234-2.21h17.875a2.223 2.223 0 0 1 2.235 2.21v11.048Z'
          fill='#0D71C8'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M51.397 74.563a2.223 2.223 0 0 0 2.239-2.212V61.303a2.223 2.223 0 0 0-2.235-2.21H33.526a2.22 2.22 0 0 0-2.234 2.21v11.02a2.22 2.22 0 0 0 2.23 2.21l17.875.03Zm-17.105-3.029 16.344.027v-9.467H34.292v9.44Zm-.784-9.44h.005-.005ZM80.563 72.317a2.241 2.241 0 0 1-2.235 2.246H60.453a2.24 2.24 0 0 1-2.234-2.246V47.59a2.241 2.241 0 0 1 2.236-2.246l17.875.03a2.242 2.242 0 0 1 2.233 2.245v24.698Zm-3-23.945-16.344-.027v23.218h16.343v-23.19Z'
          fill='#022266'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h112v80H0z' />
        </clipPath>
        <pattern id='c' patternContentUnits='objectBoundingBox' width={0.24} height={0.24}>
          <use xlinkHref='#d' transform='scale(.005)' />
        </pattern>
        <filter
          id='b'
          x={-386}
          y={-50}
          width={884}
          height={312}
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity={0} result='BackgroundImageFix' />
          <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
          <feOffset dy={2} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0' />
          <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_1638_27084' />
          <feBlend in='SourceGraphic' in2='effect1_dropShadow_1638_27084' result='shape' />
        </filter>
        <image
          id='d'
          width={48}
          height={48}
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAADbN2wMAAAAwUlEQVRoBe2XQQ6AIAwEifFXPl//pXCoIR4ICD1sMyQEFVjbKQVNidIkcOTeUt3K5qaMMASWECAHlmBERJgAOSAcPExfQoAcWIIREWECV7b9FLY/3dn4Ut2K/A8NDritjU7hMBH4npij92WnsYStW+NYP7Prencafd87Xj4CRsirNdpe+kk+AjjgtjY6heUjsHc6+ndY+ZijQGCCwHtiTmg0p8oncdM7OgMQIAcCBBEXpgiQA1P4mByAADkQIIhtFx6JtxlMUx/tlQAAAABJRU5ErkJggg=='
        />
      </defs>
    </svg>
  );
}

CustomDashboardIcon.propTypes = propTypes;
export default CustomDashboardIcon;
