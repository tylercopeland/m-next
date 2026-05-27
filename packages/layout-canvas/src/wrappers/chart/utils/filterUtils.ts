/**
 * Filter utility functions for building chart drilldown filters
 */

import { basicOperationId, complexValueTypes } from '@m-next/types';
import { monthNumbers } from './constants';
import type { ChartControl } from '../types';

/**
 * Builds a date filter expression
 * @param filter - Filter expression array to modify
 * @param control - Chart control with column definitions
 * @param datePart - Date part value (year, month, day)
 * @param dateField - Date field type (4=year, 3=month, 2=day)
 */
export function buildDateFilter(
  filter: unknown[],
  control: ChartControl,
  datePart: string | number,
  dateField: number,
): void {
  if (!control.model?.columns || !control.model.columns[0]) return;

  filter.push({
    operation: null,
    dateField: null,
    source: {
      Value: control.model.columns[0].name,
      ValueType: complexValueTypes.Field,
      Property: null,
      ChildProperty: null,
    },
  });
  filter.push({ operation: basicOperationId.Is, dateField, source: null });
  filter.push({
    operation: null,
    dateField: null,
    source: {
      Value: datePart,
      ValueType: complexValueTypes.Text,
      Property: null,
      ChildProperty: null,
    },
  });
}

/**
 * Builds filter expression for selected point
 * @param control - Chart control
 * @param selectedPoint - Selected point value
 * @returns Filter expression array
 */
export function buildSelectedPointFilter(control: ChartControl, selectedPoint: string | null): unknown[] {
  if (!control.model) return [];

  const filter = [...(control.model.viewFilter?.expression || [])];

  if (selectedPoint === null || !control.model.columns || !control.model.columns[0]) {
    return filter;
  }

  if (filter.length > 0) {
    filter.push({ operation: basicOperationId.And, dateField: null, source: null });
  }

  const column = control.model.columns[0];
  const dateGroupBy = column.dateGroupBy;

  // Handle empty selection
  if (selectedPoint === '') {
    filter.push({
      operation: null,
      dateField: null,
      source: {
        Value: column.name,
        ValueType: complexValueTypes.Field,
        Property: null,
        ChildProperty: null,
      },
    });
    filter.push({ operation: basicOperationId.IsEmpty, dateField: null, source: null });
    return filter;
  }

  // Handle date grouping
  if (dateGroupBy === 2) {
    // Year only
    buildDateFilter(filter, control, selectedPoint, 4);
  } else if (dateGroupBy === 1) {
    // Year-Month
    const dateParts = selectedPoint.replace('.', '').split('-');
    if (dateParts[0]) {
      buildDateFilter(filter, control, dateParts[0], 4);
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
      if (dateParts[1]) {
        buildDateFilter(filter, control, monthNumbers[dateParts[1]] || dateParts[1], 3);
      }
    }
  } else if (dateGroupBy === 0) {
    // Year-Month-Day
    const dateParts = selectedPoint.replace('.', '').split('-');
    if (dateParts[0]) {
      buildDateFilter(filter, control, dateParts[0], 4);
      filter.push({ operation: basicOperationId.And, dateField: null, source: null });
      if (dateParts[1]) {
        buildDateFilter(filter, control, monthNumbers[dateParts[1]] || dateParts[1], 3);
        filter.push({ operation: basicOperationId.And, dateField: null, source: null });
        if (dateParts[2]) {
          buildDateFilter(filter, control, Number(dateParts[2]), 2);
        }
      }
    }
  } else {
    // Standard field filter
    filter.push({
      operation: null,
      dateField: null,
      source: {
        Value: column.name,
        ValueType: complexValueTypes.Field,
        Property: null,
        ChildProperty: null,
      },
    });
    filter.push({ operation: basicOperationId.Is, dateField: null, source: null });
    filter.push({
      operation: null,
      dateField: null,
      source: {
        Value: selectedPoint,
        ValueType: complexValueTypes.Text,
        Property: null,
        ChildProperty: null,
      },
    });
  }

  return filter;
}
