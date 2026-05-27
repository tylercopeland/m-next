/**
 * Unit tests for useChartValidation hook
 * Tests chart validation logic and expanded state (validation API injected via context; no app-builder/criteria-builder imports)
 */

import { renderHook } from '@testing-library/react-hooks';
import { useChartValidation } from '../useChartValidation';
import type { ChartControl } from '../../types';

jest.mock('../../../../contexts/DesignerContext', () => ({
  useDesignerContext: jest.fn(),
}));

import { useDesignerContext } from '../../../../contexts/DesignerContext';

const mockUseDesignerContext = useDesignerContext as jest.MockedFunction<typeof useDesignerContext>;

describe('useChartValidation', () => {
  const createMockControl = (overrides?: Partial<ChartControl>): ChartControl => ({
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [{ type: 'field', value: 'Field1' }],
      },
    },
    ...overrides,
  });

  const createMockChartValidation = () => ({
    parseExpression: jest.fn().mockReturnValue({ type: 'field', value: 'Field1' }),
    validateChart: jest.fn().mockReturnValue({ isValid: true, tableName: null, columns: [null, null] }),
    validateExpression: jest.fn().mockReturnValue({ isValid: true, expression: [] }),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDesignerContext.mockReturnValue({
      selectedControlId: null,
      selectedControlProperty: null,
      chartValidation: createMockChartValidation(),
    } as any);
  });

  describe('Validation', () => {
    it('should return false when control is null', () => {
      const { result } = renderHook(() => useChartValidation(null));

      expect(result.current.isValid).toBe(false);
    });

    it('should return false when control model is missing', () => {
      const control = createMockControl({ model: undefined });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });

    it('should return false when viewFilter is missing', () => {
      const control = createMockControl({
        model: {
          viewName: 'TestView',
          viewFilter: undefined,
        },
      });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });

    it('should return false when expression is missing', () => {
      const control = createMockControl({
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: undefined,
          },
        },
      });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });

    it('should return false when expression is not an array', () => {
      const control = createMockControl({
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: 'not an array' as any,
          },
        },
      });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });

    it('should return true when control is valid and chartValidation from context succeeds', () => {
      const chartValidation = createMockChartValidation();
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
        chartValidation,
      } as any);

      const control = createMockControl();
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(true);
      expect(chartValidation.parseExpression).toHaveBeenCalled();
      expect(chartValidation.validateChart).toHaveBeenCalledWith(control);
      expect(chartValidation.validateExpression).toHaveBeenCalled();
    });

    it('should return true when chartValidation is missing (runtime: no validation, allow chart to display)', () => {
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
        chartValidation: null,
      } as any);

      const control = createMockControl();
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(true);
    });

    it('should return true when control is editing', () => {
      const chartValidation = createMockChartValidation();
      chartValidation.validateChart.mockReturnValue({ isValid: false, tableName: null, columns: [null, null] });
      chartValidation.validateExpression.mockReturnValue({ isValid: false, expression: [] });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
        chartValidation,
      } as any);

      const control = createMockControl({ isEditing: true });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(true);
    });

    it('should return false when chart validation fails', () => {
      const chartValidation = createMockChartValidation();
      chartValidation.validateChart.mockReturnValue({ isValid: false, tableName: null, columns: [null, null] });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
        chartValidation,
      } as any);

      const control = createMockControl();
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });

    it('should return false when expression validation fails', () => {
      const chartValidation = createMockChartValidation();
      chartValidation.validateExpression.mockReturnValue({ isValid: false, expression: [] });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
        chartValidation,
      } as any);

      const control = createMockControl();
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.isValid).toBe(false);
    });
  });

  describe('Expanded State', () => {
    it('should return false when control is null', () => {
      const { result } = renderHook(() => useChartValidation(null));

      expect(result.current.expanded).toBe(false);
    });

    it('should return false when drilldown is not enabled', () => {
      const control = createMockControl({
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: [],
          },
          drilldownEnabled: false,
        },
      });
      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.expanded).toBe(false);
    });

    it('should return false when control is not selected', () => {
      const control = createMockControl({
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: [],
          },
          drilldownEnabled: true,
        },
      });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: 'other_control',
        selectedControlProperty: 'drilldown',
      } as any);

      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.expanded).toBe(false);
    });

    it('should return false when selected property is not drilldown', () => {
      const control = createMockControl({
        id: 'chart_1',
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: [],
          },
          drilldownEnabled: true,
        },
      });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: 'chart_1',
        selectedControlProperty: 'caption',
      } as any);

      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.expanded).toBe(false);
    });

    it('should return true when drilldown is enabled and control is selected', () => {
      const control = createMockControl({
        id: 'chart_1',
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: [],
          },
          drilldownEnabled: true,
        },
      });
      mockUseDesignerContext.mockReturnValue({
        selectedControlId: 'chart_1',
        selectedControlProperty: 'drilldown',
      } as any);

      const { result } = renderHook(() => useChartValidation(control));

      expect(result.current.expanded).toBe(true);
    });

    it('should update expanded state when selection changes', () => {
      const control = createMockControl({
        id: 'chart_1',
        model: {
          viewName: 'TestView',
          viewFilter: {
            filterId: 'filter_1',
            expression: [],
          },
          drilldownEnabled: true,
        },
      });

      mockUseDesignerContext.mockReturnValue({
        selectedControlId: null,
        selectedControlProperty: null,
      } as any);

      const { result, rerender } = renderHook(() => useChartValidation(control));

      expect(result.current.expanded).toBe(false);

      mockUseDesignerContext.mockReturnValue({
        selectedControlId: 'chart_1',
        selectedControlProperty: 'drilldown',
      } as any);

      rerender();

      expect(result.current.expanded).toBe(true);
    });
  });
});
