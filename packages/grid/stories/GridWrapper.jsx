import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import Button from '@m-next/button';
import { ExpressionElement, Tag, sortTypes } from '@m-next/types';
import Column from '../src/ColumnPropType';
import Grid from '../src';

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasAdvancedSearch: PropTypes.bool,
  caption: PropTypes.string,
  data: PropTypes.instanceOf(Object),
  errorData: PropTypes.instanceOf(Object),
  rowStyle: PropTypes.instanceOf(Object),
  searchStyle: PropTypes.instanceOf(Object),
  footerStyle: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  columns: PropTypes.arrayOf(Column),

  reorderColumns: PropTypes.bool,

  selectable: PropTypes.bool,

  rowStatuses: PropTypes.instanceOf(Array),
  selectedView: PropTypes.string,

  viewFilters: PropTypes.instanceOf(Array),

  onClickMany: PropTypes.func,
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
  overflowVisible: PropTypes.bool,

  displayPreferences: PropTypes.instanceOf(Object),
  showHeader: PropTypes.bool,
  dragAndDrop: PropTypes.instanceOf(Object),
  onMultiSelect: PropTypes.func,

  // header: PropTypes.shape({
  showExport: PropTypes.bool,
  showGoToPage: PropTypes.bool,
  showViewFilter: PropTypes.bool,
  showReload: PropTypes.bool,
  searchValue: PropTypes.string,
  searchable: PropTypes.bool,
  focusSearchInputOnLoad: PropTypes.bool,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  onGridSearch: PropTypes.func,
  //  }),
  // row: PropTypes.shape({
  canDelete: PropTypes.bool,
  confirmDeletion: PropTypes.bool,
  onDelete: PropTypes.func,
  onRowClick: PropTypes.func,
  onDeleteConfirmation: PropTypes.func,
  onRenderRow: PropTypes.func,
  onRowChange: PropTypes.func,
  //  }),
  //  footer: PropTypes.shape({
  addRowsEnabled: PropTypes.bool,
  addRowsLabel: PropTypes.string,
  showPageSize: PropTypes.bool,
  showPagination: PropTypes.bool,

  onAddRows: PropTypes.func,
  //  }),
  emptyStateComponent: PropTypes.func,
  borderlessLoader: PropTypes.bool,
  loaderTopPadding: PropTypes.number,
  gridPagingWrapperStyle: PropTypes.instanceOf(Object),
  tableWrapperHeight: PropTypes.string,
  tableWrapperHoverState: PropTypes.bool,
  tableBodyBackgroundColor: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  tagsSuggestions: PropTypes.arrayOf(PropTypes.string),
  draggable: PropTypes.bool,
  compact: PropTypes.bool,
  containerWidth: PropTypes.string,
  isPageData: PropTypes.bool,
  responsive: PropTypes.bool,
  onUploadImage: PropTypes.func,
  showSort: PropTypes.bool,
  advancedSearchExpression: PropTypes.shape({
    simpleChipsExpression: PropTypes.arrayOf(ExpressionElement),
    advancedChipsExpression: PropTypes.arrayOf(ExpressionElement),
  }),
  dataMultiplier: PropTypes.number,
  initialPageSize: PropTypes.number,
  showInlineExport: PropTypes.bool,
  showShowHideColumns: PropTypes.bool,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

function GridWrapper({
  id = null,
  isMobile = false,
  isLoading = false,
  data = {},
  errorData = {},
  columns = [],
  rowStyle = null,
  searchStyle = null,
  footerStyle = null,
  width = '100%',
  maxWidth,
  // header = {
  showExport = false,
  showGoToPage = false,
  showViewFilter = true,
  showReload = true,
  focusSearchInputOnLoad = false,
  searchValue = null,
  searchable = true,

  onExport = null,
  onGridSearch = null,

  onRefresh = null,
  // },
  // row = {
  canDelete = true,
  confirmDeletion = false,

  onDelete = null,
  onDeleteConfirmation = null,
  onRowClick = null,
  onRowChange = null,
  onRenderRow = null,
  // },

  // footer = {
  addRowsEnabled = true,
  addRowsLabel = 'Add Rows',
  showPageSize = true,
  showPagination = true,
  onAddRows = null,
  // },

  disabled = false,
  editable = false,

  reorderColumns = false,

  selectable = false,
  selectedView = null,

  rowStatuses = [],
  viewFilters = [],
  onClickMany = null,
  onChangeView = null,

  caption = '',
  hideCaption = true,
  classes = null,
  deletedRecords = [],
  rowRecordIds = [],
  columnTotals = [],
  showHeader = true,

  onRemoveSelectedView = null,
  onShowSelected = null,
  onOutsideClick = null,
  overflowVisible = false,
  displayPreferences = null,
  dragAndDrop = null,
  onSetRowStatus = null,
  onMultiSelect,
  tagsList,
  tagsSuggestions,
  emptyStateComponent = null,
  borderlessLoader = false,
  loaderTopPadding = null,
  gridPagingWrapperStyle = null,
  tableWrapperHeight = null,
  tableWrapperHoverState = null,
  tableBodyBackgroundColor = null,
  draggable = false,
  compact = false,
  containerWidth = '100%',
  isPageData = false,
  responsive = true,
  onUploadImage,
  showSort = true,
  hasAdvancedSearch = false,
  advancedSearchExpression = null,
  dataMultiplier = 1,
  initialPageSize = 10,
  showInlineExport = false,
  showShowHideColumns = false,
  customActions = [],
}) {
  const [sort, setSort] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [internalSelectedRows, setSelectedRows] = useState([]);
  const [internalSelectedRecordIDs, setInternalSelectedRecordIDs] = useState([]);
  const [internalAllExcept, setAllExcepts] = useState(false);
  const [transformedData, setTransformedData] = useState(data);
  const [transformedColumns, setTransformedColumns] = useState(columns);
  const [advancedSearch, setAdvancedSearch] = useState(advancedSearchExpression);
  const [searchText, setSearchText] = useState(searchValue);

  useEffect(() => {
    const updated = [];
    for (let x = 0; x < dataMultiplier; x++) {
      for (let i = 0; i < data.length; i++) {
        const copy = { ...data[i] };
        copy.RecordID += x * data.length;
        updated.push(copy);
      }
    }

    setTransformedData(updated);
  }, [data, dataMultiplier]);

  const toggleData = () => {
    if (transformedData.length === 0) {
      setTransformedData(data);
    } else {
      setTransformedData([]);
    }
  };

  const handleSort = (sortField, sortType) => {
    setSort({ sortField, sortType });
    const transformed = [...transformedData];
    transformed.sort((a, b) => {
      const first = a[sortField] ? a[sortField] : '';
      const second = b[sortField] ? b[sortField] : '';

      if (first < second) {
        return sortType === sortTypes.Descending ? 1 : -1;
      }
      if (first > second) {
        return sortType === sortTypes.Descending ? -1 : 1;
      }
      return 0;
    });
    setTransformedData(transformed);
  };

  const handleOnSelectPage = (isChecked) => {
    let recordIDs = [...internalSelectedRecordIDs];
    // let selectedRows = [...internalSelectedRows];

    const totalRows = transformedData ? transformedData.length : 0;
    let start = 0;
    if (isPageData || !pageNumber || !pageSize) start = 0;
    else start = (pageNumber - 1) * pageSize;

    let end = totalRows;
    if (isPageData || !pageNumber || !pageSize) end = totalRows;
    end = Math.min(totalRows, pageNumber * pageSize);

    for (let index = start; index < end; index++) {
      if (isChecked) {
        recordIDs.push(transformedData[index].RecordID);
        //   selectedRows.push(index);
      } else {
        //   selectedRows = selectedRows.filter((x) => x !== index);
        recordIDs = recordIDs.filter((x) => x !== transformedData[index].RecordID);
      }
    }
    setInternalSelectedRecordIDs(recordIDs);
    //  setSelectedRows(selectedRows);
  };

  const handleSelectedRecords = (selectionInfoRecordIDs, selectedRows) => {
    setInternalSelectedRecordIDs(selectionInfoRecordIDs);
    setSelectedRows(selectedRows);
  };

  const handleSelectAll = (ToF) => {
    setAllExcepts(ToF);
  };

  const handleOnSelect = (recordId, rowIdx, isChecked) => {
    let selectionInfoRecordIDs = [...internalSelectedRecordIDs];
    let selectedRows = [...internalSelectedRows];

    if (isChecked && recordId) {
      selectionInfoRecordIDs.push(recordId);
    }
    if (!isChecked && recordId) {
      selectionInfoRecordIDs = selectionInfoRecordIDs.filter((x) => x !== recordId);
    }

    if (isChecked && !recordId) {
      selectedRows.push(rowIdx);
    }
    if (!isChecked && !recordId) {
      selectedRows = selectedRows.filter((x) => x !== rowIdx);
    }

    if (internalAllExcept && recordId) {
      selectionInfoRecordIDs = isChecked
        ? selectionInfoRecordIDs.filter((x) => x !== recordId)
        : selectionInfoRecordIDs.push(recordId);
    }

    setInternalSelectedRecordIDs(selectionInfoRecordIDs);
    setSelectedRows(selectedRows);
  };

  const handlePageLengthChange = (value) => {
    setPageNumber(1);
    setPageSize(value);
  };

  const handlePageChange = (value) => {
    setPageNumber(value);
  };

  const handleReorderRows = (startIndex, endIndex) => {
    const result = [...transformedData];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTransformedData(result);
  };

  const handleReorderColumns = (startIndex, endIndex) => {
    const result = [...transformedColumns];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTransformedColumns(result);
  };

  // const actionButton = <Button id='retry-emails-btn' value='Retry failed emails' isV4Design />;

  return (
    <div style={{ maxWidth: containerWidth, maxHeight: 600, overflow: 'scroll' }}>
      <Grid
        id={id}
        isMobile={isMobile}
        isLoading={isLoading}
        data={transformedData}
        errorData={errorData}
        columns={transformedColumns}
        rowStyle={rowStyle}
        searchStyle={searchStyle}
        footerStyle={footerStyle}
        width={width}
        maxWidth={maxWidth}
        showExport={showExport}
        showGoToPage={showGoToPage}
        showViewFilter={showViewFilter}
        showReload={showReload}
        focusSearchInputOnLoad={focusSearchInputOnLoad}
        searchValue={searchText}
        searchable={searchable}
        onExport={onExport}
        onGridSearch={(text) => {
          if (onGridSearch) onGridSearch(text);
          else {
            setSearchText(text);
            toggleData();
          }
        }}
        onRefresh={onRefresh}
        onSelectAll={handleSelectAll}
        onSelectedRecords={handleSelectedRecords}
        onSelect={handleOnSelect}
        onSelectPage={handleOnSelectPage}
        invertSelection={internalAllExcept}
        selectedRecordIds={internalSelectedRecordIDs}
        // },
        // row = {
        canDelete={canDelete}
        confirmDeletion={confirmDeletion}
        onDelete={onDelete}
        onDeleteConfirmation={onDeleteConfirmation}
        onRowClick={onRowClick}
        onRowChange={onRowChange}
        onRenderRow={onRenderRow}
        // },

        // footer = {
        addRowsEnabled={addRowsEnabled}
        addRowsLabel={addRowsLabel}
        pageNumber={pageNumber}
        pageSize={pageSize}
        showPageSize={showPageSize}
        showPagination={showPagination}
        onAddRows={onAddRows}
        onPageChange={handlePageChange}
        onPageLengthChange={handlePageLengthChange}
        isPartialCount={false}
        // },

        disabled={disabled}
        editable={editable}
        reorderColumns={reorderColumns}
        selectable={selectable}
        selectedRows={internalSelectedRows}
        selectedView={selectedView}
        totalRecords={transformedData.length}
        rowStatuses={rowStatuses}
        viewFilters={viewFilters}
        onClickMany={onClickMany}
        onChangeColumnSorting={showSort ? handleSort : null}
        onChangeView={onChangeView}
        caption={caption}
        hideCaption={hideCaption}
        classes={classes}
        deletedRecords={deletedRecords}
        rowRecordIds={rowRecordIds}
        columnTotals={columnTotals}
        showHeader={showHeader}
        onRemoveSelectedView={onRemoveSelectedView}
        onShowSelected={onShowSelected}
        onOutsideClick={onOutsideClick}
        overflowVisible={overflowVisible}
        displayPreferences={displayPreferences}
        dragAndDrop={dragAndDrop}
        onSetRowStatus={onSetRowStatus}
        onMultiSelect={onMultiSelect}
        tagsList={tagsList}
        tagsSuggestions={tagsSuggestions}
        emptyStateComponent={emptyStateComponent}
        borderlessLoader={borderlessLoader}
        loaderTopPadding={loaderTopPadding}
        gridPagingWrapperStyle={gridPagingWrapperStyle}
        tableWrapperHeight={tableWrapperHeight}
        tableWrapperHoverState={tableWrapperHoverState}
        tableBodyBackgroundColor={tableBodyBackgroundColor}
        draggable={draggable}
        onReorder={handleReorderRows}
        onReorderColumns={handleReorderColumns}
        compact={compact}
        sorting={sort}
        responsive={responsive}
        onUploadImage={onUploadImage}
        hasAdvancedSearch={hasAdvancedSearch}
        advancedSearchExpression={advancedSearch}
        onFetchChipsData={() => {}}
        onAdvancedSearchChange={(value) => {
          setAdvancedSearch(value);
          toggleData();
        }}
        chipsData={[
          { value: 'open', label: 'Open' },
          { value: 'running', label: 'Running' },
          { value: 'closed', label: 'Closed' },
          { value: ' Bad"Data ', label: ' Bad"Data ' },
        ]}
        showInlineExport={showInlineExport}
        showShowHideColumns={showShowHideColumns}
        customActions={customActions}
        onCustomActionClick={() => {}}
        fillParentHeight
        variant='modern'
        //   actionButton={actionButton}
      />
    </div>
  );
}

GridWrapper.propTypes = propTypes;
export default GridWrapper;
