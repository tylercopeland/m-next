/**
 * Unit tests for GridWrapperRedux
 *
 * Focus: Context usage and callback functionality with minimal mocking.
 * Tests verify that the component correctly interacts with:
 * - RuntimeContext (runtime mode)
 * - ScreenDataContext (dirty state, dialogs)
 * - DesignerContext (designer mode)
 *
 * @module wrappers/__tests__/GridWrapperRedux.test
 */

import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock ResizeObserver which is not available in jsdom
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Create mock component functions that will be defined after imports
const mockGridComponent = jest.fn();

// Mock the Grid component since it's lazy-loaded and complex
jest.mock('@m-next/grid', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => mockGridComponent(props),
  STATUSES: { blank: 0, new: 1, modified: 2 },
  GridEventNames: {
    GridRefresh: 0,
    SortChanged: 1,
    PageChanged: 2,
    PageSizeChanged: 3,
    SettingChanged: 4,
    ActiveRowChanged: 5,
    FilterChanged: 6,
    ParentChanged: 7,
    GridLinkClicked: 8,
    RowChecked: 9,
    SearchClicked: 10,
    AdvancedSearch: 11,
    VisibleColumnsChanged: 12,
  },
}));

// Mock MaliciousChecksContext
jest.mock('@m-next/grid/src/components/MaliciousChecksContext', () => {
  const mockReact = jest.requireActual('react');
  return {
    __esModule: true,
    default: mockReact.createContext(false),
  };
});

// Mock LoadingSkeleton
jest.mock('@m-next/loading-skeleton', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock Button
jest.mock('@m-next/button', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const mockReact = jest.requireActual('react');
    return mockReact.createElement('button', props, props.children || props.value);
  },
}));

// Mock utilities - use actual implementation for hooks
jest.mock('@m-next/utilities', () => {
  const actual = jest.requireActual('@m-next/utilities');
  return {
    ...actual,
    Guid: {
      create: () => 'test-guid-123',
      empty: () => '00000000-0000-0000-0000-000000000000',
    },
    interactions: {
      preventPropagation: jest.fn(),
    },
    toCamelCase: (obj: unknown) => obj,
  };
});

// Mock types
jest.mock('@m-next/types', () => ({
  complexValueTypes: { Field: 'field' },
  FieldTypeIds: {
    Button: 'button',
    CardColumn: 'cardColumn',
    DropDown: 'dropdown',
    Decimal: 'decimal',
    Integer: 'integer',
    Money: 'money',
    DateTime: 'datetime',
    Text: 'text',
  },
}));

// Mock xss
jest.mock('xss', () => ({
  __esModule: true,
  default: (str: string) => str,
}));

// Import contexts and component after mocks
import { RuntimeContextProvider } from '../../contexts/RuntimeContext';
import { ScreenDataContextProvider } from '../../contexts/ScreenDataContext';
import { DesignerContextProvider } from '../../contexts/DesignerContext';
import GridWrapperRedux from '../GridWrapperRedux';

// Setup the mock Grid component implementation
beforeEach(() => {
  mockGridComponent.mockImplementation((props: Record<string, unknown>) => {
    const {
      onPageChange,
      onPageLengthChange,
      onChangeView,
      onChangeColumnSorting,
      onRefresh,
      onAddRows,
      onDelete,
      onSelect,
      onGridSearch,
      onExport,
      onRowClick,
      data,
      columns,
      selectedView,
      pageNumber,
      pageSize,
    } = props as {
      onPageChange?: (page: number) => void;
      onPageLengthChange?: (size: number) => void;
      onChangeView?: (view: string, flag: boolean, extra: unknown) => void;
      onChangeColumnSorting?: (field: string, direction: number) => void;
      onRefresh?: () => void;
      onAddRows?: () => void;
      onDelete?: (rowIdx: number, recordId: string) => void;
      onSelect?: (recordId: string, rowIdx: number, selected: boolean) => void;
      onGridSearch?: (search: string) => void;
      onExport?: () => void;
      onRowClick?: (row: Record<string, unknown>, idx: number, a: unknown, b: unknown, recordId: string) => void;
      data?: unknown;
      columns?: unknown[];
      selectedView?: string;
      pageNumber?: number;
      pageSize?: number;
    };

    return React.createElement(
      'div',
      { 'data-testid': 'mock-grid' },
      React.createElement('button', { 'data-testid': 'page-change', onClick: () => onPageChange?.(2) }, 'Page Change'),
      React.createElement(
        'button',
        { 'data-testid': 'page-length-change', onClick: () => onPageLengthChange?.(25) },
        'Page Length',
      ),
      React.createElement(
        'button',
        { 'data-testid': 'view-change', onClick: () => onChangeView?.('view-2', false, null) },
        'View Change',
      ),
      React.createElement(
        'button',
        { 'data-testid': 'sort-change', onClick: () => onChangeColumnSorting?.('Name', 1) },
        'Sort',
      ),
      React.createElement('button', { 'data-testid': 'refresh', onClick: () => onRefresh?.() }, 'Refresh'),
      React.createElement('button', { 'data-testid': 'add-rows', onClick: () => onAddRows?.() }, 'Add Rows'),
      React.createElement('button', { 'data-testid': 'delete-row', onClick: () => onDelete?.(0, '123') }, 'Delete Row'),
      React.createElement('button', { 'data-testid': 'select', onClick: () => onSelect?.('123', 0, true) }, 'Select'),
      React.createElement(
        'button',
        { 'data-testid': 'search', onClick: () => onGridSearch?.('test search') },
        'Search',
      ),
      React.createElement('button', { 'data-testid': 'export', onClick: () => onExport?.() }, 'Export'),
      React.createElement(
        'button',
        { 'data-testid': 'row-click', onClick: () => onRowClick?.({ RecordID: '123' }, 0, null, null, '123') },
        'Row Click',
      ),
      React.createElement('div', { 'data-testid': 'grid-data' }, JSON.stringify(data)),
      React.createElement('div', { 'data-testid': 'grid-columns' }, JSON.stringify((columns as unknown[])?.length)),
      React.createElement('div', { 'data-testid': 'selected-view' }, selectedView),
      React.createElement('div', { 'data-testid': 'page-number' }, pageNumber),
      React.createElement('div', { 'data-testid': 'page-size' }, pageSize),
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

// Test data fixtures
const createMockControl = (overrides = {}) => ({
  id: 'grid-1',
  name: 'TestGrid',
  type: 'grid',
  caption: 'Test Grid',
  visible: true,
  disabled: false,
  isReadOnly: false,
  isSearchable: true,
  isSelectable: true,
  isCustomViewEnabled: false,
  showDeleteColumn: true,
  showDeleteConfirmation: true,
  canAddMoreRows: true,
  addLabel: 'Add Row',
  newRowsCount: 1,
  showRefresh: true,
  showExport: true,
  showSort: true,
  showShowHideColumns: true,
  canReorderColumns: true,
  hideViewSelector: false,
  hideCaption: false,
  showVerticalDividers: true,
  isResponsive: true,
  selectAll: false,
  componentVersion: '1.0.0',
  viewFilter: 'view-1',
  defaultViewFilter: 'view-1',
  searchString: '',
  searchFilter: null,
  paging: { pageNumber: 1, pageSize: 10, totalRows: 0 },
  sorting: null,
  selectionInfo: { allExcept: false, recordIDs: [] },
  selectedRows: [],
  viewList: [
    {
      id: 'view-1',
      name: 'Default View',
      isVisible: true,
      columns: [
        { field: 'RecordID', visible: true },
        { field: 'Name', visible: true },
      ],
    },
    {
      id: 'view-2',
      name: 'Second View',
      isVisible: true,
      columns: [
        { field: 'RecordID', visible: true },
        { field: 'Name', visible: true },
      ],
    },
  ],
  columns: [
    {
      field: 'RecordID',
      header: 'ID',
      fieldType: 'integer',
      showOnMobile: true,
      hasColumnTotal: false,
      readOnly: true,
      format: {
        alignment: 'left',
        headerAlignment: 'left',
        type: 'number',
        width: 100,
      },
    },
    {
      field: 'Name',
      header: 'Name',
      fieldType: 'text',
      showOnMobile: true,
      hasColumnTotal: false,
      readOnly: false,
      format: {
        alignment: 'left',
        headerAlignment: 'left',
        type: 'text',
        width: 200,
      },
    },
  ],
  model: {
    customViews: [],
    sharedViews: [],
  },
  ...overrides,
});

const createMockGridData = () => ({
  rows: [
    [
      { name: 'RecordID', value: '1', text: '1' },
      { name: 'Name', value: 'Test Item 1', text: 'Test Item 1' },
    ],
    [
      { name: 'RecordID', value: '2', text: '2' },
      { name: 'Name', value: 'Test Item 2', text: 'Test Item 2' },
    ],
  ],
  status: [0, 0],
  count: 2,
  totalRows: 2,
  partialRowCount: 0,
  newRow: null,
});

describe('GridWrapperRedux', () => {
  describe('Runtime Mode - Context Callbacks', () => {
    const createRuntimeWrapper = (
      runtimeContextProps: Record<string, unknown> = {},
      screenDataContextProps: Record<string, unknown> = {},
    ) => {
      const defaultRuntimeProps = {
        screenKey: 'test-screen-key',
        screenId: 'test-screen-id',
        activeRecordId: 'test-record-id',
        controls: { 'grid-1': createMockControl() },
        dataReducer: { 'grid-1': createMockGridData() },
        onLoadGridData: jest.fn(),
        onBulkUpdateControls: jest.fn(),
        onShowMessageDialog: jest.fn(),
        onDeleteGridRow: jest.fn(),
        onUpdateGridRowStatus: jest.fn(),
        onQueueDataTableExport: jest.fn(),
        onProcessAnalytics: jest.fn(),
        onClearChipData: jest.fn(),
        onUpdateGridCell: jest.fn(),
        onBulkAddGridRows: jest.fn(),
        ...runtimeContextProps,
      };

      const defaultScreenDataProps = {
        isDirty: false,
        setIsDirty: jest.fn(),
        featureFlags: {},
        displayPreferences: {},
        ...screenDataContextProps,
      };

      return ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider {...defaultRuntimeProps}>
          <ScreenDataContextProvider {...defaultScreenDataProps}>{children}</ScreenDataContextProvider>
        </RuntimeContextProvider>
      );
    };

    it('should call loadGridData on mount in runtime mode', async () => {
      const onLoadGridData = jest.fn();
      const Wrapper = createRuntimeWrapper({ onLoadGridData });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(onLoadGridData).toHaveBeenCalled();
      });
    });

    it('should call bulkUpdateControls when page changes', async () => {
      const onBulkUpdateControls = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('page-change'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([expect.objectContaining({ property: 'paging.pageNumber', value: 2 })]),
        );
      });
    });

    it('should call bulkUpdateControls when page size changes', async () => {
      const onBulkUpdateControls = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('page-length-change'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([expect.objectContaining({ property: 'paging.pageSize', value: 25 })]),
        );
      });
    });

    it('should call bulkUpdateControls when view changes', async () => {
      const onBulkUpdateControls = jest.fn();
      const onProcessAnalytics = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls, onProcessAnalytics });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('view-change'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([expect.objectContaining({ property: 'viewFilter', value: 'view-2' })]),
        );
      });
    });

    it('should call bulkUpdateControls when sorting changes', async () => {
      const onBulkUpdateControls = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('sort-change'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([
            expect.objectContaining({
              property: 'sorting',
              value: expect.objectContaining({ sortField: 'Name', sortType: 1 }),
            }),
          ]),
        );
      });
    });

    it('should call loadGridData when refresh is clicked', async () => {
      const onLoadGridData = jest.fn();
      const Wrapper = createRuntimeWrapper({ onLoadGridData });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      // Clear the initial load call
      onLoadGridData.mockClear();

      await act(async () => {
        fireEvent.click(screen.getByTestId('refresh'));
      });

      await waitFor(() => {
        expect(onLoadGridData).toHaveBeenCalled();
      });
    });

    it('should call deleteGridRow when delete is triggered', async () => {
      const onDeleteGridRow = jest.fn();
      const Wrapper = createRuntimeWrapper({ onDeleteGridRow });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('delete-row'));
      });

      await waitFor(() => {
        expect(onDeleteGridRow).toHaveBeenCalledWith('test-screen-key', 'grid-1', 0, false);
      });
    });

    it('should call bulkUpdateControls when row is selected', async () => {
      const onBulkUpdateControls = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('select'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([expect.objectContaining({ property: 'selectionInfo.recordIDs' })]),
        );
      });
    });

    it('should call bulkUpdateControls when search is triggered', async () => {
      const onBulkUpdateControls = jest.fn();
      const Wrapper = createRuntimeWrapper({ onBulkUpdateControls });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('search'));
      });

      await waitFor(() => {
        expect(onBulkUpdateControls).toHaveBeenCalledWith(
          'test-screen-key',
          expect.arrayContaining([expect.objectContaining({ property: 'searchString', value: 'test search' })]),
        );
      });
    });

    it('should call queueDataTableExport when export is clicked', async () => {
      const onQueueDataTableExport = jest.fn();
      const Wrapper = createRuntimeWrapper({ onQueueDataTableExport });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('export'));
      });

      await waitFor(() => {
        expect(onQueueDataTableExport).toHaveBeenCalled();
      });
    });

    it('should call bulkAddGridRows when add rows is clicked', async () => {
      const onBulkAddGridRows = jest.fn();
      const mockControl = createMockControl();
      const mockGridData = {
        ...createMockGridData(),
        newRow: [
          { name: 'RecordID', value: '-1', text: '' },
          { name: 'Name', value: '', text: '' },
        ],
      };

      const Wrapper = createRuntimeWrapper({
        onBulkAddGridRows,
        dataReducer: { 'grid-1': mockGridData },
      });

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={mockControl} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('add-rows'));
      });

      await waitFor(() => {
        expect(onBulkAddGridRows).toHaveBeenCalledWith('test-screen-key', 'grid-1', expect.any(Array));
      });
    });
  });

  describe('Runtime Mode - Dirty State Handling', () => {
    it('should show message dialog when changing page while dirty', async () => {
      const onShowMessageDialog = jest.fn();
      const onBulkUpdateControls = jest.fn();
      const setIsDirty = jest.fn();

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider
          screenKey='test-screen-key'
          screenId='test-screen-id'
          activeRecordId='test-record-id'
          controls={{ 'grid-1': createMockControl() }}
          dataReducer={{ 'grid-1': createMockGridData() }}
          onLoadGridData={jest.fn()}
          onBulkUpdateControls={onBulkUpdateControls}
          onShowMessageDialog={onShowMessageDialog}
        >
          <ScreenDataContextProvider isDirty={true} setIsDirty={setIsDirty} featureFlags={{}}>
            {children}
          </ScreenDataContextProvider>
        </RuntimeContextProvider>
      );

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('page-change'));
      });

      await waitFor(() => {
        expect(onShowMessageDialog).toHaveBeenCalledWith(
          expect.objectContaining({
            heading: 'Are you sure?',
            message: expect.stringContaining('save'),
          }),
        );
      });
    });

    it('should show message dialog when exporting while dirty', async () => {
      const onShowMessageDialog = jest.fn();
      const setIsDirty = jest.fn();

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider
          screenKey='test-screen-key'
          screenId='test-screen-id'
          activeRecordId='test-record-id'
          controls={{ 'grid-1': createMockControl() }}
          dataReducer={{ 'grid-1': createMockGridData() }}
          onLoadGridData={jest.fn()}
          onBulkUpdateControls={jest.fn()}
          onShowMessageDialog={onShowMessageDialog}
          onQueueDataTableExport={jest.fn()}
        >
          <ScreenDataContextProvider isDirty={true} setIsDirty={setIsDirty} featureFlags={{}}>
            {children}
          </ScreenDataContextProvider>
        </RuntimeContextProvider>
      );

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('export'));
      });

      await waitFor(() => {
        expect(onShowMessageDialog).toHaveBeenCalledWith(
          expect.objectContaining({
            heading: 'Are you sure?',
            message: expect.stringContaining('export'),
          }),
        );
      });
    });

    it('should set isDirty when deleting an existing row', async () => {
      const setIsDirty = jest.fn();
      const onDeleteGridRow = jest.fn();

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider
          screenKey='test-screen-key'
          screenId='test-screen-id'
          activeRecordId='test-record-id'
          controls={{ 'grid-1': createMockControl() }}
          dataReducer={{ 'grid-1': createMockGridData() }}
          onLoadGridData={jest.fn()}
          onBulkUpdateControls={jest.fn()}
          onShowMessageDialog={jest.fn()}
          onDeleteGridRow={onDeleteGridRow}
        >
          <ScreenDataContextProvider isDirty={false} setIsDirty={setIsDirty} featureFlags={{}}>
            {children}
          </ScreenDataContextProvider>
        </RuntimeContextProvider>
      );

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('delete-row'));
      });

      await waitFor(() => {
        expect(setIsDirty).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('Grid Not Configured State', () => {
    it('should show "Grid not configured" when control has no columns', async () => {
      const mockControl = createMockControl({ columns: [] });

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider
          screenKey='test-screen-key'
          screenId='test-screen-id'
          activeRecordId='test-record-id'
          controls={{ 'grid-1': mockControl }}
          dataReducer={{}}
          onLoadGridData={jest.fn()}
          onBulkUpdateControls={jest.fn()}
        >
          <ScreenDataContextProvider isDirty={false} setIsDirty={jest.fn()} featureFlags={{}}>
            {children}
          </ScreenDataContextProvider>
        </RuntimeContextProvider>
      );

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={mockControl} mode='runtime' />
          </Wrapper>,
        );
      });

      expect(screen.getByText('Grid not configured')).toBeInTheDocument();
    });
  });

  describe('Data Processing', () => {
    it('should process grid data correctly from runtime context', async () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <RuntimeContextProvider
          screenKey='test-screen-key'
          screenId='test-screen-id'
          activeRecordId='test-record-id'
          controls={{ 'grid-1': createMockControl() }}
          dataReducer={{ 'grid-1': createMockGridData() }}
          onLoadGridData={jest.fn()}
          onBulkUpdateControls={jest.fn()}
        >
          <ScreenDataContextProvider isDirty={false} setIsDirty={jest.fn()} featureFlags={{}}>
            {children}
          </ScreenDataContextProvider>
        </RuntimeContextProvider>
      );

      await act(async () => {
        render(
          <Wrapper>
            <GridWrapperRedux id='grid-1' control={createMockControl()} mode='runtime' />
          </Wrapper>,
        );
      });

      await waitFor(() => {
        const gridData = screen.getByTestId('grid-data');
        expect(gridData).toBeInTheDocument();
        // Verify data was processed and passed to Grid
        const dataContent = gridData.textContent;
        expect(dataContent).toContain('Test Item 1');
      });
    });
  });

  describe('Designer Mode', () => {
    it('should render in designer mode with designer context', async () => {
      const selectControlById = jest.fn().mockReturnValue(createMockControl());
      const onLoadGridData = jest.fn().mockReturnValue({
        data: createMockGridData(),
        error: null,
        isFetching: false,
        refetch: jest.fn(),
      });

      await act(async () => {
        render(
          <DesignerContextProvider
            selectedControlId='grid-1'
            screenId='test-screen-id'
            activeRecordId='test-record-id'
            selectControlById={selectControlById}
            onLoadGridData={onLoadGridData}
          >
            <ScreenDataContextProvider isDirty={false} setIsDirty={jest.fn()} featureFlags={{}}>
              <GridWrapperRedux id='grid-1' mode='designer' />
            </ScreenDataContextProvider>
          </DesignerContextProvider>,
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
      });

      // Verify that selectControlById was called to get the control
      expect(selectControlById).toHaveBeenCalledWith('grid-1');
    });
  });
});
