/**
 * GridSettings component for editing the base configuration and styles of the grid.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.control - The grid control model.
 * @param {Function} props.onChange - Callback function to handle changes in the grid settings.
 * @param {Function} props.onAddView - Callback function to handle adding a new view.
 * @param {Function} props.onEditView - Callback function to handle editing an existing view.
 * @param {Function} props.onEditColumn - Callback function to handle editing a column.
 * @param {Array<Object>} props.fieldList - List of fields available for the grid.
 * @param {Array<Object>} props.tableList - List of tables available for the grid.
 * @param {boolean} props.loadingFieldList - Flag indicating if the field list is loading.
 *
 * @returns {JSX.Element} The GridSettings component.
 */
import React, { useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import { Guid } from '@m-next/utilities';

import TableDropdown from '../common/components/table-dropdown/TableDropdown';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from './GridBlockEditor.styles';
import GridModel from './type';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import GridDisplaySection from './sections/GridDisplaySection';
import GridInteractionsSection from './sections/GridInteractionsSection';
import GridColumnsSection from './sections/GridColumnsSection';
import GridViewsSection from './sections/GridViewsSection';
import { createGridView, migrateGrid } from '../../control-classes';

// types
const propTypes = {
  onChange: PropTypes.func,
  onAddView: PropTypes.func,
  onEditView: PropTypes.func,
  onEditColumn: PropTypes.func,
  control: GridModel,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  tableList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  loadingFieldList: PropTypes.bool,
  onAddAction: PropTypes.func,
};

function GridSettings({
  control,
  onChange,
  onAddView,
  onEditView,
  fieldList,
  tableList,
  onEditColumn,
  loadingFieldList,
  onAddAction,
}) {
  const [resetGrid, setResetGrid] = useState(control.columns.length === 0);

  const columns = useMemo(() => {
    const viewFilter = control.viewList.find((view) => view.id === control.defaultViewFilter);
    const orderedColumns = viewFilter?.columns?.map((column) => {
      const match = control.columns.find((x) => x.field === column.field);
      if (match) {
        return { ...match, visible: column.visible };
      }
      return null;
    });

    return orderedColumns?.filter((x) => x !== null) || [];
  }, [control.columns, control.defaultViewFilter, control.viewList]);

  // reset grid when viewFriendlyName changes and new fieldList has been loaded.
  useEffect(() => {
    if (fieldList?.length > 0) {
      const updated = migrateGrid(control, fieldList, resetGrid);
      if (updated) {
        onChange(updated);
        setResetGrid(false);
      }
    }
     
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldList]);

  const events = useMemo(() => {
    if (control.onActiveRowChange) {
      return [{ id: control.onActiveRowChange, value: 'Row Click', label: 'Row click' }];
    }
  }, [control.onActiveRowChange]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleChange = (updated) => {
    onChange(updated);
  };

  const handleTableChange = (newTable) => {
    const view = createGridView({ name: 'All', caption: 'All' });
    const updated = {
      ...control,
      viewFriendlyName: newTable,
      columns: [],
      viewList: [view],
      defaultViewFilter: view.id,
    }; // reset columns
    setResetGrid(true);
    onChange(updated);
  };

  // hide action list until action editor is implemented
  const handleAddAction = (property, eventName) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };
  
  return (
    <RumComponentContextProvider componentName='GridSettings'>
      <s.Wrapper padding={16}>
        <TextLine>Editing the base configuration and styles of the grid.</TextLine>
        <s.LineWrapper>
          <Text>Grid type</Text>
          <ButtonGroupRow
            id='grid-type'
            width={184}
            selected={control.isReadOnly}
            data={[
              { value: true, label: 'Read only' },
              { value: false, label: 'Editable' },
            ]}
            onClick={(e) => handlePropertyChange('isReadOnly', e.value)}
          />
        </s.LineWrapper>
        <s.LineWrapper align='baseline'>
          <Text>Table</Text>
          <TableDropdown
            tableList={tableList}
            selectedTableName={control.viewFriendlyName}
            onChange={handleTableChange}
            validationMessage={control.viewFriendlyName ? '' : 'Table is required'}
            includeEmailsSent
            warningLabel='Changing the base table for this grid will mean that all properties, custom views and events will be lost.'
            warningSubLabel='Are you sure you want to change the table for this grid?'
          />
        </s.LineWrapper>
        <s.SettingDivider />
        <GridColumnsSection
          control={control}
          onChange={handleChange}
          columns={columns}
          onEditColumn={onEditColumn}
          loading={loadingFieldList || resetGrid}
          fieldList={fieldList}
        />
        <s.SettingDivider />
        <GridViewsSection
          control={control}
          onChange={handleChange}
          onAddView={onAddView}
          onEditView={onEditView}
          columns={columns}
        />
        <s.SettingDivider />
        <GridDisplaySection control={control} onChange={handleChange} />
        <s.SettingDivider />
        <GridInteractionsSection control={control} onChange={handleChange} />
        <s.SettingDivider />
        <ActionListSection
          caption='Grid events'
          values={events}
          emptyMessage='No row events applied'
          canAdd
          actions={[{ value: 'Row Click', label: 'Row click', source: 'onActiveRowChange' }]}
          addLabel='Add row click'
          onAddAction={handleAddAction}
          control={control}
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
}

GridSettings.propTypes = propTypes;
export default GridSettings;
