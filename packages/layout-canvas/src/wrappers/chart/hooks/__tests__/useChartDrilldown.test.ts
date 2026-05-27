/**
 * Unit tests for useChartDrilldown hook
 * Tests drilldown functionality (no direct app-builder/@m-next/types imports; uses injected APIs via context/params)
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useChartDrilldown } from '../useChartDrilldown';
import type { ChartControl } from '../../types';

jest.mock('../../../../contexts/DesignerContext', () => ({
  useDesignerContext: jest.fn(),
}));

import { useDesignerContext } from '../../../../contexts/DesignerContext';

const mockUseDesignerContext = useDesignerContext as jest.MockedFunction<typeof useDesignerContext>;

const FIELD_TYPE_TEXT = 0;
const FIELD_TYPE_INTEGER = 1;

describe('useChartDrilldown', () => {
  const createMockControl = (overrides?: Partial<ChartControl>): ChartControl => ({
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [],
      },
      drilldownEnabled: true,
      drilldownProjection: {
        fields: [
          { name: 'Field1', caption: 'Field 1', type: FIELD_TYPE_TEXT },
          { name: 'Field2', caption: 'Field 2', type: FIELD_TYPE_INTEGER },
        ],
        sorting: [],
      },
    },
    ...overrides,
  });

  const defaultChartFieldTypes = {
    fieldTypeIds: { Integer: 1, DropDown: 2 },
    fieldTypeIdLookup: (id: number) => id,
  };

  const defaultParams = {
    control: createMockControl(),
    isRuntimeMode: false,
    isValid: true,
    expanded: true,
    selectedPoint: null,
    setSelectedPoint: jest.fn(),
  };

  const createDefaultDesignerDrilldown = (overrides?: any) => ({
    gridDataResult: { data: null, isFetching: false },
    totalRecordsMutation: jest.fn().mockResolvedValue({ unwrap: () => Promise.resolve(0) }),
    chipsDataResult: { data: null },
    tagSuggestionsResult: { data: null, isLoading: false },
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDesignerContext.mockReturnValue({
      activeRecordId: 'record_1',
      screenId: 'screen_1',
      chartFieldTypes: defaultChartFieldTypes,
      designerDrilldownResults: null,
      setDesignerDrilldownRequest: jest.fn(),
    } as any);
  });

  describe('Runtime vs Designer', () => {
    it('should provide fallback values when in runtime mode', () => {
      const { result } = renderHook(() => useChartDrilldown({ ...defaultParams, isRuntimeMode: true }));

      expect(result.current.gridData).toBeNull();
      expect(result.current.totalRecords).toBe(0);
      expect(result.current.gridIsLoading).toBe(true);
      expect(result.current.tagList).toBeNull();
      expect(result.current.isLoadingTagList).toBe(false);
    });

    it('should use injected designerDrilldown when provided', async () => {
      const mockGridData = {
        dataSource: [
          {
            cells: [
              { name: 'Field1', value: 'Value1', text: 'Value1' },
              { name: 'Field2', value: 100, text: '100' },
            ],
          },
        ],
        totalRows: 1,
        partialRowCount: 1,
      };
      const stableDrilldown = createDefaultDesignerDrilldown({
        gridDataResult: { data: mockGridData, isFetching: false },
      });

      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDrilldown,
        }),
      );

      await waitFor(() => {
        expect(result.current.gridData).not.toBeNull();
        expect(result.current.gridData).toHaveLength(1);
      });
      expect(result.current.gridData?.[0]?.Field1).toBe('Value1');
      expect(result.current.gridData?.[0]?.Field2).toBe(100);
      expect(result.current.totalRecords).toBe(1);
    });
  });

  describe('Grid Data Management', () => {
    it('should process grid data from injected designerDrilldown', async () => {
      const mockGridData = {
        dataSource: [
          {
            cells: [
              { name: 'Field1', value: 'Value1', text: 'Value1' },
              { name: 'Field2', value: 100, text: '100' },
            ],
          },
        ],
        totalRows: 1,
        partialRowCount: 1,
      };
      const stableDrilldown = createDefaultDesignerDrilldown({
        gridDataResult: { data: mockGridData, isFetching: false },
      });

      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDrilldown,
        }),
      );

      await waitFor(() => {
        expect(result.current.gridData).not.toBeNull();
      });

      expect(result.current.gridData).toHaveLength(1);
      expect(result.current.gridData?.[0]?.Field1).toBe('Value1');
      expect(result.current.gridData?.[0]?.Field2).toBe(100);
      expect(result.current.totalRecords).toBe(1);
    });

    it('should reset grid data when expanded changes to false', () => {
      const mockGridData = {
        dataSource: [{ cells: [{ name: 'Field1', value: 'Value1' }] }],
        totalRows: 1,
        partialRowCount: 1,
      };
      const stableDrilldown = createDefaultDesignerDrilldown({
        gridDataResult: { data: mockGridData, isFetching: false },
      });

      const { result, rerender } = renderHook(
        ({ expanded }: { expanded: boolean }) =>
          useChartDrilldown({
            ...defaultParams,
            expanded,
            designerDrilldown: stableDrilldown,
          }),
        { initialProps: { expanded: true } },
      );

      expect(result.current.gridData).not.toBeNull();

      rerender({ expanded: false });

      expect(result.current.gridData).toBeNull();
      expect(result.current.searchString).toBeNull();
      expect(result.current.pageNumber).toBe(1);
    });
  });

  describe('Pagination', () => {
    const stableDefaultDrilldown = createDefaultDesignerDrilldown();

    it('should handle page changes', () => {
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDefaultDrilldown,
        }),
      );

      expect(result.current.pageNumber).toBe(1);
      expect(result.current.pageSize).toBe(10);

      act(() => {
        result.current.handleGridPageChange(2);
      });
      expect(result.current.pageNumber).toBe(2);
      expect(result.current.gridIsLoading).toBe(true);
    });

    it('should handle page size changes', () => {
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDefaultDrilldown,
        }),
      );

      act(() => {
        result.current.handleGridPageLengthChange(25);
      });
      expect(result.current.pageSize).toBe(25);
      expect(result.current.gridIsLoading).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    const stableDefaultDrilldown = createDefaultDesignerDrilldown();

    it('should handle search string changes', () => {
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDefaultDrilldown,
        }),
      );

      act(() => {
        result.current.handleSearch('test query');
      });
      expect(result.current.searchString).toBe('test query');
      expect(result.current.pageNumber).toBe(1);
      expect(result.current.gridIsLoading).toBe(true);
    });
  });

  describe('Chips Data', () => {
    it('should process chips data from injected designerDrilldown', () => {
      const stableDrilldown = createDefaultDesignerDrilldown({
        chipsDataResult: { data: { dataSource: [{ value: 'chip1' }, { value: 'chip2' }] } },
      });
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDrilldown,
        }),
      );

      expect(result.current.chipsData).not.toBeNull();
      expect(Array.isArray(result.current.chipsData)).toBe(true);
    });

    it('should update chips query params when handleFetchChipsData is called', () => {
      const stableDrilldown = createDefaultDesignerDrilldown();
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDrilldown,
        }),
      );

      act(() => {
        result.current.handleFetchChipsData('Field1', 'search');
      });

      expect(result.current.chipsData).toBeDefined();
    });
  });

  describe('Tag Suggestions', () => {
    it('should use tag list from injected designerDrilldown', () => {
      const mockTags = {
        others: [
          { name: 'Tag1', colour: '#ff0000' },
          { name: 'Tag2', colour: '#00ff00' },
        ],
      };
      const stableDrilldown = createDefaultDesignerDrilldown({
        tagSuggestionsResult: { data: mockTags, isLoading: false },
      });
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDrilldown,
        }),
      );

      expect(result.current.tagList).toEqual(mockTags.others);
      expect(result.current.isLoadingTagList).toBe(false);
    });

    it('should return null for tags in runtime mode', () => {
      const { result } = renderHook(() => useChartDrilldown({ ...defaultParams, isRuntimeMode: true }));

      expect(result.current.tagList).toBeNull();
    });
  });

  describe('Grid Model Building', () => {
    const stableDefaultDrilldown = createDefaultDesignerDrilldown();

    it('should build grid model with correct projection columns using chartFieldTypes from context', () => {
      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          designerDrilldown: stableDefaultDrilldown,
        }),
      );

      expect(result.current.gridModel).not.toBeNull();
      expect(result.current.gridModel?.columns).toHaveLength(3);
      expect(result.current.gridModel?.columns?.[0]?.name).toBe('Field1');
      expect(result.current.gridModel?.columns?.[1]?.name).toBe('Field2');
      expect(result.current.gridModel?.columns?.[2]?.name).toBe('RecordID');
      expect(result.current.gridModel?.columns?.[2]?.visible).toBe(false);
    });

    it('should return null grid model when control has no drilldown fields', () => {
      const invalidControl = createMockControl();
      invalidControl.model!.drilldownProjection!.fields = [];

      const { result } = renderHook(() =>
        useChartDrilldown({
          ...defaultParams,
          control: invalidControl,
          designerDrilldown: stableDefaultDrilldown,
        }),
      );

      expect(result.current.gridModel).toBeNull();
    });
  });
});
