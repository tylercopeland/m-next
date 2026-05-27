/**
 * Unit tests for useChartEventHandlers hook
 * Tests event handler creation and execution
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useChartEventHandlers } from '../useChartEventHandlers';
import type { ChartControl } from '../../types';
import { FieldTypeIds } from '@m-next/types';

// Mock RuntimeContext
jest.mock('../../../../contexts/RuntimeContext', () => ({
  useRuntimeContext: jest.fn(),
}));

import { useRuntimeContext } from '../../../../contexts/RuntimeContext';
const mockUseRuntimeContext = useRuntimeContext as jest.MockedFunction<typeof useRuntimeContext>;

describe('useChartEventHandlers', () => {
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

  const createMockActionHandler = () => ({
    executeAction: jest.fn().mockResolvedValue({ success: true }),
  });

  const createMockRuntimeContext = (overrides?: Partial<ReturnType<typeof useRuntimeContext>>) =>
    ({
      screenKey: 'test_screen',
      screenId: 'test_screen_id',
      activeRecordId: null,
      viewFriendlyName: null,
      panelName: 'main',
      mode: 'runtime' as const,
      store: null,
      isMobile: false,
      applicationType: 'MethodUI' as const,
      isAdminOrCustomizer: false,
      getControl: jest.fn(),
      loadAttachmentsData: jest.fn(),
      loadChartData: jest.fn(),
      setChartSelectedPoint: jest.fn(),
      loadChipsData: jest.fn(),
      loadDropdownData: jest.fn(),
      loadGridData: jest.fn(),
      getChartData: jest.fn(),
      getDropdownData: jest.fn(),
      getGridChipsData: jest.fn(),
      getGridData: jest.fn(),
      getGridTotalRecordCount: jest.fn(),
      processAnalytics: jest.fn(),
      bulkUpdateControls: jest.fn(),
      updateControlProperty: jest.fn(),
      bulkAddGridRows: jest.fn(),
      clearChipData: jest.fn(),
      deleteGridRow: jest.fn(),
      updateGridCell: jest.fn(),
      updateGridRowStatus: jest.fn(),
      ...overrides,
    }) as ReturnType<typeof useRuntimeContext>;

  const defaultParams = {
    control: createMockControl(),
    mode: 'runtime' as const,
    actionHandler: createMockActionHandler(),
    screenId: 'screen_1',
    recordId: 'record_1',
    screenState: {},
    selectedPoint: null,
    setSelectedPoint: jest.fn(),
    setGridIsLoading: jest.fn(),
    setHasTotalRecord: jest.fn(),
    setSearchString: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext());
  });

  describe('Point Click Handler', () => {
    it('should set selected point when clicked', () => {
      const setSelectedPoint = jest.fn();
      const control = createMockControl({ model: { ...createMockControl().model, drilldownEnabled: true } });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          setSelectedPoint,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1' },
        category: 'Category1',
        series: 'Series1',
      };

      act(() => {
        result.current.handlePointClick(pointEvent as any);
      });

      expect(setSelectedPoint).toHaveBeenCalledWith('Category1|Series1');
    });

    it('should clear selected point when same point is clicked', () => {
      const setSelectedPoint = jest.fn();
      const control = createMockControl({ model: { ...createMockControl().model, drilldownEnabled: true } });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          selectedPoint: 'Category1|Series1',
          setSelectedPoint,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1', selected: true },
        category: 'Category1',
        series: 'Series1',
      };

      act(() => {
        result.current.handlePointClick(pointEvent as any);
      });

      expect(setSelectedPoint).toHaveBeenCalledWith(null);
    });

    it('should execute action handler in runtime mode', async () => {
      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1' },
        category: 'Category1',
        series: 'Series1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      expect(actionHandler.executeAction).toHaveBeenCalled();
    });

    it('should fire analytics "Chart area clicked on runtime, drilldown not enabled" when point clicked and not expanded', async () => {
      const processAnalytics = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ processAnalytics }));

      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          viewName: 'TestView',
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
          expanded: false,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, category: 'Category1' },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      expect(processAnalytics).toHaveBeenCalledWith('Chart Runtime Action', {
        action: 'Chart area clicked on runtime, drilldown not enabled',
        tablename: 'TestView',
      });
    });

    it('should fire analytics "Chart area clicked on drilldown view, drilldown is enabled" when point clicked with drilldown enabled', async () => {
      const processAnalytics = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ processAnalytics }));

      const control = createMockControl({
        model: { ...createMockControl().model, drilldownEnabled: true, viewName: 'TestView' },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          expanded: true,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1' },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      expect(processAnalytics).toHaveBeenCalledWith('Chart Runtime Action', {
        action: 'Chart area clicked on drilldown view, drilldown is enabled',
        tablename: 'TestView',
      });
    });

    it('should fire analytics "Chart area clicked on runtime, drilldown is enabled" when chart area clicked with drilldown enabled', async () => {
      const processAnalytics = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ processAnalytics }));

      const control = createMockControl({
        model: { ...createMockControl().model, drilldownEnabled: true, viewName: 'TestView' },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          expanded: false,
        }),
      );

      await act(async () => {
        await result.current.handleClick();
      });

      expect(processAnalytics).toHaveBeenCalledWith('Chart Runtime Action', {
        action: 'Chart area clicked on runtime, drilldown is enabled',
        tablename: 'TestView',
      });
    });

    it('should fire analytics "Chart area clicked on drilldown view, drilldown is not enabled" when point clicked and expanded', async () => {
      const processAnalytics = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ processAnalytics }));

      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          viewName: 'TestView',
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
          expanded: true,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, category: 'Category1' },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      expect(processAnalytics).toHaveBeenCalledWith('Chart Runtime Action', {
        action: 'Chart area clicked on drilldown view, drilldown is not enabled',
        tablename: 'TestView',
      });
    });

    it('should update dataReducer via setChartSelectedPoint before executing action', async () => {
      const setChartSelectedPoint = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ setChartSelectedPoint }));

      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        id: 'chart_test',
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, category: 'Category1' },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      // Verify setChartSelectedPoint was called with correct params
      expect(setChartSelectedPoint).toHaveBeenCalledWith('chart_test', 0, 'Category1');
      // Verify both functions were called
      expect(setChartSelectedPoint).toHaveBeenCalled();
      expect(actionHandler.executeAction).toHaveBeenCalled();
      // Verify setChartSelectedPoint was called first (check call order)
      const setChartCallOrder = (setChartSelectedPoint as jest.Mock).mock.invocationCallOrder[0];
      const executeActionCallOrder = (actionHandler.executeAction as jest.Mock).mock.invocationCallOrder[0];
      expect(setChartCallOrder).toBeDefined();
      expect(executeActionCallOrder).toBeDefined();
      if (setChartCallOrder !== undefined && executeActionCallOrder !== undefined) {
        expect(setChartCallOrder).toBeLessThan(executeActionCallOrder);
      }
    });

    it('should update dataReducer with null when deselecting point', async () => {
      const setChartSelectedPoint = jest.fn();
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ setChartSelectedPoint }));

      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        id: 'chart_test',
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
          selectedPoint: 'Category1',
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, category: 'Category1', selected: true },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      // Verify setChartSelectedPoint was called with null to deselect
      expect(setChartSelectedPoint).toHaveBeenCalledWith('chart_test', 0, null);
    });

    it('should not call setChartSelectedPoint when it is not available in context', async () => {
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ setChartSelectedPoint: undefined }));

      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        id: 'chart_test',
        model: {
          ...createMockControl().model,
          drilldownEnabled: false,
          columns: [{ name: 'Category', fieldType: FieldTypeIds.Text, onClick: 'action1' }],
        },
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, category: 'Category1' },
        category: 'Category1',
      };

      await act(async () => {
        await result.current.handlePointClick(pointEvent as any);
      });

      // Action should still execute even without setChartSelectedPoint
      expect(actionHandler.executeAction).toHaveBeenCalled();
    });
  });

  describe('Row Click Handler', () => {
    it('should execute action handler when row is clicked', async () => {
      const actionHandler = createMockActionHandler();
      const control = createMockControl({ onRowClick: 'action1' });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      const rowEvent = {
        row: { RecordID: '123' },
        rowIndex: 0,
      };

      await act(async () => {
        await result.current.handleRowClick(rowEvent as any);
      });

      expect(actionHandler.executeAction).toHaveBeenCalled();
    });

    it('should call setChartSelectedRow and pass current screen recordId to executeAction (backend expects encrypted)', async () => {
      const setChartSelectedRow = jest.fn();
      const actionHandler = createMockActionHandler();
      const control = createMockControl({ onRowClick: 'action1', id: 'chart_1' });
      mockUseRuntimeContext.mockReturnValue(createMockRuntimeContext({ setChartSelectedRow }));

      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
          recordId: 'record_1',
        }),
      );

      const rowEvent = { RecordID: '456', rowIndex: 1 };

      await act(async () => {
        await result.current.handleRowClick(rowEvent as any);
      });

      expect(setChartSelectedRow).toHaveBeenCalledWith('chart_1', '456');
      // recordId param stays as current screen's activeRecordId (backend expects encrypted); clicked row is in ScreenState via setChartSelectedRow
      expect(actionHandler.executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          recordId: 'record_1',
          actionName: 'onRowClick',
        }),
      );
    });

    it('should not execute action handler when control has no onRowClick', async () => {
      const actionHandler = createMockActionHandler();
      const control = createMockControl({ onRowClick: undefined });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      const rowEvent = {
        row: { RecordID: '123' },
      };

      await act(async () => {
        await result.current.handleRowClick(rowEvent as any);
      });

      expect(actionHandler.executeAction).not.toHaveBeenCalled();
    });
  });

  describe('Click Handler', () => {
    it('should execute action handler when chart is clicked', async () => {
      const actionHandler = createMockActionHandler();
      const control = createMockControl({
        model: { ...createMockControl().model, drilldownEnabled: false },
        onEventClick: 'action1',
      });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          actionHandler,
        }),
      );

      await act(async () => {
        await result.current.handleClick();
      });

      expect(actionHandler.executeAction).toHaveBeenCalled();
    });

    it('should not execute action handler in designer mode', async () => {
      const actionHandler = createMockActionHandler();
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          mode: 'designer',
          actionHandler,
        }),
      );

      await act(async () => {
        await result.current.handleClick();
      });

      expect(actionHandler.executeAction).not.toHaveBeenCalled();
    });
  });

  describe('State Updates', () => {
    it('should update grid loading state', () => {
      const setGridIsLoading = jest.fn();
      const control = createMockControl({ model: { ...createMockControl().model, drilldownEnabled: true } });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          setGridIsLoading,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1' },
        category: 'Category1',
        series: 'Series1',
      };

      act(() => {
        result.current.handlePointClick(pointEvent as any);
      });

      expect(setGridIsLoading).toHaveBeenCalled();
    });

    it('should reset search string when point is clicked', () => {
      const setSearchString = jest.fn();
      const control = createMockControl({ model: { ...createMockControl().model, drilldownEnabled: true } });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          setSearchString,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1' },
        category: 'Category1',
        series: 'Series1',
      };

      act(() => {
        result.current.handlePointClick(pointEvent as any);
      });

      expect(setSearchString).toHaveBeenCalledWith(null);
    });

    it('should reset total record flag when point is clicked', () => {
      const setHasTotalRecord = jest.fn();
      const control = createMockControl({ model: { ...createMockControl().model, drilldownEnabled: true } });
      const { result } = renderHook(() =>
        useChartEventHandlers({
          ...defaultParams,
          control,
          setHasTotalRecord,
        }),
      );

      const pointEvent = {
        point: { x: 0, y: 0, name: 'Category1|Series1' },
        category: 'Category1',
        series: 'Series1',
      };

      act(() => {
        result.current.handlePointClick(pointEvent as any);
      });

      expect(setHasTotalRecord).toHaveBeenCalledWith(false);
    });
  });

  describe('Handler Stability', () => {
    it('should maintain stable handler references', () => {
      const { result, rerender } = renderHook(
        ({ control }) =>
          useChartEventHandlers({
            ...defaultParams,
            control,
          }),
        {
          initialProps: { control: createMockControl() },
        },
      );

      const handle1 = result.current.handlePointClick;
      const handle2 = result.current.handleClick;
      const handle3 = result.current.handleRowClick;

      rerender({ control: createMockControl({ id: 'chart_2' }) });

      expect(result.current.handlePointClick).toBe(handle1);
      expect(result.current.handleClick).toBe(handle2);
      expect(result.current.handleRowClick).toBe(handle3);
    });
  });
});
