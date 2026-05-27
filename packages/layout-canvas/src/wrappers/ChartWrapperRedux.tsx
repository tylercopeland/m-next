/**
 * Chart Wrapper Component - Refactored using SOLID principles
 *
 * This component has been refactored from a 1369-line monolith into a clean,
 * maintainable component using custom hooks that follow SOLID principles:
 *
 * - Single Responsibility: Each hook handles one concern
 * - Open/Closed: Extensible through hooks and interfaces
 * - Liskov Substitution: Runtime and designer modes are interchangeable
 * - Interface Segregation: Focused interfaces for each concern
 * - Dependency Inversion: Depends on abstractions (hooks) not concretions
 */

import React, { Suspense, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useScreenDataContext } from '../contexts/ScreenDataContext';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import type { ComponentType } from 'react';

// Hooks
import { useChartControl } from './chart/hooks/useChartControl';
import { useChartValidation } from './chart/hooks/useChartValidation';
import { useChartSize } from './chart/hooks/useChartSize';
import { useChartConfiguration } from './chart/hooks/useChartConfiguration';
import { useChartData } from './chart/hooks/useChartData';
import { useChartDrilldown } from './chart/hooks/useChartDrilldown';
import { useChartEventHandlers } from './chart/hooks/useChartEventHandlers';

// Types
import type { ChartWrapperReduxProps } from './chart/types';

const dynamicDateOptions = [
  { value: 0, label: 'Last 7 Days' },
  { value: 1, label: 'This Month' },
  { value: 2, label: 'Last Month' },
  { value: 3, label: 'Next Month' },
  { value: 4, label: 'Last 30 Days' },
  { value: 5, label: 'This Year' },
  { value: 6, label: 'Last Year' },
  { value: 7, label: 'Next Year' },
  { value: 8, label: 'Year to Date' },
];

const ChartDrilldown = React.lazy(
  () => import('@m-next/chart-drilldown') as unknown as Promise<{ default: ComponentType<any> }>,
);

function ChartDesignerWrapper(props: ChartWrapperReduxProps) {
  const {
    id,
    containerWidth,
    mode,
    actionHandler = null,
    screenId: runtimeScreenIdProp,
    recordId: runtimeRecordIdProp,
    screenState,
    onControlClick,
  } = props;

  const runtimeContext = useRuntimeContext();
  const screenDataContext = useScreenDataContext();
  const displayPreferences = screenDataContext?.displayPreferences || null;

  // Get screenId and recordId from runtime context or props
  const runtimeScreenIdValue = runtimeContext?.screenId;
  const runtimeRecordIdValue = runtimeContext?.activeRecordId;
  const runtimeScreenId = runtimeScreenIdValue || runtimeScreenIdProp;
  const runtimeRecordId = runtimeRecordIdValue || runtimeRecordIdProp;

  // Control resolution
  const { control, isRuntimeMode } = useChartControl(props);

  // Validation
  const { isValid, expanded } = useChartValidation(control);

  // Runtime expanded state (designer uses expanded from validation; runtime uses local state)
  const [expandedRuntime, setExpandedRuntime] = useState(false);
  const expandedValue = isRuntimeMode ? expandedRuntime : (expanded ?? false);
  const expandedRef = useRef(false);

  // Fire analytics when chart becomes expanded in runtime (match MethodUI ChartWrapper)
  const processAnalytics = runtimeContext?.processAnalytics;
  useEffect(() => {
    if (!isRuntimeMode || !expandedValue || !control || !processAnalytics) return;
    if (expandedRef.current) return;
    expandedRef.current = true;
    processAnalytics('Chart Runtime Action', {
      action: 'Chart expanded',
      tablename: control?.model?.viewName,
    });
  }, [isRuntimeMode, expandedValue, control, processAnalytics]);
  useEffect(() => {
    if (!expandedValue) expandedRef.current = false;
  }, [expandedValue]);

  // Size management (always reserve space for expand button row so layout is consistent in designer and runtime)
  const useDynamicSizing = true;
  const reservedTopPx = 44;
  const { chartSize, wrapperRef } = useChartSize(useDynamicSizing, id, reservedTopPx);

  // Configuration
  const { chartType, chartColors, numberFormat, allowDecimals, refreshChart } = useChartConfiguration(
    control,
    containerWidth,
  );

  // Data fetching
  const { categories, series, isLoading, error } = useChartData({
    control,
    id,
    isRuntimeMode,
    isValid,
  });

  // Drilldown state management
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  // Drilldown functionality
  const drilldown = useChartDrilldown({
    control,
    isRuntimeMode,
    isValid,
    expanded: expandedValue,
    selectedPoint,
    setSelectedPoint,
  });

  // Event handlers
  const { handlePointClick, handleClick, handleRowClick } = useChartEventHandlers({
    control,
    mode,
    actionHandler,
    screenId: runtimeScreenId,
    recordId: runtimeRecordId,
    screenState,
    selectedPoint,
    setSelectedPoint,
    setGridIsLoading: drilldown.setGridIsLoading,
    setHasTotalRecord: drilldown.setHasTotalRecord,
    setSearchString: drilldown.setSearchString,
    expanded: expandedValue,
  });

  // Wrap chart click to set expanded in runtime (match MethodUI: chart area click expands)
  const handleChartClick = useCallback(() => {
    if (isRuntimeMode && control?.model?.drilldownEnabled) {
      setExpandedRuntime(true);
    }
    handleClick();
  }, [isRuntimeMode, control?.model?.drilldownEnabled, handleClick]);

  // In runtime with drilldown, point click should highlight the point first, then open the drilldown panel.
  // Defer expand to next frame so the chart can paint the selected point before the modal opens (avoids CSS/layout timing issues).
  const handlePointClickWithExpand = useCallback(
    (event: Parameters<typeof handlePointClick>[0]) => {
      handlePointClick(event);
      if (isRuntimeMode && control?.model?.drilldownEnabled) {
        requestAnimationFrame(() => {
          setExpandedRuntime(true);
        });
      }
    },
    [isRuntimeMode, control?.model?.drilldownEnabled, handlePointClick],
  );

  // Handle wrapper click for selection
  const handleWrapperClick = useCallback(() => {
    if (onControlClick) {
      onControlClick(id);
    }
  }, [onControlClick, id]);

  const componentVersion = control?.componentVersion || '0.0.0';

  // Show expand button when chart has data (designer and runtime) so layout is consistent
  const firstSeries = series != null && Array.isArray(series) && series.length > 0 ? series[0] : null;
  const showExpand =
    firstSeries != null &&
    Array.isArray((firstSeries as { data?: unknown[] }).data) &&
    (firstSeries as { data: unknown[] }).data.length > 0;

  const handleExpand = useCallback(() => {
    setExpandedRuntime(true);
  }, []);

  const handleChartClose = useCallback(() => {
    setExpandedRuntime(false);
  }, []);

  // Dynamic dates dropdown state
  const hasDynamicDates = !!control?.model?.hasDynamicDates;
  const [isDynamicDateOpen, setIsDynamicDateOpen] = useState(false);
  const activeSelection = control?.model?.dynamicDateRange ?? null;
  const selectionLabel = useMemo(() => {
    const match = dynamicDateOptions.find((item) => item.value === activeSelection);
    return match ? match.label : 'This Year';
  }, [activeSelection]);

  const handleDynamicDateSelection = useCallback(
    (selectedId: number) => {
      setIsDynamicDateOpen(false);
      if (isRuntimeMode && runtimeContext?.updateControlProperty && runtimeContext?.loadChartData && control?.id) {
        runtimeContext.updateControlProperty(control.id, 'model.dynamicDateRange', selectedId);
        const chartUpdate = {
          ...control,
          model: {
            ...control.model,
            dynamicDateRange: selectedId,
          },
        };
        runtimeContext.loadChartData(chartUpdate);
      }
    },
    [isRuntimeMode, runtimeContext, control],
  );

  // Close dynamic date dropdown when clicking outside
  const dynamicDateRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isDynamicDateOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dynamicDateRef.current && !dynamicDateRef.current.contains(e.target as Node)) {
        setIsDynamicDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDynamicDateOpen]);

  // Memoize drilldown props BEFORE early returns to ensure consistent hook count
  // Extract drilldown properties to ensure stable references
  const {
    gridData,
    totalRecords,
    partialRecordCount,
    handleGridClickMany,
    handleGridPageChange,
    handleGridPageLengthChange,
    handleSearch,
    handleAdvancedSearch,
    pageNumber,
    pageSize,
    gridIsLoading,
    isLoadingTagList,
    tagList,
    searchString,
    advancedSearchExpression,
  } = drilldown;

  // Export to CSV (matches legacy ChartWrapper handleGridExport)
  const handleGridExport = useCallback(() => {
    const gridModel = drilldown.gridModel;
    if (!gridModel || !runtimeContext?.queueDataTableExport) return;
    const transformColumn = (col: { header?: string; field?: string; showHeader?: boolean }) => ({
      ...col,
      header: col.header ?? col.field,
      showHeader: col.showHeader ?? true,
    });
    const includeHeaders = (model: typeof gridModel) => ({
      ...model,
      columns: model.columns?.map(transformColumn) ?? [],
    });
    runtimeContext.queueDataTableExport(includeHeaders(gridModel), { source: 'Chart-Drilldown' });
  }, [drilldown.gridModel, runtimeContext?.queueDataTableExport]);

  // In runtime, use ScreenDataContext tagList (already { colour, name }); in designer use drilldown's tagList
  const effectiveTagsList =
    isRuntimeMode && screenDataContext?.tagsList?.others?.length
      ? screenDataContext.tagsList.others
      : (isLoadingTagList ?? false)
        ? null
        : tagList;

  const drilldownProps = useMemo(() => {
    // Use safe defaults when control is null/invalid; align with MethodUI ChartWrapper drilldown shape
    return {
      enabled: control?.model?.drilldownEnabled || false,
      projection: control?.model?.drilldownProjection,
      data: gridData,
      totalRecords: totalRecords === 0 && partialRecordCount > 0 ? partialRecordCount : totalRecords,
      isPartialCount: totalRecords === 0 && partialRecordCount > 0,
      onClickMany: handleGridClickMany,
      onPageChange: handleGridPageChange,
      onPageLengthChange: handleGridPageLengthChange,
      onSearch: handleSearch,
      onRowClick: handleRowClick,
      onExport: isRuntimeMode ? handleGridExport : undefined,
      pageNumber,
      pageSize,
      isLoading: gridIsLoading,
      showExport: isRuntimeMode,
      tagsList: effectiveTagsList,
      hasAdvancedSearch: true,
      searchValue: searchString,
      customEmptyMessage: 'Please select which columns you would like to display by editing the chart.',
      onAdvancedSearchChange: handleAdvancedSearch,
      advancedSearchExpression: advancedSearchExpression ?? undefined,
    };
  }, [
    control?.model?.drilldownEnabled,
    control?.model?.drilldownProjection,
    gridData,
    totalRecords,
    partialRecordCount,
    handleGridClickMany,
    handleGridPageChange,
    handleGridPageLengthChange,
    handleSearch,
    handleAdvancedSearch,
    handleRowClick,
    handleGridExport,
    pageNumber,
    pageSize,
    gridIsLoading,
    isLoadingTagList,
    tagList,
    effectiveTagsList,
    isRuntimeMode,
    screenDataContext?.tagsList?.others,
    searchString,
    advancedSearchExpression,
  ]);

  // Memoize chart style BEFORE early returns to ensure consistent hook count
  const chartStyle = useMemo(() => ({ cursor: 'pointer' }), []);

  // Memoize all props passed to ChartDrilldown BEFORE early returns to ensure consistent hook count
  const chartDrilldownProps = useMemo(() => {
    if (!control) return null;

    return {
      id,
      caption: control.hideCaption ? null : control.caption,
      data: series,
      isLoading: chartType === null || isLoading || refreshChart,
      error,
      style: chartStyle,
      dataPoints: control.model?.dataPoints,
      xAxisLabel: control.model?.labels?.primary,
      yAxisLabel: control.model?.labels?.secondary,
      height: chartSize.height,
      width: chartSize.width,
      chartType,
      categories,
      colors: chartColors,
      onPointClick: handlePointClickWithExpand,
      onClick: handleChartClick,
      onClose: isRuntimeMode ? handleChartClose : undefined,
      enableForceSelect: isRuntimeMode && !!control?.model?.drilldownEnabled,
      drilldown: drilldownProps,
      showClose: isRuntimeMode,
      anchorEl: isRuntimeMode ? (runtimeContext?.chartExpandAnchorEl ?? 'body') : '#canvas-wrapper',
      expanded: expandedValue,
      expandedMargin: isRuntimeMode ? (runtimeContext?.chartExpandMargin ?? '0') : '70px 380px 0px 0px',
      constrainOverlayToAnchor:
        isRuntimeMode && !!(runtimeContext?.chartConstrainOverlayToAnchor ?? runtimeContext?.chartExpandAnchorEl),
      displayPreferences,
      yAxisAllowDecimals: allowDecimals,
      numberFormat,
      onFetchChipsData: drilldown.handleFetchChipsData,
      chipsData: drilldown.chipsData,
      componentVersion,
    };
  }, [
    id,
    control,
    series,
    chartType,
    isLoading,
    refreshChart,
    error,
    chartStyle,
    chartSize,
    categories,
    chartColors,
    handlePointClick,
    handlePointClickWithExpand,
    handleChartClick,
    drilldownProps,
    expandedValue,
    isRuntimeMode,
    handleChartClose,
    runtimeContext?.chartExpandAnchorEl,
    runtimeContext?.chartExpandMargin,
    runtimeContext?.chartConstrainOverlayToAnchor,
    displayPreferences,
    allowDecimals,
    numberFormat,
    drilldown.handleFetchChipsData,
    drilldown.chipsData,
    componentVersion,
  ]);

  // Early returns for invalid states
  if (!control || !control.model || !control.model.columns || control.model.columns.length === 0) {
    return (
      <div
        ref={wrapperRef}
        onClick={handleWrapperClick}
        style={{
          width: '100%',
          height: '100%',
          padding: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: chartSize.width,
            height: chartSize.height,
            cursor: 'pointer',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
          }}
        >
          <strong>Chart not configured</strong>
          <span>To configure select this object and add fields from the right panel.</span>
        </div>
      </div>
    );
  }

  if (!isValid && control && control.model && control.model.columns && control.model.columns.length > 0) {
    return (
      <div
        ref={wrapperRef}
        onClick={handleWrapperClick}
        style={{
          width: '100%',
          height: '100%',
          padding: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: chartSize.width,
            height: chartSize.height,
            cursor: 'pointer',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
          }}
        >
          <strong>Chart not configured</strong>
          <span>To configure select this object and add fields from the right panel.</span>
        </div>
      </div>
    );
  }

  if (!chartDrilldownProps) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: isDynamicDateOpen ? 'visible' : 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {(showExpand || hasDynamicDates) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 4,
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role='presentation'
        >
          {showExpand && (
            <SvgIcon title='Expand' name='expand-V4' size={36} color={colors.grey} onClick={handleExpand} />
          )}
          {hasDynamicDates && (
            <div ref={dynamicDateRef} className={isDynamicDateOpen ? 'mi-chart-dynamic is-open' : 'mi-chart-dynamic'}>
              <div
                role='button'
                tabIndex={0}
                className='mi-chart-dynamic-value'
                onClick={() => setIsDynamicDateOpen(!isDynamicDateOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsDynamicDateOpen(!isDynamicDateOpen);
                  }
                }}
              >
                <span>{selectionLabel}</span>
                <i className='mi-icon-caret-down' />
              </div>
              <div className='mi-chart-dynamic-options'>
                {dynamicDateOptions.map((item) => (
                  <a
                    key={item.value}
                    role='button'
                    tabIndex={0}
                    className={item.value === activeSelection ? 'is-active' : undefined}
                    onClick={() => handleDynamicDateSelection(item.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleDynamicDateSelection(item.value);
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div onClick={handleWrapperClick} style={{ cursor: 'pointer', width: chartSize.width, height: chartSize.height }}>
        <Suspense fallback={<LoadingSkeleton count={1} height={chartSize.height} />}>
          <ChartDrilldown {...chartDrilldownProps} />
        </Suspense>
      </div>
    </div>
  );
}

export default ChartDesignerWrapper;
