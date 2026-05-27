/**
 * Expression to Formula conversion utilities
 */

import { ExpressionItem } from '../types';
import { EXPRESSION_OPERATIONS, EXPRESSION_VALUE_TYPES } from '../constants';

/**
 * Convert legacy expression array to formula string
 */
export function convertExpressionToFormula(expression: ExpressionItem[]): string {
  if (!expression || expression.length === 0) {
    return '';
  }

  const formulaParts: string[] = [];
  let pendingOperation: string | null = null;

  for (const item of expression) {
    const operation = item.operation ?? item.Operation;
    if (operation !== null && operation !== undefined) {
      if (operation === EXPRESSION_OPERATIONS.ADD) {
        pendingOperation = ' + ';
      } else if (operation === EXPRESSION_OPERATIONS.SUBTRACT) {
        pendingOperation = ' - ';
      } else if (operation === EXPRESSION_OPERATIONS.DIVIDE) {
        pendingOperation = ' / ';
      } else if (operation === EXPRESSION_OPERATIONS.MULTIPLY) {
        pendingOperation = ' * ';
      }
      continue;
    }

    const source = item.source ?? item.Source;
    if (source) {
      const valueType = source.valueType ?? source.ValueType;
      const value = source.value ?? source.Value;

      let part: string | null = null;
      if (valueType === EXPRESSION_VALUE_TYPES.FIELD) {
        part = `@${value}`;
      } else if (valueType === EXPRESSION_VALUE_TYPES.TEXT) {
        // Preserve HTML tags and wrap in quotes, including empty strings
        if (value !== null && value !== undefined) {
          const textValue = String(value);
          part = `"${textValue}"`;
        }
      } else if (valueType === EXPRESSION_VALUE_TYPES.NUMBER) {
        part = String(value);
      } else if (valueType === EXPRESSION_VALUE_TYPES.BOOLEAN) {
        part = value ? '"True"' : '"False"';
      } else {
        // Preserve HTML tags for unknown types as well, including empty strings
        if (value !== null && value !== undefined) {
          const textValue = String(value);
          part = `"${textValue}"`;
        }
      }

      if (part) {
        if (formulaParts.length > 0 && pendingOperation) {
          formulaParts.push(pendingOperation);
        }
        formulaParts.push(part);
      }

      pendingOperation = null;
    }
  }

  return formulaParts.join('');
}

interface FilterCondition {
  field: string;
  value: string;
}

interface Filter {
  operator: string;
  conditions: FilterCondition[];
}

interface LegacyExpressionItem {
  Operation?: number;
  operation?: number;
  Source?: {
    Value?: string;
    value?: string;
  };
  source?: {
    Value?: string;
    value?: string;
  };
  [key: string]: unknown;
}

/**
 * Convert legacy filter expression to modern filter format
 */
export function convertLegacyExpression(expression: LegacyExpressionItem[]): Filter[] {
  if (!Array.isArray(expression) || expression.length === 0) {
    return [];
  }

  const filters: Filter[] = [];
  let currentFilter: Filter | null = null;

  for (const expr of expression) {
    const operation = expr.Operation ?? expr.operation;

    if (operation === EXPRESSION_OPERATIONS.START_GROUP) {
      currentFilter = { operator: 'and', conditions: [] };
    } else if (operation === EXPRESSION_OPERATIONS.END_GROUP) {
      if (currentFilter) {
        filters.push(currentFilter);
        currentFilter = null;
      }
    } else if (expr.Source || expr.source) {
      const source = expr.Source || expr.source;
      const field = source?.Value ?? source?.value ?? '';
      const value = source?.Value ?? source?.value ?? '';

      if (currentFilter) {
        currentFilter.conditions.push({
          field,
          value,
        });
      }
    }
  }

  return filters;
}
