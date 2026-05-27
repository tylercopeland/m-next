import React from 'react';
import { StatusNotifierProps } from '../../types';
import { VisuallyHidden } from '../VisuallyHidden';

export const StatusNotifier: React.FC<StatusNotifierProps> = ({
  ariaLive = 'assertive',
  pending = false,
  messages,
}) => {
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'done'>('idle');
  const prevPendingRef = React.useRef(pending);

  React.useEffect(() => {
    if (!prevPendingRef.current && pending) {
      setStatus('pending');
    } else if (prevPendingRef.current && !pending) {
      setStatus('done');
    }

    prevPendingRef.current = pending;
  }, [pending]);

  const message = messages[status] || '';

  return <VisuallyHidden aria-live={ariaLive}>{message}</VisuallyHidden>;
};
