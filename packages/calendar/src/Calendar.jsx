/* eslint-disable react-hooks/exhaustive-deps */
/*  eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-console */
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as ReactDOM from 'react-dom';
import {
  ScheduleComponent,
  Day,
  TimelineViews,
  Week,
  Month,
  Agenda,
  MonthAgenda,
  Resize,
  Inject,
  DragAndDrop,
  ResourcesDirective,
  ResourceDirective,
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';

import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { format, add, differenceInMinutes, isBefore, isEqual } from 'date-fns';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { TextLine } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import Modal from 'react-modal';
import Caption from '@m-next/caption';
import * as c from './Calendar.styles';
import './calendar.css';
import { CalendarModalHeader, CalendarModalContent, CalendarModalFooter } from './CalendarModal';
import {
  setCalendarLocalStorageSetting,
  getLocalStorageSettings,
  getWorkDays,
  isSafari,
  cleanParentTableClass,
  refreshCalendarToolbar,
  convertTimeToMilitary,
  colorLighten,
  applyCategoryColor,
  validateDraggingArgs,
  getModalDateSection,
} from './CalendarUtilities';
import viewsDirectives from './CalendarViewDirective';
import { sendCalendarAnalytics, CalendarAnalyticsActions } from './calendarServices/CalendarAnalytics';
import CalendarMenu from './calendarMenu/CalendarMenu';

// Calendar Menu Page Constants
const MENU_PAGE = {
  RESOURCES: '1',
  SETTINGS: '2',
  WAITLIST: '3',
};

// Resource display constants
const RESOURCE_DISPLAY = {
  DEFAULT_TITLE_LOWERCASE: 'resources',
  DEFAULT_TITLE: 'Resources',
  RESOURCE_NAME: 'Resources', // Used in ResourceDirective
  RESOURCE_FIELD: 'Resource', // Used for title in ResourceDirective
  STORAGE_KEY: 'resources', // Key used for localStorage
};

registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXdfeHVdQ2ZdWUx+W0Q=');

// Custom hook for persisting values to localStorage
const usePersistLocalStorage = (userIdentity, id) =>
  useCallback(
    (key, value) => {
      setCalendarLocalStorageSetting(userIdentity, id, key, value);
    },
    [userIdentity, id],
  );

// Views that render resource lanes — cloned MSD events should appear in each lane.
// Standard views (Day, Week, Month, etc.) don't have lanes, so we deduplicate cloned events.
const RESOURCE_GROUPED_VIEWS = new Set(['DayVertical', 'WeekVertical', 'DayHorizontal', 'WeekHorizontal']);

function Calendar(props) {
  const {
    id = null,
    userIdentity = null,
    onAddEvent = null,
    eventCardMenu = [],
    onSelectEvent = null,
    onDragMoveEvent = null,
    updateControlOnUpsert = null,
    updateControlResources = null,
    isMobile = false,
    resourceMappedField = null,
    resourceLabel = null,
    resourceTitle = RESOURCE_DISPLAY.DEFAULT_TITLE,
    resourceTitleFormatted = null,
    resources = [],
    defaultResource = null,
    displayViews = {},
    calendarSettings = null,
    setCalendarSettings = () => {},
    compactEventTime = '',
    isDisabled = false,
    caption = 'Calendar Settings',
    hideCaption = true,
    setDateRange = () => {},
    currentView = 'Day',
    fetchEventData = () => {},
    additionalTabs = [],
    renderAdditionalTabs = null,
    schedulerRef = null,
    data,
    selectedResources,
    setSelectedResources,
    isLeftNavOpen = undefined,
    canvasWidth = 0,
    hoverCard,
    setEventDragging = () => {},
    showWaitlist = false,
    toWaitlistStatus = '',
    showSettings = true,
    sidebarVisibility = { resources: true, waitlist: true, settings: true },
    displayOptions = {
      showAllDayEventsOnTop: true,
      showInactiveResources: false,
      coloredEventBackgrounds: false,
      workingHours: {
        start: '9:00',
        end: '17:00',
        days: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    sendAnalytics = null,
    isReadOnly = false,
    version,
    disableInternalPersistence = false,
    height = null,
  } = props;
  const scheduler = useRef(null);
  const localSettings = useMemo(() => getLocalStorageSettings(id, userIdentity), [id, userIdentity]);
  const persistToLocalStorage = usePersistLocalStorage(userIdentity, id);
  const [activeView, setActiveView] = useState(localSettings?.currentView ?? currentView);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [cloneNode, setCloneNode] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(
    localSettings == null ? true : localSettings.isDesktopMenuOpen,
  );

  const [currentMenuPage, setCurrentMenuPage] = useState(() => {
    const savedPage = localSettings?.currentMenuPage ?? MENU_PAGE.RESOURCES;

    // Check if the saved tab is visible
    if (savedPage === MENU_PAGE.RESOURCES && !sidebarVisibility.resources) {
      // Resources tab not visible, find next visible tab
      if (sidebarVisibility.waitlist && showWaitlist && !isMobile) {
        return MENU_PAGE.WAITLIST;
      }
      if (sidebarVisibility.settings && showSettings) {
        return MENU_PAGE.SETTINGS;
      }
    } else if (savedPage === MENU_PAGE.SETTINGS && (!sidebarVisibility.settings || !showSettings)) {
      // Settings tab not visible, find next visible tab
      if (sidebarVisibility.resources) {
        return MENU_PAGE.RESOURCES;
      }
      if (sidebarVisibility.waitlist && showWaitlist && !isMobile) {
        return MENU_PAGE.WAITLIST;
      }
    } else if (savedPage === MENU_PAGE.WAITLIST && (!sidebarVisibility.waitlist || !showWaitlist || isMobile)) {
      // Waitlist tab not visible, find next visible tab
      if (sidebarVisibility.resources) {
        return MENU_PAGE.RESOURCES;
      }
      if (sidebarVisibility.settings && showSettings) {
        return MENU_PAGE.SETTINGS;
      }
    } else {
      // Tab is visible, use the saved page
      return savedPage;
    }

    // If no tabs are visible, default to resources (the CalendarMenu component will handle this case)
    return MENU_PAGE.RESOURCES;
  });

  const [workDays, setWorkDays] = useState(() => {
    // Initialize workDays based on current view
    if (currentView === 'Day' || currentView === 'DayVertical' || currentView === 'DayHorizontal') {
      return [0, 1, 2, 3, 4, 5, 6];
    }
    // Add null check for calendarSettings and ensure calendarDays exists
    if (!calendarSettings || !calendarSettings.calendarDays) {
      return [0, 1, 2, 3, 4, 5, 6]; // Default to all days if no settings
    }
    return getWorkDays(calendarSettings.calendarDays);
  });

  const desktopMenuBtnId = `calendar-desktop-open-menu-button-${id}`;
  const fullScheduleWidth = isMobile ? '100%' : `${canvasWidth}px`;

  const workCellhalfHeight = 18;
  const dragDetails = { interval: false, Start: null, End: null };
  // Temporarily commenting out for PL-37855, causing additional issues.
  // scheduler?.current?.refreshLayout();

  /* HELPER FUNCTIONS  ------------------------------------------*/

  const setCurrentDate = (renderDates) => {
    if (renderDates.length > 0) {
      setDateRange({
        fromDate: `${format(renderDates[0], 'yyyy-MM-dd')}T00:00:00Z`,
        toDate: `${format(add(renderDates[renderDates.length - 1], { days: 1 }), 'yyyy-MM-dd')}T00:00:00Z`,
      });
    } else {
      setDateRange({
        fromDate: `${format(renderDates[0], 'yyyy-MM-dd')}T00:00:00Z`,
        toDate: `${format(add(renderDates[0], { days: 1 }), 'yyyy-MM-dd')}T00:00:00Z`,
      });
    }
  };

  const iconFormat = (className) => {
    const icon = document.getElementsByClassName(className);
    if (icon != null && icon.length > 0) {
      icon[0].classList.remove('e-icons');
    }
  };

  const refreshEvents = () => {
    if (scheduler.current) {
      scheduler.current.showSpinner(); // show the spinner
      // Reduce timeout from 1500ms to 500ms
      setTimeout(() => {
        if (scheduler.current) {
          scheduler.current.refreshEvents(); // refreshing the events
          scheduler.current.hideSpinner(); // hide the spinner
        }
      }, 500);
    }
  };

  /* EFFECTS  ------------------------------------------*/

  // PL-39029 Need this to run on every render because for some reason the classes aren't being cleaned
  // Sync activeView if the parent changes the currentView prop (e.g., controlled usage)
  useEffect(() => {
    setActiveView((prev) => prev ?? currentView);
  }, [currentView]);

  useEffect(() => {
    if (isMobile && scheduler?.current) {
      const schedulerElement = scheduler?.current?.element;
      cleanParentTableClass(schedulerElement);
    }
  });
  // Set css variable on mount
  useEffect(() => {
    if (isSafari) {
      document.documentElement.style.setProperty('--calendar-workCell-background', 'unset');
    } else {
      document.documentElement.style.setProperty(
        '--calendar-workCell-background',
        colors['grey-calendar-v2-highlight'],
      );
    }
  }, []);

  useEffect(() => {
    // Use the persist helper
    persistToLocalStorage('currentMenuPage', currentMenuPage);
  }, [currentMenuPage]);

  useEffect(() => {
    // Update workDays when calendarDays changes
    if (currentView === 'Day' || currentView === 'DayVertical' || currentView === 'DayHorizontal') {
      setWorkDays([0, 1, 2, 3, 4, 5, 6]);
    } else {
      setWorkDays(getWorkDays(calendarSettings.calendarDays));
    }

    // Only refresh layout if scheduler exists, without forcing a complete rerender
    if (scheduler?.current) {
      // Using a minimal timeout to ensure the state is updated first
      setTimeout(() => {
        scheduler.current.refreshEvents();
        scheduler.current.refreshLayout();
      }, 10);
    }
  }, [calendarSettings.calendarDays, currentView]);

  useEffect(() => {
    // Reduce wait time from 600ms to 200ms for method left nav animation
    refreshCalendarToolbar(200);
  }, [isLeftNavOpen]);

  useEffect(() => {
    const scheduleElement = document.getElementById(id);
    if (scheduleElement) {
      const toolbar = scheduleElement.querySelector('.e-schedule-toolbar-container');
      // Hack for the toolbar css
      if (toolbar) {
        if (isDesktopMenuOpen) {
          toolbar.classList.remove('toolbar-short-width');
        } else {
          toolbar.classList.add('toolbar-short-width');
        }
      }

      const menuButtonElement = document.getElementById(desktopMenuBtnId);

      // Hack for the menu button css
      if (menuButtonElement) {
        if (isDesktopMenuOpen) {
          menuButtonElement.style.display = 'none';
        } else {
          menuButtonElement.style.display = 'initial';
        }
      }

      if (scheduler.current) {
        scheduler.current.refreshLayout();
      }
    }

    persistToLocalStorage('isDesktopMenuOpen', isDesktopMenuOpen);

    // Reduce wait time from 100ms to 50ms
    refreshCalendarToolbar(50);
  }, [isDesktopMenuOpen]);

  useEffect(() => {
    if (scheduler.current?.activeView?.renderDates) {
      const renderDates = Object.values(scheduler.current.activeView?.renderDates);
      const scheduleElement = document.getElementById(id);
      const refreshButton = scheduleElement?.querySelector('.e-schedule-refresh-icon');
      if (refreshButton) {
        refreshButton.onclick = () => {
          updateControlResources(selectedResources, renderDates);
          fetchEventData();
          refreshEvents();
        };
      }

      updateControlResources(selectedResources, renderDates);
    }
  }, [selectedResources]);

  useEffect(() => {
    if (data?.length && selectedResources?.length) {
      let updatedPred = new Predicate();
      if (selectedResources.length > 0) {
        updatedPred = new Predicate(resourceMappedField, 'equal', selectedResources[0].RecordID);
      }
      if (selectedResources.length > 1) {
        selectedResources.slice(1).forEach((resource) => {
          updatedPred = updatedPred.or(resourceMappedField, 'equal', resource.RecordID);
        });
      }
      if (scheduler.current) {
        scheduler.current.eventSettings.query = new Query().where(updatedPred);
      }
    }
  }, [data, selectedResources]);

  useEffect(() => {
    // Skip internal persistence when controlled by parent (e.g., CalendarWrapper in runtime)
    if (disableInternalPersistence) return;

    // Sync showInactiveResources with displayOptions changes (including from SettingsTabEditor)
    if (displayOptions?.showInactiveResources === undefined) return;

    const userHasNeverChangedThisSetting =
      !localSettings ||
      localSettings?.settings === undefined ||
      localSettings?.settings?.showInactiveResources === undefined;

    // Always update on initial mount when user never changed the setting, or when displayOptions changes
    const shouldUpdate =
      userHasNeverChangedThisSetting ||
      displayOptions.showInactiveResources !== calendarSettings?.showInactiveResources;

    if (shouldUpdate) {
      setCalendarSettings({
        ...calendarSettings,
        showInactiveResources: displayOptions.showInactiveResources,
      });

      // Persist to localStorage so the setting is remembered
      persistToLocalStorage('settings', {
        ...(localSettings?.settings || {}),
        showInactiveResources: displayOptions.showInactiveResources,
      });
    }
  }, [displayOptions?.showInactiveResources, disableInternalPersistence]);

  useEffect(() => {
    // Only update if we have displayOptions working hours data
    if (displayOptions?.workingHours?.start && displayOptions?.workingHours?.end) {
      // Update the startHour and endHour for the scheduler
      if (scheduler.current) {
        const startHour = convertTimeToMilitary(displayOptions.workingHours.start);
        const endHour = convertTimeToMilitary(displayOptions.workingHours.end);

        if (scheduler.current.startHour !== startHour) {
          scheduler.current.startHour = startHour;
        }

        if (scheduler.current.endHour !== endHour) {
          scheduler.current.endHour = endHour;
        }

        scheduler.current.refreshLayout();
      }
    }
  }, [displayOptions?.workingHours?.start, displayOptions?.workingHours?.end]);

  useEffect(() => {
    if (scheduler.current) {
      // Directly refresh without unnecessary timeout
      scheduler.current.refreshEvents();
      scheduler.current.refreshLayout();
    }
  }, [calendarSettings.fullColoredEvents, calendarSettings.showAllDayEvents]);

  // Add a useEffect to store the eventsData in the scheduler reference
  useEffect(() => {
    if (scheduler?.current && data) {
      // Store the complete events data for reference when handling multi-day events
      scheduler.current.eventsData = data;
    }
  }, [data]);

  const onCalendarEventClick = (args) => {
    if (isDisabled) {
      args.cancel = true;
      return;
    }
    if (typeof updateControlOnUpsert === 'function' && args.event) {
      let eventData = args.event;

      if (scheduler?.current?.eventsData && args.event.Guid) {
        const originalEvent = scheduler.current.eventsData.find((event) => {
          const eventStartTime = new Date(event.StartTime);
          const argsStartTime = new Date(args.event.StartTime);
          return (
            event.Guid === args.event.Guid &&
            (isBefore(eventStartTime, argsStartTime) || isEqual(eventStartTime, argsStartTime))
          );
        });
        if (originalEvent) {
          eventData = originalEvent;
        }
      }

      updateControlOnUpsert(eventData);
    }
    args.cancel = false;
  };

  const onPopupOpen = (args) => {
    if (args.type === 'EditEventInfo') {
      args.cancel = true;
      return;
    }

    if (args.type === 'EventContainer') {
      setIsEventDetailOpen(true);
      return;
    }

    if (!args.data?.Id) {
      // If no ID just cancel, happens when you single click a cell.
      args.cancel = true;
      if (isMobile && args.type === 'Editor') {
        if (args.data.AssignedToId != null) {
          const selected = selectedResources.find((res) => res.RecordID === args.data.AssignedToId);
          args.data.AssignedToId = selected.RecordID;
          args.data.AssignedToName = selected[resourceLabel];
        } else {
          args.data.AssignedToId = selectedResources.length > 0 ? selectedResources[0].RecordID : null;
          args.data.AssignedToName = selectedResources.length > 0 ? selectedResources[0][resourceLabel] : null;
        }
        updateControlOnUpsert(args.data);
        onSelectEvent();
      }
      return;
    }

    if (args.data?.Id != null && (args.type === 'QuickInfo' || args.type === 'ViewEventInfo')) {
      document.documentElement.style.setProperty('--popup-border', `6px solid ${args.data.CategoryColor}`);

      if (isMobile) {
        const popupHeight = `${window.innerHeight - 56}px`;
        document.documentElement.style.setProperty('--popup-height', popupHeight);
        document.documentElement.style.setProperty('--popup-radius', '0px');
      } else {
        document.documentElement.style.setProperty('--popup-radius', '6px');
      }

      // Don't set args.cancel, let the default behavior happen
      setIsEventDetailOpen(true);
      return;
    }

    if (args.type === 'Editor') {
      args.cancel = true;
    }
  };

  const onPopupClose = (args) => {
    if (args.data?.Id) {
      setIsEventDetailOpen(false);
    }
  };

  // When you click a cell or drag select a range of cells, this method is executed.
  const onSelect = (args) => {
    if (args?.data) {
      const duration = differenceInMinutes(new Date(args.data.EndTime), new Date(args.data.StartTime));

      if (typeof updateControlOnUpsert === 'function' && args?.requestType === 'cellSelect' && duration > 30) {
        // If month view and duration is <= a day, do nothing
        if (scheduler.current.activeView.viewClass === 'e-month-view' && duration <= 1440) {
          return;
        }

        if (args.data.AssignedToId != null) {
          // For swimlane view or when only one resource is selected
          if (
            currentView === 'WeekVertical' ||
            currentView === 'DayVertical' ||
            currentView === 'WeekHorizontal' ||
            currentView === 'DayHorizontal' ||
            selectedResources.length === 1
          ) {
            const selected = selectedResources.find((res) => res.RecordID === args.data.AssignedToId);
            args.data.AssignedToId = selected.RecordID;
            args.data.AssignedToName = selected[resourceLabel];
          } else {
            // For regular view with multiple resources, clear the assignment
            args.data.AssignedToId = '';
            args.data.AssignedToName = '';
          }
        }

        args.cancel = true;
        updateControlOnUpsert(args.data);
        onSelectEvent();
      }
    }
  };

  const onResizeStop = (args) => {
    setEventDragging(false);
    if (args?.data) {
      if (typeof updateControlOnUpsert === 'function') {
        updateControlOnUpsert(args.data);
      }
      if (typeof onDragMoveEvent === 'function') {
        onDragMoveEvent();
      }
    }
  };

  const onDragStop = (args) => {
    setEventDragging(false);
    if (args?.data) {
      if (dragDetails.interval && currentView !== 'Month') {
        args.data.StartTime = dragDetails.Start;
        args.data.EndTime = dragDetails.End;
        dragDetails.interval = false;
      }

      if (!isSafari)
        document.documentElement.style.setProperty(
          '--calendar-workCell-background',
          colors['grey-calendar-v2-highlight'],
        );

      args.data.AssignedToName = selectedResources.find((res) => res.RecordID === args.data.AssignedToId)[
        resourceLabel
      ];

      let elem = args?.target;
      let isWaitlist = args?.target?.id?.substring(0, 18) === 'calender-wait-list';

      // Traverse up the DOM to check if the target is part of the waitlist
      while (elem?.parentNode && elem?.parentNode?.nodeName?.toLowerCase() !== 'body') {
        elem = elem.parentNode;
        if (elem.id.substring(0, 18) === 'calender-wait-list') {
          isWaitlist = true;
          break;
        }
      }

      // Find the original event to check its status
      const originalEvent = data.find((e) => e.Id === args.data.Id);
      const wasInWaitlist = originalEvent?.ActivityStatus === toWaitlistStatus;

      // If moving to the waitlist
      if (isWaitlist && showWaitlist) {
        args.data.ActivityStatus = toWaitlistStatus;
        args.data.StartTime = originalEvent.StartTime;
        args.data.EndTime = originalEvent.EndTime;
        args.data.AssignedToName = originalEvent.AssignedToName;
        args.data.AssignedToId = originalEvent.AssignedToId;

        sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.WAITLIST_MOVED_TO, {
          eventId: args.data.Id,
          eventTitle: args.data.Subject,
        });
      }
      // If moving from waitlist to calendar
      else if (!isWaitlist && wasInWaitlist) {
        sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.WAITLIST_MOVED_FROM, {
          eventId: args.data.Id,
          eventTitle: args.data.Subject,
        });
      }

      if (typeof updateControlOnUpsert === 'function') {
        updateControlOnUpsert(args.data);
      }
      if (typeof onDragMoveEvent === 'function') {
        onDragMoveEvent();
      }
    }
  };

  const onCellDoubleClick = (args) => {
    args.cancel = true;

    if (typeof onSelectEvent === 'function' && !isEventDetailOpen) {
      // Send analytics based on whether an event already exists
      if (args.data?.Id) {
        sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.NAVIGATION_ADD_EDIT_NEW_WORK_ORDER, {
          eventId: args.data.Id,
          eventTitle: args.data.Subject,
        });
      } else {
        sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.NAVIGATION_ADD_EDIT_NEW_WORK_ORDER, {
          startTime: args.startTime ? new Date(args.startTime).toISOString() : 'Unknown Start Time',
          endTime: args.endTime ? new Date(args.endTime).toISOString() : 'Unknown End Time',
        });
      }

      const updateData = {
        AssignedToId: selectedResources.length === 1 ? selectedResources[0]?.RecordID : null,
        AssignedToName: selectedResources.length === 1 ? selectedResources[0]?.[resourceLabel] : null,
        StartTime: args.startTime,
        EndTime: args.endTime,
      };

      // If there's a group index, we're in a swimlane so map the index to the selected resource list
      if (args.groupIndex != null) {
        updateData.AssignedToId = selectedResources[args.groupIndex]?.RecordID;
        updateData.AssignedToName = selectedResources[args.groupIndex]?.[resourceLabel];
      }
      updateControlOnUpsert(updateData);
      onSelectEvent();
    }
  };

  const onActionBegin = (args) => {
    if (args.requestType === 'toolbarItemRendering') {
      const refreshIcon = {
        align: 'Left',
        prefixIcon: 'e-schedule-refresh-svg-icon', // Changed from mi-icon-refresh to custom class
        text: '',
        cssClass: 'e-schedule-refresh-icon',
        showAlwaysInPopup: true,
        overflow: 'Show',
      };
      args.items.push(refreshIcon);

      if (isMobile) {
        const settingIcon = {
          align: 'Left',
          prefixIcon: 'mi-icon-cog',
          text: '',
          cssClass: 'e-schedule-settings-icon',
          showAlwaysInPopup: true,
          overflow: 'Show',
        };
        args.items.push(settingIcon);

        if (onAddEvent == null || typeof onAddEvent !== 'function') {
          args.items = args.items.filter((i) => i.cssClass !== 'e-add');
        }
      } else if (onAddEvent != null && typeof onAddEvent === 'function') {
        const addIcon = {
          align: 'Left',
          prefixIcon: 'e-schedule-add-svg-icon', // Changed from mi-icon-plus to custom class
          text: '',
          cssClass: 'e-schedule-add-icon',
          showAlwaysInPopup: true,
          overflow: 'Show',
        };
        args.items.push(addIcon);
      }
    }
  };

  // HTML menu button to append to syncfusion toolbar
  const desktopOpenMenuButton = () => {
    // Even if sidebar is disabled, we still need to return a node for proper toolbar initialization
    const node = document.createElement('div');
    node.className = 'calendarDesktopMenuButton';

    // Always make the menu button interactive, regardless of sidebar visibility
    node.style.display = isDesktopMenuOpen ? 'none' : 'initial';
    node.onclick = () => setIsDesktopMenuOpen(true);
    node.id = desktopMenuBtnId;
    return node;
  };

  const onActionComplete = (args) => {
    const scheduleElement = document.getElementById(id);
    const refreshButton = scheduleElement.querySelector('.e-schedule-refresh-icon');

    if (args.requestType === 'toolBarItemRendered') {
      if (isMobile) {
        const settingsButton = scheduleElement?.querySelector('.e-schedule-settings-icon');
        if (settingsButton) {
          settingsButton.onclick = () => {
            setIsMobileMenuOpen(true);
          };
        }

        iconFormat('mi-icon-cog e-icons');

        if (onAddEvent != null && typeof onAddEvent === 'function') {
          const addButton = scheduleElement?.querySelector('.e-add');
          if (addButton) {
            addButton.onclick = () => {
              onAddEvent();
              // Send analytics for adding a new work order
              sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.NAVIGATION_ADD_EDIT_NEW_WORK_ORDER, {
                startTime: args.startTime ? new Date(args.startTime).toISOString() : 'Unknown Start Time',
                endTime: args.endTime ? new Date(args.endTime).toISOString() : 'Unknown End Time',
              });
            };
          }
        }
      } else {
        const toolbar = scheduleElement.querySelector('.e-schedule-toolbar-container');
        toolbar.appendChild(desktopOpenMenuButton());
        // Render Icon
        ReactDOM.render(
          <SvgIcon
            name='calendarMenu-Open'
            size={16}
            style={{ paddingTop: '16px' }}
            color={colors['grey-calendar-v2-menu-icon']}
          />,
          document.getElementById(desktopMenuBtnId),
        );

        // Hack for the menu button
        if (!isDesktopMenuOpen) {
          toolbar.classList.add('toolbar-short-width');
        }

        if (onAddEvent != null && typeof onAddEvent === 'function') {
          const addButton = scheduleElement?.querySelector('.e-schedule-add-icon');
          if (addButton) {
            addButton.onclick = () => {
              onAddEvent();
            };
            // Replace Method icon font with SvgIcon component
            const addIconElement = addButton.querySelector('.e-schedule-add-svg-icon');
            if (addIconElement) {
              ReactDOM.render(<SvgIcon name='plus-V4' size={16} color={colors.grey} />, addIconElement);
            }
          }
        }
      }

      if (refreshButton) {
        refreshButton.onclick = () => {
          const renderDates = Object.values(scheduler.current.activeView.renderDates);
          updateControlResources(selectedResources, renderDates);
          fetchEventData();
          refreshEvents();
        };
      }

      // Replace Method icon font with SvgIcon component for refresh icon
      const refreshIconElement = refreshButton.querySelector('.e-schedule-refresh-svg-icon');
      if (refreshIconElement) {
        ReactDOM.render(<SvgIcon name='refresh' size={16} color={colors.grey} />, refreshIconElement);
      }
    } else if (args.requestType === 'dateNavigate' || args.requestType === 'viewNavigate') {
      if (args.requestType === 'viewNavigate') {
        if (scheduler?.current) {
          const newView = scheduler?.current?.activeViewOptions?.displayName?.replace(/ /g, '');
          if (newView) {
            persistToLocalStorage('currentView', newView);
            setActiveView(newView);
          }
          // Send analytics for view change
          sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.VIEW_CHANGED, {
            fromView: currentView,
            toView: newView,
          });
        }
      }

      if (scheduler?.current) {
        const renderDates = Object.values(scheduler.current.activeView.renderDates);
        if (refreshButton) {
          refreshButton.onclick = () => {
            updateControlResources(selectedResources, renderDates);
            fetchEventData();
            refreshEvents();
          };
        }
        setCurrentDate(renderDates);
      }
    }
  };

  const onCreate = () => {
    if (scheduler?.current) {
      const renderDates = Object.values(scheduler.current.activeView.renderDates);
      setCurrentDate(renderDates);
    }
  };

  const onDragging = (args) => {
    const clone = document.querySelector('.e-schedule-event-clone');
    const appDetail = clone.querySelector('.e-appointment-details');
    if (clone && appDetail) {
      const bgColor = args?.data?.CategoryColor ?? colors.white;
      clone.style.backgroundColor = colorLighten(bgColor, 0.2);
      clone.style.borderRadius = '4px';
      clone.style.borderLeft = `6px solid ${bgColor}`;

      if (appDetail.querySelector('.template-wrap') == null) {
        appDetail.children[0].appendChild(cloneNode);
      }
    }

    if (!args || !args?.event || !args?.event?.event) return;

    // Solution provided by syncfusion PL-38874
    if (validateDraggingArgs(args, workCellhalfHeight)) {
      if (!isSafari) {
        document.documentElement.style.setProperty(
          '--calendar-workCell-background',
          `linear-gradient(to top, ${colors['grey-calendar-v2-highlight']} 50%, ${colors.white} 50%)`,
        );
      }
      dragDetails.Start = new Date(args.startTime.getTime() + 900000);
      dragDetails.End = new Date(args.endTime.getTime() + 900000);
      dragDetails.interval = true;
    } else {
      if (!isSafari) {
        document.documentElement.style.setProperty(
          '--calendar-workCell-background',
          `linear-gradient(to bottom, ${colors['grey-calendar-v2-highlight']} 50%, ${colors.white} 50%)`,
        );
      }
      dragDetails.interval = false;
    }
  };

  // Optimize view initialization effect
  useEffect(() => {
    if (!scheduler?.current) return;

    const { currentView: schedulerView } = scheduler.current;

    // Set the proper work days based on the current view
    if (schedulerView === 'Day' || schedulerView === 'DayVertical' || schedulerView === 'DayHorizontal') {
      setWorkDays([0, 1, 2, 3, 4, 5, 6]);
    } else {
      setWorkDays(getWorkDays(calendarSettings.calendarDays));
    }

    // Handle view initialization if needed - but don't cycle views unnecessarily
    if (!scheduler.current.activeView && schedulerView) {
      try {
        // Get the saved view again to make sure we're using the right one
        const savedView = localSettings?.currentView ?? currentView;

        // Apply it directly with no intermediary views
        scheduler.current.changeCurrentView(savedView);
        scheduler.current.refreshLayout();
      } catch (error) {
        console.error(
          `CALENDAR_ERROR: [Calendar][initializeView] Failed to set initial calendar view for calendar ${id}`,
          {
            calendarId: id,
            errorMessage: error?.message,
            errorCode: error?.code,
            currentView,
            stackTrace: error?.stack,
          },
        );
      }
    }
  }, [scheduler?.current, calendarSettings.calendarDays]);

  const onDragStart = (args) => {
    args.interval = 15;
    if (args?.name === 'dragStart') {
      setEventDragging(true);
    }
    if (scheduler?.current?.activeView?.viewClass === 'e-month-view') {
      const node = args.element.querySelector('.template-wrap');
      const cloneNode1 = node.cloneNode(true);
      setCloneNode(cloneNode1);
    }
  };

  const onNavigating = (args) => {
    if (args.action === 'view') {
      setWorkDays(args.currentView === 'Day' ? [0, 1, 2, 3, 4, 5, 6] : getWorkDays(calendarSettings.calendarDays));
    }
  };

  const onEventRendered = (args) => {
    args.element.addEventListener('dblclick', () => {
      eventCardMenu[0].onClick();
    });

    // Use calendarSettings.fullColoredEvents directly
    applyCategoryColor(args, scheduler.current.currentView, calendarSettings.fullColoredEvents);
  };

  const filteredData = useMemo(() => {
    if (!data || RESOURCE_GROUPED_VIEWS.has(activeView)) return data;

    // Standard views: deduplicate cloned MSD events (keep 1 per original event).
    // Cloned events have OriginalEventId; standard resource events do not.
    const seen = new Set();
    return data.filter((event) => {
      const eventId = event.OriginalEventId ?? event.Id;
      if (eventId == null) return true;
      if (seen.has(eventId)) return false;
      seen.add(eventId);
      return true;
    });
  }, [data, activeView]);

  const renderMenu = () => (
    <CalendarMenu
      id={id}
      scheduler={scheduler}
      calendarSettings={calendarSettings}
      setCalendarSettings={(r) => setCalendarSettings(r)}
      resourceMappedField={resourceMappedField}
      resourceLabel={resourceLabel}
      resources={resources}
      defaultResource={defaultResource}
      selectedResources={selectedResources}
      onSelectResource={(r) => setSelectedResources(r)}
      isMobile={isMobile}
      additionalTabs={additionalTabs}
      renderAdditionalTabs={renderAdditionalTabs}
      closeDesktopMenu={() => setIsDesktopMenuOpen(false)}
      currentMenuPage={currentMenuPage}
      setCurrentMenuPage={setCurrentMenuPage}
      showSettings={showSettings}
      sidebarVisibility={sidebarVisibility}
      resourceTitle={resourceTitle}
      resourceTitleFormatted={resourceTitleFormatted}
      sendAnalytics={sendAnalytics}
      isReadOnly={isReadOnly}
    />
  );

  const renderMobileMenu = () => (
    <Modal
      isOpen={isMobileMenuOpen}
      style={{
        overlay: { zIndex: 1000 },
        content: { top: 0, left: 0, right: 0, bottom: 0, padding: 0, overflow: 'hidden' },
      }}
      ariaHideApp={false}
      shouldReturnFocusAfterClose
      shouldCloseOnEsc
      id='dropdown-modal-opened'
      role='combobox'
    >
      <c.mobileHeader>
        <c.mobileHeaderCaption>{caption}</c.mobileHeaderCaption>
        <c.mobileHeaderBackIcon onClick={() => setIsMobileMenuOpen(false)} id={`${id}-Caret`}>
          <SvgIcon name='close-V4' size={16} />
        </c.mobileHeaderBackIcon>
      </c.mobileHeader>
      {renderMenu()}
    </Modal>
  );

  // Use useMemo for complex templates
  const quickInfoTemplates = useMemo(
    () => ({
      header: (s) => {
        const headerContent = (
          <CalendarModalHeader
            showTitle={hoverCard.title}
            event={s}
            isMobile={isMobile}
            onClose={() => scheduler.current.closeQuickInfoPopup()}
          />
        );
        return headerContent;
      },
      content: (modalData) => {
        let eventData = modalData;
        if (modalData && !modalData.AssignedToName && selectedResources.length > 0) {
          eventData = {
            ...modalData,
            AssignedToName:
              selectedResources.find((res) => res.RecordID === modalData.AssignedToId)?.[resourceLabel] || '',
          };
        }
        const contentComponent = (
          <CalendarModalContent
            showDescription={hoverCard.description}
            showResource={hoverCard.resource}
            showDateTime={hoverCard.startdate || hoverCard.starttime || hoverCard.enddate || hoverCard.endtime}
            event={eventData}
            isMobile={isMobile}
            dateSection={getModalDateSection(eventData, hoverCard)}
          />
        );
        return contentComponent;
      },
      footer: () => {
        const footerContent = (
          <CalendarModalFooter
            isMobile={isMobile}
            version={version}
            eventCardMenu={eventCardMenu}
            closePopup={() => scheduler.current.closeQuickInfoPopup()}
          />
        );
        return footerContent;
      },
    }),
    [hoverCard, isMobile, eventCardMenu],
  );

  return (
    <div>
      {caption && !hideCaption && (
        <Caption
          id={`${id}-caption`}
          align='left'
          color={colors['method-darker']}
          label={caption}
          style={{ paddingTop: '16px', fontSize: '18px' }}
        />
      )}
      {selectedResources.length > 0 && resources.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: isMobile ? '6px 0px' : '6px 0px 16px 0px',
          }}
          className={isDisabled ? 'calendarDisabled' : ''}
        >
          {isMobile ? renderMobileMenu() : null}
          <ScheduleComponent
            eventDragArea={showWaitlist && !isMobile ? 'body' : null}
            enablePersistence
            id={id}
            width={isDesktopMenuOpen && !isMobile ? `${canvasWidth - 288}px` : fullScheduleWidth}
            readonly={isReadOnly}
            popupOpen={onPopupOpen}
            popupClose={onPopupClose}
            eventClick={onCalendarEventClick}
            {...(height ? { height } : {})}
            select={onSelect}
            resizing={onDragging}
            resizeStart={onDragStart}
            drag={onDragging}
            dragStart={onDragStart}
            dragStop={onDragStop}
            resizeStop={onResizeStop}
            created={onCreate}
            eventSettings={{
              dataSource: filteredData,
              minimumEventDuration: 15,
              spannedEventPlacement: calendarSettings.showAllDayEvents ? 'AllDayRow ' : 'TimeSlot',
            }}
            ref={(r) => {
              scheduler.current = r;
              schedulerRef.current = r;
            }}
            startHour={convertTimeToMilitary(calendarSettings.startTime)}
            endHour={convertTimeToMilitary(calendarSettings.endTime)}
            eventRendered={(s) => onEventRendered(s)}
            hideEmptyAgendaDays={false}
            enableAdaptiveUI={isMobile}
            actionBegin={(s) => onActionBegin(s)}
            actionComplete={(s) => onActionComplete(s)}
            cellDoubleClick={(s) => onCellDoubleClick(s)}
            quickInfoTemplates={quickInfoTemplates}
            rowAutoHeight
            workDays={workDays}
            workHours={{ highlight: false }}
            showWeekend={false}
            navigating={onNavigating}
          >
            {viewsDirectives(isMobile, displayViews, compactEventTime, currentView)}
            <ResourcesDirective>
              <ResourceDirective
                field={resourceMappedField}
                title={RESOURCE_DISPLAY.RESOURCE_FIELD}
                name={RESOURCE_DISPLAY.RESOURCE_NAME}
                allowMultiple
                dataSource={selectedResources}
                textField={resourceLabel}
                idField='RecordID'
              />
            </ResourcesDirective>
            <Inject services={[Day, Week, Month, Agenda, TimelineViews, Resize, DragAndDrop, MonthAgenda]} />
          </ScheduleComponent>

          {!isMobile && (
            <c.calendarMenuWrapper isDesktopMenuOpen={isDesktopMenuOpen}>{renderMenu()}</c.calendarMenuWrapper>
          )}
        </div>
      ) : (
        <c.calendarErrorWraper>
          <TextLine>No resources could be found. Please contact Method Support for assistance.</TextLine>
        </c.calendarErrorWraper>
      )}
    </div>
  );
}

const view = PropTypes.shape({
  horizontal: PropTypes.bool,
  standard: PropTypes.bool,
  vertical: PropTypes.bool,
  visible: PropTypes.bool,
});

const propTypes = {
  id: PropTypes.string,
  userIdentity: PropTypes.string,
  onAddEvent: PropTypes.func,
  eventCardMenu: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onSelectEvent: PropTypes.func,
  onDragMoveEvent: PropTypes.func,
  updateControlOnUpsert: PropTypes.func,
  updateControlResources: PropTypes.func,
  isMobile: PropTypes.bool,
  resourceMappedField: PropTypes.string,
  resourceLabel: PropTypes.string,
  resourceTitle: PropTypes.string,
  resourceTitleFormatted: PropTypes.shape({
    forTab: PropTypes.string,
    forDropdown: PropTypes.string,
    forDisplay: PropTypes.string,
  }),
  resources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  defaultResource: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  displayViews: PropTypes.shape({
    day: view,
    week: view,
    month: view,
    list: view,
  }),
  calendarSettings: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    showAllDayEvents: PropTypes.bool,
    showInactiveResources: PropTypes.bool,
  }),
  setCalendarSettings: PropTypes.func,
  compactEventTime: PropTypes.string,
  isDisabled: PropTypes.bool,
  caption: PropTypes.string,
  hideCaption: PropTypes.bool,
  setDateRange: PropTypes.func,
  currentView: PropTypes.string,
  fetchEventData: PropTypes.func,
  additionalTabs: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  renderAdditionalTabs: PropTypes.func,
  schedulerRef: PropTypes.instanceOf(Object),
  selectedResources: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  setSelectedResources: PropTypes.func,
  isLeftNavOpen: PropTypes.oneOf([true, false, undefined]),
  canvasWidth: PropTypes.number,
  hoverCard: PropTypes.instanceOf(Object),
  setEventDragging: PropTypes.func,
  showWaitlist: PropTypes.bool,
  toWaitlistStatus: PropTypes.string,
  showSettings: PropTypes.bool,
  sidebarVisibility: PropTypes.shape({
    resources: PropTypes.bool,
    waitlist: PropTypes.bool,
    settings: PropTypes.bool,
  }),
  displayOptions: PropTypes.shape({
    showAllDayEventsOnTop: PropTypes.bool,
    showInactiveResources: PropTypes.bool,
    coloredEventBackgrounds: PropTypes.bool,
    workingHours: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
      days: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.bool])),
    }),
  }),
  sendAnalytics: PropTypes.func,
  isReadOnly: PropTypes.bool,
  version: PropTypes.string,
  disableInternalPersistence: PropTypes.bool,
  height: PropTypes.string,
};

Calendar.propTypes = propTypes;
export default Calendar;
