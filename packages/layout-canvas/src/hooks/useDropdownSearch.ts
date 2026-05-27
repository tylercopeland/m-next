import { useCallback, useEffect, useRef } from 'react';

export interface DropdownSearchConfig {
  loadData: (searchText: string | null, page: number, append: boolean) => void;
  getTotalRows: () => number;
  enabled: boolean;
  debounceMs?: number;
  pageSize?: number;
}

export interface DropdownSearchResult {
  handleInputChange: ((newValue: string, actionMeta: any) => void) | undefined;
  handleMenuScrollToBottom: (() => void) | undefined;
  serverSideFilterOption: (() => boolean) | undefined;
  resetAndReload: () => void;
}

/**
 * Shared hook for dropdown server-side search and pagination.
 * Returns undefined handlers when disabled, so they can be passed directly to Dropdown props.
 */
export function useDropdownSearch({
  loadData,
  getTotalRows,
  enabled,
  debounceMs = 300,
  pageSize = 50,
}: DropdownSearchConfig): DropdownSearchResult {
  const searchTextRef = useRef<string | null>(null);
  const pageRef = useRef<number>(1);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (newValue: string, actionMeta: any) => {
      if (!actionMeta || actionMeta.action !== 'input-change') return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const query = newValue?.trim() || null;
      searchTextRef.current = query;
      pageRef.current = 1;

      debounceTimerRef.current = setTimeout(() => {
        loadData(searchTextRef.current, 1, false);
      }, debounceMs);
    },
    [loadData, debounceMs],
  );

  const handleMenuScrollToBottom = useCallback(() => {
    const totalRows = getTotalRows();
    const currentPage = pageRef.current;

    if (currentPage * pageSize < totalRows) {
      const nextPage = currentPage + 1;
      pageRef.current = nextPage;
      loadData(searchTextRef.current, nextPage, true);
    }
  }, [loadData, getTotalRows, pageSize]);

  const serverSideFilterOption = useCallback(() => true, []);

  const resetAndReload = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    searchTextRef.current = null;
    pageRef.current = 1;
    loadData(null, 1, false);
  }, [loadData]);

  if (!enabled) {
    return {
      handleInputChange: undefined,
      handleMenuScrollToBottom: undefined,
      serverSideFilterOption: undefined,
      resetAndReload,
    };
  }

  return {
    handleInputChange,
    handleMenuScrollToBottom,
    serverSideFilterOption,
    resetAndReload,
  };
}
