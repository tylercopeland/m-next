/**
 * Type definitions for Chart wrapper.
 * These types support the chart wrapper functions and integrate with chart components.
 */

import type { ActionHandler } from '../../actions/types';

// =============================================================================
// CHART CONTROL TYPES
// =============================================================================

/**
 * Chart column definition
 */
export interface ChartColumn {
  name?: string;
  aggregate?: number;
  fieldType?: number;
  dateGroupBy?: number;
  onClick?: unknown;
}

/**
 * Chart view filter
 */
export interface ChartViewFilter {
  expression?: unknown[];
  filterId?: string;
}

/**
 * Drilldown projection field
 */
export interface DrilldownProjectionField {
  name?: string;
  caption?: string;
  type?: number;
}

/**
 * Drilldown projection configuration
 */
export interface DrilldownProjection {
  fields?: DrilldownProjectionField[];
  sorting?: Array<unknown>;
}

/**
 * Chart labels configuration
 */
export interface ChartLabels {
  primary?: string;
  secondary?: string;
}

/**
 * Chart model definition
 */
export interface ChartModel {
  chart?: number;
  columns?: ChartColumn[];
  viewFilter?: ChartViewFilter;
  viewName?: string;
  drilldownEnabled?: boolean;
  drilldownProjection?: DrilldownProjection;
  colors?: string[];
  dataPoints?: unknown;
  labels?: ChartLabels;
  hasDynamicDates?: boolean;
  dynamicDateRange?: number | null;
}

/**
 * Chart control definition
 */
export interface ChartControl {
  id?: string;
  model?: ChartModel;
  isEditing?: boolean;
  disabled?: boolean;
  isWorking?: boolean;
  hideCaption?: boolean;
  caption?: string;
  componentVersion?: string;
  type?: string;
  onEventClick?: unknown;
  onRowClick?: unknown;
  visible?: boolean;
}

// =============================================================================
// CHART WRAPPER PROPS
// =============================================================================

/**
 * Props for ChartWrapperRedux component
 */
export interface ChartWrapperReduxProps {
  id: string;
  control?: ChartControl;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  containerWidth?: number;
  isSelected?: boolean;
  actionHandler?: ActionHandler | null;
  screenId?: string;
  recordId?: string | number;
  screenState?: Record<string, unknown>;
}

// =============================================================================
// CHART DATA TYPES
// =============================================================================

/**
 * Chart data response
 */
export interface ChartData {
  categories?: unknown[];
  series?: unknown[];
}

/**
 * Point click event
 */
export interface PointClickEvent {
  point: {
    name?: string;
    category?: string;
    selected?: boolean;
  };
}

/**
 * Row click event
 */
export interface RowClickEvent {
  RecordID?: string | number;
  rowIndex?: number;
}

/**
 * Grid data row
 */
export interface GridDataRow {
  [key: string]: unknown;
}

/**
 * Chips data query parameters
 */
export interface ChipsDataQueryParams {
  field: string | null;
  searchString: string | null;
}

// =============================================================================
// CHART CONFIGURATION TYPES
// =============================================================================

/**
 * Chart type mapping
 */
export interface ChartTypes {
  [key: number]: string;
}

/**
 * V3 color palette
 */
export interface V3Colors {
  pink: string;
  blue: string;
  aqua: string;
  purple: string;
  green: string;
  yellow: string;
  orange: string;
  red: string;
}

/**
 * Month number mapping
 */
export interface MonthNumbers {
  [key: string]: string;
}

/**
 * Chart size configuration
 */
export interface ChartSize {
  width: number;
  height: number;
}

/**
 * Number format type
 */
export type NumberFormat = 'integer' | 'decimal' | 'currency' | null;

// =============================================================================
// DRILLDOWN TYPES
// =============================================================================

/**
 * Projection column for drilldown grid
 */
export interface ProjectionColumn {
  name: string;
  field: string;
  caption: string;
  visible: boolean;
  editable: boolean;
  fieldType: number;
}

/**
 * Advanced search expression (chip filters) - matches backend searchFilter shape
 */
export interface AdvancedSearchExpression {
  simple?: unknown[];
  advanced?: unknown[];
}

/**
 * Grid model for drilldown
 */
export interface GridModel {
  id?: string;
  type: string;
  viewFriendlyName?: string;
  defaultViewFilter?: string;
  viewFilter?: string;
  viewList: Array<{
    id?: string;
    name: string;
    columns: Array<{ field: string; visible: boolean }>;
    filtering: unknown[];
  }>;
  paging: {
    pageNumber: number;
    pageSize: number;
  };
  columns: ProjectionColumn[];
  searchString: string | null;
  /** Chip/advanced search filters - sent to API as searchFilter */
  searchFilter?: AdvancedSearchExpression | null;
  sorting: unknown;
}

/**
 * Raw grid data response
 */
export interface RawGridData {
  partialRowCount?: number;
  totalRows?: number;
  dataSource?: Array<{
    cells?: Array<{
      name?: string;
      value?: unknown;
      text?: string;
      validationError?: unknown;
    }>;
  }>;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

// =============================================================================
// INJECTED CHART APIs (provided by host app – no direct package imports)
// =============================================================================

/** Designer chart data result (e.g. from RTK Query) – injected by host */
export interface DesignerChartDataResult {
  data: { categories?: unknown[]; series?: unknown[] } | null;
  error: unknown;
  isLoading: boolean;
}

/** Chart validation API – injected by host so layout-canvas does not import app-builder/criteria-builder */
export interface ChartValidationApi {
  parseExpression: (expression: unknown[]) => unknown;
  validateChart: (control: ChartControl | null) => { isValid: boolean };
  validateExpression: (parsedExpression: unknown) => { isValid: boolean };
}

/** Field type IDs for drilldown grid – injected by host so layout-canvas does not import @m-next/types */
export interface ChartFieldTypesApi {
  fieldTypeIds: { Integer: number; DropDown: number };
  fieldTypeIdLookup: (typeId: number) => number;
}

/** Designer drilldown API (grid/tags/chips) – injected by host so layout-canvas does not import app-builder */
export interface DesignerDrilldownApi {
  gridDataResult: { data: RawGridData | null; isFetching?: boolean };
  totalRecordsMutation: (arg: {
    dataModelId: string;
    screenId?: string;
    activeRecordId?: string;
    body?: Record<string, unknown>;
  }) => { unwrap: () => Promise<number> };
  chipsDataResult: { data: unknown };
  tagSuggestionsResult: { data: unknown; isLoading?: boolean };
}

/** Request params for drilldown data – hook publishes this so host can run queries */
export interface DesignerDrilldownRequest {
  controlId: string;
  screenId: string | null;
  activeRecordId: string | null;
  gridModel: GridModel | null;
  chipsDataQueryParams: { field: string | null; searchString: string | null };
  isValid: boolean;
  expanded: boolean;
}

/**
 * Return type for useChartControl hook
 */
export interface UseChartControlReturn {
  control: ChartControl | null;
  isRuntimeMode: boolean;
}

/**
 * Return type for useChartData hook
 */
export interface UseChartDataReturn {
  categories: unknown[] | null;
  series: unknown[] | null;
  isLoading: boolean;
  error: unknown;
}

/**
 * Return type for useChartConfiguration hook
 */
export interface UseChartConfigurationReturn {
  chartType: string | null;
  chartColors: string[] | null;
  numberFormat: NumberFormat;
  allowDecimals: boolean;
  refreshChart: boolean;
}

/**
 * Return type for useChartSize hook
 */
export interface UseChartSizeReturn {
  chartSize: ChartSize;
  wrapperRef: React.RefObject<HTMLDivElement>;
}

/**
 * Return type for useChartValidation hook
 */
export interface UseChartValidationReturn {
  isValid: boolean;
  expanded: boolean;
}

/**
 * Return type for useChartDrilldown hook
 */
export interface UseChartDrilldownReturn {
  gridModel: GridModel | null;
  gridData: GridDataRow[] | null;
  totalRecords: number;
  partialRecordCount: number;
  gridIsLoading: boolean;
  pageNumber: number;
  pageSize: number;
  searchString: string | null;
  advancedSearchExpression: AdvancedSearchExpression | null;
  selectedPoint: string | null;
  chipsData: unknown[] | null;
  handleGridClickMany: () => Promise<void>;
  handleGridPageChange: (page: number) => void;
  handleGridPageLengthChange: (size: string | number) => void;
  handleSearch: (search: string) => void;
  handleAdvancedSearch: (value: AdvancedSearchExpression | null) => void;
  handleFetchChipsData: (field: string, value: string) => void;
  tagList: unknown[] | null;
  isLoadingTagList: boolean;
  // Exposed setters for event handlers
  setGridIsLoading: (loading: boolean) => void;
  setHasTotalRecord: (hasTotal: boolean) => void;
  setSearchString: (search: string | null) => void;
}
