import * as React from 'react';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

function PagesIcon({ width, height, color }: Props) {
  return (
    <svg width={width} height={height} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g clipPath='url(#clip0_7345_85118)'>
        <path
          d='M12.8693 14.6394H2.24532C2.01051 14.6394 1.78533 14.5461 1.61929 14.3801C1.45326 14.214 1.35999 13.9888 1.35999 13.754V3.13004M5.78665 4.90071H11.984M5.78665 6.67138H11.984M5.78665 8.44204H10.2133M4.01599 1.35938H13.7547C14.2436 1.35938 14.64 1.75575 14.64 2.24471V11.9834C14.64 12.4723 14.2436 12.8687 13.7547 12.8687H4.01599C3.52703 12.8687 3.13065 12.4723 3.13065 11.9834V2.24471C3.13065 1.75575 3.52703 1.35938 4.01599 1.35938Z'
          stroke={color}
          strokeWidth='1.25'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_7345_85118'>
          <rect width={width} height={height} fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
}

export default PagesIcon;
