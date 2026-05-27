import { migrateGridToEditableGrid } from './gridMigrator';
import { COLUMN_TYPES, FIELD_TYPES } from '../constants';

describe('gridMigrator', () => {
  describe('migrateGridToEditableGrid', () => {
    test('returns null for falsy input', () => {
      expect(migrateGridToEditableGrid(null as unknown as Record<string, unknown>, 'new-id')).toBeNull();
      expect(migrateGridToEditableGrid(undefined as unknown as Record<string, unknown>, 'new-id')).toBeNull();
    });

    test('returns null for non-legacy grid', () => {
      const nonLegacyGrid = {
        Type: 'EDT',
        IsComplexType: false,
      };

      expect(migrateGridToEditableGrid(nonLegacyGrid, 'new-id')).toBeNull();
    });

    test('returns null for grid without IsComplexType', () => {
      const simpleGrid = {
        Type: 'GRD',
        IsComplexType: false,
      };

      expect(migrateGridToEditableGrid(simpleGrid, 'new-id')).toBeNull();
    });

    test('migrates basic legacy grid to editable grid', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        visible: true,
        model: {
          caption: 'Test Grid',
          viewName: 'TestView',
          columns: [],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('new-grid-id');
      expect(result?.Type).toBe('EDT');
      expect(result?.type).toBe('EDT');
      expect(result?.name).toBe('testGrid');
      expect(result?.caption).toBe('Test Grid');
      expect(result?.table).toBe('TestView');
    });

    test('converts grid columns correctly', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          caption: 'Test Grid',
          viewName: 'TestView',
          columns: [
            {
              name: 'FirstName',
              caption: 'First Name',
              fieldType: FIELD_TYPES.TEXT,
              columnType: COLUMN_TYPES.FIELD,
              isKey: false,
              format: {
                visible: true,
                width: { value: '100', type: 0 },
                alignment: 'left',
              },
            },
          ],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.columns).toHaveLength(1);
      expect(result?.columns[0].field).toBe('FirstName');
      expect(result?.columns[0].header).toBe('First Name');
      expect(result?.columns[0].fieldType).toBe(FIELD_TYPES.TEXT);
      expect(result?.columns[0].format.width).toBe('100');
    });

    test('converts expression columns to formula columns', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [
            {
              name: 'FullName',
              caption: 'Full Name',
              columnType: COLUMN_TYPES.EXPRESSION,
              fieldType: FIELD_TYPES.TEXT,
              expression: [
                {
                  source: {
                    valueType: 1,
                    value: 'FirstName',
                  },
                },
                {
                  operation: 0,
                },
                {
                  source: {
                    valueType: 2,
                    value: ' ',
                  },
                },
                {
                  operation: 0,
                },
                {
                  source: {
                    valueType: 1,
                    value: 'LastName',
                  },
                },
              ],
              format: {},
            },
          ],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.columns[0].columnType).toBe(COLUMN_TYPES.FORMULA);
      expect(result?.columns[0].fieldType).toBe(FIELD_TYPES.FORMULA);
      expect(result?.columns[0].formula).toBeTruthy();
      expect(result?.columns[0].expression).toBeNull();
    });

    test('migrates filter definitions to view list', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [],
        },
        filterDef: [
          {
            filterId: 'filter-1',
            filterName: 'Active Records',
            isHidden: false,
            isDefault: true,
            expression: [],
            sorting: [],
          },
          {
            filterId: 'filter-2',
            filterName: 'Archived Records',
            isHidden: false,
            isDefault: false,
            expression: [],
            sorting: [],
          },
        ],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.viewList).toHaveLength(2);
      expect(result?.viewList[0].id).toBe('filter-1');
      expect(result?.viewList[0].name).toBe('Active Records');
      expect(result?.viewList[0].isDefault).toBe(true);
      expect(result?.defaultViewFilter).toBe('filter-1');
    });

    test('handles visibility settings correctly', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: { columns: [] },
        filterDef: [],
        hideSearch: true,
        hideSettings: true,
        hideExport: true,
        hideMailChimp: true,
        hideGoToPage: false,
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.isSearchable).toBe(false);
      expect(result?.showShowHideColumns).toBe(false);
      expect(result?.showExport).toBe(false);
      expect(result?.showExportToMailChimp).toBe(false);
      expect(result?.showGoToPage).toBe(true);
    });

    test('handles responsive and fixed layout settings', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: { columns: [] },
        filterDef: [],
        isResponsive: true,
        isFixedLayout: true,
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.isResponsive).toBe(true);
      expect(result?.isFixedLayout).toBe(true);
    });

    test('handles missing model with default values', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result).not.toBeNull();
      expect(result?.caption).toBe('');
      expect(result?.columns).toEqual([]);
    });

    test('preserves legacy class', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: { columns: [] },
        filterDef: [],
        LegacyClass: 'custom-grid-class',
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.classes).toBe('custom-grid-class');
    });

    test('handles width as object with value property', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [
            {
              name: 'Column1',
              caption: 'Column 1',
              format: {
                width: { value: '200', type: 0 },
              },
            },
          ],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.columns[0].format.width).toBe('200');
    });

    test('converts expression column with empty strings to formula', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [
            {
              name: 'Expression1',
              caption: 'Expression1',
              columnType: COLUMN_TYPES.EXPRESSION,
              fieldType: -1,
              expression: [
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
              ],
              format: {},
            },
          ],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.columns[0].columnType).toBe(COLUMN_TYPES.FORMULA);
      expect(result?.columns[0].fieldType).toBe(FIELD_TYPES.FORMULA);
      expect(result?.columns[0].formula).toBe('@ContactName + "" + "TEST" + "" + @ContactsBalance');
      expect(result?.columns[0].expression).toBeNull();
    });

    test('handles width as string', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [
            {
              name: 'Column1',
              caption: 'Column 1',
              format: {
                width: '150',
              },
            },
          ],
        },
        filterDef: [],
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      expect(result?.columns[0].format.width).toBe('150');
    });

    test('creates default view when filterDef is null or empty', () => {
      const legacyGrid = {
        Type: 'GRD',
        IsComplexType: true,
        name: 'testGrid',
        model: {
          columns: [
            {
              name: 'RecordID',
              caption: 'Record ID',
              isKey: true,
              format: { visible: false },
            },
            {
              name: 'Expression1',
              caption: 'Expression1',
              columnType: COLUMN_TYPES.EXPRESSION,
              fieldType: -1,
              expression: [
                { Operation: null, Source: { ValueType: 3, Value: 'ContactName' } },
                { Operation: 22 },
                { Operation: null, Source: { ValueType: 9, Value: '' } },
              ],
              format: { visible: true },
            },
          ],
        },
        filterDef: null,
      };

      const result = migrateGridToEditableGrid(legacyGrid, 'new-grid-id');

      // Should create a default view
      expect(result?.viewList).toHaveLength(1);
      expect(result?.viewList[0].name).toBe('All Records');
      expect(result?.viewList[0].isDefault).toBe(true);
      expect(result?.viewList[0].id).toBeTruthy();

      // View should have column visibility info
      expect(result?.viewList[0].columns).toHaveLength(2);
      expect(result?.viewList[0].columns[0].field).toBe('RecordID');
      expect(result?.viewList[0].columns[0].visible).toBe(false);
      expect(result?.viewList[0].columns[1].field).toBe('Expression1');
      expect(result?.viewList[0].columns[1].visible).toBe(true);

      // Should have valid default view filter
      expect(result?.defaultViewFilter).toBe(result?.viewList[0].id);
      expect(result?.viewFilter).toBe(result?.viewList[0].id);
    });
  });
});
