import React from 'react';

interface Props {
  color?: string;
  width?: number;
  height?: number;
}

const CloseCompact = ({ color, width, height }: Props) => {
  return (
    <svg width={width} height={height} viewBox='0 0 5 5' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.5 4.5L4.5 0.5M0.5 0.5L4.5 4.5' stroke={color} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  );
};

export default CloseCompact;
