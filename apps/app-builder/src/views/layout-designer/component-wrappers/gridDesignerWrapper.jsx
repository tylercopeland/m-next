import React, { useEffect, Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { Guid, interactions, toCamelCase } from '@m-next/utilities';
import Button from '@m-next/button';
import { FieldTypeIds } from '@m-next/types';

import {
  selectControls,
  selectActiveRecordId,
  controlSelected,
  selectSelectedControlId,
  selectSelectedControlProperty,
} from '../../../common/services/screenLayoutSlice';
import * as s from './designerWrapper.styles';
import { selectScreenId, selectAccountingType } from '../../../common/services/appSlice';
import { useGetGridDataLegacyQuery } from '../../../common/services/runtimeApi';
import { selectAccountName, selectDisplayPreferences } from '../../../common/services/sessionSlice';
import { useGetTagSuggestionsQuery } from '../../../common/services/tagsApi';

const Grid = React.lazy(() => import('@m-next/grid'));

// types
const propTypes = {
  id: PropTypes.string,
  onControlChange: PropTypes.func,
};
const getColumn = (field, control) => {
  if (!control || !control.columns || !Array.isArray(control.columns)) {
    return null;
  }
  return control.columns.filter((x) => x.field === field)[0];
};
const getCurrentView = (control, currentViewFilter) => {
  if (!control || !control.viewList || !Array.isArray(control.viewList)) {
    return null;
  }
  return control.viewList.filter((x) => x.id === currentViewFilter)[0];
};
const buildColumnList = (currentControl, currentViewFilter, handleColumnClick) => {
  const colList = [];
  if (!currentControl) return colList;
  const currentView = getCurrentView(currentControl, currentViewFilter);

  if (currentView) {
    const hasViewMobileConfig = currentView.columns.some((c) => c.visibleOnMobile != null);
    currentView.columns.forEach((view) => {
      const col = getColumn(view.field, currentControl);
      if (col) {
        const column = {
          name: col.field,
          accessorProp: col.fieldType === FieldTypeIds.DropDown || col.fieldType === FieldTypeIds.MultiSelectDropDown ? 'text' : null,
          buttonLabel: col.fieldType === FieldTypeIds.Button ? col.control?.caption : null,
          cardColumnFields: col.cardColumnFields,
          columnAlign: col.format.alignment,
          columnType: col.columnType,
          editable: false,
          errorAccessor: `${col.field}Error`,
          fieldType: col.fieldType,
          formatType: {
            type: col.format.type,
            separator: col.format.separator,
            rounding: col.format.rounding,
            money: col.format.money,
            dateType: col.format.dateType,
          },
          formatStyle: {
            textColor: col.format.textColor,
            fontSize: col.format.fontSize,
            backgroundColor: col.format.backgroundColor,
            disabled: col.format.disabled,
            fontWeight: col.format.fontWeight,
          },
          headerAlign: col.format.headerAlignment || col.format.alignment,
          hasColumnTotal: col.hasColumnTotal,
          caption: col.header,
          primary: col.field === 'RecordID',
          showOnMobile: col.showOnMobile,
          visibleOnMobile: hasViewMobileConfig ? Boolean(view.visibleOnMobile) : Boolean(col.showOnMobile),
          visible: Boolean(view.visible),
          width: col.format.width,
          widthFixed: col.format.widthFixed,
          widthAutoSize: col.format.widthAutoSize,
          displayAs: col.displayAs,
          displayOptions: col.displayOptions,
          showHeader: col.showHeader,
          control: toCamelCase(col.control),
          onColumnClick: handleColumnClick,
          onClick: handleColumnClick, // button click
          supportingColumns: col.supportingColumns,
        };
        colList.push(column);
      }
    });
  }

  return colList;
};

function GridDesignerWrapper({ id, onControlChange }) {
  const dispatch = useDispatch();
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const accountingType = useSelector(selectAccountingType);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const baseControl = useSelector((state) => selectControls(state)[id]);
  const selectedControlId = useSelector(selectSelectedControlId);
  const selectedControlProperty = useSelector(selectSelectedControlProperty);
  const [rowStatuses, setRowStatuses] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [columns, setColumns] = useState([]);
  const [control, setControl] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [columnTotals, setColumnTotals] = useState([]);
  const [sort, setSort] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasAdvancedSearch] = useState(true);
  const [currentViewFilter, setCurrentViewFilter] = useState(null);

  const [partialRecordCount, setPartialRecordCount] = useState(0);
  const accountName = useSelector(selectAccountName);

  const { data: tagList } = useGetTagSuggestionsQuery({ accountName });

  const { data, error, isFetching, refetch } = useGetGridDataLegacyQuery(
    {
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: { ...control, viewFilter: currentViewFilter },
      },
    },
    { skip: !control || !control.columns || control.columns.length === 0 },
  );

  useEffect(() => {
    const updated = { ...baseControl };
    if (!updated.paging) {
      updated.paging = {
        pageSize: 10,
        pageNumber: 1,
      };
    }
    const view = updated.viewFilter === Guid.empty() ? updated.defaultViewFilter : updated.viewFilter;
    if (!currentViewFilter) setCurrentViewFilter(view);
    setPageSize(updated.paging.pageSize);
    setControl(updated);
  }, [baseControl, currentViewFilter]);

  useEffect(() => {
    if (data) {
      setPartialRecordCount(data.partialRowCount);
      setRowStatuses(data.dataSource.map(() => 0));
      setTotalRecords(data.totalRows);
      const cleanData = [];
      const cleanErrorData = [];

      const currentView = getCurrentView(control, currentViewFilter);
      if (!currentView) {
        return;
      }

      const totals = currentView.columns.map((view) => {
        const column = control.columns.find((x) => x.field === view.field);
        if (!column) return null;
        if (
          column.fieldType === FieldTypeIds.Decimal ||
          column.fieldType === FieldTypeIds.Integer ||
          column.fieldType === FieldTypeIds.Money
        )
          return 0;
        return null;
      });

      data.dataSource.forEach((element) => {
        const rowData = {};
        const rowErrorData = {};
        element.cells.forEach((cell, index) => {
          const col = getColumn(cell.name, control);

          if (col) {
            switch (col.fieldType) {
              case FieldTypeIds.DropDown:
              case FieldTypeIds.MultiSelectDropDown:
                rowData[cell.name] = { text: cell.text, value: cell.value };
                break;
              default:
                rowData[cell.name] = cell.value;
                break;
            }

            if (col.displayOptions?.numberFormat === 1) {  // Money format for EG columns 
              try {
                const cellJson = typeof cell.value === 'string' ? JSON.parse(cell.value) : cell.value;
                const cellData = typeof cellJson === 'object' ? (cellJson?.data ?? 0) : 0;
                rowData[`${cell.name}_displayValue`] = cellData;
                totals[index] += cellData && !Number.isNaN(Number(cellData)) ? parseFloat(cellData) : 0;
              }
              catch (e) {  // Don't add to total on parse error
                console.error('Error parsing money value while calculating total:', e);
                rowData[`${cell.name}_displayValue`] = cell.value;
              }
            }

            if (cell.validationError) {
              rowErrorData[cell.name] = cell.validationError;
            }
            if (totals[index] !== null && col.displayOptions?.numberFormat !== 1) {  // Sum for money format type is handled above
              totals[index] += cell && !Number.isNaN(Number(cell.value)) && cell.value ? parseFloat(cell.value) : 0;
            }
          }
        });
        cleanData.push(rowData);
        cleanErrorData.push(rowErrorData);
      });
      setGridData(cleanData);
      setErrorData(cleanErrorData);
      setColumnTotals(totals);
    }
  }, [isFetching, data, currentViewFilter, control?.columns, control]);

  const handleRefetch = () => {
    if (refetch) refetch();
  };

  const handleColumnClick = (e, name) => {
    dispatch(controlSelected({ controlId: id, property: { selectedColumn: name, selectedChildColumn: null } }));
    interactions.preventPropagation(e);
  };

  useEffect(() => {
    setColumns(buildColumnList(control, currentViewFilter, handleColumnClick));
     
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control, currentViewFilter, baseControl]);

  const handleSort = (sortField, sortType, source, event) => {
    dispatch(controlSelected({ controlId: id, property: { selectedColumn: sortField, selectedChildColumn: null } }));
    interactions.preventPropagation(event);

    setSort({ sortField, sortType });
    const update = { ...control };
    update.sorting = { sortField, sortType };
    setControl(update);
    if (onControlChange) {
      onControlChange(id, update);
    }
  };

  const handleReorderColumns = (startIndex, endIndex) => {
    if (!control || !control.viewList || !Array.isArray(control.viewList)) {
      return;
    }
    const index = control.viewList.findIndex((x) => x.id === currentViewFilter);
    if (index === -1) return;
    const baseColumns = [...control.viewList[index].columns];
    const [removedColumn] = baseColumns.splice(startIndex, 1);
    baseColumns.splice(endIndex, 0, removedColumn);
    const newViewList = [...control.viewList];
    newViewList[index].columns = baseColumns;
    const update = { ...control };
    update.viewList = newViewList;
    setControl(update);
    if (onControlChange) {
      onControlChange(id, update);
    }
  };

  const handlePageLengthChange = (value) => {
    setPageNumber(1);
    setPageSize(value);
  };

  const handlePageChange = (value) => {
    setPageNumber(value);
  };

  const handleGridSearch = (value) => {
    const updated = { ...control, searchString: value };
    setControl(updated);
    if (onControlChange) {
      onControlChange(id, updated);
    }
  };

  const handleAdvancedSearch = (value) => {
    const updated = { ...control, searchFilter: value };
    setControl(updated);
    if (onControlChange) {
      onControlChange(id, updated);
    }
  };

  const handleChangeView = (filterId, clearSelected, e, updatePanel = true) => {
    setPageNumber(1);
    setColumns(buildColumnList(control, currentViewFilter, handleColumnClick));
    setCurrentViewFilter(filterId);
    if (updatePanel) {
      dispatch(
        controlSelected({
          controlId: id,
          property: { selectedView: filterId, selectedColumn: null, selectedChildColumn: null },
        }),
      );
      interactions.preventPropagation(e);
    }
  };

  useEffect(() => {
    if (selectedControlId === id) {
      if (selectedControlProperty?.selectedView && currentViewFilter !== selectedControlProperty.selectedView) {
        handleChangeView(selectedControlProperty.selectedView, true, null, false);
      } else if (!selectedControlProperty?.selectedView && control && currentViewFilter !== control.defaultViewFilter) {
        handleChangeView(control.defaultViewFilter, true, null, false);
      }
    }
     
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentViewFilter, id, selectedControlId, selectedControlProperty, control?.viewList]);

  return (
    <>
      {(!control || !control.columns || control.columns.length === 0) && (
        <s.EmptyWrapper id={`${id}-no-fields`}>
          <strong>Grid not configured</strong>
          <span>To add columns to Editable Grid, please use Grid Builder</span>
        </s.EmptyWrapper>
      )}

      {control && control.columns && control.columns.length > 0 && error && (
        <s.EmptyWrapper id={`${id}-no-fields`}>
          <strong>Grid failed to load </strong>
        </s.EmptyWrapper>
      )}

      {control && control.columns && control.columns.length > 0 && !error && (
        <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
          <div style={{ position: 'relative' }}>
            <Grid
              onRefresh={handleRefetch}
              searchable={control.isSearchable}
              searchValue={control.searchString}
              selectAll={control.selectAll}
              showExport={control.showExport}
              showGoToPage={control.showGoToPage ? control.showGoToPage : false}
              showViewFilter={!control.hideViewSelector}
              canDelete={control.showDeleteColumn}
              confirmDeletion={control.showDeleteConfirmation}
              addRowsEnabled={control.canAddMoreRows && !control.isReadOnly}
              addRowsLabel={control.addLabel}
              addRowsCount={control.newRowsCount}
              pageNumber={pageNumber}
              pageSize={pageSize}
              caption={control.caption}
              classes={control.classes}
              displayPreferences={displayPreferences}
              defaultViewFilter={control.defaultViewFilter}
              disabled={control.disabled || control.isWorking}
              editable
              hideCaption={control.hideCaption}
              id={control.name}
              isLoading={isFetching}
              rowStatuses={rowStatuses}
              selectable={control.isSelectable}
              selectedRecords={control.selectedRecords || []}
              selectedRows={control.selectedRows || []}
              selectedView={currentViewFilter}
              totalRecords={totalRecords === 0 && partialRecordCount > 0 ? partialRecordCount : totalRecords}
              unselectedRecords={control.unselectedRecords || []}
              viewFilters={(() => {
                const filterVisible = (views) =>
                  (views || []).filter((x) => x.isVisible || x.isVisible === undefined || x.isVisible === null);

                const standardViews = filterVisible(control.viewList);
                const customViews = filterVisible(control.model?.customViews);
                const sharedViews = filterVisible(control.model?.sharedViews);

                // Always use categorized format for consistent styling
                const categories = [];
                if (control.isCustomViewEnabled) {
                  // When custom views feature is enabled, show all categories
                  if (customViews.length > 0) categories.push(['My Views', customViews]);
                  if (sharedViews.length > 0) categories.push(['Shared Views', sharedViews]);
                }
                // Always include Standard Views
                if (standardViews.length > 0) categories.push(['Standard Views', standardViews]);
                return categories;
              })()}
              isCustomViewEnabled
              visible={control.visible}
              errorData={errorData}
              columns={columns}
              data={gridData}
              columnTotals={columnTotals}
              isMobile={false}
              isPartialCount={totalRecords === 0 && partialRecordCount > 0}
              showReload={control.showRefresh}
              onReorderColumns={handleReorderColumns}
              reorderColumns={control.canReorderColumns}
              sorting={sort}
              onChangeColumnSorting={control.showSort ? handleSort : null}
              onPageChange={handlePageChange}
              onPageLengthChange={handlePageLengthChange}
              tagsList={tagList?.others}
              responsive={control.isResponsive}
              actionButton={
                control.onActionButtonClick ? (
                  <Button id={`${id}-action-button`} value={control?.actionButtonLabel} isV4Design />
                ) : null
              }
              hasAdvancedSearch={hasAdvancedSearch}
              customActions={
                control.showExportToMailChimp ? [{ label: 'Export to Mailchimp', value: 'exportToMailChimp' }] : null
              }
              showShowHideColumns={control.showShowHideColumns}
              onGridSearch={handleGridSearch}
              onAdvancedSearchChange={handleAdvancedSearch}
              onChangeView={handleChangeView}
              showColumnClickHighlighting
              showVerticalDividers={control.showVerticalDividers}
              variant="modern"
              disableGoToPage={false}
              accountingSoftware={accountingType}
              isDesignMode
            />
          </div>
        </Suspense>
      )}
    </>
  );
}

GridDesignerWrapper.propTypes = propTypes;
export default GridDesignerWrapper;
