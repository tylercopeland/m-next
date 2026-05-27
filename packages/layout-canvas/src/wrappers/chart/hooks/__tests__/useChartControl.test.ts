/**
 * Unit tests for useChartControl hook
 * Tests control resolution from different sources (runtime/designer/props)
 */

import { renderHook } from '@testing-library/react-hooks';
import { useChartControl } from '../useChartControl';
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

describe('useChartControl', () => {
  const createMockControl = (overrides?: Partial<ChartControl>): ChartControl => ({
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [],
      },
    },
    visible: true,
    disabled: false,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Runtime Mode', () => {
    it('should get control from runtime context when in runtime mode', () => {
      const mockControl = createMockControl();
      const mockGetControl = jest.fn().mockReturnValue(mockControl);

      mockUseRuntimeContext.mockReturnValue({
        mode: 'runtime',
        getControl: mockGetControl,
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          mode: 'runtime',
        }),
      );

      expect(mockGetControl).toHaveBeenCalledWith('chart_1');
      expect(result.current.control).toEqual(mockControl);
      expect(result.current.isRuntimeMode).toBe(true);
    });

    it('should use mode prop to determine runtime mode', () => {
      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          mode: 'runtime',
        }),
      );

      expect(result.current.isRuntimeMode).toBe(true);
    });
  });

  describe('Designer Mode', () => {
    it('should get control from designer context when in designer mode', () => {
      const mockControl = createMockControl();
      const mockSelectControlById = jest.fn().mockReturnValue(mockControl);

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: mockSelectControlById,
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          mode: 'designer',
        }),
      );

      expect(mockSelectControlById).toHaveBeenCalledWith('chart_1');
      expect(result.current.control).toEqual(mockControl);
      expect(result.current.isRuntimeMode).toBe(false);
    });
  });

  describe('Control Prop', () => {
    it('should use control prop when provided', () => {
      const mockControl = createMockControl();

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          control: mockControl,
        }),
      );

      expect(result.current.control).toEqual(mockControl);
    });

    it('should prioritize control prop over context', () => {
      const propControl = createMockControl({ id: 'prop_control' });
      const contextControl = createMockControl({ id: 'context_control' });

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn().mockReturnValue(contextControl),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          control: propControl,
        }),
      );

      expect(result.current.control).toEqual(propControl);
      expect(result.current.control?.id).toBe('prop_control');
    });
  });

  describe('Control Updates', () => {
    it('should update when control ID changes', () => {
      const control1 = createMockControl({ id: 'chart_1' });
      const control2 = createMockControl({ id: 'chart_2' });

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      const mockSelectControlById = jest.fn().mockReturnValueOnce(control1).mockReturnValueOnce(control2);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: mockSelectControlById,
      } as any);

      const { result, rerender } = renderHook(
        ({ id }) =>
          useChartControl({
            id,
          }),
        {
          initialProps: { id: 'chart_1' },
        },
      );

      expect(result.current.control?.id).toBe('chart_1');

      rerender({ id: 'chart_2' });

      expect(result.current.control?.id).toBe('chart_2');
    });

    it('should update when control model changes', () => {
      const control1 = createMockControl({ id: 'chart_1' });
      const control2 = createMockControl({
        id: 'chart_1',
        model: {
          viewName: 'UpdatedView',
          viewFilter: {
            filterId: 'filter_2',
            expression: [],
          },
        },
      });

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      let callCount = 0;
      const mockSelectControlById = jest.fn(() => {
        callCount++;
        return callCount === 1 ? control1 : control2;
      });

      mockUseDesignerContext.mockReturnValue({
        selectControlById: mockSelectControlById,
      } as any);

      const { result, rerender } = renderHook(
        () =>
          useChartControl({
            id: 'chart_1',
          }),
        {},
      );

      expect(result.current.control?.model?.viewName).toBe('TestView');

      // Update the mock to return a new function reference to trigger useMemo
      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(() => control2),
      } as any);

      rerender();

      expect(result.current.control?.model?.viewName).toBe('UpdatedView');
    });

    it('should update when control properties change', () => {
      const control1 = createMockControl({ visible: true, disabled: false });
      const control2 = createMockControl({ visible: false, disabled: true });

      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(() => control1),
      } as any);

      const { result, rerender } = renderHook(
        () =>
          useChartControl({
            id: 'chart_1',
          }),
        {},
      );

      expect(result.current.control?.visible).toBe(true);
      expect(result.current.control?.disabled).toBe(false);

      // Update the mock to return a new function reference with different control
      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn(() => control2),
      } as any);

      rerender();

      expect(result.current.control?.visible).toBe(false);
      expect(result.current.control?.disabled).toBe(true);
    });
  });

  describe('Null/Undefined Handling', () => {
    it('should return null when no control is found', () => {
      mockUseRuntimeContext.mockReturnValue({
        mode: 'designer',
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn().mockReturnValue(null),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
        }),
      );

      expect(result.current.control).toBeNull();
    });

    it('should handle undefined getControl function', () => {
      mockUseRuntimeContext.mockReturnValue({
        mode: 'runtime',
        getControl: undefined,
      } as any);

      mockUseDesignerContext.mockReturnValue({
        selectControlById: jest.fn().mockReturnValue(null),
      } as any);

      const { result } = renderHook(() =>
        useChartControl({
          id: 'chart_1',
          mode: 'runtime',
        }),
      );

      expect(result.current.control).toBeNull();
    });
  });
});
