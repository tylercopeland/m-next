/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Calendar from './Calendar';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const mockReact = require('react');

jest.mock('@syncfusion/ej2-react-schedule', () => ({
  ScheduleComponent: jest.fn(({ ...props }) => {
    const [quickInfoData, setQuickInfoData] = mockReact.useState(null);

    const handleEventClick = (event) => {
      setQuickInfoData(event);
      props.eventClick({ event });
      props.popupOpen({ data: event, type: 'EditEventInfo' });
    };

    return (
      <div id='test-calendar'>
        <div className='e-schedule-toolbar-container'>
          <button className='e-schedule-refresh-icon' type='button' />
          <button id='calendar-desktop-open-menu-button-test-calendar' type='button' />
        </div>
        {props.eventSettings.dataSource.map((event) => (
          <button key={event.Id} onClick={() => handleEventClick(event)} type='button'>
            {event.Subject}
          </button>
        ))}
        {quickInfoData && props.quickInfoTemplates && (
          <div>
            {props.quickInfoTemplates.header && props.quickInfoTemplates.header(quickInfoData)}
            {props.quickInfoTemplates.content && props.quickInfoTemplates.content(quickInfoData)}
            {props.quickInfoTemplates.footer && props.quickInfoTemplates.footer(quickInfoData)}
          </div>
        )}
      </div>
    );
  }),
  Day: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'day-view' })),
  RefreshButton: jest.fn(() => mockReact.createElement('div', { 'data-testid': '.e-schedule-refresh-icon' })),
  TimelineViews: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'timeline-views' })),
  Week: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'week-view' })),
  Month: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'month-view' })),
  Agenda: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'agenda-view' })),
  MonthAgenda: jest.fn(() => mockReact.createElement('div', { 'data-testid': 'month-agenda-view' })),
}));

jest.mock('@syncfusion/ej2-base', () => ({
  registerLicense: jest.fn(),
  Internationalization: jest.fn().mockImplementation(() => ({
    formatDate: jest.fn((date) => date),
    parseDate: jest.fn((date) => new Date(date)),
    getDateFormat: jest.fn(() => 'MM/dd/yyyy'),
    formatNumber: jest.fn((num) => num.toString()),
  })),
}));

jest.mock('@syncfusion/ej2-data', () => ({
  Query: jest.fn().mockImplementation(() => ({
    where: jest.fn().mockReturnThis(),
  })),
  Predicate: jest.fn().mockImplementation((field, operator, value) => ({
    field,
    operator,
    value,
    or: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('./CalendarViewDirective', () =>
  jest.fn(() => mockReact.createElement('div', { 'data-testid': 'calendar-view-directive' })),
);

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Default props for testing
const defaultProps = {
  id: 'test-calendar',
  userIdentity: 'test-user',
  data: [
    {
      Id: 1,
      Subject: 'Test Event',
      StartTime: new Date(),
      EndTime: new Date(),
      CategoryColor: '#ff0000',
      AssignedToId: 'resource1',
      AssignedToName: 'Resource 1',
      Guid: 'test-guid-1',
      ActivityStatus: 'Active',
    },
  ],
  resources: [
    {
      RecordID: 'resource1',
      Name: 'Resource 1',
      IsActive: true,
    },
    {
      RecordID: 'resource2',
      Name: 'Resource 2',
      IsActive: true,
    },
    {
      RecordID: 'resource2',
      Name: 'Resource 3',
      IsActive: true,
    },
  ],
  selectedResources: [
    {
      RecordID: 'resource1',
      Name: 'Resource 1',
    },
    {
      RecordID: 'resource2',
      Name: 'Resource 2',
    },
  ],
  setSelectedResources: jest.fn(),
  resourceMappedField: 'AssignedToId',
  resourceLabel: 'Name',
  calendarSettings: {
    startTime: '13:00',
    endTime: '14:00',
    showAllDayEvents: true,
    showInactiveResources: true,
    fullColoredEvents: false,
    calendarDays: [true, true, true, true, true, false, false],
  },
  setCalendarSettings: jest.fn(),
  setDateRange: jest.fn(),
  fetchEventData: jest.fn(),
  updateControlResources: jest.fn(),
  onSelectEvent: jest.fn(),
  updateControlOnUpsert: jest.fn(),
  eventCardMenu: [
    {
      disabled: false,
      label: 'Edit',
      onClick: jest.fn(),
    },
  ],
  hoverCard: {
    title: true,
    description: true,
    resource: true,
  },
  schedulerRef: {
    current: {
      currentView: 'Week',
      currentDate: new Date(),
      currentViewOptions: {
        displayName: 'Week',
      },
      startHour: '09:00',
      endHour: '17:00',
      refreshLayout: jest.fn(),
      activeView: {
        renderDates: [new Date('2025-01-01'), new Date('2025-01-07')],
      },
    },
  },
  canvasWidth: 1200,
  displayViews: {
    day: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
    week: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
    month: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
    agenda: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
    monthAgenda: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
    list: {
      horizontal: true,
      standard: true,
      vertical: true,
      visible: true,
    },
  },
};

describe('Calendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Calendar {...defaultProps} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders without crashing on mobile', () => {
    render(<Calendar {...defaultProps} isMobile />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders error message when no resources are available', () => {
    render(<Calendar {...defaultProps} resources={[]} selectedResources={[]} />);
    expect(
      screen.getByText('No resources could be found. Please contact Method Support for assistance.'),
    ).toBeInTheDocument();
  });

  it('renders menu empty state when no sidebar is visible', () => {
    render(<Calendar {...defaultProps} sidebarVisibility={{ resources: false, waitlist: false, settings: false }} />);
    expect(screen.queryByText('Resources')).not.toBeInTheDocument();
    expect(screen.queryByText('Waitlist')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'No sidebar sections are currently enabled. Please enable at least one section in the calendar configuration.',
      ),
    ).toBeInTheDocument();
  });

  it('renders settings menu', () => {
    render(<Calendar {...defaultProps} currentView='Week' schedulerRef={{ current: { currentView: 'Week' } }} />);
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    expect(screen.getByTestId(/startTime-dropdown-dropdown-list/)).toHaveTextContent(
      defaultProps.calendarSettings.startTime,
    );
    expect(screen.getByTestId(/endTime-dropdown-dropdown-list/)).toHaveTextContent(
      defaultProps.calendarSettings.endTime,
    );
  });

  it('allows for changing settings', () => {
    render(<Calendar {...defaultProps} />);
    fireEvent.click(screen.getByText('Settings'));
    fireEvent.click(screen.getByText('M'));
    expect(defaultProps.setCalendarSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarDays: [true, false, true, true, true, false, false],
      }),
    );
  });

  it('allows for removing resources', async () => {
    render(<Calendar {...defaultProps} />);
    expect(screen.getByText('Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Resource 2')).toBeInTheDocument();
    fireEvent.click(screen.queryAllByTestId('svg-icon-wrapper-close-V4')[0]);
    expect(defaultProps.setSelectedResources).toHaveBeenCalledWith([{ RecordID: 'resource2', Name: 'Resource 2' }]);
  });

  it('renders waitlist tab', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify([
        {
          userIdentity: 'test-user',
          calendars: [
            {
              id: 'test-calendar',
              currentMenuPage: '2',
            },
          ],
        },
      ]),
    );
    render(
      <Calendar
        {...defaultProps}
        sidebarVisibility={{ waitlist: true }}
        showWaitlist
        additionalTabs={[{ id: '3', caption: 'Wait List', order: 1 }]}
        renderAdditionalTabs={() => <div>Waitlist tab content</div>}
      />,
    );
    expect(screen.getByText('Waitlist tab content')).toBeInTheDocument();
  });

  it('renders menu fallback tab when localstorage and props are conflicting', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify([
        {
          userIdentity: 'test-user',
          calendars: [
            {
              id: 'test-calendar',
              currentMenuPage: '2',
              settings: {},
            },
          ],
        },
      ]),
    );
    render(
      <Calendar
        {...defaultProps}
        sidebarVisibility={{ resources: false, waitlist: true, settings: false }}
        showWaitlist
        additionalTabs={[{ id: '3', caption: 'Wait List', order: 1 }]}
        renderAdditionalTabs={() => <div>Waitlist tab content</div>}
      />,
    );
    expect(screen.queryByText('Resources')).not.toBeInTheDocument();
    expect(screen.getByText('Wait List')).toBeInTheDocument();
    expect(screen.getByText('Waitlist tab content')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('is disabled when isDisabled is true', () => {
    const { container } = render(<Calendar {...defaultProps} isDisabled />);
    expect(container.querySelector('.calendarDisabled')).toBeInTheDocument();
  });

  it('displays a modal when event is clicked', () => {
    render(<Calendar {...defaultProps} />);
    const eventElement = screen.getByText('Test Event');
    fireEvent.click(eventElement);
    expect(defaultProps.updateControlOnUpsert).toHaveBeenCalledWith(defaultProps.data[0]);
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
