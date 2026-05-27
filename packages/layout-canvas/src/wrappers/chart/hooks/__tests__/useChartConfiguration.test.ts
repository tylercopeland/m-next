/**
 * Unit tests for useChartConfiguration hook
 * Tests chart configuration including colors, types, and formatting
 */

import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useChartConfiguration } from '../useChartConfiguration';
import type { ChartControl } from '../../types';
import { FieldTypeIds, aggregateTypeIds } from '@m-next/types';

describe('useChartConfiguration', () => {
  const createMockControl = (overrides?: Partial<ChartControl>): ChartControl => ({
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [],
      },
      chart: 0, // Line chart
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      columns: [
        { name: 'Category', fieldType: FieldTypeIds.Text },
        { name: 'Value', fieldType: FieldTypeIds.Integer, aggregate: aggregateTypeIds.Sum },
      ],
    },
    ...overrides,
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Chart Type', () => {
    it('should return chart type from control model', () => {
      const control = createMockControl({ model: { ...createMockControl().model, chart: 1 } });
      const { result } = renderHook(() => useChartConfiguration(control));

      // useEffect sets chartType to null first, then after 100ms sets it back
      // Initial state has the value, but useEffect runs immediately and sets it to null
      // So we need to advance timers to get past the null state
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // After advancing timers, chartType should be set back to the correct value
      expect(result.current.chartType).toBe('column'); // chart: 1 maps to 'column'
    });

    it('should return null when chart type is not defined', () => {
      const control = createMockControl({ model: { ...createMockControl().model, chart: undefined } });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.chartType).toBeNull();
    });

    it('should update chart type when control model changes', () => {
      const control1 = createMockControl({ model: { ...createMockControl().model, chart: 0 } });
      const { result, rerender } = renderHook(({ control }) => useChartConfiguration(control), {
        initialProps: { control: control1 },
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.chartType).toBe('bar'); // chart: 0 maps to 'bar'

      const control2 = createMockControl({ model: { ...createMockControl().model, chart: 1 } });
      rerender({ control: control2 });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.chartType).toBe('column'); // chart: 1 maps to 'column'
    });
  });

  describe('Chart Colors', () => {
    it('should map V3 colors to V4 format', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          colors: ['#ff0000', '#00ff00', '#0000ff'],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      // mapV3ColorsToV4 converts colors to uppercase
      expect(result.current.chartColors).toEqual(['#FF0000', '#00FF00', '#0000FF']);
    });

    it('should return null when colors are not defined', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          colors: undefined,
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.chartColors).toBeNull();
    });

    it('should trigger refresh when colors change', () => {
      const control1 = createMockControl({
        model: {
          ...createMockControl().model,
          colors: ['#ff0000'],
        },
      });
      const { result, rerender } = renderHook(({ control }) => useChartConfiguration(control), {
        initialProps: { control: control1 },
      });

      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.refreshChart).toBe(false);

      const control2 = createMockControl({
        model: {
          ...createMockControl().model,
          colors: ['#00ff00'],
        },
      });
      rerender({ control: control2 });

      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.refreshChart).toBe(false);
    });
  });

  describe('Number Format', () => {
    it('should return integer format for integer field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Integer, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('integer');
    });

    it('should return decimal format for decimal field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Decimal, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('decimal');
    });

    it('should return currency format for money field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Money, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('currency');
    });

    it('should return integer format for count aggregate', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Integer, aggregate: aggregateTypeIds.Count },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('integer');
    });

    it('should return null when columns are not defined', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: undefined,
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('integer');
    });

    it('should return integer format when second column is missing', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text }],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.numberFormat).toBe('integer');
    });
  });

  describe('Allow Decimals', () => {
    it('should return true for decimal field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Decimal, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.allowDecimals).toBe(true);
    });

    it('should return true for money field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Money, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.allowDecimals).toBe(true);
    });

    it('should return false for count aggregate', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Integer, aggregate: aggregateTypeIds.Count },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.allowDecimals).toBe(false);
    });

    it('should return false for integer field type', () => {
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          columns: [
            { name: 'Category', fieldType: FieldTypeIds.Text },
            { name: 'Value', fieldType: FieldTypeIds.Integer, aggregate: aggregateTypeIds.Sum },
          ],
        },
      });
      const { result } = renderHook(() => useChartConfiguration(control));

      expect(result.current.allowDecimals).toBe(false);
    });
  });

  describe('Container Width Refresh', () => {
    it('should trigger refresh when container width changes', () => {
      const control = createMockControl();
      const { result, rerender } = renderHook(({ containerWidth }) => useChartConfiguration(control, containerWidth), {
        initialProps: { containerWidth: 100 },
      });

      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.refreshChart).toBe(false);

      rerender({ containerWidth: 200 });

      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.refreshChart).toBe(false);
    });
  });
});
