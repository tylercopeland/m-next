import { createBaseColumn, ColumnTypes, type BaseColumnData } from './baseColumn';
import { FieldTypeIds } from '../types/fieldTypes';

describe('baseColumn', () => {
  describe('ColumnTypes', () => {
    it('should have correct values', () => {
      expect(ColumnTypes.Data).toBe(0);
      expect(ColumnTypes.Link).toBe(1);
      expect(ColumnTypes.Expression).toBe(2);
      expect(ColumnTypes.Button).toBe(3);
      expect(ColumnTypes.CardColumn).toBe(4);
      expect(ColumnTypes.Complex).toBe(5);
      expect(ColumnTypes.Formula).toBe(6);
    });
  });

  describe('createBaseColumn', () => {
    it('should create column with default values when no data provided', () => {
      const column = createBaseColumn();

      expect(column.caption).toBe('');
      expect(column.name).toBe('');
      expect(column.width).toBe(0);
      expect(column.format.visible).toBe(true);
      expect(column.format.visibleMobile).toBe(true);
      expect(column.isKey).toBe(false);
      expect(column.columnType).toBe(ColumnTypes.Data);
      expect(column.fieldType).toBe(FieldTypeIds.Text);
      expect(column.hasSubtotal).toBe(false);
      expect(column.isLinked).toBe(false);
      expect(column.tableNameRef).toBe(null);
      expect(column.isRequired).toBe(false);
      expect(column.isUnique).toBe(false);
      expect(column.size).toBe(0);
      expect(column.showHeader).toBe(true);
    });

    it('should create column with provided values', () => {
      const data: BaseColumnData = {
        caption: 'Test Caption',
        name: 'testName',
        width: 100,
        format: {
          visible: false,
          visibleMobile: false,
        },
        isKey: true,
        columnType: ColumnTypes.Link,
        fieldType: FieldTypeIds.Integer,
        hasSubtotal: true,
        isLinked: true,
        tableNameRef: 'testTable',
        isRequired: true,
        isUnique: true,
        size: 50,
        showHeader: false,
      };

      const column = createBaseColumn(data);

      expect(column.caption).toBe('Test Caption');
      expect(column.name).toBe('testName');
      expect(column.width).toBe(100);
      expect(column.format.visible).toBe(false);
      expect(column.format.visibleMobile).toBe(false);
      expect(column.isKey).toBe(true);
      expect(column.columnType).toBe(ColumnTypes.Link);
      expect(column.fieldType).toBe(FieldTypeIds.Integer);
      expect(column.hasSubtotal).toBe(true);
      expect(column.isLinked).toBe(true);
      expect(column.tableNameRef).toBe('testTable');
      expect(column.isRequired).toBe(true);
      expect(column.isUnique).toBe(true);
      expect(column.size).toBe(50);
      expect(column.showHeader).toBe(false);
    });

    it('should handle partial format data', () => {
      const data: BaseColumnData = {
        format: {
          visible: false,
        },
      };

      const column = createBaseColumn(data);

      expect(column.format.visible).toBe(false);
      expect(column.format.visibleMobile).toBe(true);
    });

    it('should handle null tableNameRef', () => {
      const data: BaseColumnData = {
        tableNameRef: null,
      };

      const column = createBaseColumn(data);

      expect(column.tableNameRef).toBe(null);
    });

    it('should use default when showHeader is undefined', () => {
      const data: BaseColumnData = {};

      const column = createBaseColumn(data);

      expect(column.showHeader).toBe(true);
    });

    it('should preserve false value for showHeader', () => {
      const data: BaseColumnData = {
        showHeader: false,
      };

      const column = createBaseColumn(data);

      expect(column.showHeader).toBe(false);
    });
  });
});
