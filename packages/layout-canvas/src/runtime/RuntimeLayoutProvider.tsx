import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { SizeObserverContext } from './SizeObserverContext';
import type { SizeObserverMap, SizeObserverContextValue } from './types';

interface RuntimeLayoutProviderProps {
  children: React.ReactNode;
  /** Array of component IDs to track */
  componentIds: string[];
  /** Row height in pixels for grid unit conversion */
  rowHeight: number;
  /** Callback: notifies when any component heights have changed */
  onHeightChange: (heights: Map<string, number>) => void;
}

/**
 * Provider that manages the size observer map and notifies when component heights change.
 *
 * Wraps the canvas in runtime mode only. In designer mode, this provider
 * is not rendered — components pass directly to RGL at their base positions.
 *
 * Data flow:
 * 1. Each CanvasItem reports its observed pixel height via `reportSize`
 * 2. This provider batches those reports (100ms debounce)
 * 3. `onHeightsChange` is called with a map of componentId -> height in grid units
 */
export const RuntimeLayoutProvider: React.FC<RuntimeLayoutProviderProps> = ({
  children,
  componentIds,
  rowHeight,
  onHeightChange,
}) => {
  const [observedSizes, setObservedSizes] = useState<SizeObserverMap>({});
  const recomputeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  // const previousHeightsRef = useRef<Map<string, number>>(new Map());
  const previousHeightsRef = useRef<Map<string, number>>(new Map(componentIds.map((id) => [id, 0])));

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (recomputeTimeoutRef.current) {
        clearTimeout(recomputeTimeoutRef.current);
      }
    };
  }, []);

  // Stable callback for individual components to report their size.
  // useCallback with no dependencies keeps the reference stable across renders,
  // preventing child re-renders from context value changes.
  const reportSize = useCallback((componentId: string, contentHeightPx: number) => {
    if (!isMountedRef.current) return;

    setObservedSizes((prev) => {
      const existing = prev[componentId];
      // Skip update if height hasn't meaningfully changed
      if (existing && Math.abs(existing.contentHeightPx - contentHeightPx) < 1) {
        return prev;
      }
      return {
        ...prev,
        [componentId]: {
          componentId,
          contentHeightPx,
          lastObserved: Date.now(),
        },
      };
    });
  }, []);

  // Check if heights have changed and notify parent.
  // Debounced to batch multiple size reports arriving in quick succession
  // (e.g. initial render, tab switch, data load).
  useEffect(() => {
    if (recomputeTimeoutRef.current) {
      clearTimeout(recomputeTimeoutRef.current);
    }

    recomputeTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      // Build heights map from observed sizes (convert to grid units)
      const currentHeights = new Map<string, number>();
      for (const id of componentIds) {
        const observed = observedSizes[id];
        if (observed && observed.contentHeightPx > 0 && rowHeight > 0) {
          currentHeights.set(id, Math.ceil(observed.contentHeightPx / rowHeight));
        }
      }

      // Check if any heights have changed
      let hasChanges = false;
      const previous = previousHeightsRef.current;

      if (currentHeights.size !== previous.size) {
        hasChanges = true;
      } else {
        const entriesArray = Array.from(currentHeights.entries());
        for (let i = 0; i < entriesArray.length; i++) {
          const [id, height] = entriesArray[i]!;
          if (previous.get(id) !== height) {
            hasChanges = true;
            break;
          }
        }
      }

      // Only notify parent if heights actually changed (breaks potential loops)
      if (hasChanges) {
        previousHeightsRef.current = currentHeights;
        onHeightChange(currentHeights);
      }
    }, 100); // 100ms debounce for recomputation

    return () => {
      if (recomputeTimeoutRef.current) {
        clearTimeout(recomputeTimeoutRef.current);
      }
    };
  }, [componentIds, observedSizes, rowHeight, onHeightChange]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue: SizeObserverContextValue = useMemo(
    () => ({ observedSizes, reportSize }),
    [observedSizes, reportSize],
  );

  return <SizeObserverContext.Provider value={contextValue}>{children}</SizeObserverContext.Provider>;
};
