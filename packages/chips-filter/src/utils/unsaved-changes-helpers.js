/**
 * Helper functions for detecting unsaved changes in ChipsFilter expressions
 */

// Helper function to check if an expression is effectively empty
export const isExpressionEmpty = (expr) => {
  if (!expr || !Array.isArray(expr) || expr.length === 0) return true;

  const validItems = expr.filter(
    (item) => (item?.operation !== null && item?.operation !== undefined) || item?.source?.Value,
  );

  return validItems.length === 0;
};

// Helper function to filter valid items from an expression
export const getValidItems = (expr) => {
  if (!Array.isArray(expr)) return [];
  return expr.filter((item) => (item?.operation !== null && item?.operation !== undefined) || item?.source?.Value);
};

// Helper function to compare two expression items
export const areItemsEqual = (item1, item2) =>
  (!item1.source && !item2.source && item1.operation === item2.operation) ||
  (item1.source?.Value === item2.source?.Value && item1.source?.ValueType === item2.source?.ValueType);

// Helper function to handle Standard view special case
export const handleStandardViewCase = (expr1IsEmpty, expr2IsEmpty, viewTypeToCheck) => {
  if (viewTypeToCheck === 'Standard' && !expr2IsEmpty && expr1IsEmpty) {
    return true; // Users can't save changes to standard views
  }
  return false;
};

// Helper function to handle null/empty array comparisons
export const areExpressionsNullOrEmpty = (expr1, expr2) => {
  const isExpr1Empty = !expr1 || (Array.isArray(expr1) && expr1.length === 0);
  const isExpr2Empty = !expr2 || (Array.isArray(expr2) && expr2.length === 0);

  if (isExpr1Empty && isExpr2Empty) return { equal: true, shouldContinue: false };
  if (isExpr1Empty || isExpr2Empty) return { equal: false, shouldContinue: false };

  return { equal: false, shouldContinue: true };
};

// Helper function to compare source values
export const areSourcesEqual = (source1, source2) => {
  if (!source1 && !source2) return true;
  if (!source1 || !source2) return false;

  return source1.Value === source2.Value && source1.ValueType === source2.ValueType;
};

// Helper function to compare advanced expression items
export const areAdvancedItemsEqual = (item1, item2) => {
  if (!item1 && !item2) return true;
  if (!item1 || !item2) return false;

  const op1 = item1.operation;
  const op2 = item2.operation;
  const source1 = item1.source;
  const source2 = item2.source;

  // If both have no source, compare operations
  if (!source1 && !source2) {
    return op1 === op2;
  }

  // If only one has source, they're different (unless operations match and no source)
  if (!source1 || !source2) {
    return false;
  }

  // Compare source values
  return areSourcesEqual(source1, source2);
};

/**
 * Compare two simple expressions for equality
 * @param {Array} expr1 - First expression array
 * @param {Array} expr2 - Second expression array
 * @param {string|null} viewTypeToCheck - View type for special handling
 * @returns {boolean} - True if expressions are equal
 */
export const simpleExpressionsAreEqual = (expr1, expr2, viewTypeToCheck = null) => {
  const expr1IsEmpty = isExpressionEmpty(expr1);
  const expr2IsEmpty = isExpressionEmpty(expr2);

  // If both are empty, they are equal
  if (expr1IsEmpty && expr2IsEmpty) {
    return true;
  }

  // If one is empty and the other is not
  if (expr1IsEmpty !== expr2IsEmpty) {
    return handleStandardViewCase(expr1IsEmpty, expr2IsEmpty, viewTypeToCheck);
  }

  // Both have data, compare them
  if (!Array.isArray(expr1) || !Array.isArray(expr2)) return false;
  if (expr1.length !== expr2.length) return false;

  const validExpr1 = getValidItems(expr1);
  const validExpr2 = getValidItems(expr2);

  if (validExpr1.length !== validExpr2.length) return false;

  return validExpr1.every((item1, idx) => areItemsEqual(item1, validExpr2[idx]));
};

/**
 * Compare two advanced expressions for equality
 * @param {Array} expr1 - First advanced expression array
 * @param {Array} expr2 - Second advanced expression array
 * @returns {boolean} - True if expressions are equal
 */
export const advancedExpressionsAreEqual = (expr1, expr2) => {
  // Handle null/undefined vs empty array cases
  const { equal, shouldContinue } = areExpressionsNullOrEmpty(expr1, expr2);
  if (!shouldContinue) return equal;

  // Basic array validation
  if (!Array.isArray(expr1) || !Array.isArray(expr2)) return false;
  if (expr1.length !== expr2.length) return false;

  // Compare each item in the arrays
  return expr1.every((item1, idx) => areAdvancedItemsEqual(item1, expr2[idx]));
};

/**
 * Check if there are unsaved changes between current and saved expressions
 * @param {Array} currentSimple - Current simple expression
 * @param {Array} currentAdvanced - Current advanced expression
 * @param {Array} savedSimple - Saved simple expression
 * @param {Array} savedAdvanced - Saved advanced expression
 * @param {string} viewType - Current view type
 * @returns {boolean} - True if there are unsaved changes
 */
export const hasUnsavedChanges = (currentSimple, currentAdvanced, savedSimple, savedAdvanced, viewType) => {
  // Use the comparison functions that handle empty checking and viewType logic
  const simpleHasChanges = !simpleExpressionsAreEqual(currentSimple, savedSimple, viewType);

  // Check both simple and advanced expressions
  return simpleHasChanges || !advancedExpressionsAreEqual(currentAdvanced, savedAdvanced);
};
