/**
 * ViewSettings component allows users to create and customize their grid views.
 * It provides functionalities to manage columns, filters, and sorting options.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onChange - Callback function to handle changes in the view settings.
 * @param {Object} props.view - The current view model.
 * @param {boolean} props.disabled - Flag to disable the component.
 * @param {Object} props.displayPreferences - Preferences for displaying the component.
 * @param {Object} props.controlList - List of controls available for the criteria editor.
 * @param {Array<Object>} props.fieldList - List of fields available for filtering.
 * @param {string} props.viewFriendlyName - Friendly name of the view.
 * @param {Array<Object>} props.columns - List of columns available in the grid.
 *
 * @returns {JSX.Element} The rendered ViewSettings component.
 */
import React, { Suspense, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { TextLine } from '@m-next/typeography';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { FieldTypeIds } from '@m-next/types';
import { toCamelCase } from '@m-next/utilities';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import * as s from './GridBlockEditor.styles';
import Accordion from '../../../../components/accordion/Accordion';
import { GridViewModel } from './type';
import GridSortingSection from './sections/GridSortingSection';
import { createGridColumn } from '../../control-classes';
import EditorInput from '../common/components/editor-input/EditorInput';

const Grid = React.lazy(() => import('@m-next/grid'));
const CriteriaEditor = React.lazy(() => import('@m-next/criteria-builder'));

// types
const propTypes = {
  onChange: PropTypes.func,
  view: GridViewModel,
  disabled: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  controlList: PropTypes.instanceOf(Object),
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  viewFriendlyName: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

function ViewSettings({
  view,
  onChange,
  disabled,
  displayPreferences,
  controlList,
  fieldList,
  viewFriendlyName,
  columns,
}) {
  const [internalView, setInternalView] = useState(view);
  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setInternalView(view);
  }, [view]);

  const formattedColumnList = useMemo(() => {
    if (!internalView?.columns && internalView.columns.length === 0) return [];

    const hasViewMobileConfig = internalView.columns.some((c) => c.visibleOnMobile != null);
    return internalView.columns
      .map((column) => {
        const match = columns.find((col) => col.field === column.field);
        if (!match) return null;
        return {
          field: column.field,
          caption: match?.header || column.field,
          visible: column.visible,
          visibleOnMobile: hasViewMobileConfig ? (column.visibleOnMobile ?? false) : (match?.showOnMobile ?? false),
        };
      })
      .filter((x) => x !== null);
  }, [columns, internalView.columns]);

  useEffect(() => {
    if (!internalView?.columns && internalView.columns.length === 0) return;
    let missingColumns = false;
    const updated = { ...internalView, columns: [...internalView.columns] };

    // Add missing columns
    columns.forEach((column) => {
      const match = internalView.columns.find((col) => col.field === column.field);
      if (!match) {
        missingColumns = true;
        updated.columns.push(
          createGridColumn({
            field: column.field,
            caption: column.header || column.field,
            visible: false,
            visibleOnMobile: false,
            sourceField: column.sourceField,
            sourceModel: column.sourceModel,
          }),
        );
      }
    });

    // Remove columns that no longer exist
    internalView.columns.forEach((column) => {
      const match = columns.find((col) => col.field === column.field);
      if (!match) {
        missingColumns = true;
        updated.columns = updated.columns.filter((col) => col.field !== column.field);
      }
    });

    if (missingColumns) {
      setInternalView(updated);
      onChange(updated);
    }
  }, [columns, internalView, onChange]);

  const handlePropertyChange = (property, value) => {
    const updated = { ...internalView, [property]: value };
    setInternalView(updated);
    onChange(updated);
  };

  const handleCriteriaChange = (criteria) => {
    const updated = {
      ...internalView,
      filtering: toCamelCase(criteria),
    };
    setInternalView(updated);
    onChange(updated);
  };

  const handleColumnReorder = (from, to) => {
    // Make a copy of the viewList array
    const newList = [...internalView.columns];

    // Remove the item from its original position
    const [movedItem] = newList.splice(from, 1);

    // Insert the item at the destination position
    newList.splice(to, 0, movedItem);

    // Create updated control with new viewList
    const updated = {
      ...internalView,
      columns: newList,
    };
    setInternalView(updated);
    onChange(updated);
  };

  const handleSortDelete = (index) => {
    const updated = {
      ...internalView,
      sorting: internalView.sorting.filter((_, i) => i !== index),
    };

    setInternalView(updated);
    onChange(updated);
  };

  const handleSortReorder = (from, to) => {
    // Make a copy of the viewList array
    const newList = [...internalView.sorting];

    // Remove the item from its original position
    const [movedItem] = newList.splice(from, 1);

    // Insert the item at the destination position
    newList.splice(to, 0, movedItem);

    // Create updated control with new viewList
    const updated = {
      ...internalView,
      sorting: newList,
    };

    setInternalView(updated);
    onChange(updated);
  };

  const handleSortChange = (index, order) => {
    const updated = {
      ...internalView,
      sorting: internalView.sorting.map((item, i) => {
        if (i === index) return { ...item, filterOrder: order };
        return item;
      }),
    };

    setInternalView(updated);
    onChange(updated);
  };

  const handleAddSort = (column) => {
    const updated = {
      ...internalView,
      sorting: [...internalView.sorting, { filterField: column, filterOrder: 'asc' }],
    };

    setInternalView(updated);
    onChange(updated);
  };

  const handleAddFilterClick = () => {
    setOpenQuickEdit(true);
    setOpen(true);
  };

  const handleCloseCriteriaEditor = () => {
    setOpenQuickEdit(false);
  };

  const handleChangeColumnVisibility = (_, value, rawColumn, rowIdx, primaryKey) => {
    const updated = {
      ...internalView,
      columns: internalView.columns.map((column) => {
        if (column.field === primaryKey) {
          return { ...column, visible: value };
        }
        return column;
      }),
    };

    setInternalView(updated);
    onChange(updated);
  };

  const handleChangeColumnMobileVisibility = (_, value, rawColumn, rowIdx, primaryKey) => {
    const hasViewMobileConfig = internalView.columns.some((c) => c.visibleOnMobile != null);
    const updated = {
      ...internalView,
      columns: internalView.columns.map((column) => {
        if (column.field === primaryKey) {
          return { ...column, visibleOnMobile: value };
        }
        // First edit: seed all null columns with their showOnMobile fallback
        if (!hasViewMobileConfig && column.visibleOnMobile == null) {
          const match = columns.find((col) => col.field === column.field);
          return { ...column, visibleOnMobile: match?.showOnMobile ?? false };
        }
        return column;
      }),
    };

    setInternalView(updated);
    onChange(updated);
  };

  return (
    <RumComponentContextProvider componentName='ViewSettings'>
      <s.Wrapper padding={16} gutter={280}>
        <TextLine>Create your custom view for the grid.</TextLine>
        <Accordion id='content' caption='Content' open variant='left' borderless>
          <EditorInput
            id='name'
            value={internalView.name}
            label='Filter title'
            onChange={(e) => handlePropertyChange('name', e)}
            controlId={internalView.id}
            maxLength={40}
            disabled={disabled}
            width='168px'
          />

          <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
            {formattedColumnList.length > 0 && (
              <Grid
                id='columns'
                disabled={disabled}
                hideCaption={false}
                showGoToPage={false}
                showPageSize={false}
                showReload={false}
                showHeader={false}
                searchable={false}
                addRowsEnabled={false}
                editable
                columns={[
                  {
                    name: 'field',
                    primary: true,
                    caption: '',
                    visible: false,
                    editable: false,
                    singleLine: true,
                    fieldType: FieldTypeIds.Text,
                    width: 'dynamic',
                  },
                  {
                    name: 'caption',
                    primary: false,
                    caption: '',
                    visible: true,
                    editable: false,
                    singleLine: true,
                    fieldType: FieldTypeIds.Text,
                    width: 'dynamic',
                  },
                  {
                    name: 'visible',
                    caption: '',
                    visible: true,
                    editable: true,
                    singleLine: true,
                    fieldType: FieldTypeIds.YesNo,
                    width: 'dynamic',
                    displayAs: 'icon',
                    displayOptions: {
                      trueIcon: { name: 'desktop-visible' },
                      falseIcon: { name: 'desktop-hidden' },
                    },
                    onChange: handleChangeColumnVisibility,
                    hideWhenDragging: true,
                  },
                  {
                    name: 'visibleOnMobile',
                    caption: '',
                    visible: true,
                    editable: true,
                    singleLine: true,
                    fieldType: FieldTypeIds.YesNo,
                    width: 'dynamic',
                    displayAs: 'icon',
                    displayOptions: {
                      trueIcon: { name: 'mobile-visible' },
                      falseIcon: { name: 'mobile-hidden' },
                    },
                    onChange: handleChangeColumnMobileVisibility,
                    hideWhenDragging: true,
                  },
                ]}
                data={formattedColumnList}
                draggable
                alwaysShowDragHandles
                onReorder={handleColumnReorder}
                compact
                pageSize={50}
                pageNumber={1}
                totalRecords={formattedColumnList.length}
                hideRecordCount
                canDelete={false}
              />
            )}
          </Suspense>
        </Accordion>
        <s.SettingDivider />
        <Accordion
          id='filter'
          caption='Filter'
          onAdd={handleAddFilterClick}
          open={open}
          onClose={() => setOpen(false)}
          variant='left'
          borderless
          tooltipId='editor-tooltip'
          tooltip='Add filter'
        >
          <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
            <CriteriaEditor
              id='filter'
              controlList={controlList}
              dataModelId={viewFriendlyName}
              disabled={disabled}
              displayPreferences={displayPreferences}
              onChange={handleCriteriaChange}
              expression={internalView.filtering}
              filterId={internalView.id}
              fieldList={fieldList}
              includeControls
              includeSessionVariables
              showEmptyFilterIcon={false}
              openQuickEdit={openQuickEdit}
              onClose={handleCloseCriteriaEditor}
              emptyMessage='No filters applied'
            />
          </Suspense>
        </Accordion>

        <s.SettingDivider />

        <GridSortingSection
          id='sorting'
          caption='Sorting'
          sortColumns={internalView.sorting}
          columns={columns}
          canAdd
          emptyMessage='Sorting allows you to order the data displayed on your grid.'
          emptyTitle='No sorting applied'
          onAdd={handleAddSort}
          onReorder={handleSortReorder}
          onDelete={handleSortDelete}
          onChange={handleSortChange}
          disabled={disabled}
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
}

ViewSettings.propTypes = propTypes;
export default ViewSettings;
