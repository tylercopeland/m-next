# @m-next/calendar
A comprehensive calendar widget with scheduling, resource management, and waitlist functionality, ported from the Method platform.
## Features
- 📅 Full calendar with multiple view types (Day, Week, Month, Agenda)
- 👥 Resource-based scheduling 
- 📋 Waitlist functionality with drag & drop
- ⚙️ Configurable settings and display options
- 📱 Mobile responsive design
- 🎨 Customizable event templates
- 🔍 Search and filtering capabilities
## Installation
```bash
npm install @m-next/calendar
```
## Peer Dependencies
This package requires the following peer dependencies:
```bash
npm install @emotion/react @emotion/styled react react-dom prop-types
npm install @syncfusion/ej2-react-schedule @syncfusion/ej2-base
npm install moment dompurify uuid
```
## Usage
### Basic Usage
```jsx
import React, { useState } from 'react';
import { CalendarWrapper } from '@m-next/calendar';
const MyCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const controlConfig = {
    id: 'my-calendar',
    visible: true,
    caption: 'My Calendar',
    isEditable: true,
    model: {
      showSettings: true,
      showWaitlist: true,
    },
    displayOptions: {
      workingHours: {
        start: '9:00',
        end: '17:00',
        days: [0, 1, 2, 3, 4, 5, 6],
      },
      showAllDayEventsOnTop: true,
      showInactiveResources: false,
      coloredEventBackgrounds: false,
    },
  };
  const handleLoadCalendarData = async (params) => {
    // Load calendar events based on params
    const data = await fetchCalendarEvents(params);
    setCalendarData(data);
    return data;
  };
  const handleLoadResources = async (params) => {
    // Load available resources
    const data = await fetchResources(params);
    setResourcesData(data);
    return data;
  };
  const handleEventUpdate = (event) => {
    // Handle event updates
    console.log('Event updated:', event);
  };
  return (
    <CalendarWrapper
      id="my-calendar"
      panelName="main-panel"
      controlConfig={controlConfig}
      calendarData={calendarData}
      resourcesData={resourcesData}
      onLoadCalendarData={handleLoadCalendarData}
      onLoadResources={handleLoadResources}
      onEventUpdate={handleEventUpdate}
      userId="current-user-id"
      username="Current User"
      methodIdentity="user-identity"
    />
  );
};
```
## Props
### CalendarWrapper Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the calendar |
| `panelName` | string | ✅ | Panel name for context |
| `controlConfig` | object | ✅ | Calendar configuration object |
| `calendarData` | array | | Array of calendar events |
| `resourcesData` | array | | Array of available resources |
| `onLoadCalendarData` | function | | Callback to load calendar data |
| `onLoadResources` | function | | Callback to load resources |
| `onSaveEvent` | function | | Callback to save events |
| `onDeleteEvent` | function | | Callback to delete events |
| `onMoveEvent` | function | | Callback for event moves |
| `onEventClick` | function | | Event click handler |
| `onEventAdd` | function | | Event add handler |
| `onEventUpdate` | function | | Event update handler |
| `onResourceChange` | function | | Resource change handler |
| `onSettingsChange` | function | | Settings change handler |
| `settingsData` | object | | Calendar settings data |
| `onSettingsSave` | function | | Settings save callback |
| `isMobile` | boolean | | Mobile mode flag |
| `isLeftNavOpen` | boolean | | Left navigation state |
| `canvasWidth` | number | | Canvas width for layout |
| `userId` | string/number | | Current user ID |
| `username` | string | | Current username |
| `methodIdentity` | string | | User identity for settings |
| `displayOptions` | object | | Display configuration |
| `sidebarVisibility` | object | | Sidebar visibility settings |
| `onAnalyticsEvent` | function | | Analytics callback |
### ControlConfig Structure
```jsx
const controlConfig = {
  id: 'calendar-id',
  visible: true,
  caption: 'Calendar Title',
  hideCaption: false,
  disabled: false,
  isEditable: true,
  view: 'Week', // 'Day', 'Week', 'Month', 'Agenda'
  displayViews: ['Day', 'Week', 'Month'],
  compactEventTime: false,
  resourceFieldv2: 'AssignedTo',
  columnNameRefv2: 'UserName',
  viewNamev2: 'Users',
  resourceTitle: 'Resources',
  model: {
    showSettings: true,
    showWaitlist: true,
    toWaitlistStatus: 'Waitlisted',
    fromWaitlistStatus: 'Scheduled',
  },
  sidebarVisibility: {
    resources: true,
    waitlist: true,
    settings: true,
  },
  displayOptions: {
    workingHours: {
      start: '9:00',
      end: '17:00',
      days: [0, 1, 2, 3, 4, 5, 6], // Sunday to Saturday
    },
    showAllDayEventsOnTop: true,
    showInactiveResources: false,
    coloredEventBackgrounds: false,
  },
};
```
## Event Data Format
```jsx
const eventData = {
  Id: 'event-id',
  Subject: 'Event Title',
  Description: 'Event Description',
  StartTime: new Date(),
  EndTime: new Date(),
  ActivityStatus: 'Scheduled',
  AssignedToId: 'user-id',
  AssignedToName: 'User Name',
  CategoryColor: '#FF0000',
  IsAllDayAppointment: false,
  // ... additional fields
};
```
## Resource Data Format
```jsx
const resourceData = {
  RecordID: 'resource-id',
  UserName: 'Resource Name', // or EntityName, etc.
  IsActive: true,
  // ... additional fields
};
```
## Migration from Redux Version
This package replaces the Redux-dependent calendar components. Here are the main differences:
### Before (Redux version)
```jsx
import CalendarWrapper from 'components/Runtime/widgets/CalendarWrapper';
// Redux state and dispatchers handled internally
<CalendarWrapper
  id="calendar"
  panelName="panel"
  canvasWidth={800}
  control={reduxControl}
/>
```
### After (Prop-based version)
```jsx
import { CalendarWrapper } from '@m-next/calendar';
// Explicit data and callback props
<CalendarWrapper
  id="calendar"
  panelName="panel"
  canvasWidth={800}
  controlConfig={controlConfig}
  calendarData={calendarData}
  resourcesData={resourcesData}
  onLoadCalendarData={handleLoadCalendarData}
  onLoadResources={handleLoadResources}
  onEventUpdate={handleEventUpdate}
  // ... other callback props
/>
```
### Key Changes
1. **Data Props**: `calendarData` and `resourcesData` replace Redux state
2. **Callback Props**: All API calls are now callback props (`onLoadCalendarData`, `onSaveEvent`, etc.)
3. **Settings**: Settings can be provided via props or localStorage
4. **Analytics**: Optional analytics callback instead of built-in tracking
5. **User Context**: User info passed as props instead of useSession hook
## Components
The package exports the following components:
- `CalendarWrapper` - Main calendar wrapper component
- `Calendar` - Core calendar component  
- `CalendarWaitlist` - Waitlist functionality
- `CalendarModal` - Event details modal
- `CalendarMenu` - Calendar menu and navigation
- `CalendarResources` - Resource selection interface
- `CalendarSettings` - Settings configuration panel
- Utilities and helpers
## Development
```bash
# Install dependencies
npm install
# Run tests
npm test
# Build package
npm run build
# Run in development mode
npm run dev
```
## License
ISC