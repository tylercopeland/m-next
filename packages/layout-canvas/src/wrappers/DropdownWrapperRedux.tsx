import React, { Suspense, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { toCamelCase } from '@m-next/utilities';
import type { DropdownControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';
import Dropdown, { type DropdownOption } from '@m-next/dropdown';
import { useDesignerContext } from '../contexts/DesignerContext';
import { useDropdownSearch } from '../hooks/useDropdownSearch';
import { parseDropdownData } from '../utils/dropdownDataParser';

interface DropdownDesignerWrapperProps {
  id: string;
  onControlClick?: (controlId: string) => void;
  control?: Record<string, unknown>;
  mode?: 'runtime' | 'designer';
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  screenState?: unknown;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
}

// Type for the dropdown data response
interface DropdownDataResponse {
  data: Record<string, string>[];
}

const DropdownDesignerWrapper: React.FC<DropdownDesignerWrapperProps> = ({
  id,
  control: controlProp,
  mode,
  onControlClick,
  actionHandler,
  screenState,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
}) => {
  // Check for runtime context first
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(null);
  const [itemList, setItemList] = useState<DropdownOption[]>([]);
  const [multiLine, setMultiLine] = useState(false);
  const dropdownRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMountedInContainerDom, setIsMountedInContainerDom] = useState(false);

  // Check if Redux context exists
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const ensureDesignerSelected = useCallback(() => {
    if (!isRuntimeMode) {
      onControlClick?.(id);
    }
  }, [isRuntimeMode, onControlClick, id]);

  // --- Drag-vs-click detection (designer only) ---
  // Prevents the dropdown menu from opening when the user mousedowns and drags
  // to reposition the component inside a container.
  const [designerMenuOpen, setDesignerMenuOpen] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const menuOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragListenersRef = useRef<{ onMove: (e: MouseEvent) => void; onUp: (e: MouseEvent) => void } | null>(null);

  const syncContainerAwarenessFromDom = useCallback(() => {
    const nextIsInContainerByDom = Boolean(wrapperRef.current?.closest('.layout-container-drop-zone'));
    setIsMountedInContainerDom((prev) => (prev === nextIsInContainerByDom ? prev : nextIsInContainerByDom));
  }, []);

  const cleanupDragListeners = useCallback(() => {
    if (dragListenersRef.current) {
      document.removeEventListener('mousemove', dragListenersRef.current.onMove);
      document.removeEventListener('mouseup', dragListenersRef.current.onUp);
      dragListenersRef.current = null;
    }
  }, []);

  const handleWrapperMouseDownCapture = useCallback(
    (e: React.MouseEvent) => {
      ensureDesignerSelected();
      if (isRuntimeMode) return;
      syncContainerAwarenessFromDom();

      // Clean up any stale listeners from a previous drag
      cleanupDragListeners();

      dragStartRef.current = { x: e.clientX, y: e.clientY };
      isDraggingRef.current = false;

      const onMove = (me: MouseEvent) => {
        if (!dragStartRef.current) return;
        const dx = me.clientX - dragStartRef.current.x;
        const dy = me.clientY - dragStartRef.current.y;
        if (dx * dx + dy * dy > 25) {
          isDraggingRef.current = true;
          // Cancel any pending menu open
          if (menuOpenTimerRef.current) {
            clearTimeout(menuOpenTimerRef.current);
            menuOpenTimerRef.current = null;
          }
          // Close menu if it somehow opened
          setDesignerMenuOpen(false);
        }
      };

      const onUp = () => {
        cleanupDragListeners();
        dragStartRef.current = null;
        requestAnimationFrame(() => {
          isDraggingRef.current = false;
        });
      };

      dragListenersRef.current = { onMove, onUp };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [isRuntimeMode, ensureDesignerSelected, cleanupDragListeners, syncContainerAwarenessFromDom],
  );

  // Cleanup listeners and timer on unmount
  useEffect(() => {
    return () => {
      cleanupDragListeners();
      if (menuOpenTimerRef.current) clearTimeout(menuOpenTimerRef.current);
    };
  }, [cleanupDragListeners]);

  // Capture initial DOM placement after mount/hard refresh so dropdown behavior is container-aware
  // even when control metadata arrives without containerId initially.
  useEffect(() => {
    syncContainerAwarenessFromDom();
  }, [syncContainerAwarenessFromDom]);

  // Handle setFocusToControl action - focus dropdown when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && (controlProp as any)?.hasFocus) {
      // Focus the dropdown using the ref
      if (dropdownRef.current) {
        dropdownRef.current.focus();
      }
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [(controlProp as any)?.hasFocus, id, isRuntimeMode, runtimeUpdateControlProperty]);

  // Only use Redux selectors in designer mode
  const activeRecordId = (isRuntimeMode ? runtimeContext?.activeRecordId || null : designerContext?.activeRecordId) as
    | string
    | undefined;
  const screenId = isRuntimeMode ? runtimeContext?.screenId || null : designerContext?.screenId;
  const control = (isRuntimeMode ? controlProp : designerContext?.selectControlById(id)) as DropdownControl;
  const isInContainer =
    Boolean((control as unknown as { containerId?: string | null })?.containerId) || isMountedInContainerDom;

  // Convert to typed control with safe defaults
  const dropdownControl = useMemo(() => {
    const defaultControl: DropdownControl = {
      id: id || '',
      type: 'dropdown',
      visible: true,
      disabled: false,
      isBound: false,
      isWorking: false,
      hideCaption: true,
      name: 'dropdown',
      caption: 'Dropdown',
      classes: '',
      options: [],
      placeholder: 'Select an option',
      searchable: false,
      clearable: false,
      multiple: false,
      value: undefined,
      widthType: 'full',
      defaultValue: '',
      model: {},
      customRowText: '',
      onCustomRowClick: undefined,
      isDisabled: false,
      isMultiSelect: false,
      isClearable: false,
    };

    if (!control) {
      return defaultControl;
    }

    // Safely merge control properties with defaults
    return {
      ...defaultControl,
      ...control,
      id: control.id || id || '',
    } as DropdownControl;
  }, [control, id]);

  // Only make API call when we have a properly initialized model with required properties
  // Backend requires at least 2 columns (RecordID + display column)
  const hasValidColumns =
    dropdownControl.model?.columns &&
    Array.isArray(dropdownControl.model.columns) &&
    dropdownControl.model.columns.length >= 2;
  const shouldSkipApiCall =
    isRuntimeMode ||
    !dropdownControl.id ||
    !dropdownControl.model ||
    Object.keys(dropdownControl.model).length === 0 ||
    !screenId ||
    !dropdownControl.model.viewName ||
    !hasValidColumns;

  // Only use RTK Query in designer mode
  let data: DropdownDataResponse | undefined;
  let isLoading = false;

  if (!isRuntimeMode) {
    // Designer mode - use RTK Query
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const queryResult = designerContext?.onLoadDropdownData(
      {
        id: dropdownControl.id,
        screenId,
        activeRecordId,
        body: {
          screenState: null,
          model: { ...dropdownControl.model },
        },
      },
      // @ts-expect-error - RTK Query hook signature mismatch
      { skip: shouldSkipApiCall },
    ) as {
      data: DropdownDataResponse | undefined;
      isLoading: boolean;
      error: unknown;
    };
    data = queryResult.data;
    isLoading = queryResult.isLoading;
  }

  // Extract load function (stable unless context functions change, not when data changes)
  const loadDropdownDataFn = runtimeContext?.loadDropdownData;

  // Stable reference for dropdown model to prevent infinite API calls
  // JSON.stringify ensures we only re-fetch when model content actually changes
  const dropdownModelKey = useMemo(
    () => (dropdownControl?.model ? JSON.stringify(dropdownControl.model) : ''),
    [dropdownControl?.model],
  );

  // Throw error in runtime mode if dropdown is not configured (missing viewName)
  // This allows the ScreenErrorBoundary to catch it and show the error banner
  if (isRuntimeMode && dropdownControl?.id && !dropdownControl.model?.viewName) {
    throw new Error(`Dropdown not configured: missing viewName for control ${dropdownControl.id}`);
  }

  // Load dropdown data in runtime mode
  // Dependencies use stable primitives (id, modelKey) instead of object references
  useEffect(() => {
    if (isRuntimeMode && loadDropdownDataFn && dropdownControl) {
      loadDropdownDataFn(dropdownControl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRuntimeMode, loadDropdownDataFn, dropdownControl?.id, dropdownModelKey]);

  // Stable key for runtime dropdown data to avoid re-parsing when reference changes but data is the same
  const runtimeDropdownData =
    isRuntimeMode && runtimeContext?.getDropdownData ? runtimeContext.getDropdownData(id) : null;
  const runtimeDataKey = useMemo(
    () => (runtimeDropdownData?.data ? JSON.stringify(runtimeDropdownData.data) : ''),
    [runtimeDropdownData?.data],
  );

  // Stable key for designer data to prevent infinite re-renders
  // (onLoadDropdownData returns a new object reference on every render)
  const designerDataKey = useMemo(() => (data?.data ? JSON.stringify(data.data) : ''), [data?.data]);

  useEffect(() => {
    // Use runtime data if available, otherwise use designer data
    const sourceData = isRuntimeMode ? runtimeDropdownData?.data : data?.data || null;

    const { options, hasMultiLine } = parseDropdownData(sourceData);
    setMultiLine(hasMultiLine);
    setItemList(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRuntimeMode, runtimeDataKey, designerDataKey]);

  /**
   * Get the current value from the control.
   * Priority: value > defaultValue
   * This handles both runtime (value) and designer (defaultValue) modes.
   * Note: In runtime mode, value may be a DropdownState object { Id, Text }
   */
  const getControlValue = useCallback((): string | number | boolean | { Id: number; Text: string } | undefined => {
    // In runtime mode, the value property contains the current state
    // It may be a DropdownState object { Id, Text } or a primitive
    if (dropdownControl?.value !== undefined) {
      return dropdownControl.value as string | number | boolean | { Id: number; Text: string };
    }
    // Fall back to defaultValue
    if (dropdownControl?.defaultValue !== undefined) {
      if (typeof dropdownControl.defaultValue !== 'object') {
        return dropdownControl.defaultValue;
      }
      // Handle ComplexValueType (convert to number if applicable)
      const complexValue = dropdownControl.defaultValue as unknown;
      if (typeof complexValue === 'number') {
        return complexValue;
      }
      return complexValue as string | number | boolean | undefined;
    }
    return undefined;
  }, [dropdownControl?.value, dropdownControl?.defaultValue]);

  // Sync local state when control value changes from parent (e.g., after action execution)
  useEffect(() => {
    if (itemList.length === 0) return;

    const currentValue = getControlValue();
    if (currentValue === undefined) return;

    let valueToFind: string | number | boolean | undefined;

    // Handle DropdownState object { Id, Text } from dataReducer (V4 format)
    if (currentValue && typeof currentValue === 'object' && 'Id' in currentValue) {
      valueToFind = (currentValue as { Id: number }).Id;
    }
    // Handle legacy record object with RecordID from BULK_UPDATE_CONTROL_VALUES
    else if (currentValue && typeof currentValue === 'object' && 'RecordID' in currentValue) {
      valueToFind = (currentValue as { RecordID: number | string }).RecordID;
    } else {
      valueToFind = currentValue as string | number | boolean;
    }

    // If we still don't have a value, try to convert using toCamelCase
    if (!valueToFind && typeof currentValue !== 'object') {
      valueToFind = toCamelCase(currentValue);
    }

    // Try to find by value - compare both as-is AND as strings to handle type mismatches
    // (dropdown options have string values from Object.keys parsing, but stored IDs may be numbers)
    const foundItem =
      itemList.find((item) => item.value === valueToFind || item.value === String(valueToFind)) ||
      itemList.find((item) => item.label === valueToFind || item.label === String(valueToFind));
    setSelectedItem(foundItem || null);
  }, [getControlValue, itemList]);

  /**
   * Creates an updated screenState with the new control value.
   * This ensures the backend receives the current value when executing actions,
   * preventing race conditions where ShowMessage displays stale values.
   *
   * For dropdowns, the backend expects a DropdownState object with:
   * - Id: number (the selected value)
   * - Text: string (the display label)
   */
  const getUpdatedScreenState = useCallback(
    (newItem: DropdownOption | null): Record<string, unknown> | undefined => {
      if (!screenState || typeof screenState !== 'object') {
        return screenState as Record<string, unknown> | undefined;
      }

      const state = screenState as Record<string, unknown>;
      const objects = Array.isArray(state.Objects) ? [...state.Objects] : [];

      // Find existing control state or create new entry
      const existingIndex = objects.findIndex((obj: unknown) => (obj as Record<string, unknown>)?.Id === id);

      // Format dropdown value as DropdownState object expected by backend
      // DropdownState has { Id: number, Text: string }
      const dropdownStateValue = newItem
        ? {
            Id: typeof newItem.value === 'number' ? newItem.value : parseInt(String(newItem.value), 10) || 0,
            Text: newItem.label || '',
          }
        : null;

      const controlState = {
        Id: id,
        Value: dropdownStateValue,
        Visible: dropdownControl?.visible ?? true,
        Disabled: dropdownControl?.disabled ?? false,
        ControlType: dropdownControl?.type || 'DRP',
      };

      if (existingIndex >= 0) {
        objects[existingIndex] = { ...(objects[existingIndex] as Record<string, unknown>), ...controlState };
      } else {
        objects.push(controlState);
      }

      return { ...state, Objects: objects };
    },
    [screenState, id, dropdownControl?.visible, dropdownControl?.disabled, dropdownControl?.type],
  );

  /**
   * Handle dropdown value change
   * @param newItem - The newly selected dropdown option
   * @param _actionMeta - Action metadata from react-select (unused)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback(
    async (newItem: DropdownOption | null, _actionMeta?: any) => {
      const previousValue = selectedItem?.value;
      const newValue = newItem?.value;
      setSelectedItem(newItem);

      // Update control value in runtime state
      // Must pass DropdownState object { Id, Text } - not raw value
      // The middleware reads from dataReducer and sends directly to backend
      if (isRuntimeMode && runtimeUpdateControlValue) {
        const dropdownStateValue = newItem
          ? {
              Id: typeof newItem.value === 'number' ? newItem.value : parseInt(String(newItem.value), 10) || 0,
              Text: newItem.label || '',
            }
          : null;
        runtimeUpdateControlValue(id, dropdownStateValue);
      }

      // Execute onChange action if in runtime mode and action is configured
      if (isRuntimeMode && actionHandler && screenId && dropdownControl?.onChange) {
        try {
          // Create updated screenState with the new item BEFORE executing action
          // Pass the entire item so we can format it as DropdownState (Id + Text)
          const updatedScreenState = getUpdatedScreenState(newItem);

          const result = await actionHandler.executeAction({
            componentId: id,
            actionName: 'onChange',
            screenId,
            recordId: activeRecordId,
            actionData: {
              value: newValue,
              oldValue: previousValue,
              label: newItem?.label,
              event: {
                type: 'change',
              },
            },
            screenState: updatedScreenState,
            metadata: {
              timestamp: Date.now(),
              componentType: (dropdownControl?.type as string) || 'dropdown',
            },
          });

          if (!result.success && result.error) {
            console.error('[DropdownWrapper] onChange action execution failed:', result.error);
          }
        } catch (error) {
          console.error('[DropdownWrapper] Error executing onChange action:', error);
        }
      }
    },
    [
      isRuntimeMode,
      runtimeUpdateControlValue,
      actionHandler,
      screenId,
      activeRecordId,
      dropdownControl,
      id,
      selectedItem,
      getUpdatedScreenState,
    ],
  );

  // --- Search & Pagination via shared hook ---
  const runtimeLoadData = useCallback(
    (searchText: string | null, page: number, append: boolean) => {
      if (loadDropdownDataFn && dropdownControl) {
        loadDropdownDataFn(dropdownControl, searchText, page, append);
      }
    },
    [loadDropdownDataFn, dropdownControl],
  );

  const designerLoadData = useCallback(
    async (searchText: string | null, page: number, append: boolean) => {
      if (!designerContext?.onLoadDropdownDataLazy) return;
      const body: Record<string, any> = {
        screenState: null,
        model: { ...dropdownControl.model },
      };
      if (searchText) body.SearchText = searchText;
      if (page > 1) body.Page = page;
      const result = await designerContext.onLoadDropdownDataLazy({
        id: dropdownControl.id,
        screenId,
        activeRecordId,
        body,
      });
      if (result?.data) {
        const { options: newOptions, hasMultiLine: newMultiLine } = parseDropdownData(result.data.data);
        if (append) {
          setItemList((prev) => {
            const existingValues = new Set(prev.map((o: DropdownOption) => o.value));
            const deduped = newOptions.filter((o: DropdownOption) => !existingValues.has(o.value));
            return [...prev, ...deduped];
          });
        } else {
          setItemList(newOptions);
        }
        setMultiLine(newMultiLine);
        // Track totalRows for designer pagination
        designerTotalRowsRef.current = result.data.totalRows || 0;
      }
    },
    [designerContext, dropdownControl, screenId, activeRecordId],
  );

  const designerTotalRowsRef = useRef<number>(0);

  const getRuntimeTotalRows = useCallback(
    () => runtimeContext?.getDropdownData(id)?.totalRows || 0,
    [runtimeContext, id],
  );

  const getDesignerTotalRows = useCallback(() => designerTotalRowsRef.current, []);

  const hasDesignerSearch = !isRuntimeMode && !!designerContext?.onLoadDropdownDataLazy;

  const { handleInputChange, handleMenuScrollToBottom, serverSideFilterOption, resetAndReload } = useDropdownSearch({
    loadData: isRuntimeMode ? runtimeLoadData : designerLoadData,
    getTotalRows: isRuntimeMode ? getRuntimeTotalRows : getDesignerTotalRows,
    enabled: isRuntimeMode || hasDesignerSearch,
  });

  /**
   * Handle dropdown menu open — reloads first page and resets search state (matching V3 handleOpen)
   */
  const handleMenuOpen = useCallback(async () => {
    // Reset search state and reload first page on menu open
    if (isRuntimeMode || hasDesignerSearch) {
      resetAndReload();
    }

    // Execute onFocus action if in runtime mode and action is configured
    if (isRuntimeMode && actionHandler && screenId && dropdownControl?.onFocus) {
      try {
        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onFocus',
          screenId,
          recordId: activeRecordId,
          actionData: {
            value: selectedItem?.value,
            event: {
              type: 'focus',
            },
          },
          screenState: screenState as Record<string, unknown> | undefined,
          metadata: {
            timestamp: Date.now(),
            componentType: (dropdownControl?.type as string) || 'dropdown',
          },
        });

        if (!result.success && result.error) {
          console.error('[DropdownWrapper] onFocus action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[DropdownWrapper] Error executing onFocus action:', error);
      }
    }
  }, [
    isRuntimeMode,
    hasDesignerSearch,
    resetAndReload,
    actionHandler,
    screenId,
    activeRecordId,
    dropdownControl,
    id,
    selectedItem,
    screenState,
  ]);

  /**
   * Handle dropdown blur
   */
  const handleBlur = useCallback(async () => {
    // Execute onBlur action if in runtime mode and action is configured
    if (isRuntimeMode && actionHandler && screenId && dropdownControl?.onBlur) {
      try {
        const result = await actionHandler.executeAction({
          componentId: id,
          actionName: 'onBlur',
          screenId,
          recordId: activeRecordId,
          actionData: {
            value: selectedItem?.value,
            event: {
              type: 'blur',
            },
          },
          screenState: screenState as Record<string, unknown> | undefined,
          metadata: {
            timestamp: Date.now(),
            componentType: (dropdownControl?.type as string) || 'dropdown',
          },
        });

        if (!result.success && result.error) {
          console.error('[DropdownWrapper] onBlur action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[DropdownWrapper] Error executing onBlur action:', error);
      }
    }
  }, [isRuntimeMode, actionHandler, screenId, activeRecordId, dropdownControl, id, selectedItem, screenState]);

  /**
   * Handle custom row click (action button)
   * Note: onCustomRowClick is a dropdown-specific action, not in standard ActionEventType
   */
  const handleCustomRowClick = useCallback(async () => {
    // Execute onCustomRowClick action if in runtime mode and action is configured
    if (isRuntimeMode && actionHandler && screenId && dropdownControl?.onCustomRowClick) {
      try {
        const result = await actionHandler.executeAction({
          componentId: id,
          // Use onClick as the action type for custom row click (dropdown-specific action)
          actionName: 'onCustomRowClick' as const,
          screenId,
          recordId: activeRecordId,
          actionData: {
            value: selectedItem?.value,
            event: {
              type: 'click',
            },
          },
          screenState: screenState as Record<string, unknown> | undefined,
          metadata: {
            timestamp: Date.now(),
            componentType: (dropdownControl?.type as string) || 'dropdown',
          },
        });

        if (!result.success && result.error) {
          console.error('[DropdownWrapper] onCustomRowClick action execution failed:', result.error);
        }
      } catch (error) {
        console.error('[DropdownWrapper] Error executing onCustomRowClick action:', error);
      }
    }
  }, [isRuntimeMode, actionHandler, screenId, activeRecordId, dropdownControl, id, selectedItem, screenState]);

  const isRequired = useMemo(() => {
    if (dropdownControl.validationRules && Array.isArray(dropdownControl.validationRules)) {
      const match = dropdownControl.validationRules.find(({ rule }) => rule === 0);
      if (match) return true;
    }

    return false;
  }, [dropdownControl.validationRules]);

  // Always render the dropdown — visibility is handled by the canvas (showHiddenComponents toggle)
  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <div
        ref={wrapperRef}
        style={{ position: 'relative', width: '100%', padding: 8 }}
        className='dd-wrapper'
        data-no-drag
        onMouseDownCapture={handleWrapperMouseDownCapture}
      >
        <Dropdown
          id={dropdownControl.id}
          forwardRef={dropdownRef}
          caption={dropdownControl.hideCaption ? undefined : dropdownControl.caption}
          width={'100%'}
          displayAuto={dropdownControl.widthType === 'auto'}
          legacyClass={dropdownControl.classes}
          options={itemList}
          value={selectedItem}
          isV4Design
          dropdownStyle={multiLine ? 'multi' : 'single'}
          actionButtonText={
            dropdownControl.onCustomRowClick
              ? dropdownControl.customRowText || `Manage ${dropdownControl.caption}`
              : undefined
          }
          isCreateable={false}
          isLoading={isLoading}
          isPortal={isInContainer}
          menuIsOpen={isRuntimeMode ? undefined : designerMenuOpen}
          menuPlacement='auto'
          placeholder={dropdownControl.placeholder}
          disabled={dropdownControl.disabled || dropdownControl.isWorking}
          isMultiSelect={dropdownControl.isMultiSelect}
          isClearable={true}
          onChange={handleChange}
          onBlur={handleBlur}
          onMenuOpen={() => {
            if (isRuntimeMode) {
              handleMenuOpen();
              return;
            }
            // Clear any existing pending timer before scheduling a new one
            if (menuOpenTimerRef.current) {
              clearTimeout(menuOpenTimerRef.current);
            }
            // Defer open slightly so drag detection can cancel it
            menuOpenTimerRef.current = setTimeout(() => {
              menuOpenTimerRef.current = null;
              if (!isDraggingRef.current) {
                setDesignerMenuOpen(true);
                handleMenuOpen();
              }
            }, 100);
            ensureDesignerSelected();
          }}
          onMenuClose={() => {
            if (menuOpenTimerRef.current) {
              clearTimeout(menuOpenTimerRef.current);
              menuOpenTimerRef.current = null;
            }
            if (!isRuntimeMode) setDesignerMenuOpen(false);
            ensureDesignerSelected();
          }}
          onActionButtonClick={handleCustomRowClick}
          required={isRequired}
          hasValidation
          validationMessage={
            isRuntimeMode && controlProp?.validationMessage ? (controlProp.validationMessage as string) : undefined
          }
          onInputChange={handleInputChange}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          filterOption={serverSideFilterOption}
        />
      </div>
    </Suspense>
  );
};

export default DropdownDesignerWrapper;
