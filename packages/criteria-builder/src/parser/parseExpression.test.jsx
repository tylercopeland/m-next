import { basicOperationId, complexValueTypes } from '@m-next/types';
import parseExpression from './parseExpression';
import complexExpression from '../../testing/data/expression.json';

describe('parseExpression', () => {
  it('should return an empty predicate when expression is empty', () => {
    const result = parseExpression(null);
    expect(result).toEqual([]);
  });

  it('(age > 18)', () => {
    const expression = [
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
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
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
  });

  it('(sold is true)', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.IsTrue,
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: {
              value: 'true',
              type: complexValueTypes.YesNo,
            },
          },
        ],
      },
    ]);
  });

  it('(sold is false)', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.IsFalse,
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: {
              value: 'false',
              type: complexValueTypes.YesNo,
            },
          },
        ],
      },
    ]);
  });

  it('(name is empty)', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.IsEmpty,
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.IsEmpty,
            second: {},
          },
        ],
      },
    ]);
  });

  it('(name is not empty)', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.IsNotEmpty,
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.IsNotEmpty,
            second: {},
          },
        ],
      },
    ]);
  });

  it('(name is "")', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.Is,
      },
      {
        source: {
          Value: null,
          ValueType: complexValueTypes.Text,
        },
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.IsEmpty,
            second: {
              value: null,
              type: complexValueTypes.Text,
            },
          },
        ],
      },
    ]);
  });

  it('(name is not "")', () => {
    const expression = [
      {
        operation: basicOperationId.OpenBracket,
      },
      {
        source: {
          Value: 'Sold',
          ValueType: complexValueTypes.Field,
        },
      },
      {
        operation: basicOperationId.IsNot,
      },
      {
        source: {
          Value: '',
          ValueType: complexValueTypes.Text,
        },
      },
      {
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'Sold',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.IsNotEmpty,
            second: {
              value: '',
              type: complexValueTypes.Text,
            },
          },
        ],
      },
    ]);
  });

  it('((age > 18 && gender === "male") || (age < 30 && gender === "female"))', () => {
    const expression = [
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
        operation: basicOperationId.CloseBracket,
      },

      {
        operation: basicOperationId.Or,
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
    ];
    const result = parseExpression(expression);

    expect(result).toEqual([
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
  });

  it('((age > 18 || gender === "male"))', () => {
    const expression = [
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
        operation: basicOperationId.Or,
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
        operation: basicOperationId.CloseBracket,
      },
    ];
    const result = parseExpression(expression);

    expect(result).toEqual([
      {
        connector: basicOperationId.Or,
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
    ]);
  });

  it('(age between 18 and 30)', () => {
    const expression = [
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
    ];
    const result = parseExpression(expression);
    expect(result).toEqual([
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
  });

  it('Complex expression', () => {
    const result = parseExpression(complexExpression);
    expect(result).toEqual([
      {
        connector: 2,
        expression: [
          {
            first: {
              value: 'ActualCompletedDate',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 7,
            second: {
              value: '2023-02-01T18:00',
              type: 11,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
          {
            first: {
              value: 'ActualDuration',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 5,
            second: {
              value: 60,
              type: 10,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
          {
            first: {
              value: 'Comments',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 12,
            second: {
              value: 'gggg',
              type: 9,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
          {
            first: {
              value: 'FollowUpFromActivityNo',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 6,
            second: {
              value: 4,
              type: 10,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
          {
            first: {
              value: 'IsAllDayAppointment',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 4,
            second: {
              value: 'true',
              type: 12,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
        ],
      },
      {
        connector: 2,
        expression: [
          {
            first: {
              value: 'SaaSphaltMarkupDollars',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 8,
            second: {
              value: '1001',
              type: 10,
              property: null,
              childProperty: null,
            },
            dateField: null,
          },
          {
            first: {
              value: 'ContactsAssignedTo',
              type: 3,
              property: null,
              childProperty: null,
            },
            operation: 11,
            second: {},
            dateField: null,
          },
        ],
      },
    ]);
  });
});
