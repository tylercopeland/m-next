import { ValidationRuleTypes } from '@m-next/runtime-interface';
import { createGridControl, migrateGrid } from './gridControl';

describe('createGridControl', () => {
  it('should create a grid control with default values', () => {
    const control = createGridControl();
    expect(control).toMatchObject({
      isReadOnly: true,
      viewFriendlyName: null,
      columns: [],
      defaultViewFilter: null,
      viewList: [],
      showHeader: true,
      paging: { pageNumber: 1, pageSize: 25 },
      showGoToPage: false,
      showPagination: true,
      isSearchable: true,
      hideSearch: false,
      showSort: true,
      hideViewSelector: false,
      showExport: false,
      showRefresh: false,
      isSelectable: false,
      canReorderColumns: false,
      canAddMoreRows: true,
      showDeleteColumn: true,
      showDeleteConfirmation: false,
      menuItems: null,
      onActiveRowChange: null,
    });
  });

  it('should create a grid control with provided values', () => {
    const base = { id: 1, caption: 'Test Grid' };
    const data = { isReadOnly: false, showHeader: false };
    const control = createGridControl(base, data);
    expect(control).toMatchObject({
      id: 1,
      caption: 'Test Grid',
      isReadOnly: false,
      showHeader: false,
    });
  });
});

describe('migrateGrid', () => {
  const fieldList = [
    { name: 'Field1', isRequired: true, type: 'String' },
    { name: 'Field2', isRequired: false, type: 'String' },
  ];

  it('should migrate grid and add required columns', () => {
    const control = { columns: [], viewList: [{}] };
    const updatedControl = migrateGrid(control, fieldList, true);
    expect(updatedControl.columns).toHaveLength(2);
    expect(updatedControl.columns[0].field).toBe('RecordID');
    expect(updatedControl.columns[1].field).toBe('Field1');
  });

  it('should not add duplicate required columns', () => {
    const control = { columns: [{ field: 'RecordID' }], viewList: [{}] };
    const updatedControl = migrateGrid(control, fieldList, true);
    expect(updatedControl.columns).toHaveLength(2);
  });

  it('should add missing columns', () => {
    const control = { columns: [{ field: 'RecordID' }, { field: 'Field1' }], viewList: [{}] };
    const updatedControl = migrateGrid(control, fieldList, false);
    expect(updatedControl.columns).toHaveLength(2);
    expect(updatedControl.columns[0].field).toBe('RecordID');
    expect(updatedControl.columns[1].field).toBe('Field1');
  });

  it('should return null if no migration is needed', () => {
    const control = {
      version: '2.0.0',
      columns: [{ field: 'RecordID' }, { field: 'Field1' }],
      viewList: [
        {
          name: 'View 1',
          caption: 'View 1',
          columns: [{ field: 'RecordID' }, { field: 'Field1' }],
          isVisible: true,
          filtering: [],
        },
      ],
    };
    const result = migrateGrid(control, fieldList, false);
    expect(result).toBeNull();
  });

  it('unlocks locked required fields and leaves non-required unchanged', () => {
    const control = {
      columns: [
        { field: 'RecordID', isLocked: true, canDelete: false, readOnly: true },
        { field: 'Field1', isLocked: true, canDelete: true },
        { field: 'Field2', isLocked: true, canDelete: true },
      ],
      viewList: [{}],
    };

    const result = migrateGrid(control, fieldList, false);

    expect(result).not.toBeNull();
    const updated = result;
    const recordId = updated.columns.find((c) => c.field === 'RecordID');
    const field1 = updated.columns.find((c) => c.field === 'Field1');
    const field2 = updated.columns.find((c) => c.field === 'Field2');

    expect(recordId).toMatchObject({ isLocked: true, canDelete: false });
    expect(field1).toMatchObject({ isLocked: false, canDelete: false });
    expect(field2).toMatchObject({ isLocked: true, canDelete: true });
  });

  it('unlocks columns that contain a required validation rule', () => {
    const control = {
      columns: [
        {
          field: 'Field3',
          isLocked: true,
          canDelete: true,
          validationRules: [{ rule: ValidationRuleTypes.Required, value: true, canDelete: false }],
        },
      ],
      viewList: [{}],
    };

    const result = migrateGrid(control, fieldList, false);

    expect(result).not.toBeNull();
    const field3 = result.columns.find((c) => c.field === 'Field3');
    expect(field3).toMatchObject({ isLocked: false, canDelete: false });
  });
});
