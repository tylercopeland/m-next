/**
 * LayoutCanvasWrapper component integrates @m-next/layout-canvas into the existing App Builder.
 * Enhanced with simplified drag-and-drop functionality for layout containers.
 *
 * @component
 * @param props - The properties object.
 * @returns The rendered LayoutCanvasWrapper component.
 */

// Fix TypeScript globals
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import {
  DesignerContextProvider,
  LayoutCanvas,
  ResponsiveComponent,
  ScreenDataContextProvider,
  WidgetType,
  calculateNameFromLabelChange,
  useDesignerContext,
} from '@m-next/layout-canvas';
import { WIDGETS } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { parseExpression } from '@m-next/criteria-builder';
import { FieldTypeIds, fieldTypeIdLookup } from '@m-next/types';
import { convertControlsToComponents } from './utils/controlsToComponentsConverter';
import { UnifiedControlRegistry, mapWidgetToControlType } from './unified-control-registry';
import {
  getControlTypeCode,
  getControlClass,
  getDefaultCaption,
  typeCodeToWidgetType,
} from './utils/widgetTypeMapping';
import {
  mapLayoutToComponents,
  mapControlsToComponents,
  mapLayoutV4ToComponents,
} from './utils/layoutDataMappers';
import type {
  Layout,
  Control,
  Controls,
  LayoutCanvas as LayoutCanvasData,
} from './utils/layoutDataMappers';
import {
  buildFlatLayoutItems,
  assembleLayoutCanvas,
} from './utils/v4LayoutPersistence';
import { computeValidationError } from './utils/componentValidation';
import { resolveControlValues } from './utils/controlValueResolver';
import { useComponentPositionSync } from './hooks/useComponentPositionSync';
import { useContainerCanvasHandlers } from './hooks/useContainerCanvasHandlers';

import EmptyCanvasState from '../../components/EmptyCanvasState';
import {
  controlUpdated,
  selectScreenFields,
  selectActiveRecordId,
  controlSelected,
  selectShowHiddenComponents,
  selectResolution,
  selectDefaultFocusControl,
} from '../../common/services/screenLayoutSlice';
// getHiddenState, getDisabledState, Resolution used by layoutDataMappers
import { migrateGrid } from './control-classes/gridControl';
import createGridView from './control-classes/grid/gridView';
import {
  selectAccountName,
  selectDisplayPreferences,
  selectFeatureFlags,
  selectMethodIdentity,
  selectAuthContext,
} from '../../common/services/sessionSlice';

// Import React Grid Layout CSS for proper visual feedback and resize handles
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { selectScreenId } from '../../common/services/appSlice';
import { useGetTagSuggestionsQuery } from '../../common/services/tagsApi';
import {
  useGetChartDataLegacyQuery,
  useGetChipsDataLegacyQuery,
  useGetDropdownDataLegacyQuery,
  useLazyGetDropdownDataLegacyQuery,
  useGetGalleryDataLegacyQuery,
  useGetGridDataLegacyQuery,
  useGetTotalGridRecordsLegacyMutation,
} from '../../common/services/runtimeApi';
import validateChart from './validation/validateChart';
import validateExpression from './validation/validateExpression';

declare global {
  function setTimeout(callback: () => void, delay: number): NodeJS.Timeout;
  function clearTimeout(timeoutId: NodeJS.Timeout | null): void;
}

const CalendarDesignerWrapper = React.lazy(() => import('./component-wrappers/calendarDesignerWrapper'));

// V3-compatible ribbon components for appRibbonType support
const Ribbon = React.lazy(() => import('./component-wrappers/ribbon/Ribbon'));
const TabPanelWrapper = React.lazy(() => import('./component-wrappers/tabPanelWrapper'));

/** Single chart data fetcher – runs useGetChartDataLegacyQuery and writes result to DesignerContext */
function ChartDataFetcher({ controlId, screenId, activeRecordId, model, setResult }) {
  const { data, error, isLoading } = useGetChartDataLegacyQuery(
    {
      id: controlId,
      screenId: screenId || '',
      activeRecordId,
      body: { model },
    },
    {
      skip: !screenId || !controlId,
      refetchOnMountOrArgChange: true,
    },
  );
  useEffect(() => {
    if (setResult) {
      setResult(controlId, { data: data ?? null, error: error ?? null, isLoading });
    }
  }, [controlId, data, error, isLoading, setResult]);
  return null;
}

/** Renders a ChartDataFetcher per chart so layout-canvas receives designer chart data via context. Must be a child of DesignerContextProvider. */
function ChartDataFetchers({ chartComponents, screenId, activeRecordId, controls }) {
  const designerContext = useDesignerContext();
  const setResult = designerContext?.setDesignerChartDataResult;
  if (!setResult || !chartComponents?.length) return null;
  return (
    <>
      {chartComponents.map((c) => (
        <ChartDataFetcher
          key={c.id}
          controlId={c.id}
          screenId={screenId}
          activeRecordId={activeRecordId}
          model={controls?.[c.id]?.model}
          setResult={setResult}
        />
      ))}
    </>
  );
}

/** Single drilldown data fetcher – runs grid/chips/total/tags queries and writes result to DesignerContext for one chart. */
function DrilldownDataFetcher({
  controlId,
  request,
  setResult,
  accountName,
}) {
  const gridModel = request?.gridModel;
  const chipsParams = request?.chipsDataQueryParams ?? { field: null, searchString: null };
  const skipGrid = !request || !request.isValid || !gridModel;
  const skipChips = skipGrid || chipsParams.field == null || chipsParams.searchString == null;

  const gridQueryArg = {
    dataModelId: controlId,
    screenId: request?.screenId ?? '',
    activeRecordId: request?.activeRecordId ?? undefined,
    body: {
      screenState: null,
      model: gridModel,
    },
  };
  const { data: gridData, isLoading: gridLoading } = useGetGridDataLegacyQuery(gridQueryArg, {
    skip: skipGrid,
    refetchOnMountOrArgChange: true,
  });

  const chipsQueryArg = {
    dataModelId: controlId,
    screenId: request?.screenId ?? '',
    activeRecordId: request?.activeRecordId ?? undefined,
    body: {
      field: chipsParams.field,
      screenState: null,
      model: gridModel ? { ...gridModel, searchString: chipsParams.searchString } : undefined,
    },
  };
  const { data: chipsData } = useGetChipsDataLegacyQuery(chipsQueryArg, {
    skip: skipChips,
    refetchOnMountOrArgChange: true,
  });

  const [getTotalGridRecords] = useGetTotalGridRecordsLegacyMutation();
  const { data: tagList, isLoading: isLoadingTagList } = useGetTagSuggestionsQuery(
    { accountName: accountName || '' },
    { skip: !accountName },
  );

  React.useEffect(() => {
    if (!request || !setResult) return;
    const raw = gridData && typeof gridData === 'object' ? gridData : null;
    const normalizedGrid =
      raw &&
        (raw.dataSource || raw.partialRowCount != null || raw.totalRows != null || raw.partialCount != null || raw.count != null)
        ? {
          dataSource: raw.dataSource ?? [],
          partialRowCount: raw.partialRowCount ?? raw.partialCount ?? 0,
          totalRows: raw.totalRows ?? raw.count ?? 0,
        }
        : null;
    const totalRecordsMutation = (arg) => {
      const result = getTotalGridRecords({
        dataModelId: arg?.dataModelId ?? controlId,
        screenId: arg?.screenId ?? request.screenId,
        activeRecordId: arg?.activeRecordId ?? request.activeRecordId,
        body: arg?.body ?? { screenState: null, model: gridModel },
      });
      return {
        unwrap: () =>
          result && typeof result.unwrap === 'function' ? result.unwrap() : Promise.resolve(0),
      };
    };
    setResult(controlId, {
      gridDataResult: { data: normalizedGrid, isFetching: gridLoading },
      totalRecordsMutation,
      chipsDataResult: { data: chipsData ?? null },
      tagSuggestionsResult: { data: tagList ?? null, isLoading: isLoadingTagList ?? false },
    });
  }, [
    request,
    controlId,
    setResult,
    gridData,
    gridLoading,
    chipsData,
    tagList,
    isLoadingTagList,
    getTotalGridRecords,
    gridModel,
  ]);

  return null;
}

/** Renders a DrilldownDataFetcher per chart so layout-canvas receives designer drilldown data via context. */
function DrilldownDataFetchers({ chartComponents, designerDrilldownRequests, setResult, accountName }) {
  if (!setResult || !chartComponents?.length) return null;
  return (
    <>
      {chartComponents.map((c) => (
        <DrilldownDataFetcher
          key={c.id}
          controlId={c.id}
          request={designerDrilldownRequests[c.id] ?? null}
          setResult={setResult}
          accountName={accountName}
        />
      ))}
    </>
  );
}

// Enhanced width provider for our fixed canvas width
const ResponsiveGridLayout = WidthProvider(Responsive);

// Types: Layout, Control, Controls, LayoutCanvas, ResponsiveLayoutItem imported from ./utils/layoutDataMappers

/** Extended control type that allows validation errors */
interface ControlWithValidation extends Control {
  /** Validation error message */
  validationError?: string | null;
}

/** Tab list item structure */
interface TabItem {
  /** Tab identifier */
  id?: string;
  /** Tab title */
  title?: string;
  /** Tab content or configuration */
  content?: unknown;
}

/** Selected control property structure */
interface SelectedControlProperty {
  /** Property name */
  name?: string;
  /** Property value */
  value?: unknown;
  /** Property type */
  type?: string;
}

/** Component props interface */
interface LayoutCanvasWrapperProps {
  /** The layout object with entries array */
  layout?: Layout;
  /** The controls object from Redux */
  controls?: Controls;
  /** 🆕 V4 LAYOUT API: Enhanced layoutV4 with LayoutCanvas structure */
  layoutV4?: LayoutCanvasData;
  /** 🆕 V4 LAYOUT API: Callback when layoutV4 changes */
  onLayoutV4Change?: (layoutCanvas: LayoutCanvasData) => void;
  /** 🆕 V4 LAYOUT API: Version ID for GUID CanvasId */
  versionId?: string;
  /** The type of the app ribbon */
  appRibbonType?: number;
  /** The ID of the selected control */
  selectedControlId?: string;
  /** Flag indicating if the content is loading */
  isLoading?: boolean;
  /** Error object if there is an error */
  error?: Error | null;
  /** Callback function when a control is clicked */
  onControlClick?: (controlId: string) => void;
  /** Callback function when components change (for Redux integration) */
  onComponentsChange?: (components: ResponsiveComponent[]) => void;
  /** Current resolution (desktop, tablet, mobile) */
  // resolution?: 'desktop' | 'tablet' | 'mobile';
  /** Height of the container */
  containerHeight?: number;
  /** List of tabs */
  tabList?: TabItem[];
  /** The properties of the selected control */
  selectedControlProperty?: SelectedControlProperty;
  /** Callback function when tab settings change */
  onTabsSettingsChange?: (settings: unknown) => void;
  /** Whether there are controls available */
  hasControls?: boolean;
  /** Whether the component palette is open */
  isPaletteOpen?: boolean;
  /** Callback to add components (show empty state) */
  onAddComponents?: () => void;
  /** Version number */
  versionNumber?: number;
  /** Accounting package name */
  accountingPackage?: string;
  /** Canvas width for React Grid Layout (passed from parent) */
  canvasWidth?: number;
  /** Grid columns count (passed from parent) */
  gridColumns?: number;
  /** Base model (table name) for the screen */
  baseModel?: string;
  /** Whether to use static layout (no compaction) */
  staticLayout?: boolean;
}

type EnhancedLayoutContainerBridge = {
  dragOverContainerId: string | null;
  onContainerDrop: (
    e: React.DragEvent,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => void;
  onContainerDragOver: (e: React.DragEvent, containerId: string) => void;
  onContainerDragLeave: (e: React.DragEvent) => void;
  onComponentDragStart: (e: React.DragEvent, componentId: string, parentId: string) => void;
  ResponsiveGridLayout: React.ComponentType<Record<string, unknown>>;
  rowHeight: number;
  colWidth: number;
  containerWidth: number;
  onContainerComponentsChange: (updatedComponents: ResponsiveComponent[]) => void;
  controlRegistry: Record<string, unknown>;
};



// Enhanced wrapper that passes layout container props/handlers to the layout container
const createEnhancedLayoutContainerWrapper = (
  bridgeRef: React.MutableRefObject<EnhancedLayoutContainerBridge>,
) => {
  const OriginalLayoutContainerWrapper = UnifiedControlRegistry.layoutContainer.wrapper;

  // Bridge native/RGL drag events into a React.DragEvent-like shape without mutating
  // the underlying dataTransfer payload (container mesh/drag state relies on it).
  const toSyntheticDragEvent = (event: unknown): React.DragEvent => {
    if (!event || typeof event !== 'object') {
      return event as React.DragEvent;
    }

    const candidate = event as Record<string, unknown> & {
      preventDefault?: () => void;
      stopPropagation?: () => void;
      dataTransfer?: DataTransfer | null;
      nativeEvent?: Event;
      target?: EventTarget | null;
      currentTarget?: EventTarget | null;
      defaultPrevented?: boolean;
    };

    if (candidate.nativeEvent) {
      return event as React.DragEvent;
    }

    const nativeEvent = event as DragEvent;
    let propagationStopped = false;

    return {
      ...(candidate as object),
      nativeEvent,
      target: candidate.target ?? nativeEvent.target ?? null,
      currentTarget: candidate.currentTarget ?? nativeEvent.currentTarget ?? null,
      dataTransfer: candidate.dataTransfer ?? nativeEvent.dataTransfer ?? null,
      preventDefault: () => nativeEvent.preventDefault?.(),
      stopPropagation: () => {
        propagationStopped = true;
        nativeEvent.stopPropagation?.();
      },
      persist: () => { },
      isDefaultPrevented: () => Boolean(nativeEvent.defaultPrevented ?? candidate.defaultPrevented),
      isPropagationStopped: () => propagationStopped,
    } as React.DragEvent;
  };

  const bridgedOnContainerDrop = (
    event: unknown,
    targetContainerId: string,
    position?: { x: number; y: number; w: number; h: number },
  ) => bridgeRef.current.onContainerDrop(toSyntheticDragEvent(event), targetContainerId, position);

  const bridgedOnContainerDragOver = (event: unknown, containerId: string) =>
    bridgeRef.current.onContainerDragOver(toSyntheticDragEvent(event), containerId);

  const bridgedOnContainerDragLeave = (event: unknown) =>
    bridgeRef.current.onContainerDragLeave(toSyntheticDragEvent(event));

  const bridgedOnComponentDragStart = (event: unknown, componentId: string, parentId: string) =>
    bridgeRef.current.onComponentDragStart(toSyntheticDragEvent(event), componentId, parentId);

  const EnhancedLayoutContainerWrapper = (props: Record<string, unknown>) => {
    const bridge = bridgeRef.current;
    return React.createElement(OriginalLayoutContainerWrapper as React.ComponentType<Record<string, unknown>>, {
      ...props,
      // Pass layout container canvas functionality props
      dragOverCanvas: bridge.dragOverContainerId,
      onNestedDrop: bridgedOnContainerDrop,
      onNestedDragOver: bridgedOnContainerDragOver,
      onNestedDragLeave: bridgedOnContainerDragLeave,
      onComponentDragStart: bridgedOnComponentDragStart,
      ResponsiveGridLayout: bridge.ResponsiveGridLayout,
      // Pass layout props to match main canvas
      rowHeight: bridge.rowHeight,
      colWidth: bridge.colWidth,
      containerWidth: bridge.containerWidth,
      // Pass container-child components change handler for position saves
      onNestedComponentsChange: bridge.onContainerComponentsChange,
      // Pass control registry with display restrictions to layout containers
      controlRegistry: bridge.controlRegistry,
    });
  };

  EnhancedLayoutContainerWrapper.displayName = 'EnhancedLayoutContainerWrapper';

  return EnhancedLayoutContainerWrapper;
};

const LayoutCanvasWrapper: React.FC<LayoutCanvasWrapperProps> = React.memo(({
  layout,
  controls,
  layoutV4,
  onLayoutV4Change,
  versionId,
  appRibbonType,
  selectedControlId,
  selectedControlProperty,
  isLoading = false,
  error = null,
  onControlClick,
  onComponentsChange,
  tabList,
  onTabsSettingsChange,
  hasControls = false, // 🆕 Props for internal empty state handling
  isPaletteOpen = false,
  onAddComponents,
  canvasWidth = 1200, // Default fallback
  gridColumns = 12, // Default fallback
  baseModel, // Screen's table name
  staticLayout = true, // Default to true (compaction enabled)
}) => {
  // Add Redux dispatch hook
  const dispatch = useDispatch();

  // Get fieldList from Redux for name conflict checking
  const fieldList = useSelector(selectScreenFields) as { name: string }[] | null | undefined;
  const showHiddenComponents = useSelector(selectShowHiddenComponents);
  const resolution = useSelector(selectResolution);
  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const featureFlags = useSelector(selectFeatureFlags);
  const screenId = useSelector(selectScreenId);
  const activeRecordId = useSelector(selectActiveRecordId);
  const methodIdentity = useSelector(selectMethodIdentity);
  const authContext = useSelector(selectAuthContext);
  const defaultFocusControlName = useSelector(selectDefaultFocusControl);

  const { data: tagsList } = useGetTagSuggestionsQuery({ accountName: accountName || '' });
  const [triggerDropdownQuery] = useLazyGetDropdownDataLegacyQuery();
  // Use a ref to capture the latest fieldList value for use in callbacks
  const fieldListRef = useRef<{ name: string }[] | null | undefined>(fieldList);

  // Update ref whenever fieldList changes
  React.useEffect(() => {
    fieldListRef.current = fieldList;
  }, [fieldList]);

  // 🔧 FIX: Get current Redux state to detect external updates
  const reduxControls = useSelector(
    (state: { screenLayout: { controls: Controls } }) => state.screenLayout?.controls || {},
  );

  // Calculate current tab for ribbon selection (V3 parity)
  const currentTab = useMemo(() => {
    const current = selectedControlId === 'tab-panel' ? selectedControlProperty?.id : null;
    return current as string | null;
  }, [selectedControlId, selectedControlProperty]);

  // getControlTypeCode, getControlClass, getDefaultCaption imported from ./utils/widgetTypeMapping

  // Get control defaults from the unified registry
  const getControlDefaults = useCallback((widgetType: WidgetType): Record<string, unknown> => {
    // Map widget type to control type
    const controlType = mapWidgetToControlType(String(widgetType));

    if (!controlType) {
      return {};
    }

    // Get defaults from the unified registry
    const config = UnifiedControlRegistry[controlType];

    if (!config || !config.defaultValues) {
      return {};
    }

    // Deep clone the defaults to avoid shared references
    const defaults = JSON.parse(JSON.stringify(config.defaultValues));

    // Special handling for controls with nested objects that need unique GUIDs
    if (controlType === 'calendar' && defaults.buttons && Array.isArray(defaults.buttons)) {
      // Regenerate GUIDs for calendar buttons
      defaults.buttons = defaults.buttons.map((button: Record<string, unknown>) => ({
        ...button,
        id: Guid.create(),
      }));
    }

    if (controlType === 'buttonGroup' && defaults.buttons && Array.isArray(defaults.buttons)) {
      // Regenerate GUIDs for button group buttons
      defaults.buttons = defaults.buttons.map((button: Record<string, unknown>) => ({
        ...button,
        id: Guid.create(),
      }));
    }

    return defaults;
  }, []);

  // Enhanced component mapping - properly prioritize V4 data structure
  // 🔧 FIX: Pass ALL components to LayoutCanvas, let it handle the filtering internally
  const components = useMemo(() => {
    let baseComponents;
    // For V4 screens, always use layoutV4 structure even if Content is empty
    // NOTE: canvasComponents is NOT available here yet (circular dependency), pass undefined for initial render
    if (layoutV4) {
      baseComponents = mapLayoutV4ToComponents(layoutV4, controls, resolution, reduxControls, undefined, gridColumns);
    } else if (layout && layout.entries && layout.entries.length > 0) {
      baseComponents = mapLayoutToComponents(layout);
    } else {
      // Include ALL components (LayoutCanvas will handle main vs nested filtering)
      baseComponents = mapControlsToComponents(controls, true); // true = include all components
    }

    // DIMENSION CONSTRAINTS: Attach display restrictions and validation errors to ALL components
    // Both top-level and nested components need min/max constraints and validation
    const result = baseComponents.map((component) => {
      const controlType = mapWidgetToControlType(String(component.type));
      const restrictions = controlType ? UnifiedControlRegistry[controlType]?.displayRestrictions : undefined;

      // Validation: use reduxControls (immediately updated) to avoid stale prop data
      const control = reduxControls?.[component.id];
      const validationError = computeValidationError(component, control);

      return {
        ...component,
        displayRestrictions: restrictions,
        validationError,
      };
    });

    return result;
  }, [layoutV4, layout, controls, resolution, reduxControls, gridColumns]);

  // Canvas component state + external data sync (layoutV4/controls/Redux → canvas)
  const {
    canvasComponents,
    setCanvasComponents,
    isInitialLoad,
    handleComponentsChangeTimeRef,
    componentUpdateTimeoutRef,
    lastComponentsRef,
  } = useComponentPositionSync({
    initialComponents: components,
    layoutV4,
    layout,
    controls,
    reduxControls,
    resolution,
    gridColumns,
  });

  // 🔧 SYNCHRONOUS CONTROL CREATION: Handle components change with debounced Redux updates
  const handleComponentsChange = useCallback(
    (newComponents: ResponsiveComponent[]) => {
      // 🔧 FIX: Track when handleComponentsChange is called to prevent useEffect from overwriting pending changes
      handleComponentsChangeTimeRef.current = Date.now();

      // Skip if components haven't actually changed (prevent unnecessary updates)
      if (JSON.stringify(newComponents) === JSON.stringify(lastComponentsRef.current)) {
        return;
      }

      lastComponentsRef.current = newComponents;

      // Identify new components that need Redux controls (immediate for selection)
      const currentComponentIds = new Set(canvasComponents.map((c) => c.id));
      const newComponentIds = newComponents.filter((c) => !currentComponentIds.has(c.id));

      // NAME SYNC: Store newly created controls to sync names back to canvas components
      const newlyCreatedControls = new Map<string, Control>();

      // Create Redux controls SYNCHRONOUSLY for NEW components only
      batch(() => {
        newComponentIds.forEach((component) => {
          const existingControl = controls?.[component.id];

          if (!existingControl) {
            let typeCode = getControlTypeCode(component.type);

            if (typeCode === 'HTM') {
              typeCode = 'TXT'; // Fixed: was 'HTML', should be 'HTM'
            }

            // Generate unique name using same logic as CaptionInput
            const existingComponents = convertControlsToComponents(controls);
            const defaultCaption = getDefaultCaption(component.type);
            const uniqueName = calculateNameFromLabelChange(
              defaultCaption,
              '',
              '',
              existingComponents,
              fieldListRef.current,
            );

            let safeName = uniqueName || defaultCaption;
            if (component.type === WIDGETS.TAGLIST) {
              safeName = 'TagList';
            }
            // Get control type config for display restrictions
            const controlType = mapWidgetToControlType(String(component.type));
            const controlConfig = controlType ? UnifiedControlRegistry[controlType] : undefined;

            // Get defaults first to preserve validationRules
            const controlDefaults = getControlDefaults(component.type);

            // Determine caption: CAL/CHT/TAG use default caption, others use unique safeName
            const specialCaption =
              component.type === 'CAL' || component.type === 'CHT' || component.type === 'TAG'
                ? getDefaultCaption(component.type)
                : null;
            const typeOverrideCode = getControlTypeCode(component.type);

            // Create control: registry defaults + instance-specific overrides + backend properties
            const newControl = {
              // Registry defaults provide: caption, disabled, visible, hideCaption, widthType,
              // classes, styles, onBlur/onChange/onClick/onFocus, validationRules, validationError,
              // and control-specific properties (model, buttons, columns, etc.)
              ...controlDefaults,

              // Instance-specific properties (cannot come from registry)
              id: component.id,
              name: safeName,
              x: component.x,
              y: component.y,
              width: component.width ?? (controlConfig?.displayRestrictions?.defaultWidth || 12),
              height: component.height ?? (controlConfig?.displayRestrictions?.defaultHeight || 10),
              containerId: component.containerId || null,
              visible: !component.isHidden,

              // Backend PascalCase properties
              Type: typeCode,
              Class: getControlClass(component.type),
              TypeOverride: typeOverrideCode,
              isBound: !!(component.isBound || component.type === WIDGETS.TAGLIST),
              IsComplexType: false,
              FieldType: 0,
              // Backend camelCase duplicates
              typeOverride: typeOverrideCode,
              isComplexType: false,
              fieldType: 0,
              isV4Control: true,
              icon: '',
              version: null,
              isOutputOnly: false,
              regularCaption: true,

              // Display — special types use their default caption
              caption: specialCaption || safeName,
              content: specialCaption || safeName,

              // Values — resolved by shared utility (replaces 3x duplicated IIFEs)
              ...resolveControlValues(component.type, component, getDefaultCaption(component.type)),

              // Preserve registry styles and validation (override spread for explicit merge)
              styles: controlDefaults.styles ?? {},
              validationRules: component.validationRules ?? controlDefaults.validationRules ?? null,

              // lowercase 'type' must be set last — some registry defaults
              // don't include 'type' for multi-widget control types like 'input'
              type: typeCode,
            };

            // 🔧 FIX: Set EditableGrid table to screen's baseModel and populate columns
            if (component.type === WIDGETS.DATATABLE && baseModel && fieldListRef.current) {
              // Set the table name
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (newControl as any).viewFriendlyName = baseModel;

              // Create default view
              const view = createGridView({ name: 'All', caption: 'All' });
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (newControl as any).viewList = [view];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (newControl as any).defaultViewFilter = view.id;

              // Populate columns using migrateGrid
              const migratedControl = migrateGrid(newControl, fieldListRef.current, true);
              if (migratedControl) {
                Object.assign(newControl, migratedControl);
              }
            }

            // 🔧 FIX: Set Gallery table to screen's baseModel
            if (component.type === WIDGETS.GALLERY && baseModel) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const galleryControl = newControl as any;
              if (!galleryControl.model) {
                galleryControl.model = {};
              }
              galleryControl.model.baseTable = baseModel;
              galleryControl.model.viewName = baseModel;
            }

            // 🔧 FIX: Compute validation error immediately for new controls
            // This ensures error states show right away, not after screen refresh
            const controlWithValidation = newControl as ControlWithValidation;
            controlWithValidation.validationError = computeValidationError(component, newControl);

            // 🔧 NAME SYNC: Store the newly created control for name syncing
            newlyCreatedControls.set(component.id, newControl);

            // Dispatch Redux control creation SYNCHRONOUSLY for immediate selection
            dispatch(controlUpdated(newControl));

            // BUTTON GROUP SPECIAL CASE: Create separate BGI control in Redux
            interface ControlWithButtons extends Control {
              buttons?: Control[];
            }

            if (
              component.type === 'BGR' &&
              (newControl as ControlWithButtons).buttons &&
              (newControl as ControlWithButtons).buttons!.length > 0
            ) {
              (newControl as ControlWithButtons).buttons!.forEach((button: Control) => {
                dispatch(controlUpdated(button));
              });
            }

            // CALENDAR SPECIAL CASE: Create separate BGI control in Redux
            if (
              component.type === 'CAL' &&
              (newControl as ControlWithButtons).buttons &&
              (newControl as ControlWithButtons).buttons!.length > 0
            ) {
              (newControl as ControlWithButtons).buttons!.forEach((button: Control) => {
                dispatch(controlUpdated(button));
              });
            }
          }
        });
      }); // end batch(newComponentIds)

      // 🔧 FIX: Detect if a container has moved by comparing positions
      // If a container moved, don't update any child positions to prevent double movement
      const containerHasMoved = newComponents.some((component) => {
        const existingControl = controls?.[component.id];
        // Check if this is a container that has moved
        return (
          existingControl &&
          component.containerId === null && // Top-level component
          component.type === WIDGETS.LAYOUT_CONTAINER && // Layout container
          (existingControl.x !== component.x || existingControl.y !== component.y)
        ); // Position changed
      });

      if (containerHasMoved) {
        // Container movement detected - skipping ALL child position updates to prevent interference
      }

      // Update existing components with position/size changes
      batch(() => {
        newComponents.forEach((component) => {
          // Use reduxControls to get the LATEST control state with all properties
          // The controls prop can be stale and missing type properties that were just added
          const existingControl = reduxControls[component.id];

          if (existingControl) {
            // 🔧 FIX: Check current Redux state to detect external updates
            const reduxControl = reduxControls[component.id];

            // 🔧 FIX: Skip ALL updates for child components when any container has moved
            // Use Redux containerId (authoritative) to determine if component is a child
            const isChildComponent = (reduxControl?.containerId ?? component.containerId) !== null;
            const shouldSkipChildUpdates = containerHasMoved && isChildComponent;

            if (shouldSkipChildUpdates) {
              // Skipping child component update due to container movement
              return; // Skip this child component entirely
            }

            // 🔧 FIX: If Redux has different values than controls prop, use Redux (external update)
            const useReduxPosition =
              reduxControl && (reduxControl.x !== existingControl.x || reduxControl.y !== existingControl.y);

            // Build the updated control object
            // Always use component.x/y (LayoutCanvas already handles container movement correctly)
            // Spread from reduxControl to preserve ALL properties including Type/type

            // Check if dimensions are locked (typeOverride just changed)
            const dimensionsLocked =
              reduxControl.__dimensionsLockedUntil && reduxControl.__dimensionsLockedUntil > Date.now();

            const updatedControl = {
              ...reduxControl,
              // Use Redux values if they differ from props (external update), otherwise use component
              x: useReduxPosition ? (reduxControl.x as number) : component.x,
              y: useReduxPosition ? (reduxControl.y as number) : component.y,
              // 🔧 FIX: Use Redux dimensions if locked (typeOverride just changed), otherwise use component
              width: dimensionsLocked ? reduxControl.width : component.width,
              height: dimensionsLocked ? reduxControl.height : component.height,
              // Use component.containerId for container drops (canvas→container), since Redux
              // hasn't been updated yet. Ejection (container→canvas) is handled by
              // onContainerComponentsChange which syncs containerId to Redux directly.
              containerId: component.containerId ?? reduxControl.containerId ?? null,
            };

        // AUTO-TOGGLE: Image label hides when resized below threshold
        const controlType = mapWidgetToControlType(String(component.type));
        if (controlType === 'image' && reduxControl.hideCaption === false && updatedControl.height < 5) {
          updatedControl.hideCaption = true;
        }

        // Only dispatch if something actually changed
        const hasChanges = (
          existingControl.x !== updatedControl.x ||
          existingControl.y !== updatedControl.y ||
          existingControl.width !== updatedControl.width ||
          existingControl.height !== updatedControl.height ||
          existingControl.containerId !== updatedControl.containerId ||
          existingControl.hideCaption !== updatedControl.hideCaption
        );

            if (hasChanges) {
              dispatch(controlUpdated(updatedControl));
            }
          }
        });
      }); // end batch(newComponents position update)

      // 🔧 FINAL FIX: Immediately update canvas components with correct widget types from newly created Redux controls
      const updatedComponents = newComponents.map((component) => {
        // For new components, check if we just created a Redux control for them
        const isNewComponent = newComponentIds.some((newComp) => newComp.id === component.id);

        // 🔧 VISIBILITY FIX: Always sync isHidden from control's visible property
        // const existingControl = controls?.[component.id];
        const reduxControl = reduxControls[component.id];
        // const syncedIsHidden = typeof existingControl?.visible === 'boolean' ? !existingControl.visible : component.isHidden;

        // 🔧 FIX: Check if dimensions are locked and should be synced from Redux
        const dimensionsLocked =
          reduxControl?.__dimensionsLockedUntil && reduxControl.__dimensionsLockedUntil > Date.now();

        // 🔧 DIMENSION CONSTRAINTS: Re-attach display restrictions if missing
        const controlType = mapWidgetToControlType(String(component.type));
        const restrictions = controlType
          ? UnifiedControlRegistry[controlType]?.displayRestrictions
          : component.displayRestrictions;

        // Validation
        const control = reduxControls?.[component.id] || controls?.[component.id];
        const validationError = computeValidationError(component, control);

        if (isNewComponent) {
          // 🔧 NAME SYNC: Get the regenerated unique name from newly created control
          const newlyCreatedControl = newlyCreatedControls.get(component.id);
          const correctName = newlyCreatedControl?.name || component.name;

          // Use the type code we just created in Redux to ensure consistency
          const typeCode = getControlTypeCode(component.type);

          // Map the type code back to the correct widget type
          const correctedWidgetType = typeCodeToWidgetType(typeCode);

          return {
            ...component,
            name: correctName, // NAME SYNC: Use the regenerated unique name from Redux
            type: correctedWidgetType, // Update component with correct widget type
            // isHidden: syncedIsHidden, // VISIBILITY FIX: Sync visibility state
            displayRestrictions: restrictions, // DIMENSION CONSTRAINTS: Preserve restrictions
            validationError, // VALIDATION: Include validation error
          };
        }

        // VISIBILITY FIX: Even for existing components, sync isHidden from control
        // DIMENSION LOCK FIX: If dimensions are locked, use Redux dimensions

        return {
          ...component,
          displayRestrictions: restrictions, // DIMENSION CONSTRAINTS: Preserve restrictions
          width: dimensionsLocked ? (reduxControl.width as number) : component.width,
          height: dimensionsLocked ? (reduxControl.height as number) : component.height,
          validationError, // VALIDATION: Include validation error
        };
      });

      // Auto-select newly created components (no delay needed since controls are created synchronously)
      if (newComponentIds.length > 0) {
        const newComponentId = newComponentIds[0].id;

        if (onControlClick) {
          // No setTimeout needed - Redux control is guaranteed to exist
          onControlClick(newComponentId);
        }
      }

      setCanvasComponents(updatedComponents);

      // Only save if not in initial load period
      if (!isInitialLoad) {
        if (onLayoutV4Change) {
          // Build flat layout items with responsive overrides, nest, and persist
          const flatWithResponsive = buildFlatLayoutItems(updatedComponents as ResponsiveComponent[], canvasComponents, layoutV4, resolution);
          onLayoutV4Change(assembleLayoutCanvas(flatWithResponsive, layoutV4, versionId));
        }

        // Send ALL components (including children) so parent can create Redux controls
        // The parent handleComponentsChange will now preserve containerId
        if (onComponentsChange) {
          onComponentsChange(newComponents);
        }
      }

      // 🔧 PERFORMANCE FIX: Debounce position/size updates for EXISTING components ONLY
      const hasExistingComponentChanges = newComponents.some((component) => {
        const existingControl = controls?.[component.id];
        return (
          existingControl &&
          !newComponentIds.some((newComp) => newComp.id === component.id) &&
          (existingControl.x !== component.x ||
            existingControl.y !== component.y ||
            existingControl.width !== component.width ||
            existingControl.height !== component.height ||
            existingControl.visible !== !component.isHidden)
        );
      });

      if (hasExistingComponentChanges) {
        if (componentUpdateTimeoutRef.current) {
          clearTimeout(componentUpdateTimeoutRef.current);
        }

        componentUpdateTimeoutRef.current = setTimeout(() => {
          // Update existing components with position/size changes
          batch(() => {
            newComponents.forEach((component) => {
              const existingControl = controls?.[component.id];

              if (existingControl && !newComponentIds.some((newComp) => newComp.id === component.id)) {
                // 🔧 FIX: Check current Redux state to detect external updates
                const reduxControl = reduxControls[component.id];

                // 🔧 FIX: Skip ALL updates for child components when any container has moved
                // Use Redux containerId (authoritative) to determine if component is a child
                const isChildComponent = (reduxControl?.containerId ?? component.containerId) !== null;
                const shouldSkipChildUpdates = containerHasMoved && isChildComponent;

                if (shouldSkipChildUpdates) {
                  // Skipping child component update due to container movement
                  return; // Skip this child component entirely
                }

                // 🔧 FIX: If Redux has different values than controls prop, use Redux (external update)
                const useReduxPosition =
                  reduxControl && (reduxControl.x !== existingControl.x || reduxControl.y !== existingControl.y);

                // 🔧 FIX: Check if dimensions are locked (typeOverride just changed)
                const dimensionsLocked =
                  reduxControl?.__dimensionsLockedUntil && reduxControl.__dimensionsLockedUntil > Date.now();

                // Build the updated control object
                const updatedControl = {
                  ...existingControl,
                  // Use Redux values if they differ from props (external update), otherwise use component
                  x: useReduxPosition ? (reduxControl.x as number) : component.x,
                  y: useReduxPosition ? (reduxControl.y as number) : component.y,
                  // 🔧 FIX: Use Redux dimensions if locked (typeOverride just changed), otherwise use component
                  width: dimensionsLocked ? reduxControl.width : component.width,
                  height: dimensionsLocked ? reduxControl.height : component.height,
                  // Use component.containerId for container drops (canvas→container). Ejection
                  // (container→canvas) is handled by onContainerComponentsChange directly.
                  containerId: component.containerId ?? (reduxControl ? (reduxControl.containerId ?? null) : null),
                };

            // AUTO-TOGGLE: Image label hides when resized below threshold
            const controlType = mapWidgetToControlType(String(component.type));
            if (controlType === 'image' && reduxControl?.hideCaption === false && updatedControl.height < 5) {
              updatedControl.hideCaption = true;
            }

            // Check if any properties actually changed
            const hasChanges = (
              existingControl.x !== updatedControl.x ||
              existingControl.y !== updatedControl.y ||
              existingControl.width !== updatedControl.width ||
              existingControl.height !== updatedControl.height ||
              existingControl.containerId !== updatedControl.containerId
            );

                if (hasChanges) {
                  dispatch(controlUpdated(updatedControl));
                }
              }
            });
          }); // end batch(newComponents debounced update)

          // Only save position/size updates if not in initial load period
          if (!isInitialLoad) {
            // V4 LAYOUT API: Update V4 layout structure with breakpoint-specific saving
            if (onLayoutV4Change) {
              // Build flat layout items with responsive overrides, nest, and persist
              const flatWithResponsive = buildFlatLayoutItems(newComponents as ResponsiveComponent[], canvasComponents, layoutV4, resolution);
              onLayoutV4Change(assembleLayoutCanvas(flatWithResponsive, layoutV4, versionId));
            }

            // Send ALL components (including children) so parent can create/update Redux controls
            // The parent handleComponentsChange will now preserve containerId
            if (onComponentsChange) {
              onComponentsChange(newComponents);
            }
          }
        }, 200); // 200ms debounce for position/size updates only
      }
    },
    [
      canvasComponents,
      controls,
      reduxControls,
      getControlDefaults,
      dispatch,
      onControlClick,
      isInitialLoad,
      onLayoutV4Change,
      layoutV4,
      versionId,
      onComponentsChange,
      resolution,
      baseModel,
      componentUpdateTimeoutRef,
      handleComponentsChangeTimeRef,
      lastComponentsRef,
      setCanvasComponents,
    ],
  );

  // Handle component clicks
  const handleComponentClick = useCallback(
    (componentId: string) => {
      if (onControlClick) {
        onControlClick(componentId);
      }
    },
    [onControlClick],
  );

  const handleSelectControlById = (controlId: string) => {
    return reduxControls?.[controlId];
  };

  const handleControlSelected = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: { controlId: string; property?: any; canvasClickDisabled?: boolean } | null,
  ) => {
    dispatch(controlSelected(payload));
  };
  // Debug selection state changes
  React.useEffect(() => {
    // LayoutCanvasWrapper selectedControlId changed
  }, [selectedControlId]);

  // Container handlers for drag/drop into layout containers
  const {
    onContainerDrop,
    onContainerDragOver,
    onContainerDragLeave,
    onComponentDragStart,
    onContainerComponentsChange,
    dragOverContainerId,
  } = useContainerCanvasHandlers({
    canvasComponents,
    setCanvasComponents,
    controls,
    reduxControls,
    onLayoutV4Change,
    layoutV4,
    versionId,
    resolution,
    handleComponentsChange,
    fieldListRef,
    isInitialLoad,
    handleComponentsChangeTimeRef,
    lastComponentsRef,
    componentUpdateTimeoutRef,
  });

  const rowHeight = 16;

  // Calculate column width to match LayoutCanvas calculations
  const colWidth = useMemo(() => {
    const containerPadding = 8; // matches containerPadding={[8, 8]}
    return (canvasWidth - containerPadding * 2) / gridColumns;
  }, [canvasWidth, gridColumns]);

  const enhancedLayoutContainerBridgeRef = useRef<EnhancedLayoutContainerBridge>({
    dragOverContainerId,
    onContainerDrop,
    onContainerDragOver,
    onContainerDragLeave,
    onComponentDragStart,
    ResponsiveGridLayout,
    rowHeight,
    colWidth,
    containerWidth: canvasWidth,
    onContainerComponentsChange,
    controlRegistry: UnifiedControlRegistry,
  });

  enhancedLayoutContainerBridgeRef.current = {
    dragOverContainerId,
    onContainerDrop,
    onContainerDragOver,
    onContainerDragLeave,
    onComponentDragStart,
    ResponsiveGridLayout,
    rowHeight,
    colWidth,
    containerWidth: canvasWidth,
    onContainerComponentsChange,
    controlRegistry: UnifiedControlRegistry,
  };

  const enhancedLayoutContainerWrapper = React.useMemo(
    () => createEnhancedLayoutContainerWrapper(enhancedLayoutContainerBridgeRef),
    [],
  );

  // Create enhanced control registry using existing UnifiedControlRegistry with layout container canvas functionality
  const enhancedControlRegistry = React.useMemo(() => {
    // Calendar wrapper for special case handling
    const CalendarWrapper = ({ id }: { id: string }) =>
      React.createElement(CalendarDesignerWrapper, {
        id,
        canvasWidth,
      });

    return {
      ...UnifiedControlRegistry,
      // Override layout container with enhanced wrapper
      layoutContainer: {
        ...UnifiedControlRegistry.layoutContainer,
        wrapper: enhancedLayoutContainerWrapper,
      },
      // Add calendar support as a special case
      [WIDGETS.CALENDAR]: {
        wrapper: CalendarWrapper,
      },
    };
  }, [
    enhancedLayoutContainerWrapper,
    canvasWidth,
  ]);

  // DELETED CONTROL GUARD: Filter out components whose controls have been deleted from Redux
  // This prevents crashes when trying to render components that no longer exist
  // Use reduxControls instead of controls prop to avoid timing issues
  const validCanvasComponents = useMemo(() => {
    if (!canvasComponents) return [];
    
    const filtered = canvasComponents.filter((component) => {
      // Check reduxControls directly - it's more up-to-date than controls prop
      const hasControlInRedux = reduxControls[component.id] !== undefined;
      const hasControlInProps = controls?.[component.id] !== undefined;
      const hasControl = hasControlInRedux || hasControlInProps;
      return hasControl;
    });
    // Recompute validation from current reduxControls to avoid stale errors
    return filtered.map((component) => {
      const control = reduxControls?.[component.id] || controls?.[component.id];
      const validationError = computeValidationError(component, control);
      return { ...component, validationError };
    });
  }, [canvasComponents, controls, reduxControls]);

  const chartValidation = useMemo(
    () => ({
      parseExpression: (expr) => parseExpression(expr),
      validateChart: (control) => validateChart(control),
      validateExpression: (parsed) => validateExpression(parsed),
    }),
    [],
  );
  const chartFieldTypes = useMemo(
    () => ({
      fieldTypeIds: { Integer: FieldTypeIds.Integer, DropDown: FieldTypeIds.DropDown },
      fieldTypeIdLookup,
    }),
    [],
  );
  const [designerChartDataResults, setDesignerChartDataResultState] = useState({});
  const [designerDrilldownResults, setDesignerDrilldownResults] = useState({});
  const [designerDrilldownRequests, setDesignerDrilldownRequests] = useState({});
  const setDesignerChartDataResult = useCallback((controlId, result) => {
    setDesignerChartDataResultState((prev) => ({ ...prev, [controlId]: result }));
  }, []);
  const setDesignerDrilldownResult = useCallback((controlId, result) => {
    setDesignerDrilldownResults((prev) => ({ ...prev, [controlId]: result }));
  }, []);
  const setDesignerDrilldownRequest = useCallback((controlId, request) => {
    if (!request) {
      setDesignerDrilldownRequests((prev) => {
        const next = { ...prev };
        delete next[controlId];
        return next;
      });
      setDesignerDrilldownResults((prev) => {
        const next = { ...prev };
        delete next[controlId];
        return next;
      });
      return;
    }
    setDesignerDrilldownRequests((prev) => ({ ...prev, [controlId]: request }));
  }, []);

  const chartComponents = useMemo(
    () => (validCanvasComponents || []).filter((c) => c.type === String(WIDGETS.CHART)),
    [validCanvasComponents],
  );

  if (isLoading && !error) {
    return (
      <Container
        id='canvas-wrapper'
        borderless
        style={{
          display: 'flex',
          padding: '160px 16px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          flex: '1 0 0',
          alignSelf: 'stretch',
          background: '#FFF',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.10)',
        }}
      >
        <LoadingSkeleton count={1} height={400} />
      </Container>
    );
  }

  if (!isLoading && error) {
    return (
      <Container
        id='canvas-wrapper'
        borderless
        style={{
          display: 'flex',
          padding: '160px 16px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          flex: '1 0 0',
          background: '#FFF',
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.10)',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', padding: 32 }}>
          <h2>Unable to load requested screen version</h2>
        </div>
      </Container>
    );
  }

  if (!hasControls && !isPaletteOpen) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFF',
            flex: 1,
          }}
        >
          <EmptyCanvasState onAddComponents={onAddComponents || (() => { })} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Main canvas area - Edge to Edge */}
      <div
        style={{
          width: appRibbonType === 2 ? '440px' : '100%',
          height: '100%',
          borderRight: appRibbonType === 1 ? '1px solid #E4EAF0' : 'none',
          overflow: 'auto',
          background: '#FFF',
          flex: appRibbonType === 2 ? '0 0 440px' : 1, // Fixed 440px for 2/3, flex for others
        }}
      >
        <ScreenDataContextProvider
          accountName={accountName || undefined}
          displayPreferences={displayPreferences}
          featureFlags={featureFlags || {}}
          tagsList={tagsList || {}}
          isDirty={false}
          closeDialog={() => { }}
          methodIdentity={methodIdentity || undefined}
          setIsDirty={() => { }}

        >
          <DesignerContextProvider
            onControlSelected={handleControlSelected}
            selectControlById={handleSelectControlById}
            selectedControlId={selectedControlId ?? null}
            selectedControlProperty={selectedControlProperty ?? null}
            onLoadGridData={useGetGridDataLegacyQuery}
            onLoadDropdownData={useGetDropdownDataLegacyQuery}
            onLoadDropdownDataLazy={triggerDropdownQuery}
            onLoadGalleryData={useGetGalleryDataLegacyQuery}
            activeRecordId={activeRecordId || undefined}
            screenId={screenId || undefined}
            authContext={authContext}
            chartValidation={chartValidation}
            chartFieldTypes={chartFieldTypes}
            designerChartDataResults={designerChartDataResults}
            setDesignerChartDataResult={setDesignerChartDataResult}
            designerDrilldownResults={designerDrilldownResults}
            setDesignerDrilldownRequest={setDesignerDrilldownRequest}
          >
            <ChartDataFetchers
              chartComponents={chartComponents}
              screenId={screenId || undefined}
              activeRecordId={activeRecordId || undefined}
              controls={reduxControls}
            />
            <DrilldownDataFetchers
              chartComponents={chartComponents}
              designerDrilldownRequests={designerDrilldownRequests}
              setResult={setDesignerDrilldownResult}
              accountName={accountName || ''}
            />
            <LayoutCanvas
              components={validCanvasComponents}
              width={canvasWidth}
              cols={gridColumns}
              rowHeight={rowHeight}
              controlRegistry={enhancedControlRegistry}
              isDraggable
              isResizable
              showGrid
              selectedComponentId={selectedControlId}
              onComponentClick={handleComponentClick}
              onComponentsChange={handleComponentsChange}
              onLayoutV4Change={onLayoutV4Change}
              resolution={resolution}
              onLayoutChange={() => {
                // Layout changed
              }}
              isCanvasSelected={selectedControlId === null}
              fieldList={fieldListRef.current}
              mode='designer'
              showHiddenComponents={showHiddenComponents}
              compactType={staticLayout ? null : 'vertical'}
              defaultFocusControlName={defaultFocusControlName}
            />
          </DesignerContextProvider>
        </ScreenDataContextProvider>
      </div>

      {/* 1/3 Ribbon sidebar (appRibbonType === 1) - V3 parity */}
      {appRibbonType === 1 && (
        <React.Suspense fallback={<LoadingSkeleton count={1} width={74} height="100%" />}>
          <Ribbon
            onControlClick={onControlClick}
            tabList={tabList as Array<{ id: string; caption: string; icon?: string; color?: string; recordCount?: number; visible: boolean; isStock?: boolean }>}
            selectedTab={currentTab || undefined}
            onTabSettingsChange={onTabsSettingsChange}
          />
        </React.Suspense>
      )}

      {/* 2/3 Tab Panel area (appRibbonType === 2) - V3 parity */}
      {appRibbonType === 2 && (
        <React.Suspense fallback={<LoadingSkeleton count={1} width="100%" height={600} />}>
          <TabPanelWrapper
            onControlClick={onControlClick}
            tabList={tabList as Array<{ id: string; caption: string; visible: boolean; recordCount?: number; isStock?: boolean }>}
            selectedTab={currentTab || undefined}
          />
        </React.Suspense>
      )}
    </div>
  );
},
  (prevProps, nextProps) => {
    // 🔧 PERFORMANCE OPTIMIZATION: Custom comparison function to prevent unnecessary re-renders
    // Only re-render if props that actually affect the component have changed

    // Core data props that trigger re-renders
    if (prevProps.layoutV4 !== nextProps.layoutV4) return false;
    if (prevProps.controls !== nextProps.controls) return false;
    if (prevProps.layout !== nextProps.layout) return false;

    if (prevProps.isPaletteOpen !== nextProps.isPaletteOpen) return false;

    // Selection state (selectedControlProperty drives chart drilldown open in layout-canvas)
    if (prevProps.selectedControlId !== nextProps.selectedControlId) return false;
    if (prevProps.selectedControlProperty !== nextProps.selectedControlProperty) return false;

    // Loading/error states
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.error !== nextProps.error) return false;

    // Layout configuration
    if (prevProps.appRibbonType !== nextProps.appRibbonType) return false;
    // if (prevProps.resolution !== nextProps.resolution) return false;
    if (prevProps.containerHeight !== nextProps.containerHeight) return false;
    if (prevProps.versionId !== nextProps.versionId) return false;
    if (prevProps.staticLayout !== nextProps.staticLayout) return false;
  // Canvas width must trigger re-render so LayoutCanvas receives the updated width
  // prop and repositions elements correctly when the designer pane is resized (NCNG-831)
  if (prevProps.canvasWidth !== nextProps.canvasWidth) return false;

    // Tab configuration
    if (JSON.stringify(prevProps.tabList) !== JSON.stringify(nextProps.tabList)) return false;
    // Selected control property (for ribbon tab selection)
    if (JSON.stringify(prevProps.selectedControlProperty) !== JSON.stringify(nextProps.selectedControlProperty)) return false;

    // Callbacks are stable (useCallback), so don't compare them unless necessary
    // They would cause re-renders every time even if unchanged due to reference equality

    return true; // Props are the same, skip re-render
  },
);

LayoutCanvasWrapper.displayName = 'LayoutCanvasWrapper';

export default LayoutCanvasWrapper;
