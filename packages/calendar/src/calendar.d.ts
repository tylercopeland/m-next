import React from 'react';

export interface CalendarView {
  horizontal?: boolean;
  standard?: boolean;
  vertical?: boolean;
  visible?: boolean;
}

export interface DisplayViews {
  day?: CalendarView;
  week?: CalendarView;
  month?: CalendarView;
  list?: CalendarView;
}

export interface ResourceTitleFormatted {
  forTab?: string;
  forDropdown?: string;
  forDisplay?: string;
}

export interface CalendarSettings {
  startTime: string;
  endTime: string;
  showAllDayEvents: boolean;
  showInactiveResources: boolean;
  fullColoredEvents: boolean;
  calendarDays: number[];
}

export interface SidebarVisibility {
  resources?: boolean;
  waitlist?: boolean;
  settings?: boolean;
}

export interface WorkingHours {
  start?: string;
  end?: string;
  days?: (number | boolean)[];
}

export interface DisplayOptions {
  showAllDayEventsOnTop?: boolean;
  showInactiveResources?: boolean;
  coloredEventBackgrounds?: boolean;
  workingHours?: WorkingHours;
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}

export interface CalendarResource {
  RecordID: string | number;
  [key: string]: any;
}

export interface CalendarEvent {
  Id?: string | number;
  Guid?: string;
  Subject?: string;
  StartTime: string | Date;
  EndTime: string | Date;
  CategoryColor?: string;
  ActivityStatus?: string;
  AssignedToId?: string | number;
  AssignedToName?: string;
  [key: string]: any;
}

export interface EventCardMenuItem {
  onClick: () => void;
  [key: string]: any;
}

export interface HoverCard {
  title?: boolean;
  description?: boolean;
  resource?: boolean;
  startdate?: boolean;
  starttime?: boolean;
  enddate?: boolean;
  endtime?: boolean;
}

export interface AdditionalTab {
  [key: string]: any;
}

export interface CalendarProps {
  id?: string | null;
  userIdentity?: string | null;
  onAddEvent?: (() => void) | null;
  eventCardMenu?: EventCardMenuItem[];
  onSelectEvent?: (() => void) | null;
  onDragMoveEvent?: (() => void) | null;
  updateControlOnUpsert?: ((data: any) => void) | null;
  updateControlResources?: ((resources: CalendarResource[], renderDates: Date[]) => void) | null;
  isMobile?: boolean;
  resourceMappedField?: string | null;
  resourceLabel?: string | null;
  resourceTitle?: string;
  resourceTitleFormatted?: ResourceTitleFormatted | null;
  resources?: CalendarResource[];
  defaultResource?: string | number |null;
  data?: CalendarEvent[];
  displayViews?: DisplayViews;
  calendarSettings?: CalendarSettings | null;
  setCalendarSettings?: (settings: CalendarSettings) => void;
  compactEventTime?: string;
  isDisabled?: boolean;
  caption?: string;
  hideCaption?: boolean;
  setDateRange?: (dateRange: DateRange) => void;
  currentView?: string;
  fetchEventData?: () => void;
  additionalTabs?: AdditionalTab[];
  renderAdditionalTabs?: ((tabs: AdditionalTab[]) => React.ReactNode) | null;
  schedulerRef?: React.RefObject<any> | null;
  selectedResources?: CalendarResource[];
  setSelectedResources?: (resources: CalendarResource[]) => void;
  isLeftNavOpen?: boolean | undefined;
  canvasWidth?: number;
  hoverCard?: HoverCard;
  setEventDragging?: (isDragging: boolean) => void;
  showWaitlist?: boolean;
  toWaitlistStatus?: string;
  showSettings?: boolean;
  sidebarVisibility?: SidebarVisibility;
  displayOptions?: DisplayOptions;
  sendAnalytics?: ((action: string, data?: any) => void) | null;
  isReadOnly?: boolean;
  version?: string;
}

export interface CalendarResourceHelperResult {
  activeResourceExpression: any[];
  resourceFilter: any;
  buildViewFilter: (shared: number[]) => any;
}

export declare const Calendar: React.FC<CalendarProps>;

export declare const CalendarResourceHelper: (viewName: string, columnName: string) => CalendarResourceHelperResult;

export interface CalendarModel {
  model: {
    fromWaitlistStatus?: string;
    toWaitlistStatus?: string;
    [key: string]: any;
  };
  filterDef: Array<{
    expression: any[];
  }>;
  [key: string]: any;
}

export interface GridData {
  rows?: Array<Array<{  
    name: string;
    value: any;
  }>>;
  currentPage?: number;
  count?: number;
  [key: string]: any;
}

export interface ModalData {
  data?: CalendarEvent[];
  [key: string]: any;
}

export interface CalendarData {
  [key: string]: any;
}

export interface SchedulerRef {
  current?: {
    element?: HTMLElement;
    getCellDetails?: (target: HTMLElement) => {
      startTime: Date;
      endTime: Date;
      groupIndex?: number;
    };
    getResourcesByIndex?: (index: number) => {
      resourceData?: {
        RecordID: string | number;
        UserName: string;
      };
    };
    currentView?: string;
  } | null;
}

export interface CalendarWaitlistProps {
  scheduler?: SchedulerRef | React.RefObject<any> | (() => void) | object | null;
  isMobile?: boolean;
  calendarModel?: CalendarModel;
  eventCardMenu?: EventCardMenuItem[];
  onDragMoveEvent?: () => void;
  updateControl?: (data: any) => void;
  calendarData?: CalendarData;
  gridData?: GridData;
  fetchGridData?: (gridEvent?: any) => void;
  modalData?: ModalData;
  fetchModalData?: (callback?: (data: any) => void) => void;
  partialRecordCount?: number;
  totalRows?: number;
  hoverCard?: HoverCard;
  eventDragging?: boolean;
  setEventDragging?: (isDragging: boolean) => void;
  sendAnalytics?: (action: string, data?: any) => void;
}

export declare const CalendarWaitlist: React.FC<CalendarWaitlistProps>;

export interface CalendarModalProps {
  event?: CalendarEvent | object;
  isMobile?: boolean;
  isVisible?: boolean;
  isWaitlistEvent?: boolean;
  onClose?: () => void;
  eventCardMenu?: EventCardMenuItem[];
  dateSection?: React.ReactElement;
  alignVWith?: Element;
  alignHWith?: Element;
  hoverCard?: HoverCard;
}

export declare const CalendarModal: React.FC<CalendarModalProps>;
export declare const CalendarModalHeader: React.FC<any>;
export declare const CalendarModalContent: React.FC<any>;
export declare const CalendarModalFooter: React.FC<any>;

// CalendarHelperModel types
export interface GridModelPaging {
  pageNumber: number;
  pageSize: number;
  totalRows: number;
}

export interface GridModelColumn {
  field: string;
  visible: boolean;
}

export interface GridModelView {
  name: string;
  id: string;
  columns: GridModelColumn[];
  sorting: any[];
  filtering: any[];
}

export interface GridModelColumnDefinition {
  controlId: string;
  header: string;
  field: string;
  fieldType: number;
  columnType?: number;
  onChangeEvent?: any;
  readOnly?: boolean;
  canDelete?: boolean;
  isLocked?: boolean;
  cardColumnFields?: Array<{
    fldTypeId: number;
    label: string;
    table: string;
    value: string;
  }>;
  showOnMobile?: boolean;
  format?: {
    width: string;
    alignment: string;
    type: string;
    rounding: string;
    headerAlignment: string;
    disabled: boolean;
  };
  control?: {
    Type: string;
    defaultValue: string;
    id: string;
    name: string;
    TypeOverride: string;
    FieldType: number;
    value: string;
    caption: string;
  };
  displayField: string;
}

export interface GridModel {
  columnTotals: any[];
  Type: string;
  IsComplexType: boolean;
  viewList: GridModelView[];
  viewFriendlyName: string;
  defaultViewFilter: string;
  columns: GridModelColumnDefinition[];
  isSearchable: boolean;
  isSelectable: boolean;
  SearchString: string;
  hideViewSelector: boolean;
  showDividers: boolean;
  hasZebraStripes: boolean;
  addLabel: string;
  isReadOnly: boolean;
  canAddMoreRows: boolean;
  newRowsCount: number;
  showDeleteColumn: boolean;
  showDeleteConfirmation: boolean;
  showGoToPage: boolean;
  onActiveRowChange: any;
  paging: GridModelPaging;
  showExport: boolean;
  viewFilter: string;
  selectAll: boolean;
  hideAdvSearch: boolean;
  hideColumnHeaders: boolean;
  hideNavigation: boolean;
  hideSearch: boolean;
  hideViewsDropdown: boolean;
  id: string;
  name: string;
  TypeOverride: string;
  isBound: boolean;
  FieldType: number;
  caption: string;
  hideCaption: boolean;
  isOutputOnly: boolean;
  regularCaption: boolean;
  widthType: string;
  disabled: boolean;
}

export interface GridColumn {
  name: string;
  header: string;
  field: string;
  formatType?: { type: string };
  fieldType: number;
  columnType: number;
  readOnly: boolean;
  canDelete: boolean;
  isLocked: boolean;
  visible: boolean;
  cardColumnFields?: Array<{
    format: {
      type: string;
      visible: boolean;
      hasExpression: boolean;
    };
    fldTypeId: number;
    label: string;
    table: string;
    value: string;
  }>;
  showOnMobile?: boolean;
  format?: {
    width: string;
    alignment: string;
    type: string;
    rounding: string;
    headerAlignment: string;
    visible: boolean;
    disabled: boolean;
  };
  primary?: boolean;
  hasColumnTotal: boolean;
  displayField: string;
}

export interface CalendarHelperModelResult {
  gridModel: GridModel;
  gridColumns: GridColumn[];
  calendar: CalendarModel & {
    id: string;
    model: CalendarModel['model'] & {
      fromDate: string;
      toDate: string;
      showWaitlist: boolean;
      isWaitlistData: boolean;
      resources: any[];
      config: {
        resources: any[];
        [key: string]: any;
      };
    };
  };
}

export declare const CalendarHelperModel: (calendarModel: CalendarModel, gridPageSize: number) => CalendarHelperModelResult;

// Calendar Utility Functions
export declare const getLocalStorageSettings: (id: string, methodIdentity: string) => any | null;
export declare const getStorageKey: (viewName: string, resourceField: string) => string;
export declare const setCalendarLocalStorageSetting: (userIdentity: string, calendarId: string, settingName: string, settingVal: any) => void;

// Re-export utilities and analytics from other modules
export * from './CalendarUtilities';
export * from './calendarServices/CalendarAnalytics';