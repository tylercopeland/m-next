import * as React from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
