import { FieldTypeIds } from '@m-next/types';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import { createGridColumn, migrateGridColumn } from './gridColumn';

describe('createGridColumn', () => {
  it('should create a grid column with default values', () => {
    const column = createGridColumn();
    expect(column).toHaveProperty('controlId');
    expect(column.visible).toBe(true);
    expect(column.isLocked).toBe(false);
    expect(column.canDelete).toBe(true);
    expect(column.readOnly).toBe(false);
    expect(column.fieldType).toBe(FieldTypeIds.Text);
    expect(column.columnType).toBe(0);
    expect(column.format).toEqual({
      alignment: 'left',
      width: 'dynamic',
      widthFixed: null,
      widthAutoSize: 'sm',
      fontWeight: 'normal',
    });
    expect(column.validationRules).toEqual([
      {
        canDelete: false,
        rule: 6,
        value: true,
      },
    ]);
    expect(column.visibleOnMobile).toBe(false);
    expect(column.hasColumnTotal).toBe(false);
  });

  it('should create a grid column with provided values', () => {
    const data = {
      field: 'testField',
      header: 'Test Header',
      visible: false,
      isLocked: false,
      canDelete: true,
      readOnly: true,
      fieldType: FieldTypeIds.DropDown,
      columnType: 1,
      format: {
        alignment: 'right',
        width: 'lg',
        widthFixed: '100px',
        widthAutoSize: 'md',
      },
      validationRules: [
        { rule: ValidationRuleTypes.Required, value: true },
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
      visibleOnMobile: true,
      hasColumnTotal: true,
    };
    const column = createGridColumn(data);
    expect(column.field).toBe(data.field);
    expect(column.header).toBe(data.header);
    expect(column.visible).toBe(data.visible);
    expect(column.isLocked).toBe(true);
    expect(column.canDelete).toBe(data.canDelete);
    expect(column.readOnly).toBe(data.readOnly);
    expect(column.fieldType).toBe(data.fieldType);
    expect(column.columnType).toBe(data.columnType);
    expect(column.format).toEqual({
      alignment: 'right',
      fontWeight: 'normal',
      width: 'dynamic',
      widthFixed: '100px',
      widthAutoSize: 'md',
    });
    expect(column.validationRules).toEqual(data.validationRules);
    expect(column.visibleOnMobile).toBe(data.visibleOnMobile);
    expect(column.hasColumnTotal).toBe(data.hasColumnTotal);
  });

  it('should create a dropdown control if fieldType is DropDown', () => {
    const data = {
      field: 'testField',
      header: 'Test Header',
      fieldType: FieldTypeIds.DropDown,
      sourceModel: 'testModel',
      sourceField: 'testSourceField',
    };
    const column = createGridColumn(data);
    expect(column.control).toBeDefined();
    expect(column.control.model.viewName).toBe(data.sourceModel);
  });

  it('should create a button control if fieldType is Button', () => {
    const data = {
      field: 'testField',
      header: 'Test Header',
      fieldType: FieldTypeIds.Button,
    };
    const column = createGridColumn(data);
    expect(column.control).toBeDefined();
    expect(column.control.name).toBe(data.field);
    expect(column.control.caption).toBe(data.header);
  });
});

describe('migrateGridColumn', () => {
  it('should migrate a text column with default values', () => {
    const column = {
      field: 'testField',
      fieldType: FieldTypeIds.Text,
      format: { width: 'sm' },
      validationRules: [],
    };
    const field = { isRequired: true, size: 50 };
    const migratedColumn = migrateGridColumn(column, field);
    expect(migratedColumn.format.width).toBe('dynamic');
    expect(migratedColumn.format.widthAutoSize).toBe('sm');
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.MaliciousValues,
      value: true,
      canDelete: false,
    });
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.Required,
      value: true,
      canDelete: false,
    });
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.MaxLength,
      value: field.size,
      canDelete: false,
    });
  });

  it('should add default fontWeight when missing', () => {
    const column = {
      field: 'testField',
      fieldType: FieldTypeIds.Text,
      format: { width: 'dynamic', widthAutoSize: 'sm' },
      validationRules: [],
    };
    const field = { isRequired: false, size: 50 };
    const migratedColumn = migrateGridColumn(column, field);
    expect(migratedColumn.format.fontWeight).toBe('normal');
  });

  it('should preserve existing fontWeight during migration', () => {
    const column = {
      field: 'testField',
      fieldType: FieldTypeIds.Text,
      format: { width: 'dynamic', widthAutoSize: 'sm', fontWeight: 'bold' },
      validationRules: [],
    };
    const field = { isRequired: false, size: 50 };
    const migratedColumn = migrateGridColumn(column, field);
    expect(migratedColumn.format.fontWeight).toBe('bold');
  });

  it('should migrate a column with provided values', () => {
    const column = {
      field: 'testField',
      fieldType: FieldTypeIds.Text,
      format: { width: 'lg' },
      validationRules: [{ rule: ValidationRuleTypes.Required, value: true }],
    };
    const field = { isRequired: false, size: 100 };
    const migratedColumn = migrateGridColumn(column, field);
    expect(migratedColumn.format.width).toBe('dynamic');
    expect(migratedColumn.format.widthAutoSize).toBe('lg');
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.MaliciousValues,
      value: true,
      canDelete: false,
    });
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.Required,
      value: true,
    });
    expect(migratedColumn.validationRules).toContainEqual({
      rule: ValidationRuleTypes.MaxLength,
      value: field.size,
      canDelete: false,
    });
  });
});
