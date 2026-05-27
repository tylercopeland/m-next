import { useEffect } from 'react';

export default function (ref, handler, id) {
  useEffect(() => {
    const touchListenerOptions = { passive: true };

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener, touchListenerOptions);

    // unmount
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener, touchListenerOptions);
    };
  }, [ref, handler, id]);
}
