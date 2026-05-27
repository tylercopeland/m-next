/**
 * Local Redux type definitions for layout-canvas package
 *
 * These types mirror the structure from app-builder but are defined locally
 * to break the circular dependency between layout-canvas and app-builder.
 *
 * This allows wrappers to import types from layout-canvas instead of app-builder.
 */

/**
 * Minimal RootState interface that wrappers need
 * This matches the structure from app-builder/src/types/screenLayoutTypes.tsx
 */
export interface RootState {
  screenLayout?: {
    controls?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Control data structure (generic, wrappers will cast to specific types)
 */
export interface ControlData {
  id: string;
  type: string;
  visible?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * Calendar-specific control interface
 */
export interface CalendarControl extends ControlData {
  type: 'CAL';
  caption?: string;
  hideCaption?: boolean;
  view?: string;
  displayViews?:
    | {
        day?: { visible?: boolean; standard?: boolean; vertical?: boolean; horizontal?: boolean };
        week?: { visible?: boolean; standard?: boolean; vertical?: boolean; horizontal?: boolean };
        month?: { visible?: boolean; standard?: boolean };
        list?: { visible?: boolean; weekly?: boolean; full?: boolean };
        // Legacy uppercase properties for backward compatibility
        Day?: { visible?: boolean; [key: string]: unknown };
        Week?: { visible?: boolean; [key: string]: unknown };
        Month?: { visible?: boolean; [key: string]: unknown };
      }
    | string[]
    | { [key: string]: unknown };
  compactEventTime?: string | boolean;
  isEditable?: boolean;
  version?: string;
  columnNameRefv2?: string;
  viewNamev2?: string;
  resourceFieldv2?: string;
  resourceField?: string;
  resourceView?: string;
  resourceTitle?: string;
  defaultResource?: string;
  buttons?: Array<{ caption: string; [key: string]: unknown }>;
  styles?: { color?: string; variant?: string; [key: string]: unknown };
  timeRange?: {
    startTime?: string;
    endTime?: string;
  };
  model?: {
    fromDate?: string;
    toDate?: string;
    resources?: unknown[];
    showWaitlist?: boolean;
    toWaitlistStatus?: string;
    showSettings?: boolean;
    resourceTitle?: string;
    [key: string]: unknown;
  };
  displayOptions?: {
    showAllDayEventsOnTop?: boolean;
    showInactiveResources?: boolean;
    coloredEventBackgrounds?: boolean;
    workingHours?: {
      start?: string;
      end?: string;
      days?: number[];
    };
  };
  sidebarVisibility?: {
    resources?: boolean;
    waitlist?: boolean;
    settings?: boolean;
  };
  hoverCard?: {
    title?: boolean;
    description?: boolean;
    startdate?: boolean;
    starttime?: boolean;
    enddate?: boolean;
    endtime?: boolean;
    resource?: boolean;
  };
  onAddEvent?: (() => void) | null;
  showAllDayAppointments?: boolean;
  filterDef?: unknown;
}
