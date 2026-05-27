import { basicOperationId, complexValueTypes, FieldTypeNames } from '@m-next/types';

/**
 * Validates if a string is a valid number (decimal/money).
 * Allows: integers, decimals, negative numbers (e.g., 10, -5, 3.14, .5, +100.)
 * Rejects: invalid patterns like 10--, 22++, 10-5, 1.2.3, scientific notation (e, E)
 */
const isValidNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return true;
  }
  // Non-backtracking regex to prevent ReDoS vulnerabilities
  // No scientific notation allowed
  const validNumberRegex = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  return validNumberRegex.test(String(value));
};

/**
 * Validates if a string is a valid integer.
 * Allows: integers with optional sign (e.g., 123, -456, +789)
 * Rejects: decimals, scientific notation, values exceeding 10 digits
 */
const isValidInteger = (value) => {
  if (value === '' || value === null || value === undefined) {
    return true;
  }
  const validIntegerRegex = /^[+-]?\d+$/;
  if (!validIntegerRegex.test(String(value))) {
    return false;
  }
  // Enforce a maximum of 10 numeric digits to mirror the current backend integer validation.
  // The backend rejects integer inputs with more than 10 digits; if that limit changes,
  // this check must be updated to stay in sync with the server-side constraint.
  const digits = String(value).replace(/[^0-9]/g, '');
  return digits.length <= 10;
};

/**
 * Checks if field type is an integer type (Integer or Id/Record ID)
 */
const isIntegerFieldType = (fieldType) => fieldType === FieldTypeNames.Integer || fieldType === FieldTypeNames.Id;

/**
 * Checks if a numeric element has valid number values based on field type.
 */
const hasValidNumericValues = (element) => {
  if (element.second?.type !== complexValueTypes.Number) {
    return true;
  }

  const fieldType = element.first?.metadata?.type;
  const isIntegerField = isIntegerFieldType(fieldType);

  if (isIntegerField) {
    // Integer fields: validate as integer
    if (!isValidInteger(element.second?.value)) {
      return false;
    }
    if (element.third?.type === complexValueTypes.Number && !isValidInteger(element.third?.value)) {
      return false;
    }
  } else {
    // Decimal/Money fields: validate as number
    if (!isValidNumber(element.second?.value)) {
      return false;
    }
    if (element.third?.type === complexValueTypes.Number && !isValidNumber(element.third?.value)) {
      return false;
    }
  }
  return true;
};

const reformatExpression = (expression) => {
  if (!expression || expression.length === 0 || !expression[0].expression || expression[0].expression.length === 0)
    return null;
  const updated = [{ operation: basicOperationId.OpenBracket }];
  let hasInvalidFilter = false;

  expression.forEach((set, setIndex) => {
    if (setIndex > 0) {
      updated.push({ operation: expression[0].connector });
      updated.push({ operation: basicOperationId.OpenBracket });
    }
    let notEmpty = false;

    set.expression.forEach((element) => {
      // Check if this element has an invalid numeric value
      // If ANY filter has an invalid value, we should show "No results"
      if (
        element.first?.value &&
        element.second?.value !== '' &&
        element.second?.value !== null &&
        element.second?.value !== undefined &&
        !hasValidNumericValues(element)
      ) {
        hasInvalidFilter = true;
      }

      // Skip invalid elements (e.g., invalid number formats like "10--" or "22++")
      if (element.first.value && !element.invalid && hasValidNumericValues(element)) {
        if (notEmpty) {
          updated.push({ operation: set.connector });
        }
        notEmpty = true;
        updated.push({
          key: element.key,
          source: {
            Value: element.first.value,
            ValueType: element.first.type,
            Property: element.first.property,
            ChildProperty: element.first.childProperty,
          },
        });
        updated.push({ operation: element.operation, dateField: element.dateField });

        if (
          element.operation !== basicOperationId.IsEmpty &&
          element.operation !== basicOperationId.IsNotEmpty &&
          element.operation !== basicOperationId.IsTrue &&
          element.operation !== basicOperationId.IsFalse
        ) {
          updated.push({
            source: {
              Value: element.second.value,
              ValueType: element.second.type,
              Property: element.second.property,
              ChildProperty: element.second.childProperty,
            },
          });
        }
        if (element.third && element.third.type !== undefined && element.third.type !== null) {
          updated[updated.length - 1].additionalSources = [];
          updated[updated.length - 1].additionalSources.push({
            Value: element.third.value,
            ValueType: element.third.type,
            Property: element.third.property,
            ChildProperty: element.third.childProperty,
          });
        }
      }
    });

    if (setIndex > 0) {
      updated.push({ operation: basicOperationId.CloseBracket });
    }
  });
  updated.push({ operation: basicOperationId.CloseBracket });

  // If ANY filter has an invalid value, show "No results" without making an API call
  if (hasInvalidFilter) {
    return { allFiltersInvalid: true };
  }

  // If only brackets remain (no filter elements at all), return null
  if (updated.length === 2) {
    return null;
  }

  return updated;
};

export default reformatExpression;
