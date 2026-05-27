import React, { useCallback, useEffect, useMemo } from 'react';
import { toCamelCase } from '@m-next/utilities';
import Dropdown from '@m-next/dropdown';
import type { GridColumn as MOneGridColumn } from '@m-next/grid';
import { useDropdownSearch } from '../../hooks/useDropdownSearch';
import type {
  ControlColumn,
  ColumnControl,
  ColumnChangeHandler,
  DropdownData,
  DropdownValue,
  DropdownOption,
} from './types';

/**
 * Props for GridDropdownCell component
 */
interface GridDropdownCellProps {
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
 * Camel-cased control type returned from toCamelCase
 */
interface CamelCasedControl {
  id?: string;
  model?: unknown;
  [key: string]: unknown;
}

/**
 * GridDropdownCell - Renders a dropdown in an editable grid cell.
 * Loads options dynamically from the runtime context.
 */
function GridDropdownCell({
  id: cellId,
  column,
  value,
  rowIdx,
  primaryKey,
  isFocused,
  col,
  columnChangeHandler,
  loadDropdownDataFn,
  getDropdownDataFn,
}: GridDropdownCellProps): React.ReactElement {
  const dropdownControl = useMemo<CamelCasedControl | null>(
    () => (col.control ? toCamelCase(col.control) : null),
    [col.control],
  );
  // Get dropdown options from runtime context
  const dropdownData = getDropdownDataFn && dropdownControl?.id ? getDropdownDataFn(dropdownControl.id) : null;

  // Build options array from dropdown data
  const options = useMemo<DropdownOption[]>(() => {
    if (!dropdownData?.data || dropdownData.data.length === 0) {
      return [];
    }

    return dropdownData.data.map((item) => {
      const keys = Object.keys(item);
      // First key is typically the value (RecordID), second is the label
      const firstKey = keys[0];
      const secondKey = keys[1];
      const itemValue = firstKey !== undefined ? item[firstKey] : '';
      const itemLabel = secondKey !== undefined ? item[secondKey] : itemValue;

      return {
        value: itemValue as string | number,
        label: String(itemLabel),
      };
    });
  }, [dropdownData]);

  // Load dropdown data on mount
  // The saga uses takeLatest, so if multiple dropdowns load simultaneously, only one request completes
  // We implement a retry mechanism to handle this case
  useEffect(() => {
    // Skip if data is already cached
    if (dropdownData?.data) {
      return;
    }

    if (!loadDropdownDataFn || !dropdownControl?.model) {
      return;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 500; // ms between retries

    const attemptLoad = (): void => {
      // Check if data has arrived
      const currentData = getDropdownDataFn && dropdownControl?.id ? getDropdownDataFn(dropdownControl.id) : null;
      if (currentData?.data || !isMounted) {
        return; // Data arrived or component unmounted
      }

      // Make the request (use camelCased control for consistent property access)
      if (dropdownControl) {
        loadDropdownDataFn(dropdownControl as ColumnControl);
      }
      retryCount++;

      // Schedule a retry check if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        setTimeout(() => {
          if (isMounted) {
            const dataAfterWait =
              getDropdownDataFn && dropdownControl?.id ? getDropdownDataFn(dropdownControl.id) : null;
            if (!dataAfterWait?.data) {
              attemptLoad(); // Retry
            }
          }
        }, retryDelay);
      }
    };

    // Start the first attempt
    attemptLoad();

    return () => {
      isMounted = false;
    };
  }, [loadDropdownDataFn, dropdownControl?.id, dropdownControl?.model, getDropdownDataFn, col.control]); // Removed dropdownData to avoid re-triggering

  // --- Search & Pagination via shared hook ---
  const runtimeLoadData = useCallback(
    (searchText: string | null, page: number, append: boolean) => {
      if (loadDropdownDataFn && dropdownControl) {
        loadDropdownDataFn(dropdownControl as ColumnControl, searchText, page, append);
      }
    },
    [loadDropdownDataFn, dropdownControl],
  );

  const getTotalRows = useCallback(() => {
    if (getDropdownDataFn && dropdownControl?.id) {
      return getDropdownDataFn(dropdownControl.id)?.totalRows || 0;
    }
    return 0;
  }, [getDropdownDataFn, dropdownControl?.id]);

  const { handleInputChange, handleMenuScrollToBottom, serverSideFilterOption, resetAndReload } = useDropdownSearch({
    loadData: runtimeLoadData,
    getTotalRows,
    enabled: !!loadDropdownDataFn && !!dropdownControl,
  });

  const handleMenuOpen = useCallback(() => {
    resetAndReload();
  }, [resetAndReload]);

  // Convert cell value to dropdown format
  const selectedValue = useMemo<DropdownOption | null>(() => {
    if (value == null) return null;
    // value is { text, value } from grid data
    if (typeof value === 'object' && 'value' in value) {
      const typedValue = value as DropdownValue;
      return options.find((opt) => opt.value === typedValue.value || opt.value === String(typedValue.value)) || null;
    }
    return options.find((opt) => opt.value === value || opt.value === String(value)) || null;
  }, [value, options]);

  const handleChange = useCallback(
    (newItem: DropdownOption | null) => {
      if (columnChangeHandler) {
        // Pass the value in the format the grid expects: { text, value }
        const newValue = newItem ? { text: newItem.label, value: newItem.value } : null;
        columnChangeHandler(column.name || '', newValue, column, rowIdx || 0, primaryKey || '');
      }
    },
    [columnChangeHandler, column, rowIdx, primaryKey],
  );

  // hasFocus may not be in the type definitions but is used at runtime
  const dropdownProps = {
    id: `${cellId || ''}-${column.name || ''}`,
    hasFocus: isFocused,
    disabled: !column.editable,
    onChange: handleChange,
    onMenuOpen: handleMenuOpen,
    hideCaption: true,
    value: selectedValue,
    options,
    isV4Design: true,
    isPortal: true,
    width: '100%',
    isLoading: !dropdownData?.data,
    isClearable: column.editable,
    onInputChange: handleInputChange,
    onMenuScrollToBottom: handleMenuScrollToBottom,
    filterOption: serverSideFilterOption,
  };

  return <Dropdown {...(dropdownProps as React.ComponentProps<typeof Dropdown>)} />;
}

export default GridDropdownCell;
