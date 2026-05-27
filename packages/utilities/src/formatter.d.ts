/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export declare const dateFormats: {
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  hourFormat: string;
  dayOfWeekFormat: string;
  monthFormat: string;
  monthAndYearFormat: string;
  dayFormat: string;
  yearFormat: string;
};

export declare function formatDate(
  dateFormat: number | string,
  rawdate: any,
  displayPreferences?: Record<string, any>,
): string;

export declare function formatValue(
  type: string,
  value: any,
  options?: Record<string, any>,
  displayPreferences?: Record<string, any>,
): string | any;

export declare function formatFieldValue(
  type: string,
  displayOptions: Record<string, any> | undefined,
  value: any,
  displayPreferences?: Record<string, any>,
): string | any;

export declare function formatFieldList(
  fieldList: Array<Record<string, any>>,
  dataModelId: string,
  projection: any,
  data: Record<string, any>,
  displayPreferences?: Record<string, any>,
  includedFieldTypes?: string[],
  dropdownFormatting?: boolean,
  splitFields?: boolean,
  includeImages?: boolean,
): Array<{ label: string; options: Array<Record<string, any>> } | null> | null;
