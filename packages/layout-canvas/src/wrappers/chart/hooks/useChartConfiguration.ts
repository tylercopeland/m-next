/**
 * Hook for chart configuration (colors, types, formatting)
 * Follows Single Responsibility Principle - only handles chart configuration
 */

import { useState, useEffect, useMemo } from 'react';
import { FieldTypeIds, aggregateTypeIds } from '@m-next/types';
import { chartTypes } from '../utils/constants';
import { mapV3ColorsToV4 } from '../utils/colorUtils';
import type { ChartControl, NumberFormat, UseChartConfigurationReturn } from '../types';

/**
 * Hook to manage chart configuration (type, colors, formatting)
 * @param control - Chart control
 * @param containerWidth - Container width for refresh trigger
 * @returns Chart configuration values
 */
export function useChartConfiguration(
  control: ChartControl | null,
  containerWidth?: number,
): UseChartConfigurationReturn {
  const [currentChartType, setCurrentChartType] = useState<string | null>(
    control?.model?.chart !== undefined ? chartTypes[control.model.chart] || null : null,
  );
  const [refreshChart, setRefreshChart] = useState<boolean>(false);

  // Update chart type when control model changes
  useEffect(() => {
    setCurrentChartType(null);
    setTimeout(() => {
      setCurrentChartType(control?.model?.chart !== undefined ? chartTypes[control.model.chart] || null : null);
    }, 100);
  }, [control?.model?.chart]);

  // Chart colors with V3 to V4 mapping
  const chartColors = useMemo<string[] | null>(() => {
    if (control && control.model && control.model.colors) {
      return mapV3ColorsToV4(control.model.colors);
    }
    return null;
  }, [control]);

  // Trigger refresh when colors or container width changes
  useEffect(() => {
    setRefreshChart(true);
    setTimeout(() => {
      setRefreshChart(false);
    }, 50);
  }, [chartColors, containerWidth]);

  // Number format based on field type
  const numberFormat = useMemo<NumberFormat>(() => {
    if (
      !control?.model?.columns ||
      control.model.columns.length === 0 ||
      !control.model.columns[1] ||
      control.model.columns[1].aggregate === aggregateTypeIds.Count ||
      control.model.columns[1].fieldType === FieldTypeIds.Integer
    ) {
      return 'integer';
    }
    if (control.model.columns[1].fieldType === FieldTypeIds.Decimal) {
      return 'decimal';
    }
    if (control.model.columns[1].fieldType === FieldTypeIds.Money) {
      return 'currency';
    }
    return null;
  }, [control]);

  // Whether to allow decimals
  const allowDecimals = useMemo(
    () =>
      !!(
        control?.model?.columns &&
        control.model.columns.length > 0 &&
        control.model.columns[1] &&
        control.model.columns[1].aggregate !== aggregateTypeIds.Count &&
        (control.model.columns[1].fieldType === FieldTypeIds.Decimal ||
          control.model.columns[1].fieldType === FieldTypeIds.Money)
      ),
    [control],
  );

  return {
    chartType: currentChartType,
    chartColors,
    numberFormat,
    allowDecimals,
    refreshChart,
  };
}
