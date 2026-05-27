import SvgIcon from '@m-next/svg-icon';
import React from 'react';
import * as s from './ConfigureJoinDialog.styles';

function JoinIcon() {
  return (
    <s.JoinIconWrapper>
     <SvgIcon>
        <svg xmlns='http://www.w3.org/2000/svg' width={16} height={4} viewBox='0 0 16 4' fill='none'>
          <path d='M2 2h12.2' stroke='#91A2FF' strokeWidth={3} strokeLinecap='square' />
        </svg>
      </SvgIcon>
       <SvgIcon style={{margin:-4}}>
        <svg xmlns='http://www.w3.org/2000/svg' width={37} height={36} viewBox='0 0 37 36' fill='none'>
          <path
            d='M24.124 18.32c0 5.44-4.568 9.923-10.294 9.923S3.534 23.76 3.534 18.32 8.103 8.399 13.83 8.399s10.294 4.483 10.294 9.922Z'
            fill='#91A2FF'
            stroke='#91A2FF'
            strokeWidth={2.657}
          />
          <path
            d='M34.086 18.32c0 5.44-4.568 9.923-10.294 9.923S13.498 23.76 13.498 18.32s4.568-9.922 10.294-9.922 10.294 4.483 10.294 9.922Z'
            stroke='#84F3FF'
            strokeWidth={2.657}
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M18.812 28.49c3.926-1.807 6.64-5.68 6.64-10.168S22.737 9.96 18.811 8.154c-3.927 1.805-6.642 5.68-6.642 10.167 0 4.488 2.716 8.363 6.643 10.168'
            fill='url(#a)'
          />
          <defs>
            <linearGradient id='a' x1={21.247} y1={10.624} x2={17.32} y2={26.05} gradientUnits='userSpaceOnUse'>
              <stop stopColor='#91A2FF' />
              <stop offset={1} stopColor='#84F3FF' />
            </linearGradient>
          </defs>
        </svg>
      </SvgIcon>
      <SvgIcon>
        <svg xmlns='http://www.w3.org/2000/svg' width={13} height={4} viewBox='0 0 13 4' fill='none'>
          <path d='M2 .5a1.5 1.5 0 1 0 0 3zm9 3h1.5v-3H11zm-9 0h9v-3H2z' fill='#84F3FF' />
        </svg>
      </SvgIcon>
    </s.JoinIconWrapper>
  );
}

export default JoinIcon;
