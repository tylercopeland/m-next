/**
 * Tests for unsaved changes helper functions
 */
import { hasUnsavedChanges, simpleExpressionsAreEqual, isExpressionEmpty } from './unsaved-changes-helpers';

describe('unsavedChangesHelpers', () => {
  describe('isExpressionEmpty', () => {
    test('should return true for null/undefined expressions', () => {
      expect(isExpressionEmpty(null)).toBe(true);
      expect(isExpressionEmpty(undefined)).toBe(true);
      expect(isExpressionEmpty([])).toBe(true);
    });

    test('should return false for expressions with valid operations', () => {
      const expr = [{ operation: 'equals' }];
      expect(isExpressionEmpty(expr)).toBe(false);
    });

    test('should return false for expressions with valid source values', () => {
      const expr = [{ source: { Value: 'test' } }];
      expect(isExpressionEmpty(expr)).toBe(false);
    });
  });

  describe('simpleExpressionsAreEqual', () => {
    test('should return true for two empty expressions', () => {
      expect(simpleExpressionsAreEqual([], [])).toBe(true);
      expect(simpleExpressionsAreEqual(null, undefined)).toBe(true);
    });

    test('should handle Standard view type special case', () => {
      const expr1 = [];
      const expr2 = [{ operation: 'equals' }];
      expect(simpleExpressionsAreEqual(expr1, expr2, 'Standard')).toBe(true);
    });

    test('should return false for expressions with different lengths', () => {
      const expr1 = [{ operation: 'equals' }];
      const expr2 = [{ operation: 'equals' }, { operation: 'contains' }];
      expect(simpleExpressionsAreEqual(expr1, expr2)).toBe(false);
    });
  });

  describe('hasUnsavedChanges', () => {
    test('should return false when simple expressions are equal', () => {
      const current = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      const saved = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      expect(hasUnsavedChanges(current, [], saved, [], 'Custom')).toBe(false);
    });

    test('should return true when simple expressions differ', () => {
      const current = [{ operation: 'equals', source: { Value: 'test1', ValueType: 'string' } }];
      const saved = [{ operation: 'contains', source: { Value: 'test2', ValueType: 'string' } }];
      expect(hasUnsavedChanges(current, [], saved, [], 'Custom')).toBe(true);
    });

    test('should check both simple and advanced expressions for Standard view type', () => {
      const currentSimple = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      const savedSimple = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      const currentAdvanced = [{ operation: 'contains', source: { Value: 'different', ValueType: 'string' } }];
      const savedAdvanced = [{ operation: 'different', source: { Value: 'another', ValueType: 'string' } }];

      expect(hasUnsavedChanges(currentSimple, currentAdvanced, savedSimple, savedAdvanced, 'Standard')).toBe(true);
    });

    test('should check both simple and advanced expressions for non-Standard views', () => {
      const currentSimple = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      const savedSimple = [{ operation: 'equals', source: { Value: 'test', ValueType: 'string' } }];
      const currentAdvanced = [{ operation: 'contains', source: { Value: 'different', ValueType: 'string' } }];
      const savedAdvanced = [{ operation: 'different', source: { Value: 'another', ValueType: 'string' } }];

      expect(hasUnsavedChanges(currentSimple, currentAdvanced, savedSimple, savedAdvanced, 'Custom')).toBe(true);
    });
  });
});
