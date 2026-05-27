/**
 * Legacy Grid (GRD) to Editable Grid (EDT) migration
 */

import Guid from '@m-next/utilities/src/guid';
import { convertExpressionToFormula, convertLegacyExpression } from './expressionConverter';
import { COLUMN_TYPES, FIELD_TYPES } from '../constants';

interface ColumnFormat {
  visible?: boolean;
  width?: { value?: string; type?: number } | string;
  display?: number;
  icon?: { name: string; color: string };
  visiblemobile?: boolean;
  alignment?: string;
  headerAlignment?: string;
  formatType?: string;
  formatRounding?: number;
  formatSeparator?: string;
  hidecaption?: boolean;
  textColor?: string;
  fontSize?: string | number;
  backgroundColor?: string;
  disabled?: boolean;
  widthFixed?: boolean;
  widthAutoSize?: boolean;
  dateType?: string;
  money?: boolean;
  type?: string;
  separator?: string;
  rounding?: number;
}

interface LegacyColumn {
  name?: string;
  caption?: string;
  fieldType?: number;
  columnType?: number;
  isKey?: boolean;
  format?: ColumnFormat;
  expression?: Array<Record<string, unknown>>;
  formula?: string;
  hasSubtotal?: boolean;
  cardColumnFields?: unknown;
  displayAs?: unknown;
  displayOptions?: unknown;
  control?: unknown;
  supportingColumns?: unknown;
  onClick?: unknown;
  aggregate?: unknown;
  dateGroupBy?: unknown;
  validationRules?: unknown;
  CardAvatar?: unknown;
  IsRequired?: boolean;
  IsUnique?: boolean;
  Size?: number;
  Id?: number;
  LinkedFieldCaption?: string;
  LinkedJoinFromTable?: string;
  LinkedJoinFromPrimary?: string;
  LinkedViaField?: string;
  CompareName?: string;
  DisplayValueFromTableName?: string;
  DisplayValueFromFieldName?: string;
  DisplayValueFromViewFriendlyName?: string;
  MaxSize?: number;
  IsComplexField?: boolean;
  ParentFieldName?: string;
  ParentFieldType?: number;
  ElementType?: string;
  ElementSeq?: number;
  Elements?: unknown;
}

interface FilterItem {
  filterId?: string;
  filterName?: string;
  isHidden?: boolean;
  isDefault?: boolean;
  expression?: Array<Record<string, unknown>>;
  sorting?: Array<Record<string, unknown>>;
}

interface GridModel {
  columns?: LegacyColumn[];
  caption?: string;
  viewName?: string;
  searchString?: string;
  searchFilter?: unknown;
  searchColumns?: unknown[];
  searchMetadataColumns?: unknown[];
  isSelectable?: boolean;
  distinct?: boolean;
  isAttached?: boolean;
  isEditable?: boolean;
  lastSelectedRecordId?: number;
  customViews?: unknown;
  sharedViews?: unknown;
  columnTotals?: unknown;
}

interface LegacyGridData {
  IsComplexType?: boolean;
  isComplexType?: boolean;
  Type?: string;
  filterDef?: FilterItem[];
  hideAdvSearch?: boolean;
  hideColumnHeaders?: boolean;
  hideNavigation?: boolean;
  hideSearch?: boolean;
  hideSettings?: boolean;
  hidePerPageSelector?: boolean;
  hideExport?: boolean;
  hideMailChimp?: boolean;
  hideViewsDropdown?: boolean;
  hideGoToPage?: boolean;
  isFixedLayout?: boolean;
  isResponsive?: boolean;
  model?: GridModel;
  name?: string;
  visible?: boolean;
  LegacyClass?: string;
  [key: string]: unknown;
}

interface MigratedColumn {
  field?: string;
  header?: string;
  fieldType?: number;
  columnType?: number;
  isKey?: boolean;
  format: ColumnFormat & { width: string };
  hasColumnTotal?: boolean;
  showOnMobile?: boolean;
  cardColumnFields?: unknown;
  displayAs?: unknown;
  displayOptions?: unknown;
  showHeader?: boolean;
  control?: unknown;
  supportingColumns?: unknown;
  onClick?: unknown;
  expression?: Array<Record<string, unknown>> | null;
  aggregate?: unknown;
  dateGroupBy?: unknown;
  validationRules?: unknown;
  formula?: string | null;
  CardAvatar?: unknown;
  IsRequired?: boolean;
  IsUnique?: boolean;
  Size?: number;
  Id?: number;
  LinkedFieldCaption?: string;
  LinkedJoinFromTable?: string;
  LinkedJoinFromPrimary?: string;
  LinkedViaField?: string;
  CompareName?: string;
  DisplayValueFromTableName?: string;
  DisplayValueFromFieldName?: string;
  DisplayValueFromViewFriendlyName?: string;
  MaxSize?: number;
  IsComplexField?: boolean;
  ParentFieldName?: string;
  ParentFieldType?: number;
  ElementType?: string;
  ElementSeq?: number;
  Elements?: unknown;
}

interface MigratedView {
  id?: string;
  name?: string;
  isVisible?: boolean;
  isDefault?: boolean;
  columns: Array<{ field?: string; visible?: boolean; visibleOnMobile?: boolean; width?: unknown }>;
  filters?: unknown[];
  sorting?: Array<Record<string, unknown>>;
}

interface MigratedGrid {
  id: string;
  Id: string;
  Type: string;
  type: string;
  name?: string;
  caption?: string;
  table?: string;
  viewFriendlyName?: string;
  viewList: MigratedView[];
  defaultViewFilter?: string | null;
  viewFilter?: string | null;
  hideViewSelector?: boolean;
  columns: MigratedColumn[];
  isSearchable?: boolean;
  searchString?: string;
  searchFilter?: unknown;
  searchColumns?: unknown[];
  searchMetadataColumns?: unknown[];
  hideCaption?: boolean;
  showSort?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showExportToMailChimp?: boolean;
  showGoToPage?: boolean;
  showShowHideColumns?: boolean;
  showDeleteColumn?: boolean;
  showDeleteConfirmation?: boolean;
  isResponsive?: boolean;
  isFixedLayout?: boolean;
  canReorderColumns?: boolean;
  isSelectable?: boolean;
  selectAll?: boolean;
  selectedRecords?: unknown[];
  selectedRows?: unknown[];
  unselectedRecords?: unknown[];
  isReadOnly?: boolean;
  canAddMoreRows?: boolean;
  newRowsCount?: number;
  addLabel?: string;
  paging?: { pageSize: number; pageNumber: number };
  sorting?: Record<string, unknown> | null;
  visible?: boolean;
  disabled?: boolean;
  isWorking?: boolean;
  classes?: string;
  distinct?: boolean;
  isAttached?: boolean;
  isEditable?: boolean;
  lastSelectedRecordId?: number;
  customViews?: unknown;
  sharedViews?: unknown;
  columnTotals?: unknown;
}

/**
 * Migrate legacy grid (GRD) configuration to editable grid (EDT) format
 */
export function migrateGridToEditableGrid(legacyGridData: LegacyGridData, newControlId: string): MigratedGrid | null {
  if (!legacyGridData) {
    return null;
  }

  const isComplexType = legacyGridData.IsComplexType || legacyGridData.isComplexType;
  const isLegacyGrid = legacyGridData.Type === 'GRD' && isComplexType;

  if (!isLegacyGrid) {
    return null;
  }

  const filterDef = legacyGridData.filterDef || [];
  const hideSearch = legacyGridData.hideSearch ?? false;
  const hideSettings = legacyGridData.hideSettings ?? false;
  const hideExport = legacyGridData.hideExport ?? false;
  const hideMailChimp = legacyGridData.hideMailChimp ?? false;
  const hideViewsDropdown = legacyGridData.hideViewsDropdown ?? false;
  const hideGoToPage = legacyGridData.hideGoToPage ?? true;
  const isFixedLayout = legacyGridData.isFixedLayout ?? false;
  const isResponsive = legacyGridData.isResponsive ?? false;
  const model = legacyGridData.model || {};

  let viewList: Array<Record<string, unknown>>;

  if (filterDef.length === 0) {
    // No filterDef means no views - create a default view with all columns visible
    const columns = ((model.columns as Array<Record<string, unknown>>) || []).map((col: Record<string, unknown>) => ({
      field: col.name,
      visible: col.format?.visible ?? true,
      width: col.format?.width,
    }));

    viewList = [
      {
        id: Guid.create(),
        name: 'All Records',
        isVisible: true,
        isDefault: true,
        columns,
        filters: [],
        sorting: [],
      },
    ];
  } else {
    viewList = filterDef.map((filterItem: Record<string, unknown>) => {
      const columns = ((model.columns as Array<Record<string, unknown>>) || []).map((col: Record<string, unknown>) => ({
        field: col.name,
        visible: col.format?.visible ?? true,
        width: col.format?.width,
      }));

      return {
        id: filterItem.filterId,
        name: filterItem.filterName,
        isVisible: !filterItem.isHidden,
        isDefault: filterItem.isDefault ?? false,
        columns,
        filters: convertLegacyExpression(filterItem.expression || []),
        sorting: filterItem.sorting || [],
      };
    });
  }

  const columns = (model.columns || []).map((col: LegacyColumn) => {
    const widthObj = col.format?.width || { value: '100', type: 0 };
    let width: string;
    if (typeof widthObj === 'object' && widthObj !== null) {
      const widthValue = widthObj.value || '100';
      width = widthValue;
    } else {
      width = widthObj || '100';
    }

    const colFormat = col.format || {};

    let columnType = col.columnType;
    let fieldType = col.fieldType;
    const expression = col.expression || [];
    let formula = null;

    if (columnType === COLUMN_TYPES.EXPRESSION && expression.length > 0) {
      formula = convertExpressionToFormula(expression);
      if (formula) {
        columnType = COLUMN_TYPES.FORMULA;
        fieldType = FIELD_TYPES.FORMULA;
      }
    }

    return {
      field: col.name,
      header: col.caption,
      fieldType: formula ? fieldType : col.fieldType,
      columnType: formula ? columnType : col.columnType,
      isKey: col.isKey ?? false,
      format: {
        display: colFormat.display ?? 0,
        visible: colFormat.visible ?? true,
        width,
        icon: colFormat.icon || { name: '', color: 'normal' },
        visiblemobile: colFormat.visiblemobile ?? false,
        alignment: colFormat.alignment || 'left',
        headerAlignment: colFormat.headerAlignment || colFormat.alignment || 'left',
        formatType: colFormat.formatType || '',
        formatRounding: colFormat.formatRounding,
        formatSeparator: colFormat.formatSeparator || '',
        hidecaption: colFormat.hidecaption ?? false,
        textColor: colFormat.textColor,
        fontSize: colFormat.fontSize,
        backgroundColor: colFormat.backgroundColor,
        disabled: colFormat.disabled ?? false,
        widthFixed: colFormat.widthFixed ?? false,
        widthAutoSize: colFormat.widthAutoSize ?? false,
        dateType: colFormat.dateType,
        money: colFormat.money ?? false,
        type: colFormat.type,
        separator: colFormat.separator || '',
        rounding: colFormat.rounding,
      },
      hasColumnTotal: col.hasSubtotal ?? false,
      showOnMobile: colFormat.visiblemobile ?? false,
      cardColumnFields: col.cardColumnFields,
      displayAs: col.displayAs,
      displayOptions: col.displayOptions,
      showHeader: !colFormat.hidecaption,
      control: col.control,
      supportingColumns: col.supportingColumns,
      onClick: col.onClick,
      expression: formula ? null : col.expression || [],
      aggregate: col.aggregate,
      dateGroupBy: col.dateGroupBy,
      validationRules: col.validationRules,
      formula: formula || col.formula,
      CardAvatar: col.CardAvatar,
      IsRequired: col.IsRequired ?? false,
      IsUnique: col.IsUnique ?? false,
      Size: col.Size || 0,
      Id: col.Id || 0,
      LinkedFieldCaption: col.LinkedFieldCaption,
      LinkedJoinFromTable: col.LinkedJoinFromTable,
      LinkedJoinFromPrimary: col.LinkedJoinFromPrimary,
      LinkedViaField: col.LinkedViaField,
      CompareName: col.CompareName,
      DisplayValueFromTableName: col.DisplayValueFromTableName,
      DisplayValueFromFieldName: col.DisplayValueFromFieldName,
      DisplayValueFromViewFriendlyName: col.DisplayValueFromViewFriendlyName,
      MaxSize: col.MaxSize || 0,
      IsComplexField: col.IsComplexField ?? false,
      ParentFieldName: col.ParentFieldName,
      ParentFieldType: col.ParentFieldType,
      ElementType: col.ElementType,
      ElementSeq: col.ElementSeq,
      Elements: col.Elements,
    };
  });

  const defaultView = viewList.find((v: Record<string, unknown>) => v.isDefault) || (viewList.length > 0 ? viewList[0] : null);

  const originalName = legacyGridData.name || 'grid';
  const viewName = model.viewName || '';

  // Build base grid object
  const migratedGrid: Record<string, unknown> = {
    id: newControlId,
    Id: newControlId,
    Type: 'EDT',
    type: 'EDT',
    name: originalName,
    caption: model.caption || '',
    table: viewName,
    viewFriendlyName: viewName,
    viewList,
    hideViewSelector: hideViewsDropdown,
    columns,
    isSearchable: !hideSearch,
    searchString: model.searchString || '',
    searchFilter: model.searchFilter,
    searchColumns: model.searchColumns || [],
    searchMetadataColumns: model.searchMetadataColumns || [],
    hideCaption: false,
    showSort: true,
    showRefresh: true,
    showExport: !hideExport,
    showExportToMailChimp: !hideMailChimp,
    showGoToPage: !hideGoToPage,
    showShowHideColumns: !hideSettings,
    showDeleteColumn: false,
    showDeleteConfirmation: false,
    isResponsive,
    isFixedLayout,
    canReorderColumns: true,
    isSelectable: model.isSelectable ?? false,
    selectAll: false,
    selectedRecords: [],
    selectedRows: [],
    unselectedRecords: [],
    isReadOnly: false,
    canAddMoreRows: true,
    newRowsCount: 1,
    addLabel: 'Add Row',
    paging: {
      pageSize: 10,
      pageNumber: 1,
    },
    sorting: defaultView?.sorting?.[0] || null,
    visible: legacyGridData.visible ?? true,
    disabled: false,
    isWorking: false,
    classes: legacyGridData.LegacyClass || '',
    distinct: model.distinct ?? false,
    isAttached: model.isAttached ?? true,
    isEditable: model.isEditable ?? false,
    lastSelectedRecordId: model.lastSelectedRecordId || 0,
    customViews: model.customViews,
    sharedViews: model.sharedViews,
    columnTotals: model.columnTotals,
  };

  // Only add view filter properties if there's a valid default view with an ID
  if (defaultView?.id) {
    migratedGrid.defaultViewFilter = defaultView.id;
    migratedGrid.viewFilter = defaultView.id;
  }

  return migratedGrid;
}
