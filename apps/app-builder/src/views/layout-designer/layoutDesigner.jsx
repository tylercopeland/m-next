/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Container from '@m-next/container';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { widgets } from '@m-next/types';
import { fieldTypeNameLookup } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import { openActionEditor } from '@m-next/action-editor';
import { ComponentPalette, getGridColumns } from '@m-next/layout-canvas';

import { buildV4ControlsPayload, transformScreenProperties, buildSaveRequestBody } from './utils/savePayloadBuilder';
import { getDesignerCanvasStyle, getDesignerCanvasWidth, clampCanvasWidth } from './utils/designerCanvasConfig';
import { useControlDuplicate } from './hooks/useControlDuplicate';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import DeleteDialog, { ContainerDeleteBlockedDialog } from './editors/common/components/delete-dialog';
import { collectIdsToDelete, removeControlsFromLayout } from './editors/common/utils/deleteControlHelper';
import {
  screenLayoutApi,
  useGetScreenLayoutQuery,
  useGetScreenDataQuery,
  useUpdateScreenLayoutMutation,
} from '../../common/services/screenLayoutApi';
import {
  screenLoaded,
  controlUpdated,
  screenStates,
  saveScreen,
  screenSaved,
  focusOn,
  changeActiveRecord,
  screenFieldsLoaded,
  controlSelected,
  actionUpdated,
  layoutV4Updated,
  ribbonUpdated,
  ribbonVisualizationUpdated,
  ribbonsRefreshComplete,
  screenPropertiesUpdated,
  controlDeleted,
  selectResolution,
  selectForceRefetchTimestamp,
  // ===== AGGRESSIVE OPTIMIZATION: Use combined selector instead of 20+ individual selectors
  selectLayoutDesignerState,
} from '../../common/services/screenLayoutSlice';
import { Toolbar } from '../../components/Toolbar';
import { ScreensPanel } from './screens-panel/ScreensPanel';
import * as s from './layoutDesigner.styles';
import { useRUMRouteChange } from '../../common/rum';
import {
  selectAppName,
  selectScreenName,
  selectVersionNumber,
  selectPublishStatus,
} from '../../common/services/appSlice';
import { useGetFieldsForTableQuery } from '../../common/services/tablesFieldsApi';
import { selectAccountName, selectFeatureFlags, selectNocodeAssistantSessionId, nocodeAssistantSessionSet } from '../../common/services/sessionSlice';
import { dataLoaded, dataLoading, dataStates, selectRecordStatus } from '../../common/services/dataSlice';
import { useGetDataQuery, useGetRibbonsQuery } from '../../common/services/runtimeApi';
import { colors } from '@m-next/styles';
import useAppBuildStreaming from '../../common/hooks/useAppBuildStreaming';

const Canvas = React.lazy(() => import('./canvas'));
const RightPanel = React.lazy(() => import('./right-panel/rightPanel'));
const LayoutCanvasWrapper = React.lazy(() => import('./LayoutCanvasWrapper'));
const MigrationBanner = React.lazy(() => import('../../components/MigrationBanner'));

const propTypes = {
  onOpenAdvancedDesigner: PropTypes.func,
  onSendAnalytics: PropTypes.func,
  refreshLayout: PropTypes.number,
};

function LayoutDesigner({ onOpenAdvancedDesigner, onSendAnalytics, refreshLayout }) {
  const { appId, screenId, versionId } = useParams();

  const { height: containerHeight, width: containerMeasuredWidth, ref: containerRef } = useResizeDetector();
  const [tabList, setTabList] = useState([]);
  const [newRibbon, setNewRibbon] = useState(false);

  // ===== AGGRESSIVE OPTIMIZATION: Single Combined Selector =====
  // Replace 20+ individual selectors with 1 to dramatically reduce re-renders
  const layoutDesignerState = useSelector(selectLayoutDesignerState);
  const {
    status,
    appRibbonType,
    layout,
    controls,
    changes,
    selectedControlId,
    selectedControlProperty,
    layoutV4,
    dataModels,
    activeRecordId,
    currentScreen,
    currentVersion,
    ribbonCurrentConfiguration,
    ribbonConfiguration,
    ribbonStatus,
    screenProperties,
    baseModel,
    actionUpserts,
    ribbonVisualization,
  } = layoutDesignerState;

  const resolution = useSelector(selectResolution);
  // RTK Query mutation for updating screen
  const [updateScreen] = useUpdateScreenLayoutMutation();

  // Keep these separate as they come from different slices
  const appName = useSelector(selectAppName);
  const screenName = useSelector(selectScreenName);
  const accountName = useSelector(selectAccountName);
  const featureFlags = useSelector(selectFeatureFlags);
  const versionNumber = useSelector(selectVersionNumber);
  const accountingType = useSelector((state) => state.app.accountingType);
  const publishStatus = useSelector(selectPublishStatus);
  const nocodeAssistantSessionId = useSelector(selectNocodeAssistantSessionId);
  const forceRefetchTimestamp = useSelector(selectForceRefetchTimestamp);

  // Initialize app build streaming to handle screen_built events from AI backend
  useAppBuildStreaming(nocodeAssistantSessionId || '', {
    enabled: !!nocodeAssistantSessionId,
    currentScreenId: screenId,
  });

  // Get isV4Screen from Redux state (loaded from backend screen layout data)
  // This value is set per-screen in the database, not via feature flag
  // const canUseNewLayoutCanvas = featureFlags.useNewLayoutCanvas ?? false;
  const isV4Screen = layoutDesignerState.isV4Screen;

  const [modelStack, setModelStack] = useState(null);
  const [fireLoadEventOnce, setFireLoadEventOnce] = useState(true);

  const v4DataState = useSelector((state) =>
    selectRecordStatus(state, modelStack && modelStack.length > 0 ? modelStack[0] : '', activeRecordId),
  );
  const [pendingActionEdit, setPendingActionEdit] = useState(null);

  const {
    data,
    error,
    isFetching,
    refetch: refetchLayoutQuery,
  } = useGetScreenLayoutQuery(
    { appId, screenId, versionId },
    {
      skip: currentScreen === screenId && currentVersion === versionId,
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: screenData, refetch: refetchScreenData } = useGetScreenDataQuery({
    appId,
    screenId,
    versionId,
  });

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();

  const triggerRefresh = useCallback(async () => {
    try {
      // Add a 1ms timeout before refetching
      setTimeout(() => {}, 1);
      await refetchLayoutQuery();
      await refetchScreenData();
    } catch (ex) {
      // Catch the "Cannot refetch a query that has not been started yet" error
      // This happens when closing the action editor with an empty action set
      console.warn('Error refetching layout query:', ex);
    }
  }, [screenId, versionId, currentScreen, currentVersion, refetchLayoutQuery, refetchScreenData]);

  useEffect(() => {
    // Add a 1ms timeout before refetching
    setTimeout(() => {}, 1);

    // Only refetch if the queries are available and not skipped
    if (refetchLayoutQuery) {
      try {
        refetchLayoutQuery();
      } catch (ex) {
        console.warn('Error refetching layout query:', ex);
      }
    }
    if (refetchScreenData) {
      try {
        refetchScreenData();
      } catch (ex) {
        console.warn('Error refetching screen data:', ex);
      }
    }
  }, [refreshLayout, refetchLayoutQuery, refetchScreenData]);

  useEffect(() => {
    triggerRefresh();
  }, [triggerRefresh]);

  // Update document title with screen name
  useEffect(() => {
    if (screenName) {
      document.title = `App Builder | ${screenName}`;
    } else {
      document.title = 'App Builder';
    }

    // Cleanup: Reset to default when component unmounts
    return () => {
      document.title = 'App Builder';
    };
  }, [screenName]);

    // Force refetch when AI build completes for the current screen
  useEffect(() => {
    if (forceRefetchTimestamp) {
      console.log('[LayoutDesigner] Force refetch triggered by AI build completion, timestamp:', forceRefetchTimestamp);      
      
      // Use initiate() to force a fetch even when the query is skipped
      dispatch(screenLayoutApi.endpoints.getScreenLayout.initiate(
        { appId, screenId, versionId },
        { forceRefetch: true }
      )).unwrap()
        .then((result) => {
          dispatch(screenLoaded(result));
        })
        .catch(ex => {
          console.warn('[LayoutDesigner] Error during force refetch:', ex);
        });
    }
  }, [forceRefetchTimestamp, dispatch, appId, screenId, versionId]);

  // Handle sessionId from URL query params (passed from plan mode redirect)
  useEffect(() => {
    const urlSessionId = searchParams.get('sessionId');
    if (urlSessionId && urlSessionId !== nocodeAssistantSessionId) {
      // Store sessionId in Redux to enable streaming (overwrite if different)
      console.log('[LayoutDesigner] Setting sessionId from URL:', urlSessionId);
      dispatch(nocodeAssistantSessionSet(urlSessionId));
    }
  }, [searchParams, nocodeAssistantSessionId, dispatch]);

  const { data: modelData } = useGetDataQuery(
    {
      dataModelId: modelStack && modelStack.length > 0 ? modelStack[0] : '',
      screenId,
      versionId,
      activeRecordId,
      isV4Control: true,
    },
    { skip: !modelStack || modelStack.length === 0, refetchOnMountOrArgChange: true },
  );

  // Triggers query on mount, when screenId changes, or if the cache is invalidated
  const { data: ribbonData, refetch: refetchRibbons } = useGetRibbonsQuery(
    { screenId, versionId, activeRecordId },
    { skip: !activeRecordId || appRibbonType === 0 },
  );

  useEffect(() => {
    const updated =
      ribbonData?.ribbons.map((ribbon) => ({
        ...ribbon,
        id: ribbon.recordId,
        ribbonId: ribbon.recordId,
      })) ?? [];

    if (ribbonCurrentConfiguration && Object.keys(ribbonCurrentConfiguration).length > 0) {
      const updatedRibbons = updated.map((ribbon) => {
        const config = ribbonCurrentConfiguration[ribbon.id];
        if (config && !config.create) {
          const updatedConfig = { ...config };
          updatedConfig.recordCount = ribbon.recordCount;
          return updatedConfig;
        }
        return ribbon;
      });
      setTabList(updatedRibbons);
    } else {
      setTabList(updated);
    }
  }, [ribbonData, ribbonCurrentConfiguration]);

  // Get base model from layoutDesignerState which already includes it
  // const baseModel = useSelector(selectBaseModel); // This selector doesn't exist, using from layoutDesignerState instead

  // Determine if we're in empty state (no controls)
  const hasControls = useMemo(() => controls && Object.keys(controls).length > 0, [controls]);

  // Component palette should be collapsed in empty state
  // Initialize from URL param if present (for deep linking from ChatPanel)
  const initialPanel = searchParams.get('panel');
  const [currentSidebarPanel, setCurrentSidebarPanel] = useState(
    initialPanel === 'screens' || initialPanel === 'components' ? initialPanel : null
  );

  const updateSidebarPanel = useCallback((panel) => {
    setCurrentSidebarPanel(panel);
    // Update URL params to maintain deep link state
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    if (panel) {
      params.panel = panel;
    } else {
      delete params.panel;
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Close panel if screen loaded with no controls, and no panel in search params
  useEffect(() => {
    const isScreenLoaded = status === screenStates.ready || status === screenStates.editing || status === screenStates.saving;
    if (isScreenLoaded && !hasControls && !currentSidebarPanel) {
      updateSidebarPanel(undefined); 
    }
  }, [status, hasControls, currentSidebarPanel, updateSidebarPanel]);

  useEffect(() => {
    if (isV4Screen) {
      dispatch(controlSelected(null));
    }
  }, [location]);

  useEffect(() => {
    if (dataModels && dataModels.length > 0 && modelStack === null) {
      const stack = dataModels.map((x) => x.id);
      setModelStack(stack);
    }
  }, [dataModels, modelStack, activeRecordId, screenId, versionId]);

  useEffect(() => {
    if (v4DataState === dataStates.uninitialized && modelStack && modelStack.length > 0) {
      dispatch(dataLoading({ dataModelId: modelStack[0], activeRecordId }));
    }
  }, [activeRecordId, dispatch, modelStack, v4DataState]);

  useEffect(() => {
    if (modelData) {
      // temp hack to load and clear data for templates.
      if (screenName.includes('View')) {
        dispatch(dataLoaded({ dataModelId: modelStack[0], activeRecordId, modelData }));
      } else if (screenName.includes('New')) {
        dispatch(dataLoaded({ dataModelId: modelStack[0], activeRecordId, modelData: {} }));
      }

      const next = [...modelStack];
      next.pop();
      if (next.length > 0) {
        dispatch(dataLoading({ dataModelId: next[0], activeRecordId }));
      }
      setModelStack(next);
    }
  }, [modelData]);

  useEffect(() => {
    setModelStack(null);
  }, [screenId, versionId]);

  const {
    data: fieldList,
    error: fieldError,
    isLoading: fieldIsLoading,
  } = useGetFieldsForTableQuery({ accountName, tableName: baseModel, complexFields: true }, { skip: !baseModel });

  useEffect(() => {
    if (!isFetching && !error && data) {
      dispatch(screenLoaded(data));

      // Check if migration just completed successfully
      const showToast = localStorage.getItem('showMigrationToast');
      if (showToast === 'true' && data.isV4Screen) {
        toast.success('Screen upgrade completed to App Builder');
        localStorage.removeItem('showMigrationToast');
      }
    }
  }, [data, dispatch, error, isFetching, versionId]);

  useEffect(() => {
    const designerFields = screenData?.Data?.screen?.fields || screenData?.screen?.fields;

    if (designerFields?.length) {
      const transformed = designerFields.map((f) => {
        let caption = f.name
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .trim()
          .toLowerCase();
        caption = caption.charAt(0).toUpperCase() + caption.slice(1);
        return {
          name: f.name,
          caption,
          type: typeof f.type === 'number' ? fieldTypeNameLookup(f.type, f.name) : f.type,
          size: f.maxSize ?? null,
          isVisible: true,
          isRequired: f.isRequired ?? false,
          isLinked: !!f.dropdown_viewNameFriendly,
          sourceModel: f.dropdown_viewNameFriendly || baseModel,
          sourceField: f.name,
        };
      });
      dispatch(screenFieldsLoaded(transformed));
    } else if (!fieldIsLoading && !fieldError && fieldList) {
      dispatch(screenFieldsLoaded(fieldList));
    }
  }, [dispatch, fieldError, fieldIsLoading, fieldList, screenData, baseModel]);

  useEffect(() => {
    async function fetchData() {
      if (status === screenStates.idle) {
        useRUMRouteChange('/layout-designer/loading');
      }
      if (status === screenStates.ready) {
        useRUMRouteChange(`/layout-designer/:screen`);

        if (onSendAnalytics && fireLoadEventOnce) {
          setFireLoadEventOnce(false); // Ensure this event only fires once per screen load
          const focusParam = searchParams.get('focus');
          let openVia = null;
          if (focusParam) {
            const match = controls?.[focusParam];
            if (match) {
              if (match.type === widgets.DATATABLE) {
                openVia = 'Grid';
              }
              if (match.type === widgets.CHART) {
                openVia = 'Chart';
              }
            }
          }
          const body = {
            action: 'App Builder Loaded',
            screenId,
            openVia,
          };
          onSendAnalytics('Designer Action', body);
        }
      }

      if (status === screenStates.saving) {
        try {
          // Access changes by versionId - changes is structured as changes[versionId][controlId]
          const versionChanges = changes[versionId] || {};
          // V4 LAYOUT API FIX: For V4 screens, restructure controls to match backend expectations
          const controlsPayload = isV4Screen
            ? buildV4ControlsPayload(controls, versionChanges)
            : { ...controls, ...versionChanges };

          const transformedScreenProperties = transformScreenProperties(screenProperties);

          const body = buildSaveRequestBody({
            controlsPayload,
            versionId,
            actionUpserts,
            ribbonConfiguration,
            ribbonVisualization,
            transformedScreenProperties,
            layoutV4: layoutV4 || null,
            isV4Screen,
          });

          await updateScreen({ appId, screenId, versionId, body }).unwrap();

          if (((ribbonConfiguration && Object.keys(ribbonConfiguration).length > 0) || newRibbon) && ribbonData) {
            refetchRibbons();
            setNewRibbon(false);
          }
          if (pendingActionEdit) {
            openActionEditor(
              pendingActionEdit.control === 'Screen' ? 'Screen' : { options: pendingActionEdit.control },
              pendingActionEdit.eventName,
            );
            setPendingActionEdit(null);
          }
        } catch (ex) {
          toast.error(`Error saving screen - ${ex.data?.message}`);
        } finally {
          dispatch(screenSaved());
        }
      }
    }
    fetchData();
  }, [appId, appName, changes, layoutV4, screenId, screenName, status, versionId]);

  useEffect(() => {
    if (ribbonStatus === screenStates.refreshed) {
      refetchRibbons();
      dispatch(ribbonsRefreshComplete());
    }
  }, [ribbonStatus]);

  useEffect(() => {
    const focusParam = searchParams.get('focus');
    if (focusParam) {
      setTimeout(() => {
        dispatch(focusOn(focusParam));
        dispatch(controlSelected({ controlId: focusParam }));
      }, 500);
    }
    if (status === screenStates.idle) {
      const recordParam = searchParams.get('activerecordid');
      if (recordParam && recordParam !== activeRecordId) {
        dispatch(changeActiveRecord(recordParam));
      }
    }
  }, []);

  const handleControlChange = (control) => {
    dispatch(controlUpdated(control));
  };

  // Track if we've done the initial auto-select for this version
  const hasAutoSelectedRef = React.useRef({});

  // Auto-select the default focus control when screen loads (only once per version)
  useEffect(() => {
    const defaultFocusControlName = screenProperties?.defaultFocusControl;
    // Only auto-select if:
    // 1. There's a defaultFocusControl defined
    // 2. We haven't auto-selected for this version yet
    // 3. Controls are loaded
    if (defaultFocusControlName && !hasAutoSelectedRef.current[versionId] && controls) {
      // Find the control by name (since dropdown stores control.name, not control.id)
      const controlEntry = Object.values(controls).find((control) => control.name === defaultFocusControlName);

      if (controlEntry) {
        dispatch(controlSelected({ controlId: controlEntry.id, property: null }));
        hasAutoSelectedRef.current[versionId] = true;
      }
    }
  }, [versionId, screenProperties?.defaultFocusControl, controls, dispatch]);

  // No-op: control creation handled entirely in LayoutCanvasWrapper
  const handleComponentsChange = useCallback(() => {}, []);

  const handleLayoutV4Change = useCallback(
    (layoutCanvas) => dispatch(layoutV4Updated({ versionId, layoutCanvas })),
    [dispatch, versionId],
  );

  const handleScreenPropertiesChanges = (properties) => dispatch(screenPropertiesUpdated(properties));

  const handleActionChange = (action) => dispatch(actionUpdated(action));

  const handleRibbonChange = (action) => {
    dispatch(ribbonUpdated(action));
    if (action.create) {
      const updated = [...tabList];
      updated.push(action);
      setTabList(updated);
      setNewRibbon(true);
    }
  };

  const handleAddAction = (control, eventName) => {
    if (!control) {
      // Screen-level event: create action set and bind to screen property
      const screenEventMap = { Load: 'onLoad', Focus: 'onFocus', ActiveRecordChange: 'onActiveRecordChange' };
      const propName = screenEventMap[eventName];
      if (propName && !screenProperties?.[propName]) {
        const actionSetId = Guid.create();
        dispatch(screenPropertiesUpdated({ ...screenProperties, [propName]: actionSetId }));
        dispatch(
          actionUpdated({ id: actionSetId, actionSet: { ActionSetId: actionSetId, Actions: [] }, controlId: 'Screen' }),
        );
      }
      setPendingActionEdit({ control: 'Screen', eventName });
      return;
    }

    if (!control[eventName]) {
      const updatedControl = { ...control, [eventName]: Guid.create() };
      const actionSetId = updatedControl[eventName];
      dispatch(controlUpdated(updatedControl));
      dispatch(
        actionUpdated({
          id: actionSetId,
          actionSet: { ActionSetId: actionSetId, Actions: [] },
          controlId: updatedControl.id,
        }),
      );
      setPendingActionEdit({ control: updatedControl, eventName });
    } else {
      dispatch(controlUpdated(control));
      setPendingActionEdit({ control, eventName });
    }
  };
  const handleTabsSettingsChange = async (settings) => {
    setTabList(settings);
    dispatch(ribbonVisualizationUpdated(
      Object.fromEntries((settings ?? []).map((item) => [item.id, [{ ribbonId: item.id, visible: item.visible }]]))
    ));
  };

  const handleControlPropertySelected = (controlId, property, canvasClickDisabled = false) => {
    dispatch(controlSelected({ controlId, property, canvasClickDisabled }));
  };

  const handleControlDelete = useCallback(
    (controlId) => {
      if (!controlId || !layoutV4) return;

      // Collect all control IDs to delete (handles containers, BGR/Calendar children, etc.)
      const idsToDelete = collectIdsToDelete(controlId, controls || {}, layoutV4);

      // Remove the control(s) from layoutV4 content (recursively)
      const updatedLayoutV4 = removeControlsFromLayout(layoutV4, idsToDelete);

      // Update the layout
      dispatch(layoutV4Updated({ versionId, layoutCanvas: updatedLayoutV4 }));

      // Remove all controls (container + nested children) from Redux
      idsToDelete.forEach((id) => {
        dispatch(controlDeleted(id));
      });

      // Clear the selection since the control no longer exists
      dispatch(controlSelected(null));

      // Trigger save to persist the deletion (only on Draft screens)
      if (publishStatus === 'Draft') {
        dispatch(saveScreen());
      }
    },
    [dispatch, versionId, layoutV4, controls, publishStatus],
  );

  // Calculate grid columns before using it in handleControlDuplicate
  const gridColumns = useMemo(() => getGridColumns(resolution, appRibbonType), [resolution, appRibbonType]);

  const { handleControlDuplicate } = useControlDuplicate({
    controls,
    layoutV4,
    screenData,
    gridColumns,
    actionUpserts,
    versionId,
    publishStatus,
    refetchScreenData,
  });

  const {
    canvasClickedRef,
    deleteDialogOpen,
    containerBlockedDialogOpen,
    deleteDialogInfo,
    handleDeleteDialogClose,
    handleDeleteDialogConfirm,
    handleBlockedDialogClose,
    handleBlockedDialogComponentClick,
  } = useKeyboardShortcuts({
    isV4Screen,
    selectedControlId,
    controls,
    layoutV4,
    screenData,
    screenProperties,
    actionUpserts: actionUpserts?.[versionId] || {},
    handleControlDelete,
    handleControlDuplicate,
  });

  const handleControlClick = (controlId, property) => {
    // Set canvas clicked ref since we're selecting a control on the canvas
    // This enables keyboard shortcuts to work immediately after drag-and-drop
    canvasClickedRef.current = true;
    dispatch(controlSelected({ controlId, property }));
  };

  // Component Palette handlers
  const handleComponentSelect = useCallback(() => {
    // TODO: Implement component addition to canvas
    // This will be enhanced in the next phase to actually add components to the layout
  }, []);

  const handleComponentDragStart = useCallback((component, event) => {
    // Set drag data for the component - LayoutCanvas expects 'componentType' key
    event.dataTransfer.setData('componentType', component.type);
    event.dataTransfer.setData('componentConfig', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'copy';

    // Store in window for canvas to access (workaround for browser dataTransfer restrictions)
    window.__draggedComponentType = component.type;
    window.__draggedComponentConfig = JSON.stringify(component);
  }, []);

  // Calculate canvas dimensions based on selected device and ribbon type.
  // For desktop resolution, clamp to the measured container width so right-aligned
  // elements do not overflow and disappear when the designer pane is narrower than
  // the theoretical 1200px max width (NCNG-831).
  const canvasWidth = useMemo(
    () => clampCanvasWidth(getDesignerCanvasWidth(resolution, appRibbonType), containerMeasuredWidth, resolution),
    [resolution, appRibbonType, containerMeasuredWidth],
  );
  const canvasConfig = useMemo(() => getDesignerCanvasStyle(resolution, appRibbonType), [resolution, appRibbonType]);

  const lookUpControl = useMemo(() => {
    if (selectedControlId === 'tab-panel')
      return {
        id: 'tab-panel',
        type: widgets.APPRIBBON,
      };
    if (!controls) return null;

    // In empty state (no controls), always show Screen properties
    if (!hasControls || selectedControlId === null) {
      return null; // This will cause ScreenEditor to be shown in right panel
    }

    return selectedControlId ? controls[selectedControlId] : null;
  }, [controls, selectedControlId, hasControls]);

  // Extract control types for filtering single-instance components in ComponentPalette
  const existingControlTypes = useMemo(() => {
    if (!controls) return [];
    return Object.values(controls)
      .map((control) => control.type)
      .filter(Boolean);
  }, [controls]);

  // Detect unsupported widgets for migration - MUST be before any conditional returns (React hooks rules)
  const unsupportedComponents = useMemo(() => {
    if (!controls) return [];

    const unsupported = [];
    Object.values(controls).forEach((control) => {
      if (control.type === widgets.PAYMENTWIDGET) {
        unsupported.push({
          componentType: widgets.PAYMENTWIDGET,
          displayName: 'Payments widget',
        });
      } else if (control.type === widgets.FILEATTACHMENT) {
        unsupported.push({
          componentType: widgets.FILEATTACHMENT,
          displayName: 'File attachment widget',
        });
      }
    });

    // Return unique unsupported components (deduplicate by componentType)
    return Array.from(new Map(unsupported.map((item) => [item.componentType, item])).values());
  }, [controls]);

  // Wait for data to load before determining screen type to avoid flashing wrong UI.
  // Also guard against the brief window after URL navigation where RTK Query hasn't started
  // fetching yet (isFetching=false) but Redux still holds the previous screen's data.
  // Without this check, LayoutCanvasWrapper mounts with stale data for a frame, causing
  // a blank or wrong screen to flash before the real data arrives.
  if (isFetching || status === screenStates.idle || currentScreen !== screenId || currentVersion !== versionId) {
    return (
      <Container fullHeight>
        <LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />
      </Container>
    );
  }

  if (!isV4Screen) {
    // const showBanner = publishStatus !== 'Published' && canUseNewLayoutCanvas;
    const showBanner = false;

    return (
      <s.LegacyLayoutWrapper showBanner={showBanner}>
        <s.LegacyContentRow>
          <s.LegacyLeftPanelWrapper>
            {showBanner && (
              <Suspense fallback={null}>
                <MigrationBanner disabled={publishStatus !== 'Draft'} unsupportedComponents={unsupportedComponents} />
              </Suspense>
            )}
            <s.LegacyCanvasWrapper
              id='canvas-wrapper'
              selectedControlId={selectedControlId}
              ref={containerRef}
              appRibbonType={appRibbonType}
              onClick={() => handleControlClick(null, null)}
            >
              <Suspense
                fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
              >
                {!isV4Screen && (
                  <Canvas
                    onControlClick={handleControlClick}
                    error={error}
                    isLoading={isFetching}
                    status={status}
                    appRibbonType={appRibbonType}
                    layout={layout}
                    selectedControlId={selectedControlId}
                    tabList={tabList}
                    selectedControlProperty={selectedControlProperty}
                    onTabSettingsChange={handleTabsSettingsChange}
                  />
                )}
              </Suspense>
            </s.LegacyCanvasWrapper>
          </s.LegacyLeftPanelWrapper>
          <s.LegacyRightPanelWrapper>
            <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}>
              <RightPanel
                control={lookUpControl}
                onControlChange={handleControlChange}
                onScreenPropertiesChanges={handleScreenPropertiesChanges}
                onActionChange={handleActionChange}
                onAddAction={handleAddAction}
                onControlPropertySelected={handleControlPropertySelected}
                onControlDelete={handleControlDelete}
                onControlDuplicate={handleControlDuplicate}
                onRibbonChange={handleRibbonChange}
                featureFlags={featureFlags}
                onOpenAdvancedDesigner={onOpenAdvancedDesigner}
                appId={appId}
                screenId={screenId}
                versionId={versionId}
                onSendAnalytics={onSendAnalytics}
                activeRecordId={activeRecordId}
                controlProperty={selectedControlProperty}
                onTabsSettingsChange={handleTabsSettingsChange}
                tabList={tabList}
                screenData={screenData}
              />
            </Suspense>
          </s.LegacyRightPanelWrapper>
        </s.LegacyContentRow>
      </s.LegacyLayoutWrapper>
    );
  }

  return (
    <s.MainContentWrapper>
      {/* Outer Container - Red Border, No Padding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: 'calc(100% - 384px)',
          height: 'calc(100vh - 56px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: colors.concrete,
        }}
      >
        {/* Component Palette - Left Panel */}
        {isV4Screen && (
          <s.LeftPanelWrapper isOpen={!!currentSidebarPanel}>
            <Toolbar
              topButtons={[
                {
                  id: 'components',
                  icon: 'circle-plus-V4',
                  label: 'Add UI element',
                onClick: () => updateSidebarPanel(currentSidebarPanel === 'components' ? undefined : 'components'),
                  isActive: currentSidebarPanel === 'components',
                  tooltip: currentSidebarPanel === 'components' ? 'Hide Components' : 'Show Components',
                },
                {
                  id: 'screens',
                  icon: 'screens-V4',
                  label: 'Screens',
                onClick: () => updateSidebarPanel(currentSidebarPanel === 'screens' ? undefined : 'screens'),
                  isActive: currentSidebarPanel === 'screens',
                  tooltip: currentSidebarPanel === 'screens' ? 'Hide Screens' : 'Show Screens',
                },
              ]}
              aiButtonConfig={
                isV4Screen
                  ? {
                      disabled: true,
                    }
                  : undefined
              }
            />
            {currentSidebarPanel === 'components' && (
              <ComponentPalette
                onComponentSelect={handleComponentSelect}
                onComponentDragStart={handleComponentDragStart}
                selectedComponentId={selectedControlId}
                isOpen={currentSidebarPanel === 'components'}
                onClose={() => updateSidebarPanel(null)}
                existingControlTypes={existingControlTypes}
            />)}
            {currentSidebarPanel === 'screens' && (
              <ScreensPanel onClose={() => updateSidebarPanel(null)}/>)}
          </s.LeftPanelWrapper>
        )}

        <s.ResizeableWrapper id='designer-canvas' isPaletteOpen={!!currentSidebarPanel}>
          {/* Inner Container - Blue Border, Fixed Size, Holds LayoutCanvasWrapper */}
          <Container
            id='canvas-wrapper'
            borderless
            scrollable={false}
            forwardRef={containerRef}
            onClick={() => handleControlClick(null, null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: canvasConfig.width,
              minWidth: canvasConfig.minWidth,
              maxWidth: canvasConfig.maxWidth,
              marginRight: 'auto',
              marginLeft: 'auto',
              height: '100%',
              background: '#FFF',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.10)',
              borderRadius: 0,
              overflow: 'hidden',
              flexShrink: 0, // Prevent shrinking when pushed
              position: 'relative',
            }}
          >
            {/* Inner Scrollable Content Area */}
            <div
              style={{
                display: 'flex',
                padding: '160px 16px',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                width: canvasConfig.width,
                minWidth: canvasConfig.minWidth,
                maxWidth: canvasConfig.maxWidth,
                height: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <Suspense
                fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}
              >
                <LayoutCanvasWrapper
                  layout={layout}
                  layoutV4={layoutV4}
                  onLayoutV4Change={handleLayoutV4Change}
                  versionId={versionId}
                  controls={controls}
                  appRibbonType={appRibbonType}
                  selectedControlId={selectedControlId}
                  isLoading={isFetching}
                  error={error}
                  onControlClick={handleControlClick}
                  onComponentsChange={handleComponentsChange}
                  containerHeight={containerHeight - 32}
                  tabList={tabList}
                  selectedControlProperty={selectedControlProperty}
                  onTabsSettingsChange={handleTabsSettingsChange}
                  hasControls={hasControls}
                  isPaletteOpen={currentSidebarPanel === 'components'}
                  screenName={screenName}
                  versionNumber={versionNumber}
                  accountingPackage={accountingType}
                  baseModel={baseModel}
                  staticLayout={screenProperties?.staticLayout}
                  onAddComponents={() => {
                      updateSidebarPanel('components');
                  }}
                  canvasWidth={canvasWidth}
                  gridColumns={gridColumns}
                  canvasConfig={canvasConfig}
                />
              </Suspense>
            </div>
          </Container>
        </s.ResizeableWrapper>
      </div>

      {/* Right Panel */}
      <s.RightPanelWrapper id='right-panel'>
        <Suspense fallback={<LoadingSkeleton count={1} width='100%' height='100%' circle={false} duration={1.4} />}>
          <RightPanel
            control={lookUpControl}
            onControlChange={handleControlChange}
            onScreenPropertiesChanges={handleScreenPropertiesChanges}
            onActionChange={handleActionChange}
            onAddAction={handleAddAction}
            onControlPropertySelected={handleControlPropertySelected}
            onControlDelete={handleControlDelete}
            onControlDuplicate={handleControlDuplicate}
            onRibbonChange={handleRibbonChange}
            featureFlags={featureFlags}
            onOpenAdvancedDesigner={onOpenAdvancedDesigner}
            appId={appId}
            screenId={screenId}
            versionId={versionId}
            onSendAnalytics={onSendAnalytics}
            activeRecordId={activeRecordId}
            controlProperty={selectedControlProperty}
            onTabsSettingsChange={handleTabsSettingsChange}
            tabList={tabList}
            screenData={screenData}
          />
        </Suspense>
      </s.RightPanelWrapper>

      {/* Delete confirmation dialog for keyboard shortcut */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteDialogConfirm}
        title={deleteDialogInfo.isContainer ? 'Delete container' : 'Delete component'}
        message={
          deleteDialogInfo.isContainer ? (
            <>
              <p>
                Deleting this container will also remove the actions connected to all components within it. This cannot
                be undone.
              </p>
              <br />
              <p>Are you sure you want to delete?</p>
            </>
          ) : (
            <>
              <p>Deleting this component will also remove the actions connected to it. This cannot be undone.</p>
              <br />
              <p>Are you sure you want to delete?</p>
            </>
          )
        }
        itemType={deleteDialogInfo.isContainer ? 'container' : 'component'}
      />

      {/* Container blocked dialog for keyboard shortcut */}
      <ContainerDeleteBlockedDialog
        isOpen={containerBlockedDialogOpen}
        onClose={handleBlockedDialogClose}
        referencedComponents={deleteDialogInfo.referencedChildren}
        onComponentClick={handleBlockedDialogComponentClick}
      />
    </s.MainContentWrapper>
  );
}

LayoutDesigner.propTypes = propTypes;
export default LayoutDesigner;
