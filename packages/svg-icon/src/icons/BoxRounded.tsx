import * as React from 'react';

interface Props {
  height?: number;
  width?: number;
  color?: string;
}

function BoxRounded({ height, width, color }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width={width} height={height} rx='2' fill={color} />
    </svg>
  );
}

export default BoxRounded;
