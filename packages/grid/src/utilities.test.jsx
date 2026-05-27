import { FieldTypeIds } from '@m-next/types';
import { getColumnWidth, formatCellValue, getErrorMessage } from './utilities';

describe('utilities', () => {
  describe('getColumnWidth', () => {
    it('should return correct width for small column', () => {
      const column = { width: 'sm', fieldType: FieldTypeIds.DateTime, name: 'Test' };
      const result = getColumnWidth(column, 10, 100);
      expect(result).toEqual({ minWidth: 10 });
    });

    it('should return correct width for medium column', () => {
      const column = { width: 'md', fieldType: FieldTypeIds.DateTime, name: 'Test' };
      const result = getColumnWidth(column, 10, 100);
      expect(result).toEqual({ minWidth: 20 });
    });

    it('should return correct width for large column', () => {
      const column = { width: 'lg', fieldType: FieldTypeIds.DateTime, name: 'Test' };
      const result = getColumnWidth(column, 10, 100);
      expect(result).toEqual({ minWidth: 40 });
    });

    it('should return correct width for fixed column', () => {
      const column = { width: 'fixed', widthFixed: 50 };
      const result = getColumnWidth(column);
      expect(result).toEqual({ minWidth: '50px', width: '50px' });
    });
  });

  describe('formatCellValue', () => {
    it('should format Money value correctly', () => {
      const column = { fieldType: FieldTypeIds.Money, formatType: { type: 'Money', rounding: 2, separator: 'Yes' } };
      const value = 1234.56;
      const result = formatCellValue(column, value, false, {});
      expect(result).toBe('1,234.56');
    });
  });

  describe('getErrorMessage', () => {
    it('should return "Required" for "field is required." error', () => {
      const error = 'field is required.';
      const result = getErrorMessage(error);
      expect(result).toBe('Required');
    });

    it('should return the original error message for other errors', () => {
      const error = 'some other error';
      const result = getErrorMessage(error);
      expect(result).toBe('some other error');
    });
  });
});
