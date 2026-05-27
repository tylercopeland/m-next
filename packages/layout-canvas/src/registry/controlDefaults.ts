/**
 * Control Defaults Configuration
 *
 * Centralized configuration for default properties of various control types.
 * Used by LayoutCanvasWrapper for control creation and ensures consistency
 * across the application.
 */

/**
 * Calendar (CAL) default button configuration
 * Creates a Button Group Item (BGI) for calendar menu
 */
export const createCalendarDefaultButton = (buttonId: string, controlName: string) => ({
  Type: 'BGI',
  Class: null,
  icon: null,
  iconAlign: null,
  defaultValue: 'Menu item 1',
  id: buttonId,
  version: null,
  name: `${controlName}~~${buttonId}`,
  isV4Control: false,
  TypeOverride: 'BGI',
  isBound: false,
  IsComplexType: false,
  FieldType: 0,
  value: 'Menu item 1',
  caption: 'Menu item 1',
  classes: '',
  hideCaption: false,
  isOutputOnly: false,
  regularCaption: false,
  width: null,
  widthType: null,
  visible: true,
  disabled: false,
  DefaultValueWrapper: 'Menu item 1',
  styles: {},
  onBlur: null,
  onChange: null,
  onClick: null,
  onFocus: null,
  validationRules: null,
  validationError: null,
});

/**
 * Calendar (CAL) default column structure
 * Used in the model.columns array for backend compatibility
 */
const createCalendarColumn = (
  name: string,
  caption: string,
  valueType: number,
  value: string,
  hasExpression: boolean = true,
) => ({
  name,
  caption,
  isKey: false,
  columnType: 0,
  width: 0,
  format: null,
  cardColumnFields: null,
  hasSubtotal: false,
  subtotal: 0,
  ignore: false,
  isLinked: false,
  tableNameRef: null,
  isRequired: false,
  isUnique: false,
  size: 0,
  id: 0,
  linkedFieldCaption: null,
  linkedJoinFromTable: null,
  linkedJoinFromPrimary: null,
  linkedViaField: null,
  compareName: null,
  displayValueFromTableName: null,
  displayValueFromFieldName: null,
  displayValueFromViewFriendlyName: null,
  maxSize: 0,
  isComplexField: false,
  parentFieldName: null,
  parentFieldType: null,
  elementType: null,
  elementSeq: null,
  elements: null,
  fieldType: 0,
  onClick: null,
  expression: hasExpression
    ? [
        {
          operation: null,
          dateField: null,
          source: {
            ValueType: valueType,
            Value: value,
            Property: null,
            ChildProperty: null,
            ValidationMessage: null,
            FontStyles: null,
          },
          key: null,
          additionalSources: null,
          dateWhere: null,
        },
      ]
    : [],
  aggregate: null,
  dateGroupBy: null,
  validationRules: null,
  formula: null,
  cardAvatar: null,
});

/**
 * Calendar (CAL) default model structure
 * Required by backend for calendar data operations
 */
export const CALENDAR_DEFAULT_MODEL = {
  searchString: '',
  mode: null,
  fromDate: new Date().toISOString(),
  toDate: new Date().toISOString(),
  description: null,
  title: null,
  status: null,
  showWaitlist: false,
  showSettings: true,
  toWaitlistStatus: 'Not Scheduled',
  fromWaitlistStatus: 'Not Started',
  isWaitlistData: false,
  dynamicFilterField: null,
  dynamicFilterValue: null,
  isEditable: false,
  resources: null,
  dataSource: null,
  currentDate: null,
  config: {
    dateRange: null,
    version: 0,
    resources: null,
  },
  viewName: 'Activity',
  viewFilter: null,
  distinct: false,
  columns: [
    createCalendarColumn('RecordID', 'RecordId', 3, 'RecordId'),
    createCalendarColumn('AssignedTo', 'ResourceId', 3, 'AssignedTo'),
    createCalendarColumn('ActivityStatusColor', 'Color', 3, 'ActivityStatusColor'),
    createCalendarColumn('DueDateStart', 'StartDate', 3, 'DueDateStart'),
    createCalendarColumn('DueDateEnd', 'EndDate', 3, 'DueDateEnd'),
    createCalendarColumn('ActivityType', 'ActivityType', 0, '', false),
    createCalendarColumn('Comments', 'Comments', 0, '', false),
    createCalendarColumn('IsAllDayAppointment', 'IsAllDayAppointment', 5, 'IsAllDayAppointment'),
  ],
  sorting: null,
  paging: {
    pageNumber: 1,
    pageSize: 1000,
    totalRows: 0,
  },
  selectAll: false,
  selectedRecords: [],
};

/**
 * Calendar (CAL) default display views configuration
 */
export const CALENDAR_DEFAULT_DISPLAY_VIEWS = {
  day: {
    visible: true,
    standard: true,
    horizontal: true,
    vertical: true,
  },
  week: {
    visible: true,
    standard: true,
    horizontal: true,
    vertical: true,
  },
  month: {
    visible: true,
    standard: true,
    horizontal: true,
    vertical: true,
  },
  list: {
    visible: true,
    weekly: true,
    full: true,
  },
};

/**
 * Calendar (CAL) default sidebar visibility
 */
export const CALENDAR_DEFAULT_SIDEBAR_VISIBILITY = {
  resources: true,
  settings: true,
  waitlist: false,
};

/**
 * Calendar (CAL) default appointment styling
 */
export const CALENDAR_DEFAULT_APPOINTMENT = {
  allDayBarColor: '',
  allDayBgColor: '',
  defaultBarColor: '',
  defaultBgColor: '',
};

/**
 * Calendar (CAL) default hover card configuration
 */
export const CALENDAR_DEFAULT_HOVER_CARD = {
  resource: true,
  startdate: true,
  starttime: true,
  enddate: true,
  endtime: true,
  title: true,
  description: true,
};

/**
 * Calendar (CAL) default selection info
 */
export const CALENDAR_DEFAULT_SELECTION_INFO = {
  selectedAppointments: [],
  selectedDateTimeEnd: null,
  selectedDateTimeStart: null,
  selectedResource: null,
};

/**
 * Calendar (CAL) default time range
 */
export const CALENDAR_DEFAULT_TIME_RANGE = {
  endTime: '9pm',
  startTime: '8am',
};

/**
 * Complete Calendar (CAL) default properties
 * Used when creating a new calendar control
 */
export const createCalendarDefaults = (buttonId: string, controlName: string) => ({
  isComplexType: true,
  isWorking: false,
  displayOptions: null,
  displayViews: CALENDAR_DEFAULT_DISPLAY_VIEWS,
  onAddEvent: null,
  onDragMoveEvent: null,
  onSelectEvent: null,
  onEditEvent: null,
  onEventClick: null,
  resourceTitle: 'Resources',
  resourceFieldv2: null,
  columnNameRefv2: null,
  defaultResource: 'Session.Username',
  filterDef: null,
  sidebarVisibility: CALENDAR_DEFAULT_SIDEBAR_VISIBILITY,
  appointment: CALENDAR_DEFAULT_APPOINTMENT,
  dynamicFilterField: '',
  isEditable: true,
  keepWidth: false,
  hoverCard: CALENDAR_DEFAULT_HOVER_CARD,
  resourceField: 'UserName',
  resourceView: 'Users',
  viewNamev2: null,
  selectionInfo: CALENDAR_DEFAULT_SELECTION_INFO,
  showAllDayAppointments: true,
  showFilters: true,
  timeRange: CALENDAR_DEFAULT_TIME_RANGE,
  timezoneLong: '',
  timezoneShort: '',
  view: 'Day',
  compactEventTime: '',
  version: '1.0.0',
  buttons: [createCalendarDefaultButton(buttonId, controlName)],
  model: CALENDAR_DEFAULT_MODEL,
});

/**
 * Radio Button (RAD) default properties
 */
export const RADIO_BUTTON_DEFAULTS = {
  isChecked: false,
  position: 'horizontal' as const,
  radiobuttons: ['Value 1', 'Value 2'],
  value: null,
  defaultValue: 'Value 1',
  defaultValueWrapper: 'Value 1',
};

/**
 * Sync Widget (SYW) default properties
 */
export const SYNC_WIDGET_DEFAULTS = {
  value: null,
  defaultValue: '',
  defaultValueWrapper: '',
  regularCaption: false,
};

/**
 * Chart (CHT) default column structure
 * Used in the model.columns array for backend compatibility
 */
const createChartColumn = (name: string, caption: string, fieldType: number) => ({
  name,
  caption,
  isKey: false,
  columnType: 0,
  width: 0,
  format: null,
  cardColumnFields: null,
  hasSubtotal: false,
  subtotal: 0,
  ignore: false,
  isLinked: false,
  tableNameRef: null,
  isRequired: false,
  isUnique: false,
  size: 0,
  id: 0,
  linkedFieldCaption: null,
  linkedJoinFromTable: null,
  linkedJoinFromPrimary: null,
  linkedViaField: null,
  compareName: null,
  displayValueFromTableName: null,
  displayValueFromFieldName: null,
  displayValueFromViewFriendlyName: null,
  maxSize: 0,
  isComplexField: false,
  parentFieldName: null,
  parentFieldType: null,
  elementType: null,
  elementSeq: null,
  elements: null,
  fieldType,
  onClick: null,
  expression: null,
  aggregate: null,
  dateGroupBy: null,
  validationRules: null,
  formula: null,
  cardAvatar: null,
});

/**
 * Chart (CHT) default model structure
 * Required by backend for chart data operations
 */
export const CHART_DEFAULT_MODEL = {
  view: '',
  labels: {
    series: 'Value',
    primary: '',
    secondary: '',
  },
  chart: 1,
  dataPoints: false,
  dataSource: [],
  hasDynamicDates: false,
  dynamicDateRange: null,
  colors: [
    '#0D71C8',
    '#001e56',
    '#00376f',
    '#022266',
    '#022266',
    '#064499',
    '#B3E5FF',
    '#E5F7FF',
    '#E5F7FF',
    '#c3ffff',
    '#dcffff',
  ],
  drilldownProjection: null,
  drilldownEnabled: false,
  selectedSeries: 0,
  selectedRowRecordId: 0,
  viewName: '',
  viewFilter: null,
  distinct: false,
  columns: [createChartColumn('', 'PrimaryColumn', 0), createChartColumn('', 'SecondaryColumn', 1)],
  sorting: null,
  paging: null,
  selectAll: false,
  selectedRecords: [],
};

/**
 * Complete Chart (CHT) default properties
 * Used when creating a new chart control
 */
export const createChartDefaults = () => ({
  isComplexType: true,
  hasStaticDataSource: false,
  height: 10,
  heightType: null,
  model: CHART_DEFAULT_MODEL,
  filterDef: null,
  version: null,
  isV4Control: false,
  onEventClick: null,
  onRowClick: null,
});
