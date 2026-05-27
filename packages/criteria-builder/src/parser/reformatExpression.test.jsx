import { basicOperationId, complexValueTypes, FieldTypeNames } from '@m-next/types';
import reformatExpression from './reformatExpression';

describe('reformatExpression', () => {
  it('should return an empty predicate when expression is empty', () => {
    const result = reformatExpression([]);
    expect(result).toEqual(null);
  });

  it('(age > 18)', () => {
    const result = reformatExpression([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Age',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Greater,
            second: {
              value: 18,
              type: complexValueTypes.Number,
            },
          },
        ],
      },
    ]);
    expect(result).toEqual([
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Age',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Greater,
      },
      {
        source: {
          Value: 18,
          ValueType: complexValueTypes.Number,
        },
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ]);
  });

  it('((age > 18 && gender === "male") || (age < 30 && gender === "female"))', () => {
    const result = reformatExpression([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Age',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Greater,
            second: {
              value: 18,
              type: complexValueTypes.Number,
            },
          },
          {
            first: {
              value: 'Gender',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: {
              value: 'male',
              type: complexValueTypes.Text,
            },
          },
        ],
      },
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Age',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Less,
            second: {
              value: 30,
              type: complexValueTypes.Number,
            },
          },
          {
            first: {
              value: 'Gender',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: {
              value: 'female',
              type: complexValueTypes.Text,
            },
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Age',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Greater,
      },
      {
        source: {
          Value: 18,
          ValueType: complexValueTypes.Number,
        },
      },
      {
        operation: basicOperationId.And,
      },
      {
        source: {
          Value: 'Gender',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Is,
      },
      {
        source: {
          Value: 'male',
          ValueType: complexValueTypes.Text,
        },
      },
      {
        operation: basicOperationId.And,
      },

      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Age',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Less,
      },
      {
        source: {
          Value: 30,
          ValueType: complexValueTypes.Number,
        },
      },
      {
        operation: basicOperationId.And,
      },
      {
        source: {
          Value: 'Gender',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Is,
      },
      {
        source: {
          Value: 'female',
          ValueType: complexValueTypes.Text,
        },
      },
      {
        operation: basicOperationId.CloseBracket,
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ]);
  });

  it('(age between 18 and 30)', () => {
    const result = reformatExpression([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Age',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Between,
            second: {
              value: 18,
              type: complexValueTypes.Number,
            },
            third: {
              value: 30,
              type: complexValueTypes.Number,
            },
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Age',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Between,
      },
      {
        source: {
          Value: 18,
          ValueType: complexValueTypes.Number,
        },
        additionalSources: [
          {
            Value: 30,
            ValueType: complexValueTypes.Number,
          },
        ],
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ]);
  });
  it('(gender = female and  age between 18 and 30)', () => {
    const result = reformatExpression([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Gender',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: {
              value: 'female',
              type: complexValueTypes.Text,
            },
          },
          {
            first: {
              value: 'Age',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Between,
            second: {
              value: 18,
              type: complexValueTypes.Number,
            },
            third: {
              value: 30,
              type: complexValueTypes.Number,
            },
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Gender',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Is,
      },
      {
        source: {
          Value: 'female',
          ValueType: complexValueTypes.Text,
        },
      },

      {
        operation: basicOperationId.And,
      },

      {
        source: {
          Value: 'Age',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Between,
      },
      {
        source: {
          Value: 18,
          ValueType: complexValueTypes.Number,
        },

        additionalSources: [
          {
            Value: 30,
            ValueType: complexValueTypes.Number,
          },
        ],
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ]);
  });

  describe('numeric validation', () => {
    it('should return allFiltersInvalid for invalid number format like "10--"', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Balance',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Decimal },
              },
              operation: basicOperationId.Is,
              second: {
                value: '10--',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid for "e" or "eee" in numeric field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Balance',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Decimal },
              },
              operation: basicOperationId.Is,
              second: {
                value: 'eee',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid for decimal value in Integer field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '2.5',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid for decimal value in Id field (Record ID)', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'RecordID',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Id },
              },
              operation: basicOperationId.Is,
              second: {
                value: '2.5',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid for integer value exceeding 10 digits', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'RecordID',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '12345678901',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should allow integer value with exactly 10 digits (boundary)', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'RecordID',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '1234567890',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).not.toEqual({ allFiltersInvalid: true });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should allow valid integer value for Integer field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '123',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).not.toEqual({ allFiltersInvalid: true });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should allow decimal value for Decimal field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Balance',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Decimal },
              },
              operation: basicOperationId.Is,
              second: {
                value: '123.45',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).not.toEqual({ allFiltersInvalid: true });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should allow decimal value for Money field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Price',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Money },
              },
              operation: basicOperationId.Is,
              second: {
                value: '99.99',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).not.toEqual({ allFiltersInvalid: true });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should allow negative integer for Integer field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '-456',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).not.toEqual({ allFiltersInvalid: true });
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return allFiltersInvalid for negative integer exceeding 10 digits', () => {
      // Verifies the sign doesn't count toward the 10-digit limit
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Is,
              second: {
                value: '-12345678901',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid for Between operation with decimal values in Integer field', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Between,
              second: {
                value: '2.5',
                type: complexValueTypes.Number,
              },
              third: {
                value: '5.5',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });

    it('should return allFiltersInvalid when only third value is invalid in Between operation', () => {
      const result = reformatExpression([
        {
          connector: basicOperationId.And,
          expression: [
            {
              first: {
                value: 'Count',
                type: complexValueTypes.Field,
                metadata: { type: FieldTypeNames.Integer },
              },
              operation: basicOperationId.Between,
              second: {
                value: '10',
                type: complexValueTypes.Number,
              },
              third: {
                value: '20.5',
                type: complexValueTypes.Number,
              },
            },
          ],
        },
      ]);
      expect(result).toEqual({ allFiltersInvalid: true });
    });
  });
});
