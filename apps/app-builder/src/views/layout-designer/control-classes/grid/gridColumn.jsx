import { FieldTypeIds, fieldTypeNameLookup, widgets } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { ColumnTypes } from '@m-next/grid';
import { createBaseColumn, ValidationRuleTypes } from '@m-next/runtime-interface';

import createDropdownControl from '../dropdownControl';
import createButtonControl from '../buttonControl';
import createCardControl from '../cardControl';

const migrateTextColumn = (column, field, migratedIn) => {
  let migrated = migratedIn;
  const col = { ...column, format: { ...column.format }, validationRules: [...column.validationRules] };
  if (col.format.width === 'sm' || col.format.width === 'md' || col.format.width === 'lg' || !col.format.width) {
    col.format.widthAutoSize = col.format.width || 'sm';
    col.format.width = 'dynamic';
    migrated = true;
  }

  if (col.format.width === 'dynamic' && !col.format.widthAutoSize) {
    col.format.widthAutoSize = 'sm';
    migrated = true;
  }

  if (!col.validationRules.find((x) => x.rule === ValidationRuleTypes.MaxLength) && field?.size) {
    col.validationRules.push({ rule: ValidationRuleTypes.MaxLength, value: field.size, canDelete: false });
    migrated = true;
  }
  return migrated ? col : null;
};

const migrateNumericColumn = (column, migratedIn) => {
  let migrated = migratedIn;
  const col = { ...column, format: { ...column.format }, validationRules: [...column.validationRules] };
  if (col.format.width === 'sm' || col.format.width === 'md' || col.format.width === 'lg' || !col.format.width) {
    col.format.width = 'dynamic';
    migrated = true;
  }

  if (
    column.fieldType === FieldTypeIds.Decimal &&
    (column.format.rounding === undefined || column.format.rounding === null)
  ) {
    col.format.rounding = 2;
    migrated = true;
  }

  return migrated ? col : null;
};

const dateFormattingOptions = [
  { value: null, label: 'None' },
  { value: 0, label: 'Short Date' },
  { value: 1, label: 'Short Date and Time' },
  { value: 4, label: 'Long Date' },
  { value: 2, label: 'Long Date and Time' },
  { value: 3, label: 'Time' },
  { value: 5, label: 'Hour' },
  { value: 6, label: 'Day' },
  { value: 7, label: 'Day of Week' },
  { value: 8, label: 'Month' },
  { value: 9, label: 'Month and Year' },
  { value: 10, label: 'Year' },
];

// Map from labels to values for easy lookup
const dateformattingOptionsLabelMap = dateFormattingOptions.reduce((acc, option) => {
  acc[option.label] = option.value;
  return acc;
}, {});

const migrateCardColumn = (column, migratedIn) => {
  let migrated = migratedIn;
  const col = { ...column, format: { ...column.format }, control: { ...column.control } };
  if (col.format.type === 'structured') return migrated ? col : null;

  if (col.format.width === 'sm' || col.format.width === 'md' || col.format.width === 'lg' || !col.format.width) {
    col.format.widthAutoSize = col.format.width || 'sm';
    col.format.width = 'dynamic';
    migrated = true;
  }
  if (column.control === null) {
    col.control = createCardControl({ id: column.controlId });
  }

  col.control.type = widgets.CARD;

  if (col.cardColumnFields.length > 0) {
    if (col.format.type === 'avatar-1-col' || col.format.type === 'no-avatar-1-col') {
      for (let i = 0; i < col.cardColumnFields.length; i++) {
        if (i === 3) {
          col.control.avatar = col.cardColumnFields[i].value;
        } else {
          let dateType =
            col.cardColumnFields[i].fldTypeId === FieldTypeIds.DateTime
              ? col.cardColumnFields[i].format.dateType
              : null;
          if (dateType !== undefined && dateType !== null) {
            dateType = dateformattingOptionsLabelMap[dateType];
          }
          col.control[`field${i + 1}`] = {
            name: col.cardColumnFields[i].value,
            caption: col.cardColumnFields[i].label,
            type: fieldTypeNameLookup(col.cardColumnFields[i].fldTypeId),
            displayOptions: {
              decimalRounding:
                col.cardColumnFields[i].fldTypeId === FieldTypeIds.Decimal
                  ? col.cardColumnFields[i].format.rounding
                  : null,
              dateFormat: dateType,
            },
          };
        }
      }
    }

    if (col.format.type === 'avatar-2-cols' || col.format.type === 'no-avatar-2-cols') {
      for (let i = 0; i < col.cardColumnFields.length; i++) {
        if (i === 6) {
          col.control.avatar = col.cardColumnFields[i].value;
        } else {
          let dateType =
            col.cardColumnFields[i].fldTypeId === FieldTypeIds.DateTime
              ? col.cardColumnFields[i].format.dateType
              : null;
          if (dateType !== undefined && dateType !== null) {
            dateType = dateformattingOptionsLabelMap[dateType];
          }

          col.control[`field${i + 1}`] = {
            name: col.cardColumnFields[i].value,
            caption: col.cardColumnFields[i].label,
            type: fieldTypeNameLookup(col.cardColumnFields[i].fldTypeId),
            displayOptions: {
              decimalRounding:
                col.cardColumnFields[i].fldTypeId === FieldTypeIds.Decimal
                  ? col.cardColumnFields[i].format.rounding
                  : null,
              dateFormat: dateType,
            },
          };
        }
      }
    }
  }

  if (!col.control.avatar || !col.control.avatar.name) col.control.avatar = null;
  if (!col.control.field1 || !col.control.field1.name) col.control.field1 = null;
  if (!col.control.field2 || !col.control.field2.name) col.control.field2 = null;
  if (!col.control.field3 || !col.control.field3.name) col.control.field3 = null;
  if (!col.control.field4 || !col.control.field4.name) col.control.field4 = null;
  if (!col.control.field5 || !col.control.field5.name) col.control.field5 = null;
  if (!col.control.field6 || !col.control.field6.name) col.control.field6 = null;

  col.format.type = 'structured';

  return col;
};

const migrateTextColor = (txtColor, bgColor) => {
  if (txtColor === null || txtColor === '') {
    switch (bgColor) {
      case 'button-primary':
      case 'button-grey':
      case 'button-navigation':
      case 'button-caution':
      case 'button-success':
      case 'button-gunmetal':
      case 'button-black':
      case 'button-alert':
        return 'white';
      case 'button-silver':
        return 'black';
      case 'button-secondary':
      case 'button-transparent':
      case 'button-pink':
      case 'button-purple':
      case 'button-aqua':
      case 'button-yellow':
      case 'button-white':
      default:
        return 'blue';
    }
  }

  switch (txtColor) {
    case 'mi-color-alert':
      return 'red';
    case 'mi-color-primary':
      return 'blue';
    case 'mi-color-navigation':
      return 'blue-darker';
    case 'mi-color-caution':
      return 'yellow';
    case 'mi-color-success':
      return 'green';
    case 'mi-color-pink':
      return 'fuchsia';
    case 'mi-color-purple':
      return 'purple';
    case 'mi-color-aqua':
      return 'teal';
    case 'mi-color-yellow':
      return 'yellow';
    case 'mi-color-grey':
      return 'grey-light';
    case 'mi-color-gunmetal':
      return 'grey-darker';
    case 'mi-color-silver':
      return 'grey-light';
    case 'mi-color-black':
      return 'black';
    case 'mi-color-white':
      return 'white';
    default:
      return txtColor;
  }
};

const migrateButtonBackground = (bgColor) => {
  switch (bgColor) {
    case 'button-alert':
      return 'red';
    case 'button-primary':
      return 'blue';
    case 'button-grey':
    case 'button-navigation':
      return 'grey';
    case 'button-caution':
      return 'orange';
    case 'button-success':
      return 'green';
    case 'button-pink':
      return 'fuchsia';
    case 'button-purple':
      return 'purple';
    case 'button-aqua':
      return 'teal';
    case 'button-yellow':
      return 'yellow';
    case 'button-gunmetal':
      return 'grey-darker';
    case 'button-silver':
      return 'grey-lighter';
    case 'button-black':
      return 'black';
    case 'button-secondary':
    case 'button-white':
    case 'button-transparent':
      return 'white';
    default:
      return bgColor;
  }
};

export const migrateGridColumn = (column, field) => {
  let migrated = false;
  const required = field?.isRequired;
  const isRecordID = column.field === 'RecordID';
  const col = {
    ...column,
    canDelete: !(required || isRecordID),
    isLocked: column.isLocked,
    readOnly: column.readOnly || column.columnType !== ColumnTypes.Data || isRecordID,
    sourceField: field?.sourceField || null,
    sourceModel: field?.sourceModel || null,
    displayOptions: column.displayOptions || {},
  };

  if (!col.isLocked && (column.columnType === ColumnTypes.Link || isRecordID)) {
    col.isLocked = true;
    col.readOnly = true;
    migrated = true;
  }

  if (!col.format) {
    col.format = {
      width: 'dynamic',
      widthFixed: null,
      widthAutoSize: 'sm',
      visible: true,
      visibleMobile: true,
    };
    migrated = true;
  }

  if (col.format && !col.format.fontWeight) {
    col.format = { ...col.format, fontWeight: 'normal' };
    migrated = true;
  }

  if (col.showHeader === undefined || col.showHeader === null) {
    col.showHeader = col.fieldType !== FieldTypeIds.Button;
    migrated = true;
  }

  if (!col.validationRules) {
    col.validationRules = [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }];
    migrated = true;
  } else {
    col.validationRules = [...col.validationRules];
  }

  if (!col.validationRules.find((x) => x.rule === ValidationRuleTypes.MaliciousValues)) {
    col.validationRules.push({ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false });
    migrated = true;
  }

  if (!col.validationRules.find((x) => x.rule === ValidationRuleTypes.Required) && required) {
    col.validationRules.push({ rule: ValidationRuleTypes.Required, value: true, canDelete: false });
    migrated = true;
  }

  if (col.fieldType === FieldTypeIds.Text) {
    return migrateTextColumn(col, field, migrated);
  }

  if (
    col.fieldType === FieldTypeIds.Integer ||
    col.fieldType === FieldTypeIds.Decimal ||
    col.fieldType === FieldTypeIds.Money
  ) {
    return migrateNumericColumn(col, migrated);
  }

  if (col.fieldType === FieldTypeIds.CardColumn) {
    return migrateCardColumn(col, migrated);
  }

  if (
    ![
      FieldTypeIds.Text,
      FieldTypeIds.Integer,
      FieldTypeIds.Decimal,
      FieldTypeIds.Money,
      FieldTypeIds.CardColumn,
    ].includes(col.fieldType)
  ) {
    if (col.format.width === 'sm' || col.format.width === 'md' || col.format.width === 'lg' || !col.format.width) {
      col.format = { ...col.format, width: 'dynamic' };
      migrated = true;
    }
  }

  if (col.fieldType === FieldTypeIds.Button) {
    col.format = { ...col.format };

    if (col.format.textColor && col.format.textColor.startsWith('mi-color')) {
      col.format.textColor = migrateTextColor(col.format.textColor, col.format.backgroundColor);
      migrated = true;
    }

    if (col.format.backgroundColor && col.format.backgroundColor.startsWith('button')) {
      col.format.backgroundColor = migrateButtonBackground(col.format.backgroundColor);
      migrated = true;
    }

    if (col.format.textColor === undefined || col.format.textColor === null) {
      col.format.textColor = 'blue';
      migrated = true;
    }
    if (col.format.backgroundColor === undefined || col.format.backgroundColor === null) {
      col.format.backgroundColor = 'white';
      migrated = true;
    }
  }

  if (col.fieldType === FieldTypeIds.Formula && !col.isLocked) {
    col.isLocked = true;
  }

  return migrated ? col : null;
};

export const createGridColumn = (
  data = {
    field: null,
    header: null,
    visible: true,
    isLocked: false,
    canDelete: true,
    readOnly: false,
    fieldType: FieldTypeIds.Text,
    columnType: 0,
    format: {
      alignment: 'left',
      width: 'dynamic',
      widthFixed: null,
      widthAutoSize: 'sm',
      fontWeight: 'normal',
    },
    validationRules: [],
    formula: null,
    displayAs: null,
    displayOptions: {},
    onChangeEvent: null,
    defaultValue: null,
    cardColumnFields: null,
    showOnMobile: false,
    control: null,
    expression: null,
    hasColumnTotal: false,
    sourceField: null,
    sourceModel: null,
    displayField: null,
    controlId: Guid.create(),
  },
) => {
  const column = {
    controlId: data.controlId || Guid.create(),
    field: data.field || null,
    header: data.header || null,
    visible: data.visible === undefined ? true : data.visible,
    isLocked: data.isLocked === undefined ? false : data.isLocked,
    canDelete: data.canDelete === undefined ? true : data.canDelete,
    readOnly: data.readOnly === undefined ? false : data.readOnly,
    fieldType: data.fieldType || FieldTypeIds.Text,
    columnType: data.columnType || 0,
    format: data.format || {
      alignment: 'left',
      width: 'dynamic',
      widthFixed: data.format?.widthFixed || null,
      widthAutoSize: data.format?.widthAutoSize || 'sm',
      disabled: false,
      fontWeight: 'normal',
    },
    validationRules: data.validationRules || [],
    formula: data.formula || null,
    displayAs: data.displayAs || null,
    displayOptions: data.displayOptions || {},
    onChangeEvent: data.onChangeEvent || null,
    defaultValue: data.defaultValue || null,
    cardColumnFields: data.cardColumnFields || null,
    showOnMobile: data.showOnMobile === undefined ? false : data.showOnMobile,
    visibleOnMobile: data.visibleOnMobile === undefined ? false : data.visibleOnMobile,
    control: data.control || null,
    expression: data.expression || null,
    hasColumnTotal: data.hasColumnTotal === undefined ? false : data.hasColumnTotal,
    displayField: data.displayField || data.field,
    sourceField: data.sourceField || null,
    sourceModel: data.sourceModel || null,
  };

  if (column.fieldType === FieldTypeIds.DateTime) {
    column.format.type = 'Short Date';
  }

  if (column.fieldType === FieldTypeIds.CardColumn) {
    column.cardColumnFields = data.cardColumnFields || [];
    column.format.type = 'structured';
  }

  if (!column.control) {
    if (column.fieldType === FieldTypeIds.DropDown) {
      const ddColumns = [
        createBaseColumn({
          name: 'RecordID',
          caption: 'Record ID',
          fieldType: FieldTypeIds.Integer,
          isKey: true,
          format: {
            visible: false,
            visibleMobile: false,
          },
        }),
      ];
      if (data.sourceField !== 'RecordID') {
        ddColumns.push(
          createBaseColumn({
            name: data.sourceField,
            caption: data.header,
            fieldType: FieldTypeIds.Text,
            format: {
              visible: true,
              visibleMobile: true,
            },
          }),
        );
      }
      column.displayField = data.field;

      column.control = createDropdownControl(
        {
          name: data.field,
          caption: data.header,
        },
        {
          model: {
            viewName: data.sourceModel,
            columns: ddColumns,
          },
        },
      );
      column.controlId = column.control.id;
    } else if (column.fieldType === FieldTypeIds.Button) {
      column.control = createButtonControl({ name: data.field, caption: data.header });
      column.controlId = column.control.id;
    } else if (column.fieldType === FieldTypeIds.CardColumn) {
      column.control = createCardControl();
      column.controlId = column.control.id;
    }
  }

  const migrated = migrateGridColumn(column, null);

  return migrated || column;
};

export default createGridColumn;
