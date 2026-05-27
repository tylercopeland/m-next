import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Observed dimensions from the ResizeObserver
 */
export interface ObservedSize {
  /** Observed content width in pixels */
  width: number;
  /** Observed content height in pixels */
  height: number;
}

export interface UseResizeObserverOptions {
  /** Whether observation is enabled (default true) */
  enabled?: boolean;
  /** Debounce interval in ms (default 150) */
  debounceMs?: number;
  /** Minimum change in pixels to trigger an update (default 1) */
  threshold?: number;
}

/**
 * Generic ResizeObserver hook that measures an element's content dimensions.
 *
 * Returns `{ width, height }` state and a ref callback to attach to the
 * target DOM element. Uses `contentRect` from ResizeObserver, which
 * naturally excludes borders, padding, scrollbars, and absolutely-positioned
 * children (tooltips, overlays, popovers, etc.).
 *
 * @example
 * ```tsx
 * const { size, ref } = useResizeObserver();
 * return <div ref={ref}>{size.height}px tall</div>;
 * ```
 */
export function useResizeObserver({ enabled = true, debounceMs = 150, threshold = 1 }: UseResizeObserverOptions = {}): {
  size: ObservedSize;
  ref: React.RefCallback<HTMLElement>;
} {
  const [size, setSize] = useState<ObservedSize>({ width: 0, height: 0 });

  const observerRef = useRef<ResizeObserver | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSizeRef = useRef<ObservedSize>({ width: 0, height: 0 });
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Ref callback: attaches/detaches the observer when the DOM node mounts/unmounts
  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !enabled) return;

      // Guard: ResizeObserver may not exist in test environments
      if (typeof ResizeObserver === 'undefined') return;

      observerRef.current = new ResizeObserver((entries) => {
        if (!isMountedRef.current) return;

        for (const entry of entries) {
          const { width: contentWidth, height: contentHeight } = entry.contentRect;

          // Skip if change is below threshold
          const last = lastSizeRef.current;
          if (Math.abs(contentWidth - last.width) < threshold && Math.abs(contentHeight - last.height) < threshold) {
            continue;
          }

          // Debounce the state update
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            if (!isMountedRef.current) return;
            const newSize = { width: contentWidth, height: contentHeight };
            lastSizeRef.current = newSize;
            setSize(newSize);
          }, debounceMs);
        }
      });

      observerRef.current.observe(node);
    },
    [enabled, debounceMs, threshold],
  );

  return { size, ref };
}
