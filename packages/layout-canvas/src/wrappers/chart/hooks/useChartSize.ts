/**
 * Hook for chart size management using ResizeObserver
 * Follows Single Responsibility Principle - only handles size calculations
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import type { ChartSize, UseChartSizeReturn } from '../types';

/**
 * Hook to manage chart size based on wrapper dimensions
 * @param useDynamicSizing - Whether to use dynamic sizing
 * @param id - Chart ID for dependency tracking
 * @param reservedTopPx - Optional extra space to reserve at top (e.g. expand button row in runtime)
 * @returns Chart size and wrapper ref
 */
export function useChartSize(useDynamicSizing: boolean, id: string, reservedTopPx: number = 0): UseChartSizeReturn {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [chartWidthPx, setChartWidthPx] = useState<number>(600);
  const [chartHeightPx, setChartHeightPx] = useState<number>(400);

  // Use ResizeObserver to track wrapper dimension changes and calculate chart size
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) {
      return;
    }

    // In runtime mode, a size-observer div sits between ComponentWrapper and
    // this wrapper, breaking the CSS height inheritance chain (the observer div
    // has height:auto so our height:100% resolves to 0). Detect it and observe
    // ComponentWrapper (the grid item) instead, which has the actual RGL
    // pixel dimensions.
    const parent = currentWrapper.parentElement;
    const observeTarget =
      parent?.dataset?.sizeObserver === 'true' ? parent.parentElement || currentWrapper : currentWrapper;

    const updateChartSize = () => {
      const wrapperWidth = observeTarget.clientWidth;
      const wrapperHeight = observeTarget.clientHeight;

      // Account for wrapper padding: 16px (8px left + 8px right for width, 8px top + 8px bottom for height)
      const horizontalReservedSpace = 16;
      const verticalReservedSpace = 16;

      const calculatedHeightPx = Math.max(100, wrapperHeight - verticalReservedSpace - reservedTopPx);
      const calculatedWidthPx = Math.max(100, wrapperWidth - horizontalReservedSpace);

      if (useDynamicSizing) {
        setChartHeightPx(calculatedHeightPx);
        setChartWidthPx(calculatedWidthPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateChartSize();
    });

    resizeObserver.observe(observeTarget);

    // Initial calculation
    updateChartSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicSizing, id, reservedTopPx]);

  const chartSize = useMemo<ChartSize>(() => {
    const width = useDynamicSizing ? chartWidthPx : 600;
    const height = useDynamicSizing ? chartHeightPx : 400;

    return {
      height,
      width,
    };
  }, [chartWidthPx, chartHeightPx, useDynamicSizing]);

  return {
    chartSize,
    wrapperRef,
  };
}
