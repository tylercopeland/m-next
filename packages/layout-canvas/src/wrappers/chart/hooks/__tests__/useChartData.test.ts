/**
 * Unit tests for useChartData hook
 * Tests chart data fetching in both runtime and designer modes (no direct app-builder/package imports)
 */

import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useChartData } from '../useChartData';
import type { ChartControl } from '../../types';

jest.mock('../../../../contexts/RuntimeContext', () => ({
  useRuntimeContext: jest.fn(),
}));

jest.mock('../../../../contexts/DesignerContext', () => ({
  useDesignerContext: jest.fn(),
}));

import { useRuntimeContext } from '../../../../contexts/RuntimeContext';
import { useDesignerContext } from '../../../../contexts/DesignerContext';

const mockUseRuntimeContext = useRuntimeContext as jest.MockedFunction<typeof useRuntimeContext>;
const mockUseDesignerContext = useDesignerContext as jest.MockedFunction<typeof useDesignerContext>;

describe('useChartData', () => {
  const createMockControl = (overrides?: Partial<ChartControl>): ChartControl => ({
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [],
      },
    },
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDesignerContext.mockReturnValue({
      designerChartDataResults: null,
    } as any);
  });

  describe('Runtime Mode', () => {
    it('should load chart data in runtime mode', () => {
      const mockLoadChartData = jest.fn();
      const mockGetChartData = jest.fn().mockReturnValue({
        categories: ['Cat1', 'Cat2'],
        series: [{ data: [1, 2] }],
      });

      mockUseRuntimeContext.mockReturnValue({
        getChartData: mockGetChartData,
        loadChartData: mockLoadChartData,
      } as any);

      const control = createMockControl();

      const { result } = renderHook(
        () =>
          useChartData({
            control,
            id: 'chart_1',
            isRuntimeMode: true,
            isValid: true,
          }),
        {},
      );

      expect(mockLoadChartData).toHaveBeenCalledWith(control);
      expect(mockGetChartData).toHaveBeenCalledWith('chart_1');
      expect(result.current.categories).toEqual(['Cat1', 'Cat2']);
      expect(result.current.series).toEqual([{ data: [1, 2] }]);
    });

    it('should return null when chart data is not available', () => {
      const mockGetChartData = jest.fn().mockReturnValue(null);

      mockUseRuntimeContext.mockReturnValue({
        getChartData: mockGetChartData,
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: true,
            isValid: true,
          }),
        {},
      );

      expect(result.current.categories).toBeNull();
      expect(result.current.series).toBeNull();
    });
  });

  describe('Designer Mode', () => {
    it('should use injected designerChartData when provided', () => {
      const mockData = {
        categories: ['Cat1', 'Cat2', 'Cat3'],
        series: [{ data: [10, 20, 30] }],
      };

      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: true,
            designerChartData: {
              data: mockData,
              error: null,
              isLoading: false,
            },
          }),
        {},
      );

      expect(result.current.categories).toEqual(['Cat1', 'Cat2', 'Cat3']);
      expect(result.current.series).toEqual([{ data: [10, 20, 30] }]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should use designerChartDataResults from context when designerChartData param not passed', () => {
      const mockData = {
        categories: ['FromContext'],
        series: [{ data: [1, 2] }],
      };

      mockUseDesignerContext.mockReturnValue({
        designerChartDataResults: {
          chart_1: {
            data: mockData,
            error: null,
            isLoading: false,
          },
        },
      } as any);
      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: true,
          }),
        {},
      );

      expect(result.current.categories).toEqual(['FromContext']);
      expect(result.current.series).toEqual([{ data: [1, 2] }]);
    });

    it('should return null when no designer data and not loading', () => {
      mockUseDesignerContext.mockReturnValue({ designerChartDataResults: {} } as any);
      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: false,
          }),
        {},
      );

      expect(result.current.categories).toBeNull();
      expect(result.current.series).toBeNull();
    });

    it('should handle loading state from injected data', () => {
      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: true,
            designerChartData: {
              data: null,
              error: null,
              isLoading: true,
            },
          }),
        {},
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.categories).toBeNull();
      expect(result.current.series).toBeNull();
    });

    it('should handle error state from injected data', () => {
      const mockError = new Error('Failed to fetch data');
      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result } = renderHook(
        () =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: true,
            designerChartData: {
              data: null,
              error: mockError,
              isLoading: false,
            },
          }),
        {},
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.categories).toBeNull();
      expect(result.current.series).toBeNull();
    });
  });

  describe('Data Updates', () => {
    it('should update when designerChartData param changes', async () => {
      mockUseRuntimeContext.mockReturnValue({
        getChartData: jest.fn(),
        loadChartData: jest.fn(),
      } as any);

      const { result, rerender } = renderHook(
        ({ designerChartData }: { designerChartData: any }) =>
          useChartData({
            control: createMockControl(),
            id: 'chart_1',
            isRuntimeMode: false,
            isValid: true,
            designerChartData,
          }),
        {
          initialProps: {
            designerChartData: {
              data: { categories: ['Cat1'], series: [{ data: [1] }] },
              error: null,
              isLoading: false,
            },
          },
        },
      );

      await waitFor(() => {
        expect(result.current.categories).toEqual(['Cat1']);
      });

      rerender({
        designerChartData: {
          data: { categories: ['Cat2'], series: [{ data: [2] }] },
          error: null,
          isLoading: false,
        },
      });

      await waitFor(() => {
        expect(result.current.categories).toEqual(['Cat2']);
      });
    });
  });
});
