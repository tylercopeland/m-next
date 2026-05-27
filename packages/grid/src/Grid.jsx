/* eslint-disable prefer-destructuring */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';
import Caption from '@m-next/caption';
import { ClickOutside, Guid } from '@m-next/utilities';
import { ExpressionElement, FieldTypeIds, fieldTypeNameLookup, Sorting, Tag } from '@m-next/types';
import { breakpointNames, getBreakpoint } from '@m-next/styles';
import { DragDropContext } from 'react-beautiful-dnd';
import ChipsFilter from '@m-next/chips-filter';

import * as s from './Grid.styles';
import { formatCellValue, formatMoneyValue, STATUSES } from './utilities';
import AddRow from './components/Footer/AddRow';
import ShowSelectedRecords from './components/Header/ShowSelectedRecords';
import PerPageSelector from './components/Footer/PerPageSelector';
import Pagination from './components/Footer/Pagination';
import Table from './components/Table';
import classConverter from './classConverter';
import SearchHeader from './SearchHeader';
import Column from './ColumnPropType';
import { Row, DraggableRow } from './components/Table/Body/Row';

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  caption: PropTypes.string,
  data: PropTypes.instanceOf(Object),
  errorData: PropTypes.instanceOf(Object),
  rowStyle: PropTypes.instanceOf(Object),
  searchStyle: PropTypes.instanceOf(Object),
  footerStyle: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fillParentHeight: PropTypes.bool,

  columns: PropTypes.arrayOf(Column),
  isPageData: PropTypes.bool,

  reorderColumns: PropTypes.bool,

  selectable: PropTypes.bool,

  invertSelection: PropTypes.bool,
  selectedRecordIds: PropTypes.arrayOf(PropTypes.number),
  selectedRows: PropTypes.instanceOf(Array),
  rowStatuses: PropTypes.instanceOf(Array),
  selectedView: PropTypes.string,

  totalRecords: PropTypes.number,
  viewFilters: PropTypes.oneOfType([
    // Flat array of options
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        sorting: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        filtering: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        enableDynamicDates: PropTypes.bool,
      }),
    ),
    // Array of [categoryName, categoryOptions] pairs for categorized options
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string, // category name
          PropTypes.arrayOf(
            // category options
            PropTypes.shape({
              id: PropTypes.string,
              name: PropTypes.string,
              columns: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              sorting: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              filtering: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              enableDynamicDates: PropTypes.bool,
            }),
          ),
        ]),
      ),
    ),
  ]),
  onClickMany: PropTypes.func,
  onChangeColumnSorting: PropTypes.func,
  onChangeView: PropTypes.func,
  hideCaption: PropTypes.bool,
  classes: PropTypes.string,
  deletedRecords: PropTypes.instanceOf(Array),
  rowRecordIds: PropTypes.instanceOf(Array),
  columnTotals: PropTypes.instanceOf(Array),
  onRemoveSelectedView: PropTypes.func,
  onSetRowStatus: PropTypes.func,
  onShowSelected: PropTypes.func,
  onOutsideClick: PropTypes.func,

  displayPreferences: PropTypes.instanceOf(Object),
  actionButton: PropTypes.instanceOf(Object),
  showHeader: PropTypes.bool,
  dragAndDrop: PropTypes.instanceOf(Object),
  onMultiSelect: PropTypes.func,
  onSelect: PropTypes.func,

  showExport: PropTypes.bool,
  showInlineExport: PropTypes.bool,
  showVerticalDividers: PropTypes.bool,
  showViewFilter: PropTypes.bool,
  showReload: PropTypes.bool,
  searchValue: PropTypes.string,
  searchable: PropTypes.bool,
  focusSearchInputOnLoad: PropTypes.bool,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  onGridSearch: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectedRecords: PropTypes.func,
  showShowHideColumns: PropTypes.bool,
  onActiveColumnsChange: PropTypes.func,
  onActiveMobileColumnsChange: PropTypes.func,
  onFilterToggleAnalytics: PropTypes.func,
  canDelete: PropTypes.bool,
  confirmDeletion: PropTypes.bool,
  onDelete: PropTypes.func,
  onRowClick: PropTypes.func,
  onDeleteConfirmation: PropTypes.func,
  onRenderRow: PropTypes.func,
  onRowChange: PropTypes.func,
  addRowsEnabled: PropTypes.bool,
  addRowsLabel: PropTypes.string,
  showPageSize: PropTypes.bool,
  showPagination: PropTypes.bool,

  pageNumber: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageLengthChange: PropTypes.func,
  onAddRows: PropTypes.func,
  isPartialCount: PropTypes.bool,
  onSelectPage: PropTypes.func,
  emptyStateComponent: PropTypes.func,
  borderlessLoader: PropTypes.bool,
  loaderTopPadding: PropTypes.number,
  gridPagingWrapperStyle: PropTypes.instanceOf(Object),
  tableWrapperHeight: PropTypes.string,
  tableWrapperHoverState: PropTypes.bool,
  tableBodyBackgroundColor: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  tagsSuggestions: PropTypes.arrayOf(PropTypes.string),
  onManageTags: PropTypes.func,
  draggable: PropTypes.bool,
  onReorder: PropTypes.func,
  onReorderColumns: PropTypes.func,
  compact: PropTypes.bool,
  sorting: Sorting,
  responsive: PropTypes.bool,
  onUploadImage: PropTypes.func,
  onDownloadImage: PropTypes.func,
  onErrorMessageForUser: PropTypes.func,
  enrichedData: PropTypes.instanceOf(Object),
  alwaysShowDragHandles: PropTypes.bool,
  showDragOnHover: PropTypes.bool,
  overflow: PropTypes.bool,
  hasAdvancedSearch: PropTypes.bool,
  chipsFilterCount: PropTypes.number,
  advancedSearchExpression: PropTypes.shape({
    simple: PropTypes.arrayOf(ExpressionElement),
    advanced: PropTypes.arrayOf(ExpressionElement),
  }),
  onAdvancedSearchChange: PropTypes.func,
  defaultAdvancedSearchOpen: PropTypes.bool,
  openAdvancedSearchOnMount: PropTypes.bool,
  onFetchChipsData: PropTypes.func,
  chipsData: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  viewResetButtonVisible: PropTypes.bool,
  setViewSaveAndResetButtonsVisible: PropTypes.func,
  hasOtherViewChanges: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
  menuColumn: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      visible: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  ),
  hideRecordCount: PropTypes.bool,
  tooltipId: PropTypes.string,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onCustomActionClick: PropTypes.func,
  showColumnClickHighlighting: PropTypes.bool,
  onClickShowSaveGridViewDialog: PropTypes.func,
  isCustomViewEnabled: PropTypes.bool,
  egCustomViewsSaveButtonEnabled: PropTypes.bool,
  isAdminOrCustomizer: PropTypes.bool,
  onClickResetButton: PropTypes.func,
  defaultViewFilter: PropTypes.string,
  onToggleViewVisibility: PropTypes.func,
  onCustomViewsDragEnd: PropTypes.func,
  handleCustomViewsManageDoneClick: PropTypes.func,
  onSetDefaultView: PropTypes.func,
  onChipFilterApplied: PropTypes.func,
  onChipFilterRemoved: PropTypes.func,
  resetChipsTriggered: PropTypes.bool,
  currentViewType: PropTypes.string,
  onUpdateCurrentView: PropTypes.func,
  canEditSharedView: PropTypes.bool,
  onUpdateSharedView: PropTypes.func,
  updateChipsInitialValues: PropTypes.bool,
  viewType: PropTypes.string,
  variant: PropTypes.string,
  isV4Design: PropTypes.bool,
  disableGoToPage: PropTypes.bool,
  componentVersion: PropTypes.string,
  accountingSoftware: PropTypes.string,
  isDesignMode: PropTypes.bool,
};

const getRowCount = (data, rowStatuses) => {
  let count = 0;
  if (!data) return count;

  for (let i = 0; i < data.length; i++) {
    if (
      !rowStatuses ||
      (rowStatuses[i] !== undefined && rowStatuses[i] !== null && rowStatuses[i] !== STATUSES.blank)
    ) {
      count += 1;
    }
  }
  return count;
};

function Grid({
  // ===== Core Identifiers =====
  id = null,

  // ===== Data & Content =====
  data = null,
  errorData = {},
  columns = [],
  enrichedData,
  tagsList,
  tagsSuggestions,
  onManageTags,

  columnTotals = [],

  // ===== Styling & Layout Props =====
  width = '100%',
  maxWidth,
  height = null,
  fillParentHeight = false,
  rowStyle = null,
  searchStyle = null,
  footerStyle = null,
  compact = false,
  responsive = true,
  overflow = false,

  // ===== Display & Visibility Flags =====
  showHeader = true,
  showExport = false,
  showInlineExport = false,
  showVerticalDividers = false,
  showViewFilter = true,
  showReload = true,
  showShowHideColumns,
  showPageSize = true,
  showPagination = true,
  hideCaption = true,
  hideRecordCount = false,
  showColumnClickHighlighting = false,
  borderlessLoader = false,
  loaderTopPadding = null,

  // ===== State Flags =====
  disabled = false,
  editable = false,
  isLoading = false,
  isMobile = false,
  isPageData = false,
  selectable = false,
  draggable = false,
  reorderColumns = false,
  canDelete = true,
  confirmDeletion = false,

  // ===== Caption & Header =====
  caption = '',
  classes = null,
  actionButton = null,

  // ===== Search & Filtering =====
  searchValue = null,
  searchable = true,
  focusSearchInputOnLoad = false,
  hasAdvancedSearch = false,
  chipsFilterCount = 0,
  advancedSearchExpression = null,
  defaultAdvancedSearchOpen,
  openAdvancedSearchOnMount = false,
  chipsData,
  forcedTimeZone,

  // ===== Selection & Records =====
  selectedRecordIds = [],
  selectedRows = [],
  selectedView = null,
  invertSelection = false,
  rowStatuses = [],
  deletedRecords = [],
  rowRecordIds = [],
  totalRecords = null,

  // ===== View & Filters =====
  viewFilters = [],
  defaultViewFilter = null,
  viewResetButtonVisible = false,
  isCustomViewEnabled = false,
  egCustomViewsSaveButtonEnabled = false,
  isAdminOrCustomizer = false,
  currentViewType = 'standard',
  canEditSharedView = false,
  viewType = null,

  // ===== Pagination =====
  pageNumber = 1,
  pageSize = 5,
  isPartialCount = false,

  // ===== Row Actions =====
  addRowsEnabled = true,
  addRowsLabel = 'Add Rows',

  // ===== Drag & Drop =====
  dragAndDrop = null,
  alwaysShowDragHandles = false,
  showDragOnHover = false,

  // ===== Sorting =====
  sorting = null,

  // ===== Display Preferences & Features =====
  displayPreferences = null,
  componentVersion = '0.0.0',
  accountingSoftware = 'All',

  // ===== Empty State & Menu =====
  emptyStateComponent = null,
  menuColumn,
  customActions = null,
  tooltipId,
  resetChipsTriggered = false,
  updateChipsInitialValues = false,
  gridPagingWrapperStyle = null,
  tableWrapperHeight = null,
  tableWrapperHoverState = null,
  tableBodyBackgroundColor = null,

  // ===== Event Handlers - Data Operations =====
  onGridSearch = null,
  onExport = null,
  onRefresh = null,
  onAddRows = null,
  onDelete = null,
  onDeleteConfirmation = null,

  // ===== Event Handlers - Row Operations =====
  onRowClick = null,
  onRowChange = null,
  onRenderRow = null,
  onSetRowStatus = null,
  onOutsideClick = null,

  // ===== Event Handlers - Selection =====
  onSelectAll = null,
  onSelectedRecords = null,
  onMultiSelect,
  onSelect,
  onSelectPage = null,
  onClickMany = null,

  // ===== Event Handlers - Pagination =====
  onPageChange = null,
  onPageLengthChange = null,

  // ===== Event Handlers - Column Operations =====
  onChangeColumnSorting = null,
  onActiveColumnsChange,
  onActiveMobileColumnsChange,
  onReorderColumns,

  // ===== Event Handlers - View & Filter Operations =====
  onChangeView = null,
  onShowSelected = null,
  onRemoveSelectedView = null,
  onAdvancedSearchChange,
  onFilterToggleAnalytics,
  onFetchChipsData,
  onClickShowSaveGridViewDialog = null,
  onClickResetButton = null,
  onToggleViewVisibility = null,
  onCustomViewsDragEnd = null,
  handleCustomViewsManageDoneClick = null,
  onSetDefaultView = null,
  onChipFilterApplied = null,
  onChipFilterRemoved = null,
  onUpdateCurrentView = null,
  onUpdateSharedView = null,
  setViewSaveAndResetButtonsVisible,
  hasOtherViewChanges = false,

  // ===== Event Handlers - Drag & Drop =====
  onReorder,

  // ===== Event Handlers - Media & Uploads =====
  onUploadImage,
  onDownloadImage,
  onErrorMessageForUser,

  // ===== Event Handlers - Custom Actions =====
  onCustomActionClick,
  variant = 'default',
  isV4Design = false,
  disableGoToPage = true,

  // ===== Design Mode/Within App Builder =====
  isDesignMode = false,
}) {
  // ===== Constants =====
  const extraSmallGridSize = 320;
  const queryAttr = 'data-rbd-draggable-id';

  // ===== Refs =====
  const tableRef = useRef();
  const scrollerRef = useRef();
  const { width: containerWidth, ref: containerRef } = useResizeDetector();

  // ===== Layout & Styling State =====
  const [internalColumns, setInternalColumns] = useState([]);
  const [defaultColumnWidth, setDefaultColumnWidth] = useState(0);
  const [highlightColumn, setHighlightColumn] = useState(null);

  // ===== Responsive & Display State =====
  const size = useMemo(() => {
    if (!responsive) return null;
    let breakpoint = getBreakpoint(containerWidth);
    if (isMobile) breakpoint = breakpointNames.xs;
    if (!isMobile && width.includes('px')) {
      const parsed = Number(width.replace('px', ''));
      breakpoint = containerWidth < parsed ? getBreakpoint(containerWidth) : getBreakpoint(parsed);
    }

    return breakpoint;
  }, [containerWidth, isMobile, responsive, width]);

  // ===== Editing State =====
  const [editingRow, setEditingRow] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [, setActiveCell] = useState(null);
  const [, setShowImageEditor] = useState(false);
  const [disableClickOutside, setDisableClickOutside] = useState(false);
  const [outsideClicked, setOutsideClicked] = useState(false);

  // ===== Data & Column State =====
  const [primaryKey, setPrimaryKey] = useState(null);

  // ===== Search & Filter State =====
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [allFiltersInvalidState, setAllFiltersInvalidState] = useState(false);
  const [forceClear, setForceClear] = useState(false);
  const [advancedSearchDrawerOpen, setAdvancedSearchDrawerOpen] = useState(defaultAdvancedSearchOpen);

  useEffect(() => {
    if (openAdvancedSearchOnMount) {
      setAdvancedSearchDrawerOpen(true);
    }
  }, [openAdvancedSearchOnMount]);

  // ===== View & Selection State =====
  const [previousViewId, setPreviousViewId] = useState(null);
  const [showSelectedRecords, setShowSelectedRecords] = useState(false);

  // ===== Selection & Checkbox State =====
  const [focusOnSelectAllCheckbox, setFocusOnSelectAllCheckbox] = useState(false);
  const [checked, setChecked] = useState(false);
  const [halfChecked, setHalfChecked] = useState(false);
  const [selectedOnPage, setSelectedOnPage] = useState(0);
  const [totalCheckboxesOnPage, setNumOfCheckboxes] = useState(0);
  const [allRecordsOnOnePage, setAllRecordsOnOnePage] = useState(false);
  const [newLinesAdded, setNewLinesAdded] = useState(false);
  const [focusAfterAddRows, setFocusAfterAddRows] = useState(null); // Track row index to focus after adding rows
  const [activeElement, setActiveElement] = useState({
    rowIndex: null,
    columnType: null,
  });

  // ===== Pagination State =====
  const [currentPage, setCurrentPage] = useState(pageNumber || 1);

  // ===== Drag & Drop State =====
  const [isDragging, setIsDragging] = useState(false);
  const [placeholderProps, setPlaceholderProps] = useState({});

  // ===== Effects - Force Clear Timeout =====
  useEffect(() => {
    if (forceClear) {
      const timeoutId = setTimeout(() => {
        setForceClear(false);
      }, 50);

      // Cleanup function to clear timeout when component unmounts
      // or when forceClear changes
      return () => clearTimeout(timeoutId);
    }
  }, [forceClear]);

  // ===== Computed Values - Search =====
  const searchableFields = useMemo(() => {
    const fields = [];
    columns.forEach((column) => {
      if (
        column.fieldType !== FieldTypeIds.Button &&
        column.fieldType !== FieldTypeIds.CardColumn &&
        column.fieldType !== FieldTypeIds.Picture &&
        column.fieldType !== FieldTypeIds.FileAttachment &&
        column.fieldType !== FieldTypeIds.ProfileImage
      ) {
        const updated = column;
        updated.type = fieldTypeNameLookup(column.fieldType);
        fields.push(updated);
      }
    });

    return fields;
  }, [columns]);

  // ===== Computed Values - Styling =====
  const controlStyle = useMemo(() => classConverter(classes), [classes]);

  const isCardColumnActive = useMemo(
    () => internalColumns.length === 1 && internalColumns[0].fieldType === FieldTypeIds.CardColumn,
    [internalColumns],
  );

  // ===== Computed Values - Pagination =====
  const totalRows = useMemo(() => (data ? data.length : 0), [data]);

  const start = useMemo(() => {
    if (isPageData || !pageNumber || !pageSize) return 0;
    return (pageNumber - 1) * pageSize;
  }, [isPageData, pageNumber, pageSize]);

  const end = useMemo(() => {
    if (isPageData || !pageNumber || !pageSize) return totalRows;
    return Math.min(totalRows, pageNumber * pageSize);
  }, [isPageData, pageNumber, pageSize, totalRows]);

  const showPaginationFooter = useMemo(
    () => (addRowsEnabled || showSelectedRecords || showPagination || showPageSize) && totalRows > 0,
    [addRowsEnabled, showSelectedRecords, showPagination, showPageSize, totalRows],
  );

  // ===== Effects - Page Number Sync =====
  useEffect(() => {
    if (pageNumber) setCurrentPage(pageNumber);
    else {
      setCurrentPage(1);
    }
  }, [pageNumber, data, pageSize]);

  useEffect(() => {
    // Don't override noSearchResults when all filters are invalid
    // (we want to show "No results" without making an API call)
    if (allFiltersInvalidState) {
      return;
    }

    if (isLoading) {
      setNoSearchResults(false);
      return;
    }

    if (editable) {
      const total = getRowCount(data, rowStatuses);
      if (total > 0) {
        setNoSearchResults(false);
        return;
      }

      if (
        !!searchValue ||
        (advancedSearchExpression &&
          (advancedSearchExpression.simple?.length > 0 || advancedSearchExpression.advanced?.length > 0))
      ) {
        setNoSearchResults(true);
        return;
      }
    }

    setNoSearchResults(!data || data.length === 0);
  }, [data, isLoading, rowStatuses, searchValue, advancedSearchExpression, editable, allFiltersInvalidState]);

  // Effect to focus first editable column after adding rows (AODA accessibility)
  useEffect(() => {
    if (focusAfterAddRows === null || !data || data.length <= focusAfterAddRows || !editable || isLoading) {
      return;
    }

    // Find the first editable column index
    const firstEditableColumnIndex = internalColumns?.findIndex(
      (column) =>
        column.visible &&
        column.editable !== false &&
        column.fieldType !== FieldTypeIds.Button &&
        column.fieldType !== FieldTypeIds.CardColumn &&
        column.fieldType !== FieldTypeIds.YesNo,
    );

    // If we found an editable column, set editing state (Cell component will handle focus automatically)
    if (firstEditableColumnIndex !== null && firstEditableColumnIndex >= 0) {
      setEditingCell(firstEditableColumnIndex);
      setEditingRow(focusAfterAddRows);

      // Clear flag after focus is set (input focus will handle scrolling automatically)
      setTimeout(() => {
        setFocusAfterAddRows(null);
      }, 200);
    } else {
      setFocusAfterAddRows(null);
    }
  }, [focusAfterAddRows, data, editable, isLoading, internalColumns, id, rowStatuses]);

  const onSetEditingRow = (rowId) => {
    if (editingRow && onRowChange) onRowChange(editingRow);
    setEditingRow(rowId);
  };

  const handleOutsideClick = () => {
    if (disableClickOutside || editingRow === null) return;

    // If dropdown list is opened in a modal on mobile devices, prevent outside click logic
    // Otherwise each click/touch event is considered as outside click and modal closes
    const isDropdownOpenedOnMobile = !!document.getElementById('dropdown-modal-opened');

    if (!isDropdownOpenedOnMobile) {
      setOutsideClicked(true);

      const timeoutId = setTimeout(() => {
        if (editingRow && onOutsideClick) onOutsideClick(editingRow);

        setOutsideClicked(false);
        onSetEditingRow(null);
        setEditingCell(null);
      }, 150);

      // Return cleanup function to clear the timeout
      return () => clearTimeout(timeoutId);
    }
  };

  const handleDeleteRow = (idx, primKey) => {
    if (onDelete) onDelete(idx, primKey);
  };

  const handleAddRows = (event) => {
    if (onAddRows) {
      // Store the current row count before adding rows so we know which row to focus
      const currentRowCount = data ? data.length : 0;
      onAddRows();

      // AODA: Only auto-focus if triggered by keyboard (Enter key), not mouse click
      // Check for our custom isKeyboardActivated flag from AddRow component
      const isKeyboardActivation = event?.isKeyboardActivated === true;

      if (isKeyboardActivation) {
        // Set the row index we should focus on (the first new row that will be added)
        // We'll focus this after the data updates
        setFocusAfterAddRows(currentRowCount);
      }
    }
  };

  const handleSearch = (value) => {
    setNoSearchResults(false);
    return onGridSearch(value);
  };

  const handleToggleAdvancedSearchDrawer = () => {
    const newState = !advancedSearchDrawerOpen;

    // Send analytics with new state
    if (onFilterToggleAnalytics) {
      onFilterToggleAnalytics(newState);
    }

    // Update state
    setAdvancedSearchDrawerOpen(newState);
  };

  const handleExpressionChange = (expression) => {
    // If all filters were invalid (e.g., "10--", "22++"), show "No results" immediately
    // without making an API call to the backend
    if (expression?.allFiltersInvalid) {
      setNoSearchResults(true);
      setAllFiltersInvalidState(true);
      // Don't call onAdvancedSearchChange - this prevents the API call to the backend
      // The grid will show "No results" state with "Clear filters" button
      return;
    }
    setAllFiltersInvalidState(false);
    setNoSearchResults(false);
    onAdvancedSearchChange(expression);
  };

  const handlePageChange = (value) => {
    if (onPageChange) onPageChange(value);
    else {
      setCurrentPage(value);
    }
  };

  // Using keyboard to navigate grid on 'checkbox' and 'delete icon' columns
  const handleKeyboardNavigation = (keyPressed, rowIndex, columnType) => {
    const newActiveElement = { columnType };

    if (keyPressed === 38) {
      if (rowIndex === 0 && columnType === 'checkbox') {
        setFocusOnSelectAllCheckbox(true); // sets focus to header checkbox in Header component
        newActiveElement.rowIndex = null;
        newActiveElement.columnType = null;
      } else newActiveElement.rowIndex = rowIndex - 1;
    }

    if (keyPressed === 40) {
      newActiveElement.rowIndex = rowIndex + 1;
      setFocusOnSelectAllCheckbox(false);
    }

    if (keyPressed === 35) {
      newActiveElement.rowIndex = rowIndex;
      setFocusOnSelectAllCheckbox(false);
    }

    if (keyPressed === 36) {
      if (columnType === 'checkbox') {
        setFocusOnSelectAllCheckbox(true);
        newActiveElement.rowIndex = null;
        newActiveElement.columnType = null;
      } else {
        newActiveElement.rowIndex = rowIndex;
        setFocusOnSelectAllCheckbox(false);
      }
    }

    setActiveElement(newActiveElement);
    onSetEditingRow(null);
  };

  const handleSelectedRecords = (showSelected) => {
    setShowSelectedRecords(showSelected);

    if (showSelected) {
      let currentFilter = viewFilters.filter((view) => view.id === selectedView);
      const selectedFilter = {
        name: '',
        id: '',
        columns: [],
        sorting: [],
        filtering: [],
        enableDynamicDates: false,
      };

      if (currentFilter.length <= 0) currentFilter = viewFilters[0];

      selectedFilter.name = `Selected - ${currentFilter[0].name}`;
      selectedFilter.id = Guid.create();
      selectedFilter.columns = currentFilter[0].columns;
      selectedFilter.sorting = currentFilter[0].sorting;

      if (invertSelection || (invertSelection && selectedRecordIds?.length > 0)) {
        selectedFilter.filtering = [
          {
            Operation: 0,
            DateField: null,
            Source: null,
          },
          {
            Operation: null,
            DateField: null,
            Source: {
              ValueType: 3,
              Value: 'RecordID',
              Property: 'Integer',
              ChildProperty: null,
              ValidationMessage: null,
              FontStyles: null,
            },
          },
          {
            Operation: 18,
            DateField: null,
            Source: null,
          },
          {
            Operation: null,
            DateField: null,
            Source: {
              ValueType: 9,
              Value: JSON.stringify(selectedRecordIds),
              Property: '',
              ChildProperty: null,
              ValidationMessage: null,
              FontStyles: null,
            },
          },
          {
            Operation: 1,
            DateField: null,
            Source: null,
          },
        ];
      } else {
        selectedFilter.filtering = [
          {
            Operation: 0,
            DateField: null,
            Source: null,
          },
          {
            Operation: null,
            DateField: null,
            Source: {
              ValueType: 3,
              Value: 'RecordID',
              Property: 'Integer',
              ChildProperty: null,
              ValidationMessage: null,
              FontStyles: null,
            },
          },
          {
            Operation: 17,
            DateField: null,
            Source: null,
          },
          {
            Operation: null,
            DateField: null,
            Source: {
              ValueType: 9,
              Value: JSON.stringify(selectedRecordIds),
              Property: '',
              ChildProperty: null,
              ValidationMessage: null,
              FontStyles: null,
            },
          },
          {
            Operation: 1,
            DateField: null,
            Source: null,
          },
        ];
      }

      setPreviousViewId(selectedView);
      onShowSelected(selectedFilter);
    } else {
      onChangeView(previousViewId, false);
      onRemoveSelectedView(selectedView);
      setPreviousViewId(null);
    }
  };

  useEffect(() => {
    if (!columns || columns.length === 0) {
      return;
    }

    const list = [];
    let colPercentage = 0;

    if (columns) {
      columns.map((column) => {
        if (column.primary) {
          setPrimaryKey(column.name);
        }

        list.push({
          ...column,
        });

        if (column.visible) {
          switch (column.width) {
            case 'sm':
              colPercentage += 1;
              break;
            case 'md':
              colPercentage += 2;
              break;
            case 'lg':
              colPercentage += 4;
              break;
            default:
              break;
          }
        }
        return true;
      });
    }

    setDefaultColumnWidth(colPercentage > 0 ? 100 / colPercentage : 0);
    setInternalColumns(list);
  }, [editable, size, tagsList, columns]);

  const isMobileColumnActive = isMobile && !!internalColumns.filter((col) => col.visibleOnMobile).length;

  const handleSelectAll = (isChecked) => {
    if (onSelectAll) onSelectAll(isChecked);
    if (onClickMany) onClickMany();
    if (isChecked) {
      onSelectedRecords([], [], [...deletedRecords]);
    } else {
      onSelectedRecords([], [], []);
    }
  };

  const formatValue = (cellValue, column) => {
    let formattedValue = cellValue;
    if (cellValue !== null && cellValue !== '' && cellValue !== undefined) {
      switch (column.fieldType) {
        case FieldTypeIds.Decimal:
        case FieldTypeIds.Integer:
        case FieldTypeIds.Money:
          formattedValue = formatCellValue(
            column,
            cellValue.toString().replace(',', '').replace('(', '').replace(')', ''),
            false,
            displayPreferences,
          );
          break;
        default:
          break;
      }
    }

    return formattedValue;
  };

  const formatMoney = (cellValue, formatOptions) => {
    let formattedValue = cellValue;
    if (cellValue !== null && cellValue !== '' && cellValue !== undefined) {
      const currencyCode = formatOptions?.currency;
      const homeCurrencyCode = formatOptions?.homeCurrency;
      const rounding = formatOptions?.rounding;
      formattedValue = formatMoneyValue(cellValue, currencyCode, homeCurrencyCode, { rounding });
    }
    return formattedValue;
  };

  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);
    return draggedDOM;
  };

  const handleDragStart = (event) => {
    const draggedDOM = getDraggedDom(event.draggableId);
    setIsDragging(true);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children].slice(0, sourceIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
      sourceIndex,
      type: event.type,
    });
  };

  const handleDragUpdate = (event) => {
    if (!event.destination) {
      return;
    }
    const draggedDOM = getDraggedDom(event.draggableId);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = event.destination.index;
    const sourceIndex = event.source.index;

    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
      sourceIndex,
      destinationIndex,
      type: event.type,
    });
  };

  const handleDragEnd = (result) => {
    // dropped outside the list
    setPlaceholderProps({});
    setIsDragging(false);

    if (!result.destination) {
      return;
    }

    if (result.type === 'ROW' && onReorder) {
      onReorder(result.source.index, result.destination.index);
    }
    if (result.type === 'COLUMN' && onReorderColumns) {
      // change back after column reordering fixed
      onReorderColumns(columns[result.source.index], columns[result.destination.index]);
      const baseColumns = [...columns];
      const [removedColumn] = baseColumns.splice(result.source.index, 1);
      baseColumns.splice(result.destination.index, 0, removedColumn);
    }
    setPlaceholderProps({});
  };

  const handleShowImageEditor = (column, value, rowIdx) => {
    setActiveCell({ column, value, rowIdx });
    setShowImageEditor(true);
  };

  const handleDisableClickOutside = (value) => {
    setDisableClickOutside(value);
  };

  const handleViewAll = () => {
    setForceClear(true);
    setNoSearchResults(false);
    setAllFiltersInvalidState(false);
    if (
      advancedSearchExpression &&
      (advancedSearchExpression.simple?.length > 0 || advancedSearchExpression.advanced?.length > 0) &&
      onAdvancedSearchChange
    ) {
      onAdvancedSearchChange({});
    }

    if (searchValue && onGridSearch) {
      onGridSearch(null);
    }
  };

  const handleActiveColumnsChange = (updates) => {
    if (isMobileColumnActive) {
      if (onActiveMobileColumnsChange) onActiveMobileColumnsChange(updates.map((x) => x.name));
    } else if (onActiveColumnsChange) {
      onActiveColumnsChange(updates.map((x) => x.name));
    }
  };

  const handleColumnHover = (column) => {
    if (showColumnClickHighlighting) setHighlightColumn(column);
  };

  const renderRow = (initialRowData, index) => {
    if (index < start || index >= end || initialRowData === null) return;
    if (onRenderRow) return onRenderRow(index);
    if (internalColumns.length === 0) return;

    const rowRecordId = initialRowData ? initialRowData[primaryKey] : null;

    const rowId = rowStatuses[index] === STATUSES.blank ? `${id}-BLANK-ROW-${index}` : `${id}-ROW-${index}`;
    let isSelected = selectedRecordIds.indexOf(rowRecordId) > -1 || selectedRows?.indexOf(index) > -1;
    const isUnselected = invertSelection && selectedRecordIds.indexOf(rowRecordId) > -1;
    isSelected = !isUnselected && (invertSelection || isSelected);
    let rowData = {};

    const distinctColumns = new Set([...columns, ...internalColumns]);

    distinctColumns.forEach((column) => {
      if (column.name === primaryKey) {
        rowData[column.name] = initialRowData[column.name];
      } else if (column.supportingColumns && Object.keys(column.supportingColumns).length > 0) {
        try {
          const json = JSON.parse(initialRowData[column.name]);
          const val = json?.data;
          const currencyCode = json?.currency ?? null;
          const homeCurrencyCode = json?.homeCurrency ?? null;

          rowData[`${column.name}_currencyMeta`] = { currency: currencyCode, homeCurrency: homeCurrencyCode };

          const canDisplayCurrencySymbols = displayPreferences && displayPreferences.enableCurrencySymbols;
          if (column.displayOptions.numberFormat === 1 && canDisplayCurrencySymbols) {
            let displayCurrency = currencyCode;

            // If QBDT is accounting package and currency is null/empty, use home currency code
            const isQBDT =
              (typeof accountingSoftware === 'string' && accountingSoftware.toLowerCase() === 'all') ||
              (typeof accountingSoftware === 'string' && accountingSoftware.toLowerCase() === '1');
            if (isQBDT && (displayCurrency === null || displayCurrency === '')) {
              displayCurrency = homeCurrencyCode;
            }

            rowData[column.name] = formatMoney(val, {
              currency: displayCurrency,
              homeCurrency: homeCurrencyCode,
              rounding: column.formatType?.rounding,
            });
          } else {
            rowData[column.name] = formatValue(val, column);
          }
          if (initialRowData[`${column.name}_displayValue`]) {
            rowData[`${column.name}_displayValue`] = rowData[column.name];
            rowData[column.name] = val;
          }
        } catch (e) {
          console.error('Error parsing supporting columns JSON', e); // eslint-disable-line no-console
        }
      } else {
        rowData[column.name] = formatValue(initialRowData[column.name], column);
        if (initialRowData[`${column.name}_displayValue`]) {
          rowData[`${column.name}_displayValue`] = formatValue(initialRowData[`${column.name}_displayValue`], column);
        }
      }
    });
    if (isCardColumnActive) {
      rowData = { Card: {} };
      ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'].forEach((element) => {
        if (internalColumns[0].cardColumnFields[element]) {
          const column = internalColumns[0].cardColumnFields[element];
          if (column.name === primaryKey) {
            rowData.Card[column.name] = initialRowData[column.name];
          } else {
            rowData.Card[column.name] = formatValue(
              column.accessorProp && initialRowData[column.name] !== null && initialRowData[column.name] !== undefined
                ? initialRowData[column.name][column.accessorProp]
                : initialRowData[column.name],
              column,
            );
          }
        }
      });
    }

    if (draggable)
      return (
        <DraggableRow
          key={index}
          id={rowId}
          index={index}
          activeElement={activeElement}
          canDelete={canDelete}
          columns={internalColumns}
          confirmDeletion={confirmDeletion}
          data={rowData}
          disabled={disabled}
          editable={editable}
          editingRow={editingRow}
          errorData={errorData ? errorData[index] : null}
          handleDeleteRow={handleDeleteRow}
          isMobile={isMobile || size === breakpointNames.xs}
          onDeleteConfirmation={onDeleteConfirmation}
          onKeyboardNavigation={handleKeyboardNavigation}
          onRowClick={onRowClick}
          onSetEditingRow={onSetEditingRow}
          onSetRowStatus={onSetRowStatus}
          primaryKeyName={primaryKey}
          selectable={selectable}
          setEditingCell={setEditingCell}
          status={rowStatuses ? rowStatuses[index] : STATUSES.unchanged}
          style={rowStyle}
          totalRows={data ? data.length : 0}
          displayPreferences={displayPreferences}
          defaultColumnWidth={defaultColumnWidth}
          dragAndDrop={dragAndDrop}
          editingCell={editingCell}
          isLoading={isLoading}
          isSelected={isSelected}
          onMultiSelect={onMultiSelect}
          onSelect={onSelect}
          outsideClicked={outsideClicked}
          scrollerRef={editable ? scrollerRef : null}
          tagsList={tagsList}
          tagsSuggestions={tagsSuggestions}
          onManageTags={onManageTags}
          draggable={draggable}
          reorderColumns={reorderColumns}
          columnSorting={onChangeColumnSorting !== null && onChangeColumnSorting !== undefined}
          onShowImageEditor={handleShowImageEditor}
          onUploadImage={onUploadImage}
          onDownloadImage={onDownloadImage}
          onDisableClickOutside={handleDisableClickOutside}
          onErrorMessageForUser={onErrorMessageForUser}
          showMobileCardColumn={isMobileColumnActive}
          enrichedData={enrichedData}
          alwaysShowDragHandles={alwaysShowDragHandles}
          showDragOnHover={showDragOnHover}
          menuColumn={menuColumn}
          rowBeingDragged={isDragging}
          tooltipId={tooltipId}
          highlightColumn={highlightColumn}
          onColumnHover={handleColumnHover}
          showVerticalDividers={showVerticalDividers}
          variant={variant}
        />
      );

    return (
      <Row
        key={index}
        id={rowId}
        index={index}
        activeElement={activeElement}
        canDelete={canDelete}
        columns={internalColumns}
        confirmDeletion={confirmDeletion}
        data={rowData}
        disabled={disabled}
        editable={editable}
        editingRow={editingRow}
        errorData={errorData ? errorData[index] : null}
        handleDeleteRow={handleDeleteRow}
        isMobile={isMobile || size === breakpointNames.xs}
        onDeleteConfirmation={onDeleteConfirmation}
        onKeyboardNavigation={handleKeyboardNavigation}
        onRowClick={onRowClick}
        onSetEditingRow={onSetEditingRow}
        onSetRowStatus={onSetRowStatus}
        primaryKeyName={primaryKey}
        selectable={selectable}
        setEditingCell={setEditingCell}
        status={rowStatuses ? rowStatuses[index] : STATUSES.unchanged}
        style={rowStyle}
        totalRows={data ? data.length : 0}
        displayPreferences={displayPreferences}
        defaultColumnWidth={defaultColumnWidth}
        dragAndDrop={dragAndDrop}
        editingCell={editingCell}
        isLoading={isLoading}
        isSelected={isSelected}
        onMultiSelect={onMultiSelect}
        onSelect={onSelect}
        outsideClicked={outsideClicked}
        scrollerRef={editable ? scrollerRef : null}
        tagsList={tagsList}
        tagsSuggestions={tagsSuggestions}
        onManageTags={onManageTags}
        draggable={draggable}
        reorderColumns={reorderColumns}
        columnSorting={onChangeColumnSorting !== null && onChangeColumnSorting !== undefined}
        onUploadImage={onUploadImage}
        onDownloadImage={onDownloadImage}
        onDisableClickOutside={handleDisableClickOutside}
        onShowImageEditor={handleShowImageEditor}
        onErrorMessageForUser={onErrorMessageForUser}
        showMobileCardColumn={isMobileColumnActive}
        enrichedData={enrichedData}
        menuColumn={menuColumn}
        tooltipId={tooltipId}
        highlightColumn={highlightColumn}
        onColumnHover={handleColumnHover}
        variant={variant}
        showVerticalDividers={showVerticalDividers}
      />
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragUpdate={handleDragUpdate}>
      {caption && !hideCaption && showViewFilter && viewFilters.length > 1 && (
        <Caption
          id={id}
          align={controlStyle && controlStyle.capAlign ? controlStyle.capAlign : null}
          color={controlStyle && controlStyle.capColor ? controlStyle.capColor : null}
          label={caption}
        />
      )}
      <s.Container
        ref={containerRef}
        id={id}
        width={width}
        height={height}
        fillParentHeight={fillParentHeight}
        disabled={disabled}
        style={{ maxWidth }}
        compact={compact}
      >
        <s.HeaderWrapper fillParentHeight={fillParentHeight}>
          <SearchHeader
            actionButton={actionButton}
            allRecordsOnOnePage={allRecordsOnOnePage}
            caption={caption}
            checked={checked}
            controlStyle={controlStyle}
            deletedRecordsCount={deletedRecords.length}
            disabled={disabled}
            focusSearchInputOnLoad={focusSearchInputOnLoad}
            halfChecked={halfChecked}
            hideCaption={hideCaption}
            id={id}
            newLinesAdded={newLinesAdded}
            onChangeView={onChangeView}
            onExport={onExport}
            onRefresh={onRefresh}
            onSearch={handleSearch}
            onSelectAll={handleSelectAll}
            rowStatuses={rowStatuses}
            searchValue={searchValue}
            searchable={searchable}
            selectedOnPage={selectedOnPage}
            showExport={showExport}
            showInlineExport={showInlineExport}
            selectedView={selectedView}
            showReload={showReload}
            showSelectedRecords={showSelectedRecords}
            showViewFilter={showViewFilter}
            totalCheckboxesOnPage={totalCheckboxesOnPage}
            totalRecords={isPartialCount ? 0 : totalRecords}
            totalRows={data ? data.length : 0}
            viewFilters={viewFilters}
            searchStyle={searchStyle}
            columns={internalColumns}
            fullColumnList={columns}
            sorting={sorting}
            onChangeColumnSorting={onChangeColumnSorting}
            invertSelection={invertSelection}
            selectedRecordIds={selectedRecordIds}
            size={size}
            hasAdvancedSearch={hasAdvancedSearch}
            onToggleAdvancedSearchDrawer={handleToggleAdvancedSearchDrawer}
            chipsFilterCount={chipsFilterCount}
            parentMaxWidth={containerWidth}
            onChangeActiveColumns={handleActiveColumnsChange}
            showShowHideColumns={showShowHideColumns}
            customActions={customActions}
            onCustomActionClick={onCustomActionClick}
            activeColumns={internalColumns?.filter((x) => (isMobileColumnActive ? x.visibleOnMobile : x.visible))}
            isCustomViewEnabled={isCustomViewEnabled}
            egCustomViewsSaveButtonEnabled={egCustomViewsSaveButtonEnabled}
            onClickShowSaveGridViewDialog={onClickShowSaveGridViewDialog}
            isAdminOrCustomizer={isAdminOrCustomizer}
            defaultViewId={defaultViewFilter}
            onToggleViewVisibility={onToggleViewVisibility}
            onCustomViewsDragEnd={onCustomViewsDragEnd}
            handleCustomViewsManageDoneClick={handleCustomViewsManageDoneClick}
            isMobile={isMobile}
            onSetDefaultView={onSetDefaultView}
            isDesignMode={isDesignMode}
            isV4Design={isV4Design}
          />
          {hasAdvancedSearch && (
            <s.AdvancedSearchDrawer open={advancedSearchDrawerOpen}>
              <ChipsFilter
                displayPreferences={displayPreferences}
                simpleChipsExpression={advancedSearchExpression?.simple}
                advancedChipsExpression={advancedSearchExpression?.advanced}
                fieldList={searchableFields}
                id={id}
                isMobile={isMobile || size === breakpointNames.xs}
                onExpressionChange={handleExpressionChange}
                tagsList={tagsList}
                tagsSuggestions={tagsSuggestions}
                onManageTags={onManageTags}
                onSearch={onFetchChipsData}
                viewResetButtonVisible={viewResetButtonVisible}
                setViewSaveAndResetButtonsVisible={setViewSaveAndResetButtonsVisible}
                hasOtherViewChanges={hasOtherViewChanges}
                options={chipsData}
                forcedTimeZone={forcedTimeZone}
                disableMaxWidth={containerWidth <= extraSmallGridSize}
                forceClear={forceClear}
                resetChipsTriggered={resetChipsTriggered}
                egCustomViewsSaveButtonEnabled={egCustomViewsSaveButtonEnabled}
                onClickShowSaveGridViewDialog={onClickShowSaveGridViewDialog}
                onClickResetButton={onClickResetButton}
                onChipFilterApplied={onChipFilterApplied}
                onChipFilterRemoved={onChipFilterRemoved}
                currentViewType={currentViewType}
                onUpdateCurrentView={onUpdateCurrentView}
                canEditSharedView={canEditSharedView}
                onUpdateSharedView={onUpdateSharedView}
                updateInitialValues={updateChipsInitialValues}
                viewType={viewType}
              />
            </s.AdvancedSearchDrawer>
          )}
        </s.HeaderWrapper>
        <ClickOutside parentRef={tableRef} onClickOutsideHandler={handleOutsideClick}>
          <s.TableWrapper
            ref={tableRef}
            id={`${id}-TABLE-WRAPPER`}
            height={tableWrapperHeight}
            fillParentHeight={fillParentHeight}
            tableWrapperHoverState={tableWrapperHoverState}
            variant={variant}
            showVerticalDividers={showVerticalDividers}
          >
            <s.Scroller
              ref={scrollerRef}
              id={`${id}-SCROLLER`}
              width={width}
              fillParentHeight={fillParentHeight}
              visibleOverflow={overflow}
              showPaginationFooter={showPaginationFooter}
              componentVersion={componentVersion}
            >
              <Table
                canDelete={canDelete}
                columnTotals={columnTotals}
                columns={internalColumns}
                displayPreferences={displayPreferences}
                id={id}
                isLoading={isLoading}
                isMobile={isMobile}
                noSearchResults={noSearchResults}
                pageNumber={currentPage}
                pageSize={pageSize}
                rowStatuses={rowStatuses}
                selectable={selectable}
                showHeader={showHeader && !isCardColumnActive}
                totalRows={data ? data.length : 0}
                confirmDeletion={confirmDeletion}
                editingCell={editingCell}
                editingRow={editingRow}
                isPageData={isPageData}
                searchValue={searchValue}
                data={data}
                emptyStateComponent={emptyStateComponent}
                borderlessLoader={borderlessLoader}
                loaderTopPadding={loaderTopPadding}
                tableBodyBackgroundColor={tableBodyBackgroundColor}
                draggable={draggable}
                selectedRows={selectedRows}
                rowRecordIds={rowRecordIds}
                disabled={disabled}
                checked={checked}
                totalRecords={totalRecords}
                halfChecked={halfChecked}
                setHalfChecked={setHalfChecked}
                setChecked={setChecked}
                setSelectedOnPage={setSelectedOnPage}
                setNumOfCheckboxes={setNumOfCheckboxes}
                setNewLinesAdded={setNewLinesAdded}
                onClickMany={onClickMany}
                setAllRecordsOnOnePage={setAllRecordsOnOnePage}
                onSelectPage={onSelectPage}
                onKeyboardNavigation={handleKeyboardNavigation}
                focusOnSelectAllCheckbox={focusOnSelectAllCheckbox}
                reorderColumns={reorderColumns}
                editable={editable}
                defaultColumnWidth={defaultColumnWidth}
                onChangeColumnSorting={onChangeColumnSorting}
                sorting={sorting}
                invertSelection={invertSelection}
                selectedRecordIds={selectedRecordIds}
                placeholderProps={placeholderProps}
                showMobileCardColumn={isMobileColumnActive}
                size={size}
                noSearchHeader={
                  !showExport &&
                  !showReload &&
                  !searchable &&
                  !onChangeColumnSorting &&
                  !actionButton &&
                  !showShowHideColumns &&
                  selectedRecordIds?.length === 0 &&
                  !invertSelection &&
                  (!customActions || customActions.length === 0) &&
                  (viewFilters.length <= 1 || !showViewFilter) &&
                  (!caption || hideCaption)
                }
                showResponsiveCard={
                  responsive &&
                  size === breakpointNames.xs &&
                  columns.length > 2 &&
                  !isCardColumnActive &&
                  internalColumns &&
                  internalColumns.length > 0 &&
                  internalColumns[0].cardColumnFields &&
                  !editable &&
                  !selectable
                }
                containerWidth={null}
                onViewAll={handleViewAll}
                hasAdvancedSearch={
                  allFiltersInvalidState ||
                  (advancedSearchExpression &&
                    (advancedSearchExpression.simple?.length > 0 || advancedSearchExpression.advanced?.length > 0))
                }
                highlightColumn={highlightColumn}
                variant={variant}
              >
                {data && data.map((rowData, index) => renderRow(rowData, index))}
              </Table>
            </s.Scroller>
          </s.TableWrapper>
        </ClickOutside>
        {showPaginationFooter && (
          <s.PaginationRow
            fillParentHeight={fillParentHeight}
            style={gridPagingWrapperStyle}
            id={`${id}-GRID-PAGING-WRAPPER`}
          >
            <s.AddRowCol>
              {addRowsEnabled && editable && (
                <AddRow disabled={disabled} id={id} label={addRowsLabel} onClick={handleAddRows} />
              )}
              {(showSelectedRecords || (selectable && selectedRecordIds.length > 0 && totalRecords > pageSize)) && (
                <ShowSelectedRecords
                  id={id}
                  onClick={handleSelectedRecords}
                  style={{ flexGrow: 1 }}
                  selectedRecordsCount={selectedRecordIds.length}
                />
              )}
            </s.AddRowCol>
            <s.PaginationCol id={`${id}-GRID-PAGING`} end='true' isMobile={isMobile} style={footerStyle}>
              {showPageSize && pageSize !== 1000 && (
                <PerPageSelector disabled={disabled} id={id} selected={pageSize} onChange={onPageLengthChange} />
              )}
              {showPagination && (
                <Pagination
                  disabled={disabled}
                  id={id}
                  pageNumber={currentPage}
                  perPage={pageSize}
                  totalRows={getRowCount(data, rowStatuses)}
                  totalRecords={totalRecords}
                  rowStatuses={rowStatuses}
                  isPartialCount={isPartialCount}
                  onClickMany={onClickMany}
                  onClickNext={handlePageChange}
                  onClickPrevious={handlePageChange}
                  onPageSelect={handlePageChange}
                  isMobile={isMobile}
                  hideRecordCount={hideRecordCount}
                  disableGoToPage={disableGoToPage}
                />
              )}
            </s.PaginationCol>
          </s.PaginationRow>
        )}
      </s.Container>
    </DragDropContext>
  );
}

Grid.propTypes = propTypes;
export default Grid;
