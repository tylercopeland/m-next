 
import React, { Suspense, useMemo, useState, useEffect } from 'react';
import Toggle from '@m-next/toggle';
import { Text, TextLine } from '@m-next/typeography';
import { Guid, toCamelCase } from '@m-next/utilities';
import WIDGETS from '@m-next/runtime-interface/src/types/widgetTypes';
import { BaseControl, createBaseControl } from '@m-next/runtime-interface/src/controls/baseControl';
import { createBaseFilter } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';
 
// @ts-ignore: No type declaration for CriteriaEditor (JSX import)
import CriteriaEditor from '@m-next/criteria-builder/src/CriteriaEditor';
import { useSelector } from 'react-redux';
import { FieldTypeIds, FieldTypeNames } from '@m-next/runtime-interface/src/types/fieldTypes';
import { ButtonGroupRow } from '@m-next/button-group';
import { colors } from '@m-next/styles';
import Dropdown from '@m-next/dropdown';
import SvgIcon from '@m-next/svg-icon';
import { COMPACT_EVENT_TIME_OPTIONS, LAYOUT_OPTIONS } from '@m-next/calendar/src/calendarConstants';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { selectControls } from '../../../../common/services/screenLayoutSlice';
import TableDropdown from '../common/components/table-dropdown/TableDropdown';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import type { CompactEventTimeOption } from '@m-next/calendar/src/calendarConstants';
import EventCardSettings from './EventCardSettings';
import type { CalendarControl, ResourceData, SettingsData, WaitlistData } from './calendar-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import ResourcesTabEditor from './ResourcesTabEditor';
import SettingsTabEditor from './SettingsTabEditor';
import WaitlistTabEditor from './WaitlistTabEditor';
import { Tooltip } from 'react-tooltip';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';

// Additional interfaces for better typing
interface FieldListItem {
  name: string;
  type: string;
}

interface ControlWithDynamicProps {
  [key: string]: unknown;
  id: string;
  type?: string | null;
  name?: string;
  caption?: string;
}

interface CriteriaExpression {
  [key: string]: unknown;
}

interface LayoutOptionRow {
  id: number;
  name: string;
  visible: boolean;
  isSelectedLayout: boolean;
}

 
// @ts-ignore - No TypeScript declarations available
const Grid = React.lazy(() => import('@m-next/grid'));
type DropdownOption = { value: string; label: string };

// Base generator for CalendarControl
const createBaseCalendarControl = (data: Partial<CalendarControl> = {}): CalendarControl => {
  // If filterDef is null or undefined, create a default filterDef with viewName 'Activity'
  const filterDef =
    data.filterDef && data.filterDef.length > 0 ? data.filterDef : [createBaseFilter({ viewName: 'Activity' })];

  // Set model.viewFilter to the same filter if not present
  const model = {
    ...(data.model || { viewName: 'Activity', columns: [] }),
    viewFilter: data.model?.viewFilter || filterDef[0]!,
  };

  return {
    ...createBaseControl({
      ...data,
      type: WIDGETS.CALENDAR,
      name: data.name || 'calendar',
      caption: data.caption || 'Calendar',
    }),
    displayOptions: {
      showAllDayEventsOnTop: true,
      showInactiveResources: false,
      coloredEventBackgrounds: false,
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: [1, 2, 3, 4, 5],
        ...(data.displayOptions?.workingHours || {}),
      },
      ...(data.displayOptions || {}),
    },
    displayViews: data.displayViews || {
      day: {
        visible: true,
        standard: true,
        vertical: false,
        horizontal: false,
      },
      week: {
        visible: true,
        standard: true,
        vertical: false,
        horizontal: false,
      },
      month: {
        visible: true,
        standard: true,
      },
      list: {
        visible: false,
        weekly: false,
        full: false,
      },
    },
    caption: data.caption || 'Calendar',
    onAddEvent: data.onAddEvent || null,
    onDragMoveEvent: data.onDragMoveEvent || null,
    onSelectEvent: data.onSelectEvent || null,
    styles: {
      variant: data.styles?.variant || 'primary',
      color: data.styles?.color || colors.blue || '',
    },
    resourceTitle: data.resourceTitle || '',
    resourceFieldv2: data.resourceFieldv2 || '',
    columnNameRefv2: data.columnNameRefv2 || '',
    defaultResource: data.defaultResource || '',
    filterDef,
    model,
    sidebarVisibility: data.sidebarVisibility || {
      resources: true,
      settings: true,
      waitlist: true,
    },
  };
};

// Props for CalendarEditor
interface CalendarEditorProps {
  rawControl: CalendarControl | null;
  onChange: (control: CalendarControl) => void;
  onAddAction: (control: BaseControl, eventName: string) => void;
  controlProperty: {
    eventCardSelected: boolean;
  };
  onSelect: (controlId: string, property: { eventCardSelected: boolean }) => void;
}

const CalendarEditor: React.FC<CalendarEditorProps> = ({
  rawControl,
  onChange,
  onAddAction,
  controlProperty,
  onSelect,
}) => {
  const control = useMemo<CalendarControl>(() => {
    const merged = { ...createBaseCalendarControl(), ...(rawControl || {}) };
    return merged;
  }, [rawControl]);

  const { eventCardSelected } = controlProperty || {};

  useEffect(() => {
    if (control.version !== '1.0.0') {
      const updated = {
        ...control,
        model: { ...control.model, columns: [...control.model.columns] },
        version: '1.0.0',
      };
      control.model.columns.forEach((column, index) => {
        if (column.columnType === 2) {
          let formula = '';
          column.expression?.forEach((expression) => {
            if (expression.operation) {
              switch (expression.operation) {
                case 22:
                  formula += '+';
                  break;
                case 23:
                  formula += '-';
                  break;
                case 24:
                  formula += '/';
                  break;
                case 25:
                  formula += '*';
                  break;
                default:
                  break;
              }
            } else if (expression.source?.ValueType === 3) {
              formula += `@${expression.source.Value}`;
            } else if (expression.source?.ValueType === 10) {
              formula += expression.source.Value;
            } else if (expression.source?.ValueType === 12) {
              formula += expression.source.Value ? '"True"' : '"False"';
            } else {
              formula += `"${expression.source?.Value}"`;
            }
          });
          updated.model.columns[index] = { ...column, columnType: 6, formula, expression: null, fieldType: 21 };
        }
      });
      if (!control.sidebarVisibility) {
        updated.sidebarVisibility = {
          resources: true,
          settings: true,
          waitlist: false,
        };
      }
      if (!control.resourceTitle) {
        updated.resourceTitle = 'Resources';
      }
      if (!control.model.fromWaitlistStatus) {
        updated.model.fromWaitlistStatus = 'Not Started';
      }
      if (!control.model.toWaitlistStatus) {
        updated.model.toWaitlistStatus = 'Not Scheduled';
      }
      onChange(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const interactions = useMemo(
    () => [
      {
        id: '1',
        caption: 'Resources tab',
        visible: control.sidebarVisibility?.resources,
      },
      {
        id: '2',
        caption: 'Wait list tab',
        visible: control.sidebarVisibility?.waitlist,
      },
      {
        id: '3',
        caption: 'Settings tab',
        visible: control.sidebarVisibility?.settings,
      },
    ],
    [control.sidebarVisibility],
  );

  const [openQuickEdit, setOpenQuickEdit] = useState(false);
  const [openResourcesTabEditor, setOpenResourcesTabEditor] = useState(false);
  const [openSettingsTabEditor, setOpenSettingsTabEditor] = useState(false);
  const [openWaitlistTabEditor, setOpenWaitlistTabEditor] = useState(false);
  const [open, setOpen] = useState(true);

  const gridRef = React.useRef<HTMLDivElement>(null);

  const compactEventTimeOptions: DropdownOption[] = (
    Object.values(COMPACT_EVENT_TIME_OPTIONS) as unknown as CompactEventTimeOption[]
  ).map((opt) => ({ value: opt.key, label: opt.label }));

  const layOutOptions = useMemo(() => LAYOUT_OPTIONS.map((option) => ({
        ...option,
        isSelectedLayout: control.view === option.key,
        visible: control.displayViews?.[option.category]?.[option.subCategory] ?? true,
      })), [control.view, control.displayViews]);

  const handlePropertyChange = (property: keyof CalendarControl, value: unknown) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleCaptionChange = (newCaption: string, newName: string) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  // Event list for ActionListSection
  const eventList = [
    control.onAddEvent && { id: control.onAddEvent, value: 'Add Event', label: 'Add calendar event' },
    control.onDragMoveEvent && { id: control.onDragMoveEvent, value: 'Drag Move Event', label: 'Drag/Move' },
    control.onSelectEvent && { id: control.onSelectEvent, value: 'Selection', label: 'Selection' },
  ].filter(Boolean) as { id: string; value: string; label: string }[];

  const handleAddAction = (source: string, value: string) => {
    const updated = { ...control, [source]: Guid.create() };
    onAddAction(updated, value);
  };

  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controlList = useSelector(selectControls) as Record<string, ControlWithDynamicProps>;

  const { data: fieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: control.model.viewName, complexFields: false },
    { skip: !control.model.viewName },
  );

  const filteredControlList = React.useMemo(() => {
    if (!controlList || !control?.id) return {};
    const newControlList: Record<string, ControlWithDynamicProps> = Object.keys(controlList)
      .filter((key) => key !== control.id)
      .reduce(
        (acc, key) => {
          acc[key] = controlList[key];
          return acc;
        },
        {} as Record<string, ControlWithDynamicProps>,
      );
    return newControlList;
  }, [controlList, control?.id]);

  const filteredFieldList = React.useMemo(
    () =>
      fieldList?.filter(
        (item: FieldListItem) =>
          !item.name.includes('_RecordID') &&
          item.name !== 'RecordID' &&
          ![
            FieldTypeNames.Address,
            FieldTypeNames.CardColumn,
            FieldTypeNames.FileAttachment,
            FieldTypeNames.Picture,
          ].includes(item.type as typeof FieldTypeNames.Address),
      ),
    [fieldList],
  );

  // Handler for filter changes
  const handleFilterChange = (expression: CriteriaExpression) => {
    const filterId =
      !control.model?.viewFilter?.filterId || control.model.viewFilter.filterId === Guid.empty()
        ? Guid.create()
        : control.model.viewFilter.filterId;
    const updated = {
      ...control,
      model: {
        ...control.model,
        viewFilter: {
          ...control.model.viewFilter,
          filterId,
          expression: toCamelCase(expression),
        },
      },
      filterDef: [
        {
          ...control.filterDef?.[0],
          expression: toCamelCase(expression),
        },
      ],
    };

    onChange(updated as unknown as CalendarControl);
  };

  const handleAddFilterClick = () => {
    setOpenQuickEdit(true);
    setOpen(true);
  };

  const handleCloseCriteriaEditor = () => {
    setOpenQuickEdit(false);
  };

  const HandleSetLayout = (_name: string, _value: string, _column: unknown, _rowIndex: number, primaryKey: number) => {
    const option = layOutOptions.find((opt) => opt.id === primaryKey);
    if (!option) return;

    // clear selection so this can then be set again right after to the proper value to trigger
    // screen re render to fix the display issues.
    const updated = {
      ...control,
      view: '',
      displayViews: {
        ...control.displayViews,
        [option.category]: {
          ...control.displayViews[option.category],
          [option.subCategory]: true,
        },
      },
    };

    onChange(updated);

    setTimeout(() => {
      onChange({ ...updated, view: option.key });
    }, 0); // Delay to ensure the state is updated before any further actions
  };

  const HandleSetLayoutVisibility = (
    _name: string,
    value: boolean,
    _column: unknown,
    _rowIndex: number,
    primaryKey: number,
  ) => {
    const option = layOutOptions.find((opt) => opt.id === primaryKey);
    if (!option) return;
    const updated = {
      ...control,
      displayViews: {
        ...control.displayViews,
        [option.category]: {
          ...control.displayViews[option.category],
          [option.subCategory]: value,
        },
      },
    };
    onChange(updated);
  };

  const handleOpenInteraction = (
    _e: unknown,
    _columnName: string,
    _val: unknown,
    _column: unknown,
    _rowIdx: number,
    primaryKey: string,
  ): void => {
    switch (primaryKey) {
      case '1':
        setOpenResourcesTabEditor(true);
        break;
      case '2':
        setOpenWaitlistTabEditor(true);
        break;
      case '3':
        setOpenSettingsTabEditor(true);
        break;
      default:
        console.warn('Unknown interaction type');
        break;
    }
  };

  const handleTabVisibilityChange = (
    _name: string,
    value: boolean,
    _column: unknown,
    _rowIndex: number,
    primaryKey: string,
  ) => {
    switch (primaryKey) {
      case '1': {
        const updated = { ...control, sidebarVisibility: { ...control.sidebarVisibility, resources: value } };
        onChange(updated);
        break;
      }
      case '2': {
        const updated = { ...control, sidebarVisibility: { ...control.sidebarVisibility, waitlist: value } };
        onChange(updated);
        break;
      }
      case '3': {
        const updated = { ...control, sidebarVisibility: { ...control.sidebarVisibility, settings: value } };
        onChange(updated);
        break;
      }
      default:
        console.warn('Unknown interaction type');
        break;
    }
  };

  const handleUpdateResources = (resource: ResourceData) => {
    const updated = {
      ...control,
      columnNameRefv2: resource.field.sourceField,
      resourceFieldv2: resource.field.name,
      resourceTitle: resource.title,
    };
    if (resource.field.name === 'AssignedTo') {
      updated.defaultResource = resource.defaultToCurrentUser ? 'Session.Username' : '';
    } else {
      updated.defaultResource = '';
    }
    onChange(updated);
    setOpenResourcesTabEditor(false);
  };

  const handleUpdateSettings = (settings: SettingsData) => {
    const updated = {
      ...control,
      displayOptions: {
        ...control.displayOptions,
        showAllDayEventsOnTop: settings.showAllDayEventsOnTop,
        showInactiveResources: settings.showInactiveResources,
        coloredEventBackgrounds: settings.coloredEventBackgrounds,
        workingHours: settings.workingHours,
      },
    };
    onChange(updated);
    setOpenSettingsTabEditor(false);
  };

  const handleUpdateWaitlist = (waitlist: WaitlistData) => {
    const updated = {
      ...control,
      model: {
        ...control.model,
        fromWaitlistStatus: waitlist.fromWaitlistStatus,
        toWaitlistStatus: waitlist.toWaitlistStatus,
      },
    };
    onChange(updated);
    setOpenWaitlistTabEditor(false);
  };

  if (eventCardSelected) {
    return <EventCardSettings control={control} fieldList={fieldList} onChange={onChange} onAddAction={onAddAction} />;
  }

  return (
    <s.Wrapper padding={16}>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <TextLine>Editing the base configuration and styles of the calendar.</TextLine>

      <s.LineWrapper>
        <Text>Calendar type</Text>
        <ButtonGroupRow
          id='calendar-type'
          width={184}
          selected={false}
          data={[
            // { value: true, label: 'Read only' },
            { value: false, label: 'Editable' },
          ]}
          onClick={(e) => handlePropertyChange('isReadOnly', e.value)}
        />
      </s.LineWrapper>
      <s.LineWrapper align='baseline'>
        <Text>Table</Text>
        <TableDropdown
          tableList={[{ name: 'Activity' }]}
          selectedTableName={control.model.viewName}
          disabled
          onChange={() => void {}}
          warningLabel='Changing the base table for this grid will mean that all properties, custom views and events will be lost.'
          warningSubLabel='Are you sure you want to change the table for this grid?'
        />
      </s.LineWrapper>
      <s.SettingDivider />
      <Accordion id='event-card' caption='Event Card' variant='left' open borderless>
        <s.LineWrapper
          style={{ padding: 12, border: '1px solid #BACAD0', cursor: 'pointer' }}
          onClick={() => onSelect(control.id, { eventCardSelected: true })}
        >
          Event card details
        </s.LineWrapper>
      </Accordion>
      <s.SettingDivider />
      <Accordion id='display' caption='Display' variant='left' open borderless>
        <CaptionInput
          id='title'
          label='Title'
          controlId={control.id}
          value={control.caption || ''}
          onChange={handleCaptionChange}
          maxLength={40}
        />
        <s.LineWrapper gap={8}>
          <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
          <Toggle
            id='show-label'
            checked={!control.hideCaption}
            onChange={(e) => handlePropertyChange('hideCaption', !e)}
            label='Show title'
            width='100%'
            style={{ justifyContent: 'flex-start' }}
            labelStyle={{ flexBasis: '100%' }}
          />
        </s.LineWrapper>

        <Text>Layout options</Text>
        <Grid
          id='layout-options'
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
              fieldType: FieldTypeIds.Integer,
              width: 'dynamic',
            },
            {
              name: 'isSelectedLayout',
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
              onChange: HandleSetLayout,
            },
            {
              name: 'name',
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
              displayAs: 'icon',
              width: 'dynamic',
              displayOptions: {
                trueIcon: { name: 'eye-open-V4' },
                falseIcon: { name: 'eye-closed-V4' },
                trueTooltip: 'Hide',
                falseTooltip: 'Show',
                disabledTooltip: 'Default view cannot be hidden.',
              },
              onChange: HandleSetLayoutVisibility,
              hideWhenDragging: true,
              isDisabled: (row: LayoutOptionRow) => row.isSelectedLayout, // Disable if it's the selected layout
            },
          ]}
          data={layOutOptions}
          rowStatuses={layOutOptions.map((option) => 
             option.isSelectedLayout ? 5 : 0 // 5 is locked status 0 is unchanged
          )}
          compact
          pageSize={50}
          totalRecords={layOutOptions.length}
          hideRecordCount
          pageNumber={1}
          isPageData
          canDelete={false}
        />

        <s.LineWrapper align='baseline' gap={8}>
          <Text>Mobile event time display</Text>
          <Dropdown
            id='compact-event-time'
            value={
              compactEventTimeOptions.find((opt: { value: string }) => opt.value === control.compactEventTime) ||
              compactEventTimeOptions[0]
            }
            options={compactEventTimeOptions}
            dropdownStyle='multi-icon'
            isV4Design
            width={184}
            onChange={(option) => handlePropertyChange('compactEventTime', option.value)}
          />
        </s.LineWrapper>
        <DefaultStateSelector control={control} onChange={onChange} />
      </Accordion>
      <s.SettingDivider />
      <Accordion id='interactions' caption='Interactions' variant='left' open borderless>
        <s.LineWrapper ref={gridRef}>
          <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
            <Grid
              id='interaction-items'
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
                  name: 'caption',
                  caption: '',
                  visible: true,
                  editable: false,
                  singleLine: true,
                  fieldType: FieldTypeIds.Text,
                  onColumnClick: handleOpenInteraction,
                  width: 'dynamic',
                },
                {
                  name: 'visible',
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
                  onChange: handleTabVisibilityChange,
                },
              ]}
              data={interactions}
              compact
              pageSize={50}
              totalRecords={interactions.length}
              hideRecordCount
              pageNumber={1}
              isPageData
              canDelete={false}
            />
          </Suspense>
        </s.LineWrapper>

        <ResourcesTabEditor
          id='resource-tab-editor'
          onClose={handleUpdateResources}
          onCancel={() => {
            setOpenResourcesTabEditor(false);
          }}
          open={openResourcesTabEditor}
          anchorEl={gridRef.current}
          control={control}
        />

        <SettingsTabEditor
          id='settings-tab-editor'
          onClose={handleUpdateSettings}
          onCancel={() => {
            setOpenSettingsTabEditor(false);
          }}
          open={openSettingsTabEditor}
          anchorEl={gridRef.current}
          control={control}
        />

        <WaitlistTabEditor
          id='waitlist-tab-editor'
          onClose={handleUpdateWaitlist}
          onCancel={() => {
            setOpenWaitlistTabEditor(false);
          }}
          open={openWaitlistTabEditor}
          anchorEl={gridRef.current}
          control={control}
        />
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
      >
        <CriteriaEditor
          id='calendar-filter'
          fieldList={filteredFieldList}
          controlList={filteredControlList}
          expression={control.filterDef?.[0]?.expression}
          onChange={handleFilterChange}
          displayPreferences={displayPreferences}
          dataModelId={control.model.viewName}
          filterId={control.filterDef?.[0]?.filterId}
          emptyMessage='No filters applied'
          includeControls
          includeSessionVariables
          showEmptyState
          showEmptyFilterIcon={false}
          openQuickEdit={openQuickEdit}
          onClose={handleCloseCriteriaEditor}
        />
      </Accordion>
      <s.SettingDivider />
      <ActionListSection
        caption='Events'
        values={eventList}
        emptyMessage='No events applied'
        canAdd
        actions={[
          { source: 'onAddEvent', value: 'Add Event', label: 'Add calendar event' },
          { source: 'onDragMoveEvent', value: 'Drag Move Event', label: 'Drag/Move' },
          { source: 'onSelectEvent', value: 'Selection', label: 'Selection' },
        ]}
        addLabel='Add'
        onAddAction={handleAddAction}
        control={control}
        valueKey='value'
        optionKey='value'
      />
    </s.Wrapper>
  );
};

export default CalendarEditor;
