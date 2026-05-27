/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/sort-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import React from 'react';

// ===== HOOKS =====
export interface WindowSize {
  0: number; // width
  1: number; // height
}

export namespace hooks {
  export function usePrevious<T>(value: T): T | undefined;
  export function useWindowSize(): WindowSize;
  export function useDebounce<T>(value: T, delay: number): T;
  export function useEnableScroll(ref: React.RefObject<HTMLElement>, targetClassName?: string): void;
}

// ===== INTERACTIONS =====
export namespace interactions {
  export const keyTypes: {
    readonly Tab: 'Tab';
    readonly Enter: 'Enter';
    readonly SpaceBar: 'Space';
    readonly Space: ' ';
    readonly Escape: 'Escape';
    readonly ArrowDown: 'ArrowDown';
    readonly ArrowUp: 'ArrowUp';
    readonly ArrowRight: 'ArrowRight';
    readonly ArrowLeft: 'ArrowLeft';
    readonly Home: 'Home';
    readonly End: 'End';
  };

  export function handleEnterKey(
    callback?: (event: React.KeyboardEvent) => void,
  ): (event: React.KeyboardEvent) => void;
  export function preventPropagation(event: Event): void;
  export function handleActionKey(
    callback?: (event: React.KeyboardEvent) => void,
    handleSpaceKey?: boolean,
    stopEvent?: boolean,
  ): (event: React.KeyboardEvent) => null;
}

// ===== CLICK OUTSIDE =====
export interface ClickOutsideProps {
  id?: string;
  children?: React.ReactNode;
  onClickOutsideHandler?: (event: Event) => void;
  parentRef?: React.RefObject<HTMLElement>;
}

export const ClickOutside: React.FC<ClickOutsideProps>;

// ===== FORMATTER =====
export interface DateFormats {
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  hourFormat: string;
  dayOfWeekFormat: string;
  monthFormat: string;
  monthAndYearFormat: string;
  dayFormat: string;
  yearFormat: string;
}

export interface DisplayPreferences {
  shortDateFormat?: string;
  longDateFormat?: string;
  timeFormat?: string;
  hourFormat?: string;
  dayOfWeekFormat?: string;
  monthFormat?: string;
  monthAndYearFormat?: string;
  useThousandsSeparator?: boolean;
  negativeNumberFormat?: string;
}

export interface NumberFormatOptions {
  decimalPlace?: number;
  useThousandsSeparator?: boolean | string;
  useNegativeParenthesis?: boolean;
}

export interface DateFormatOptions {
  dateFormat?: number | string;
}

export interface FieldDisplayOptions {
  dateFormat?: number | string;
  decimalRounding?: number;
  trueValue?: string;
  falseValue?: string;
}

export interface FieldOption {
  value: string;
  trueValue: string;
  label: string;
  icon?: string;
  lines?: string[] | null;
  fieldType: string;
  source: string;
}

export interface FieldGroup {
  label: string;
  options: FieldOption[];
}

export interface Field {
  name: string;
  caption?: string;
  type: string;
  sourceModel?: string;
}

export interface Projection {
  fields: Array<{ name: string }>;
}

export type DateFormatType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 'Short Date'
  | 'Short Date and Time'
  | 'Long Date and Time'
  | 'Time'
  | 'Long Date'
  | 'Hour'
  | 'Day'
  | 'Day of Week'
  | 'Month'
  | 'Month and Year'
  | 'Year';

export namespace formatter {
  export function formatDate(
    dateFormat: DateFormatType,
    rawDate: string | Date,
    displayPreferences?: DisplayPreferences,
  ): string;

  export function formatValue(
    type: string | null,
    value: any,
    options?: NumberFormatOptions & DateFormatOptions,
    displayPreferences?: DisplayPreferences,
  ): any;

  export function formatMoneyValue(
    value: number | string,
    currencyCode?: string,
    homeCurrencyCode?: string,
  ): string;

  export function formatFieldValue(
    type: string,
    displayOptions: FieldDisplayOptions | null,
    value: any,
    displayPreferences?: DisplayPreferences,
  ): any;

  export function formatFieldList(
    fieldList: Field[] | null,
    dataModelId: string,
    projection?: Projection | null,
    data?: Record<string, any> | null,
    displayPreferences?: DisplayPreferences,
    includedFieldTypes?: string[],
    dropdownFormatting?: boolean,
    splitFields?: boolean,
    includeImages?: boolean,
  ): FieldGroup[] | null;
}

// ===== ERROR BOUNDARY =====
export interface ErrorBoundaryProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps);

  static getDerivedStateFromError(error: Error): ErrorBoundaryState;

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;

  render(): React.ReactNode;
}

// ===== GUID =====
export class Guid {
  static S4(): string;

  static create(): string;

  static valid(guid: string): boolean;

  static empty(): string;
}

// ===== TO CAMEL CASE =====
export function toCamelCase<T>(source: T): T;

// ===== TO PASCAL CASE =====
export function toPascalCase<T>(source: T): T;

// ===== COLOR TRANSFORMATIONS =====
export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ShadeAndTint {
  lowerColor: string;
  upperColor: string;
}

export namespace colorTransformations {
  export function hexToHSL(hex: string): HSL;
  export function HSLToHex(hue: number, saturation: number, light: number): string;
  export function shadeAndTintHex(hex: string, value: number): ShadeAndTint;
}

// ===== LIST UTILITIES =====
export namespace listUtilities {
  export function reorder<T>(list: T[], startIndex: number, endIndex: number): T[];
  export function move<T>(
    source: T[],
    destination: T[],
    sourceIndex: number,
    destinationIndex: number,
  ): {
    source: T[];
    destination: T[];
  };
}

// ===== USE ELLIPSIS DETECTION =====
export function useEllipsisDetection(ref: React.RefObject<HTMLElement>): boolean;

// ===== OWNER =====
export function ownerDocument(node?: Node | null): Document;
export function ownerWindow(node?: Node | null): Window;

// ===== USE PREVIOUS =====
export function usePrevious<T>(value: T): T | undefined;
