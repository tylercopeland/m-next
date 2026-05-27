/* eslint-disable no-unused-vars */
interface DateFormatTypes {
  SHORT_DATE: string;
  SHORT_DATE_AND_TIME: string;
  LONG_DATE_AND_TIME: string;
  TIME: string;
  LONG_DATE: string;
  HOUR: string;
  DAY: string;
  DAY_OF_WEEK: string;
  MONTH: string;
}

interface DateFormatOption {
  value: string;
  label: string;
}

interface DisplayPreferences {
  shortDateFormat?: string;
  longDateFormat?: string;
  timeFormat?: string;
  hourFormat?: string;
  dayFormat?: string;
  monthFormat?: string;
  yearFormat?: string;
}

export const dateFormatTypes: DateFormatTypes;
export const dateFormatList: DateFormatOption[];

export function setFormat(
  formatType?: string | number,
  inputType?: 'DateTime' | 'Date' | 'Time',
  displayPreferences?: DisplayPreferences
): string;

export default setFormat; 