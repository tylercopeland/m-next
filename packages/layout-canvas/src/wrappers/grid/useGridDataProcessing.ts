/**
 * Custom hook for processing grid data from API responses.
 * Transforms raw API data into the format expected by the Grid component.
 */
import { useState, useEffect, useRef } from 'react';
import { STATUSES } from '@m-next/grid';
import { FieldTypeIds } from '@m-next/runtime-interface';
import { getColumn } from './columnUtils';
import type { GridControlDef, ControlView, ControlColumn } from './types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Cell data from API response
 */
export interface GridCellData {
  name: string;
  value: unknown;
  text?: string;
  validationError?: string;
}

/**
 * Row data from API response (rows format)
 */
export type GridRowData = GridCellData[];

/**
 * DataSource row format (alternative API format)
 */
export interface DataSourceRow {
  cells: GridCellData[];
  [key: string]: unknown;
}

/**
 * Raw grid data from API
 */
export interface RawGridData {
  rows?: GridRowData[];
  dataSource?: DataSourceRow[];
  status?: number[];
  count?: number;
  totalRows?: number;
  partialRowCount?: number;
  partialCount?: number;
  newRow?: Record<string, unknown> | null;
  _lastUpdated?: number;
  [key: string]: unknown;
}

/**
 * Processed row data for the Grid component
 */
export interface ProcessedRowData {
  [columnName: string]: unknown;
}

/**
 * Processed error data for the Grid component
 */
export interface ProcessedErrorData {
  [columnName: string]: string;
}

/**
 * Parameters for useGridDataProcessing hook
 */
export interface UseGridDataProcessingParams {
  /** Raw grid data from runtime context */
  runtimeGridData: RawGridData | null | undefined;
  /** Raw grid data from designer API */
  designerData: RawGridData | null | undefined;
  /** Whether the designer API is currently fetching */
  isFetching: boolean;
  /** Current view configuration */
  currentView: ControlView | null | undefined;
  /** Current view filter ID */
  currentViewFilter: string | null;
  /** Grid control definition */
  control: GridControlDef | null | undefined;
  /** Grid control ID */
  controlId: string;
}

/**
 * Return type for useGridDataProcessing hook
 */
export interface UseGridDataProcessingReturn {
  /** Processed grid data rows */
  gridData: ProcessedRowData[] | null;
  /** Set grid data (for manual updates like cell changes) */
  setGridData: React.Dispatch<React.SetStateAction<ProcessedRowData[] | null>>;
  /** Error data per cell */
  errorData: ProcessedErrorData[] | null;
  /** Row status indicators */
  rowStatuses: number[];
  /** Record IDs for each row */
  rowRecordIds: (string | number)[];
  /** Column totals for numeric columns */
  columnTotals: (number | null)[];
  /** Total record count */
  totalRecords: number;
  /** Partial record count (when full count unavailable) */
  partialRecordCount: number;
  /** New row template */
  newRow: Record<string, unknown> | null;
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Set loading state */
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Initializes column totals array based on view columns.
 * Only numeric columns (Decimal, Integer, Money) get totals.
 */
const initializeColumnTotals = (currentView: ControlView, control: GridControlDef): (number | null)[] => {
  return currentView.columns.map((viewCol) => {
    const column = control.columns?.find((x) => x.field === viewCol.field);
    if (!column) return null;
    if (
      column.fieldType === FieldTypeIds.Decimal ||
      column.fieldType === FieldTypeIds.Integer ||
      column.fieldType === FieldTypeIds.Money
    ) {
      return 0;
    }
    return null;
  });
};

/**
 * Processes a single cell value based on column type.
 */
const processCellValue = (cell: GridCellData, col: ControlColumn): unknown => {
  switch (col.fieldType) {
    case FieldTypeIds.DropDown:
    case FieldTypeIds.MultiSelectDropDown:
      return { text: cell.text, value: cell.value };
    default:
      return cell.value;
  }
};

/**
 * Adds display value for columns with numberFormat option.
 */
const addDisplayValue = (rowData: ProcessedRowData, cell: GridCellData, col: ControlColumn): void => {
  if (col.displayOptions?.numberFormat === 1) {
    rowData[`${cell.name}_displayValue`] = cell.text;
  }
};

/**
 * Updates column total for numeric columns.
 */
const updateColumnTotal = (totals: (number | null)[], colIndex: number, cellValue: unknown): void => {
  if (colIndex >= 0 && totals[colIndex] !== null) {
    const numValue = Number(cellValue);
    if (!Number.isNaN(numValue) && cellValue) {
      totals[colIndex] = (totals[colIndex] || 0) + parseFloat(String(cellValue));
    }
  }
};

/**
 * Processes grid rows in the standard "rows" format.
 */
const processRowsFormat = (
  rawGridData: RawGridData,
  currentView: ControlView,
  control: GridControlDef,
): {
  cleanData: ProcessedRowData[];
  cleanErrorData: ProcessedErrorData[];
  recordIds: (string | number)[];
  totals: (number | null)[];
} => {
  const cleanData: ProcessedRowData[] = [];
  const cleanErrorData: ProcessedErrorData[] = [];
  const recordIds: (string | number)[] = [];
  const totals = initializeColumnTotals(currentView, control);

  rawGridData.rows?.forEach((element, index) => {
    const rowData: ProcessedRowData = {};
    const rowErrorData: ProcessedErrorData = {};

    // Extract record ID
    if (rawGridData.status?.[index] === STATUSES.blank) {
      recordIds.push(-1);
    } else {
      const recordIdCell = element.find((x) => x.name === 'RecordID');
      const recordId = recordIdCell?.value ?? -1;
      recordIds.push(recordId as string | number);
    }

    // Process each cell
    element.forEach((cell) => {
      const col = getColumn(cell.name, control);
      if (col) {
        // Set cell value
        rowData[cell.name] = processCellValue(cell, col);

        // Add display value if needed
        addDisplayValue(rowData, cell, col);

        // Add validation error if present
        if (cell.validationError) {
          rowErrorData[cell.name] = cell.validationError;
        }

        // Update column total
        const colIndex = currentView.columns.findIndex((v) => v.field === col.field);
        updateColumnTotal(totals, colIndex, cell.value);
      }
    });

    cleanData.push(rowData);
    cleanErrorData.push(rowErrorData);
  });

  return { cleanData, cleanErrorData, recordIds, totals };
};

/**
 * Processes grid data in the "dataSource" format (alternative API format).
 */
const processDataSourceFormat = (
  rawGridData: RawGridData,
  currentView: ControlView,
  control: GridControlDef,
): {
  cleanData: ProcessedRowData[];
  cleanErrorData: ProcessedErrorData[];
  totals: (number | null)[];
} => {
  const cleanData: ProcessedRowData[] = [];
  const cleanErrorData: ProcessedErrorData[] = [];
  const totals = initializeColumnTotals(currentView, control);

  rawGridData.dataSource?.forEach((element) => {
    const rowData: ProcessedRowData = {};
    const rowErrorData: ProcessedErrorData = {};

    element.cells.forEach((cell, index) => {
      const col = getColumn(cell.name, control);
      if (col) {
        // Set cell value
        rowData[cell.name] = processCellValue(cell, col);

        // Add display value if needed
        addDisplayValue(rowData, cell, col);

        // Add validation error if present
        if (cell.validationError) {
          rowErrorData[cell.name] = cell.validationError;
        }

        // Update column total
        if (totals[index] !== null) {
          const numValue = Number(cell.value);
          if (!Number.isNaN(numValue) && cell.value) {
            totals[index] = (totals[index] || 0) + parseFloat(String(cell.value));
          }
        }
      }
    });

    cleanData.push(rowData);
    cleanErrorData.push(rowErrorData);
  });

  return { cleanData, cleanErrorData, totals };
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for processing grid data from API responses.
 * Handles both "rows" format and "dataSource" format.
 *
 * @param params - Configuration parameters
 * @returns Processed grid data and state setters
 */
export const useGridDataProcessing = ({
  runtimeGridData,
  designerData,
  isFetching,
  currentView,
  currentViewFilter,
  control,
  controlId,
}: UseGridDataProcessingParams): UseGridDataProcessingReturn => {
  // State
  const [gridData, setGridData] = useState<ProcessedRowData[] | null>(null);
  const [errorData, setErrorData] = useState<ProcessedErrorData[] | null>(null);
  const [rowStatuses, setRowStatuses] = useState<number[]>([]);
  const [rowRecordIds, setRowRecordIds] = useState<(string | number)[]>([]);
  const [columnTotals, setColumnTotals] = useState<(number | null)[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [partialRecordCount, setPartialRecordCount] = useState(0);
  const [newRow, setNewRow] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track last processed data to avoid unnecessary re-processing (runtime only)
  const lastProcessedKeyRef = useRef<string | null>(null);

  // Process grid data when received
  useEffect(() => {
    const rawGridData = runtimeGridData || designerData;
    const isRuntimeData = !!runtimeGridData;
    const blankLinesCount = control?.newRowsCount || 3;
    const blankLines = Array.from({ length: blankLinesCount }, () => ({}));
    const blankLineStatues = Array.from({ length: blankLinesCount }, () => STATUSES.blank);

    // If fetching, clear data

    // Process "rows" format
    if (rawGridData && rawGridData.rows) {
      // For runtime data, use caching key to avoid unnecessary re-processing
      // For designer data, always reprocess when isFetching changes (handled by dependency array)
      if (isRuntimeData) {
        const dataKey = `${controlId}-${currentViewFilter}-${rawGridData._lastUpdated || ''}-rows-${rawGridData.rows.length}`;
        if (lastProcessedKeyRef.current === dataKey) {
          return;
        }
        lastProcessedKeyRef.current = dataKey;
      }

      try {
        setIsLoading(false);
        const showBlankLines = !isRuntimeData && rawGridData.rows.length === 0 && !control?.isReadOnly;
        setPartialRecordCount(rawGridData.partialRowCount || rawGridData.partialCount || 0);
        setRowStatuses(showBlankLines ? blankLineStatues : rawGridData.status || rawGridData.rows.map(() => 0));
        setTotalRecords(rawGridData.count || rawGridData.totalRows || 0);

        if (!currentView) return;

        const { cleanData, cleanErrorData, recordIds, totals } = processRowsFormat(rawGridData, currentView, control!);

        setRowRecordIds(recordIds);
        setGridData(showBlankLines ? blankLines : cleanData);
        setErrorData(cleanErrorData);
        setColumnTotals(totals);
        setNewRow(rawGridData.newRow || null);
      } catch {
        // Error processing grid data - fail silently
      }
      return;
    }

    // Process "dataSource" format (fallback)
    if (rawGridData && rawGridData.dataSource) {
      // For runtime data, use caching key to avoid unnecessary re-processing
      if (isRuntimeData) {
        const dataKey = `${controlId}-${currentViewFilter}-dataSource-${rawGridData.dataSource.length}`;
        if (lastProcessedKeyRef.current === dataKey) {
          return;
        }
        lastProcessedKeyRef.current = dataKey;
      }

      try {
        const showBlankLines = !isRuntimeData && rawGridData.dataSource.length === 0 && !control?.isReadOnly;
        setPartialRecordCount(rawGridData.partialRowCount || rawGridData.partialCount || 0);
        setRowStatuses(showBlankLines ? blankLineStatues : rawGridData.dataSource.map(() => 0));
        setTotalRecords(rawGridData.count || rawGridData.totalRows || 0);

        if (!currentView) return;

        const { cleanData, cleanErrorData, totals } = processDataSourceFormat(rawGridData, currentView, control!);

        setGridData(showBlankLines ? blankLines : cleanData);
        setErrorData(cleanErrorData);
        setColumnTotals(totals);
      } catch {
        // Error processing grid dataSource - fail silently
      }
    }
  }, [
    isFetching,
    designerData,
    runtimeGridData?._lastUpdated,
    currentViewFilter,
    control?.columns,
    control,
    runtimeGridData,
    controlId,
    currentView,
  ]);

  return {
    gridData,
    setGridData,
    errorData,
    rowStatuses,
    rowRecordIds,
    columnTotals,
    totalRecords,
    partialRecordCount,
    newRow,
    isLoading,
    setIsLoading,
  };
};

export default useGridDataProcessing;
