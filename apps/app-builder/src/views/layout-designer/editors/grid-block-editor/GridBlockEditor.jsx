/**
 * GridBlockEditor component for editing grid blocks in the layout designer.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.rawControl - The raw control data for the grid.
 * @param {Function} props.onChange - Callback function to handle changes to the grid control.
 * @param {Function} props.onActionChange - Callback function to handle action changes.
 * @param {Function} props.onSendAnalytics - Callback function to send analytics data.
 * @param {Object} props.featureFlags - Feature flags for enabling/disabling features.
 * @param {Function} props.onSelect - Callback function to handle selection changes.
 * @param {Object} props.controlProperty - The control property object.
 * @param {string} props.controlProperty.selectedProperty - The selected property.
 * @param {string} props.controlProperty.selectedView - The selected view.
 * @param {string} props.controlProperty.selectedColumn - The selected column.
 *
 * @returns {JSX.Element} The rendered GridBlockEditor component.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import { toCamelCase } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import Grid from './type';
import { useGetFieldsForTableQuery, useGetTablesQuery } from '../../../../common/services/tablesFieldsApi';
import GridSettings from './GridSettings';
import { selectControls } from '../../../../common/services/screenLayoutSlice';
import ViewSettings from './ViewSettings';
import ColumnSettings from './ColumnSettings';
import { createGridControl, createGridView, createGridViewColumn, migrateGridColumn } from '../../control-classes';

// types
const propTypes = {
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
  rawControl: Grid,
  onSendAnalytics: PropTypes.func,
  onSelect: PropTypes.func,
  controlProperty: PropTypes.shape({
    selectedProperty: PropTypes.string,
    selectedView: PropTypes.string,
    selectedColumn: PropTypes.string,
  }),
};

function GridBlockEditor({
  rawControl,
  onChange,
  onAddAction,
  onSendAnalytics,
  onSelect,
  controlProperty
}) {
  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controlList = useSelector(selectControls);
  const { selectedView, selectedColumn, selectedChildColumn } = controlProperty || {};
  const [lastControlId, setLastControlId] = useState(null);


  const control = useMemo(() => {
    const defaultControl = createGridControl();
    if (lastControlId !== rawControl.id) {
      setLastControlId(rawControl.id);
    }

    // Merge rawControl with defaultControl, but don't let null values override defaults
    const mergedControl = { ...defaultControl };
    if (rawControl) {
      Object.keys(rawControl).forEach(key => {
        if (rawControl[key] !== null && rawControl[key] !== undefined) {
          mergedControl[key] = rawControl[key];
        }
      });
    }

    const merged = toCamelCase({ ...mergedControl });

    return merged;
     
  }, [lastControlId, rawControl]);

  const currentView = useMemo(() => {
    const viewId = selectedView || control?.defaultViewFilter;
    // Search in all view lists: standard, custom, and shared
    const allViews = [
      ...(control.viewList || []),
      ...(control.model?.customViews || []),
      ...(control.model?.sharedViews || []),
    ];
    return allViews.find((view) => view.id === viewId);
  }, [control?.defaultViewFilter, control.viewList, control.model?.customViews, control.model?.sharedViews, selectedView]);

  const currentColumn = useMemo(
    () => control.columns.find((column) => column.field === selectedColumn),
    [control.columns, selectedColumn],
  );

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: control.viewFriendlyName, complexFields: false },
    { skip: !control || !control.viewFriendlyName },
  );

  // Migrate columns to latest format when fieldList is available
  useEffect(() => {
    if (control.columns.length > 0 && fieldList) {
      let migrated = false;
      const transformed = control.columns.map((column) => {
        const field = fieldList?.find((item) => item.name === column.field) || null;
        const col = migrateGridColumn(column, field);
        if (col) {
          migrated = true;
          return col;
        }
        return column;
      });

      if (migrated) {
        const updated = { ...control, columns: transformed };
        onChange(updated);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldList, control.id]);

  const { data: tableList } = useGetTablesQuery({ accountName }, { skip: !control });

  const handleViewChange = (view) => {
    const viewIndex = control.viewList.findIndex((v) => v.id === view.id);
    const update = { ...control, viewList: [...control.viewList] };
    update.viewList[viewIndex] = view;
    onChange(update);
  };

  const handleColumnChange = (column) => {
    const columnIndex = control.columns.findIndex((c) => c.field === column.field);
    const update = { ...control, columns: [...control.columns] };
    update.columns[columnIndex] = column;
    onChange(update);
  };

  const handleAddColumnAction = (column, eventName) => {
    const columnIndex = control.columns.findIndex((c) => c.field === column.field);
    const update = { ...control, columns: [...control.columns] };
    update.columns[columnIndex] = column;
    onAddAction(update, eventName);
  };

  const handleAddView = () => {
    const view = createGridView({ name: 'New View' });
    const updated = { ...control, viewList: [...control.viewList, view] };
    control.columns.forEach((column) => {
      view.columns.push(createGridViewColumn({ field: column.field, caption: column.header, visible: true }));
    });
    onChange(updated);
    onSelect(control.id, { ...controlProperty, selectedView: view.id, selectedChildColumn: null });
  };

  const renderGridTabs = () => {
    if (selectedView && currentView) {
      return (
        <ViewSettings
          columns={control.columns}
          fieldList={fieldList}
          onChange={handleViewChange}
          view={currentView}
          viewFriendlyName={control.viewFriendlyName}
          controlList={controlList}
        />
      );
    }
    if (selectedColumn && currentColumn) {
      return (
        <ColumnSettings
          column={currentColumn}
          columns={fieldList}
          onChange={handleColumnChange}
          viewFriendlyName={control.viewFriendlyName}
          controlList={controlList}
          displayPreferences={displayPreferences}
          fieldList={fieldList}
          selectedChildColumn={selectedChildColumn}
          onSelectChild={(field) =>
            onSelect(control.id, { selectedColumn: currentColumn.field, selectedChildColumn: field })
          }
          control={control}
          onAddAction={handleAddColumnAction}
        />
      );
    }
    return (
      <GridSettings
        id={control.id}
        control={control}
        onChange={onChange}
        controlList={controlList}
        displayPreferences={displayPreferences}
        fieldList={fieldList}
        tableList={tableList}
        onSendAnalytics={onSendAnalytics}
        onEditColumn={(field) =>
          onSelect(control.id, { ...controlProperty, selectedColumn: field, selectedChildColumn: null })
        }
        onEditView={(view) =>
          onSelect(control.id, { ...controlProperty, selectedView: view, selectedChildColumn: null })
        }
        onAddView={handleAddView}
        loadingFieldList={loadingFieldList}
        onAddAction={onAddAction}
      />
    );
  };

  return (
    <RumComponentContextProvider componentName='GridBlockEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      {renderGridTabs()}
    </RumComponentContextProvider>
  );
}

GridBlockEditor.propTypes = propTypes;
export default GridBlockEditor;
