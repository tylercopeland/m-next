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
} from '../../../../apps/app-builder/src/common/services/runtimeApi';
import {
  selectControls,
  selectActiveRecordId,
  selectSelectedControlProperty,
  controlSelected,
  RootState,
} from '../redux';
import { CalendarControl } from '../redux/types';
import { selectScreenId } from '../../../../apps/app-builder/src/common/services/appSlice';
import { selectMethodIdentity, selectUserId } from '../../../../apps/app-builder/src/common/services/sessionSlice';
// @ts-ignore - screenLayoutSlice is a .jsx file without type declarations
import { selectLayoutDesignerState } from '../../../../apps/app-builder/src/common/services/screenLayoutSlice';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { colors } from '@m-next/styles';
import styled from '@emotion/styled';

export interface CalendarDesignerWrapperProps {
  id: string;
  canvasWidth: number;
}

interface GridDataResponse {
  dataSource: { cells: { name: string; value: string }[] }[];
  partialCount: number;
  totalRows: number;
}

interface DropdownDataResponse {
  data: { RecordID: string; [key: string]: string }[];
}

// Constants for unassigned user functionality
const UNASSIGNED_USER_RECORD_ID = '0';

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
  const control = useSelector((state) => selectControls(state as RootState)[id]) as CalendarControl | undefined;
  const controlProperty = useSelector((state: RootState) => selectSelectedControlProperty(state)) as {
    eventCardSelected?: boolean;
  };
  const layoutDesignerState = useSelector(selectLayoutDesignerState) as { isV4Screen?: boolean } | null;
  const isV4Screen = layoutDesignerState?.isV4Screen ?? false;

  // Track wrapper dimensions for dynamic resizing (like GridWrapperRedux)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [calendarHeightPx, setCalendarHeightPx] = useState(600);
  const useDynamicSizing = true; // Always use dynamic sizing in layout canvas

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
        if (existingViews.day && typeof existingViews.day === 'object') {
          displayViews.day = { ...displayViews.day, ...(existingViews.day as Record<string, unknown>) };
        }
        if (existingViews.week && typeof existingViews.week === 'object') {
          displayViews.week = { ...displayViews.week, ...(existingViews.week as Record<string, unknown>) };
        }
        if (existingViews.month && typeof existingViews.month === 'object') {
          displayViews.month = { ...displayViews.month, ...(existingViews.month as Record<string, unknown>) };
        }
        if (existingViews.list && typeof existingViews.list === 'object') {
          displayViews.list = { ...displayViews.list, ...(existingViews.list as Record<string, unknown>) };
        }

        // Check for uppercase keys (legacy format) and convert
        if ('Day' in existingViews && existingViews.Day && typeof existingViews.Day === 'object') {
          const dayConfig = existingViews.Day as { visible?: boolean; [key: string]: unknown };
          displayViews.day = {
            visible: dayConfig.visible ?? true,
            standard: true,
            vertical: false,
            horizontal: false,
          };
        }
        if ('Week' in existingViews && existingViews.Week && typeof existingViews.Week === 'object') {
          const weekConfig = existingViews.Week as { visible?: boolean; [key: string]: unknown };
          displayViews.week = {
            visible: weekConfig.visible ?? true,
            standard: true,
            vertical: false,
            horizontal: false,
          };
        }
        if ('Month' in existingViews && existingViews.Month && typeof existingViews.Month === 'object') {
          const monthConfig = existingViews.Month as { visible?: boolean; [key: string]: unknown };
          displayViews.month = {
            visible: monthConfig.visible ?? true,
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

  const calendarHelperModel = useRef(
    CalendarHelperModel(
      {
        ...safeControl,
        filterDef: [
          {
            expression: [
              {
                operation: 0,
                dateField: null,
                source: null,
              },
            ],
          },
        ],
      },
      7,
    ),
  );
  const schedulerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [viewLoading, setViewLoading] = useState(false);

  // Track mount status to prevent updates to unmounted components
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const columnName = safeControl.columnNameRefv2 || safeControl.resourceField || 'UserName';
  const viewName = safeControl.viewNamev2 || safeControl.resourceView || 'Users';
  const resourceField = safeControl.resourceFieldv2 || 'AssignedTo';
  const resourceMappedField = resourceField.includes('_RecordID') ? resourceField : `${resourceField}Id`;

  // Helper function to check if we should include unassigned resource
  const shouldIncludeUnassigned = useCallback(() => {
    // Only include unassigned for AssignedTo field type
    return resourceField === 'AssignedTo';
  }, [resourceField]);

  const { activeResourceExpression, buildViewFilter, resourceFilter } = CalendarResourceHelper(viewName, columnName);

  const methodIdentity = useSelector(selectMethodIdentity) as string;
  const userId = useSelector(selectUserId) as string;

  const [dateRange, setDateRange] = useState({
    fromDate: safeControl.model.fromDate ?? undefined,
    toDate: safeControl.model.toDate ?? undefined,
  });

  const { data: sharedUsers } = useGetSharedUsersQuery() as { data: (number | null)[] | undefined };

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
        columnNameRefv2: safeControl.columnNameRefv2 || columnName,
        resources: selectedResources.length > 0 ? formatResources(selectedResources) : safeControl.model.resources,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        includeUnassigned: shouldIncludeUnassigned(),
        includeNullAssignedTo: selectedResources.some((r) => r.RecordID === UNASSIGNED_USER_RECORD_ID),
      },
    }),
    [safeControl, selectedResources, dateRange.fromDate, dateRange.toDate, formatResources, shouldIncludeUnassigned],
  );

  const {
    data: calendarData,
    isLoading: loadingCalendarData,
    refetch: refetchCalendarData,
  } = useGetCalendarDataQuery({
    // @ts-expect-error - screenId is string | null
    screenId,
    body: calendarQueryBody,
  }) as {
    data: unknown;
    isLoading: boolean;
    refetch: () => void;
  };

  useEffect(() => {
    const entry = getLocalStorageSettings(id, methodIdentity);
    const storageKey = getStorageKey(viewName, resourceField);
    const cached = entry?.[storageKey];

    if (cached?.items && Array.isArray(cached.items) && cached.items.length > 0) {
      if (isMountedRef.current) {
        setSelectedResources(cached.items);
        // Only refetch if we have the necessary data
        if (screenId && control) {
          refetchCalendarData();
        }
      }
    }
  }, [id, methodIdentity, viewName, resourceField, screenId, control, refetchCalendarData]);

  const gridQueryResult = useGetGridDataLegacyQuery({
    // @ts-expect-error - GridDataLegacyQuery params structure
    id: calendarHelperModel.current.gridModel.id ?? '',
    screenId: screenId ?? '',
    activeRecordId: activeRecordId ?? '',
    body: {
      screenState: null,
      model: { ...calendarHelperModel.current.gridModel },
    },
  }) as { data: unknown; error?: unknown; isLoading: boolean; refetch: () => void };
  const gridData = gridQueryResult.data as GridDataResponse | undefined;
  const refetchGridData = gridQueryResult.refetch;

  const formattedGridData = useMemo(() => {
    const formatted = { rows: [] as { name: string; value: string }[][] };
    if (gridData) {
      gridData.dataSource.forEach((row: { cells: { name: string; value: string }[] }) => {
        formatted.rows.push(row.cells);
      });
    }
    return formatted;
  }, [gridData]);
  // @ts-expect-error - Waitlist query body structure differs from DataModel interface

  const waitlistQueryResult = useGetCalendarDataQuery({
    screenId: screenId ?? '',
    body: { ...calendarHelperModel.current.calendar },
  }) as { data: unknown; error?: unknown; isLoading: boolean; refetch: () => void };
  const waitlistData = waitlistQueryResult.data;
  const refetchWaitlistData = waitlistQueryResult.refetch;

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
        const sharedData: number[] = sharedUsers ? sharedUsers.filter((item): item is number => item != null) : [];
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

  const convertNumericDaysToBooleanArray = (numericDays: number[] | undefined) => {
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

  const resourcesQueryResult = useGetDropdownDataLegacyQuery({
    // @ts-expect-error - useGetDropdownDataLegacyQuery DataModel parameter mismatch
    id: control?.id ?? '',
    screenId: screenId ?? '',
    activeRecordId: activeRecordId ?? '',
    body: {
      screenState: null,
      model,
    },
  });
  const resources = resourcesQueryResult.data as DropdownDataResponse | undefined;

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
            color: (safeControl.styles as Record<string, unknown>)?.color || colors.blue,
            variant: (safeControl.styles as Record<string, unknown>)?.variant || 'primary',
          },
        });
      });
    } else {
      calendarMenuButtons.push({
        label: 'Edit',
        disabled: false,
        onClick: () => {},
        style: {
          color: (safeControl.styles as Record<string, unknown>)?.color || colors.blue,
          variant: (safeControl.styles as Record<string, unknown>)?.variant || 'primary',
        },
      });
    }

    return calendarMenuButtons;
  }, [safeControl.buttons, safeControl.styles]);

  const originalResourceTitle =
    safeControl.resourceTitle ||
    (safeControl.model as Record<string, unknown>)?.resourceTitle ||
    RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE;

  const resourceTitleFormatted = useMemo(
    () => ({
      forTab: originalResourceTitle ?? RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
      forDropdown: originalResourceTitle
        ? String(originalResourceTitle || '').toLowerCase()
        : RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
      forDisplay: originalResourceTitle
        ? String(originalResourceTitle || '').toLowerCase()
        : RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE_LOWERCASE,
    }),
    [originalResourceTitle],
  );

  const renderWaitListTab = useCallback(
    () => (
      <CalendarWaitlist
        // @ts-ignore - CalendarModel type mismatch
        scheduler={schedulerRef}
        // @ts-ignore - CalendarModel type structure
        eventCardMenu={eventCardMenu}
        // @ts-ignore - CalendarEvent array type
        calendarModel={safeControl as Record<string, unknown>}
        // @ts-ignore - CalendarEvent array initialization
        gridData={formattedGridData}
        fetchGridData={() => refetchGridData()}
        // @ts-ignore - CalendarEvent array type
        modalData={{ data: waitlistData as Record<string, unknown> }}
        fetchModalData={() => refetchWaitlistData()}
        // @ts-ignore - CalendarEvent type mismatch with data structure
        partialRecordCount={gridData ? gridData.partialCount : 0}
        totalRows={gridData ? gridData.totalRows : 0}
        calendarData={calendarData as Record<string, unknown>}
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
  // @ts-ignore - formatEvents return type
  const processedCalendarData = useMemo(() => {
    if (!calendarData || !selectedResources.length) return calendarData as unknown[];

    // Format through utilities

    const formatted = formatEvents(
      // @ts-ignore - Calendar event parameter type
      calendarData as Record<string, unknown>,
      calendarSettings.showAllDayEvents,
      safeControl.isEditable,
    );

    // @ts-ignore - formatted.map event parameter type
    const result = formatted.map((event: Record<string, unknown>) => {
      // @ts-ignore - Event parameter type incompatibility
      const mapped = { ...event };

      // Map the resource field based on the resource type
      const resourceNameField = resourceField === 'AssignedTo' ? `${resourceField}Name` : resourceField;
      const selectedResourceNames = selectedResources.map((res) => res[columnName]);

      // @ts-ignore - Event property access type
      if (selectedResourceNames.includes(event[resourceNameField])) {
        const matchingResource = selectedResources.find((res) => res[columnName] === event[resourceNameField]);

        if (matchingResource) {
          mapped[resourceMappedField] = matchingResource.RecordID;
          // For backward compatibility
          mapped.AssignedToId = matchingResource.RecordID;
        }
      }

      return mapped;
    });

    return result;
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

      if (isMountedRef.current) {
        setDateRange({
          fromDate,
          toDate,
        });
      }
    }
  }, [selectedResources, dateRange]);

  // Use ResizeObserver to track wrapper dimension changes and calculate calendar size
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) {
      return;
    }

    const updateCalendarSize = () => {
      if (!isMountedRef.current) return;

      const wrapperHeight = currentWrapper.clientHeight;

      // Account for wrapper padding: 16px (8px top + 8px bottom for height)
      const verticalReservedSpace = 16;

      const calculatedHeightPx = Math.max(400, wrapperHeight - verticalReservedSpace);

      if (useDynamicSizing) {
        setCalendarHeightPx(calculatedHeightPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCalendarSize();
    });

    resizeObserver.observe(currentWrapper);

    // Initial calculation
    updateCalendarSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicSizing, id]);

  const calendarSize = useMemo(() => {
    const height = useDynamicSizing ? `${calendarHeightPx}px` : '600px';

    return {
      height,
    };
  }, [calendarHeightPx, useDynamicSizing]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CalendarWrapper onClick={handleCalendarClick}>
        {(loadingCalendarData || viewLoading) && (
          <>
            <LoadingSkeleton count={1} height={100} />
          </>
        )}
        {!loadingCalendarData && !viewLoading && (
          <>
            <Calendar
              key={`calendar-${safeControl.id}`}
              schedulerRef={schedulerRef}
              caption={safeControl.caption}
              hideCaption={safeControl.hideCaption}
              {...(isV4Screen ? { height: calendarSize.height } : {})}
              // @ts-ignore - originalResourceTitle string type
              // @ts-ignore - originalResourceTitle to string assignment
              userIdentity={methodIdentity}
              id={`${safeControl.id}`}
              resourceLabel={columnName}
              // @ts-ignore - originalResourceTitle type
              // @ts-ignore - originalResourceTitle string assignment
              resourceMappedField={resourceMappedField}
              // @ts-ignore - originalResourceTitle string assignment
              resourceTitle={
                safeControl.resourceTitle ||
                (safeControl.model as Record<string, unknown>)?.resourceTitle ||
                RESOURCE_DISPLAY.DEFAULT_RESOURCE_TITLE
              }
              // @ts-ignore - ResourceTitleFormatted property types
              resourceTitleFormatted={resourceTitleFormatted}
              resources={resources?.data ?? []}
              selectedResources={selectedResources}
              setSelectedResources={emptySetSelectedResources}
              defaultResource={
                safeControl.defaultResource === 'Session.Username' &&
                resources?.data.find((res: { RecordID: string | number }) => res.RecordID === String(userId))
                  ? String(userId)
                  : // @ts-ignore - processedCalendarData array type
                    // @ts-ignore - processedCalendarData array type
                    (resources?.data[0]?.RecordID ?? null)
              }
              eventCardMenu={eventCardMenu}
              // @ts-ignore - CalendarEvent array structure
              // @ts-ignore - processedCalendarData CalendarEvent array
              // @ts-ignore - CalendarEvent array type
              // @ts-ignore - processedCalendarData array type
              updateControlResources={emptyUpdateControlResources}
              // @ts-ignore - data array assignment to CalendarEvent type
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
    </div>
  );
};

export default CalendarDesignerWrapper;
