import SvgIcon from '@m-next/svg-icon';
import React from 'react';

function LinkedFieldsIcon() {
  return (
    <SvgIcon
      size={128}
      style={{
        filter: 'drop-shadow(4px 4px 8px rgba(28, 38, 170, 0.30))',
      }}
    >
      <svg xmlns='http://www.w3.org/2000/svg' width={124} height={127.647} viewBox='0 0 124 127.647' fill='none'>
        <path
          opacity={0.5}
          fillRule='evenodd'
          clipRule='evenodd'
          d='M0 12.569a3.65 3.65 0 0 1 1.573-3L14.47.647a3.65 3.65 0 0 1 4.149 0l12.899 8.922a3.65 3.65 0 0 1 1.573 3v19.407a3.647 3.647 0 0 1-3.647 3.647h-10.79v16.986H35.33a1.84 1.84 0 0 1 0 3.68H18.655v22.849h16.676a1.84 1.84 0 0 1 0 3.681H18.655v22.851h16.676a1.839 1.839 0 1 1 0 3.679h-18.54a1.84 1.84 0 0 1-1.84-1.84V35.624H3.647A3.647 3.647 0 0 1 0 31.977z'
          fill='#1C26AA'
        />
        <g filter='url(#a)'>
          <path
            fill='#2EC9E8'
            d='M35.231 45.25h74.181a3.647 3.647 0 0 1 3.647 3.647v11.104a3.647 3.647 0 0 1-3.647 3.647H35.231a3.647 3.647 0 0 1-3.647-3.647V48.897a3.647 3.647 0 0 1 3.647-3.647'
          />
        </g>
        <g filter='url(#b)'>
          <path
            d='M31.584 75.428a3.647 3.647 0 0 1 3.647-3.647h74.181a3.647 3.647 0 0 1 3.647 3.647v11.103a3.647 3.647 0 0 1-3.647 3.647H35.231a3.647 3.647 0 0 1-3.647-3.647z'
            fill='#2EC9E8'
          />
        </g>
        <g filter='url(#c)'>
          <path
            fill='#2EC9E8'
            d='M35.231 98.308h74.181a3.647 3.647 0 0 1 3.647 3.647v11.105a3.647 3.647 0 0 1-3.647 3.647H35.231a3.647 3.647 0 0 1-3.647-3.647v-11.105a3.647 3.647 0 0 1 3.647-3.647'
          />
        </g>
        <defs>
          <filter
            id='a'
            x={30.641}
            y={45.629}
            width={105.359}
            height={36.179}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity={0} result='BackgroundImageFix' />
            <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
            <feOffset dx={4} dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix values='0 0 0 0 0.0588235 0 0 0 0 0.47451 0 0 0 0 0.6 0 0 0 0.25 0' />
            <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_1182_26538' />
            <feBlend in='SourceGraphic' in2='effect1_dropShadow_1182_26538' result='shape' />
          </filter>
          <filter
            id='b'
            x={30.641}
            y={74.727}
            width={105.359}
            height={36.179}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity={0} result='BackgroundImageFix' />
            <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
            <feOffset dx={4} dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix values='0 0 0 0 0.0588235 0 0 0 0 0.47451 0 0 0 0 0.6 0 0 0 0.25 0' />
            <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_1182_26538' />
            <feBlend in='SourceGraphic' in2='effect1_dropShadow_1182_26538' result='shape' />
          </filter>
          <filter
            id='c'
            x={30.641}
            y={103.822}
            width={105.359}
            height={36.179}
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity={0} result='BackgroundImageFix' />
            <feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha' />
            <feOffset dx={4} dy={4} />
            <feGaussianBlur stdDeviation={4} />
            <feComposite in2='hardAlpha' operator='out' />
            <feColorMatrix values='0 0 0 0 0.0588235 0 0 0 0 0.47451 0 0 0 0 0.6 0 0 0 0.25 0' />
            <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_1182_26538' />
            <feBlend in='SourceGraphic' in2='effect1_dropShadow_1182_26538' result='shape' />
          </filter>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export default LinkedFieldsIcon;
