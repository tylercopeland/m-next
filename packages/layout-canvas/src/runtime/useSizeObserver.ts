import { useEffect, useRef } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useSizeObserverContext } from './SizeObserverContext';

export interface UseSizeObserverOptions {
  /** Component ID to report for */
  componentId: string;
  /** Whether observation is enabled (false in designer mode) */
  enabled: boolean;
}

/**
 * Runtime-specific size observer hook.
 *
 * Composes the generic `useResizeObserver` with the `SizeObserverContext`
 * to report component content heights to the runtime layout system.
 *
 * In designer mode (`enabled: false`), the underlying ResizeObserver is
 * not created and no size reports are made.
 *
 * Returns a ref callback to attach to the component's measurement wrapper.
 */
export function useSizeObserver({ componentId, enabled }: UseSizeObserverOptions): React.RefCallback<HTMLElement> {
  const { reportSize } = useSizeObserverContext();
  const { size, ref } = useResizeObserver({ enabled });

  // Track the last reported height to avoid duplicate reports
  const lastReportedRef = useRef<number>(0);

  // Report height changes to the context
  useEffect(() => {
    if (!enabled || size.height === 0) return;

    // Skip if height hasn't meaningfully changed
    if (Math.abs(size.height - lastReportedRef.current) < 1) return;

    lastReportedRef.current = size.height;
    reportSize(componentId, size.height);
  }, [enabled, size.height, componentId, reportSize]);

  return ref;
}
