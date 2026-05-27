import { createBaseFilter, BaseFilterInput, FilterExpression, SortExpression } from './baseFilter';
import { Guid } from '@m-next/utilities';

// Mock the Guid.create function
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: jest.fn(() => 'mock-guid-id'),
  },
}));

describe('createBaseFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a filter with default values when no input provided', () => {
    const result = createBaseFilter();

    expect(result).toEqual({
      filterId: 'mock-guid-id',
      filterName: 'Filter',
      expression: [],
      isDefault: true,
      sorting: [],
      viewName: null,
    });
    expect(Guid.create).toHaveBeenCalledTimes(1);
  });

  it('should create a filter with provided values', () => {
    const input: BaseFilterInput = {
      filterId: 'custom-id',
      filterName: 'Custom Filter',
      expression: [{ field: 'name', operator: 'eq', value: 'test' }],
      isDefault: false,
      sorting: [{ field: 'date', direction: 'DESC' }],
      viewName: 'testView',
    };

    const result = createBaseFilter(input);

    expect(result).toEqual(input);
    expect(Guid.create).not.toHaveBeenCalled();
  });

  it('should use default values for undefined properties', () => {
    const input: BaseFilterInput = {
      filterName: 'Partial Filter',
    };

    const result = createBaseFilter(input);

    expect(result).toEqual({
      filterId: 'mock-guid-id',
      filterName: 'Partial Filter',
      expression: [],
      isDefault: true,
      sorting: [],
      viewName: null,
    });
  });

  it('should handle isDefault false explicitly', () => {
    const input: BaseFilterInput = {
      isDefault: false,
    };

    const result = createBaseFilter(input);

    expect(result.isDefault).toBe(false);
  });

  it('should handle complex filter expressions', () => {
    const expression: FilterExpression[] = [
      { field: 'status', operator: 'eq', value: 'active', logicalOperator: 'AND' },
      { field: 'count', operator: 'gt', value: 10 },
    ];

    const result = createBaseFilter({ expression });

    expect(result.expression).toEqual(expression);
  });

  it('should handle multiple sort expressions', () => {
    const sorting: SortExpression[] = [
      { field: 'name', direction: 'ASC' },
      { field: 'date', direction: 'DESC' },
    ];

    const result = createBaseFilter({ sorting });

    expect(result.sorting).toEqual(sorting);
  });
});
