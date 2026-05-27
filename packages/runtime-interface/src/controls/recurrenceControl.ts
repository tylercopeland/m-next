import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Recurrence pattern types
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type RecurrenceEndType = 'never' | 'after' | 'on';
export type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

// Recurrence-specific data interface
export interface RecurrenceControlData {
  pattern?: RecurrencePattern;
  interval?: number | null;
  endType?: RecurrenceEndType;
  endDate?: string | null;
  endAfterOccurrences?: number | null;
  weekDays?: WeekDay[] | null;
  monthDay?: number | null;
  yearMonth?: number | null;
  yearDay?: number | null;
  timezone?: string | null;
  startDate?: string | null;
}

// Complete recurrence control interface
export interface RecurrenceControl extends BaseControl {
  type: string;
  pattern?: RecurrencePattern;
  interval?: number | null;
  endType?: RecurrenceEndType;
  endDate?: string | null;
  endAfterOccurrences?: number | null;
  weekDays?: WeekDay[] | null;
  monthDay?: number | null;
  yearMonth?: number | null;
  yearDay?: number | null;
  timezone?: string | null;
  startDate?: string | null;
}

// Factory function to create recurrence control
export const createRecurrenceControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Recurrence',
    classes: '',
    name: 'recurrence',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: RecurrenceControlData = {
    pattern: 'daily',
    interval: 1,
    endType: 'never',
    endDate: null,
    endAfterOccurrences: null,
    weekDays: null,
    monthDay: null,
    yearMonth: null,
    yearDay: null,
    timezone: null,
    startDate: null,
  },
): RecurrenceControl => ({
  ...createBaseControl(base),
  type: WIDGETS.RECURRENCE,
  pattern: data.pattern || 'daily',
  interval: data.interval || 1,
  endType: data.endType || 'never',
  endDate: data.endDate || null,
  endAfterOccurrences: data.endAfterOccurrences || null,
  weekDays: data.weekDays || null,
  monthDay: data.monthDay || null,
  yearMonth: data.yearMonth || null,
  yearDay: data.yearDay || null,
  timezone: data.timezone || null,
  startDate: data.startDate || null,
});

// Type guard function
export const isRecurrenceControl = (control: unknown): control is RecurrenceControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.RECURRENCE
  );
};

export default createRecurrenceControl;
