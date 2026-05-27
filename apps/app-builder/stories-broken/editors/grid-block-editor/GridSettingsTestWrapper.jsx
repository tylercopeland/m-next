/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import Grid from '@m-next/grid';
import { FieldTypeIds } from '@m-next/types';
import { createTheme, ThemeProvider } from '@mui/material';
import { colors, lightTheme } from '@m-next/styles';
import BreadCrumbHeader from '@m-next/bread-crumbs';
import GridSettings from '../../../src/views/layout-designer/editors/grid-block-editor/GridSettings';
import fieldListContacts from '../../../testing/data/fieldListContacts.json';
import fieldListActivities from '../../../testing/data/fieldListActivities.json';
import ViewSettings from '../../../src/views/layout-designer/editors/grid-block-editor/ViewSettings';
import ColumnSettings from '../../../src/views/layout-designer/editors/grid-block-editor/ColumnSettings';

function GridSettingsTestWrapper({
  variant,
  control,
  disabled,
  onSendAnalytics,
  displayPreferences,
  controlList,
  tableList,
}) {
  // const actionButton = <Button id='retry-emails-btn' value='Retry failed emails' isV4Design />;
  const theme = createTheme(lightTheme);
  const [tableName, setTableName] = useState(control?.viewFriendlyName);
  const [internalControl, setInternalControl] = useState(control);
  const [selectedView, setSelectedView] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const fieldList = useMemo(() => {
    if (!tableName) {
      return [];
    }
    return tableName === 'Contacts' ? fieldListContacts : fieldListActivities;
  }, [tableName]);

  const fakeData = useMemo(() => {
    if (internalControl.columns?.length > 0) {
      const data = [];
      for (let i = 0; i < internalControl.paging?.pageSize; i += 1) {
        const row = {};
        internalControl.columns.forEach((column) => {
          row[column.field] = `${column.header}-${i}`;
        });
        data.push(row);
      }
      return data;
    }
    return [];
  }, [internalControl.columns, internalControl.paging?.pageSize]);

  const currentView = useMemo(
    () => internalControl.viewList.find((view) => view.id === (selectedView || control?.defaultViewFilter)),
    [control?.defaultViewFilter, internalControl.viewList, selectedView],
  );

  const currentColumn = useMemo(
    () => internalControl.columns.find((column) => column.field === selectedColumn),
    [internalControl.columns, selectedColumn],
  );

  const crumbs = useMemo(() => {
    const crumbList = [
      {
        id: 'grid-settings-crumb',
        label: 'Grid',
        onClick:
          selectedView || selectedColumn
            ? () => {
                setSelectedView(null);
                setSelectedColumn(null);
              }
            : null,
      },
    ];
    if (selectedView) {
      crumbList.push({ id: 'view-settings-crumb', label: currentView.name });
    }
    if (selectedColumn) {
      crumbList.push({ id: 'column-settings-crumb', label: currentColumn.header });
    }
    return crumbList;
  }, [currentColumn?.header, currentView?.name, selectedColumn, selectedView]);

  const columns = useMemo(() => {
    if (!internalControl.columns) {
      return null;
    }

    if (!currentView) return null;

    const colList = [];
    currentView.columns.forEach((column) => {
      const col = internalControl.columns.find((c) => c.field === column.field);
      colList.push({
        name: col.field,
        accessorProp: col.fieldType === FieldTypeIds.DropDown ? 'text' : null,
        buttonLabel: col.fieldType === FieldTypeIds.Button ? col.control.caption : null,
        cardColumnFields: col.cardColumnFields,
        columnAlign: col.format?.alignment,
        columnType: col.columnType,
        editable: !col.readOnly,
        errorAccessor: `${col.field}Error`,
        fieldType: col.fieldType,
        formatType: {
          type: col.format?.type,
          separator: col.format?.separator,
          rounding: col.format?.rounding,
          money: col.format?.money,
          dateType: col.format?.dateType,
        },
        formatStyle: {
          textColor: col.format?.textColor,
          fontSize: col.format?.fontSize,
          backgroundColor: col.format?.backgroundColor,
          disabled: col.format?.disabled,
        },
        headerAlign: col.format?.headerAlignment || col.format?.alignment,
        hasColumnTotal: col.hasColumnTotal,
        caption: col.header,
        primary: col.field === 'RecordID',
        showOnMobile: col.showOnMobile,
        visible: column.visible,
        width: col.format?.width === 'fixed' ? `${col.format?.widthFixed}px` : col.format?.width,
      });
    });
    return colList;
  }, [currentView, internalControl.columns]);

  const handleTableChange = (table) => {
    setTableName(table);
  };

  const handleControlChange = (newControl) => {
    if (newControl.viewFriendlyName !== tableName) {
      setTableName(newControl.viewFriendlyName);
    }
    setInternalControl({ ...newControl });
  };

  const handleViewChange = (view) => {
    const viewIndex = internalControl.viewList.findIndex((v) => v.id === view.id);
    const update = { ...internalControl, viewList: [...internalControl.viewList] };
    update.viewList[viewIndex] = view;
    setInternalControl(update);
  };

  const handleColumnChange = (column) => {
    const columnIndex = internalControl.columns.findIndex((c) => c.field === column.field);
    const update = { ...internalControl, columns: [...internalControl.columns] };
    update.columns[columnIndex] = column;
    setInternalControl(update);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxHeight: 550, display: 'flex' }}>
        <div
          style={{
            width: '100%',
            overflowY: 'scroll',
            background: internalControl.visible ? null : colors['grey-lighter'],
          }}
        >
          <Grid
            addRowsEnabled={internalControl.canAddMoreRows && !internalControl.isReadOnly}
            addRowsLabel={internalControl.addLabel}
            canDelete={internalControl.showDeleteColumn}
            caption={internalControl.caption}
            classes={internalControl.classes}
            confirmDeletion={internalControl.showDeleteConfirmation}
            defaultViewFilter={internalControl.defaultViewFilter}
            disabled={internalControl.disabled || internalControl.isWorking || !internalControl.visible}
            editable={!internalControl.isReadOnly}
            hideCaption={internalControl.hideCaption}
            id='test-grid'
            isMobile={false}
            isLoading={false}
            pageNumber={internalControl.paging.pageNumber}
            pageSize={internalControl.paging.pageSize}
            isPartialCount={false}
            searchable={internalControl.isSearchable}
            searchValue={internalControl.searchString}
            selectable={internalControl.isSelectable}
            selectedRecordIds={internalControl.selectionInfo ? internalControl.selectionInfo.recordIDs : []}
            invertSelection={internalControl.selectionInfo ? internalControl.selectionInfo.allExcept : false}
            selectedRows={internalControl.selectedRows || []}
            selectedView={selectedView || internalControl.defaultViewFilter}
            showExport={internalControl.showExport}
            showGoToPage={internalControl.showGoToPage ? internalControl.showGoToPage : false}
            showViewFilter={!internalControl.hideViewSelector}
            totalRecords={fakeData.length > 0 ? 314 : 0}
            totalRows={fakeData.length}
            viewFilters={internalControl.viewList}
            visible={internalControl.visible}
            columns={columns}
            isPageData
            data={fakeData}
            displayPreferences={displayPreferences}
            sorting={internalControl.sorting}
            reorderColumns={internalControl.canReorderColumns}
            showReload={internalControl.showRefresh}
            responsive={false}
            hasAdvancedSearch
            advancedSearchExpression={null}
            onChangeColumnSorting={internalControl.showSort ? () => {} : null}
            showHeader={!internalControl.hideColumnHeaders}
          />
        </div>
        <div style={{ minWidth: 384, maxHeight: 500, overflowY: 'scroll' }}>
          <BreadCrumbHeader id='grid-crumbs' crumbs={crumbs} style={{ marginLeft: 8 }} />
          {!selectedView && !selectedColumn && (
            <GridSettings
              variant={variant}
              fieldList={fieldList}
              onTableChange={handleTableChange}
              control={control}
              onChange={handleControlChange}
              disabled={disabled}
              onSendAnalytics={onSendAnalytics}
              displayPreferences={displayPreferences}
              controlList={controlList}
              tableList={tableList}
              onEditView={(id) => setSelectedView(id)}
              onEditColumn={(field) => setSelectedColumn(field)}
            />
          )}
          {selectedView && (
            <ViewSettings
              columns={internalControl.columns}
              fieldList={fieldList}
              onChange={handleViewChange}
              view={currentView}
              viewFriendlyName={internalControl.viewFriendlyName}
            />
          )}
          {selectedColumn && <ColumnSettings column={currentColumn} onChange={handleColumnChange} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default GridSettingsTestWrapper;
