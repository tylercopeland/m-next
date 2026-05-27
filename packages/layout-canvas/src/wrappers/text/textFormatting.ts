import { fieldTypeNameLookup, FieldTypeNames } from '@m-next/types';

export const normalizeFieldTypeName = (
  fieldType: number | string | undefined,
  fieldName: string | undefined,
): string | undefined => {
  if (fieldType === undefined || fieldType === null) return undefined;

  if (typeof fieldType === 'number' && Number.isFinite(fieldType)) {
    return fieldTypeNameLookup(fieldType, fieldName);
  }

  if (typeof fieldType === 'string') {
    const trimmed = fieldType.trim();
    if (!trimmed) return undefined;

    const parsedNumber = Number(trimmed);
    if (!Number.isNaN(parsedNumber)) {
      return fieldTypeNameLookup(parsedNumber, fieldName);
    }

    if (trimmed.toLowerCase() === 'dropdown') return FieldTypeNames.DropDown;

    const normalized = Object.values(FieldTypeNames).find(
      (name): name is string => typeof name === 'string' && name.toLowerCase() === trimmed.toLowerCase(),
    );
    return normalized ?? trimmed;
  }

  return undefined;
};

export const formatYesNoValue = (value: unknown): string => {
  if (value && typeof value === 'object') {
    const complexValue = value as { value?: unknown; Value?: unknown };
    const nestedValue = complexValue.value ?? complexValue.Value;
    if (nestedValue !== undefined) {
      return formatYesNoValue(nestedValue);
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }

  if (typeof value === 'number') {
    return value === 1 ? 'True' : 'False';
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '1' || normalized === 'true' || normalized === 'yes') {
      return 'True';
    }
    if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === '') {
      return 'False';
    }
  }

  return 'False';
};
