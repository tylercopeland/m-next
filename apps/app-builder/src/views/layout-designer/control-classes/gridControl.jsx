import { fieldTypeIdLookup, FieldTypeIds } from '@m-next/types';
import { createBaseControl, ValidationRuleTypes } from '@m-next/runtime-interface';
import createGridColumn from './grid/gridColumn';
import createGridViewColumn from './grid/gridViewColumn';
import createGridViewSorting from './grid/gridViewSorting';
import createGridView, { migrateGridView } from './grid/gridView';

export const gridVersion = '2.0.0';
export const createGridControl = (
  base = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'grid',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
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
    showVerticalDividers: false,
  },
) => {
  const baseControl = createBaseControl(base);

  return {
    ...baseControl,
    isReadOnly: data.isReadOnly === undefined ? true : data.isReadOnly,
    viewFriendlyName: data.viewFriendlyName || null,
    columns: data.columns || [],
    defaultViewFilter: data.defaultViewFilter || null,
    viewList: data.viewList || [],
    showHeader: data.showHeader === undefined ? true : data.showHeader,
    paging: data.paging || { pageNumber: 1, pageSize: 25 },
    showGoToPage: data.showGoToPage === undefined ? false : data.showGoToPage,
    showPagination: data.showPagination === undefined ? true : data.showPagination,
    isSearchable: data.isSearchable === undefined ? true : data.isSearchable,
    hideSearch: data.hideSearch === undefined ? false : data.hideSearch,
    showSort: data.showSort === undefined ? true : data.showSort,
    hideViewSelector: data.hideViewSelector === undefined ? false : data.hideViewSelector,
    showExport: data.showExport === undefined ? false : data.showExport,
    showRefresh: data.showRefresh === undefined ? false : data.showRefresh,
    isSelectable: data.isSelectable === undefined ? false : data.isSelectable,
    canReorderColumns: data.canReorderColumns === undefined ? false : data.canReorderColumns,
    canAddMoreRows: data.canAddMoreRows === undefined ? true : data.canAddMoreRows,
    showDeleteColumn: data.showDeleteColumn === undefined ? true : data.showDeleteColumn,
    showDeleteConfirmation: data.showDeleteConfirmation === undefined ? false : data.showDeleteConfirmation,
    menuItems: data.menuItems || null,
    onActiveRowChange: data.onActiveRowChange || null,
  };
};

export const migrateGrid = (control, fieldList, resetGrid) => {
  let migrated = false;

  const updated = { ...control, version: gridVersion };
  const requiredFieldNames = new Set(
    fieldList.filter((field) => field.isRequired).map((field) => field.name),
  );
  const requiredColumns = fieldList
    .filter((field) => field.isRequired)
    .map((field) =>
      createGridColumn({
        field: field.name,
        header: field.caption || field.name,
        isLocked: false,
        canDelete: false,
        readOnly: field.name === 'RecordID',
        fieldType: fieldTypeIdLookup(field.type),
        sourceField: field.sourceField,
        sourceModel: field.sourceModel,
      }),
    );
  if (!requiredColumns.find((column) => column.field === 'RecordID')) {
    requiredColumns.unshift(
      createGridColumn({
        field: 'RecordID',
        header: 'Record ID',
        isLocked: true,
        canDelete: false,
        readOnly: true,
        fieldType: FieldTypeIds.Integer,
        validationRules: [
          { rule: ValidationRuleTypes.Required, value: true, canDelete: false },
          { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
        ],
      }),
    );
  }

  if (resetGrid) {
    const migratedView = migrateGridView(control.viewList[0], 0);
    const view = migratedView || { ...control.viewList[0] };
    view.columns = requiredColumns.map((column) =>
      createGridViewColumn({
        field: column.field,
        visible: column.visible,
        validationRules: [
          { rule: ValidationRuleTypes.Required, value: true, canDelete: false },
          { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
        ],
      }),
    );
    view.sorting = [createGridViewSorting({ filterField: 'RecordID', filterOrder: 'asc' })];
    updated.columns = requiredColumns;
    updated.viewList = [view];
    updated.showExportToMailChimp = false;
    return updated;
  }

  if (updated.viewList.length === 0) {
    updated.viewList.push(createGridView({ name: 'All', caption: 'All' }));
  }

  const migratedViews = control.viewList.map(migrateGridView).filter((x) => x !== null);
  if (migratedViews.length > 0) {
    migrated = true;
    updated.viewList = updated.viewList.map((view) => {
      if (migratedViews.find((x) => x.id === view.id)) {
        return migratedViews.find((x) => x.id === view.id);
      }
      return view;
    });
  }

  const missingColumns = requiredColumns.filter((column) => !updated.columns.find((x) => x.field === column.field));

  if (missingColumns.length > 0) {
    updated.columns = [...updated.columns, ...missingColumns];
    migrated = true;
  }

  let columnsUnlocked = false;
  const unlockedColumns = updated.columns.map((column) => {
    if (column.field === 'RecordID') {
      return column;
    }

    const isRequiredField = requiredFieldNames.has(column.field);
    const hasRequiredRule =
      column.validationRules?.some(
        (rule) => rule.rule === ValidationRuleTypes.Required && rule.canDelete === false,
      ) || false;

    if ((isRequiredField || hasRequiredRule) && column.isLocked) {
      columnsUnlocked = true;
      return {
        ...column,
        isLocked: false,
        canDelete: false,
      };
    }

    return column;
  });

  if (columnsUnlocked) {
    updated.columns = unlockedColumns;
    migrated = true;
  }

  updated.viewList = updated.viewList.map((view) => {
    const viewColumns =
      view.columns && view.columns.length > 0
        ? view.columns.filter((column) => updated.columns.find((col) => col.field === column.field))
        : [];
    updated.columns.forEach((column) => {
      if (!viewColumns.find((col) => col.field === column.field)) {
        viewColumns.push(
          createGridViewColumn({
            field: column.field,
            caption: column.header,
            visible: true,
          }),
        );
        migrated = true;
      }
    });
    return view;
  });

  return migrated ? updated : null;
};

export default createGridControl;
