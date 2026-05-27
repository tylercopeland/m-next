// Type definitions for @m-next/types
// Generated TypeScript declarations for shared types package

import { ReactNode } from 'react';

// Field type
export interface Field {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  readonly?: boolean;
  [key: string]: any;
}
export default Field;

// Tag type
export interface Tag {
  id: string;
  name: string;
  color?: string;
  [key: string]: any;
}

// HTML Element type
export interface HTMLElementType {
  tagName: string;
  attributes?: Record<string, any>;
  children?: ReactNode;
  [key: string]: any;
}

// Projection type
export interface Projection {
  id: string;
  fields: Field[];
  name?: string;
  [key: string]: any;
}

// Field Types from lookups
export interface FieldType {
  id: string;
  name: string;
  validation?: any;
  [key: string]: any;
}
export const fieldTypes: Record<string, FieldType>;

// Field Type Names
export const FieldTypeNames: Record<string, string>;

// Expression Types from lookups
export interface ExpressionType {
  id: string;
  name: string;
  operator?: string;
  [key: string]: any;
}
export const expressionTypes: Record<string, ExpressionType>;

// Icon Lookup
export interface IconDefinition {
  id: string;
  name: string;
  icon: string;
  [key: string]: any;
}
export const iconLookup: Record<string, IconDefinition>;

// Operation Lookups
export interface Operation {
  id: string;
  name: string;
  operator: string;
  [key: string]: any;
}
export const operationLookups: Record<string, Operation>;

// Session List
export interface SessionItem {
  id: string;
  name: string;
  active?: boolean;
  [key: string]: any;
}
export const sessionList: SessionItem[];

// Control Lookups
export interface ControlType {
  id: string;
  name: string;
  component?: any;
  [key: string]: any;
}
export const controlLookups: Record<string, ControlType>;

// Complex Value Lookups
export interface ComplexValueType {
  id: string;
  name: string;
  structure?: any;
  [key: string]: any;
}
export const complexValueLookups: Record<string, ComplexValueType>;

// Widget Types
export interface Widget {
  id: string;
  name: string;
  component?: any;
  [key: string]: any;
}
export const widgets: Record<string, Widget>;

// Complex Value Types
export interface ComplexValueTypeDefinition {
  id: string;
  name: string;
  fields?: Field[];
  [key: string]: any;
}
export const complexValueTypes: Record<string, ComplexValueTypeDefinition>;

// Aggregate Type IDs
export const aggregateTypeIds: string[];

// Date Ranges
export interface DateRange {
  id: string;
  name: string;
  start?: Date | string;
  end?: Date | string;
  [key: string]: any;
}
export const dateRanges: Record<string, DateRange>;

// DOM Purify Options
export interface DOMPurifyOptions {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
  [key: string]: any;
}

export interface EnhancedDOMPurifyOptions extends DOMPurifyOptions {
  RETURN_DOM?: boolean;
  RETURN_DOM_FRAGMENT?: boolean;
  RETURN_DOM_IMPORT?: boolean;
  [key: string]: any;
}

export interface EnhancedDOMPurifyOptionsLabel extends EnhancedDOMPurifyOptions {
  label?: string;
  [key: string]: any;
}

// Sorting
export interface SortingDefinition {
  field: string;
  direction: 'asc' | 'desc';
  priority?: number;
  [key: string]: any;
}
export const Sorting: SortingDefinition;

// Expression Element
export interface ExpressionElement {
  id: string;
  type: string;
  value?: any;
  operator?: string;
  children?: ExpressionElement[];
  [key: string]: any;
}

// Data Model
export interface DataModel {
  id: string;
  name: string;
  fields: Field[];
  relationships?: any[];
  [key: string]: any;
}

// Predicate
export interface Predicate {
  id: string;
  field: string;
  operator: string;
  value: any;
  logical?: 'AND' | 'OR';
  [key: string]: any;
}

export const EmptyPredicate: Predicate;

// Sort Types
export interface SortType {
  id: string;
  name: string;
  direction: 'asc' | 'desc';
  [key: string]: any;
}
export const sortTypes: Record<string, SortType>;
