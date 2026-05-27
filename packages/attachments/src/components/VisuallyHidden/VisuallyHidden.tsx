import React from 'react';
import { VisuallyHiddenProps } from '../../types';

export const VisuallyHidden = React.forwardRef<HTMLDivElement, VisuallyHiddenProps>(
  ({ children, className = '', ...props }, ref) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    };

    return (
      <div ref={ref} className={`visually-hidden ${className}`} style={style} {...props}>
        {children}
      </div>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
