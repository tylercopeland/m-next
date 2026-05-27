import React, { Suspense, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Tooltip } from 'react-tooltip';
import { DebouncedInput } from '@m-next/input';
import Dropdown from '@m-next/dropdown';
import LoadingSkeleton from '@m-next/loading-skeleton';
import RadioGroup from '@m-next/radio-button';
import SvgIcon from '@m-next/svg-icon';
import { Text, TextLine } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import { Projection, getIcon } from '@m-next/types';
import { Z_POPUP } from '@m-next/layout-canvas';
import { formatter, Guid } from '@m-next/utilities';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from './ChartBlockEditor.styles';

const Grid = React.lazy(() => import('@m-next/grid'));

const propTypes = {
  tableName: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  titles: PropTypes.shape({
    caption: PropTypes.string,
    yAxis: PropTypes.string,
    xAxis: PropTypes.string,
    series: PropTypes.string,
  }),
  onChangeTitles: PropTypes.func,
  onChangeDrilldownProjection: PropTypes.func,
  projection: Projection,
  onPropertySelected: PropTypes.func,
  onScreenChange: PropTypes.func,
  rowClickEvent: PropTypes.shape({
    appId: PropTypes.string,
    appName: PropTypes.string,
    screenId: PropTypes.string,
    screenName: PropTypes.string,
  }),
  appList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
    }),
  ),
  screenList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
    }),
  ),
  isAppListLoading: PropTypes.bool,
  isScreenListLoading: PropTypes.bool,
  isRowClickActionLoading: PropTypes.bool,
  expandAll: PropTypes.bool,
  actionType: PropTypes.string,
  onChangeActionType: PropTypes.func,
  onOpenActionEditor: PropTypes.func,
};

const DrilldownWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    flexDirection: 'column',
  },
]);
const ToggleIcon = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
]);

const ActionClickOptions = [
  { label: 'Custom action', value: 'CUSTOM_ACTION' },
  { label: 'Drill down', value: 'DRILLDOWN' },
  { label: 'None', value: 'NONE' }
];

function InteractionsTab({
  titles,
  onChangeTitles,
  onChangeDrilldownProjection,
  fieldList,
  tableName,
  projection,
  onPropertySelected,
  onScreenChange,
  rowClickEvent,
  appList,
  screenList,
  isAppListLoading,
  isScreenListLoading,
  isRowClickActionLoading,
  expandAll,
  actionType,
  onChangeActionType,
  onOpenActionEditor,
}) {
  const [showNames, setShowNames] = useState(false);
  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, tableName, projection, {}, {}),
    [fieldList, tableName, projection],
  );
  const appscreenListOptions = useMemo(() => {
    if (!appList || !screenList) {
      return null;
    }
    const filteredScreenList = screenList
      ?.filter((screen) => screen.viewFriendlyName === tableName)
      .map((item) => ({ appId: item.appId, value: item.id, label: item.caption }));

    const mergedApps = {};
    filteredScreenList.forEach((screen) => {
      if (!mergedApps[screen.appId]) {
        const matches = appList.filter((x) => x.id === screen.appId);
        if (matches.length > 0) {
          mergedApps[screen.appId] = { caption: matches[0].caption, options: [] };
        }
      }
      if (mergedApps[screen.appId]) mergedApps[screen.appId].options.push(screen);
    });
    const list = [];
    Object.keys(mergedApps).forEach((item) => {
      list.push({ label: mergedApps[item].caption, options: mergedApps[item].options });
    });
    return list;
  }, [appList, screenList, tableName]);

  const selectedScreen = useMemo(
    () => (rowClickEvent.screenId ? { value: rowClickEvent.screenId, label: rowClickEvent.screenName } : null),
    [rowClickEvent.screenId, rowClickEvent.screenName],
  );

  const selectedSortDirection = useMemo(
    () => (projection && projection.sorting && projection.sorting.length > 0 ? projection.sorting[0].sortType : 1),
    [projection],
  );

  const selectedSortField = useMemo(() => {
    if (projection && projection.sorting && projection.sorting.length > 0) {
      const matches = projection.fields.filter((x) => x.name === projection.sorting[0].sortField);
      if (matches.length > 0) {
        return { value: matches[0].name, label: matches[0].caption };
      }
    }
    return null;
  }, [projection]);

  const sortOptions = useMemo(
    () =>
      projection && projection.fields && projection.fields.length > 0
        ? projection.fields
          .map((x) => ({ value: x.name, label: x.caption, icon: getIcon(x.type) }))
          .sort((a, b) => {
            if (a.label < b.label) {
              return -1;
            }
            if (a.label > b.label) {
              return 1;
            }
            return 0;
          })
        : [],
    [projection],
  );

  const selectedAction = useMemo(() => {
    return ActionClickOptions
      .find((x) => x.value === actionType)
      ?? ActionClickOptions[2]; // None
  }, [actionType]);

  const handleSeriesLabelChange = (e) => {
    const updated = { ...titles, series: e };
    onChangeTitles(updated);
  };

  const handleFieldSelected = (field) => {
    const found = fieldList.filter((item) => item.name === field.value);
    if (found && found.length > 0) {
      if (!projection || !projection.fields) {
        const initial = { id: Guid.create(), fields: [], sorting: [] };
        initial.fields.push(found[0]);
        initial.sorting.push({ sortField: found[0].name, sortType: 1 });
        onChangeDrilldownProjection(initial);
      } else {
        const updated = { ...projection, fields: [...projection.fields] };
        updated.fields.push(found[0]);
        if (!updated.sorting || updated.sorting.length === 0) {
          updated.sorting = [];
          updated.sorting.push({ sortField: found[0].name, sortType: 1 });
        }
        onChangeDrilldownProjection(updated);
      }
    }
  };

  const handleDeleteColumn = (value) => {
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields.splice(value, 1);
    if (updated.fields.length === 0) {
      updated.sorting = [];
    } else if (projection.sorting && projection.sorting.length > 0) {
      const matches = projection.fields.filter((x) => x.name === projection.sorting[0].sortField);
      if (matches.length === 0) {
        updated.sorting = [];
        updated.sorting.push({ sortField: updated.fields[0].name, sortType: 1 });
      }
    }

    onChangeDrilldownProjection(updated);
  };

  const reorder = (startIndex, endIndex) => {
    const result = Array.from(projection.fields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields = result;
    onChangeDrilldownProjection(updated);
  };

  const handleSortDirectionChange = (e) => {
    const value = Number(e.currentTarget.value);
    if (!projection.sorting) {
      const updated = { ...projection };
      updated.sorting = [];
      updated.sorting.push({ sortField: null, sortType: value });
      onChangeDrilldownProjection(updated);
    } else {
      const result = [...projection.sorting];
      result[0] = { sortField: result[0].sortField, sortType: value };

      const updated = { ...projection, sorting: result };
      onChangeDrilldownProjection(updated);
    }
  };

  const handleSortFieldChange = (item) => {
    if (!projection.sorting) {
      const updated = { ...projection };
      updated.sorting = [];
      updated.sorting.push({ sortField: item.value, sortType: 1 });
      onChangeDrilldownProjection(updated);
    } else {
      const result = [...projection.sorting];
      result[0] = { sortField: item.value, sortType: result[0].sortType };

      const updated = { ...projection, sorting: result };
      onChangeDrilldownProjection(updated);
    }
  };

  const handleCaptionChange = (name, val, column, rowIdx) => {
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields[rowIdx] = { ...updated.fields[rowIdx] };
    updated.fields[rowIdx].caption = val;
    if (val === '' && fieldList) {
      const found = fieldList.filter((item) => item.name === updated.fields[rowIdx].name);

      updated.fields[rowIdx].caption = found.length > 0 ? found[0].caption : updated.fields[rowIdx].name;
    }
    onChangeDrilldownProjection(updated);
  };

  return (
    <s.Wrapper padding={16}>
      <Tooltip
        id='editor-tooltip'
        opacity={1}
        style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '300px', wordBreak: 'break-word', padding: '4px 8px' }}
      />
      <Accordion id='hover-options' caption='On hover' onSelect={() => onPropertySelected(null)} open={expandAll}>
        <DebouncedInput
          id='series-label'
          caption='Value label on hover'
          value={titles.series}
          placeholder='Value'
          onChange={handleSeriesLabelChange}
        />
      </Accordion>
      <Accordion
        id='on-click-options'
        caption='On click'
        onSelect={() => onPropertySelected('drilldown', true)}
        onClose={() => onPropertySelected(null)}
        open={expandAll}
      >
        <TextLine>
          Add a&nbsp;
          <Text
            tooltip="Select up to 8 fields of data to display."
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >Drill down</Text>
          &nbsp;or&nbsp;
          <Text
            tooltip="Create any action set within the Action Editor."
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >Custom action</Text>
          &nbsp;to your chart data points.
        </TextLine>
        <Dropdown
          id='click-interaction'
          value={selectedAction}
          options={ActionClickOptions}
          onChange={(x) => onChangeActionType(x.value)}
          isV4Design
          caption="On click action"
        />
        {actionType === 'CUSTOM_ACTION' && (
          <div
            style={{
              width: '100%',
              border: '1px solid #E0E4EA',
              borderRadius: 6,
              padding: '8px 16px',
              marginBottom: 12,
              fontWeight: 500,
              color: '#1A2233',
              cursor: 'pointer',
            }}
            onClick={onOpenActionEditor}
          >
            Click event
          </div>
        )}
        {actionType === 'DRILLDOWN' && (
          <DrilldownWrapper>
            <TextLine bold>Which data columns would you like to display on the drill down grid?</TextLine>
            <TextLine fontSize='small' color='#6F7A82'>
              Maximum 8 columns
            </TextLine>
            {!fieldListOptions && <LoadingSkeleton count={1} height={24} style={{ marginBottom: 8 }} />}

            {fieldListOptions && (
              <Dropdown
                id='add-grid-column'
                options={fieldListOptions}
                onChange={handleFieldSelected}
                placeholder='Add column'
                dropdownStyle='multi-icon'
                isV4Design
                style={{ width: '100%' }}
                disabled={projection?.fields.length >= 8}
              />
            )}
            {projection && projection.fields.length > 0 && (
              <>
                <ToggleIcon>
                  <SvgIcon
                    name='grid-V4'
                    color={showNames ? colors.blue : colors.grey}
                    size={16}
                    onClick={() => {
                      setShowNames(!showNames);
                    }}
                    tooltip={showNames ? 'Switch to grid columns' : 'Switch to DB fields'}
                    tooltipId='editor-tooltip'
                  />
                </ToggleIcon>
                <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
                  <Grid
                    id='drilldown-columns'
                    canDelete
                    searchable={false}
                    showPagination={false}
                    showGoToPage={false}
                    showPageSize={false}
                    showReload={false}
                    showHeader={false}
                    addRowsEnabled={false}
                    editable
                    columns={[
                      {
                        name: showNames ? 'name' : 'caption',
                        caption: '',
                        visible: true,
                        editable: !showNames,
                        onChange: handleCaptionChange,
                        singleLine: true,
                        width: 'dynamic',
                      },
                    ]}
                    data={projection.fields}
                    onDelete={handleDeleteColumn}
                    draggable
                    alwaysShowDragHandles
                    onReorder={reorder}
                    compact
                    pageSize={10}
                  />
                </Suspense>
                <TextLine bold>Which column do you want to sort by?</TextLine>
                <Dropdown
                  id='select-sort'
                  options={sortOptions}
                  onChange={handleSortFieldChange}
                  placeholder='Select sort'
                  dropdownStyle='multi-icon'
                  isV4Design
                  value={selectedSortField}
                  style={{ width: '100%' }}
                />
                <RadioGroup
                  id='test'
                  name='test'
                  selectedValue={selectedSortDirection}
                  onChange={handleSortDirectionChange}
                  direction='row'
                  narrow
                  isV4Design
                  options={[
                    {
                      label: 'Ascending',
                      value: 1,
                    },
                    {
                      label: 'Descending',
                      value: 2,
                    },
                  ]}
                />
              </>
            )}
            {isRowClickActionLoading && <LoadingSkeleton count={1} height={100} />}
            {!isRowClickActionLoading && (
              <>
                <TextLine bold>Which screen opens upon clicking a row?</TextLine>
                <Dropdown
                  id='select-app'
                  options={appscreenListOptions}
                  onChange={onScreenChange}
                  placeholder='Search app/screen'
                  dropdownStyle='multi-icon'
                  isV4Design
                  value={selectedScreen}
                  style={{ width: '100%' }}
                  isLoading={isAppListLoading || isScreenListLoading}
                  isClearable
                />
              </>
            )}
          </DrilldownWrapper>
        )}
      </Accordion>
    </s.Wrapper>
  );
}

InteractionsTab.propTypes = propTypes;
export default InteractionsTab;
