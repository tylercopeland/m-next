import { widgets, CurrentState } from '@m-next/types';
import { createSlice, createSelector } from '@reduxjs/toolkit';

export const screenStates = {
  idle: 'idle',
  ready: 'ready',
  editing: 'editing',
  saving: 'saving',
  refreshed: 'refreshed',
  error: 'error',
};
const initialState = {
  status: screenStates.idle,
  id: null,
  versionId: null,
  controls: null,
  layout: null,
  appRibbonType: null,
  changes: {},
  actionUpserts: {},
  lastControlUpdated: null,
  activeRecordId: null,
  baseModel: null,
  fields: [],
  baseModelJoins: [],
  selectedControlId: null,
  selectedControlProperty: null,
  layoutV4: {}, // supports LayoutCanvas structure by versionId
  isV4Screen: false,
  dataModels: [],
  projections: [],
  ribbonConfiguration: {},
  ribbonVisualization: {},
  ribbonStatus: screenStates.idle,
  hoveredControlId: null,
  hoverStack: [],
  publishStatus: null,
  isStock: true,
  draftInfo: null,
  screenFunctions: [],
  comments: '',
  defaultFocusControl: null,
  onLoad: null,
  onFocus: null,
  onActiveRecordChange: null,
  staticLayout: true, // Default to true (compaction enabled)
  clipboard: null, // For copy/paste operations
  showHiddenComponents: false,
  resolution: 'desktop',
  forceRefetchTimestamp: null, // Timestamp to trigger force refetch
};

const screenLayoutSlice = createSlice({
  name: 'screenLayout',
  initialState,
  reducers: {
    triggerScreenRefetch(state) {
      // Update timestamp to trigger refetch in components watching this value
      state.forceRefetchTimestamp = Date.now();
    },
    screenLoaded(state, action) {
      state.status = screenStates.ready;
      state.controls = { ...action.payload.controls };
      state.layout = action.payload.layout;
      state.appRibbonType = action.payload.appRibbonType || 0;
      state.baseModel = action.payload.viewFriendlyName;
      state.data = {};
      state.isV4Screen = action.payload.isV4Screen;
      // V4 LAYOUT API: Store layoutV4 data under versionId key
      if (action.payload.layoutV4) {
        // API returns layoutV4 directly, store it under the versionId key
        state.layoutV4[action.payload.versionId] = action.payload.layoutV4;
      } else if (action.payload.isV4Screen) {
        // Initialize default LayoutCanvas structure for V4 screens with no existing data
        // Use camelCase to match the save format
        state.layoutV4[action.payload.versionId] = {
          canvasId: `${action.payload.versionId}`,
          type: 'Grid',
          size: 12,
          content: [],
        };
      }
      state.dataModels = action.payload.dataModels;
      state.projections = action.payload.projections;
      state.id = action.payload.screenId;
      state.versionId = action.payload.versionId;
      state.publishStatus = action.payload.publishStatus;
      state.isStock = action.payload.isStock;
      state.draftInfo = action.payload.draftVersion
        ? {
            versionId: action.payload.draftVersion,
            lastModifiedBy: action.payload.draftVersionLastModifiedBy,
            lastModifiedDate: action.payload.draftVersionLastModifiedDate,
            versionNumber: action.payload.draftVersionNumber,
          }
        : null;
      if (action.payload.controls) {
        Object.entries(action.payload.controls).forEach(([, control]) => {
          if (
            state.changes &&
            state.changes[action.payload.versionId] &&
            state.changes[action.payload.versionId][control.id]
          ) {
            state.controls[control.id] = state.changes[action.payload.versionId][control.id];
          }
          switch (control.Type) {
            case widgets.GRID:
              break;
            case widgets.DATATABLE:
              if (control.dataSource) {
                state.data[control.id] = {
                  columnTotals: control.columnTotals,
                  currentPage: control.paging.pageNumber,
                  totalRows: control.paging.totalRows,
                  dataSource: control.dataSource,
                  newRow: control.newRow,
                };
              }
              break;
            case widgets.DROPDOWN: {
              let selectedRecord = {};
              let ddValue = control.selectedValue;
              if (Number.isNaN(ddValue) || ddValue === '' || ddValue === null) {
                ddValue = -1;
                selectedRecord = null;
              }

              if (!ddValue || ddValue < 1) state.data[control.id] = null;
              else if (selectedRecord.RecordID !== null && selectedRecord.RecordID !== undefined)
                state.data[control.id] = selectedRecord;
              else state.data[control.id] = control.selectedRecord;

              break;
            }
            case widgets.PICTURE:
            case widgets.FILEATTACHMENT:
              state.data[control.id] =
                control.value && control.value.originalName
                  ? control.value
                  : { originalName: control.originalName, url: control.value };
              break;
            default:
              state.data[control.id] = control.value ?? control.defaultValue;
          }
        });
      }

      // Sync responsive state (visible/disabled) to controls on initial load
      if (state.layoutV4 && state.layoutV4[action.payload.versionId]?.content && state.controls) {
        const resolution = state.resolution || 'desktop';
        const syncResponsiveState = (items, parentDisabled, parentHidden) => {
          items.forEach((item) => {
            const control = state.controls[item.id];
            if (control && item.desktop) {
              let itemState = CurrentState.REGULAR;
              switch (resolution) {
                case 'tablet':
                  itemState = item.tabletOverride?.currentState ?? item.desktop?.currentState;
                  break;
                case 'mobile':
                  itemState = item.mobileOverride?.currentState ?? item.desktop?.currentState;
                  break;
                default:
                  itemState = item.desktop?.currentState;
              }
              const disabled = parentDisabled || itemState === CurrentState.DISABLED;
              const visible = !parentHidden && !(itemState === CurrentState.HIDDEN);
              state.controls[item.id] = { ...control, disabled, visible };

              if (item.content && item.content.length > 0) {
                syncResponsiveState(item.content, disabled, !visible);
              }
            }
          });
        };
        syncResponsiveState(state.layoutV4[action.payload.versionId].content, false, false);
      }

      if (action.payload.ribbonConfiguration) {
        state.ribbonConfiguration[action.payload.versionId] = action.payload.ribbonConfiguration;
      }

      state.comments = action.payload.comments || '';
      state.screenFunctions = action.payload.screenFunctions || [];
      state.defaultFocusControl = action.payload.focusControl || null;
      state.onActiveRecordChange = action.payload.onActiveRecordChange || null;
      state.onFocus = action.payload.onFocus || null;
      state.onLoad = action.payload.onLoad || null;
      state.staticLayout = action.payload.staticLayout ?? true; // Default to true if not set
    },

    controlUpdated(state, action) {
      if (
        action.payload.id === null ||
        action.payload.id === undefined ||
        state.versionId === null ||
        state.versionId === undefined
      ) {
        return;
      }

      const oldControl = state.controls[action.payload.id];

      // Track when typeOverride changes to prevent dimension overwrites
      const typeOverrideChanged = oldControl?.typeOverride !== action.payload.typeOverride;

      // Track dimension changes for layoutV4 sync
      const dimensionsChanged =
        oldControl?.width !== action.payload.width || oldControl?.height !== action.payload.height;

      // 🔧 FIX: Check if dimensions are currently locked (either from payload or existing control)
      const existingLock = oldControl?.__dimensionsLockedUntil;
      const payloadLock = action.payload.__dimensionsLockedUntil;
      const isCurrentlyLocked =
        (existingLock && existingLock > Date.now()) || (payloadLock && payloadLock > Date.now());

      // 🔧 FIX: If dimensions are locked, preserve the existing dimensions
      const preservedWidth =
        isCurrentlyLocked && action.payload.width === undefined ? oldControl?.width : action.payload.width;
      const preservedHeight =
        isCurrentlyLocked && action.payload.height === undefined ? oldControl?.height : action.payload.height;

      // 🔧 IMMER FIX: Create new object with spread to avoid mutating frozen payload
      state.controls[action.payload.id] = {
        ...action.payload,
        // Preserve dimensions if locked
        width: preservedWidth,
        height: preservedHeight,
        // Preserve existing lock if still valid, or add new one if typeOverride changed
        __dimensionsLockedUntil:
          payloadLock || (isCurrentlyLocked ? existingLock : null) || (typeOverrideChanged ? Date.now() + 1700 : null),
      };

      // Update layoutV4 when dimensions change
      if (dimensionsChanged && state.layoutV4[state.versionId]) {
        const updateLayoutItemDimensions = (items) => {
          return items.map((item) => {
            if (item.id === action.payload.id) {
              // Update the desktop dimensions
              return {
                ...item,
                desktop: {
                  ...item.desktop,
                  width: action.payload.width ?? item.desktop.width,
                  height: action.payload.height ?? item.desktop.height,
                },
              };
            }
            // Recursively update nested content
            if (item.content && item.content.length > 0) {
              return {
                ...item,
                content: updateLayoutItemDimensions(item.content),
              };
            }
            return item;
          });
        };

        state.layoutV4[state.versionId] = {
          ...state.layoutV4[state.versionId],
          content: updateLayoutItemDimensions(state.layoutV4[state.versionId].content || []),
        };
      }

      if (!state.changes[state.versionId]) {
        state.changes = { ...state.changes, [state.versionId]: {} };
      }
      state.lastControlUpdated = action.payload.id;

      if (state.publishStatus === 'Draft') {
        state.changes[state.versionId][action.payload.id] = action.payload;
        state.status = screenStates.editing;
      }
    },

    // ===== PERFORMANCE OPTIMIZATION: Position-Only Updates =====
    // Separate action for position updates to reduce re-renders during drag operations
    controlPositionUpdated(state, action) {
      const { id, x, y, width, height, widthType } = action.payload;

      if (
        id === null ||
        id === undefined ||
        state.versionId === null ||
        state.versionId === undefined ||
        !state.controls[id]
      ) {
        return;
      }

      // Update only position-related properties
      const control = state.controls[id];
      if (x !== undefined) control.x = x;
      if (y !== undefined) control.y = y;
      if (width !== undefined) control.width = width;
      if (height !== undefined) control.height = height;
      if (widthType !== undefined) control.widthType = widthType;

      // Only update changes if in Draft mode
      if (state.publishStatus === 'Draft') {
        if (!state.changes[state.versionId]) {
          state.changes = { ...state.changes, [state.versionId]: {} };
        }

        // Ensure we have the full control in changes
        if (!state.changes[state.versionId][id]) {
          state.changes[state.versionId][id] = { ...control };
        } else {
          // Update only position properties in changes
          const changedControl = state.changes[state.versionId][id];
          if (x !== undefined) changedControl.x = x;
          if (y !== undefined) changedControl.y = y;
          if (width !== undefined) changedControl.width = width;
          if (height !== undefined) changedControl.height = height;
          if (widthType !== undefined) changedControl.widthType = widthType;
        }

        state.status = screenStates.editing;
      }
    },

    // ===== PERFORMANCE OPTIMIZATION: Content-Only Updates =====
    // Separate action for content updates (caption, value, etc.)
    controlContentUpdated(state, action) {
      const { id, ...contentProps } = action.payload;

      if (
        id === null ||
        id === undefined ||
        state.versionId === null ||
        state.versionId === undefined ||
        !state.controls[id]
      ) {
        return;
      }

      // Update content properties
      const control = state.controls[id];
      Object.assign(control, contentProps);

      state.lastControlUpdated = id;

      if (state.publishStatus === 'Draft') {
        if (!state.changes[state.versionId]) {
          state.changes = { ...state.changes, [state.versionId]: {} };
        }

        // Update full control in changes for content updates
        state.changes[state.versionId][id] = { ...control };
        state.status = screenStates.editing;
      }
    },

    screenPropertiesUpdated(state, action) {
      state.onActiveRecordChange = action.payload.onActiveRecordChange || null;
      state.onFocus = action.payload.onFocus || null;
      state.onLoad = action.payload.onLoad || null;
      state.screenFunctions = action.payload.screenFunctions || [];
      state.comments = action.payload.comments || '';
      state.defaultFocusControl = action.payload.defaultFocusControl || null;
      state.appRibbonType = action.payload.appRibbonType || 0;
      state.staticLayout = action.payload.staticLayout ?? state.staticLayout; // Update if provided, otherwise keep current value
      state.status = screenStates.editing;
      state.lastControlUpdated = null;
    },

    actionUpdated(state, action) {
      if (!state.actionUpserts[state.versionId]) {
        state.actionUpserts = { ...state.actionUpserts, [state.versionId]: {} };
      }

      state.lastControlUpdated = action.payload.controlId;
      if (state.publishStatus === 'Draft') {
        state.actionUpserts[state.versionId][action.payload.id] = action.payload.actionSet;
        state.status = screenStates.editing;
      }
    },
    ribbonUpdated(state, action) {
      if (!state.ribbonConfiguration[state.versionId]) {
        state.ribbonConfiguration = { ...state.ribbonConfiguration, [state.versionId]: {} };
      }

      state.ribbonConfiguration[state.versionId][action.payload.ribbonId] = action.payload;
      state.status = screenStates.editing;
    },
    ribbonVisualizationUpdated(state, action) {
      if (!state.ribbonVisualization[state.versionId]) {
        state.ribbonVisualization = { ...state.ribbonVisualization, [state.versionId]: {} };
      }

      state.ribbonVisualization[state.versionId] = action.payload;
      state.status = screenStates.editing;
    },
    controlSelected(state, action) {
      if (action.payload === null) {
        state.selectedControlId = null;
        state.selectedControlProperty = null;
        state.canvasClickDisabled = false;
      } else {
        state.selectedControlId = action.payload.controlId;
        state.selectedControlProperty = action.payload.property;
        state.canvasClickDisabled = action.payload.canvasClickDisabled;
      }
    },
    controlHovered(state, action) {
      if (action.payload === null) {
        state.hoveredControlId = null;
        if (state.hoverStack.length > 0) {
          state.hoverStack.pop();
          state.hoverStack = [...state.hoverStack];
          state.hoveredControlId = state.hoverStack[state.hoverStack.length - 1] || null;
        }
      } else {
        state.hoveredControlId = action.payload.controlId;
        state.hoverStack.push(action.payload.controlId);
      }
    },
    saveScreen(state) {
      state.status = screenStates.saving;
      state.lastControlUpdated = null;
    },
    screenSaved(state) {
      state.status = screenStates.ready;
      // Clear actionUpserts after successful save so that copy operations
      // use fresh server data instead of stale local data
      state.actionUpserts = {};
    },
    clearLastControlUsed(state) {
      state.lastControlUpdated = null;
    },
    focusOn(state, action) {
      state.focusOn = action.payload;
    },
    changeActiveRecord(state, action) {
      state.activeRecordId = action.payload;
    },
    reloadRibbons(state) {
      state.ribbonStatus = screenStates.refreshed;
    },
    ribbonsRefreshComplete(state) {
      state.ribbonStatus = screenStates.ready;
    },
    removeRibbonConfiguration(state, action) {
      if (state.ribbonConfiguration[state.versionId]) {
        state.ribbonConfiguration[state.versionId][action.payload] = null;
      }
    },
    loadNewScreen(state, action) {
      state.id = action.payload.screenId;
      state.versionId = action.payload.versionId;
      state.activeRecordId = action.payload.activeRecordId;
      state.changes = {};
      state.actionUpserts = {};
    },
    startScreenCopy(state) {
      state.status = screenStates.idle;
    },
    clearScreen(state) {
      // Reset to empty state while preserving screen identity
      const screenId = state.id;
      const { versionId, appRibbonType, isV4Screen } = state;

      // Reset to initial state but keep screen info
      Object.assign(state, initialState, {
        status: screenStates.ready,
        id: screenId,
        versionId,
        appRibbonType: appRibbonType || 0,
        controls: {},
        layout: null,
        layoutV4: {},
        dataModels: [],
        isV4Screen, // Use preserved value instead of hardcoding to true
      });
    },
    screenFieldsLoaded(state, action) {
      state.fields = action.payload;
      const linkedTables = [];
      action.payload.forEach((element) => {
        if (element.type === 'DropDown') {
          if (!linkedTables[element.sourceModel]) {
            linkedTables[element.sourceModel] = [];
          }
          linkedTables[element.sourceModel].push({ value: element.name, label: element.caption });
        }
      });

      state.baseModelJoins = linkedTables;
    },

    layoutV4Updated(state, action) {
      const { versionId, layoutCanvas } = action.payload;

      state.layoutV4[versionId] = layoutCanvas;
      // DO NOT set isV4Screen here - it should only be set from backend via screenLoaded
      // or during migration via useMigrateScreen
      state.status = screenStates.editing;
    },

    // Control deletion reducer
    controlDeleted(state, action) {
      const controlId = action.payload;

      if (!controlId || !state.controls) return;

      // Remove from controls object
      delete state.controls[controlId];

      // Remove from changes if present
      if (state.changes[state.versionId] && state.changes[state.versionId][controlId]) {
        delete state.changes[state.versionId][controlId];
      }

      // Clear selection if the deleted control was selected
      if (state.selectedControlId === controlId) {
        state.selectedControlId = null;
        state.selectedControlProperty = null;
      }

      state.status = screenStates.editing;
    },

    // Control duplication reducer
    controlDuplicated(state, action) {
      const { control, layoutItem } = action.payload;

      if (!control || !control.id) return;

      // Add the duplicated control to controls object
      state.controls[control.id] = control;

      // Add to changes for saving
      if (!state.changes[state.versionId]) {
        state.changes = { ...state.changes, [state.versionId]: {} };
      }

      state.changes[state.versionId][control.id] = control;

      // Select the newly duplicated control ONLY if it has a layoutItem
      // (children of containers are dispatched with layoutItem: null and should not change selection)
      if (layoutItem !== null) {
        state.selectedControlId = control.id;
        state.selectedControlProperty = null;
      }

      state.status = screenStates.editing;
      state.lastControlUpdated = control.id;
    },

    // Set clipboard for copy/paste operations
    setClipboard(state, action) {
      state.clipboard = action.payload;
    },

    // Set visibility of hidden components explicitly
    setShowHiddenComponents(state, action) {
      state.showHiddenComponents = action.payload;
    },

    // Replace controls and layoutV4 from AI build screen response
    aiScreenBuilt(state, action) {
      const { controls, layoutV4, versionId } = action.payload;
      const effectiveVersionId = versionId || state.versionId;

      // Clear pending changes so old controls don't persist in the save payload
      if (state.changes[effectiveVersionId]) {
        delete state.changes[effectiveVersionId];
      }
      if (state.actionUpserts[effectiveVersionId]) {
        delete state.actionUpserts[effectiveVersionId];
      }

      // Clear selection since the selected control may no longer exist
      state.selectedControlId = null;
      state.selectedControlProperty = null;

      // controls comes as array from API — convert to { [id]: control } object
      if (Array.isArray(controls)) {
        state.controls = {};
        controls.forEach((control) => {
          state.controls[control.id] = control;
        });
      } else if (controls) {
        state.controls = controls;
      }
      if (layoutV4) {
        state.layoutV4[effectiveVersionId] = layoutV4;
      }
      state.status = screenStates.editing;
    },

    setResolution(state, action) {
      const resolution = action.payload;
      state.resolution = resolution;

      if (!state.layoutV4[state.versionId] || !state.controls) return;

      // Helper to recursively update disabled and visible state for all controls
      const updateControlsState = (items, parentDisabled, parentHidden) => {
        items.forEach((item) => {
          const control = state.controls[item.id];
          if (control) {
            let disabled;
            let visible;
            let itemState = CurrentState.REGULAR;

            // Get the currentState for this resolution
            switch (resolution) {
              case 'tablet':
                itemState = item.tabletOverride?.currentState ?? item.desktop?.currentState;
                break;
              case 'mobile':
                itemState = item.mobileOverride?.currentState ?? item.desktop?.currentState;
                break;
              case 'desktop':
                itemState = item.desktop?.currentState;
                break;
            }

            if (parentHidden) {
              // Parent is hidden, so hide this control too
              visible = false;
              disabled = true;
            } else if (parentDisabled) {
              // Parent is disabled, so disable this control
              disabled = true;
              visible = !(itemState === CurrentState.HIDDEN);
            } else {
              // Set based on this item's currentState
              disabled = itemState === CurrentState.DISABLED;
              visible = !(itemState === CurrentState.HIDDEN);
            }

            state.controls[item.id] = { ...control, disabled, visible };

            // Recursively process children with updated parent state
            if (item.content && item.content.length > 0) {
              updateControlsState(item.content, disabled, !visible);
            }
          }
        });
      };

      // Start the recursive update from the root content
      if (state.layoutV4[state.versionId]?.content) {
        updateControlsState(state.layoutV4[state.versionId].content, false, false);
      }
    },

    // Update responsive data for a specific control
    updateControlResponsiveData(state, action) {
      const { controlId, resolution, currentState } = action.payload;

      if (!state.layoutV4[state.versionId]) return;
      const updateResponsiveInLayout = (items) =>
        items.map((item) => {
          if (item.id === controlId) {
            const updated = { ...item };
            switch (resolution) {
              case 'desktop':
                updated.desktop = {
                  ...updated.desktop,
                  currentState,
                };
                break;
              case 'tablet':
                if (!updated.tabletOverride) {
                  // Create tabletOverride if it doesn't exist
                  updated.tabletOverride = {
                    ...updated.desktop,
                    currentState,
                  };
                } else {
                  updated.tabletOverride = {
                    ...updated.tabletOverride,
                    currentState,
                  };
                }
                break;
              case 'mobile':
                if (!updated.mobileOverride) {
                  // Create mobileOverride if it doesn't exist
                  updated.mobileOverride = {
                    ...updated.desktop,
                    currentState,
                  };
                } else {
                  updated.mobileOverride = {
                    ...updated.mobileOverride,
                    currentState,
                  };
                }
                break;
            }
            return updated;
          }
          // Recursively update nested content
          if (item.content && item.content.length > 0) {
            return {
              ...item,
              content: updateResponsiveInLayout(item.content),
            };
          }
          return item;
        });

      state.layoutV4[state.versionId] = {
        ...state.layoutV4[state.versionId],
        content: updateResponsiveInLayout(state.layoutV4[state.versionId].content || []),
      };

      // Change control state to see UI changes in designer.
      //// TODO: avoid second traversal by combining with above function.
      //// At time of writing, clarity is preferred to expediate defect fixes.
      const updateControlsState = (items, parentDisabled, parentHidden) => {
        items.forEach((item) => {
          const control = state.controls[item.id];
          if (control) {
            let disabled;
            let visible;
            let itemState = CurrentState.REGULAR;

            // Get the currentState for this resolution
            switch (resolution) {
              case 'tablet':
                itemState = item.tabletOverride?.currentState ?? item.desktop?.currentState;
                break;
              case 'mobile':
                itemState = item.mobileOverride?.currentState ?? item.desktop?.currentState;
                break;
              case 'desktop':
                itemState = item.desktop?.currentState;
                break;
            }

            if (parentHidden) {
              // Parent is hidden, so hide this control too
              visible = false;
              disabled = true;
            } else if (parentDisabled) {
              // Parent is disabled, so disable this control
              disabled = true;
              visible = !(itemState === CurrentState.HIDDEN);
            } else {
              // Set based on this item's currentState
              disabled = itemState === CurrentState.DISABLED;
              visible = !(itemState === CurrentState.HIDDEN);
            }

            state.controls[item.id] = { ...control, disabled, visible };

            // Recursively process children with updated parent state
            if (item.content && item.content.length > 0) {
              updateControlsState(item.content, disabled, !visible);
            }
          }
        });
      };

      if (state.layoutV4[state.versionId]?.content) {
        updateControlsState(state.layoutV4[state.versionId].content, false, false);
      }

      state.status = screenStates.editing;
      state.lastControlUpdated = controlId;
    },
  },
});

export const {
  screenLoaded,
  controlUpdated,
  controlPositionUpdated, // ===== PERFORMANCE OPTIMIZATION: Position-only updates
  controlContentUpdated, // ===== PERFORMANCE OPTIMIZATION: Content-only updates
  saveScreen,
  screenSaved,
  clearLastControlUsed,
  focusOn,
  changeActiveRecord,
  screenFieldsLoaded,
  controlSelected,
  actionUpdated,
  ribbonUpdated,
  ribbonVisualizationUpdated,
  ribbonsRefreshComplete,
  reloadRibbons,
  removeRibbonConfiguration,
  controlHovered,
  loadNewScreen,
  startScreenCopy,
  clearScreen,
  screenPropertiesUpdated,
  layoutV4Updated, // 🆕 V4 LAYOUT API: New action for updating V4 layout
  controlDeleted, // Control deletion action
  controlDuplicated, // Control duplication action
  setClipboard, // Set clipboard for copy/paste
  setShowHiddenComponents,
  setResolution,
  updateControlResponsiveData, // Update responsive data for a control
  aiScreenBuilt, // Replace controls and layoutV4 from AI build screen response
  triggerScreenRefetch, // Trigger force refetch of current screen
} = screenLayoutSlice.actions;

// ===== PERFORMANCE OPTIMIZATION: Individual Control Selectors =====
// These selectors prevent re-renders when unrelated controls change

// Base selectors (unchanged)
export const selectControls = (state) => state.screenLayout.controls;
export const selectData = (state) => state.screenLayout.data;
export const selectLayout = (state) => state.screenLayout.layout;
export const selectAppRibbonType = (state) => state.screenLayout.appRibbonType || 0;
export const selectStatus = (state) => state.screenLayout.status;
export const selectChanges = (state) => state.screenLayout.changes;
export const selectActionUpserts = (state) => state.screenLayout.actionUpserts;
export const selectLastControlUpdated = (state) => state.screenLayout.lastControlUpdated;
export const selectActiveRecordId = (state) => state.screenLayout.activeRecordId;
export const selectFocusOn = (state) => state.screenLayout.focusOn;
export const selectRibbonList = (state) => state.screenLayout.ribbonList;
export const selectBaseModel = (state) => state.screenLayout.baseModel;
export const selectBaseModelJoins = (state) => state.screenLayout.baseModelJoins;
export const selectSelectedControlId = (state) => state.screenLayout.selectedControlId;
export const selectHoveredControlId = (state) => state.screenLayout.hoveredControlId;
export const selectSelectedControlProperty = (state) => state.screenLayout.selectedControlProperty;
export const selectCanvasClickDisabled = (state) => state.screenLayout.canvasClickDisabled;

// ===== OPTIMIZED: Individual Control Selector Factory =====
// Creates a memoized selector for a specific control by ID
// This prevents re-renders when other controls change
export const selectControlById = createSelector(
  [selectControls, (_, controlId) => controlId],
  (controls, controlId) => controls?.[controlId] || null,
);

// ===== OPTIMIZED: Control Position Selector =====
// Separate selector for position-related properties only
export const selectControlPosition = createSelector([selectControlById], (control) =>
  control
    ? {
        x: control.x,
        y: control.y,
        width: control.width,
        height: control.height,
        widthType: control.widthType,
      }
    : null,
);

// ===== OPTIMIZED: Control Content Selector =====
// Separate selector for content-related properties only
export const selectControlContent = createSelector([selectControlById], (control) =>
  control
    ? {
        id: control.id,
        type: control.type,
        caption: control.caption,
        value: control.value,
        // Add other content properties as needed
      }
    : null,
);

// ===== OPTIMIZED: Selection State Selectors =====
// Memoized selectors for selection state to reduce re-renders
export const selectIsControlSelected = createSelector(
  [selectSelectedControlId, selectSelectedControlProperty, (_, controlId) => controlId],
  (selectedId, selectedProperty, controlId) => ({
    isSelected: selectedId === controlId,
    hasPropertySelected: selectedId === controlId && selectedProperty,
    isSelectedWithoutProperty: selectedId === controlId && !selectedProperty,
  }),
);

export const selectIsControlHovered = createSelector(
  [selectHoveredControlId, (_, controlId) => controlId],
  (hoveredId, controlId) => hoveredId === controlId,
);

export const selectIsV4Screen = (state) => state.screenLayout.isV4Screen;
export const selectLayoutV4 = (state) => state.screenLayout.layoutV4;
// 🆕 V4 LAYOUT API: Selector for current layoutV4 based on active versionId
export const selectCurrentLayoutV4 = (state) => state.screenLayout.layoutV4?.[state.screenLayout.versionId] || null;
export const selectDataModels = (state) => state.screenLayout.dataModels;
export const selectProjections = (state) => state.screenLayout.projections;
export const selectLoadedScreenId = (state) => state.screenLayout.id;
export const selectCurrentRibbonConfiguration = (state) =>
  state.screenLayout.ribbonConfiguration ? state.screenLayout.ribbonConfiguration[state.screenLayout.versionId] : null;
export const selectCurrentRibbonVisualization = (state) =>
  state.screenLayout.ribbonVisualization ? state.screenLayout.ribbonVisualization[state.screenLayout.versionId] : null;
export const selectRibbonConfiguration = (state) => state.screenLayout.ribbonConfiguration;
export const selectRibbonVisualization = (state) => state.screenLayout.ribbonVisualization;
export const selectRibbonStatus = (state) => state.screenLayout.ribbonStatus;
export const selectScreenFields = (state) => state.screenLayout.fields;
export const selectIsStock = (state) => state.screenLayout.isStock;
export const selectLoadedScreenVersionId = (state) => state.screenLayout.versionId;
export const selectDraftInfo = (state) => state.screenLayout.draftInfo;
export const selectScreenFunctions = (state) => state.screenLayout.screenFunctions;
export const selectDefaultFocusControl = (state) => state.screenLayout.defaultFocusControl;
export const selectComments = (state) => state.screenLayout.comments;
export const selectScreenProperties = (state) => ({
  screenFunctions: state.screenLayout.screenFunctions,
  comments: state.screenLayout.comments,
  defaultFocusControl: state.screenLayout.defaultFocusControl,
  appRibbonType: state.screenLayout.appRibbonType || 0,
  onLoad: state.screenLayout.onLoad,
  onFocus: state.screenLayout.onFocus,
  onActiveRecordChange: state.screenLayout.onActiveRecordChange,
  staticLayout: state.screenLayout.staticLayout,
});
export const selectShowHiddenComponents = (state) => state.screenLayout.showHiddenComponents;
export const selectResolution = (state) => state.screenLayout.resolution;
export const selectForceRefetchTimestamp = (state) => state.screenLayout.forceRefetchTimestamp;

// Selector to get responsive data for a specific control
export const selectControlResponsiveData = createSelector(
  [selectCurrentLayoutV4, (_, controlId) => controlId],
  (layoutV4, controlId) => {
    if (!layoutV4 || !controlId || !layoutV4.content) return null;

    // Recursively search for the control in the layout
    const findControlInLayout = (items) => {
      if (!items) return null;
      for (const item of items) {
        if (item.id === controlId) {
          return {
            desktop: item.desktop,
            tabletOverride: item.tabletOverride,
            mobileOverride: item.mobileOverride,
          };
        }
        if (item.content && item.content.length > 0) {
          const found = findControlInLayout(item.content);
          if (found) return found;
        }
      }
      return null;
    };

    return findControlInLayout(layoutV4.content);
  },
);

// ===== AGGRESSIVE OPTIMIZATION: Combined Layout Designer Selector =====
// Single selector to prevent 20+ individual selectors causing re-renders
// IMPORTANT: Placed at end after all individual selectors are defined
export const selectLayoutDesignerState = createSelector(
  [
    selectStatus,
    selectAppRibbonType,
    selectLayout,
    selectControls,
    selectChanges,
    selectActionUpserts,
    selectSelectedControlId,
    selectSelectedControlProperty,
    selectCurrentLayoutV4,
    selectDataModels,
    selectActiveRecordId,
    selectLoadedScreenId,
    selectLoadedScreenVersionId,
    selectCurrentRibbonConfiguration,
    selectCurrentRibbonVisualization,
    selectRibbonConfiguration,
    selectRibbonStatus,
    selectScreenProperties,
    selectBaseModel,
    (state) => state.screenLayout.isV4Screen,
  ],
  (
    status,
    appRibbonType,
    layout,
    controls,
    changes,
    actionUpserts,
    selectedControlId,
    selectedControlProperty,
    layoutV4,
    dataModels,
    activeRecordId,
    currentScreen,
    currentVersion,
    ribbonCurrentConfiguration,
    ribbonVisualization,
    ribbonConfiguration,
    ribbonStatus,
    screenProperties,
    baseModel,
    isV4Screen,
  ) => ({
    status,
    appRibbonType,
    layout,
    controls,
    changes,
    actionUpserts,
    selectedControlId,
    selectedControlProperty,
    layoutV4,
    dataModels,
    activeRecordId,
    currentScreen,
    currentVersion,
    ribbonCurrentConfiguration,
    ribbonVisualization,
    ribbonConfiguration,
    ribbonStatus,
    screenProperties,
    baseModel,
    isV4Screen,
  }),
);

export default screenLayoutSlice.reducer;
