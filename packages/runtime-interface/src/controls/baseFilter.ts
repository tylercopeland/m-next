import { Guid } from '@m-next/utilities';

// Filter expression interface
export interface FilterExpression {
  field: string;
  operator: string;
  value: string | number | boolean | null;
  logicalOperator?: 'AND' | 'OR';
}

// Sort direction interface
export interface SortExpression {
  field: string;
  direction: 'ASC' | 'DESC';
}

// Base filter interface
export interface BaseFilter {
  filterId: string;
  filterName: string;
  expression: FilterExpression[];
  isDefault: boolean;
  sorting: SortExpression[];
  viewName: string | null;
}

// Input data interface - all properties are optional
export interface BaseFilterInput {
  filterId?: string;
  filterName?: string;
  expression?: FilterExpression[];
  isDefault?: boolean;
  sorting?: SortExpression[];
  viewName?: string | null;
}

// Factory function with proper typing
export const createBaseFilter = (data: BaseFilterInput = {}): BaseFilter => ({
  filterId: data.filterId || Guid.create(),
  filterName: data.filterName || 'Filter',
  expression: data.expression || [],
  isDefault: data.isDefault === undefined ? true : data.isDefault,
  sorting: data.sorting || [],
  viewName: data.viewName || null,
});

export default createBaseFilter;
