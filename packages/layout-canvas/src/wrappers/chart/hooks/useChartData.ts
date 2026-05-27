/**
 * Hook for chart data fetching (runtime and designer modes)
 * Follows Single Responsibility Principle - only handles data fetching
 * Follows Dependency Inversion Principle - abstracts data source; designer data is injected by host (no direct package imports)
 */

import { useState, useEffect, useMemo } from 'react';
import { useRuntimeContext } from '../../../contexts/RuntimeContext';
import { useDesignerContext } from '../../../contexts/DesignerContext';
import type { ChartControl, UseChartDataReturn, DesignerChartDataResult } from '../types';

interface UseChartDataParams {
  control: ChartControl | null;
  id: string;
  isRuntimeMode: boolean;
  isValid: boolean;
  /** Injected by host in designer mode (e.g. from RTK Query); falls back to context when not passed */
  designerChartData?: DesignerChartDataResult | null;
}

/**
 * Hook to fetch chart data from runtime context or injected designer data
 * @param params - Parameters for data fetching
 * @returns Chart data (categories, series), loading state, and error
 */
export function useChartData(params: UseChartDataParams): UseChartDataReturn {
  const { control, id, isRuntimeMode, designerChartData: designerChartDataParam } = params;
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();
  const designerChartData =
    designerChartDataParam ?? (control?.id ? designerContext?.designerChartDataResults?.[control.id] : null);

  const getChartDataFn = runtimeContext?.getChartData;
  const loadChartDataFn = runtimeContext?.loadChartData;

  const [currentSeries, setCurrentSeries] = useState<unknown[] | null>(null);
  const [currentCategory, setCurrentCategory] = useState<unknown[] | null>(null);

  // Load chart data in runtime mode
  const controlId = control?.id;
  const controlModel = control?.model;
  useEffect(() => {
    if (isRuntimeMode && loadChartDataFn && control) {
      loadChartDataFn(control);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRuntimeMode, loadChartDataFn, controlId, controlModel]);

  // Designer mode: use injected designerChartData when provided (host calls RTK Query and passes result)
  const data: { categories?: unknown[]; series?: unknown[] } | null = designerChartData?.data ?? null;
  const error: unknown = designerChartData?.error ?? null;
  const isLoading = designerChartData?.isLoading ?? false;

  // Categories from runtime or designer mode
  const categories = useMemo<unknown[] | null>(() => {
    if (isRuntimeMode && getChartDataFn) {
      const chartData = getChartDataFn(id);
      if (chartData?.categories) {
        return chartData.categories;
      }
      return currentCategory;
    }

    if (!isRuntimeMode) {
      if (!isLoading && !error && (data === null || data === undefined)) return currentCategory;
      if (isLoading || error || data === null || data === undefined) return null;
      setCurrentCategory(data.categories ?? null);
      return data.categories ?? null;
    }

    return null;
  }, [isRuntimeMode, getChartDataFn, id, currentCategory, data, error, isLoading]);

  // Series from runtime or designer mode
  const series = useMemo<unknown[] | null>(() => {
    if (isRuntimeMode && getChartDataFn) {
      const chartData = getChartDataFn(id);
      if (chartData?.series) {
        return chartData.series;
      }
      return currentSeries;
    }

    if (!isRuntimeMode) {
      if (!isLoading && !error && (data === null || data === undefined)) return currentSeries;
      if (isLoading || error || data === null || data === undefined) return null;
      setCurrentSeries(data.series ?? null);
      return data.series ?? null;
    }

    return null;
  }, [isRuntimeMode, getChartDataFn, id, currentSeries, data, error, isLoading]);

  return {
    categories,
    series,
    isLoading,
    error,
  };
}
