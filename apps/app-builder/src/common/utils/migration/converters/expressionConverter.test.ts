import { convertExpressionToFormula, convertLegacyExpression } from './expressionConverter';
import { EXPRESSION_OPERATIONS, EXPRESSION_VALUE_TYPES } from '../constants';

describe('expressionConverter', () => {
  describe('convertExpressionToFormula', () => {
    test('returns empty string for empty expression', () => {
      expect(convertExpressionToFormula([])).toBe('');
    });

    test('converts field reference', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'FirstName',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@FirstName');
    });

    test('converts text value', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.TEXT,
            value: 'Hello World',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('"Hello World"');
    });

    test('converts number value', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 42,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('42');
    });

    test('converts boolean value (true)', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.BOOLEAN,
            value: true,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('"True"');
    });

    test('converts boolean value (false)', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.BOOLEAN,
            value: false,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('"False"');
    });

    test('converts addition operation', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'Price',
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.ADD,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 10,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@Price + 10');
    });

    test('converts subtraction operation', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 100,
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.SUBTRACT,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 50,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('100 - 50');
    });

    test('converts multiplication operation', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'Quantity',
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.MULTIPLY,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'UnitPrice',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@Quantity * @UnitPrice');
    });

    test('converts division operation', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'Total',
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.DIVIDE,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 2,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@Total / 2');
    });

    test('converts complex expression with multiple operations', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'Price',
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.MULTIPLY,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.FIELD,
            value: 'Quantity',
          },
        },
        {
          operation: EXPRESSION_OPERATIONS.ADD,
        },
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.NUMBER,
            value: 5,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@Price * @Quantity + 5');
    });

    test('preserves HTML tags in text values', () => {
      const expression = [
        {
          source: {
            valueType: EXPRESSION_VALUE_TYPES.TEXT,
            value: '<p>Hello <strong>World</strong></p>',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('"<p>Hello <strong>World</strong></p>"');
    });

    test('handles empty string values in expressions', () => {
      const expression = [
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'ContactName',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: '',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: 'TEST',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: '',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'ContactsBalance',
            Property: 'Money',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe(
        '@ContactName + "" + "TEST" + "" + @ContactsBalance'
      );
    });

    test('converts complex expression with HTML and field references', () => {
      const expression = [
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: '<div><strong>',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'Name',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: '</strong></div><div>',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'CompanyName',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: '</div><div>',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'FullName',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: ' (',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 3,
            Value: 'EntityType',
          },
        },
        {
          Operation: 22,
        },
        {
          Operation: null,
          Source: {
            ValueType: 9,
            Value: ')</div>',
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe(
        '"<div><strong>" + @Name + "</strong></div><div>" + @CompanyName + "</div><div>" + @FullName + " (" + @EntityType + ")</div>"'
      );
    });

    test('handles legacy property names (Operation and Value)', () => {
      const expression = [
        {
          Source: {
            ValueType: EXPRESSION_VALUE_TYPES.FIELD,
            Value: 'LegacyField',
          },
        },
        {
          Operation: EXPRESSION_OPERATIONS.ADD,
        },
        {
          Source: {
            ValueType: EXPRESSION_VALUE_TYPES.NUMBER,
            Value: 100,
          },
        },
      ];

      expect(convertExpressionToFormula(expression)).toBe('@LegacyField + 100');
    });
  });

  describe('convertLegacyExpression', () => {
    test('returns empty array for empty expression', () => {
      expect(convertLegacyExpression([])).toEqual([]);
    });

    test('returns empty array for non-array input', () => {
      expect(convertLegacyExpression(null as unknown as [])).toEqual([]);
    });

    test('converts START_GROUP and END_GROUP operations', () => {
      const expression = [
        {
          Operation: EXPRESSION_OPERATIONS.START_GROUP,
        },
        {
          Source: {
            Value: 'Status',
          },
        },
        {
          Operation: EXPRESSION_OPERATIONS.END_GROUP,
        },
      ];

      const result = convertLegacyExpression(expression);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        operator: 'and',
        conditions: [
          {
            field: 'Status',
            value: 'Status',
          },
        ],
      });
    });

    test('handles multiple conditions in a group', () => {
      const expression = [
        {
          Operation: EXPRESSION_OPERATIONS.START_GROUP,
        },
        {
          Source: {
            Value: 'Active',
          },
        },
        {
          Source: {
            Value: 'Approved',
          },
        },
        {
          Operation: EXPRESSION_OPERATIONS.END_GROUP,
        },
      ];

      const result = convertLegacyExpression(expression);

      expect(result).toHaveLength(1);
      expect(result[0].conditions).toHaveLength(2);
    });

    test('handles expressions without groups', () => {
      const expression = [
        {
          Source: {
            Value: 'Status',
          },
        },
      ];

      const result = convertLegacyExpression(expression);

      expect(result).toEqual([]);
    });
  });
});
