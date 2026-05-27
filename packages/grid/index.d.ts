/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@m-next/grid' {
  import * as React from 'react';

  // Constants and Enums
  export const STATUSES: {
    unchanged: 0;
    edited: 1;
    deleted: 2;
    new: 3;
    blank: 4;
    locked: 5;
  };

  export const ColumnTypes: {
    Data: 0;
    Link: 1;
    Expression: 2;
    Button: 3;
    CardColumn: 4;
    Complex: 5;
    Formula: 6;
  };

  export const GridEventNames: {
    GridRefresh: 0;
    SortChanged: 1;
    PageChanged: 2;
    PageSizeChanged: 3;
    SettingChanged: 4;
    ActiveRowChanged: 5;
    FilterChanged: 6;
    ParentChanged: 7;
    GridLinkClicked: 8;
    RowChecked: 9;
    SearchClicked: 10;
    AdvancedSearch: 11;
    VisibleColumnsChanged: 12;
  };

  export interface Icon {
    name: string;
    color?: string;
  }

  export interface DisplayOption {
    // For YesNo fields displayed as icons
    trueIcon?: Icon;
    falseIcon?: Icon;
    trueTooltip?: string;
    falseTooltip?: string;
    // For YesNo fields displayed as custom/pill
    trueValue?: string;
    falseValue?: string;
    disabledTooltip?: string;
    hoverColor?: string;
    numberFormat?: number;
    // For Button fields displayed as icons
    icon?: Icon;
  }

  export interface FormatOptions {
    dateType?: string;
    type?: string;
    rounding?: number;
    separator?: string | boolean;
    [key: string]: any;
  }

  export interface CardColumnFields {
    tagsList?: any[];
    hasAvatar?: boolean;
    field1?: GridColumn | null;
    field2?: GridColumn | null;
    field3?: GridColumn | null;
    field4?: GridColumn | null;
    field5?: GridColumn | null;
    field6?: GridColumn | null;
  }

  // Format Style Interface for Button columns
  export interface FormatStyle {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    disabled?: boolean;
    [key: string]: any;
  }

  // Dropdown Option Interface
  export interface DropdownOption {
    value: string | number;
    label: string;
  }

  // Column Interface
  export interface GridColumn {
    // ===== Core Properties (from ColumnPropType.jsx) =====
    editable?: boolean;
    fieldType?: number;
    formatStyle?: FormatStyle;
    name?: string;
    onChange?: (columnName: string, value: any, column: GridColumn, rowIndex: number, primaryKey: any) => void;
    onClick?: (
      columnName: string,
      value: any,
      column: GridColumn | null,
      rowIndex: number,
      primaryKey: any,
    ) => void;
    onColumnClick?: (
      e: React.MouseEvent<HTMLTableCellElement>,
      columnName: string,
      value: any,
      column: GridColumn,
      rowIndex: number,
      primaryKey: any,
    ) => void;
    columnAlign?: 'left' | 'center' | 'right' | string;
    fixedWidth?: boolean;
    width?: 'dynamic' | 'fixed' | 'auto' | string | number;
    visible?: boolean;
    showOnMobile?: boolean;
    visibleOnMobile?: boolean;
    accessorProp?: string;
    caption?: string;
    hideable?: boolean;
    hasColumnTotal?: boolean;
    hideWhenDragging?: boolean;
    showHeader?: boolean;
    isDisabled?: (rowData: any) => boolean;
    maxLength?: number;
    infoLevel?: 'error' | 'warning' | 'informative';

    // ===== Display Properties =====
    primary?: boolean;
    singleLine?: boolean;
    displayAs?: 'icon' | 'custom' | 'pill';
    displayOptions?: DisplayOption;
    cellWidth?: string | number;
    columnType?: number;

    // ===== Format Properties =====
    format?: FormatOptions;
    formatType?: FormatOptions;

    // ===== Width Properties =====
    widthFixed?: number;
    widthAutoSize?: boolean | string;

    // ===== Button Column Properties =====
    buttonLabel?: string;

    // ===== Dropdown Column Properties =====
    options?: DropdownOption[];

    // ===== Card Column Properties =====
    cardColumnFields?: CardColumnFields | any[];
    control?: any;

    // ===== Supporting/Complex Column Properties =====
    supportingColumns?: Record<string, any>;
    type?: string;

    // ===== Behavior Properties =====
    isBlurOnSubmit?: boolean;

    // ===== Custom Render Functions =====
    renderEditAs?: (props: {
      id: string;
      column: GridColumn;
      value: any;
      error: string | null;
      inputElRef: React.RefObject<HTMLInputElement>;
      rowIdx: number;
      primaryKey: any;
      isFocused: boolean;
      scrollerRef: React.RefObject<HTMLDivElement>;
    }) => React.ReactNode;
    renderAs?: (id: string, value: any, rowIdx: number, error: string | null, primaryKey: any) => React.ReactNode;
  }

  // View Filter Interface
  export interface ViewFilter {
    id: string;
    name: string;
    columns?: object[];
    sorting?: object[];
    filtering?: object[];
    enableDynamicDates?: boolean;
  }

  // Menu Column Interface
  export interface MenuColumn {
    id: string;
    label: string;
    visible?: boolean;
    onClick?: () => void;
  }

  // Custom Action Interface
  export interface CustomAction {
    value: string;
    label: string;
  }

  // Drag and Drop Interface
  export interface DragAndDropConfig {
    [key: string]: any;
  }

  // Advanced Search Expression Interface
  export interface AdvancedSearchExpression {
    simple?: any[];
    advanced?: any[];
  }

  // Chips Data Interface
  export interface ChipsData {
    avatar?: string;
    value: string;
    label: string;
  }

  // Display Preferences Interface
  export interface DisplayPreferences {
    enableCurrencySymbols?: boolean;
    [key: string]: any;
  }

  // Action Button Interface
  export interface ActionButton {
    [key: string]: any;
  }

  // Tag Interface
  export interface Tag {
    [key: string]: any;
  }

  // Sorting Interface
  export interface SortingConfig {
    [key: string]: any;
  }

  // Main Grid Props Interface
  export interface GridProps {
    // ===== Core Identifiers =====
    id?: string;

    // ===== Data & Content =====
    data?: object | any[];
    errorData?: object;
    columns?: GridColumn[];
    enrichedData?: object;
    tagsList?: Tag[];
    columnTotals?: any[];

    // ===== Styling & Layout Props =====
    width?: number | string;
    maxWidth?: number | string;
    height?: number | string;
    fillParentHeight?: boolean;
    rowStyle?: object;
    searchStyle?: object;
    footerStyle?: object;
    compact?: boolean;
    responsive?: boolean;
    overflow?: boolean;
    classes?: string;

    // ===== Display & Visibility Flags =====
    showHeader?: boolean;
    showExport?: boolean;
    showInlineExport?: boolean;
    showVerticalDividers?: boolean;
    showViewFilter?: boolean;
    showReload?: boolean;
    showShowHideColumns?: boolean;
    showPageSize?: boolean;
    showPagination?: boolean;
    hideCaption?: boolean;
    hideRecordCount?: boolean;
    showColumnClickHighlighting?: boolean;
    borderlessLoader?: boolean;
    loaderTopPadding?: number;

    // ===== State Flags =====
    disabled?: boolean;
    editable?: boolean;
    isLoading?: boolean;
    isMobile?: boolean;
    isPageData?: boolean;
    selectable?: boolean;
    draggable?: boolean;
    reorderColumns?: boolean;
    canDelete?: boolean;
    confirmDeletion?: boolean;

    // ===== Caption & Header =====
    caption?: string;
    actionButton?: ActionButton;

    // ===== Search & Filtering =====
    searchValue?: string;
    searchable?: boolean;
    focusSearchInputOnLoad?: boolean;
    hasAdvancedSearch?: boolean;
    chipsFilterCount?: number;
    advancedSearchExpression?: AdvancedSearchExpression;
    defaultAdvancedSearchOpen?: boolean;
    chipsData?: ChipsData[];
    forcedTimeZone?: string;

    // ===== Selection & Records =====
    selectedRecordIds?: number[];
    selectedRows?: any[];
    selectedView?: string;
    invertSelection?: boolean;
    rowStatuses?: number[];
    deletedRecords?: any[];
    rowRecordIds?: any[];
    totalRecords?: number;

    // ===== View & Filters =====
    viewFilters?: ViewFilter[] | [string, ViewFilter[]][];
    defaultViewFilter?: string;
    viewResetButtonVisible?: boolean;
    isCustomViewEnabled?: boolean;
    egCustomViewsSaveButtonEnabled?: boolean;
    isAdminOrCustomizer?: boolean;
    currentViewType?: string;
    canEditSharedView?: boolean;
    viewType?: string;

    // ===== Pagination =====
    pageNumber?: number;
    pageSize?: number;
    isPartialCount?: boolean;
    disableGoToPage?: boolean;

    // ===== Row Actions =====
    addRowsEnabled?: boolean;
    addRowsLabel?: string;

    // ===== Drag & Drop =====
    dragAndDrop?: DragAndDropConfig;
    alwaysShowDragHandles?: boolean;
    showDragOnHover?: boolean;

    // ===== Sorting =====
    sorting?: SortingConfig;

    // ===== Display Preferences & Features =====
    displayPreferences?: DisplayPreferences;
    componentVersion?: string;
    variant?: string;

    // ===== Empty State & Menu =====
    emptyStateComponent?: () => React.ReactNode;
    menuColumn?: MenuColumn[];
    customActions?: CustomAction[];
    tooltipId?: string;
    resetChipsTriggered?: boolean;
    updateChipsInitialValues?: boolean;
    gridPagingWrapperStyle?: object;
    tableWrapperHeight?: string;
    tableWrapperHoverState?: boolean;
    tableBodyBackgroundColor?: string;

    // ===== Event Handlers - Data Operations =====
    onGridSearch?: (searchValue: string | null) => void;
    onExport?: () => void;
    onRefresh?: () => void;
    onAddRows?: () => void;
    onDelete?: (rowIdx: number, primaryKey: any) => void;
    onDeleteConfirmation?: (callback: () => void, context: any) => void;

    // ===== Event Handlers - Row Operations =====
    onRowClick?: (
      rowData: any,
      rowIndex: number,
      fieldType: number | null,
      event: React.MouseEvent | React.KeyboardEvent,
      primaryKey: any,
    ) => void;
    onRowChange?: (rowIndex: number) => void;
    onRenderRow?: (index: number) => React.ReactNode;
    onSetRowStatus?: (rowIndex: number, status: number) => void;
    onOutsideClick?: (rowIndex?: number) => void;

    // ===== Event Handlers - Selection =====
    onSelectAll?: (selected: boolean) => void;
    onSelectedRecords?: (records: any[], rows?: any[], deleted?: any[]) => void;
    onMultiSelect?: (event: React.MouseEvent | React.KeyboardEvent, rowIndex: number) => void;
    onSelect?: (primaryKey: any, rowIndex: number, isChecked: boolean) => void;
    onSelectPage?: (selectAll: boolean) => void;
    onClickMany?: (items?: any[]) => void;

    // ===== Event Handlers - Pagination =====
    onPageChange?: (page: number) => void;
    onPageLengthChange?: (pageSize: number) => void;

    // ===== Event Handlers - Column Operations =====
    onChangeColumnSorting?: (columnName: string, direction: number, source?: string) => void;
    onActiveColumnsChange?: (columns: string[]) => void;
    onReorderColumns?: (sourceColumn: GridColumn, destinationColumn: GridColumn) => void;

    // ===== Event Handlers - View & Filter Operations =====
    onChangeView?: (viewId: string, showSelected?: boolean, event?: React.MouseEvent) => void;
    onShowSelected?: (filter?: ViewFilter) => void;
    onRemoveSelectedView?: (viewId?: string) => void;
    onAdvancedSearchChange?: (expression: AdvancedSearchExpression) => void;
    onFilterToggleAnalytics?: (isOpen: boolean) => void;
    onFetchChipsData?: () => void;
    onClickShowSaveGridViewDialog?: (isEdit?: boolean, onClose?: () => void, view?: ViewFilter) => void;
    onClickResetButton?: () => void;
    onToggleViewVisibility?: (viewId: string, newVisibility: boolean) => void;
    onCustomViewsDragEnd?: (result: any) => void;
    handleCustomViewsManageDoneClick?: () => void;
    onSetDefaultView?: (viewId: string, setAsDefault: boolean) => void;
    onChipFilterApplied?: (filter: any) => void;
    onChipFilterRemoved?: (filter: any) => void;
    onUpdateCurrentView?: (view: any) => void;
    onUpdateSharedView?: (view: any) => void;
    setViewSaveAndResetButtonsVisible?: (visible: boolean) => void;

    // ===== Event Handlers - Drag & Drop =====
    onReorder?: (fromIndex: number, toIndex: number) => void;

    // ===== Event Handlers - Media & Uploads =====
    onUploadImage?: (file: File | any, columnName: string, rowIndex: number, primaryKey: any) => void;
    onErrorMessageForUser?: (message: string) => void;

    // ===== Event Handlers - Custom Actions =====
    onCustomActionClick?: (actionValue: string) => void;
  }

  // Component Exports
  export const Row: React.FC<any>;

  export const Search: React.FC<any>;

  export const Filter: React.FC<any>;

  export const Loader: React.FC<any>;

  // Column PropType export (for backward compatibility)
  export const Column: any;

  // Main Grid Component
  const Grid: React.ComponentType<GridProps>;

  export default Grid;
}
