import React from 'react';

export interface CalendarDaysToggleProps {
  /** Array of booleans for each day of the week (Sunday to Saturday) */
  calendarDays?: boolean[];
  /** Function to update the calendar days array */
  setCalendarDays?: (days: boolean[]) => void;
  /** Whether the component is being used on mobile */
  isMobile?: boolean;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Label text for the component */
  label?: string;
  /** Styles for the component */
  styles?: React.CSSProperties;
  /** Whether to use a text label instead of a caption */
  useTextLabel?: boolean;
}

declare const CalendarDaysToggle: React.FC<CalendarDaysToggleProps>;

export default CalendarDaysToggle; 