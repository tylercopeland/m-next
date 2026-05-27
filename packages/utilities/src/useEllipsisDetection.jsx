import { useEffect, useState, useCallback } from 'react';

function useEllipsisDetection(ref) {
  const [isEllipsed, setIsEllipsed] = useState(false);

  const checkEllipsis = useCallback(() => {
    const element = ref.current;
    setIsEllipsed(element.scrollWidth > element.clientWidth);
  }, [ref]);

  // Check on content mutations
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Create mutation observer for content changes
    const mutationObserver = new MutationObserver(checkEllipsis);

    mutationObserver.observe(element, {
      characterData: true,
      subtree: true,
      childList: true,
    });

    // Create resize observer for element size changes
    const resizeObserver = new ResizeObserver(checkEllipsis);
    resizeObserver.observe(element);

    // Listen for window resize events
    window.addEventListener('resize', checkEllipsis);

    // Initial check
    checkEllipsis();

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkEllipsis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkEllipsis, ref.current]);

  return isEllipsed;
}

export default useEllipsisDetection;
