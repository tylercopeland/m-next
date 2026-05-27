import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { complexValueTypes } from '@m-next/types';
import { colors } from '@m-next/styles';
import { Guid } from '@m-next/utilities';
import Tabs from '@m-next/tabs';
import { openActionEditor } from '@m-next/action-editor';
import { useGetAppsQuery, useGetScreensQuery } from '../../../../common/services/appsApi';
import { useLoadActionMutation } from '../../../../common/services/actionApi';
import {
  screenStates,
  selectActionUpserts,
  selectControls,
  selectStatus,
} from '../../../../common/services/screenLayoutSlice';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { useGetFieldsForTableQuery, useGetTablesQuery } from '../../../../common/services/tablesFieldsApi';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import validateChart from '../../validation/validateChart';
import GoToScreenModel from '../action/types/goToScreen';
import DataTab from './DataTab';
import DisplayTab from './DisplayTab';
import InteractionsTab from './InteractionsTab';
import getDefaultProjection from './data/defaultProjections';
import getRowClickDefault from './data/defaultRowClickScreens';
import { primarySortValue } from './types';


const propTypes = {
  onChange: PropTypes.func,
  onActionChange: PropTypes.func,
  rawControl: PropTypes.shape({
    id: PropTypes.string,
    caption: PropTypes.string,
    onRowClick: PropTypes.string, // drilldown action
    model: PropTypes.shape({
      name: PropTypes.string,
      chart: PropTypes.number,
      colors: PropTypes.arrayOf(PropTypes.string),
      labels: PropTypes.shape({
        primary: PropTypes.string,
        secondary: PropTypes.string,
        series: PropTypes.string,
      }),
      viewFilter: PropTypes.shape({
        expression: PropTypes.instanceOf(Object),
      }),
      viewName: PropTypes.string,
      // column[0] stores custom onClick action
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          caption: PropTypes.string,
          aggregate: PropTypes.number,
          fieldType: PropTypes.number,
        }),
      ),
      dataPoints: PropTypes.bool,
      drilldownEnabled: PropTypes.bool,
      hasDynamicDates: PropTypes.bool,
    }),
  }),
  onSelect: PropTypes.func,
  onOpenAdvancedDesigner: PropTypes.func,
  appId: PropTypes.string,
  screenId: PropTypes.string,
  versionId: PropTypes.string,
  onSendAnalytics: PropTypes.func,
};

const hexColor = (baseColor, percent) => {
  const num = parseInt(baseColor, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const getGradient = (value) => {
  const baseColor = value;

  const gradient = [];
  for (let index = -50; index <= 50; index += 10) {
    const newColor = hexColor(baseColor.replace('#', ''), index);
    gradient.push(newColor);
  }
  gradient.splice(5, 1);
  gradient.splice(0, 0, baseColor);

  return gradient;
};


function ChartBlockEditor({
  rawControl,
  onChange,
  onActionChange,
  onSelect,
  onOpenAdvancedDesigner,
  appId,
  screenId,
  versionId,
  onSendAnalytics,
}) {
  const accountName = useSelector(selectAccountName);
  const controlList = useSelector(selectControls);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const screenStatus = useSelector(selectStatus);
  const actionUpserts = useSelector(selectActionUpserts);
  const [rowClickEvent, setRowClickEvent] = useState({});
  const [getAction] = useLoadActionMutation();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const control = useMemo(() => {
    const guid = Guid.create();
    const defaultControl = {
      caption: '',
      filterDef: [{ filterId: guid, filterName: 'SeriesFltr', expression: [] }],
      onRowClick: null,
      model: {
        viewName: '',
        columns: [
          {
            caption: 'PrimaryColumn',
          },
          {
            caption: 'SecondaryColumn',
          },
        ],
        labels: {
          primary: '',
          secondary: '',
          series: 'Value',
        },

        chart: 1,
        viewFilter: { filterId: guid, filterName: 'SeriesFltr', expression: [] },
        colors: getGradient(colors.blue),
      },
    };

    const merged = { ...defaultControl, ...rawControl };
    if (!merged.model) {
      merged.model = { ...defaultControl.model };
    }
    if (!merged.model.columns) {
      merged.model = { ...merged.model };
      merged.model.columns = { ...defaultControl.model.columns };
    }
    if (!merged.model.labels) {
      merged.model = { ...merged.model };
      merged.model.labels = { ...defaultControl.model.labels };
    }
    if (!merged.model.viewFilter) {
      merged.model = { ...merged.model };
      merged.model.viewFilter = { ...defaultControl.model.viewFilter };
    }
    if (!merged.filterDef) {
      merged.filterDef = [...defaultControl.filterDef];
    }
    if (!merged.model.colors) {
      merged.model = { ...merged.model };
      merged.model.colors = { ...defaultControl.model.colors };
    }
    if (merged.model.chart === null) {
      merged.model = { ...merged.model };
      merged.model.chart = 1;
    }

    return merged;
  }, [rawControl]);

  const validation = useMemo(() => validateChart(control), [control]);

  const { data: fieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: control.model.viewName, complexFields: false },
    { skip: !control || !control.model.viewName },
  );

  const { data: tableList } = useGetTablesQuery({ accountName, tableName: control.model.viewName }, { skip: !control });

  const { data: appList, isFetching: isAppListLoading } = useGetAppsQuery({ accountName });
  const { data: screenList, isFetching: isScreenListLoading } = useGetScreensQuery({ accountName });

  const filteredFieldList = useMemo(() => fieldList?.filter((item) => !item.name.includes('_RecordID')), [fieldList]);
  const supportsDynamicDates = useMemo(() => {
    if (control.model.viewFilter) {
      const dateRanges = control.model.viewFilter.expression.filter(
        (x) => x.source && x.source.ValueType === complexValueTypes.DateRange,
      );
      if (dateRanges.length === 1) {
        return true;
      }
    }
    return false;
  }, [control.model.viewFilter]);

  async function loadAction() {
    setIsActionLoading(true);
    try {
      const rowClickAction = await getAction({
        accountName,
        appId,
        screenId,
        versionId,
        id: control.onRowClick,
      }).unwrap();
      if (rowClickAction && rowClickAction.actionSet && rowClickAction.actionSet.actions.length > 0) {
        setRowClickEvent({
          actionSetId: rowClickAction.actionSet.actionSetId,
          screenId: rowClickAction.actionSet.actions[0].metadata.screenId,
          screenName: rowClickAction.actionSet.actions[0].metadata.screenName,
        });
      }
    } catch {
      // Ignore action not found error;
    }
    setIsActionLoading(false);
  }

  useEffect(() => {
    if (!control.onRowClick) {
      setRowClickEvent({});
    } else if (actionUpserts && actionUpserts[control.onRowClick]) {
      setRowClickEvent({
        actionSetId: actionUpserts[control.onRowClick].actionSetId,
        screenId: actionUpserts[control.onRowClick].actions[0].metadata.screenId,
        screenName: actionUpserts[control.onRowClick].actions[0].metadata.screenName,
      });
    } else if (screenStatus !== screenStates.saving) {
      loadAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control.onRowClick]);

  const chartAction = useMemo(() => {
    // has priority over custom action to match ChartWrapper logic
    if (control.model.drilldownEnabled) return 'DRILLDOWN';
    if (control.model.columns &&
      control.model.columns.length > 0 &&
      control.model.columns[0].onClick) {
      return 'CUSTOM_ACTION';
    }
    return 'NONE';
  }, [control]);

  const [selectedTab, setSelectedTab] = useState('Data');

  const tabList = [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Interactions', caption: 'Interactions' },
  ];

  const handleSelect = (field, canvasClickDisabled = false) => {
    if (onSelect)
      onSelect(
        control.id,
        field,
        chartAction === 'DRILLDOWN' &&
        control.model.drilldownProjection &&
        control.model.drilldownProjection.fields &&
        control.model.drilldownProjection.fields.length > 0 &&
        canvasClickDisabled,
      );
  };

  const handleTabChange = (e) => {
    if (selectedTab === 'Interactions') {
      handleSelect(null);
    }
    setSelectedTab(e);
    if (e === 'Display') {
      handleSelect(null);
    }
  };

  const handleTitlesChange = (value, options) => {
    const updated = {
      ...control,
      caption: value.caption,
      ...(options?.sanitizedName != null && { name: options.sanitizedName }),
    };
    updated.model = {
      ...control.model,
    };
    updated.model.labels = {
      primary: value.xAxis,
      series: value.series,
      secondary: value.yAxis,
    };
    onChange(updated);
  };

  const handleChartModelChange = (field, value) => {
    const delta = {
      ...control,
      model: {
        ...control.model,
        [field]: value,
      },
    };
    onChange(delta);
  };

  const handleChartTypeChange = (value) => {
    handleChartModelChange('chart', value);
  };

  const handleColorChange = (value) => {
    const gradient = getGradient(value);
    handleChartModelChange('colors', gradient);
  };

  const handleShowDataPointsChange = (value) => {
    handleChartModelChange('dataPoints', value);
  };

  const handleShowDynamicDates = (value) => {
    handleChartModelChange('hasDynamicDates', value);
  };

  const handleChangeDrilldownProjectionChange = (value) => {
    handleChartModelChange('drilldownProjection', value);
  };

  // Updates the underlying data properties. 
  // From this, a useMemo computes the action type.
  const handleChangeActionType = (value) => {
    if (!(control.model.columns && control.model.columns.length > 0)) {
      return console.error("Broken invariant. Chart expects model to have at least one column");
    }

    let drilldown;
    let customActionId;
    switch (value) {
      case 'NONE':
        drilldown = false;
        customActionId = null;
        break;
      case 'DRILLDOWN':
        drilldown = true;
        customActionId = null;
        break;
      case 'CUSTOM_ACTION':
        drilldown = false;
        customActionId = Guid.create();
        break;
      default:
        console.error(`Unknown action type ${value}`);
        return;
    }

    const columns = [...control.model.columns];
    const column = {
      ...control.model.columns[0],
      onClick: customActionId
    };
    columns[0] = column;
    const updated = {
      ...control,
      model: { 
        ...control.model, 
        columns, 
        drilldownEnabled: drilldown 
      },
    };
    onChange(updated);

    if (value === 'CUSTOM_ACTION') {
      openActionEditor(
        { options: updated }, 
        'onClick', 
        undefined, 
        updated.id,  
        { id: updated.id, field: 'model.drilldownEnabled', value: false });
    }
  };

  const handleOpenActionEditor = () => {
    if (!(control.model.columns && control.model.columns.length > 0)) {
      console.error("Broken invariant. Chart expects model to have at least one column");
      return;
    }
    // only opens in 'CUSTOM_ACTION' mode so no refresh override needed
    openActionEditor({ options: control }, 'onClick', undefined, control.id);
  }

  useEffect(() => {
    if (!supportsDynamicDates && control.model.hasDynamicDates) {
      handleShowDynamicDates(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportsDynamicDates]);

  const handleColumnsChange = (value) => {
    if (value && value.length > 0) {
      let projection = { ...control.model.drilldownProjection };
      const { columns } = control.model;
      if (!projection.id) {
        projection = { id: Guid.create(), fields: [], sorting: [] };
      }

      if (!projection.fields || projection.fields.length < 3) {
        projection.fields = [];
        projection.sorting = [];
      } else {
        projection.fields = [...projection.fields];
      }

      if (projection.fields.length < 8) {
        if (value[0].name) {
          const matches = projection.fields.filter((x) => x?.name === value[0].name);
          if (matches.length === 0) {
            const found = fieldList.filter((x) => x?.name === value[0].name);
            projection.fields.push(found[0]);
            if (projection.sorting.length === 0) {
              projection.sorting = [];
              projection.sorting.push({ sortField: value[0].name, sortType: 1 });
            }
          }
        }
        if (value.length > 0 && value[1].name) {
          const matches = projection.fields.filter((x) => x?.name === value[1].name);
          if (matches.length === 0) {
            const found = fieldList.filter((x) => x?.name === value[1].name);
            projection.fields.push(found[0]);
          }
        }
      }

      const update = {
        ...control,
        model: {
          ...control.model,
          columns: value,
        },
      };

      if (value[0].name) {
        if (!columns || (columns && columns[0].name === undefined)) {
          update.model.viewFilter = {
            ...control.model.viewFilter,
            sorting: [{ filterField: primarySortValue, filterOrder: 'asc' }],
          }
        }
      }

      update.model.drilldownProjection = projection;
      onChange(update);
    } else {
      handleChartModelChange('columns', value);
    }
  };

  const getRowClickAction = (target) => {
    if (target === null) {
      return null;
    }

    const action = { ...GoToScreenModel };
    action.screenId = target.screenId;
    action.activeRecordId = {
      property: 'RowRecordId',
      valueType: complexValueTypes.Control,
      value: control.id,
    };
    action.metadata = {
      screenId: target.screenId,
      screenName: target.screenName,
    };

    const event = {
      controlId: control.id,
      id: control.onRowClick ? control.onRowClick : Guid.create(),
      actionSet: {
        actionSetId: rowClickEvent && rowClickEvent.actionSetId ? rowClickEvent.actionSetId : Guid.create(),
        actions: [action],
      },
    };

    return event;
  };

  const updateRowClickAction = (target) => {
    if (target) {
      const event = getRowClickAction(target);

      onActionChange(event);
      if (!control.onRowClick) {
        const updated = {
          ...control,
          onRowClick: event?.id,
        };
        onChange(updated);
      }
      setRowClickEvent({
        actionSetId: event.actionSet.actionSetId,
        screenId: target.screenId,
        screenName: target.screenName,
      });
    } else {
      const updated = {
        ...control,
        onRowClick: null,
      };
      onChange(updated);
      setRowClickEvent({
        actionSetId: null,
        screenId: null,
        screenName: null,
      });
    }
  };

  const handleTableChange = (value) => {
    if (value !== control.model.viewName) {
      const filterId = Guid.create();
      const delta = {
        ...control,
        model: {
          ...control.model,
          viewName: value,
          drilldownProjection: getDefaultProjection(value),
          viewFilter: { ...control.model.viewFilter, expression: [], filterId, sorting: [] },
        },
      };

      delta.model.columns = [
        {
          caption: 'PrimaryColumn',
        },
        {
          caption: 'SecondaryColumn',
        },
      ];
      delta.model.labels = {
        primary: '',
        secondary: '',
        series: 'Value',
      };
      delta.caption = `Chart of ${value}`;
      delta.model.chart = 1;
      delta.model.colors = getGradient(colors.blue);
      delta.filterDef = [...control.filterDef];
      delta.filterDef[0] = { ...delta.filterDef[0], expression: [], filterId };

      const defaultAction = getRowClickDefault(value);
      const rowClick = getRowClickAction(defaultAction);

      if (rowClick) {
        setRowClickEvent({
          actionSetId: rowClick.actionSet.actionSetId,
          screenId: defaultAction.screenId,
          screenName: defaultAction.screenName,
        });
      } else {
        setRowClickEvent({});
      }

      if (delta.onRowClick && !rowClick) {
        onActionChange({
          controlId: control.id,
          id: control.onRowClick,
          actionSet: null,
        });
      }

      delta.onRowClick = rowClick?.id;

      if (rowClick) {
        onActionChange(rowClick);
      }
      onChange(delta);
    }
  };

  const handleFilterChange = (value, isEditing) => {
    const updated = {
      ...control,
      isEditing,
      model: {
        ...control.model,
        viewFilter: { ...control.model.viewFilter, expression: value },
      },
    };
    updated.filterDef = [...control.filterDef];

    updated.filterDef[0] = { ...updated.filterDef[0], expression: value };
    onChange(updated);
  };

  const handleSortChange = (value, direction, isEditing) => {
    const updated = {
      ...control,
      isEditing,
      model: {
        ...control.model,
        viewFilter: { ...control.model.viewFilter, sorting: [{ filterField: value, filterOrder: direction }] },
      },
    };
    onChange(updated);
  };

  const handleScreenChange = (screen) => {
    if (screen) {
      updateRowClickAction({
        screenId: screen.value,
        screenName: screen.label,
      });
    } else {
      updateRowClickAction({});
    }
  };

  const renderTabContent = () => {
    if (selectedTab === 'Display') {
      return (
        <DisplayTab
          id={control.id}
          chart={control.model.chart}
          titles={{
            caption: control.caption,
            xAxis: control.model.labels.primary,
            yAxis: control.model.labels.secondary,
            series: control.model.labels.series,
          }}
          onChangeChart={handleChartTypeChange}
          onChangeTitles={handleTitlesChange}
          onColorChange={handleColorChange}
          onShowDataPointsChange={handleShowDataPointsChange}
          onShowDynamicDates={handleShowDynamicDates}
          color={control.model.colors[0]}
          showDataPoints={control.model.dataPoints}
          showDynamicDates={control.model.hasDynamicDates}
          supportsDynamicDates={supportsDynamicDates}
          control={control}
          onChange={onChange}
        />
      );
    }

    if (selectedTab === 'Interactions') {
      return (
        <InteractionsTab
          id={control.id}
          titles={{
            caption: control.caption,
            xAxis: control.model.labels.primary,
            yAxis: control.model.labels.secondary,
            series: control.model.labels.series,
          }}
          fieldList={filteredFieldList}
          tableName={control.model.viewName}
          projection={control.model.drilldownProjection}
          onChangeTitles={handleTitlesChange}
          onChangeDrilldownProjection={handleChangeDrilldownProjectionChange}
          onPropertySelected={handleSelect}
          rowClickEvent={rowClickEvent}
          appList={appList}
          screenList={screenList}
          onScreenChange={handleScreenChange}
          isAppListLoading={isAppListLoading}
          isScreenListLoading={isScreenListLoading}
          isRowClickActionLoading={isActionLoading}
          actionType={chartAction}
          onChangeActionType={handleChangeActionType}
          onOpenActionEditor={handleOpenActionEditor}
        />
      );
    }
    return (
      <DataTab
        id={control.id}
        columns={control.model.columns}
        fieldList={filteredFieldList}
        rawFieldList={fieldList}
        tableList={tableList}
        tableName={control.model.viewName}
        onColumnChange={handleColumnsChange}
        onTableChange={handleTableChange}
        onFilterChange={handleFilterChange}
        onOpenAdvancedDesigner={onOpenAdvancedDesigner}
        expression={control.model.viewFilter.expression}
        chartType={control.model.chart}
        controlList={controlList}
        displayPreferences={displayPreferences}
        filterId={control.model.viewFilter.filterId}
        validation={validation}
        sorting={control.model.viewFilter.sorting}
        onSendAnalytics={onSendAnalytics}
        onSortChange={handleSortChange}
      />
    );
  };

  return (
    <RumComponentContextProvider componentName='ChartBlockEditor'>
      <Tabs
        id='chart-editor'
        tabList={tabList}
        onRenderTabContent={renderTabContent}
        onChange={handleTabChange}
        selectedTab={selectedTab}
        containerMargin='0px'
        borderless
        dyanmicHeight
        headerStyle={{ marginLeft: 16 }}
        fullWidthTabs
      />
    </RumComponentContextProvider>
  );
}

ChartBlockEditor.propTypes = propTypes;
export default ChartBlockEditor;
