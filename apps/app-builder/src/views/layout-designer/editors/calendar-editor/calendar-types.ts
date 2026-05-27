// Calendar-related types for CalendarEditor and related components
import type { BaseControl, BaseFilter } from '@m-next/runtime-interface';

export interface Column {
  name: string;
  caption: string;
  type: string;
  expression: { source?: { Value: string, ValueType: number }, operation?: number }[] | null;
  columnType: number;
  formula: string;
  fieldType: number;
}

export interface ResourceField {
  name: string;
  caption: string;
  type: string;
  sourceField: string;
  sourceTable: string;
}

export interface ResourceData {
  title: string;
  field: ResourceField;
  defaultToCurrentUser: boolean;
}

export interface SettingsData {
  showAllDayEventsOnTop: boolean;
  showInactiveResources: boolean;
  coloredEventBackgrounds: boolean;
  workingHours: {
    start: string;
    end: string;
    days: number[];
  };
}

export interface WaitlistData {
  fromWaitlistStatus: string;
  toWaitlistStatus: string;
}

export interface CalendarControl extends BaseControl {
  displayOptions: {
    showAllDayEventsOnTop: boolean;
    showInactiveResources: boolean;
    coloredEventBackgrounds: boolean;
    workingHours: {
      start: string;
      end: string;
      days: number[];
    };
  };
  displayViews: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  caption: string;
  onAddEvent?: string | null;
  onDragMoveEvent?: string | null;
  onSelectEvent?: string | null;
  styles: {
    variant: string;
    color: string;
  };
  filterDef?: BaseFilter[]; // Fixed: allow any array if FilterDef is not defined
  model: {
    viewName: string;
    viewFilter: BaseFilter;
    columns: Column[];
    fromWaitlistStatus?: string;
    toWaitlistStatus?: string;
  };
  resourceTitle: string;
  resourceFieldv2: string;
  columnNameRefv2: string;
  defaultResource: string;
  sidebarVisibility: {
    resources: boolean;
    settings: boolean;
    waitlist: boolean;
  };
  [key: string]: unknown; // Add index signature to allow string indexing
} 