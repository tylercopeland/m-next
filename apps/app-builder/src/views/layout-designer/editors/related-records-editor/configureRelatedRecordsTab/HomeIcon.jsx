import SvgIcon from '@m-next/svg-icon';
import React from 'react';

function HomeIcon() {
  return (
    <SvgIcon
      size={80}
      style={{
        filter: 'drop-shadow(4px 4px 8px rgba(28, 38, 170, 0.30))',
      }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' width={88} height={95} viewBox='0 0 88 95' fill='none'>
        <g filter='url(#a)'>
          <path
            d='M4 31.272a6 6 0 0 1 2.564-4.919l30-20.953a6 6 0 0 1 6.872 0l30 20.953A6 6 0 0 1 76 31.273V77a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6z'
            fill='#1C26AA'
          />
        </g>
        <defs>
          <filter
            id='a'
            x={0}
            y={0.319}
            width={88}
            height={94.681}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity={0} result='BackgroundImageFix' />
            <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
            <feOffset dx={4} dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix values='0 0 0 0 0.109804 0 0 0 0 0.14902 0 0 0 0 0.666667 0 0 0 0.3 0' />
            <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_1182_26525' />
            <feBlend in='SourceGraphic' in2='effect1_dropShadow_1182_26525' result='shape' />
          </filter>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export default HomeIcon;
