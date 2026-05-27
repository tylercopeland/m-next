import { useEffect, useRef, useState, useLayoutEffect } from 'react';

// Hook
export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

/**
 * Custom hook to detect screen resize.
 * Returns an array, const [width, height] = useWindowSize()
 */

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  const updateSize = () => {
    setSize([window.innerWidth, window.innerHeight]);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};

export const useEnableScroll = (ref, targetClassName) => {
  const handleChildWheel = (e, element) => {
    e.preventDefault();
    e.stopPropagation();
    if (element === null) return;

    const handleScroll = () => {
      // eslint-disable-next-line no-param-reassign
      element.scrollTop += e.deltaY;
    };

    window.requestAnimationFrame(handleScroll);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (targetClassName == null) {
      ref.current.addEventListener('wheel', (e) => handleChildWheel(e, ref.current));
      const currentRef = ref.current;
      return () => currentRef.removeEventListener('wheel', (e) => handleChildWheel(e, currentRef));
    }

    const observer = new MutationObserver((mutations) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutations) {
        const parentNode = Array.from(mutation.addedNodes).find((node) => node.querySelector(targetClassName) != null);
        if (parentNode) {
          const node = parentNode.querySelector(targetClassName);
          node.addEventListener('wheel', (e) => handleChildWheel(e, node));
          break;
        }
      }
    });

    observer.observe(ref.current, { childList: true });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current, targetClassName]);
};
