/**
 * Hook for chart validation logic
 * Follows Single Responsibility Principle - only handles validation
 * Uses chartValidation API injected via DesignerContext (no direct app-builder/criteria-builder imports)
 */

import { useMemo } from 'react';
import { useDesignerContext } from '../../../contexts/DesignerContext';
import type { ChartControl } from '../types';

/**
 * Validates if control model has all required properties
 */
function isValidChartModel(control: ChartControl | null): boolean {
  return !!(
    control?.model &&
    control.model.viewFilter &&
    control.model.viewFilter.expression &&
    Array.isArray(control.model.viewFilter.expression)
  );
}

/**
 * Hook to validate chart control and determine if drilldown is expanded
 * @param control - Chart control to validate
 * @returns Validation result and expanded state
 */
export function useChartValidation(control: ChartControl | null) {
  const designerContext = useDesignerContext();
  const selectedControlId = designerContext?.selectedControlId ?? null;
  const selectedControlProperty = designerContext?.selectedControlProperty ?? null;
  const chartValidation = designerContext?.chartValidation ?? null;

  const isValid = useMemo(() => {
    if (!control || !isValidChartModel(control)) return false;
    if (control.isEditing) return true;

    // Runtime or host not providing chartValidation: treat as valid so chart can display
    if (!chartValidation?.parseExpression || !chartValidation?.validateChart || !chartValidation?.validateExpression) {
      return true;
    }

    const expression = chartValidation.parseExpression((control.model?.viewFilter?.expression ?? []) as unknown[]);
    return chartValidation.validateChart(control).isValid && chartValidation.validateExpression(expression).isValid;
  }, [control, chartValidation]);

  const expanded = useMemo(
    () =>
      !!(
        control &&
        control.model &&
        control.model.drilldownEnabled &&
        selectedControlId === control.id &&
        selectedControlProperty === 'drilldown'
      ),
    [control, selectedControlId, selectedControlProperty],
  );

  return {
    isValid,
    expanded,
  };
}
