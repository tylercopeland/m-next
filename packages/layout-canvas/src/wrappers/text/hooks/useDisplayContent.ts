/**
 * Custom hook for calculating display content
 */

import { useMemo } from 'react';
import { getValueFromComplexValue } from '../../../../../../apps/app-builder/src/components/complex-value/complex-value-utils';
import { sessionLookup, FieldTypeNames } from '@m-next/types';
import { formatter } from '@m-next/utilities';
import { useDesignerContext } from '../../../contexts/DesignerContext';
import { formatNewlines } from '../utils';
import { formatYesNoValue, normalizeFieldTypeName } from '../textFormatting';

interface Control {
  value?: unknown;
  defaultValue?: unknown;
  isBound?: boolean;
  name?: string;
  fieldType?: number | string;
  formatType?: string;
  formatRounding?: number;
}

export function useDisplayContent(control: Control | undefined, isRuntimeMode: boolean) {
  const designerContext = useDesignerContext();

  return useMemo(() => {
    if (!control) return '';

    // In runtime mode, use the value from dataReducer
    if (isRuntimeMode) {
      const runtimeValue = control.value;
      if (runtimeValue !== null && runtimeValue !== undefined && runtimeValue !== '') {
        // Apply field-type-specific formatting for mapped controls.
        // Use formatType/formatRounding as primary signals since fieldType
        // is unreliable for Labels (backend often sets FieldType=0 for LBL).
        if (control.isBound) {
          const hasDateFormat = control.formatType && control.formatType !== '';
          const hasDecimalRounding = control.formatRounding !== undefined && control.formatRounding !== null;
          const fieldTypeName = normalizeFieldTypeName(control.fieldType, control.name);

          if (fieldTypeName === FieldTypeNames.YesNo) {
            const rawYesNoValue =
              runtimeValue && typeof runtimeValue === 'object'
                ? ((runtimeValue as { value?: unknown; Value?: unknown }).value ??
                  (runtimeValue as { value?: unknown; Value?: unknown }).Value)
                : runtimeValue;
            return formatNewlines(formatYesNoValue(rawYesNoValue));
          }
          if (
            (hasDateFormat || fieldTypeName === FieldTypeNames.DateTime || fieldTypeName === FieldTypeNames.Date) &&
            (typeof runtimeValue === 'string' || typeof runtimeValue === 'number')
          ) {
            const displayOptions = { dateFormat: control.formatType || 'Short Date' };
            const formatted = formatter.formatFieldValue(FieldTypeNames.DateTime, displayOptions, runtimeValue);
            return formatNewlines(formatted);
          }
          if (
            (hasDecimalRounding ||
              fieldTypeName === FieldTypeNames.Decimal ||
              fieldTypeName === FieldTypeNames.Money) &&
            (typeof runtimeValue === 'string' || typeof runtimeValue === 'number')
          ) {
            const displayOptions = { decimalRounding: control.formatRounding ?? 2 };
            const typeName = fieldTypeName === FieldTypeNames.Money ? FieldTypeNames.Money : FieldTypeNames.Decimal;
            const formatted = formatter.formatFieldValue(typeName, displayOptions, runtimeValue);
            return formatNewlines(formatted);
          }
          if (
            (fieldTypeName === FieldTypeNames.Integer || fieldTypeName === FieldTypeNames.Phone) &&
            (typeof runtimeValue === 'string' || typeof runtimeValue === 'number')
          ) {
            const formatted = formatter.formatFieldValue(fieldTypeName!, {}, runtimeValue);
            return formatNewlines(formatted);
          }
        }

        // Fallback: support boolean runtime values (e.g., mapped YesNo labels).
        if (typeof runtimeValue === 'boolean') {
          return formatNewlines(formatYesNoValue(runtimeValue));
        }
        if (typeof runtimeValue === 'string' || typeof runtimeValue === 'number') {
          return formatNewlines(runtimeValue);
        }
      }
      return '';
    }

    // In designer mode, check if there's a defaultValue with specific valueType
    if (control.defaultValue && typeof control.defaultValue === 'object') {
      const defaultVal = control.defaultValue as { valueType?: number; value?: string };
      const valueType = defaultVal.valueType;
      const value = defaultVal.value || '';

      // valueType 5 = Control - show Control.ControlName
      if (valueType === 5 && value) {
        const referencedControl = designerContext?.selectControlById(value) as
          | { name?: string; caption?: string }
          | undefined;
        const controlDisplayName = referencedControl?.caption || referencedControl?.name || value;
        const controlNameCamelCase = controlDisplayName.replace(/\s+/g, '');
        return `Control.${controlNameCamelCase}`;
      }

      // valueType 6 = Session - show Session.VariableName
      if (valueType === 6 && value) {
        const displayLabel = String(sessionLookup?.[String(value).toLowerCase()] ?? value ?? '');
        const displayLabelCamelCase = displayLabel.replace(/\s+/g, '');
        return `Session.${displayLabelCamelCase}`;
      }

      // valueType 9 = Text - show the actual text value
      if (valueType === 9 && value) {
        return formatNewlines(value);
      }
    }

    // In designer mode for mapped controls with no defaultValue, show Table.FieldName format
    if (control.isBound && control.name) {
      const fieldNameCamelCase = control.name.replace(/\s+/g, '');
      return fieldNameCamelCase;
    }

    // For non-mapped controls without specific valueType, use defaultValue
    const newValue = getValueFromComplexValue(control.defaultValue, {} as Record<string, any>);
    return formatNewlines(newValue);
  }, [control, isRuntimeMode, designerContext]);
}
