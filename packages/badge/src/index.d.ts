import * as React from 'react';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeColorScheme = 'neutral' | 'blue' | 'green' | 'yellow' | 'red';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  variant?: BadgeVariant;
  colorScheme?: BadgeColorScheme;
  size?: BadgeSize;
  dot?: boolean;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps>;
export default Badge;
