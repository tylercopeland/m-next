import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { removeClass, addClass } from '@syncfusion/ej2-base';
import Grid, { GridEventNames } from '@m-next/grid';
import { colors } from '@m-next/styles';
import { CalendarModal } from '../CalendarModal';
import {
  getModalDateSection,
  formatEvents,
  convertTimeToMilitary,
  getLocalStorageSettings,
} from '../CalendarUtilities';
import CalendarHelperModel from './CalendarHelperModel';
import * as s from './CalendarWaitlist.styles';
import WaitlistEmptyStateIcon from './WaitlistEmptyStateIcon';
import { sendCalendarAnalytics, CalendarAnalyticsActions } from '../calendarServices/CalendarAnalytics';

const propTypes = {
  scheduler: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
    PropTypes.object,
  ]),
  isMobile: PropTypes.bool,
  calendarModel: PropTypes.instanceOf(Object),
  eventCardMenu: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onDragMoveEvent: PropTypes.func,
  updateControl: PropTypes.func,
  calendarData: PropTypes.instanceOf(Object),
  gridData: PropTypes.instanceOf(Object),
  fetchGridData: PropTypes.func,
  modalData: PropTypes.instanceOf(Object),
  fetchModalData: PropTypes.func,
  partialRecordCount: PropTypes.number,
  totalRows: PropTypes.number,
  hoverCard: PropTypes.instanceOf(Object),
  eventDragging: PropTypes.bool,
  setEventDragging: PropTypes.func,
  sendAnalytics: PropTypes.func, // Function to send analytics data
  calendarId: PropTypes.string,
  methodIdentity: PropTypes.string,
};

function CalendarWaitlist(props) {
  const {
    scheduler = null,
    isMobile = false,
    calendarModel,
    eventCardMenu,
    onDragMoveEvent,
    updateControl,
    calendarData,
    gridData,
    fetchGridData,
    modalData,
    fetchModalData,
    partialRecordCount,
    totalRows,
    hoverCard,
    eventDragging,
    setEventDragging,
    sendAnalytics = () => {}, // Default to a no-op function if not provided
    calendarId,
    methodIdentity,
  } = props;

  const previousEventTarget = useRef({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRowElement, setCurrentRowElement] = useState(null);
  const [datasource, setDatasource] = useState(null);
  const [modalEvent, setModalEvent] = useState(null);
  const [events, setEvents] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [gridLoading, setGridLoading] = useState(false);
  const [rowRecordIds, setRowRecordIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const gridPageSize = 7;
  const calendarHelperModel = useRef(CalendarHelperModel(calendarModel, gridPageSize));

  const getGridElementId = `calender-wait-list-${calendarHelperModel.current.gridModel.id}`;

  const loadGrid = (gridEvent, page) => {
    setGridLoading(true);
    fetchGridData(gridEvent, page);
  };

  const searchThroughData = (data, searchPhrase) => {
    if (!searchPhrase) return data;

    const searchLower = searchPhrase.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) => {
        if (typeof value === 'object') {
          return Object.values(value).some((nestedValue) => String(nestedValue).toLowerCase().includes(searchLower));
        }
        return String(value).toLowerCase().includes(searchLower);
      }),
    );
  };

  const onDragStart = () => {
    setIsModalVisible(false);
  };

  const onDrag = (evt) => {
    if (previousEventTarget.current) {
      removeClass([previousEventTarget.current], 'highlight');
    }

    if (evt.element) {
      // eslint-disable-next-line no-param-reassign
      evt.element.style.color = colors['grey-light'];
    }

    previousEventTarget.current = evt.target;
    if (evt.target.classList.contains('e-work-cells')) {
      addClass([evt.target], 'highlight');
    }
  };

  const onDragStop = (evt) => {
    if (evt.element) {
      // eslint-disable-next-line no-param-reassign
      evt.element.style.color = colors.black;
    }

    if (previousEventTarget.current) {
      removeClass([previousEventTarget.current], 'highlight');
    }
  };

  const onDrop = (evt, rowPrimaryKey, fetchedEventData) => {
    if (!rowPrimaryKey) {
      return;
    }
    const obj = scheduler.current;
    const data = obj.getCellDetails(evt.target);
    const selectedEvent = fetchedEventData.find((e) => e.Id === parseInt(rowPrimaryKey, 10));

    if (!selectedEvent) {
      return;
    }

    let assignedToId = selectedEvent.AssignedToId;
    let assignedToName = selectedEvent.AssignedToName;

    // If we're in a vertical/horizontal view, change assigned to, else keep the same as in the event
    if (data.groupIndex !== undefined) {
      const resourceDetails = obj.getResourcesByIndex(data.groupIndex);
      if (resourceDetails && resourceDetails.resourceData) {
        assignedToId = resourceDetails.resourceData.RecordID;
        assignedToName = resourceDetails.resourceData.UserName;
      }
    }

    let timeDiff = 60 * 60 * 1000; // default duration is 1 hour (in milliseconds) for unscheduled event

    if (selectedEvent.StartTime && selectedEvent.EndTime) {
      const originStartDate = new Date(selectedEvent.StartTime);
      const originEndDate = new Date(selectedEvent.EndTime);

      // Only use the time difference if both dates are valid
      if (!Number.isNaN(originStartDate.getTime()) && !Number.isNaN(originEndDate.getTime())) {
        timeDiff = originEndDate - originStartDate;

        // PL-41659 - if current view is Month then retain the original time.
        if (obj.currentView === 'Month' || obj.currentView === 'MonthAgenda') {
          data.startTime.setHours(
            originStartDate.getHours(),
            originStartDate.getMinutes(),
            originStartDate.getSeconds(),
            originStartDate.getMilliseconds(),
          );
        }
      }
    }
    // If event doesn't have start/end times and we're in Month view, use the calendar's start time
    else if (obj.currentView === 'Month' || obj.currentView === 'MonthAgenda') {
      // Read directly from localStorage to get the latest start time
      const localSettings = getLocalStorageSettings(calendarId, methodIdentity);
      const startTimeFromStorage = localSettings?.settings?.timeRange?.startTime;
      const currentStartTime = startTimeFromStorage;

      // Parse the military time string (e.g., "08:00") to get hours and minutes
      const militaryTime = convertTimeToMilitary(currentStartTime);
      let hours = 0;
      let minutes = 0;

      if (militaryTime && typeof militaryTime === 'string' && militaryTime.includes(':')) {
        const [hoursStr, minutesStr] = militaryTime.split(':');
        hours = parseInt(hoursStr, 10);
        minutes = parseInt(minutesStr, 10);
      }

      // Set the time on the dropped date to match calendar's start time
      data.startTime.setHours(hours, minutes, 0, 0);
    }

    data.endTime = new Date(data.startTime);
    data.endTime.setMilliseconds(data.startTime.getMilliseconds() + timeDiff);

    const updated = {
      ...selectedEvent,
      StartTime: data.startTime,
      EndTime: data.endTime,
      AssignedToId: assignedToId,
      AssignedToName: assignedToName,
      ActivityStatus: calendarModel.model.fromWaitlistStatus,
    };

    setEventDragging(false);

    // Track analytics when moving from waitlist
    if (selectedEvent.ActivityStatus === calendarModel.model.toWaitlistStatus) {
      sendCalendarAnalytics(sendAnalytics, CalendarAnalyticsActions.WAITLIST_MOVED_FROM, {
        eventId: selectedEvent.Id,
        eventTitle: selectedEvent.Subject,
      });
    }

    updateControl(updated);
    if (onDragMoveEvent) {
      onDragMoveEvent();
    }
  };

  const onFetchModalData = (evt, rowPrimaryKey) => {
    fetchModalData((data) => onDrop(evt, rowPrimaryKey, data));
  };

  const onRowClick = (data, index, field, evt) => {
    const selectedEvent = events.find((e) => e.Id === data.RecordID);
    setModalEvent(selectedEvent);
    setIsModalVisible(true);
    setCurrentRowElement(evt.currentTarget);

    updateControl(selectedEvent);
  };

  const onGridSearch = (phrase) => {
    setSearchTerm(phrase);
  };

  const onPageChange = async (page) => {
    loadGrid(GridEventNames.PageChanged, page);
  };

  // Effects

  useEffect(() => {
    if (modalData) {
      const formatted = formatEvents(modalData.data);
      setEvents(formatted);
    }
  }, [modalData]);

  useEffect(() => {
    loadGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  useEffect(() => {
    if (gridData) {
      const rows = gridData ? gridData.rows : [];
      const formatted = [];
      if (rows && rows.length > 0) {
        rows.forEach((row) => {
          if (row && row.length > 0) {
            const newRow = {};
            row.forEach((cell) => {
              newRow[cell['name']] = cell['value'];
            });

            const matchedModalData = modalData?.data?.find((event) => event.Id === newRow.RecordID) ?? {};

            // Restore the CardColumn1 structure for display
            newRow.CardColumn1 = {
              title: matchedModalData.WaitlistTitle ?? matchedModalData?.Subject,
              description: matchedModalData.WaitlistDescription ?? matchedModalData?.Description,
              startTime: matchedModalData.StartTime,
            };

            // Also merge all fields for search functionality
            Object.assign(newRow, matchedModalData);

            formatted.push(newRow);
          }
        });
      }

      formatted.sort((a, b) => Date.parse(b?.CardColumn1?.startTime) - Date.parse(a?.CardColumn1?.startTime));

      setDatasource(formatted);
      setFilteredData(formatted);
      setPageNumber(gridData.currentPage);
      setRowRecordIds(formatted?.map((_) => _.RecordID));
      setTotalRecords(gridData.count);

      setTimeout(() => {
        setGridLoading(false);
      }, 250);
    }
  }, [gridData, modalData]);

  // Update filtered data when search term changes
  useEffect(() => {
    if (datasource) {
      const filtered = searchThroughData(datasource, searchTerm);
      setFilteredData(filtered);
    }
  }, [searchTerm, datasource]);

  const emptyStateComponent = () => (
    <s.emptyStateWrapper>
      <WaitlistEmptyStateIcon />
      <s.emptyStateText>Drag here to move to wait list</s.emptyStateText>
    </s.emptyStateWrapper>
  );

  return (
    <s.waitlistWrapper>
      <Grid
        id={getGridElementId}
        isMobile={isMobile}
        data={filteredData}
        disabled={gridLoading}
        confirmDeletion
        pageNumber={pageNumber}
        pageSize={gridPageSize}
        addRowsEnabled={false}
        hideCaption
        isLoading={gridLoading}
        showGoToPage={false}
        showViewFilter={false}
        showReload={false}
        onPageChange={onPageChange}
        showPageSize={false}
        showHeader={false}
        isPartialCount={totalRecords === 0 && partialRecordCount > 0}
        totalRecords={totalRecords === 0 && partialRecordCount > 0 ? partialRecordCount : totalRecords}
        totalRows={totalRows === 0 && partialRecordCount ? partialRecordCount : totalRows}
        rowRecordIds={rowRecordIds}
        searchable
        searchValue={searchTerm}
        onGridSearch={onGridSearch}
        dragAndDrop={{
          draggable: {
            onDragStart,
            onDrag,
            onDragStop,
          },
          droppable: {
            element: scheduler.current?.element,
            onDrop: onFetchModalData,
          },
        }}
        onRowClick={onRowClick}
        rowStyle={{ borderWidth: '1px 0px 1px 0px' }}
        columns={calendarHelperModel.current.gridColumns}
        isPageData
        emptyStateComponent={emptyStateComponent}
        borderlessLoader
        loaderTopPadding={106}
        tableWrapperHeight='calc(100% + 16px)'
        tableWrapperHoverState={eventDragging}
        tableBodyBackgroundColor='transparent'
      />

      <CalendarModal
        isVisible={isModalVisible}
        isMobile={isMobile}
        alignVWith={currentRowElement}
        alignHWith={scheduler?.current?.element}
        event={modalEvent}
        dateSection={getModalDateSection(modalEvent, hoverCard)}
        onClose={() => {
          setIsModalVisible(false);
        }}
        eventCardMenu={eventCardMenu}
        hoverCard={hoverCard}
        isWaitlistEvent
      />
    </s.waitlistWrapper>
  );
}

CalendarWaitlist.propTypes = propTypes;
export default CalendarWaitlist;
