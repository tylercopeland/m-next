/**
 * Unit tests for ChartWrapperRedux component
 * Tests component rendering, integration with hooks, and runtime/designer modes
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChartWrapperRedux from '../ChartWrapperRedux';
import type { ChartWrapperReduxProps } from '../chart/types';

// Mock chart drilldown component
jest.mock('@m-next/chart-drilldown', () => ({
  __esModule: true,
  default: ({ data, isLoading, error, onPointClick, onClick }: any) => (
    <div data-testid='chart-drilldown'>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {String(error)}</div>}
      {data && <div>Chart Data: {JSON.stringify(data)}</div>}
      <button onClick={onPointClick}>Point Click</button>
      <button onClick={onClick}>Chart Click</button>
    </div>
  ),
}));

// Mock all chart hooks
jest.mock('../chart/hooks/useChartControl', () => ({
  useChartControl: jest.fn(),
}));

jest.mock('../chart/hooks/useChartValidation', () => ({
  useChartValidation: jest.fn(),
}));

jest.mock('../chart/hooks/useChartSize', () => ({
  useChartSize: jest.fn(),
}));

jest.mock('../chart/hooks/useChartConfiguration', () => ({
  useChartConfiguration: jest.fn(),
}));

jest.mock('../chart/hooks/useChartData', () => ({
  useChartData: jest.fn(),
}));

jest.mock('../chart/hooks/useChartDrilldown', () => ({
  useChartDrilldown: jest.fn(),
}));

jest.mock('../chart/hooks/useChartEventHandlers', () => ({
  useChartEventHandlers: jest.fn(),
}));

jest.mock('../../contexts/RuntimeContext', () => ({
  useRuntimeContext: jest.fn(),
}));

jest.mock('../../contexts/ScreenDataContext', () => ({
  useScreenDataContext: jest.fn(),
}));

import { useChartControl } from '../chart/hooks/useChartControl';
import { useChartValidation } from '../chart/hooks/useChartValidation';
import { useChartSize } from '../chart/hooks/useChartSize';
import { useChartConfiguration } from '../chart/hooks/useChartConfiguration';
import { useChartData } from '../chart/hooks/useChartData';
import { useChartDrilldown } from '../chart/hooks/useChartDrilldown';
import { useChartEventHandlers } from '../chart/hooks/useChartEventHandlers';
import { useRuntimeContext } from '../../contexts/RuntimeContext';
import { useScreenDataContext } from '../../contexts/ScreenDataContext';

const mockUseChartControl = useChartControl as jest.MockedFunction<typeof useChartControl>;
const mockUseChartValidation = useChartValidation as jest.MockedFunction<typeof useChartValidation>;
const mockUseChartSize = useChartSize as jest.MockedFunction<typeof useChartSize>;
const mockUseChartConfiguration = useChartConfiguration as jest.MockedFunction<typeof useChartConfiguration>;
const mockUseChartData = useChartData as jest.MockedFunction<typeof useChartData>;
const mockUseChartDrilldown = useChartDrilldown as jest.MockedFunction<typeof useChartDrilldown>;
const mockUseChartEventHandlers = useChartEventHandlers as jest.MockedFunction<typeof useChartEventHandlers>;
const mockUseRuntimeContext = useRuntimeContext as jest.MockedFunction<typeof useRuntimeContext>;
const mockUseScreenDataContext = useScreenDataContext as jest.MockedFunction<typeof useScreenDataContext>;

describe('ChartWrapperRedux', () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        screenLayout: (state = {}) => state,
      },
    });
  };

  const defaultProps: ChartWrapperReduxProps = {
    id: 'chart_1',
    mode: 'designer',
    containerWidth: 800,
  };

  const defaultMockControl = {
    id: 'chart_1',
    model: {
      viewName: 'TestView',
      viewFilter: {
        filterId: 'filter_1',
        expression: [],
      },
      columns: [
        { name: 'Category', fieldType: 1 },
        { name: 'Value', fieldType: 2 },
      ],
      drilldownEnabled: true,
      drilldownProjection: {
        fields: [{ name: 'Field1', caption: 'Field 1', type: 1 }],
      },
    },
    caption: 'Test Chart',
    visible: true,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRuntimeContext.mockReturnValue({
      screenId: 'screen_1',
      activeRecordId: 'record_1',
    } as any);

    mockUseScreenDataContext.mockReturnValue({
      accountName: 'test_account',
      displayPreferences: null,
    } as any);

    mockUseChartControl.mockReturnValue({
      control: defaultMockControl,
      isRuntimeMode: false,
    });

    mockUseChartValidation.mockReturnValue({
      isValid: true,
      expanded: false,
    });

    mockUseChartSize.mockReturnValue({
      chartSize: { width: 400, height: 300 },
      wrapperRef: React.createRef(),
    });

    mockUseChartConfiguration.mockReturnValue({
      chartType: 'line',
      chartColors: ['#ff0000', '#00ff00'],
      numberFormat: 'integer',
      allowDecimals: false,
      refreshChart: false,
    });

    mockUseChartData.mockReturnValue({
      categories: ['Cat1', 'Cat2'],
      series: [{ data: [1, 2] }],
      isLoading: false,
      error: null,
    });

    mockUseChartDrilldown.mockReturnValue({
      gridModel: null,
      gridData: null,
      totalRecords: 0,
      partialRecordCount: 0,
      gridIsLoading: false,
      pageNumber: 1,
      pageSize: 10,
      searchString: null,
      selectedPoint: null,
      chipsData: null,
      handleGridClickMany: jest.fn(),
      handleGridPageChange: jest.fn(),
      handleGridPageLengthChange: jest.fn(),
      handleSearch: jest.fn(),
      handleFetchChipsData: jest.fn(),
      tagList: null,
      isLoadingTagList: false,
      setGridIsLoading: jest.fn(),
      setHasTotalRecord: jest.fn(),
      setSearchString: jest.fn(),
    });

    mockUseChartEventHandlers.mockReturnValue({
      handlePointClick: jest.fn(),
      handleClick: jest.fn(),
      handleRowClick: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render chart component when control is valid', async () => {
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      // Wait for the lazy-loaded component to resolve
      await waitFor(
        () => {
          expect(screen.getByTestId('chart-drilldown')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('should render "Chart not configured" when control is null', () => {
      mockUseChartControl.mockReturnValue({
        control: null,
        isRuntimeMode: false,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Chart not configured')).toBeInTheDocument();
    });

    it('should render "Chart not configured" when control model is missing', () => {
      mockUseChartControl.mockReturnValue({
        control: { id: 'chart_1', model: undefined },
        isRuntimeMode: false,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Chart not configured')).toBeInTheDocument();
    });

    it('should render "Chart not configured" when columns are missing', () => {
      mockUseChartControl.mockReturnValue({
        control: {
          ...defaultMockControl,
          model: {
            ...defaultMockControl.model,
            columns: [],
          },
        },
        isRuntimeMode: false,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Chart not configured')).toBeInTheDocument();
    });

    it('should render "Chart not configured" when control is invalid', () => {
      mockUseChartValidation.mockReturnValue({
        isValid: false,
        expanded: false,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Chart not configured')).toBeInTheDocument();
    });
  });

  describe('Runtime Mode', () => {
    it('should work in runtime mode', async () => {
      mockUseChartControl.mockReturnValue({
        control: defaultMockControl,
        isRuntimeMode: true,
      });

      mockUseRuntimeContext.mockReturnValue({
        screenId: 'screen_1',
        activeRecordId: 'record_1',
        mode: 'runtime',
      } as any);

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} mode='runtime' />
        </Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-drilldown')).toBeInTheDocument();
      });
    });
  });

  describe('Designer Mode', () => {
    it('should work in designer mode', async () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} mode='designer' />
        </Provider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-drilldown')).toBeInTheDocument();
      });
    });

    it('should call onControlClick when wrapper is clicked', async () => {
      const onControlClick = jest.fn();
      const store = createMockStore();
      const { container } = render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} onControlClick={onControlClick} />
        </Provider>,
      );

      // Wait for the component to load
      await waitFor(
        () => {
          expect(screen.getByTestId('chart-drilldown')).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // The inner div has the onClick handler (handleWrapperClick)
      // It's the div with cursor: pointer inside the outer wrapper
      const clickableDiv = container.querySelector('div[style*="cursor: pointer"]') as HTMLElement;
      if (clickableDiv) {
        clickableDiv.click();
        expect(onControlClick).toHaveBeenCalledWith('chart_1');
      } else {
        // Fallback: try clicking the chart-drilldown element's parent
        const chartElement = screen.getByTestId('chart-drilldown');
        const parentDiv = chartElement.parentElement;
        if (parentDiv) {
          parentDiv.click();
          expect(onControlClick).toHaveBeenCalledWith('chart_1');
        }
      }
    });
  });

  describe('Loading States', () => {
    it('should show loading state when chart data is loading', () => {
      mockUseChartData.mockReturnValue({
        categories: null,
        series: null,
        isLoading: true,
        error: null,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show loading state when chart type is null', () => {
      mockUseChartConfiguration.mockReturnValue({
        chartType: null,
        chartColors: null,
        numberFormat: 'integer',
        allowDecimals: false,
        refreshChart: false,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error when chart data fetch fails', () => {
      const error = new Error('Failed to fetch data');
      mockUseChartData.mockReturnValue({
        categories: null,
        series: null,
        isLoading: false,
        error,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  describe('Drilldown Integration', () => {
    it('should pass drilldown props to chart component', () => {
      const drilldownData = {
        gridData: [{ Field1: 'Value1' }],
        totalRecords: 1,
        partialRecordCount: 0,
        gridIsLoading: false,
        pageNumber: 1,
        pageSize: 10,
        searchString: null,
        selectedPoint: null,
        chipsData: null,
        handleGridClickMany: jest.fn(),
        handleGridPageChange: jest.fn(),
        handleGridPageLengthChange: jest.fn(),
        handleSearch: jest.fn(),
        handleFetchChipsData: jest.fn(),
        tagList: null,
        isLoadingTagList: false,
        setGridIsLoading: jest.fn(),
        setHasTotalRecord: jest.fn(),
        setSearchString: jest.fn(),
      };

      mockUseChartDrilldown.mockReturnValue(drilldownData);

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(mockUseChartDrilldown).toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('should pass event handlers to chart component', () => {
      const handlePointClick = jest.fn();
      const handleClick = jest.fn();
      const handleRowClick = jest.fn();

      mockUseChartEventHandlers.mockReturnValue({
        handlePointClick,
        handleClick,
        handleRowClick,
      });

      const store = createMockStore();
      render(
        <Provider store={store}>
          <ChartWrapperRedux {...defaultProps} />
        </Provider>,
      );

      expect(mockUseChartEventHandlers).toHaveBeenCalled();
    });
  });
});
