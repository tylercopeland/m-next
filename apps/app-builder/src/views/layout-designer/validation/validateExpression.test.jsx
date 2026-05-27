import { basicOperationId } from '@m-next/types';
import validateExpression from './validateExpression';

describe('validateExpression', () => {
  test('returns valid when collection is empty', () => {
    const result = validateExpression([]);

    expect(result.isValid).toBe(true);
    expect(result.expression).toEqual([]);
  });

  test('returns invalid when first value is missing', () => {
    const collection = [
      {
        expression: [
          {
            first: { value: null },
            operation: basicOperationId.Equals,
            second: { value: 'someValue', type: 'string' },
          },
        ],
      },
    ];

    const result = validateExpression(collection);

    expect(result.isValid).toBe(false);
    expect(result.expression[0].isValid).toBe(false);
    expect(result.expression[0].first.value).toBe('Field is required.');
  });

  test('returns invalid when operation requires a second value but it is missing', () => {
    const collection = [
      {
        expression: [
          {
            first: { value: 'someField' },
            operation: basicOperationId.Equals,
            second: { value: null, type: 'string' },
          },
        ],
      },
    ];

    const result = validateExpression(collection);

    expect(result.isValid).toBe(false);
    expect(result.expression[0].isValid).toBe(false);
    expect(result.expression[0].second.type).toBe('Value is required.');
  });

  test('returns valid when operation is IsEmpty or IsNotEmpty', () => {
    const collection = [
      {
        expression: [
          {
            first: { value: 'someField' },
            operation: basicOperationId.IsEmpty,
          },
          {
            first: { value: 'anotherField' },
            operation: basicOperationId.IsNotEmpty,
          },
        ],
      },
    ];

    const result = validateExpression(collection);

    expect(result.isValid).toBe(true);
    expect(result.expression[0].isValid).toBe(true);
    expect(result.expression[1].isValid).toBe(true);
  });
});
