import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { widgets } from '@m-next/types';
import { Text } from '@m-next/typeography';
import { Guid } from '@m-next/utilities';
import SettingsHeader from '../common/components/settings-header/SettingsHeader';
import { getWidgetIconName } from '@m-next/layout-canvas';

const propTypes = {
  control: PropTypes.instanceOf(Object),
  controlProperty: PropTypes.instanceOf(Object),
  onControlPropertySelected: PropTypes.func,
  onChange: PropTypes.func,
  onControlDuplicate: PropTypes.func,
  onControlDelete: PropTypes.func,
  screenData: PropTypes.instanceOf(Object),
};

function GridSettingsHeader({
  control,
  controlProperty,
  onControlPropertySelected,
  onChange,
  onControlDuplicate,
  onControlDelete,
  screenData,
}) {
  const selectedColumn = useMemo(() => {
    if (!control || !controlProperty?.selectedColumn) return null;
    return control.columns.find((column) => column.field === controlProperty.selectedColumn);
  }, [control, controlProperty?.selectedColumn]);

  // Helper to find selected view across all view lists (standard, custom, shared)
  const selectedView = useMemo(() => {
    if (!control || !controlProperty?.selectedView) return null;
    const allViews = [
      ...(control.viewList || []),
      ...(control.model?.customViews || []),
      ...(control.model?.sharedViews || []),
    ];
    return allViews.find((view) => view.id === controlProperty.selectedView);
  }, [control, controlProperty?.selectedView]);

  // Generate crumbs based on selection state
  const crumbs = useMemo(() => {
    const crumbList = [];
    if (!control) return crumbList;
    if (control?.type === widgets.DATATABLE) {
      crumbList.push({
        id: 'grid-settings-crumb',
        label: control.name || 'Grid',
        onClick:
          controlProperty?.selectedView || controlProperty?.selectedColumn
            ? () => {
                onControlPropertySelected(control.id, null);
              }
            : null,
      });

      if (controlProperty?.selectedView) {
        crumbList.push({ id: 'view-settings-crumb', label: selectedView?.name || 'View' });
      }
      if (controlProperty?.selectedColumn) {
        crumbList.push({
          id: 'column-settings-crumb',
          label: selectedColumn?.header,
          onClick: controlProperty?.selectedChildColumn
            ? () =>
                onControlPropertySelected(control.id, {
                  selectedColumn: controlProperty.selectedColumn,
                  selectedChildColumn: null,
                })
            : null,
        });
      }
      if (controlProperty?.selectedChildColumn) {
        crumbList.push({ id: 'child-column-settings-crumb', label: controlProperty?.selectedChildColumn });
      }
    }
    return crumbList;
  }, [
    control,
    controlProperty?.selectedChildColumn,
    controlProperty?.selectedColumn,
    controlProperty?.selectedView,
    onControlPropertySelected,
    selectedColumn?.header,
    selectedView?.name,
  ]);

  // Determine the context type and label for dialog display
  const contextType = useMemo(() => {
    if (controlProperty?.selectedView) {
      return 'view';
    }
    if (controlProperty?.selectedColumn) {
      return 'column';
    }
    return null;
  }, [controlProperty?.selectedColumn, controlProperty?.selectedView]);

  const contextLabel = useMemo(() => {
    if (controlProperty?.selectedView) {
      return selectedView?.name || 'View';
    }
    if (controlProperty?.selectedColumn) {
      return selectedColumn?.header;
    }
    return null;
  }, [controlProperty?.selectedColumn, controlProperty?.selectedView, selectedColumn?.header, selectedView?.name]);


  // Handle column deletion
  const handleColumnDelete = () => {
    const updatedColumns = control.columns.filter((column) => column.field !== controlProperty.selectedColumn);
    const updatedControl = { ...control, columns: updatedColumns };
    updatedControl.viewList = updatedControl.viewList.map((view) => ({
      ...view,
      columns: view.columns.filter((column) => column.field !== controlProperty.selectedColumn),
    }));
    onChange(updatedControl);
    onControlPropertySelected(control.id, null);
  };

  // Handle view deletion
  const handleViewDelete = () => {
    if (control.viewList.length === 1) return;
    const updatedViewList = control.viewList.filter((view) => view.id !== controlProperty.selectedView);
    const updatedControl = { ...control, viewList: updatedViewList };
    if (control.defaultViewFilter === controlProperty.selectedView) {
      updatedControl.defaultViewFilter = updatedViewList[0].id;
    }
    onChange(updatedControl);
    onControlPropertySelected(control.id, null);
  };

  // Handle view duplication
  const handleDuplicateView = () => {
    const selectedView = control.viewList.find((view) => view.id === controlProperty.selectedView);
    const newView = { ...selectedView, id: Guid.create(), name: `Copy of ${selectedView.name}` };
    const updatedControl = { ...control, viewList: [...control.viewList, newView] };
    onChange(updatedControl);
    onControlPropertySelected(control.id, { selectedView: newView.id });
  };

  // Handle delete action
  const handleDelete = () => {
    if (contextType === 'view') {
      handleViewDelete();
    } else if (contextType === 'column') {
      handleColumnDelete();
    } else {
      // Delete the main grid control
      onControlDelete?.(control?.id);
    }
  };


  // Create custom delete dialog message
  const deleteDialogMessage = useMemo(() => {
    if (contextType === 'column') {
      return (
        <>
          Deleting the column <Text bold>{contextLabel}</Text> will mean that all properties, validation rules, and
          events will be lost
        </>
      );
    }
    if (contextType === 'view') {
      return (
        <>
          Deleting the view <Text bold>{contextLabel}</Text> will mean that all properties, filters and sort criteria
          will be lost.
        </>
      );
    }
    return `Are you sure you want to delete this ${contextType}?`;
  }, [contextType, contextLabel]);

  // Determine if delete icon should be shown
  const showDeleteIcon = useMemo(() => {
    // Show delete for columns that can be deleted
    if (controlProperty?.selectedColumn && selectedColumn?.canDelete && !controlProperty?.selectedChildColumn) {
      return true;
    }

    if(controlProperty?.selectedView && control.viewList.length > 1) {
      return true;
    }

    // Show delete for the main grid control (when no column/view is selected)
    if (!controlProperty?.selectedColumn && !controlProperty?.selectedView) {
      return true;
    }
    return false;
  }, [control.viewList.length, controlProperty?.selectedChildColumn, controlProperty?.selectedColumn, controlProperty?.selectedView, selectedColumn?.canDelete]);

  return (
    <SettingsHeader
      crumbs={crumbs}
      controlId={control?.id}
      controlProperty={controlProperty}
      onControlPropertySelected={onControlPropertySelected}
      contextType={contextType}
      contextLabel={contextLabel}
      showDeleteIcon={showDeleteIcon}
      showDuplicateIcon={!controlProperty?.selectedColumn}
      deleteDialogTitle={`Delete ${contextType}`}
      deleteDialogMessage={deleteDialogMessage}
      onDelete={handleDelete}
      onDuplicate={() => controlProperty?.selectedView ? handleDuplicateView() : onControlDuplicate?.(control?.id)}
      screenData={screenData}
      iconName={getWidgetIconName(control?.type)}
    />
  );
}

GridSettingsHeader.propTypes = propTypes;
export default GridSettingsHeader;
