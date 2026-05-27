// Type declarations for CalendarUtilities

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId?: string;
  color?: string;
  description?: string;
}

export declare function formatEvents(
  events: CalendarEvent[], 
  showAllDayEvents?: boolean, 
  isEditable?: boolean
): CalendarEvent[];
