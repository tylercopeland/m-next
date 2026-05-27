/**
 * Type definitions for Grid wrapper utilities.
 * These types support the grid wrapper functions and integrate with @m-next/grid types.
 */
import type { GridColumn as MOneGridColumn, AdvancedSearchExpression } from '@m-next/grid';
import type { FieldTypeId } from '@m-next/runtime-interface';

// =============================================================================
// COLUMN TYPES
// =============================================================================

/**
 * Format options for a grid column
 */
export interface ColumnFormat {
  alignment?: 'left' | 'center' | 'right' | string;
  headerAlignment?: 'left' | 'center' | 'right' | string;
  type?: string;
  separator?: string | boolean;
  rounding?: number;
  money?: boolean;
  dateType?: string;
  textColor?: string;
  fontSize?: string;
  backgroundColor?: string;
  disabled?: boolean;
  fontWeight?: string;
  width?: 'dynamic' | 'fixed' | 'auto' | string | number;
  widthFixed?: number;
  widthAutoSize?: boolean | string;
}

/**
 * Display options for column data presentation
 */
export interface ColumnDisplayOptions {
  trueIcon?: { name: string; color?: string };
  falseIcon?: { name: string; color?: string };
  trueTooltip?: string;
  falseTooltip?: string;
  trueValue?: string;
  falseValue?: string;
  disabledTooltip?: string;
  hoverColor?: string;
  numberFormat?: number;
  icon?: { name: string; color?: string };
}

/**
 * Card column field configuration
 */
export interface CardColumnFields {
  tagsList?: unknown[];
  hasAvatar?: boolean;
  field1?: ControlColumn | null;
  field2?: ControlColumn | null;
  field3?: ControlColumn | null;
  field4?: ControlColumn | null;
  field5?: ControlColumn | null;
  field6?: ControlColumn | null;
}

/**
 * Control definition for dropdown and other controls embedded in columns
 */
export interface ColumnControl {
  id?: string;
  caption?: string;
  model?: unknown;
  [key: string]: unknown;
}

/**
 * Supporting column configuration
 */
export interface SupportingColumns {
  [key: string]: unknown;
}

/**
 * Column definition from the backend control
 */
export interface ControlColumn {
  field: string;
  header: string;
  fieldType: FieldTypeId;
  columnType?: number;
  format: ColumnFormat;
  readOnly?: boolean;
  showOnMobile?: boolean;
  hasColumnTotal?: boolean;
  displayAs?: 'icon' | 'custom' | 'pill';
  displayOptions?: ColumnDisplayOptions;
  showHeader?: boolean;
  control?: ColumnControl;
  cardColumnFields?: CardColumnFields | unknown[];
  supportingColumns?: SupportingColumns;
  onClickEvent?: boolean;
}

// =============================================================================
// VIEW TYPES
// =============================================================================

/**
 * Column visibility configuration in a view
 */
export interface ViewColumn {
  field: string;
  visible: boolean;
}

/**
 * View definition from the control
 */
export interface ControlView {
  id: string;
  name: string;
  columns: ViewColumn[];
  sorting?: SortingConfig[];
  filtering?: FilterExpression[];
  advancedFiltering?: FilterExpression[];
  standardFiltering?: FilterExpression[];
  searchString?: string | null;
  enableDynamicDates?: boolean;
  isVisible?: boolean;
  isHidden?: boolean;
  isShared?: boolean;
  isDefault?: boolean;
  userID?: string;
  UserID?: string;
}

/**
 * Sorting configuration
 */
export interface SortingConfig {
  filterField?: string;
  filterOrder?: 'asc' | 'desc';
  sortField?: string;
  sortType?: number;
  [key: string]: unknown;
}

/**
 * Filter expression for views
 */
export interface FilterExpression {
  operation?: string | number;
  key?: string;
  source?: unknown;
  dateField?: string;
  additionalSources?: unknown;
  [key: string]: unknown;
}

/**
 * All views display state structure
 */
export interface AllViewsDisplayState {
  customViews: ControlView[];
  sharedViews: ControlView[];
  standardViews: ControlView[];
}

/**
 * View filter options for display (grouped by type)
 */
export type ViewFilterOptions = [string, ControlView[]][];

// =============================================================================
// CONTROL TYPES
// =============================================================================

/**
 * Model containing custom and shared views
 */
export interface ControlModel {
  customViews?: ControlView[];
  sharedViews?: ControlView[];
  [key: string]: unknown;
}

/**
 * Grid control definition from the backend
 */
export interface GridControlDef {
  id?: string;
  name?: string;
  caption?: string;
  columns?: ControlColumn[];
  viewList?: ControlView[];
  viewFilter?: string;
  defaultViewFilter?: string;
  viewFriendlyName?: string;
  model?: ControlModel;
  isReadOnly?: boolean;
  isSearchable?: boolean;
  isCustomViewEnabled?: boolean;
  sorting?: SortingConfig;
  onRowClick?: (() => void) | null;
  onActiveRowChange?: (() => void) | null;
  activeColumns?: string[];
  newRowsCount?: number;
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

/**
 * Runtime context provided by the application
 */
export interface RuntimeContext {
  applicationType?: string;
  isAdminOrCustomizer?: boolean;
  showMessageDialog?: (config: MessageDialogConfig) => void;
  bulkUpdateControls?: (updates: ControlUpdate[]) => void;
  uploadGridImage?: (
    formData: FormData,
    field: string,
    rowIdx: number,
    filename: string,
    recordId: string | number,
    onStart: (rowIdx: number, field: string, filename: string) => void,
    onProgress: (event: ProgressEvent, rowIdx: number, field: string) => void,
    onSuccess: (res: UploadResponse, rowIdx: number, field: string, recordId: string | number) => void,
    onError: (e: UploadError, rowIdx: number, field: string) => string,
    onCancel: (rowIdx: number, field: string) => void,
  ) => void;
  loadDropdownData?: (control: ColumnControl, searchText?: string | null, page?: number, append?: boolean) => void;
  getDropdownData?: (id: string) => DropdownData | null;
  loadCustomViewsData?: (gridId: string, viewFriendlyName: string) => Promise<CustomViewsData>;
  saveCustomView?: (filterData: FilterData, onSuccess: (data: SaveResult) => void, onError: () => void) => void;
  updateCustomView?: (filterData: FilterData, onSuccess: (data: SaveResult) => void, onError: () => void) => void;
  deleteCustomView?: (filterData: DeleteFilterData, onSuccess: (data: DeleteResult) => void) => void;
  setDefaultView?: (viewId: string, gridId: string, onSuccess: (data: SaveResult) => void) => void;
  updateCustomViewsOrder?: (viewOrder: string[], gridId: string, isShared: boolean) => void;
  processAnalytics?: (eventType: string, data: AnalyticsData) => void;
  [key: string]: unknown;
}

/**
 * Screen data context for managing screen state
 */
export interface ScreenDataContext {
  isDirty?: boolean;
  setIsDirty?: (isDirty: boolean) => void;
  methodIdentity?: string;
  closeDialog?: () => void;
  [key: string]: unknown;
}

// =============================================================================
// HANDLER TYPES
// =============================================================================

/**
 * Handler for column click events
 */
export type ColumnClickHandler = (
  e: React.MouseEvent<HTMLTableCellElement>,
  columnName: string,
  value: unknown,
  column: MOneGridColumn,
  rowIndex: number,
  primaryKey: string | number,
) => void;

/**
 * Handler for column change events
 */
export type ColumnChangeHandler = (
  columnName: string,
  value: unknown,
  column: MOneGridColumn | ControlColumn | { onChangeEvent?: unknown },
  rowIndex: number,
  primaryKey: string | number,
) => void;

// =============================================================================
// API & DATA TYPES
// =============================================================================

/**
 * Message dialog configuration
 */
export interface MessageDialogConfig {
  id: string;
  hasOutsideClick?: boolean;
  hideDismissButton?: boolean;
  heading: string;
  message: string;
  onCancelLabel?: string;
  onCancelCallback?: () => void;
  onConfirmLabel?: string;
  onConfirmCallback?: (() => void) | null;
  onDismissFocusId?: string;
  onConfirmFocusId?: string;
}

/**
 * Control update for bulk operations
 */
export interface ControlUpdate {
  id?: string;
  controlId?: string;
  property: string;
  value: unknown;
}

/**
 * Upload response from the server
 */
export interface UploadResponse {
  data: {
    url: string;
    [key: string]: unknown;
  };
}

/**
 * Upload error response
 */
export interface UploadError {
  data?: string;
  status?: number;
}

/**
 * Dropdown data structure
 */
export interface DropdownData {
  data?: Record<string, unknown>[];
  totalRows?: number;
  [key: string]: unknown;
}

/**
 * Custom views data from API
 */
export interface CustomViewsData {
  myViews: ApiViewItem[];
  sharedViews: ApiViewItem[];
}

/**
 * View item from API response
 */
export interface ApiViewItem {
  filter?: ApiFilter;
  isShared?: boolean;
  userID?: string;
}

/**
 * API filter structure
 */
export interface ApiFilter {
  filterId: string;
  filterName: string;
  viewName?: string;
  expression?: FilterExpression[];
  advancedExpression?: FilterExpression[];
  standardExpression?: FilterExpression[];
  versionId?: string;
  sorting?: SortingConfig[];
  searchString?: string;
  isDefault?: boolean;
  isHidden?: boolean;
  hidden?: string[];
  visibleColumns?: string[];
}

/**
 * Filter data for save/update operations
 */
export interface FilterData {
  newFilter?: ApiFilter;
  updatedFilter?: ApiFilter;
  gridId?: string;
  isShared?: boolean;
  viewFriendlyName?: string;
  stockViewCount?: number;
  gridName?: string;
}

/**
 * Delete filter data
 */
export interface DeleteFilterData {
  filter: {
    filterId: string;
    filterName: string;
    viewName?: string;
    expression?: FilterExpression[];
    advancedExpression?: FilterExpression[];
    standardExpression?: FilterExpression[];
    isDefault?: boolean;
  };
  gridId?: string;
  isShared?: boolean;
  viewFriendlyName?: string;
  stockViewCount?: number;
  gridName?: string;
}

/**
 * Save operation result
 */
export interface SaveResult {
  saveSuccess?: boolean;
  isDuplicate?: boolean;
  validationMessage?: string;
}

/**
 * Delete operation result
 */
export interface DeleteResult {
  deleteSuccess?: boolean;
}

/**
 * Analytics data structure
 */
export interface AnalyticsData {
  Action?: string;
  Source?: string;
  viewName?: string;
  isDefaultView?: boolean;
  shareSettings?: string;
  gridName?: string;
  gridBaseTable?: string;
  [key: string]: unknown;
}

// =============================================================================
// IMAGE UPLOAD TYPES
// =============================================================================

/**
 * Enriched data for grid cells (metadata like upload progress)
 */
export interface EnrichedData {
  [rowIdx: number]: {
    [field: string]: FieldMetadata;
  };
}

/**
 * Field metadata for enriched data
 */
export interface FieldMetadata {
  progress?: number;
  uploading?: boolean;
  filename?: string;
  error?: string;
}

/**
 * Image upload handlers
 */
export interface ImageUploadHandlers {
  handleStartUpload: (rowIdx: number, field: string, filename: string) => void;
  handleUploadProgress: (progressEvent: ProgressEvent, rowIdx: number, field: string) => void;
  handleUploadSuccess: (res: UploadResponse, rowIdx: number, field: string, recordId: string | number) => void;
  handleUploadError: (e: UploadError, rowIdx: number, field: string) => string;
  handleUploadCancel: (rowIdx: number, field: string) => void;
}

// =============================================================================
// DROPDOWN CELL TYPES
// =============================================================================

/**
 * Props for GridDropdownCell component
 */
export interface GridDropdownCellProps {
  id?: string;
  column: MOneGridColumn;
  value?: DropdownValue | string | number | null;
  rowIdx?: number;
  primaryKey?: string | number;
  isFocused?: boolean;
  col: ControlColumn;
  columnChangeHandler?: ColumnChangeHandler;
  loadDropdownDataFn?: (control: ColumnControl, searchText?: string | null, page?: number, append?: boolean) => void;
  getDropdownDataFn?: (id: string) => DropdownData | null;
}

/**
 * Dropdown value structure
 */
export interface DropdownValue {
  text?: string;
  value?: string | number;
}

/**
 * Dropdown option for select components
 */
export interface DropdownOption {
  value: string | number | boolean;
  label: string;
}

// =============================================================================
// CUSTOM VIEWS HOOK TYPES
// =============================================================================

/**
 * Parameters for useCustomViews hook
 */
export interface UseCustomViewsParams {
  control: GridControlDef | null | undefined;
  id: string;
  isRuntimeMode: boolean;
  runtimeContext: RuntimeContext | null | undefined;
  screenDataContext: ScreenDataContext | null | undefined;
  currentViewFilter: string;
  columns: MOneGridColumn[] | null | undefined;
  advancedSearchExpression: AdvancedSearchExpression | null | undefined;
  initialSorting: SortingConfig[] | null | undefined;
}

/**
 * Return type for useCustomViews hook
 */
export interface UseCustomViewsReturn {
  // State
  allViewsDisplayState: AllViewsDisplayState;
  setAllViewsDisplayState: React.Dispatch<React.SetStateAction<AllViewsDisplayState>>;
  viewFilterOptions: ViewFilterOptions;
  viewListReady: boolean;
  isCustomViewEnabled: boolean;
  egCustomViewsSaveButtonEnabled: boolean;
  isCustomViewsReordered: boolean;
  isSharedViewsReordered: boolean;

  // Computed
  currentView: ControlView | null | undefined;
  currentViewType: 'custom' | 'shared' | 'standard';
  canEditSharedView: boolean;
  displayViewList: ControlView[] | ViewFilterOptions;
  shouldEnableCustomViews: () => boolean;

  // Handlers
  handleSaveCustomViewClick: (
    filterName: string,
    setAsDefault: boolean,
    shareOption: 'me' | 'everyone',
    onValidation: ((message: string) => void) | null,
    handleChangeView?: (viewId: string, showSelected?: boolean, skipDirtyCheck?: boolean) => void,
  ) => void;
  handleUpdateCustomViewClick: (
    updatedFilterId: string,
    filterName: string,
    setAsDefault: boolean | null,
    shareOption: 'me' | 'everyone' | 'personal',
    expression: FilterExpression[] | null | undefined,
    advancedExpression: FilterExpression[] | null | undefined,
    standardExpression: FilterExpression[] | null | undefined,
    onValidation: ((message: string) => void) | null,
    isHidden?: boolean,
    viewToUpdate?: ControlView,
  ) => void;
  handleDeleteCustomViewClick: (viewId: string) => void;
  handleUpdateCurrentView: () => void;
  handleUpdateSharedView: () => void;
  handleToggleViewVisibility: (viewId: string, isVisible: boolean) => void;
  handleSetDefaultView: (viewId: string, setAsDefault: boolean) => void;
  handleCustomViewsDragEnd: (result: DragEndResult) => void;
  handleCustomViewsManageDoneClick: () => void;
  rebuildMergedViewList: (updatedState: AllViewsDisplayState) => void;

  // Utilities
  processCustomViewsData: () => void;
  getValidationMessage: (data: SaveResult) => string;
}

/**
 * Drag end result from react-beautiful-dnd
 */
export interface DragEndResult {
  destination?: {
    index: number;
    droppableId: string;
  };
  source: {
    index: number;
    droppableId: string;
  };
}

// =============================================================================
// BUILD COLUMN LIST TYPES
// =============================================================================

/**
 * Parameters for buildColumnList function
 */
export interface BuildColumnListParams {
  control: GridControlDef | null | undefined;
  currentView: ControlView | null | undefined;
  isRuntimeMode: boolean;
  handleColumnClickEvent: ColumnClickHandler | null;
  handleColumnChangeEvent: ColumnChangeHandler;
  runtimeContext?: RuntimeContext | null;
}

// =============================================================================
// DIRTY SCREEN HANDLER TYPES
// =============================================================================

/**
 * Parameters for createDirtyScreenHandler
 */
export interface CreateDirtyScreenHandlerParams {
  screenDataContext: ScreenDataContext | null | undefined;
  showDirtyScreenAlert: (onConfirm: (() => void) | null, onCancel: () => void) => void;
}

/**
 * Options for dirty screen handler action
 */
export interface DirtyScreenHandlerOptions {
  onConfirm?: (() => void) | null;
  beforeAction?: (() => void) | null;
}

/**
 * Dirty screen handler function type
 */
export type DirtyScreenHandler = (action: () => void, options?: DirtyScreenHandlerOptions) => void;

// =============================================================================
// IMAGE UPLOAD HANDLER TYPES
// =============================================================================

/**
 * Parameters for createImageUploadHandlers
 */
export interface CreateImageUploadHandlersParams {
  getEnrichedData: () => EnrichedData;
  setEnrichedData: (data: EnrichedData) => void;
  handleColumnChangeEvent: ColumnChangeHandler;
}

/**
 * Parameters for createUploadImageHandler
 */
export interface CreateUploadImageHandlerParams {
  isRuntimeMode: boolean;
  getEnrichedData: () => EnrichedData;
  setEnrichedData: (data: EnrichedData) => void;
  runtimeContext: RuntimeContext | null | undefined;
  uploadHandlers: ImageUploadHandlers;
}

/**
 * Upload image handler function type
 */
export type UploadImageHandler = (file: File, field: string, rowIdx: number, recordId: string | number) => void;
