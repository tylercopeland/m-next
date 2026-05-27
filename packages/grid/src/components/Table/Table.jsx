import React from 'react';
import PropTypes from 'prop-types';
import { Sorting } from '@m-next/types';

import * as s from './Table.styles';
import Body from './Body';

import Footer from '../Footer';
import Column from '../../ColumnPropType';
import Header from '../Header';

const propTypes = {
  id: PropTypes.string,
  showHeader: PropTypes.bool,
  isLoading: PropTypes.bool,
  noSearchResults: PropTypes.bool,
  onRenderRow: PropTypes.func,
  rowStatuses: PropTypes.arrayOf(PropTypes.number),
  totalRows: PropTypes.number,
  columns: PropTypes.arrayOf(Column),
  isMobile: PropTypes.bool,
  selectable: PropTypes.bool,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  columnTotals: PropTypes.arrayOf(PropTypes.number),
  displayPreferences: PropTypes.instanceOf(Object),
  canDelete: PropTypes.bool,
  editingRow: PropTypes.number,
  editingCell: PropTypes.number,
  isPageData: PropTypes.bool,
  searchValue: PropTypes.string,
  emptyStateComponent: PropTypes.func,
  borderlessLoader: PropTypes.bool,
  loaderTopPadding: PropTypes.number,
  tableBodyBackgroundColor: PropTypes.string,
  draggable: PropTypes.bool,

  invertSelection: PropTypes.bool,
  selectedRecordIds: PropTypes.arrayOf(PropTypes.number),
  selectedRows: PropTypes.arrayOf(PropTypes.number),
  rowRecordIds: PropTypes.arrayOf(PropTypes.number),

  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  totalRecords: PropTypes.number,
  halfChecked: PropTypes.bool,

  setHalfChecked: PropTypes.func,
  setChecked: PropTypes.func,
  setSelectedOnPage: PropTypes.func,
  setNumOfCheckboxes: PropTypes.func,
  setNewLinesAdded: PropTypes.func,
  onClickMany: PropTypes.func,
  setAllRecordsOnOnePage: PropTypes.func,
  onSelectPage: PropTypes.func,
  onKeyboardNavigation: PropTypes.func,
  focusOnSelectAllCheckbox: PropTypes.bool,
  reorderColumns: PropTypes.bool,
  editable: PropTypes.bool,
  defaultColumnWidth: PropTypes.number,
  onChangeColumnSorting: PropTypes.func,
  sorting: Sorting,
  children: PropTypes.node,
  placeholderProps: PropTypes.instanceOf(Object),
  size: PropTypes.string,

  showMobileCardColumn: PropTypes.bool,
  noSearchHeader: PropTypes.bool,
  showResponsiveCard: PropTypes.bool,
  containerWidth: PropTypes.number,
  onViewAll: PropTypes.func,
  hasAdvancedSearch: PropTypes.bool,
  highlightColumn: PropTypes.string,
  variant: PropTypes.string,
};

function Table({
  columns,
  id,
  showHeader,
  totalRows,
  isLoading,
  noSearchResults,
  onRenderRow,
  rowStatuses,
  isMobile,
  selectable,
  pageSize,
  pageNumber,
  columnTotals,
  displayPreferences,
  canDelete,
  editingRow,
  editingCell,
  isPageData,
  searchValue,
  emptyStateComponent,
  borderlessLoader,
  loaderTopPadding,
  tableBodyBackgroundColor,
  draggable,
  invertSelection,
  selectedRecordIds,
  selectedRows,
  rowRecordIds,
  disabled,
  checked,
  totalRecords,
  halfChecked,
  setHalfChecked,
  setChecked,
  setSelectedOnPage,
  setNumOfCheckboxes,
  setNewLinesAdded,
  onClickMany,
  setAllRecordsOnOnePage,
  onSelectPage,
  onKeyboardNavigation,
  focusOnSelectAllCheckbox,
  reorderColumns,
  editable,
  defaultColumnWidth,
  onChangeColumnSorting,
  sorting,
  placeholderProps,
  children,
  showMobileCardColumn,
  size,
  noSearchHeader,
  showResponsiveCard,
  containerWidth,
  onViewAll,
  hasAdvancedSearch,
  highlightColumn,
  variant,
}) {
  return (
    <s.Table
      id={`${id}-TABLE`}
      aria-colcount={columns.length}
      aria-rowcount={totalRows}
      role='grid'
      noSearchHeader={noSearchHeader}
    >
      {showHeader && !showResponsiveCard && (
        <Header
          selectedRows={selectedRows}
          rowRecordIds={rowRecordIds}
          columns={columns}
          id={id}
          isMobile={isMobile}
          disabled={disabled}
          rowStatuses={rowStatuses}
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
          pageSize={pageSize}
          onSelectPage={onSelectPage}
          onKeyboardNavigation={onKeyboardNavigation}
          selectable={selectable}
          focusOnSelectAllCheckbox={focusOnSelectAllCheckbox}
          reorderColumns={reorderColumns}
          canDelete={canDelete}
          editable={editable}
          defaultColumnWidth={defaultColumnWidth}
          onChangeColumnSorting={onChangeColumnSorting}
          sorting={sorting}
          invertSelection={invertSelection}
          selectedRecordIds={selectedRecordIds}
          placeholderProps={placeholderProps}
          draggableRows={draggable}
          showMobileCardColumn={showMobileCardColumn}
          size={size}
          containerWidth={containerWidth}
          highlightColumn={highlightColumn}
        />
      )}
      <Body
        id={`${id}-TABLE-BODY`}
        emptyStateComponent={emptyStateComponent}
        isLoading={isLoading}
        noSearchResults={noSearchResults}
        onRenderRow={onRenderRow}
        rowStatuses={rowStatuses}
        showHeader={showHeader && showResponsiveCard}
        totalRows={totalRows}
        pageNumber={pageNumber}
        pageSize={pageSize}
        editingCell={editingCell}
        editingRow={editingRow}
        isPageData={isPageData}
        columns={columns}
        searchValue={searchValue}
        borderlessLoader={borderlessLoader}
        loaderTopPadding={loaderTopPadding}
        tableBodyBackgroundColor={tableBodyBackgroundColor}
        draggable={draggable}
        placeholderProps={placeholderProps}
        onViewAll={onViewAll}
        hasAdvancedSearch={hasAdvancedSearch}
      >
        {children}
      </Body>
      <Footer
        canDelete={canDelete}
        columnTotals={columnTotals}
        columns={columns}
        displayPreferences={displayPreferences}
        id={id}
        isMobile={isMobile}
        pageNumber={pageNumber}
        pageSize={pageSize}
        selectable={selectable}
        totalRows={totalRows}
        noSearchResults={noSearchResults}
        variant={variant}
      />
    </s.Table>
  );
}

export default Table;

Table.propTypes = propTypes;
