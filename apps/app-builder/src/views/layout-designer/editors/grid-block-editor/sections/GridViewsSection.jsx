import React, { Suspense, useMemo } from 'react';

import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { FieldTypeIds } from '@m-next/types';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import SvgIcon from '@m-next/svg-icon';

import { Tooltip } from 'react-tooltip';
import Accordion from '../../../../../components/accordion/Accordion';
import GridModel, { GridColumnModel } from '../type';
import * as s from '../GridBlockEditor.styles';

const Grid = React.lazy(() => import('@m-next/grid'));

export const isCustomViewEnabledPropName = 'isCustomViewEnabled';

const propTypes = {
  control: GridModel,
  onChange: PropTypes.func,
  onAddView: PropTypes.func,
  onEditView: PropTypes.func,
  columns: PropTypes.arrayOf(GridColumnModel),
};

const GridViewsSection = ({ control, onChange, columns, onAddView, onEditView }) => {
  const viewListOptions = useMemo(
    () =>
      control.viewList.map((view) => ({
        id: view.id,
        name: view.name,
        isVisible: view.isVisible,
        isDefault: view.id === control.defaultViewFilter,
      })),
    [control.defaultViewFilter, control.viewList],
  );

  const handleSetDefaultView = (columnName, val, column, rowIdx, primaryKey) => {
    const updated = {
      ...control,
      defaultViewFilter: primaryKey,
    };
    onChange(updated);
  };

  const handleSetViewVisibility = (columnName, val, column, rowIdx, primaryKey) => {
    const visibleViews = control.viewList.filter((view) => view.isVisible);
    if (visibleViews.length === 1 && !val) {
      return;
    }
    if (control.defaultViewFilter === primaryKey && !val) {
      const updated = {
        ...control,
        defaultViewFilter: visibleViews[0].id,
        viewList: control.viewList.map((view) => (view.id === primaryKey ? { ...view, isVisible: val } : view)),
        hideViewSelector: visibleViews.length === 2 && !val,
      };
      onChange(updated);
    } else {
      const updated = {
        ...control,
        viewList: control.viewList.map((view) => (view.id === primaryKey ? { ...view, isVisible: val } : view)),
        hideViewSelector: visibleViews.length === 2 && !val,
      };
      onChange(updated);
    }
  };

  const handleViewReorder = (from, to) => {
    // Make a copy of the viewList array
    const newViewList = [...control.viewList];

    // Remove the item from its original position
    const [movedItem] = newViewList.splice(from, 1);

    // Insert the item at the destination position
    newViewList.splice(to, 0, movedItem);

    // Create updated control with new viewList
    const updated = {
      ...control,
      viewList: newViewList,
    };

    onChange(updated);
  };

  const handleEditView = (e, columnName, val, column, rowIdx, primaryKey) => {
    onEditView(primaryKey);
  };

  const handleEnableCustomViewsChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handlePropertyChange = (property, value) => {
    if (property === 'hideViewSelector' && value) {
      const updated = { ...control, [property]: value, [isCustomViewEnabledPropName]: false };
      onChange(updated);
    } else {
      const updated = { ...control, [property]: value };
      onChange(updated);
    }
  };

  return (
    <Accordion
      id='view-list'
      caption='Views'
      onAdd={onAddView}
      variant='left'
      open
      borderless
      tooltipId='editor-tooltip'
      tooltip='Add view'
    >
      {control.viewFriendlyName && (
        <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
          {columns.length > 0 && (
            <Grid
              id='view-list'
              hideCaption={false}
              searchable={false}
              showGoToPage={false}
              showPageSize={false}
              showReload={false}
              showHeader={false}
              addRowsEnabled={false}
              editable
              tooltipId='editor-tooltip'
              columns={[
                {
                  name: 'id',
                  primary: true,
                  caption: '',
                  visible: false,
                  editable: false,
                  singleLine: true,
                  fieldType: FieldTypeIds.Text,
                  width: 'dynamic',
                },
                {
                  name: 'isDefault',
                  caption: '',
                  visible: true,
                  editable: true,
                  singleLine: true,
                  fieldType: FieldTypeIds.YesNo,
                  displayAs: 'icon',
                  width: 'dynamic',
                  displayOptions: {
                    trueIcon: { name: 'star-filled-V4', color: colors.yellow },
                    falseIcon: { name: 'star-empty-V4' },
                    trueTooltip: 'Default view',
                    falseTooltip: 'Set as default view',
                    hoverColor: colors['grey-darker'],
                  },
                  onChange: handleSetDefaultView,
                },
                {
                  name: 'name',
                  caption: '',
                  visible: true,
                  editable: false,
                  singleLine: true,
                  fieldType: FieldTypeIds.Text,
                  onColumnClick: handleEditView,
                  width: 'dynamic',
                },
                {
                  name: 'isVisible',
                  caption: '',
                  visible: true,
                  editable: true,
                  singleLine: true,
                  fieldType: FieldTypeIds.YesNo,
                  displayAs: 'icon',
                  width: 'dynamic',
                  displayOptions: {
                    trueIcon: { name: 'eye-open-V4' },
                    falseIcon: { name: 'eye-closed-V4' },
                    trueTooltip: 'Hide',
                    falseTooltip: 'Show',
                  },
                  onChange: handleSetViewVisibility,
                  hideWhenDragging: true,
                },
              ]}
              data={viewListOptions}
              draggable
              onReorder={handleViewReorder}
              compact
              pageSize={50}
              totalRecords={viewListOptions.length}
              hideRecordCount
              pageNumber={1}
              isPageData
              canDelete={false}
              alwaysShowDragHandles
            />
          )}
        </Suspense>
      )}
      <Toggle
        id='show-view-select'
        checked={!control.hideViewSelector}
        onChange={(e) => handlePropertyChange('hideViewSelector', !e)}
        label='Show view selector'
        width='100%'
        style={{ justifyContent: 'flex-start' }}
        labelStyle={{ flexBasis: '100%' }}
      />
      {!control.hideViewSelector && (
        <s.LineWrapper gap={8}>
          <Tooltip
            id='custom-views-tooltip'
            title={!control.isSearchable ? 'To enable custom views, search & filtering must be enabled' : null}
          />
          <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
          <Toggle
            id='enable-custom-views'
            checked={control[isCustomViewEnabledPropName]}
            onChange={(e) => handleEnableCustomViewsChange(isCustomViewEnabledPropName, e)}
            label='Enable custom views'
            disabled={!control.isSearchable}
            tooltip={!control.isSearchable ? 'To enable custom views, search & filtering must be enabled' : null}
            tooltipId='custom-views-tooltip'
            width='100%'
            style={{ justifyContent: 'flex-start' }}
            labelStyle={{ flexBasis: '100%' }}
          />
        </s.LineWrapper>
      )}
    </Accordion>
  );
};

GridViewsSection.propTypes = propTypes;
export default GridViewsSection;
