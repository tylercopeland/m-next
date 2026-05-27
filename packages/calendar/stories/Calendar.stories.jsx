/* eslint-disable no-console */
import React, { useState, useRef } from 'react';
import { format, addDays, addHours, subDays } from 'date-fns';
import { Calendar } from '../src/index';

export default {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Calendar component with scheduling, resource management, and waitlist functionality',
      },
    },
  },
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: 'Whether the calendar is in mobile view',
    },
    currentView: {
      control: { type: 'select' },
      options: ['Day', 'Week', 'Month', 'Agenda'],
      description: 'Current calendar view',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the calendar is disabled',
    },
    showWaitlist: {
      control: 'boolean',
      description: 'Whether to show the waitlist functionality',
    },
    showSettings: {
      control: 'boolean',
      description: 'Whether to show calendar settings',
    },
    canvasWidth: {
      control: { type: 'range', min: 800, max: 1400, step: 50 },
      description: 'Width of the calendar canvas',
    },
  },
};

// Mock data generators
const generateMockResources = () => [
  { RecordID: '1', Name: 'John Smith', Active: true },
  { RecordID: '2', Name: 'Jane Doe', Active: true },
  { RecordID: '3', Name: 'Mike Johnson', Active: true },
  { RecordID: '4', Name: 'Sarah Wilson', Active: false },
];

const generateMockEvents = () => {
  const today = new Date();
  return [
    {
      Id: 1,
      Subject: 'Team Meeting',
      StartTime: addHours(today, 1),
      EndTime: addHours(today, 2),
      AssignedToId: '1',
      AssignedToName: 'John Smith',
      CategoryColor: '#4CAF50',
      Description: 'Weekly team sync meeting',
      Guid: 'event-1',
      ActivityStatus: 'Scheduled',
    },
    {
      Id: 2,
      Subject: 'Client Consultation',
      StartTime: addHours(today, 3),
      EndTime: addHours(today, 4),
      AssignedToId: '2',
      AssignedToName: 'Jane Doe',
      CategoryColor: '#2196F3',
      Description: 'Initial consultation with new client',
      Guid: 'event-2',
      ActivityStatus: 'Scheduled',
    },
    {
      Id: 3,
      Subject: 'Project Review',
      StartTime: addDays(today, 1),
      EndTime: addHours(addDays(today, 1), 1),
      AssignedToId: '3',
      AssignedToName: 'Mike Johnson',
      CategoryColor: '#FF9800',
      Description: 'Quarterly project review',
      Guid: 'event-3',
      ActivityStatus: 'Scheduled',
    },
    {
      Id: 4,
      Subject: 'Waitlisted Event',
      StartTime: subDays(today, 1),
      EndTime: addHours(subDays(today, 1), 1),
      AssignedToId: '1',
      AssignedToName: 'John Smith',
      CategoryColor: '#9E9E9E',
      Description: 'Event moved to waitlist',
      Guid: 'event-4',
      ActivityStatus: 'Waitlisted',
    },
  ];
};

const defaultCalendarSettings = {
  startTime: '8:00',
  endTime: '18:00',
  showAllDayEvents: true,
  showInactiveResources: false,
  fullColoredEvents: false,
  calendarDays: [1, 2, 3, 4, 5, 6, 7], // Sunday to Saturday
};

const defaultHoverCard = {
  title: true,
  description: true,
  resource: true,
  startdate: true,
  starttime: true,
  enddate: true,
  endtime: true,
};

const defaultEventCardMenu = [
  {
    label: 'Edit',
    onClick: () => console.log('Edit clicked'),
    disabled: false,
  },
  {
    label: 'Delete',
    onClick: () => console.log('Delete clicked'),
    disabled: false,
  },
];

// Template for Calendar stories
const Template = (args) => {
  const [calendarSettings, setCalendarSettings] = useState(defaultCalendarSettings);
  const [selectedResources, setSelectedResources] = useState(generateMockResources());
  const [currentMenuPage, setCurrentMenuPage] = useState('1');
  // eslint-disable-next-line no-unused-vars
  const [dateRange, setDateRange] = useState({
    fromDate: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00Z`,
    toDate: `${format(addDays(new Date(), 7), 'yyyy-MM-dd')}T00:00:00Z`,
  });
  const schedulerRef = useRef(null);

  const mockSendAnalytics = (data) => {
    console.log('Analytics:', data);
  };

  const handleUpdateControlOnUpsert = (eventData) => {
    console.log('Update control on upsert:', eventData);
  };

  const handleUpdateControlResources = (resources, renderDates) => {
    console.log('Update control resources:', resources, renderDates);
  };

  const handleFetchEventData = () => {
    console.log('Fetch event data called');
  };

  const handleOnSelectEvent = () => {
    console.log('Select event called');
  };

  const handleOnDragMoveEvent = () => {
    console.log('Drag move event called');
  };

  const handleOnAddEvent = () => {
    console.log('Add event called');
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Calendar
        id='storybook-calendar'
        userIdentity='storybook-user'
        data={generateMockEvents()}
        resources={generateMockResources()}
        selectedResources={selectedResources}
        setSelectedResources={setSelectedResources}
        calendarSettings={calendarSettings}
        setCalendarSettings={setCalendarSettings}
        setDateRange={setDateRange}
        resourceMappedField='AssignedToId'
        resourceLabel='Name'
        resourceTitle='Resources'
        defaultResource='1'
        currentMenuPage={currentMenuPage}
        setCurrentMenuPage={setCurrentMenuPage}
        schedulerRef={schedulerRef}
        hoverCard={defaultHoverCard}
        eventCardMenu={defaultEventCardMenu}
        updateControlOnUpsert={handleUpdateControlOnUpsert}
        updateControlResources={handleUpdateControlResources}
        fetchEventData={handleFetchEventData}
        onSelectEvent={handleOnSelectEvent}
        onDragMoveEvent={handleOnDragMoveEvent}
        onAddEvent={handleOnAddEvent}
        sendAnalytics={mockSendAnalytics}
        setEventDragging={() => {}}
        displayViews={{
          day: { horizontal: true, standard: true, vertical: true, visible: true },
          week: { horizontal: true, standard: true, vertical: true, visible: true },
          month: { horizontal: false, standard: true, vertical: false, visible: true },
          list: { horizontal: false, standard: true, vertical: false, visible: true },
        }}
        {...args}
      />
    </div>
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  isMobile: false,
  currentView: 'Week',
  canvasWidth: 1200,
  isDisabled: false,
  showWaitlist: false,
  showSettings: true,
  caption: 'Calendar Settings',
  sidebarVisibility: {
    resources: true,
    waitlist: true,
    settings: true,
  },
};

// Mobile view story
export const Mobile = Template.bind({});
Mobile.args = {
  ...Default.args,
  isMobile: true,
  canvasWidth: 375,
};

// Month view story
export const MonthView = Template.bind({});
MonthView.args = {
  ...Default.args,
  currentView: 'Month',
};

// Day view story
export const DayView = Template.bind({});
DayView.args = {
  ...Default.args,
  currentView: 'Day',
};

// With waitlist story
export const WithWaitlist = Template.bind({});
WithWaitlist.args = {
  ...Default.args,
  showWaitlist: true,
  toWaitlistStatus: 'Waitlisted',
};

// Disabled calendar story
export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  isDisabled: true,
};

// Minimal sidebar story
export const MinimalSidebar = Template.bind({});
MinimalSidebar.args = {
  ...Default.args,
  showSettings: false,
  sidebarVisibility: {
    resources: true,
    waitlist: false,
    settings: false,
  },
};

// Large canvas story
export const LargeCanvas = Template.bind({});
LargeCanvas.args = {
  ...Default.args,
  canvasWidth: 1400,
};

// Compact working hours story
export const CompactWorkingHours = Template.bind({});
CompactWorkingHours.args = {
  ...Default.args,
  displayOptions: {
    showAllDayEventsOnTop: true,
    showInactiveResources: false,
    coloredEventBackgrounds: true,
    workingHours: {
      start: '10:00',
      end: '16:00',
      days: [1, 2, 3, 4, 5],
    },
  },
};
