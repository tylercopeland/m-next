import * as React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | number;

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  size?: SpinnerSize;
  color?: string;
  thickness?: number;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps>;
export default Spinner;
