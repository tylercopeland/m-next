import { BasePagingInput, createBasePaging } from './basePaging';

describe('BasePaging', () => {
  describe('createBasePaging', () => {
    it('should create BasePaging with default values when no input provided', () => {
      const result = createBasePaging();

      expect(result).toEqual({
        pageNumber: 1,
        pageSize: 10,
      });
    });

    it('should create BasePaging with default values when empty object provided', () => {
      const result = createBasePaging({});

      expect(result).toEqual({
        pageNumber: 1,
        pageSize: 10,
      });
    });

    it('should use provided pageNumber and default pageSize', () => {
      const input: BasePagingInput = { pageNumber: 5 };
      const result = createBasePaging(input);

      expect(result).toEqual({
        pageNumber: 5,
        pageSize: 10,
      });
    });

    it('should use default pageNumber and provided pageSize', () => {
      const input: BasePagingInput = { pageSize: 25 };
      const result = createBasePaging(input);

      expect(result).toEqual({
        pageNumber: 1,
        pageSize: 25,
      });
    });

    it('should use both provided pageNumber and pageSize', () => {
      const input: BasePagingInput = { pageNumber: 3, pageSize: 50 };
      const result = createBasePaging(input);

      expect(result).toEqual({
        pageNumber: 3,
        pageSize: 50,
      });
    });

    it('should use default values when falsy values provided', () => {
      const input: BasePagingInput = { pageNumber: 0, pageSize: 0 };
      const result = createBasePaging(input);

      expect(result).toEqual({
        pageNumber: 1,
        pageSize: 10,
      });
    });
  });
});
