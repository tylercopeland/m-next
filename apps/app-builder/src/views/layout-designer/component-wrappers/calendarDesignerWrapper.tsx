import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  CalendarResourceHelper,
  CalendarWaitlist,
  CalendarHelperModel,
  getLocalStorageSettings,
  getStorageKey,
  DateRange,
} from '@m-next/calendar';
import { formatEvents } from '@m-next/calendar/src/CalendarUtilities';
import {
  useGetDropdownDataLegacyQuery,
  useGetCalendarDataQuery,
  useGetSharedUsersQuery,
  useGetGridDataLegacyQuery,
} from '../../../common/services/runtimeApi';
import {
  selectControls,
  selectActiveRecordId,
  selectSelectedControlProperty,
  controlSelected,
} from '../../../common/services/screenLayoutSlice';
import { selectScreenId } from '../../../common/services/appSlice';
import { selectMethodIdentity, selectUserId } from '../../../common/services/sessionSlice';
import { RootState } from '../../../types/screenLayoutTypes';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { colors } from '@m-next/styles';
import styled from '@emotion/styled';

export interface CalendarDesignerWrapperProps {
  id: string;
  canvasWidth: number;
}

// Resource display constants
const RESOURCE_DISPLAY = {
  DEFAULT_RESOURCE_TITLE_LOWERCASE: 'resources',
  DEFAULT_RESOURCE_TITLE: 'Resources',
  STORAGE_KEY: 'resources', // Key used for localStorage
  DIRECTIVE_NAME: 'Resources', // Name used in ResourceDirective
  RESOURCE_TYPE_USER: 'User',
  RESOURCE_TYPE_ENTITY: 'Entity',
};

// Fix so that child elements don't interfere with parent clicks in app builder
export const CalendarWrapper = styled.div`
  .e-schedule .e-appointment {
    pointer-events: auto !important;
    cursor: pointer !important;
  }

  .e-schedule .e-appointment *,
  .e-schedule .e-appointment-details *,
  .template-wrap *,
  .subject,
  .subject *,
  .description,
  .description * {
    pointer-events: none !important;
  }

  .e-schedule .e-event-resize {
    pointer-events: auto !important;
  }

  cursor: pointer;
`;

const CalendarDesignerWrapper: React.FC<CalendarDesignerWrapperProps> = ({ id, canvasWidth }) => {
  const dispatch = useDispatch();
  const screenId = useSelector(selectScreenId);
  const activeRecordId = useSelector(selectActiveRecordId);
  const control = useSelector((state) => selectControls(state as RootState)[id]);
  const controlProperty = useSelector((state: RootState) => selectSelectedControlProperty(state)) as {
    eventCardSelected?: boolean;
  };

  // Provide default control structure for new calendar components
  const defaultControl = useMemo(
    () => ({
      id,
      type: 'CAL',
      caption: 'Calendar',
      hideCaption: false,
      disabled: false,
      view: 'Month',
      displayViews: {
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
      compactEventTime: 'false', // String value as expected by Calendar component
      isEditable: true,
      version: '2.0.0',
      columnNameRefv2: 'UserName',
      viewNamev2: 'Users',
      resourceFieldv2: 'AssignedTo',
      resourceField: 'AssignedTo',
      resourceView: 'Users',
      resourceTitle: 'Resources',
      defaultResource: 'Session.Username',
      buttons: [],
      styles: {},
      timeRange: {
        startTime: '9:00',
        endTime: '17:00',
      },
      model: {
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
        resources: [],
        showWaitlist: false,
        toWaitlistStatus: 'Pending', // Default value to prevent undefined error
        showSettings: true,
      },
      displayOptions: {
        showAllDayEventsOnTop: true,
        showInactiveResources: false,
        coloredEventBackgrounds: false,
        workingHours: {
          start: '9:00',
          end: '17:00',
          days: [0, 1, 2, 3, 4, 5, 6],
        },
      },
      sidebarVisibility: {
        resources: true,
        waitlist: true,
        settings: true,
      },
      hoverCard: {
        title: true,
        description: true,
        startdate: true,
        starttime: true,
        enddate: true,
        endtime: true,
        resource: true,
      },
      onAddEvent: null,
      showAllDayAppointments: true,
    }),
    [id],
  );

  // Merge control with defaults, with control taking precedence
  const safeControl = useMemo(() => {

    if (!control) {
      return defaultControl;
    }

    // Convert displayViews array to object format if needed
    let displayViews = defaultControl.displayViews;
    if (control.displayViews) {
      if (Array.isArray(control.displayViews)) {
        // Convert array format to object format with lowercase keys
        displayViews = {
          day: { visible: false, standard: false, vertical: false, horizontal: false },
          week: { visible: false, standard: false, vertical: false, horizontal: false },
          month: { visible: false, standard: false },
          list: { visible: false, weekly: false, full: false },
        };
        control.displayViews.forEach((view: string) => {
          // Convert legacy uppercase array values to lowercase object keys
          const lowerView = view.toLowerCase();
          if (lowerView === 'day') {
            displayViews.day = { visible: true, standard: true, vertical: false, horizontal: false };
          } else if (lowerView === 'week') {
            displayViews.week = { visible: true, standard: true, vertical: false, horizontal: false };
          } else if (lowerView === 'month') {
            displayViews.month = { visible: true, standard: true };
          }
        });
      } else if (typeof control.displayViews === 'object') {
        // Ensure the object has the correct structure - merge with defaults and handle case variations
        displayViews = { ...defaultControl.displayViews };

        // Handle various possible structures in existing controls
        const existingViews = control.displayViews;

        // Check for lowercase keys (correct format)
        if (existingViews.day) {
          displayViews.day = { ...displayViews.day, ...existingViews.day };
        }
        if (existingViews.week) {
          displayViews.week = { ...displayViews.week, ...existingViews.week };
        }
        if (existingViews.month) {
          displayViews.month = { ...displayViews.month, ...existingViews.month };
        }
        if (existingViews.list) {
          displayViews.list = { ...displayViews.list, ...existingViews.list };
        }

        // Check for uppercase keys (legacy format) and convert
        if (existingViews.Day) {
          displayViews.day = {
            visible: existingViews.Day.visible ?? true,
            standard: true,
            vertical: false,
            horizontal: false,
          };
        }
        if (existingViews.Week) {
          displayViews.week = {
            visible: existingViews.Week.visible ?? true,
            standard: true,
            vertical: false,
            horizontal: false,
          };
        }
        if (existingViews.Month) {
          displayViews.month = {
            visible: existingViews.Month.visible ?? true,
            standard: true,
          };
        }
      }
    }

    const merged = {
      ...defaultControl,
      ...control,
      displayViews, // Use our properly formatted displayViews
      compactEventTime:
        typeof control.compactEventTime === 'boolean'
          ? String(control.compactEventTime)
          : control.compactEventTime || defaultControl.compactEventTime,
      model: {
        ...defaultControl.model,
        ...(control.model || {}),
      },
      displayOptions: {
        ...defaultControl.displayOptions,
        ...(control.displayOptions || {}),
      },
      sidebarVisibility: {
        ...defaultControl.sidebarVisibility,
        ...(control.sidebarVisibility || {}),
      },
      timeRange: {
        ...defaultControl.timeRange,
        ...(control.timeRange || {}),
      },
    };

    return merged;
  }, [control, defaultControl]);

  const calendarHelperModel = useRef(CalendarHelperModel(safeControl, 7));
  const schedulerRef = useRef(null);
  const [viewLoading, setViewLoading] = useState(false);

  const columnName = safeControl.columnNameRefv2 || safeControl.resourceField || 'UserName';
  const viewName = safeControl.viewNamev2 || safeControl.resourceView || 'Users';
  const resourceField = safeControl.resourceFieldv2 || 'AssignedTo';
  const resourceMappedField = resourceField.includes('_RecordID') ? resourceField : `${resourceField}Id`;

  const { activeResourceExpression, buildViewFilter, resourceFilter } = CalendarResourceHelper(viewName, columnName);

  const methodIdentity = useSelector(selectMethodIdentity) as string;
  const userId = useSelector(selectUserId) as string;

  const [dateRange, setDateRange] = useState({
    fromDate: safeControl.model.fromDate,
    toDate: safeControl.model.toDate,
  });

  const { data: sharedUsers } = useGetSharedUsersQuery(null, { skip: !safeControl });

  const [selectedResources, setSelectedResources] = useState<{ RecordID: string; [key: string]: string }[]>([]);

  const formatResources = useCallback(
    (r: { RecordID: string; [key: string]: string }[]) =>
      r.map((obj) => ({
        key: parseInt(obj.RecordID, 10),
        value: obj[columnName],
      })),
    [columnName],
  );

  // Memoize the calendar query body to prevent unnecessary re-renders
  const calendarQueryBody = useMemo(
    () => ({
      ...safeControl,
      model: {
        ...safeControl.model,
        resources: selectedResources.length > 0 ? formatResources(selectedResources) : safeControl.model.resources,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      },
    }),
    [safeControl, selectedResources, dateRange.fromDate, dateRange.toDate, formatResources],
  );

  const {
    data: calendarData,
    isLoading: loadingCalendarData,
    refetch: refetchCalendarData,
  } = useGetCalendarDataQuery(
    {
      screenId,
      body: calendarQueryBody,
    },
    { skip: !control },
  );

  useEffect(() => {
    const entry = getLocalStorageSettings(id, methodIdentity);
    const storageKey = getStorageKey(viewName, resourceField);
    const cached = entry?.[storageKey];

    if (cached?.items && Array.isArray(cached.items) && cached.items.length > 0) {
      setSelectedResources(cached.items);
      // Only refetch if we have the necessary data
      if (screenId && control) {
        refetchCalendarData();
      }
    }
  }, [id, methodIdentity, viewName, resourceField, screenId, control, refetchCalendarData]);

  const { data: gridData, refetch: refetchGridData } = useGetGridDataLegacyQuery(
    {
      id: calendarHelperModel.current.gridModel.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: { ...calendarHelperModel.current.gridModel },
      },
    },
    { skip: !calendarHelperModel.current.gridModel },
  );

  const formattedGridData = useMemo(() => {
    const formatted = { rows: [] as { name: string; value: string }[][] };
    if (gridData) {
      gridData.dataSource.forEach((row: { cells: { name: string; value: string }[] }) => {
        formatted.rows.push(row.cells);
      });
    }
    return formatted;
  }, [gridData]);

  const { data: waitlistData, refetch: refetchWaitlistData } = useGetCalendarDataQuery(
    {
      screenId,
      body: { ...calendarHelperModel.current.calendar },
    },
    { skip: !calendarHelperModel.current.calendar },
  );

  const isNewCalendarConfig = useCallback(() => {
    // If we have v2 properties set, it's always a new config
    if (safeControl.resourceFieldv2) return true;

    // Otherwise check the legacy properties
    return (
      (safeControl.resourceField === 'UserName' && safeControl.resourceView === 'Users') ||
      (safeControl.resourceField && safeControl.resourceView)
    );
  }, [safeControl.resourceFieldv2, safeControl.resourceField, safeControl.resourceView]);

  const getViewFilterModel = useCallback(
    (showInactiveResources: boolean) => {
      const isNewConfig = isNewCalendarConfig();
      const getFilter = (shared: number[]) => {
        const filter = resourceFilter;
        const isActiveResourceExp = activeResourceExpression;

        if (isNewConfig) {
          // Only apply the RecordID filter for AssignedTo resources
          if (resourceField === 'AssignedTo') {
            filter.viewFilter = buildViewFilter(shared);
          } else {
            // For other resource types, create a filter without RecordID restrictions
            filter.viewFilter = {
              filterId: '73261e80-ec5d-b174-53d7-3a9a2ec3c221',
              filterName: 'DrpFilter',
              viewName,
              versionId: '00000000-0000-0000-0000-000000000000',
              searchString: null,
              isDefault: true,
              isHidden: false,
              state: 1,
              expression: [
                {
                  operation: 0,
                  dateField: null,
                  source: null,
                },
              ],
              sorting: [],
              hidden: [],
              visibleColumns: null,
            };
          }

          if (showInactiveResources) {
            filter.viewFilter.expression.push({
              operation: 1,
              dateField: null,
              source: null,
            });
          } else {
            filter.viewFilter.expression = filter.viewFilter.expression.concat(isActiveResourceExp);
          }
        }

        filter.paging.pageSize = 1000;
        return filter;
      };

      if (resourceField === 'AssignedTo') {
        const sharedData = sharedUsers ? sharedUsers.filter((item: number | null) => item != null) : [];
        return getFilter(sharedData);
      }

      // Skip shared users call for other resource types
      return getFilter([]);
    },
    [
      resourceField,
      sharedUsers,
      activeResourceExpression,
      buildViewFilter,
      viewName,
      resourceFilter,
      isNewCalendarConfig,
    ],
  );

  const convertNumericDaysToBooleanArray = (numericDays: number[]) => {
    if (!Array.isArray(numericDays)) return [true, true, true, true, true, true, true];

    const booleanArray = new Array(7).fill(false);

    numericDays.forEach((day) => {
      if (day >= 0 && day < 7) {
        booleanArray[day] = true;
      }
    });

    return booleanArray;
  };

  const calendarSettings = useMemo(
    () => ({
      startTime: safeControl.displayOptions?.workingHours?.start || safeControl.timeRange.startTime,
      endTime: safeControl.displayOptions?.workingHours?.end || safeControl.timeRange.endTime,
      showAllDayEvents: safeControl.displayOptions?.showAllDayEventsOnTop ?? safeControl.showAllDayAppointments,
      showInactiveResources: safeControl.displayOptions?.showInactiveResources ?? false,
      calendarDays: convertNumericDaysToBooleanArray(safeControl.displayOptions?.workingHours?.days),
      fullColoredEvents: safeControl.displayOptions?.coloredEventBackgrounds ?? false,
    }),
    [
      safeControl.displayOptions?.workingHours?.start,
      safeControl.displayOptions?.workingHours?.end,
      safeControl.displayOptions?.showAllDayEventsOnTop,
      safeControl.displayOptions?.showInactiveResources,
      safeControl.displayOptions?.workingHours?.days,
      safeControl.displayOptions?.coloredEventBackgrounds,
      safeControl.timeRange.startTime,
      safeControl.timeRange.endTime,
      safeControl.showAllDayAppointments,
    ],
  );

  const model = useMemo(
    () => getViewFilterModel(calendarSettings.showInactiveResources),
    [calendarSettings.showInactiveResources, getViewFilterModel],
  );

  const { data: resources } = useGetDropdownDataLegacyQuery(
    {
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model,
      },
    },
    { skip: !control || !model },
  );

  useEffect(() => {
    if (selectedResources.length === 0 && resources?.data && resources.data.length > 0) {
      setSelectedResources(resources.data);
    }
  }, [resources?.data, selectedResources.length]);

  useEffect(() => {
    setViewLoading(true);
    setTimeout(() => {
      setViewLoading(false);
    }, 500);
  }, [safeControl.view]);

  const eventCardMenu = useMemo(() => {
    const calendarMenuButtons = [];

    if (safeControl.buttons) {
      safeControl.buttons.forEach((button: { caption: string }) => {
        calendarMenuButtons.push({
          label: button.caption,
          disabled: false,
          onClick: () => {},
          style: {
            color: safeControl.styles.color || colors.blue,
            variant: safeControl.styles.variant || 'primary',
          },
        });
      });
    } else {
      calendarMenuButtons.push({
        label: 'Edit',
        disabled: false,
        onClick: () => {},
        style: {
          color: safeControl.styles.color || colors.blue,
          variant: safeControl.styles.variant || 'primary',
        },
      });
    }

    return calendarMenuButtons;
  }, [safeControl.buttons, safeControl.styles]);

  const originalResourceTitle =
    safeControl.resourceTitle || safeControl.model?.resourceTitle || RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE;

  const resourceTitleFormatted = useMemo(
    () => ({
      forTab: originalResourceTitle ?? RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
      forDropdown: originalResourceTitle
        ? originalResourceTitle.toLowerCase()
        : RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
      forDisplay: originalResourceTitle
        ? originalResourceTitle.toLowerCase()
        : RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
    }),
    [originalResourceTitle],
  );

  const renderWaitListTab = useCallback(
    () => (
      <CalendarWaitlist
        scheduler={schedulerRef}
        eventCardMenu={eventCardMenu}
        calendarModel={safeControl}
        gridData={formattedGridData}
        fetchGridData={() => refetchGridData()}
        modalData={{ data: waitlistData }}
        fetchModalData={() => refetchWaitlistData()}
        partialRecordCount={gridData ? gridData.partialCount : 0}
        totalRows={gridData ? gridData.totalRows : 0}
        calendarData={calendarData}
        hoverCard={safeControl.hoverCard}
      />
    ),
    [
      eventCardMenu,
      safeControl,
      formattedGridData,
      refetchGridData,
      waitlistData,
      refetchWaitlistData,
      gridData,
      calendarData,
    ],
  );

  const additionalTab = useMemo(() => {
    if (safeControl.model.showWaitlist && safeControl.sidebarVisibility?.waitlist !== false) {
      return [
        {
          id: '3',
          order: 1,
          caption: 'Wait List',
        },
      ];
    }
    return [];
  }, [safeControl.sidebarVisibility?.waitlist, safeControl.model.showWaitlist]);

  // Memoize empty functions to prevent recreation
  const emptySetSelectedResources = useCallback(() => {}, []);
  const emptyUpdateControlResources = useCallback(() => {}, []);
  const emptyOnAddEvent = useCallback(() => {}, []);

  // Memoize the hover card config
  const hoverCardConfig = useMemo(
    () => ({
      title: true,
      description: true,
      startdate: true,
      starttime: true,
      enddate: true,
      endtime: true,
      resource: true,
    }),
    [],
  );

  // Memoize the default display options
  const defaultDisplayOptions = useMemo(
    () => ({
      showAllDayEventsOnTop: true,
      showInactiveResources: false,
      coloredEventBackgrounds: false,
      workingHours: {
        start: '9:00',
        end: '17:00',
        days: [0, 1, 2, 3, 4, 5, 6],
      },
    }),
    [],
  );

  // Memoize the default sidebar visibility
  const defaultSidebarVisibility = useMemo(
    () => ({
      resources: true,
      waitlist: true,
      settings: true,
    }),
    [],
  );

  // Memoize the setDateRange handler
  const handleSetDateRange = useCallback((r: unknown) => setDateRange(r as DateRange), []);

  // Memoize the onClick handler
  const handleCalendarClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isEventCard = target.closest('.e-appointment') || target.closest('.e-event');

      if (isEventCard && controlProperty?.eventCardSelected) {
        e.stopPropagation();
      } else if (isEventCard && !controlProperty?.eventCardSelected) {
        dispatch(
          controlSelected({
            controlId: id,
            property: { eventCardSelected: true },
          }),
        );
        e.stopPropagation();
      }
    },
    [controlProperty?.eventCardSelected, dispatch, id],
  );

  // Process calendar data to map events to resources properly
  const processedCalendarData = useMemo(() => {
    if (!calendarData || !selectedResources.length) return calendarData;

    // Format through utilities
    const formatted = formatEvents(calendarData, calendarSettings.showAllDayEvents, safeControl.isEditable);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return formatted.map((event: any) => {
      const result = { ...event };

      // Map the resource field based on the resource type
      const resourceNameField = resourceField === 'AssignedTo' ? `${resourceField}Name` : resourceField;
      const selectedResourceNames = selectedResources.map((res) => res[columnName]);

      if (selectedResourceNames.includes(event[resourceNameField])) {
        const matchingResource = selectedResources.find((res) => res[columnName] === event[resourceNameField]);

        if (matchingResource) {
          result[resourceMappedField] = matchingResource.RecordID;
          // For backward compatibility
          result.AssignedToId = matchingResource.RecordID;
        }
      }

      return result;
    });
  }, [
    calendarData,
    selectedResources,
    resourceField,
    resourceMappedField,
    columnName,
    calendarSettings.showAllDayEvents,
    safeControl.isEditable,
  ]);

  // Set default date range when resources are available but no date range is set
  useEffect(() => {
    if (selectedResources.length > 0 && (!dateRange.fromDate || !dateRange.toDate)) {
      // If we have resources but no date range, set a default date range
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const fromDate = today.toISOString().split('T')[0];
      const toDate = tomorrow.toISOString().split('T')[0];

      setDateRange({
        fromDate,
        toDate,
      });
    }
  }, [selectedResources, dateRange]);

  return (
    <CalendarWrapper onClick={handleCalendarClick}>
      {(loadingCalendarData || viewLoading) && (
        <>
          <LoadingSkeleton count={1} height={100} />
        </>
      )}
      {!loadingCalendarData && !viewLoading && (
        <>
          <Calendar
          schedulerRef={schedulerRef}
          caption={safeControl.caption}
          hideCaption={safeControl.hideCaption}
          userIdentity={methodIdentity}
          id={`${safeControl.id}`}
          resourceLabel={columnName}
          resourceMappedField={resourceMappedField}
          resourceTitle={
            safeControl.resourceTitle || safeControl.model?.resourceTitle || RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE
          }
          resourceTitleFormatted={resourceTitleFormatted}
          resources={resources?.data ?? []}
          selectedResources={selectedResources}
          setSelectedResources={emptySetSelectedResources}
          defaultResource={
            safeControl.defaultResource === 'Session.Username' &&
            resources?.data.find((res: { RecordID: string | number }) => res.RecordID === String(userId))
              ? String(userId)
              : (resources?.data[0]?.RecordID ?? null)
          }
          eventCardMenu={eventCardMenu}
          updateControlResources={emptyUpdateControlResources}
          data={processedCalendarData}
          displayViews={safeControl.displayViews}
          calendarSettings={calendarSettings}
          compactEventTime={safeControl.compactEventTime}
          isDisabled={safeControl.disabled}
          setDateRange={handleSetDateRange}
          currentView={safeControl.view}
          additionalTabs={additionalTab}
          renderAdditionalTabs={renderWaitListTab}
          canvasWidth={canvasWidth}
          hoverCard={hoverCardConfig}
          showWaitlist={safeControl.model.showWaitlist}
          toWaitlistStatus={safeControl.model.toWaitlistStatus}
          showSettings={safeControl.model.showSettings}
          sidebarVisibility={safeControl.sidebarVisibility || defaultSidebarVisibility}
          displayOptions={safeControl.displayOptions || defaultDisplayOptions}
          onAddEvent={safeControl.onAddEvent ? emptyOnAddEvent : null}
          isReadOnly
          version={safeControl.version}
        />
        </>
      )}
    </CalendarWrapper>
  );
};

export default CalendarDesignerWrapper;
