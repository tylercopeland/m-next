/**
 * Hook for chart event handlers (point click, row click, etc.)
 * Follows Single Responsibility Principle - only handles event handling
 */

import { useCallback, useRef, useEffect } from 'react';
import { useRuntimeContext } from '../../../contexts/RuntimeContext';
import type { ActionHandler } from '../../../actions/types';
import type { ChartControl, PointClickEvent, RowClickEvent } from '../types';

interface UseChartEventHandlersParams {
  control: ChartControl | null;
  mode: 'designer' | 'runtime' | undefined;
  actionHandler: ActionHandler | null | undefined;
  screenId: string | undefined;
  recordId: string | number | undefined;
  screenState: Record<string, unknown> | undefined;
  selectedPoint: string | null;
  setSelectedPoint: (point: string | null) => void;
  setGridIsLoading: (loading: boolean) => void;
  setHasTotalRecord: (hasTotal: boolean) => void;
  setSearchString: (search: string | null) => void;
  /** Whether chart is in expanded/drilldown view (for analytics, matches MethodUI ChartWrapper) */
  expanded?: boolean;
}

/**
 * Hook to create chart event handlers
 * Uses refs to prevent handler recreation and avoid stale closures
 * @param params - Parameters for event handlers
 * @returns Event handler functions
 */
export function useChartEventHandlers(params: UseChartEventHandlersParams) {
  const {
    control,
    mode,
    actionHandler,
    screenId,
    recordId,
    screenState,
    selectedPoint,
    setSelectedPoint,
    setGridIsLoading,
    setHasTotalRecord,
    setSearchString,
    expanded = false,
  } = params;

  const runtimeContext = useRuntimeContext();
  const setChartSelectedPoint = runtimeContext?.setChartSelectedPoint;
  const setChartSelectedRow = runtimeContext?.setChartSelectedRow;
  const processAnalytics = runtimeContext?.processAnalytics;

  // Use refs to store values that might change, so handlers don't recreate
  const controlRef = useRef<ChartControl | null>(control);
  const runtimeScreenIdRef = useRef<string | undefined>(screenId);
  const runtimeRecordIdRef = useRef<string | number | undefined>(recordId);
  const actionHandlerRef = useRef<ActionHandler | null | undefined>(actionHandler);
  const screenStateRef = useRef<Record<string, unknown> | undefined>(screenState);
  const selectedPointRef = useRef<string | null>(selectedPoint);
  const expandedRef = useRef<boolean>(expanded);

  // Keep refs in sync with state
  useEffect(() => {
    controlRef.current = control;
    runtimeScreenIdRef.current = screenId;
    runtimeRecordIdRef.current = recordId;
    actionHandlerRef.current = actionHandler;
    screenStateRef.current = screenState;
    selectedPointRef.current = selectedPoint;
    expandedRef.current = expanded;
  }, [control, screenId, recordId, actionHandler, screenState, selectedPoint, expanded]);

  const handlePointClick = useCallback(
    async (event: PointClickEvent) => {
      const currentControl = controlRef.current;

      // Check if drilldown is enabled
      if (currentControl?.model?.drilldownEnabled) {
        if (mode === 'runtime' && processAnalytics && currentControl?.model?.viewName) {
          processAnalytics('Chart Runtime Action', {
            action: 'Chart area clicked on drilldown view, drilldown is enabled',
            tablename: currentControl.model.viewName,
          });
        }
        const point =
          event.point.name !== undefined
            ? event.point.selected
              ? null
              : event.point.name
            : event.point.selected
              ? null
              : event.point.category || null;
        setSelectedPoint(point);
        setGridIsLoading(true);
        setHasTotalRecord(false);
        setSearchString(null);
        if (mode === 'runtime' && setChartSelectedPoint && currentControl?.id) {
          setChartSelectedPoint(currentControl.id, 0, point);
        }
      } else {
        // Handle custom onClick action when drilldown is not enabled
        const currentScreenId = runtimeScreenIdRef.current;
        const currentRecordId = runtimeRecordIdRef.current;

        if (
          mode === 'runtime' &&
          actionHandlerRef.current &&
          typeof actionHandlerRef.current.executeAction === 'function' &&
          currentScreenId &&
          currentControl?.model?.columns?.[0]?.onClick &&
          !currentControl.disabled &&
          !currentControl.isWorking
        ) {
          try {
            // Determine the selected point value based on click state
            // Matches ChartWrapper behavior: deselect if same point clicked, otherwise select new point
            let point: string | null = null;
            const p = event.point;
            if (p.name !== undefined && p.selected && selectedPointRef.current) {
              point = null; // Deselect same point with name
            } else if (p.name !== undefined) {
              point = p.name; // Select point with name
            } else if (p.selected && selectedPointRef.current) {
              point = null; // Deselect same point without name
            } else {
              point = p.category || null; // Select new point by category
            }

            // Update local state
            setSelectedPoint(point);

            // Update dataReducer so runtimeCoreApi middleware can read it for backend request
            // This must happen before action execution
            if (setChartSelectedPoint && currentControl?.id) {
              setChartSelectedPoint(currentControl.id, 0, point);
            }

            // Analytics: match MethodUI ChartWrapper (point click, drilldown not enabled)
            if (processAnalytics && currentControl?.model?.viewName) {
              const action = expandedRef.current
                ? 'Chart area clicked on drilldown view, drilldown is not enabled'
                : 'Chart area clicked on runtime, drilldown not enabled';
              processAnalytics('Chart Runtime Action', {
                action,
                tablename: currentControl.model.viewName,
              });
            }

            const result = await actionHandlerRef.current.executeAction({
              componentId: currentControl.id || '',
              actionName: 'onClick',
              screenId: currentScreenId,
              recordId: currentRecordId !== undefined ? String(currentRecordId) : undefined,
              actionData: {
                event: {
                  type: 'pointClick',
                },
                selectedPoint: point,
              },
              screenState: screenStateRef.current,
              metadata: {
                timestamp: Date.now(),
                componentType: currentControl?.type || 'chart',
              },
            });

            if (!result.success && result.error) {
              console.error('[ChartWrapper] Action execution failed:', result.error);
            }
          } catch (error) {
            console.error('[ChartWrapper] Error executing point click action:', error);
          }
        }
      }
    },
    [
      mode,
      setSelectedPoint,
      setGridIsLoading,
      setHasTotalRecord,
      setSearchString,
      setChartSelectedPoint,
      processAnalytics,
    ],
  );

  const handleClick = useCallback(async () => {
    const currentControl = controlRef.current;

    // Check if drilldown is enabled
    if (currentControl?.model?.drilldownEnabled) {
      if (mode === 'runtime' && processAnalytics && currentControl?.model?.viewName) {
        processAnalytics('Chart Runtime Action', {
          action: 'Chart area clicked on runtime, drilldown is enabled',
          tablename: currentControl.model.viewName,
        });
      }
      setSelectedPoint(null);
      setGridIsLoading(true);
      setHasTotalRecord(false);
      if (mode === 'runtime' && setChartSelectedPoint && currentControl?.id) {
        setChartSelectedPoint(currentControl.id, 0, null);
      }
    } else {
      const currentScreenId = runtimeScreenIdRef.current;
      const currentRecordId = runtimeRecordIdRef.current;

      if (
        mode === 'runtime' &&
        actionHandlerRef.current &&
        typeof actionHandlerRef.current.executeAction === 'function' &&
        currentScreenId &&
        currentControl?.onEventClick &&
        !currentControl.disabled &&
        !currentControl.isWorking
      ) {
        try {
          const result = await actionHandlerRef.current.executeAction({
            componentId: currentControl.id || '',
            actionName: 'onClick',
            screenId: currentScreenId,
            recordId: currentRecordId !== undefined ? String(currentRecordId) : undefined,
            actionData: {
              event: {
                type: 'click',
              },
            },
            screenState: screenStateRef.current,
            metadata: {
              timestamp: Date.now(),
              componentType: currentControl?.type || 'chart',
            },
          });

          if (!result.success && result.error) {
            console.error('[ChartWrapper] Action execution failed:', result.error);
          }
        } catch (error) {
          console.error('[ChartWrapper] Error executing click action:', error);
        }
      }
    }
  }, [mode, setSelectedPoint, setGridIsLoading, setHasTotalRecord, setChartSelectedPoint, processAnalytics]);

  const handleRowClick = useCallback(
    async (event: RowClickEvent) => {
      const currentControl = controlRef.current;
      const currentScreenId = runtimeScreenIdRef.current;

      // Extract RecordID from row - Grid passes (rowData, rowIndex, ...) so first param is rowData.
      // Support both rowData.RecordID and event.row?.RecordID for different call signatures.
      const rowOrEvent = event as {
        RecordID?: string | number;
        row?: { RecordID?: string | number };
        rowIndex?: number;
      };
      const rawRecordId = rowOrEvent?.RecordID ?? rowOrEvent?.row?.RecordID;
      const clickedRecordId =
        rawRecordId != null ? String(rawRecordId).replace(/,/g, '').replace(/\(/g, '').replace(/\)/g, '') : undefined;

      if (
        mode === 'runtime' &&
        actionHandlerRef.current &&
        typeof actionHandlerRef.current.executeAction === 'function' &&
        currentScreenId &&
        currentControl?.onRowClick &&
        !currentControl.disabled &&
        !currentControl.isWorking
      ) {
        // Store selected row in Redux BEFORE executeAction - backend reads this for Navigate (record ID to load on new screen)
        if (setChartSelectedRow && currentControl?.id && clickedRecordId) {
          setChartSelectedRow(currentControl.id, clickedRecordId);
        }

        // Analytics: match MethodUI ChartWrapper
        if (processAnalytics && currentControl?.model?.viewName) {
          processAnalytics('Chart Runtime Action', {
            action: 'Clicked row on chart drilldown view',
            tablename: currentControl.model.viewName,
          });
        }

        try {
          // Pass current screen's activeRecordId (not clicked row) - backend expects encrypted record ID for this param.
          // The clicked row's RecordID is in ScreenState via setChartSelectedRow for the Navigate action to use.
          const currentRecordId = runtimeRecordIdRef.current;
          const result = await actionHandlerRef.current.executeAction({
            componentId: currentControl.id || '',
            actionName: 'onRowClick',
            screenId: currentScreenId,
            recordId: currentRecordId !== undefined ? String(currentRecordId) : undefined,
            actionData: {
              event: {
                type: 'rowClick',
              },
              gridData: {
                rowIndex: rowOrEvent?.rowIndex,
              },
            },
            screenState: screenStateRef.current,
            metadata: {
              timestamp: Date.now(),
              componentType: currentControl?.type || 'chart',
            },
          });

          if (!result.success && result.error) {
            console.error('[ChartWrapper] Action execution failed:', result.error);
          }
        } catch (error) {
          console.error('[ChartWrapper] Error executing row click action:', error);
        }
      }
    },
    [mode, processAnalytics, setChartSelectedRow],
  );

  return {
    handlePointClick,
    handleClick,
    handleRowClick,
  };
}
