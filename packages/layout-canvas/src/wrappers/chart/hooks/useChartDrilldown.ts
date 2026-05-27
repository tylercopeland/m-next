/**
 * Hook for chart drilldown functionality (grid data, pagination, search)
 * Follows Single Responsibility Principle - only handles drilldown logic
 * Uses designerDrilldown and chartFieldTypes injected by host (no direct app-builder/@m-next/types imports)
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDesignerContext } from '../../../contexts/DesignerContext';
import { useRuntimeContext } from '../../../contexts/RuntimeContext';
import { buildSelectedPointFilter } from '../utils/filterUtils';
import type {
  ChartControl,
  GridModel,
  ProjectionColumn,
  GridDataRow,
  RawGridData,
  UseChartDrilldownReturn,
  DesignerDrilldownApi,
  ChartFieldTypesApi,
  DesignerDrilldownRequest,
  AdvancedSearchExpression,
} from '../types';

/** Default field type IDs when host does not inject @m-next/types (layout-canvas stays package-agnostic) */
const DEFAULT_FIELD_TYPE_IDS = { Integer: 1, DropDown: 2 };
const defaultFieldTypeIdLookup = (typeId: number): number => typeId;

interface UseChartDrilldownParams {
  control: ChartControl | null;
  isRuntimeMode: boolean;
  isValid: boolean;
  expanded: boolean;
  selectedPoint: string | null;
  setSelectedPoint: (point: string | null) => void;
  /** Injected by host in designer mode (e.g. RTK Query results); falls back to context when not passed */
  designerDrilldown?: DesignerDrilldownApi | null;
}

/**
 * Hook to manage chart drilldown (grid data, pagination, search, chips)
 * @param params - Parameters for drilldown
 * @returns Drilldown state and handlers
 */
export function useChartDrilldown(params: UseChartDrilldownParams): UseChartDrilldownReturn {
  const {
    control,
    isRuntimeMode,
    isValid,
    expanded,
    selectedPoint,
    setSelectedPoint,
    designerDrilldown: designerDrilldownParam,
  } = params;
  const designerContext = useDesignerContext();
  const runtimeContext = useRuntimeContext();
  const designerDrilldown =
    designerDrilldownParam ?? (control?.id ? (designerContext?.designerDrilldownResults?.[control.id] ?? null) : null);

  const activeRecordId = isRuntimeMode
    ? (runtimeContext?.activeRecordId ?? null)
    : (designerContext?.activeRecordId ?? null);
  const screenId = isRuntimeMode ? (runtimeContext?.screenId ?? null) : (designerContext?.screenId ?? null);

  const chartFieldTypes: ChartFieldTypesApi | null = designerContext?.chartFieldTypes ?? null;
  const fieldTypeIds = chartFieldTypes?.fieldTypeIds ?? DEFAULT_FIELD_TYPE_IDS;
  const fieldTypeIdLookup = chartFieldTypes?.fieldTypeIdLookup ?? defaultFieldTypeIdLookup;

  const [gridData, setGridData] = useState<GridDataRow[] | null>(null);
  const [partialRecordCount, setPartialRecordCount] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [hasTotalRecord, setHasTotalRecord] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchString, setSearchString] = useState<string | null>(null);
  const [advancedSearchExpression, setAdvancedSearchExpression] = useState<AdvancedSearchExpression | null>(null);
  const [gridIsLoading, setGridIsLoading] = useState<boolean>(true);
  const [chipsData, setChipsData] = useState<unknown[] | null>(null);
  const [chipsDataQueryParams, setChipsDataQueryParams] = useState<{
    field: string | null;
    searchString: string | null;
  }>({
    field: null,
    searchString: null,
  });

  const lastProcessedGridDataRef = useRef<RawGridData | null>(null);

  // Reset drilldown state when expanded changes
  useEffect(() => {
    if (!expanded) {
      lastProcessedGridDataRef.current = null;
      setSearchString(null);
      setAdvancedSearchExpression(null);
      setGridData(null);
      setGridIsLoading(true);
      setPageNumber(1);
      setSelectedPoint(null);
    }
  }, [expanded, setSelectedPoint]);

  // Transform projection columns
  const transformedProjection = useMemo<ProjectionColumn[]>(() => {
    const cols: ProjectionColumn[] = [];
    if (!control || !control.model || !control.model.drilldownProjection || !control.model.drilldownProjection.fields)
      return [];
    let recordIdExists = false;

    control.model.drilldownProjection.fields.forEach((field) => {
      cols.push({
        name: field.name || '',
        field: field.name || '',
        caption: field.caption || '',
        visible: true,
        editable: false,
        fieldType: fieldTypeIdLookup(field.type ?? 0),
      });

      if (field.name === 'RecordID') {
        recordIdExists = true;
      }
    });

    if (!recordIdExists) {
      cols.push({
        name: 'RecordID',
        field: 'RecordID',
        caption: 'RecordID',
        visible: false,
        editable: false,
        fieldType: fieldTypeIds.Integer,
      });
    }
    return cols;
  }, [control, fieldTypeIdLookup, fieldTypeIds.Integer]);

  // Build grid model
  const gridModel = useMemo<GridModel | null>(() => {
    if (
      !control ||
      !control.model ||
      !control.model.drilldownProjection ||
      !control.model.drilldownProjection.fields ||
      control.model.drilldownProjection.fields.length === 0
    ) {
      return null;
    }

    const filter = buildSelectedPointFilter(control, selectedPoint);

    const sorting =
      control?.model?.drilldownProjection?.sorting && control.model.drilldownProjection.sorting.length > 0
        ? control.model.drilldownProjection.sorting[0]
        : null;

    const model: GridModel = {
      id: control.id,
      type: 'EDT',
      viewFriendlyName: control.model.viewName,
      defaultViewFilter: control.model.viewFilter?.filterId,
      viewFilter: control.model.viewFilter?.filterId,
      viewList: [
        {
          id: control.model.viewFilter?.filterId,
          name: 'Drilldown',
          columns: [],
          filtering: filter,
        },
      ],
      paging: {
        pageNumber,
        pageSize,
      },
      columns: transformedProjection,
      searchString,
      searchFilter: advancedSearchExpression,
      sorting,
    };

    let recordIdExists = false;
    const firstView = model.viewList[0];
    if (firstView) {
      control.model.drilldownProjection.fields.forEach((field) => {
        firstView.columns.push({
          field: field.name || '',
          visible: true,
        });

        if (field.name === 'RecordID') {
          recordIdExists = true;
        }
      });

      if (!recordIdExists) {
        firstView.columns.push({
          field: 'RecordID',
          visible: false,
        });
      }
    }

    return model;
  }, [control, pageNumber, pageSize, searchString, advancedSearchExpression, selectedPoint, transformedProjection]);

  // Publish drilldown request so host can run RTK Query and set designerDrilldownResults
  useEffect(() => {
    const setRequest = designerContext?.setDesignerDrilldownRequest;
    if (!setRequest || isRuntimeMode || !control?.id) return;
    if (!expanded || !isValid || !gridModel) {
      setRequest(control.id, null);
      return;
    }
    const request: DesignerDrilldownRequest = {
      controlId: control.id,
      screenId,
      activeRecordId,
      gridModel,
      chipsDataQueryParams,
      isValid,
      expanded,
    };
    setRequest(control.id, request);
  }, [
    designerContext?.setDesignerDrilldownRequest,
    isRuntimeMode,
    control?.id,
    expanded,
    isValid,
    gridModel,
    screenId,
    activeRecordId,
    chipsDataQueryParams,
  ]);

  // Runtime: trigger grid load when drilldown is expanded (match MethodUI ChartWrapper – loadGridDataV4 on expand)
  const loadGridData = runtimeContext?.loadGridData;
  useEffect(() => {
    if (!isRuntimeMode || !expanded || !isValid || !gridModel || !control?.id || !loadGridData) return;
    const runtimeModel = { ...gridModel, parent: 'chart' as const };
    loadGridData(runtimeModel, undefined, undefined, { source: 'Chart-Drilldown' });
  }, [isRuntimeMode, expanded, isValid, gridModel, control?.id, loadGridData]);

  // Use designer drilldown in designer mode; in runtime use getGridData from context (MethodUI stores at `${id}-chart`)
  const runtimeGridDataKey = control?.id ? `${control.id}-chart` : '';
  const runtimeGridDataRaw =
    isRuntimeMode && runtimeGridDataKey ? runtimeContext?.getGridData?.(runtimeGridDataKey) : null;
  // MethodUI: FETCH sets loading at controlId; FETCH_COMPLETED sets data at `${controlId}-chart`. Use data key's loading when present, else controlId's.
  const runtimeGridLoading =
    isRuntimeMode && control?.id
      ? ((runtimeContext?.getGridData?.(runtimeGridDataKey) ?? runtimeContext?.getGridData?.(control.id))?.loading ??
        false)
      : false;
  const runtimeRawGridData: RawGridData | null = useMemo(() => {
    if (!isRuntimeMode || !runtimeGridDataRaw || runtimeGridLoading) return null;
    const rows = runtimeGridDataRaw.rows as
      | Array<Array<{ name?: string; value?: unknown; text?: string; validationError?: unknown }>>
      | undefined;
    return {
      dataSource: Array.isArray(rows) ? rows.map((cells) => ({ cells })) : [],
      partialRowCount: runtimeGridDataRaw.partialCount,
      totalRows: runtimeGridDataRaw.count,
    };
  }, [isRuntimeMode, runtimeGridDataRaw, runtimeGridLoading]);

  const gridDataResult =
    isRuntimeMode && runtimeContext
      ? { data: runtimeRawGridData, isFetching: runtimeGridLoading ?? false }
      : (designerDrilldown?.gridDataResult ?? { data: null, isFetching: false });
  const chipsDataResult = designerDrilldown?.chipsDataResult ?? { data: null };
  const tagSuggestionsResult = designerDrilldown?.tagSuggestionsResult ?? {
    data: null,
    isLoading: false,
  };

  const gridFetching = gridDataResult.isFetching ?? false;
  const rawGridData: RawGridData | null = gridDataResult.data ?? null;

  const getTotalGridRecords =
    isRuntimeMode && runtimeContext?.getGridTotalRecordCount && gridModel
      ? (arg: { body?: { model?: GridModel } }) => {
          const modelWithParent = arg?.body?.model ? { ...arg.body.model, parent: 'chart' as const } : null;
          if (modelWithParent) runtimeContext.getGridTotalRecordCount(modelWithParent);
          return { unwrap: () => Promise.resolve(0) };
        }
      : !isRuntimeMode && control?.id && screenId && designerDrilldown?.totalRecordsMutation
        ? (designerDrilldown.totalRecordsMutation as (arg: {
            dataModelId: string;
            screenId?: string;
            activeRecordId?: string;
            body?: Record<string, unknown>;
          }) => { unwrap: () => Promise<number> })
        : () => ({ unwrap: () => Promise.resolve(0) });

  const tagList = tagSuggestionsResult.data as { others?: unknown[] } | null;
  const isLoadingTagList = tagSuggestionsResult.isLoading ?? false;

  // Process grid data
  useEffect(() => {
    if (gridFetching) {
      setGridIsLoading(true);
    }
    if (rawGridData && !gridFetching) {
      if (lastProcessedGridDataRef.current === rawGridData) {
        return;
      }
      lastProcessedGridDataRef.current = rawGridData;

      const cleanData: GridDataRow[] = [];

      if (!hasTotalRecord) {
        setPartialRecordCount(rawGridData.partialRowCount ?? 0);
        setTotalRecords(rawGridData.totalRows ?? 0);
      } else if (rawGridData.totalRows != null) {
        setTotalRecords(rawGridData.totalRows);
      }

      rawGridData.dataSource?.forEach((element) => {
        const rowData: GridDataRow = {};
        element.cells?.forEach((cell) => {
          const col = transformedProjection.find((x) => x.name === cell.name);
          if (col) {
            if (col.fieldType === fieldTypeIds.DropDown) {
              rowData[cell.name ?? ''] = { text: cell.text, value: cell.value };
            } else {
              rowData[cell.name ?? ''] = cell.value;
            }
          }
        });
        cleanData.push(rowData);
      });
      setGridData(cleanData);
      setGridIsLoading(false);
    }
  }, [rawGridData, gridFetching, hasTotalRecord, transformedProjection, fieldTypeIds.DropDown]);

  // Process chips data
  useEffect(() => {
    const chipsPayload = chipsDataResult.data as { dataSource?: unknown[] } | null | undefined;
    if (chipsPayload && Array.isArray(chipsPayload.dataSource)) {
      setChipsData(chipsPayload.dataSource);
    }
  }, [chipsDataResult]);

  // Handlers
  const handleGridClickMany = useCallback(async () => {
    if (!control?.id || !screenId) return;
    const result = await getTotalGridRecords({
      dataModelId: control.id,
      screenId,
      activeRecordId: activeRecordId ?? undefined,
      body: {
        screenState: null,
        model: gridModel ?? undefined,
      },
    }).unwrap();
    setHasTotalRecord(true);
    if (typeof result === 'number' && result > 0) setTotalRecords(result);
  }, [getTotalGridRecords, control?.id, screenId, activeRecordId, gridModel]);

  const handleGridPageChange = useCallback((e: number) => {
    setPageNumber(e);
    setGridIsLoading(true);
  }, []);

  const handleGridPageLengthChange = useCallback((e: string | number) => {
    setPageSize(Number(e));
    setGridIsLoading(true);
  }, []);

  const handleSearch = useCallback((e: string) => {
    setSearchString(e);
    setPageNumber(1);
    setGridIsLoading(true);
    setHasTotalRecord(false);
  }, []);

  const handleAdvancedSearch = useCallback((value: AdvancedSearchExpression | null) => {
    setAdvancedSearchExpression(value);
    setPageNumber(1);
    setGridIsLoading(true);
    setHasTotalRecord(false);
  }, []);

  const handleFetchChipsData = useCallback((field: string, value: string) => {
    setChipsDataQueryParams({ field, searchString: value });
  }, []);

  return {
    gridModel,
    gridData,
    totalRecords,
    partialRecordCount,
    gridIsLoading,
    pageNumber,
    pageSize,
    searchString,
    advancedSearchExpression,
    selectedPoint,
    chipsData,
    handleGridClickMany,
    handleGridPageChange,
    handleGridPageLengthChange,
    handleSearch,
    handleAdvancedSearch,
    handleFetchChipsData,
    tagList: isLoadingTagList ? null : tagList?.others && tagList.others.length > 0 ? tagList.others : null,
    isLoadingTagList,
    setGridIsLoading,
    setHasTotalRecord,
    setSearchString,
  };
}
