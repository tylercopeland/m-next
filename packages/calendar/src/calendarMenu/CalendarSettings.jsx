import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@m-next/checkbox';
import Caption from '@m-next/caption';
import { colors } from '@m-next/styles';
import Dropdown from '@m-next/dropdown';
import CalendarDaysToggle from './CalendarDaysToggle';

const propTypes = {
  scheduler: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
    PropTypes.object,
  ]),
  setCalendarSettings: PropTypes.func,
  settings: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    showAllDayEvents: PropTypes.bool,
    showInactiveResources: PropTypes.bool,
  }),
  isMobile: PropTypes.bool,
  isReadOnly: PropTypes.bool,
};

function CalendarSettings(props) {
  const {
    scheduler = null,
    setCalendarSettings = () => {},
    settings = {},
    isMobile = false,
    isReadOnly = false,
  } = props;

  const [showAllDayEvents, setShowAllDayEvents] = useState(settings.showAllDayEvents);
  const [showInactiveResources, setShowInactiveResources] = useState(settings.showInactiveResources);
  const [startTime, setStartTime] = useState(settings.startTime);
  const [endTime, setEndTime] = useState(settings.endTime);
  const [calendarDays, setCalendarDays] = useState(settings.calendarDays);
  const [fullColoredEvents, setFullColoredEvents] = useState(settings.fullColoredEvents);

  // Sync local state with props when settings change
  useEffect(() => {
    setShowAllDayEvents(settings.showAllDayEvents);
    setShowInactiveResources(settings.showInactiveResources);
    setStartTime(settings.startTime);
    setEndTime(settings.endTime);
    setCalendarDays(settings.calendarDays);
    setFullColoredEvents(settings.fullColoredEvents);
  }, [settings]);

  useEffect(() => {
    const calendarSettings = {
      startTime,
      endTime,
      showAllDayEvents,
      showInactiveResources,
      calendarDays,
      fullColoredEvents,
    };
    setCalendarSettings(calendarSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllDayEvents, showInactiveResources, startTime, endTime, calendarDays, fullColoredEvents]);

  useEffect(() => {
    scheduler?.current?.refreshEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullColoredEvents]);

  const timeRange = () => {
    const range = [];
    for (let i = 0; i < 24; i++) {
      const rObj = {};
      if (i === 0) {
        rObj.value = `12am`;
        rObj.label = `12am`;
      } else if (i < 12) {
        rObj.value = `${i}am`;
        rObj.label = `${i}am`;
      } else if (i === 12) {
        rObj.value = `${i}pm`;
        rObj.label = `${i}pm`;
      } else {
        rObj.value = `${i - 12}pm`;
        rObj.label = `${i - 12}pm`;
      }
      range.push(rObj);
    }
    return range;
  };

  return (
    <div style={{ padding: '16px' }}>
      <CalendarDaysToggle
        calendarDays={calendarDays}
        setCalendarDays={(days) => setCalendarDays(days)}
        isMobile={isMobile}
        disabled={isReadOnly}
      />
      <Caption
        align='left'
        color={colors['method-darker']}
        label='Display options'
        style={{ fontSize: '16px', marginTop: '16px' }}
      />
      <Checkbox
        label='Show all day events on top'
        id={`${scheduler.current?.id}-dayEvent-CheckBox`}
        onChange={(e) => setShowAllDayEvents(e)}
        checked={showAllDayEvents}
        isMobile={isMobile}
        disabled={isReadOnly}
      />
      <br />
      <Checkbox
        label='Show inactive resources'
        id={`${scheduler.current?.id}-inactiveResource-CheckBox`}
        onChange={(e) => setShowInactiveResources(e)}
        checked={showInactiveResources}
        isMobile={isMobile}
        disabled={isReadOnly}
      />
      <br />
      <Checkbox
        label='Color event background'
        id={`${scheduler.current?.id}-coloredEvent-CheckBox`}
        onChange={(e) => setFullColoredEvents(e)}
        checked={fullColoredEvents}
        style={{ paddingBottom: '16px' }}
        isMobile={isMobile}
        disabled={isReadOnly}
      />
      <Dropdown
        name='StartTime'
        options={timeRange()}
        id={`${scheduler.current?.id}-startTime-dropdown`}
        caption='Start Time'
        isV4Design
        value={{ value: startTime, label: startTime }}
        onChange={(e) => setStartTime(e.value)}
        isMobile={isMobile}
        width='100%'
        style={{ marginBottom: '32px' }}
        disabled={isReadOnly}
      />
      <Dropdown
        name='EndTime'
        options={timeRange()}
        id={`${scheduler.current?.id}-endTime-dropdown`}
        caption='End Time'
        isV4Design
        value={{ value: endTime, label: endTime }}
        onChange={(e) => setEndTime(e.value)}
        isMobile={isMobile}
        width='100%'
        disabled={isReadOnly}
      />
    </div>
  );
}
CalendarSettings.propTypes = propTypes;
export default CalendarSettings;
