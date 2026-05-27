import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

/**
 * Grid column configuration interface
 */
export interface GridColumn {
  id: string;
  field: string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage';
  format?: string;
  alignment?: 'left' | 'center' | 'right';
  visible?: boolean;
  frozen?: boolean;
  groupable?: boolean;
  editable?: boolean;
  template?: string;
  headerTemplate?: string;
  footerTemplate?: string;
}

/**
 * Grid sorting configuration
 */
export interface GridSort {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Grid filtering configuration
 */
export interface GridFilter {
  field: string;
  operator: 'eq' | 'ne' | 'lt' | 'le' | 'gt' | 'ge' | 'contains' | 'startswith' | 'endswith';
  value: string | number | boolean | Date | null;
  logic?: 'and' | 'or';
}

/**
 * Grid paging configuration
 */
export interface GridPaging {
  enabled: boolean;
  pageSize: number;
  currentPage: number;
  totalRecords?: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

/**
 * Grid selection configuration
 */
export interface GridSelection {
  mode: 'none' | 'single' | 'multiple';
  checkboxColumn?: boolean;
  selectedRows?: string[];
}

/**
 * Grid grouping configuration
 */
export interface GridGrouping {
  enabled: boolean;
  fields: string[];
  expandedGroups?: string[];
  showGroupHeaders?: boolean;
  showGroupFooters?: boolean;
}

/**
 * Grid export configuration
 */
export interface GridExport {
  enabled: boolean;
  formats?: ('excel' | 'csv' | 'pdf')[];
  filename?: string;
  includeHeaders?: boolean;
  includeFooters?: boolean;
}

/**
 * Grid Control Interface
 * Represents a data grid/table control with advanced features
 */
export interface GridControl extends BaseControl {
  type: 'grid';

  // Data source configuration
  dataSource?: string;
  dataTable?: string;
  dataView?: string;

  // Column configuration
  columns: GridColumn[];
  autoGenerateColumns?: boolean;

  // Display options
  showHeader?: boolean;
  showFooter?: boolean;
  showBorders?: boolean;
  alternateRowColors?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;

  // Interaction options
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowGrouping?: boolean;
  allowColumnReordering?: boolean;
  allowColumnResizing?: boolean;
  allowRowSelection?: boolean;
  allowInlineEditing?: boolean;

  // Current state
  sorting?: GridSort[];
  filtering?: GridFilter[];
  paging?: GridPaging;
  selection?: GridSelection;
  grouping?: GridGrouping;

  // Features
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  exportOptions?: GridExport;

  // Styling
  theme?: 'default' | 'bootstrap' | 'material' | 'office365';
  customCssClass?: string;

  // Events and actions
  onRowClick?: string;
  onRowDoubleClick?: string;
  onSelectionChange?: string;
  onSortChange?: string;
  onFilterChange?: string;
  onPageChange?: string;
  onCellEdit?: string;
  onRowAdd?: string;
  onRowDelete?: string;

  // Performance options
  virtualScrolling?: boolean;
  lazyLoading?: boolean;
  cacheEnabled?: boolean;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardNavigation?: boolean;
  componentVersion?: string;
}

/**
 * Input interface for creating GridControl instances
 */
export interface GridControlInput extends BaseControlInput {
  type?: 'grid';
  dataSource?: string;
  dataTable?: string;
  dataView?: string;
  columns?: GridColumn[];
  autoGenerateColumns?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBorders?: boolean;
  alternateRowColors?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowGrouping?: boolean;
  allowColumnReordering?: boolean;
  allowColumnResizing?: boolean;
  allowRowSelection?: boolean;
  allowInlineEditing?: boolean;
  sorting?: GridSort[];
  filtering?: GridFilter[];
  paging?: GridPaging;
  selection?: GridSelection;
  grouping?: GridGrouping;
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  exportOptions?: GridExport;
  theme?: 'default' | 'bootstrap' | 'material' | 'office365';
  customCssClass?: string;
  onRowClick?: string;
  onRowDoubleClick?: string;
  onSelectionChange?: string;
  onSortChange?: string;
  onFilterChange?: string;
  onPageChange?: string;
  onCellEdit?: string;
  onRowAdd?: string;
  onRowDelete?: string;
  virtualScrolling?: boolean;
  lazyLoading?: boolean;
  cacheEnabled?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardNavigation?: boolean;
}

/**
 * Factory function to create a GridControl with default values
 */
export const createGridControl = (data: GridControlInput = {}): GridControl => ({
  ...createBaseControl(data),
  type: data.type || 'grid',
  name: data.name || 'grid',

  // Data source defaults
  dataSource: data.dataSource || '',
  dataTable: data.dataTable || '',
  dataView: data.dataView || '',

  // Column defaults
  columns: data.columns || [],
  autoGenerateColumns: data.autoGenerateColumns ?? true,

  // Display defaults
  showHeader: data.showHeader ?? true,
  showFooter: data.showFooter ?? false,
  showBorders: data.showBorders ?? true,
  alternateRowColors: data.alternateRowColors ?? true,
  rowHeight: data.rowHeight || 30,
  headerHeight: data.headerHeight || 35,
  footerHeight: data.footerHeight || 30,

  // Interaction defaults
  allowSorting: data.allowSorting ?? true,
  allowFiltering: data.allowFiltering ?? true,
  allowGrouping: data.allowGrouping ?? false,
  allowColumnReordering: data.allowColumnReordering ?? true,
  allowColumnResizing: data.allowColumnResizing ?? true,
  allowRowSelection: data.allowRowSelection ?? true,
  allowInlineEditing: data.allowInlineEditing ?? false,

  // State defaults
  sorting: data.sorting || [],
  filtering: data.filtering || [],
  paging: data.paging || {
    enabled: true,
    pageSize: 25,
    currentPage: 1,
    showPageSizeSelector: true,
    pageSizeOptions: [10, 25, 50, 100],
  },
  selection: data.selection || {
    mode: 'single',
    checkboxColumn: false,
    selectedRows: [],
  },
  grouping: data.grouping || {
    enabled: false,
    fields: [],
    expandedGroups: [],
    showGroupHeaders: true,
    showGroupFooters: false,
  },

  // Feature defaults
  searchEnabled: data.searchEnabled ?? true,
  searchPlaceholder: data.searchPlaceholder || 'Search...',
  exportOptions: data.exportOptions || {
    enabled: true,
    formats: ['excel', 'csv'],
    includeHeaders: true,
    includeFooters: false,
  },

  // Styling defaults
  theme: data.theme || 'default',
  customCssClass: data.customCssClass || '',

  // Event defaults
  onRowClick: data.onRowClick || '',
  onRowDoubleClick: data.onRowDoubleClick || '',
  onSelectionChange: data.onSelectionChange || '',
  onSortChange: data.onSortChange || '',
  onFilterChange: data.onFilterChange || '',
  onPageChange: data.onPageChange || '',
  onCellEdit: data.onCellEdit || '',
  onRowAdd: data.onRowAdd || '',
  onRowDelete: data.onRowDelete || '',

  // Performance defaults
  virtualScrolling: data.virtualScrolling ?? false,
  lazyLoading: data.lazyLoading ?? false,
  cacheEnabled: data.cacheEnabled ?? true,

  // Accessibility defaults
  ariaLabel: data.ariaLabel || 'Data grid',
  ariaDescription: data.ariaDescription || '',
  keyboardNavigation: data.keyboardNavigation ?? true,
});

/**
 * Default GridControl instance
 */
export const defaultGridControl: GridControl = createGridControl();
