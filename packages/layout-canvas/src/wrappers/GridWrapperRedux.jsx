import React, { useEffect, Suspense, useState, useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// External dependencies
import LoadingSkeleton from '@m-next/loading-skeleton';
import Button from '@m-next/button';
import { Guid, interactions, usePrevious, downloadImage } from '@m-next/utilities';
import { complexValueTypes } from '@m-next/types';
import MaliciousChecksContext from '@m-next/grid/src/components/MaliciousChecksContext';
import { GridEventNames } from '@m-next/grid';
import { FieldTypeIds } from '@m-next/runtime-interface';

// Local contexts
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useScreenDataContext } from '../contexts/ScreenDataContext';
import { useDesignerContext } from '../contexts/DesignerContext';

// Grid utilities
import {
  getColumn,
  buildColumnList,
  getViewType,
  isStandardView,
  createDirtyScreenHandler,
  showDirtyScreenAlertDialog,
  createImageUploadHandlers,
  createUploadImageHandler,
  useCustomViews,
  useGridDataProcessing,
} from './grid';

// Lazy-loaded Grid component
const Grid = React.lazy(() => import('@m-next/grid'));

// =============================================================================
// PROP TYPES
// =============================================================================

const propTypes = {
  id: PropTypes.string,
  onControlChange: PropTypes.func,
  control: PropTypes.object,
  mode: PropTypes.string,
  actionHandler: PropTypes.shape({
    executeAction: PropTypes.func,
  }),
  screenId: PropTypes.string,
  recordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  screenState: PropTypes.object,
};

// =============================================================================
// COMPONENT
// =============================================================================

function GridDesignerWrapperV2({
  id,
  onControlChange,
  control: controlProp,
  mode,
  actionHandler = null,
  screenId: runtimeScreenIdProp,
  recordId: runtimeRecordIdProp,
  screenState,
}) {
  // ===========================================================================
  // CONTEXT HOOKS
  // ===========================================================================

  const runtimeContext = useRuntimeContext();
  const screenDataContext = useScreenDataContext();
  const designerContext = useDesignerContext();

  // ===========================================================================
  // MODE & CONTROL SETUP
  // ===========================================================================

  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control = isRuntimeMode ? controlProp : designerContext?.selectControlById(id);
  const isMobile = runtimeContext?.isMobile ?? false;
  const componentVersion = control?.componentVersion || '0.0.0';
  const useDynamicSizing = true; // Always use dynamic sizing in layout canvas

  // ===========================================================================
  // REFS
  // ===========================================================================

  const wrapperRef = useRef(null);
  const gridContainerRef = useRef(null);
  const previousCellValuesRef = useRef(new Map());

  // ===========================================================================
  // STATE - SIZING
  // ===========================================================================

  const [gridWidthPx, setGridWidthPx] = useState(600);
  const [gridHeightPx, setGridHeightPx] = useState(400);
  const [paginationHeightPx, setPaginationHeightPx] = useState(64);

  // ===========================================================================
  // STATE - DATA (columns and enrichedData only - other data managed by useGridDataProcessing)
  // ===========================================================================

  const [columns, setColumns] = useState([]);
  const [enrichedData, setEnrichedData] = useState({});

  // ===========================================================================
  // STATE - PAGINATION (totalRecords and partialRecordCount managed by useGridDataProcessing)
  // ===========================================================================

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ===========================================================================
  // STATE - SORTING
  // ===========================================================================

  const [sort, setSort] = useState(null);
  const [sortSource, setSortSource] = useState(null);

  // ===========================================================================
  // PREVIOUS STATE TRACKING
  // ===========================================================================

  const controlPrev = usePrevious(control);

  // ===========================================================================
  // STATE - FILTERING & VIEWS
  // ===========================================================================

  const [currentViewFilter, setCurrentViewFilter] = useState(null);
  const [advancedSearchExpression, setAdvancedSearchExpression] = useState(control ? control.searchFilter : null);
  const [initialSearchFilter, setInitialSearchFilter] = useState(null);
  const [initialFiltering, setInitialFiltering] = useState(null);
  const [initialAdvancedFiltering, setInitialAdvancedFiltering] = useState(null);
  const [initialView, setInitialView] = useState(null);
  const [initialSorting, setInitialSorting] = useState(null);
  const [simpleChipCount, setSimpleChipCount] = useState(0);
  const [advancedChipCount, setAdvancedChipCount] = useState(0);

  // ===========================================================================
  // STATE - SELECTION
  // ===========================================================================

  const [deletedRecords, setDeletedRecords] = useState([]);

  // ===========================================================================
  // STATE - UI FLAGS (loading managed by useGridDataProcessing)
  // ===========================================================================

  const [hasAdvancedSearch] = useState(true);
  const [updateChipsInitialValues, setUpdateChipsInitialValues] = useState(false);
  const [resetChipsTriggered, setResetChipsTriggered] = useState(false);
  const [viewResetButtonVisible, setViewResetButtonVisible] = useState(false);

  // ===========================================================================
  // CUSTOM VIEWS HOOK
  // ===========================================================================

  const {
    allViewsDisplayState,
    isCustomViewEnabled,
    egCustomViewsSaveButtonEnabled,
    currentView,
    currentViewType,
    canEditSharedView,
    displayViewList,
    handleSaveCustomViewClick,
    handleUpdateCustomViewClick,
    handleDeleteCustomViewClick,
    handleUpdateCurrentView,
    handleUpdateSharedView,
    handleToggleViewVisibility,
    handleSetDefaultView,
    handleCustomViewsDragEnd,
    handleCustomViewsManageDoneClick,
  } = useCustomViews({
    control,
    id,
    isRuntimeMode,
    runtimeContext,
    screenDataContext,
    currentViewFilter,
    columns,
    advancedSearchExpression,
    initialSorting,
  });

  // ===========================================================================
  // MEMOIZED VALUES
  // ===========================================================================

  // Grid size calculations
  const gridSize = useMemo(() => {
    const width = useDynamicSizing ? `${gridWidthPx}px` : '600px';
    const height = useDynamicSizing ? `${gridHeightPx - paginationHeightPx}px` : '400px';
    return { height, width };
  }, [gridWidthPx, gridHeightPx, paginationHeightPx, useDynamicSizing]);

  // ===========================================================================
  // DATA FETCHING - DESIGNER MODE
  // ===========================================================================

  let data = null;
  let error = null;
  let isFetching = false;
  let refetch = null;
  let isLoading = false;
  if (!isRuntimeMode) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const gridQueryResult = designerContext.onLoadGridData(
      {
        id: control?.id,
        screenId: designerContext?.screenId,
        activeRecordId: designerContext?.activeRecordId,
        body: {
          screenState: null,
          model: { ...control, viewFilter: currentViewFilter },
        },
      },
      { skip: !control || !control.columns || control.columns.length === 0 || !currentView },
    );
    data = gridQueryResult.data;
    error = gridQueryResult.error;
    isFetching = gridQueryResult.isFetching;
    refetch = gridQueryResult.refetch;
    isLoading = gridQueryResult.isLoading;
  }

  // ===========================================================================
  // DATA FETCHING - RUNTIME MODE
  // ===========================================================================

  const runtimeGridData = isRuntimeMode && runtimeContext?.getGridData ? runtimeContext?.getGridData(id) : null;
  const chipsData = isRuntimeMode && runtimeContext?.getGridChipsData ? runtimeContext.getGridChipsData(id) : null;

  // ===========================================================================
  // GRID DATA PROCESSING HOOK
  // ===========================================================================

  const {
    gridData,
    setGridData,
    errorData,
    rowStatuses,
    rowRecordIds,
    columnTotals,
    totalRecords,
    partialRecordCount,
    newRow,
    isLoading: loading,
    setIsLoading,
  } = useGridDataProcessing({
    runtimeGridData,
    designerData: data,
    isFetching,
    currentView,
    currentViewFilter,
    control,
    controlId: id,
  });

  // ===========================================================================
  // UTILITY FUNCTIONS
  // ===========================================================================

  // Dirty screen alert and handler utilities
  const showDirtyScreenAlert = (onConfirm, onCancel) => showDirtyScreenAlertDialog(runtimeContext, onConfirm, onCancel);

  const withDirtyCheck = createDirtyScreenHandler({
    screenDataContext,
    showDirtyScreenAlert,
  });

  // View type helpers
  const getViewTypeForControl = (viewId) => getViewType(viewId, control.model);
  const isStandardViewForControl = (viewId) => isStandardView(viewId, allViewsDisplayState, control.model);

  // Chip count helpers
  const getChipCount = (chips) => chips?.filter((chip) => chip.source?.ValueType === complexValueTypes.Field).length;
  const getAdvChipCount = (chips) => chips?.filter((chip) => chip.key).length;

  // ===========================================================================
  // ACTION HANDLER
  // ===========================================================================

  const runGridAction = useCallback(
    (actionName, rowIndex, primaryKey, options = {}) => {
      const {
        actionIdOverride = null,
        eventType = 'rowClick',
        metadata: metadataOverrides = {},
        actionData: actionDataOverrides = {},
      } = options;

      if (!isRuntimeMode || !control || !actionName) return;
      if (!runtimeContext?.screenId) return;
      if (!actionHandler || typeof actionHandler.executeAction !== 'function') return;

      const metadata = {
        timestamp: Date.now(),
        componentType: control?.type || 'grid',
        rowId: rowIndex,
        parentId: id,
        context: 'row',
        primaryKey,
        ...metadataOverrides,
      };

      const actionData = {
        ...actionDataOverrides,
        gridData: {
          ...(actionDataOverrides.gridData || {}),
          rowIndex,
          primaryKey,
        },
        event: {
          ...(actionDataOverrides.event || {}),
          type: eventType,
        },
      };

      const finalMetadata = actionIdOverride ? { ...metadata, actionIdOverride } : metadata;

      try {
        const execution = actionHandler.executeAction({
          componentId: id,
          actionName,
          screenId: runtimeContext?.screenId,
          recordId: runtimeContext?.activeRecordId ?? undefined,
          screenState: screenState ?? undefined,
          actionData,
          metadata: finalMetadata,
        });

        if (execution && typeof execution.catch === 'function') {
          execution.catch(() => {});
        }
      } catch {
        // Grid action execution threw an error
      }
    },
    [actionHandler, control, id, isRuntimeMode, runtimeContext?.activeRecordId, runtimeContext?.screenId, screenState],
  );

  // ===========================================================================
  // EVENT HANDLERS - COLUMN INTERACTIONS
  // ===========================================================================

  const handleColumnClickEvent = (event, columnName, value, _column, rowIndex, primaryKey) => {
    if (!isRuntimeMode) {
      designerContext?.onControlSelected({
        controlId: id,
        property: { selectedColumn: columnName, selectedChildColumn: null },
      });
      interactions.preventPropagation(event);
    }

    if (control.disabled || control.isWorking) return;

    const column = getColumn(columnName, control);
    const isButtonColumn = column?.fieldType === FieldTypeIds.Button;
    const isCardColumn = column?.fieldType === FieldTypeIds.CardColumn;

    // In read-only mode with row click, only button and card columns should fire
    const hasRowClick = control.onRowClick || control.onActiveRowChange;
    if (control.isReadOnly && hasRowClick && !isButtonColumn && !isCardColumn) return;
    if (!column?.onClickEvent) return;

    runGridAction('onClick', rowIndex, primaryKey, {
      actionIdOverride: column?.onClickEvent,
      eventType: 'columnClick',
      metadata: {
        columnName,
        columnType: column?.fieldType,
        parentId: id,
        context: 'screen',
        offSet: 0,
      },
      actionData: {
        value,
        columnName,
      },
    });

    if (event?.stopPropagation) event.stopPropagation();
  };

  const handleColumnChangeEvent = (columnName, value, _column, rowIndex, primaryKey) => {
    if (!isRuntimeMode) return;

    const col = getColumn(columnName, control);

    // Normalize values for comparison (handle dropdown objects with text/value)
    const normalizeValue = (val) => {
      if (val === null || val === undefined) return val;
      if (typeof val === 'object' && 'value' in val) return val.value;
      return val;
    };

    const cellKey = `${rowIndex}-${columnName}`;
    const previousValue = previousCellValuesRef.current.get(cellKey);
    const normalizedValue = normalizeValue(value);
    const normalizedPrevious = normalizeValue(previousValue);

    // Only fire onChange if the value actually changed
    if (normalizedPrevious === normalizedValue) return;

    // Mark screen as dirty on value change (except for button columns)
    if (col.fieldType !== FieldTypeIds.Button && !control.isReadOnly) {
      screenDataContext?.setIsDirty(true);
    }

    // Extract the actual value and text for the action
    const actionValue = value && typeof value === 'object' && 'value' in value ? value.value : value;
    const actionText =
      value && typeof value === 'object' && 'text' in value
        ? value.text
        : value !== null && value !== undefined
          ? String(value)
          : value;

    // Extract old value for the action
    const oldValue =
      previousValue && typeof previousValue === 'object' && 'value' in previousValue
        ? previousValue.value
        : previousValue;
    const oldText =
      previousValue && typeof previousValue === 'object' && 'text' in previousValue
        ? previousValue.text
        : previousValue !== null && previousValue !== undefined
          ? String(previousValue)
          : previousValue;

    // Update the previous value
    previousCellValuesRef.current.set(cellKey, value);

    // Update gridData immediately
    if (gridData && gridData[rowIndex]) {
      setGridData((prevData) => {
        const updatedData = [...prevData];
        const updatedRow = { ...updatedData[rowIndex] };

        if (value && typeof value === 'object' && 'value' in value) {
          updatedRow[columnName] = value;
        } else {
          updatedRow[columnName] = actionValue;
        }

        updatedData[rowIndex] = updatedRow;
        return updatedData;
      });
    }

    // Update Redux state via runtime context
    if (runtimeContext?.updateGridCell && isRuntimeMode) {
      try {
        runtimeContext?.updateGridCell(id, rowIndex, columnName, actionValue, actionText);
      } catch {
        // Error calling updateGridCellFn
      }
    }

    if (col.onChangeEvent) {
      runtimeContext?.bulkUpdateControls([
        { value: primaryKey, property: 'EditedRecordId', controlId: id },
        { value: rowIndex, property: 'EditedRowId', controlId: id },
      ]);

      runGridAction('onChange', rowIndex, primaryKey, {
        actionIdOverride: col?.onChangeEvent,
        eventType: 'columnChange',
        metadata: {
          columnName,
          columnType: col?.fieldType,
          parentId: id,
          context: 'row',
          offSet: 0,
        },
        actionData: {
          value: actionValue,
          text: actionText,
          oldValue: oldValue,
          oldText: oldText,
          columnName,
        },
      });
    }
  };

  // ===========================================================================
  // EVENT HANDLERS - SORTING
  // ===========================================================================

  const handleSort = (sortField, sortType, source, event) => {
    // In designer mode, select the column instead of sorting
    if (!isRuntimeMode) {
      designerContext?.onControlSelected({
        controlId: id,
        property: { selectedColumn: sortField, selectedChildColumn: null },
      });
      if (event) {
        interactions.preventPropagation(event);
      }
      return;
    }

    // In runtime mode, perform the sort
    setSort({ sortField, sortType });
    setSortSource(source || 'Column Click');
    const update = { ...control };
    update.sorting = { sortField, sortType };

    runtimeContext?.bulkUpdateControls([{ value: update.sorting, property: 'sorting', controlId: id }]);
  };

  // ===========================================================================
  // EVENT HANDLERS - PAGINATION
  // ===========================================================================

  const handlePageLengthChange = (value) => {
    setPageNumber(1);
    setPageSize(typeof value === 'number' ? value : parseInt(value, 10) || 10);

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([
        { value: parseInt(value, 10), property: 'paging.pageSize', controlId: id },
        { value: 1, property: 'paging.pageNumber', controlId: id },
        { value: 0, property: 'paging.totalRows', controlId: id },
      ]);
    });
  };

  const handlePageChange = (value) => {
    setPageNumber(typeof value === 'number' ? value : parseInt(value, 10) || 1);

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([
        { value: parseInt(value, 10), property: 'paging.pageNumber', controlId: id },
        { value: 0, property: 'paging.totalRows', controlId: id },
        { value: control.paging.pageSize, property: 'paging.pageSize', controlId: id },
      ]);
    });

    setDeletedRecords([]);

    // Clear empty records from unsaved new lines
    const hasEmptyRecords = !!control?.selectionInfo?.recordIDs && control.selectionInfo.recordIDs.indexOf(-1) > -1;
    if (hasEmptyRecords) {
      const selectedCopy = [];
      control.selectionInfo.recordIDs.forEach((item) => item !== -1 && selectedCopy.push(item));

      runtimeContext?.bulkUpdateControls([
        { value: selectedCopy, property: 'selectionInfo.recordIDs', controlId: id },
        { value: [], property: 'selectedRows', controlId: id },
      ]);
    }
  };

  // ===========================================================================
  // EVENT HANDLERS - SEARCH & FILTER
  // ===========================================================================

  const handleGridSearch = (value) => {
    if (!isRuntimeMode) {
      const updated = { ...control, searchString: value };
      if (onControlChange) onControlChange(id, updated);
      return;
    }

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([
        { value, property: 'searchString', controlId: id },
        { value: ['True'], property: 'searchColumns', controlId: id },
      ]);
    });
  };

  const handleAdvancedSearch = (value) => {
    const updated = { ...control, searchFilter: value };

    if (!isRuntimeMode) {
      if (onControlChange) onControlChange(id, updated);
      return;
    }

    setSimpleChipCount(value.simple ? getChipCount(value.simple) : 0);
    setAdvancedChipCount(value.advanced ? getAdvChipCount(value.advanced) : 0);
    setAdvancedSearchExpression(value);
    runtimeContext?.clearChipData(id);

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([{ value, property: 'searchFilter', controlId: id }]);
    });
  };

  const handleFetchChipsData = (field, value) => {
    if (!isRuntimeMode) return;
    const updated = { ...control, searchString: value };
    runtimeContext?.loadChipsData(updated, field, value);
  };

  // ===========================================================================
  // EVENT HANDLERS - VIEW CHANGES
  // ===========================================================================

  const handleViewSaveAndResetButtonsVisible = (val) => {
    if (viewResetButtonVisible !== val) setViewResetButtonVisible(val);
  };

  const handleReorderColumns = (startColumn, endColumn) => {
    if (!control || !control.viewList || !Array.isArray(control.viewList)) return;

    const index = control.viewList.findIndex((x) => x.id === currentViewFilter);
    const startIndex = control.viewList[index].columns.findIndex((col) => col.field === startColumn.name);
    const endIndex = control.viewList[index].columns.findIndex((col) => col.field === endColumn.name);

    if (index === -1) return;

    const baseColumns = [...control.viewList[index].columns];
    const [removedColumn] = baseColumns.splice(startIndex, 1);
    baseColumns.splice(endIndex, 0, removedColumn);

    const newViewList = [...control.viewList];
    newViewList[index].columns = baseColumns;
    const update = { ...control };
    update.viewList = newViewList;

    if (!isRuntimeMode && onControlChange) {
      onControlChange(id, update);
      return;
    }

    runtimeContext?.bulkUpdateControls([{ value: newViewList, property: 'viewList', controlId: id }]);
    handleViewSaveAndResetButtonsVisible(true);
  };

  // Helper function to handle view change analytics and filtering
  const handleViewChangeLogic = (filterId, isNewView) => {
    const selectedView = control.viewList?.find((v) => v.id === filterId);

    const clearSearchFilters = () => {
      setSimpleChipCount(0);
      setAdvancedChipCount(0);
      setAdvancedSearchExpression(null);
      runtimeContext.clearChipData(id);

      withDirtyCheck(() => {
        runtimeContext?.bulkUpdateControls([{ value: null, property: 'searchFilter', controlId: id }]);
      });
    };

    const applyViewFilters = (targetView) => {
      if (targetView && (targetView.filtering || targetView.advancedFiltering)) {
        handleAdvancedSearch({
          simple: targetView.filtering || [],
          advanced: targetView.advancedFiltering || [],
        });
      }
    };

    const handleAnalytics = (attributes) => {
      runtimeContext?.processAnalytics('Runtime Interaction', attributes);
    };

    // Track analytics
    const analyticsData = {
      Action: 'Grid View Changed',
      Source: 'Editable Grid',
      viewName: selectedView?.name || 'Unknown',
      viewType: getViewTypeForControl(filterId),
      gridName: control.name || control.caption || 'Unknown Grid',
      gridBaseTable: control.viewFriendlyName || 'Unknown Table',
    };
    handleAnalytics(analyticsData);

    // Update chips filter initial values after successful save
    setUpdateChipsInitialValues(true);
    setTimeout(() => setUpdateChipsInitialValues(false), 100);

    // Handle filtering for non-new views
    if (isNewView !== true) {
      setResetChipsTriggered(true);

      if (isStandardViewForControl(filterId)) {
        clearSearchFilters();
      } else {
        const targetView = control.viewList?.find((v) => v.id === filterId);
        if (targetView) applyViewFilters(targetView);
      }
    }
  };

  const viewFilterPropertyChanges = (filterId, clearSelected) => [
    { value: 1, property: 'paging.pageNumber', controlId: id },
    { value: filterId, property: 'viewFilter', controlId: id },
    {
      value: clearSelected ? false : control.selectionInfo.allExcept,
      property: 'selectionInfo.allExcept',
      controlId: id,
    },
    {
      value: clearSelected ? [] : control.selectionInfo.recordIDs,
      property: 'selectionInfo.recordIDs',
      controlId: id,
    },
    {
      value: clearSelected ? [] : control.selectedRows,
      property: 'selectedRows',
      controlId: id,
    },
  ];

  const handleChangeView = (filterId, clearSelected, e, isNewView = false, updatePanel = true) => {
    setPageNumber(1);

    if (!isRuntimeMode) {
      setColumns(
        buildColumnList({
          control,
          currentView,
          isRuntimeMode,
          handleColumnClickEvent,
          handleColumnChangeEvent,
          runtimeContext,
        }),
      );
      setCurrentViewFilter(filterId);

      if (updatePanel) {
        designerContext?.onControlSelected({
          controlId: id,
          property: { selectedView: filterId, selectedColumn: null, selectedChildColumn: null },
        });
        interactions.preventPropagation(e);
      }
      return;
    }

    const currentViewId = control.viewFilter;
    const isActualViewChange = currentViewId && currentViewId !== filterId;

    if (isActualViewChange) handleViewChangeLogic(filterId, isNewView);

    handleViewSaveAndResetButtonsVisible(false);

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls(viewFilterPropertyChanges(filterId, clearSelected));
    });
  };

  const handleShowSelected = (viewFilter) => {
    if (!isRuntimeMode) return;

    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([
        { value: 1, property: 'paging.pageNumber', controlId: id },
        { value: `${viewFilter.id}`, property: 'viewFilter', controlId: id },
        {
          value: [...control.viewList, viewFilter],
          property: 'viewList',
          controlId: id,
        },
      ]);
    });
  };

  const handleRemoveSelectedView = (viewId) => {
    const newViewList = control.viewList.filter((view) => view.id !== viewId);
    runtimeContext?.bulkUpdateControls([{ value: newViewList, property: 'viewList', controlId: id }]);
  };

  const handleActiveColumnsChange = (activeColumns) => {
    if (!isRuntimeMode) return;

    handleViewSaveAndResetButtonsVisible(true);
    withDirtyCheck(() => {
      runtimeContext?.bulkUpdateControls([{ value: activeColumns, property: 'activeColumns', controlId: id }]);
    });
  };

  // ===========================================================================
  // EVENT HANDLERS - SELECTION
  // ===========================================================================

  const handleOnSelect = (recordId, rowIdx, isChecked) => {
    const unselectedState = control?.selectionInfo?.allExcept;
    let selectionInfoRecordIDs = control?.selectionInfo?.recordIDs || [];
    let selectedRows = control.selectedRows || [];

    if (isChecked && recordId) {
      selectionInfoRecordIDs = [...new Set([...selectionInfoRecordIDs, recordId])];
    }
    if (!isChecked && recordId) {
      selectionInfoRecordIDs = selectionInfoRecordIDs.filter((x) => x !== recordId);
    }

    if (isChecked && !recordId) {
      selectedRows = [...new Set([...selectedRows, rowIdx])];
    }
    if (!isChecked && !recordId) {
      selectedRows = selectedRows.filter((x) => x !== rowIdx);
    }

    if (unselectedState && recordId) {
      selectionInfoRecordIDs = isChecked
        ? selectionInfoRecordIDs.filter((x) => x !== recordId)
        : [...new Set([...selectionInfoRecordIDs, recordId])];
    }

    if (!isChecked || (isChecked && recordId)) {
      selectedRows = selectedRows.filter((x) => x !== rowIdx);
    }

    runtimeContext?.bulkUpdateControls([
      { value: selectionInfoRecordIDs, property: 'selectionInfo.recordIDs', controlId: id },
      { value: selectedRows, property: 'selectedRows', controlId: id },
    ]);
  };

  const handleOnSelectPage = (isChecked) => {
    const { allExcept } = control?.selectionInfo || false;
    let recordIDs = control?.selectionInfo?.recordIDs || [];
    let selectedRows = control.selectedRows || [];
    const pageRowIndexes = new Set(rowRecordIds.map((_, rowIdx) => rowIdx));

    if (!isChecked && selectedRows.length > 0) {
      selectedRows = selectedRows.filter((x) => !pageRowIndexes.has(x));
    }

    rowRecordIds.forEach((recordId, rowIdx) => {
      if (recordId === -1) {
        selectedRows = isChecked ? [...new Set([...selectedRows, rowIdx])] : selectedRows;
      }

      if (recordId && recordId !== -1) {
        recordIDs =
          !!allExcept !== !!isChecked
            ? [...new Set([...recordIDs, recordId])]
            : recordIDs.filter((x) => x !== recordId);
      }
    });

    runtimeContext?.bulkUpdateControls([
      { value: recordIDs, property: 'selectionInfo.recordIDs', controlId: id },
      { value: selectedRows, property: 'selectedRows', controlId: id },
    ]);
  };

  const handleSelectAll = (ToF) => {
    runtimeContext?.bulkUpdateControls([{ value: ToF, property: 'selectionInfo.allExcept', controlId: id }]);
  };

  const handleSelectedRecords = (selectionInfoRecordIDs, selectedRows) => {
    runtimeContext?.bulkUpdateControls([
      { value: selectionInfoRecordIDs, property: 'selectionInfo.recordIDs', controlId: id },
      { value: selectedRows, property: 'selectedRows', controlId: id },
    ]);
  };

  const handleGetTotalRecordCount = () => {
    if (isRuntimeMode && runtimeContext) {
      runtimeContext.getGridTotalRecordCount(control);
    }
  };

  // ===========================================================================
  // EVENT HANDLERS - ROW ACTIONS
  // ===========================================================================

  const handleAddRows = () => {
    if (newRow) {
      const rows = [];
      for (let i = 0; i < control.newRowsCount; i++) {
        const blankRow = JSON.parse(JSON.stringify(newRow));
        rows.push(blankRow);
      }
      runtimeContext?.bulkAddGridRows(id, rows);
    }
  };

  const handleRefresh = () => {
    if (!isRuntimeMode && refetch) {
      refetch();
      return;
    }

    withDirtyCheck(() => {
      runtimeContext.loadGridData(control, GridEventNames.GridRefresh, totalRecords, { source: 'Grid' });
    });
  };

  const handleDeleteRow = (rowIdx, recordId) => {
    if (!isRuntimeMode) return;

    const clearIt =
      // eslint-disable-next-line no-restricted-globals
      isNaN(recordId) || recordId === null || recordId === undefined || recordId === '' || recordId.toString() === '-1';

    // Only mark screen as dirty if row already exists in the database
    if (!clearIt) screenDataContext?.setIsDirty(true);

    runtimeContext?.deleteGridRow(id, rowIdx, clearIt);

    if (control.selectionInfo.allExcept) {
      runtimeContext?.bulkUpdateControls([
        {
          value: [...new Set([...control.selectionInfo.recordIDs, recordId])],
          property: 'selectionInfo.recordIDs',
          controlId: id,
        },
      ]);
    } else {
      runtimeContext?.bulkUpdateControls([
        {
          value: control.selectionInfo.recordIDs.filter((x) => x !== recordId),
          property: 'selectionInfo.recordIDs',
          controlId: id,
        },
      ]);
    }

    if (recordId) setDeletedRecords([...new Set([...deletedRecords, recordId])]);
  };

  const handleOnDeleteConfirm = (onConfirm, onCancel) => {
    runtimeContext?.showMessageDialog({
      id: 'runtime-message-delete-screen-alert',
      hasOutsideClick: false,
      hideDismissButton: true,
      heading: 'Please Confirm',
      message: 'Are you sure you want to delete this item?',
      onCancelLabel: 'No, Do Not Delete',
      onCancelCallback: onCancel,
      onConfirmLabel: 'Yes, Delete',
      onConfirmCallback: onConfirm,
      onDismissFocusId: '',
      onConfirmFocusId: '',
    });
  };

  const handleSetRowStatus = (rowId, status) => {
    runtimeContext?.updateGridRowStatus(id, rowId, status);
  };

  const handleRuntimeRowClick = useCallback(
    (_rowData, rowIndex, columnType, _event, primaryKey) => {
      if (!isRuntimeMode || !control) return;
      if (control.disabled || control.isWorking) return;
      if (!control.isReadOnly) return;

      const isButtonColumn = columnType === FieldTypeIds.Button;
      const isCardColumn = columnType === FieldTypeIds.CardColumn;

      // If clicking on a button or card column, let the column's onClick handler fire instead
      if (isButtonColumn || isCardColumn) return;

      if (control.onRowClick) {
        runGridAction('onRowClick', rowIndex, primaryKey);
        return;
      }

      if (control.onActiveRowChange) {
        runGridAction('onActiveRowChange', rowIndex, primaryKey);
      }
    },
    [control, id, isRuntimeMode, runGridAction],
  );

  // ===========================================================================
  // EVENT HANDLERS - EXPORT
  // ===========================================================================

  const handleExportToCSV = () => {
    if (!isRuntimeMode) return;

    if (screenDataContext?.isDirty) {
      runtimeContext?.showMessageDialog({
        id: 'runtime-message-screen-alert',
        hasOutsideClick: false,
        hideDismissButton: true,
        heading: 'Are you sure?',
        message: 'Please save before exporting or your changes will not be included in the export.',
        onCancelLabel: 'Continue without saving',
        onConfirmLabel: 'Let me save first',
        onConfirmCallback: () => runtimeContext?.queueDataTableExport(control),
      });
    } else {
      runtimeContext?.queueDataTableExport(control);
    }
  };

  const handleMailChimpExport = () => {
    const modelToPost = { ...control, v2: true };
    runtimeContext?.queueMailChimpExport(modelToPost);
  };

  const handleCustomActionClick = (action) => {
    if (!isRuntimeMode) return;
    if (action === 'exportToMailChimp') handleMailChimpExport();
  };

  // ===========================================================================
  // EVENT HANDLERS - CUSTOM VIEWS DIALOG
  // ===========================================================================

  const handleCloseSaveGridFilterDialog = (isRealClose, onDialogClose) => {
    screenDataContext?.closeDialog();
    if (onDialogClose) onDialogClose();
  };

  const handleSaveOnGridFilterDialog = (
    filterId,
    filterName,
    setAsDefault,
    shareOption,
    filtering,
    advancedFiltering,
    standardFiltering,
    onValidation,
    isEditMode,
    onDialogClose,
  ) => {
    if (isEditMode) {
      handleUpdateCustomViewClick(
        filterId,
        filterName,
        null,
        shareOption,
        filtering,
        advancedFiltering,
        standardFiltering,
        onValidation,
      );
    } else {
      handleSaveCustomViewClick(filterName, setAsDefault, shareOption, onValidation);
    }
    if (onDialogClose) onDialogClose();
  };

  const handleShowSaveGridViewDialog = (isEditMode, onDialogClose, selectedView) => {
    const wrappedCloseHandler = (isRealClose, passedOnDialogClose) => {
      handleCloseSaveGridFilterDialog(isRealClose, passedOnDialogClose || onDialogClose);
    };

    const wrappedSaveHandler = (
      filterId,
      filterName,
      setAsDefault,
      shareOption,
      filtering,
      advancedFiltering,
      standardFiltering,
      onValidation,
      isEdit,
      passedOnDialogClose,
    ) => {
      handleSaveOnGridFilterDialog(
        filterId,
        filterName,
        setAsDefault,
        shareOption,
        filtering,
        advancedFiltering,
        standardFiltering,
        onValidation,
        isEdit,
        passedOnDialogClose || onDialogClose,
      );
    };

    runtimeContext?.showGridFilterDialog(
      wrappedCloseHandler,
      wrappedSaveHandler,
      isEditMode,
      selectedView,
      onDialogClose,
      isEditMode ? handleDeleteCustomViewClick : null,
    );
  };

  const handleResetSettings = () => {
    if (
      control.searchFilter?.simple !== initialFiltering ||
      control.searchFilter?.advanced !== initialAdvancedFiltering
    ) {
      setResetChipsTriggered(true);
    }

    runtimeContext?.bulkUpdateControls([
      { value: null, property: 'activeColumns', controlId: id },
      { value: initialSearchFilter, property: 'searchFilter', controlId: id },
      { value: null, property: 'sorting', controlId: id },
      { value: null, property: 'searchString', controlId: id },
    ]);

    // Reset view columns order to initial state
    const updatedViewList =
      initialView && control?.viewList
        ? control.viewList.map((view) => (view.id === initialView.id ? { ...initialView } : view))
        : control.viewList;

    const updatedCustomViewList =
      initialView && control?.model.customViews
        ? control.model.customViews.map((view) => (view.id === initialView.id ? { ...initialView } : view))
        : control.model.customViews;

    const updatedSharedViewList =
      initialView && control?.model.sharedViews
        ? control.model.sharedViews.map((view) => (view.id === initialView.id ? { ...initialView } : view))
        : control.model.sharedViews;

    runtimeContext?.bulkUpdateControls([
      { value: updatedViewList, property: 'viewList', controlId: id },
      { value: updatedCustomViewList, property: 'model.customViews', controlId: id },
      { value: updatedSharedViewList, property: 'model.sharedViews', controlId: id },
    ]);

    handleViewSaveAndResetButtonsVisible(false);
    setTimeout(() => {
      handleAdvancedSearch({ simple: initialFiltering || [], advanced: initialAdvancedFiltering || [] });
    }, 0);
  };

  // ===========================================================================
  // EVENT HANDLERS - ANALYTICS
  // ===========================================================================

  const handleAnalytics = (attributes) => {
    if (isRuntimeMode && runtimeContext) {
      runtimeContext.processAnalytics('Runtime Interaction', attributes);
    }
  };

  const buildFilterAnalyticsPayload = (newDrawerState) => ({
    Action: 'Grid Filter Clicked',
    Source: 'Editable Grid',
    filterSectionAppearance: newDrawerState ? 'Expanded' : 'Collapsed',
    gridName: control.name || control.caption || 'Unknown Grid',
    gridBaseTable: control.viewFriendlyName || 'Unknown Table',
  });

  const handleFilterToggleAnalytics = (newDrawerState) => {
    const analyticsPayload = buildFilterAnalyticsPayload(newDrawerState);
    handleAnalytics(analyticsPayload);
  };

  const buildChipFilterAnalyticsPayload = (eventType, fieldName) => ({
    Action: eventType === 'applied' ? 'Grid Chip Filter Applied' : 'Grid Chip Filter Removed',
    Source: 'Editable Grid',
    fieldName: fieldName || 'Unknown Field',
    gridName: control.name || control.caption || 'Unknown Grid',
    gridBaseTable: control.viewFriendlyName || 'Unknown Table',
  });

  const handleChipFilterApplied = (fieldName) => {
    const analyticsPayload = buildChipFilterAnalyticsPayload('applied', fieldName);
    handleAnalytics(analyticsPayload);
  };

  const handleChipFilterRemoved = (fieldName) => {
    const analyticsPayload = buildChipFilterAnalyticsPayload('removed', fieldName);
    handleAnalytics(analyticsPayload);
  };

  // ===========================================================================
  // EVENT HANDLERS - IMAGE UPLOAD
  // ===========================================================================

  const uploadHandlers = createImageUploadHandlers({
    getEnrichedData: () => enrichedData,
    setEnrichedData,
    handleColumnChangeEvent,
  });

  const handleUploadImage = createUploadImageHandler({
    isRuntimeMode,
    getEnrichedData: () => enrichedData,
    setEnrichedData,
    runtimeContext,
    uploadHandlers,
  });

  const handleDownloadImage = useCallback(
    (imageUrl, columnName, recordId) => {
      const authContext = isRuntimeMode && runtimeContext?.selectAuthContext ? runtimeContext.selectAuthContext() : {};
      downloadImage({
        imageUrl,
        columnName,
        recordId,
        viewName: control?.viewFriendlyName,
        authToken: authContext.authToken,
        runtimeCoreUrl: authContext.runtimeCoreUrl,
      });
    },
    [isRuntimeMode, runtimeContext, control?.viewFriendlyName],
  );

  const handleErrorMessageForUser = (message) => {
    runtimeContext?.logClientSideError(message, null, true);
  };

  // ===========================================================================
  // EFFECTS - DATA LOADING
  // ===========================================================================

  // Load grid data - designer mode only (runtime mode is handled by analytics tracking effect)
  useEffect(() => {
    if (!isRuntimeMode && refetch && !isFetching && isLoading) {
      refetch();
    }
  }, [isRuntimeMode, refetch, isFetching, isLoading]);

  // Note: Grid data processing is now handled by useGridDataProcessing hook

  // ===========================================================================
  // EFFECTS - RUNTIME DATA LOADING WITH ANALYTICS
  // ===========================================================================

  // Load grid data in runtime mode and track analytics for data load events
  useEffect(() => {
    if (!isRuntimeMode || !control || !runtimeContext) return;

    const analyticsMetaData = { source: 'Grid' };

    // Initial load (no previous control to compare)
    if (!controlPrev) {
      // Use control's viewFilter or defaultViewFilter for initial load
      const initialViewFilter =
        control.viewFilter && control.viewFilter !== Guid.empty() ? control.viewFilter : control.defaultViewFilter;
      if (!initialViewFilter) return;

      runtimeContext.loadGridData(control, undefined, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // For subsequent loads, require currentViewFilter to be set
    if (!currentViewFilter) return;

    // View filter changed
    if (controlPrev.viewFilter !== control.viewFilter) {
      runtimeContext.loadGridData(control, GridEventNames.FilterChanged, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // Search string changed
    if (controlPrev.searchString !== control.searchString) {
      runtimeContext.loadGridData(control, GridEventNames.SearchClicked, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // Advanced search filter changed
    if (controlPrev.searchFilter !== control.searchFilter) {
      runtimeContext.loadGridData(control, GridEventNames.AdvancedSearch, totalRecords, {
        ...analyticsMetaData,
        simpleChipCount,
        advancedChipCount,
      });
      setIsLoading(true);
      return;
    }

    // Active columns changed
    if (controlPrev.activeColumns !== control.activeColumns) {
      runtimeContext.loadGridData(control, GridEventNames.VisibleColumnsChanged, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // Page number changed
    if (controlPrev.paging?.pageNumber !== control.paging?.pageNumber) {
      runtimeContext.loadGridData(control, GridEventNames.PageChanged, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // Page size changed
    if (controlPrev.paging?.pageSize !== control.paging?.pageSize) {
      runtimeContext.loadGridData(control, GridEventNames.PageSizeChanged, totalRecords, analyticsMetaData);
      setIsLoading(true);
      return;
    }

    // Sorting changed
    if (controlPrev.sorting !== control.sorting) {
      runtimeContext.loadGridData(control, GridEventNames.SortChanged, totalRecords, {
        ...analyticsMetaData,
        sortViaColumnClick: sortSource === 'Column Click',
      });
      setSortSource(null);
      setIsLoading(true);
    }
  }, [
    isRuntimeMode,
    control,
    controlPrev,
    currentViewFilter,
    totalRecords,
    simpleChipCount,
    advancedChipCount,
    sortSource,
    runtimeContext,
    setIsLoading,
  ]);

  // ===========================================================================
  // EFFECTS - VIEW & FILTER MANAGEMENT
  // ===========================================================================

  // Initialize current view filter
  useEffect(() => {
    if (!control) return;

    const view =
      !control.viewFilter || control.viewFilter === Guid.empty() ? control.defaultViewFilter : control.viewFilter;
    if (view !== currentViewFilter) {
      setCurrentViewFilter(view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control?.viewFilter, control?.defaultViewFilter]);

  // Build columns when control or view changes
  useEffect(() => {
    setColumns(
      buildColumnList({
        control,
        currentView,
        isRuntimeMode,
        handleColumnClickEvent,
        handleColumnChangeEvent,
        runtimeContext,
      }),
    );
  }, [control, currentViewFilter]);

  // Handle designer view selection sync
  useEffect(() => {
    if (designerContext?.selectedControlId === id) {
      if (
        designerContext?.selectedControlProperty?.selectedView &&
        currentViewFilter !== designerContext?.selectedControlProperty.selectedView
      ) {
        handleChangeView(designerContext?.selectedControlProperty.selectedView, true, null, false, false);
      } else if (
        !designerContext?.selectedControlProperty?.selectedView &&
        control &&
        currentViewFilter !== control.defaultViewFilter
      ) {
        handleChangeView(control.defaultViewFilter, true, null, false, false);
      }
    }
  }, [
    control,
    currentViewFilter,
    handleChangeView,
    id,
    designerContext?.selectedControlId,
    designerContext?.selectedControlProperty?.selectedView,
    control?.defaultViewFilter,
  ]);

  // Reset previous cell values when grid data changes
  useEffect(() => {
    if (gridData && columns.length > 0) {
      previousCellValuesRef.current.clear();
      gridData.forEach((row, rowIndex) => {
        columns.forEach((col) => {
          const cellKey = `${rowIndex}-${col.name}`;
          const value = row[col.name];
          previousCellValuesRef.current.set(cellKey, value);
        });
      });
    }
  }, [gridData, columns.length]);

  useEffect(() => {
    if (!control || control?.paging?.pageSize === pageSize) return;
    setPageSize(control?.paging?.pageSize || 10);
  }, [control?.paging.pageSize]);

  useEffect(() => {
    if (isRuntimeMode && !loading && gridData?.length === 0 && !control.isReadOnly) {
      handleAddRows();
    }
  }, [isRuntimeMode, loading, gridData?.length]);

  // ===========================================================================
  // EFFECTS - UI & SIZING
  // ===========================================================================

  // Use ResizeObserver to track wrapper dimension changes
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    const currentGridContainer = gridContainerRef.current;

    if (!currentWrapper) return;

    const updateGridSize = () => {
      const wrapperWidth = currentWrapper.clientWidth;
      const wrapperHeight = currentWrapper.clientHeight;

      const horizontalReservedSpace = 16;
      const verticalReservedSpace = 16;

      const calculatedHeightPx = Math.max(100, wrapperHeight - verticalReservedSpace);
      const calculatedWidthPx = Math.max(100, wrapperWidth - horizontalReservedSpace);

      if (currentGridContainer) {
        const paginationRow = currentGridContainer.querySelector('[id$="-GRID-PAGING-WRAPPER"]');
        if (paginationRow) {
          const paginationHeight = paginationRow.offsetHeight;
          setPaginationHeightPx(paginationHeight || 64);
        }
      }

      if (useDynamicSizing) {
        setGridHeightPx(calculatedHeightPx);
        setGridWidthPx(calculatedWidthPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateGridSize();
    });

    resizeObserver.observe(currentWrapper);
    updateGridSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicSizing, id]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Empty state - no columns configured */}
      {(!control || !control.columns || control.columns.length === 0) && (
        <div
          style={{
            width: gridSize.width,
            height: gridSize.height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <strong>Grid not configured</strong>
          <span>To add columns to Editable Grid, please use Grid Builder</span>
        </div>
      )}

      {/* Error state */}
      {control && control.columns && control.columns.length > 0 && error && (
        <div
          style={{
            width: gridSize.width,
            height: gridSize.height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <strong>Grid failed to load </strong>
        </div>
      )}

      {/* Grid component */}
      {control && control.columns && control.columns.length > 0 && !error && (
        <Suspense fallback={<LoadingSkeleton count={1} height={gridSize.height} />}>
          <MaliciousChecksContext.Provider value={screenDataContext?.featureFlags[44]}>
            <div
              ref={gridContainerRef}
              style={{
                position: 'relative',
                width: gridSize.width,
                height: '100%',
                flex: '1 1 auto',
                minHeight: 0,
              }}
              hidden={isRuntimeMode && !control.visible}
            >
              <Grid
                key={`grid-${pageNumber}-${currentViewFilter}`}
                // Identity & Display
                id={control.name}
                caption={control.caption}
                classes={control.classes}
                visible={control.visible}
                hideCaption={control.hideCaption}
                disabled={control.disabled || (control.isWorking && control.isActionExecuting !== true)}
                isLoading={loading || isFetching || (control.isWorking && control.isActionExecuting !== true)}
                isMobile={isMobile}
                componentVersion={componentVersion}
                variant='modern'
                isV4Design
                // Sizing
                width={gridSize.width}
                fillParentHeight
                // Data
                data={gridData}
                columns={columns}
                errorData={errorData}
                columnTotals={columnTotals}
                rowStatuses={rowStatuses}
                rowRecordIds={rowRecordIds}
                enrichedData={enrichedData}
                // Pagination
                pageNumber={pageNumber}
                pageSize={pageSize}
                isPageData={true}
                totalRecords={totalRecords === 0 && partialRecordCount > 0 ? partialRecordCount : totalRecords}
                isPartialCount={totalRecords === 0 && partialRecordCount > 0}
                disableGoToPage={false}
                onPageChange={handlePageChange}
                onPageLengthChange={handlePageLengthChange}
                // Sorting
                sorting={sort}
                onChangeColumnSorting={control.showSort ? handleSort : null}
                // Search & Filter
                searchable={control.isSearchable}
                searchValue={control.searchString}
                hasAdvancedSearch={hasAdvancedSearch}
                advancedSearchExpression={advancedSearchExpression}
                defaultAdvancedSearchOpen={!!advancedSearchExpression}
                chipsFilterCount={simpleChipCount + advancedChipCount}
                chipsData={chipsData?.options}
                updateChipsInitialValues={updateChipsInitialValues}
                resetChipsTriggered={resetChipsTriggered}
                onGridSearch={handleGridSearch}
                onAdvancedSearchChange={handleAdvancedSearch}
                onFetchChipsData={handleFetchChipsData}
                onChipFilterApplied={handleChipFilterApplied}
                onChipFilterRemoved={handleChipFilterRemoved}
                onFilterToggleAnalytics={handleFilterToggleAnalytics}
                // Views
                viewFilters={displayViewList}
                selectedView={currentViewFilter}
                defaultViewFilter={control.defaultViewFilter}
                showViewFilter={!control.hideViewSelector}
                viewType={getViewTypeForControl(control.viewFilter)}
                currentViewType={currentViewType}
                viewResetButtonVisible={viewResetButtonVisible}
                onChangeView={handleChangeView}
                onShowSelected={handleShowSelected}
                onRemoveSelectedView={handleRemoveSelectedView}
                onClickResetButton={handleResetSettings}
                setViewSaveAndResetButtonsVisible={handleViewSaveAndResetButtonsVisible}
                // Custom Views
                isCustomViewEnabled={isCustomViewEnabled}
                isDesignMode={!isRuntimeMode}
                egCustomViewsSaveButtonEnabled={egCustomViewsSaveButtonEnabled}
                isAdminOrCustomizer={isRuntimeMode && runtimeContext ? runtimeContext.isAdminOrCustomizer : false}
                canEditSharedView={canEditSharedView}
                onClickShowSaveGridViewDialog={handleShowSaveGridViewDialog}
                onToggleViewVisibility={handleToggleViewVisibility}
                onCustomViewsDragEnd={handleCustomViewsDragEnd}
                handleCustomViewsManageDoneClick={handleCustomViewsManageDoneClick}
                onSetDefaultView={handleSetDefaultView}
                onUpdateCurrentView={handleUpdateCurrentView}
                onUpdateSharedView={handleUpdateSharedView}
                // Selection
                selectable={control.isSelectable}
                selectAll={control.selectAll}
                selectedRecords={control.selectedRecords || []}
                selectedRows={control.selectedRows || []}
                unselectedRecords={control.unselectedRecords || []}
                selectedRecordIds={control.selectionInfo ? control.selectionInfo.recordIDs : []}
                invertSelection={control.selectionInfo ? control.selectionInfo.allExcept : false}
                onSelect={handleOnSelect}
                onSelectPage={handleOnSelectPage}
                onSelectAll={handleSelectAll}
                onSelectedRecords={handleSelectedRecords}
                onClickMany={handleGetTotalRecordCount}
                // Row Actions
                editable={isRuntimeMode ? !control.isReadOnly : true}
                canDelete={control.showDeleteColumn && !control.isReadOnly}
                confirmDeletion={control.showDeleteConfirmation}
                addRowsEnabled={control.canAddMoreRows && !control.isReadOnly}
                addRowsLabel={control.addLabel}
                addRowsCount={control.newRowsCount}
                deletedRecords={deletedRecords}
                onRowClick={isRuntimeMode && control?.isReadOnly ? handleRuntimeRowClick : undefined}
                onAddRows={handleAddRows}
                onDelete={handleDeleteRow}
                onDeleteConfirmation={handleOnDeleteConfirm}
                onRefresh={handleRefresh}
                onSetRowStatus={handleSetRowStatus}
                // Column Operations
                showShowHideColumns={control.showShowHideColumns}
                showColumnClickHighlighting
                showVerticalDividers={control.showVerticalDividers}
                reorderColumns={control.canReorderColumns}
                onReorderColumns={handleReorderColumns}
                onActiveColumnsChange={handleActiveColumnsChange}
                // Export
                showExport={control.showExport}
                showReload={control.showRefresh}
                showGoToPage={control.showGoToPage ? control.showGoToPage : false}
                onExport={handleExportToCSV}
                customActions={
                  control.showExportToMailChimp ? [{ label: 'Export to Mailchimp', value: 'exportToMailChimp' }] : null
                }
                onCustomActionClick={handleCustomActionClick}
                // Display Preferences
                displayPreferences={screenDataContext?.displayPreferences}
                tagsList={screenDataContext?.tagsList?.others || []}
                tagsSuggestions={screenDataContext?.tagsList?.suggestions || []}
                onManageTags={runtimeContext?.manageTags ? () => runtimeContext.manageTags() : null}
                // Action Button
                actionButton={
                  control.onActionButtonClick ? (
                    <Button id={`${id}-action-button`} value={control?.actionButtonLabel} isV4Design />
                  ) : null
                }
                // Image Upload & Download
                onUploadImage={handleUploadImage}
                onDownloadImage={handleDownloadImage}
                onErrorMessageForUser={handleErrorMessageForUser}
                responsive={false}
              />
            </div>
          </MaliciousChecksContext.Provider>
        </Suspense>
      )}
    </div>
  );
}

GridDesignerWrapperV2.propTypes = propTypes;
export default GridDesignerWrapperV2;
