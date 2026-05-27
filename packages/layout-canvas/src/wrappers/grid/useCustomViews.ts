/**
 * Custom hook for managing custom views in the Grid component.
 * Handles view state, CRUD operations, drag-and-drop reordering, and view visibility.
 */
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Guid } from '@m-next/utilities';
import xss from 'xss';
import {
  separateAndSortViews,
  separateViews,
  reorderArray,
  convertFilterToDataTableView,
  getMergedViewList,
} from './viewUtils';
import type {
  ControlView,
  AllViewsDisplayState,
  ViewFilterOptions,
  SortingConfig,
  FilterExpression,
  ApiFilter,
  UseCustomViewsParams,
  UseCustomViewsReturn,
  DragEndResult,
  SaveResult,
} from './types';

const DISALLOWED_APP_TYPES = ['portal', 'public', 'portalmobile', 'publicmobile'];

/**
 * Hook for managing custom views in the Grid component.
 *
 * @param params - Configuration parameters
 * @returns Custom views state and handlers
 */
export const useCustomViews = ({
  control,
  id,
  isRuntimeMode,
  runtimeContext,
  screenDataContext,
  currentViewFilter,
  columns,
  advancedSearchExpression,
  initialSorting,
}: UseCustomViewsParams): UseCustomViewsReturn => {
  // ============= State =============
  const [allViewsDisplayState, setAllViewsDisplayState] = useState<AllViewsDisplayState>({
    customViews: [],
    sharedViews: [],
    standardViews: [],
  });
  const [viewFilterOptions, setViewFilterDisplayOptions] = useState<ViewFilterOptions>([]);
  const [viewListReady, setViewListReady] = useState(false);
  const [isMaintainViewOrder, setIsMaintainViewOrder] = useState(false);
  const [isCustomViewsReordered, setIsCustomViewsReordered] = useState(false);
  const [isSharedViewsReordered, setIsSharedViewsReordered] = useState(false);

  const originalViewListRef = useRef<string>('');

  // ============= Derived Values =============
  const isCustomViewEnabled = control ? control.isCustomViewEnabled : false;

  const shouldEnableCustomViews = useCallback(
    () =>
      Boolean(isCustomViewEnabled) &&
      !DISALLOWED_APP_TYPES.includes(runtimeContext?.applicationType?.toLowerCase() || ''),
    [isCustomViewEnabled, runtimeContext?.applicationType],
  );

  const egCustomViewsSaveButtonEnabled = useMemo(
    () =>
      Boolean(isCustomViewEnabled) &&
      !DISALLOWED_APP_TYPES.includes(runtimeContext?.applicationType?.toLowerCase() || ''),
    [isCustomViewEnabled, runtimeContext?.applicationType],
  );

  // ============= Helper Functions =============

  /**
   * Rebuilds and updates the merged view list from categorized views.
   * Note: Not wrapped in useCallback to match original behavior and avoid dependency issues.
   */
  const rebuildMergedViewList = (updatedState: AllViewsDisplayState): void => {
    const mergedViewList = getMergedViewList(updatedState);
    runtimeContext?.bulkUpdateControls?.([{ value: mergedViewList, property: 'viewList', controlId: id }]);
  };

  /**
   * Finds and returns a view, with fallback logic for hidden/missing views.
   * Priority: 1) User's custom default view, 2) First visible view, 3) First view
   */
  const findAndReturnView = useCallback(
    (foundView: ControlView | undefined, shouldUpdateFilter = true): ControlView | undefined => {
      if (foundView && foundView.isVisible !== false) {
        return { ...foundView };
      }

      // Priority: 1) User's custom default view (if exists and visible), 2) First visible view, 3) First view
      const defaultView = control?.defaultViewFilter
        ? control?.viewList?.find((item) => item.id === control.defaultViewFilter && item.isVisible !== false)
        : undefined;
      const fallbackView =
        defaultView || control?.viewList?.find((item) => item.isVisible !== false) || control?.viewList?.[0];

      if (shouldUpdateFilter && fallbackView && fallbackView.id !== control?.viewFilter) {
        runtimeContext?.bulkUpdateControls?.([{ id, property: 'viewFilter', value: fallbackView.id }]);
      }

      return fallbackView ? { ...fallbackView } : undefined;
    },
    [control?.viewList, control?.viewFilter, control?.defaultViewFilter, runtimeContext, id],
  );

  /**
   * Processes custom views data and updates state.
   * Note: This is not wrapped in useCallback to match the original behavior
   * and avoid dependency cascade issues that can cause infinite loops.
   */
  const processCustomViewsData = (): void => {
    const allCustomViews = control?.model?.customViews || [];
    const allSharedViews = control?.model?.sharedViews || [];

    const excludedIds = [...allCustomViews.map((view) => view.id), ...allSharedViews.map((view) => view.id)];

    const sourceViewList: ControlView[] = originalViewListRef.current
      ? JSON.parse(originalViewListRef.current)
      : control?.viewList || [];
    const allStandardViews = sourceViewList.filter((view) => !excludedIds.includes(view.id));

    const updatedState: AllViewsDisplayState = {
      customViews: allCustomViews,
      sharedViews: allSharedViews,
      standardViews: allStandardViews,
    };

    rebuildMergedViewList(updatedState);
    setAllViewsDisplayState(updatedState);
  };

  // ============= Current View Calculation =============

  const currentView = useMemo((): ControlView | null | undefined => {
    if (!isRuntimeMode) {
      if (!control || !control.viewList || !Array.isArray(control.viewList)) {
        return null;
      }
      return control.viewList.find((x) => x.id === currentViewFilter);
    }

    if (!viewListReady || !control?.viewList || control.viewList.length === 0) {
      return undefined;
    }

    if (isCustomViewEnabled) {
      const { customViews, sharedViews, standardViews } = allViewsDisplayState;
      const allViews = [...customViews, ...sharedViews, ...standardViews];
      const foundView = allViews.find((view) => view.id === control.viewFilter);

      if (foundView && isMaintainViewOrder) {
        return { ...foundView };
      }

      return findAndReturnView(foundView);
    }

    const foundView = control.viewList.find((view) => view.id === control.viewFilter);
    return findAndReturnView(foundView);
  }, [
    control,
    control?.columns,
    currentViewFilter,
    allViewsDisplayState,
    isCustomViewEnabled,
    isRuntimeMode,
    viewListReady,
    isMaintainViewOrder,
    findAndReturnView,
  ]);

  const currentViewType = useMemo((): 'custom' | 'shared' | 'standard' => {
    if (!currentView || !isCustomViewEnabled) return 'standard';

    const { customViews, sharedViews, standardViews } = allViewsDisplayState;

    if (customViews.some((view) => view.id === currentView.id)) return 'custom';
    if (sharedViews.some((view) => view.id === currentView.id)) return 'shared';
    if (standardViews.some((view) => view.id === currentView.id)) return 'standard';

    return 'standard';
  }, [allViewsDisplayState, isCustomViewEnabled, currentView]);

  const canEditSharedView = useMemo((): boolean => {
    if (currentViewType !== 'shared' || !currentView) return false;

    const viewUserID = currentView.userID || currentView.UserID;
    const isViewOwner =
      viewUserID && screenDataContext?.methodIdentity && viewUserID === screenDataContext?.methodIdentity;

    return Boolean(runtimeContext?.isAdminOrCustomizer || isViewOwner);
  }, [currentViewType, currentView, screenDataContext?.methodIdentity, runtimeContext?.isAdminOrCustomizer]);

  // ============= Effects =============

  // Store original viewList
  useEffect(() => {
    if (control?.viewList && !originalViewListRef.current) {
      originalViewListRef.current = JSON.stringify(control.viewList);
    }
  }, [control?.viewList]);

  // Track the last processed views key to avoid re-processing on identical data
  const lastProcessedViewsKeyRef = useRef<string | null>(null);

  // Process custom views when model changes
  // Note: Dependencies match original implementation to avoid infinite loops
  useEffect(() => {
    if (!control?.model || !shouldEnableCustomViews()) {
      setViewListReady(true);
      return;
    }

    // Create a stable key to detect actual changes in custom/shared views
    // Include id, name, isVisible, and isHidden to detect meaningful changes (renames, visibility toggles, etc.)
    const customViews = control?.model?.customViews || [];
    const sharedViews = control?.model?.sharedViews || [];
    const getViewKey = (v: ControlView): string => `${v.id}:${v.name}:${v.isVisible}:${v.isHidden}`;
    const viewsKey = `${id}-${customViews.map(getViewKey).join('|')}-${sharedViews.map(getViewKey).join('|')}`;

    // Skip if we've already processed these exact views
    if (lastProcessedViewsKeyRef.current === viewsKey) {
      return;
    }

    lastProcessedViewsKeyRef.current = viewsKey;
    processCustomViewsData();
    setViewListReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control?.model?.customViews, control?.model?.sharedViews, id]);

  // Update view filter options when display state changes
  useEffect(() => {
    const { customViews, sharedViews, standardViews } = allViewsDisplayState;
    const applySearchableFilter = (
      custom: ControlView[],
      shared: ControlView[],
    ): { filteredCustomViews: ControlView[]; filteredSharedViews: ControlView[] } => {
      if (!control?.isSearchable) {
        return { filteredCustomViews: [], filteredSharedViews: [] };
      }
      return { filteredCustomViews: custom, filteredSharedViews: shared };
    };

    const { filteredCustomViews, filteredSharedViews } = applySearchableFilter(customViews, sharedViews);

    setViewFilterDisplayOptions([
      [
        'My Views',
        filteredCustomViews.map((view) => {
          const foundView = customViews.find((v) => v.id === view.id);
          return { ...view, isVisible: foundView?.isVisible ?? view.isVisible };
        }),
      ],
      ['Shared Views', filteredSharedViews],
      ['Standard Views', standardViews],
    ]);

    if (customViews.length > 0 || sharedViews.length > 0 || standardViews.length > 0) {
      // Views are ready
    }
  }, [allViewsDisplayState, control?.isSearchable]);

  // ============= Filter Data Builders =============

  const transformSorting = useCallback(
    (sorting: SortingConfig[] | null | undefined, controlSorting: SortingConfig | undefined): SortingConfig[] => {
      if (!sorting && !controlSorting) return [];
      if (!controlSorting) return sorting || [];

      const transformedSorting: SortingConfig = { ...controlSorting };
      transformedSorting.filterField = transformedSorting.sortField;
      transformedSorting.filterOrder = transformedSorting.sortType === 2 ? 'desc' : 'asc';
      return [transformedSorting];
    },
    [],
  );

  const createNewFilter = useCallback(
    (filterName: string, setAsDefault: boolean, isViewStandard: boolean): ApiFilter => {
      const { viewFriendlyName } = control || {};
      const visibleColumns = columns ? columns.filter((x) => x.visible).map((col) => col.name || '') : [];
      const hiddenColumns = columns ? columns.filter((x) => !x.visible).map((col) => col.name || '') : [];

      if (!isViewStandard) {
        return {
          filterId: Guid.create(),
          filterName: xss(filterName),
          viewName: viewFriendlyName,
          expression: advancedSearchExpression?.simple || [],
          advancedExpression: advancedSearchExpression?.advanced || [],
          standardExpression: currentView?.standardFiltering || [],
          versionId: Guid.empty(),
          sorting: transformSorting(initialSorting, control?.sorting),
          searchString: '',
          isDefault: setAsDefault,
          hidden: hiddenColumns,
          visibleColumns,
        };
      }

      let standardExpression: FilterExpression[] = [];
      if (currentView?.filtering && currentView.filtering.length > 0) {
        const normalizedCurrentFiltering = currentView.filtering.map((filter) => {
          const normalized: FilterExpression = {};
          if (filter.operation !== null && filter.operation !== undefined) normalized.operation = filter.operation;
          if (filter.key !== null && filter.key !== undefined) normalized.key = filter.key;
          if (filter.source !== null && filter.source !== undefined) normalized.source = filter.source;
          if (filter.dateField !== null && filter.dateField !== undefined) normalized.dateField = filter.dateField;
          if (filter.additionalSources !== null && filter.additionalSources !== undefined) {
            normalized.additionalSources = filter.additionalSources;
          }
          return normalized;
        });

        const simpleExpression = advancedSearchExpression?.simple || [];
        const hasNewFilters = simpleExpression.length > 0;
        standardExpression = hasNewFilters ? normalizedCurrentFiltering : currentView.filtering;
      }

      return {
        filterId: Guid.create(),
        filterName: xss(filterName),
        viewName: viewFriendlyName,
        expression: advancedSearchExpression?.simple || [],
        advancedExpression: advancedSearchExpression?.advanced || [],
        standardExpression,
        versionId: Guid.empty(),
        sorting: transformSorting(initialSorting, control?.sorting),
        searchString: '',
        isDefault: setAsDefault,
        hidden: hiddenColumns,
        visibleColumns,
      };
    },
    [control, columns, advancedSearchExpression, currentView, initialSorting, transformSorting],
  );

  const createUpdatedFilter = useCallback(
    (
      updatedFilterId: string,
      filterName: string,
      expression: FilterExpression[] | null | undefined,
      advancedExpression: FilterExpression[] | null | undefined,
      standardExpression: FilterExpression[] | null | undefined,
      isDefault: boolean | null | undefined,
      isHidden: boolean | undefined,
    ): ApiFilter => {
      const { viewFriendlyName } = control || {};
      const visibleColumns = columns ? columns.filter((x) => x.visible).map((col) => col.name || '') : [];
      const hiddenColumns = columns ? columns.filter((x) => !x.visible).map((col) => col.name || '') : [];

      const updatedFilter: ApiFilter = {
        filterId: updatedFilterId,
        filterName: xss(filterName),
        viewName: viewFriendlyName,
        expression: expression || [],
        advancedExpression: advancedExpression || [],
        standardExpression: standardExpression || [],
        versionId: Guid.empty(),
        sorting: transformSorting(initialSorting, control?.sorting),
        searchString: '',
        hidden: hiddenColumns,
        visibleColumns,
      };

      if (isDefault !== null && isDefault !== undefined) {
        updatedFilter.isDefault = isDefault;
      }

      if (isHidden !== null && isHidden !== undefined) {
        updatedFilter.isHidden = isHidden;
      }

      return updatedFilter;
    },
    [control, columns, initialSorting, transformSorting],
  );

  const createDeleteFilterData = useCallback(
    (viewToDelete: ControlView) => {
      const { viewFriendlyName } = control || {};
      const stockViewCount = control?.viewList?.length || 0;

      return {
        filter: {
          filterId: viewToDelete.id,
          filterName: viewToDelete.name,
          viewName: viewFriendlyName,
          expression: viewToDelete.filtering || [],
          advancedExpression: viewToDelete.advancedFiltering || [],
          standardExpression: viewToDelete.standardFiltering || [],
          isDefault: viewToDelete.id === control?.defaultViewFilter,
        },
        gridId: control?.id,
        isShared: viewToDelete.isShared || false,
        viewFriendlyName,
        stockViewCount,
        gridName: control?.name,
      };
    },
    [control],
  );

  // ============= Validation =============

  const getValidationMessage = useCallback((data: SaveResult): string => {
    if (data?.isDuplicate) {
      return 'A view with this name already exists. Please choose a different name.';
    }
    return data?.validationMessage || 'Failed to save view';
  }, []);

  // ============= View State Updates =============

  const updateViewsInState = useCallback(
    (
      updatedFilterId: string,
      updatedView: { filter?: ApiFilter; isShared?: boolean; userID?: string },
      setAsDefault: boolean | null | undefined,
    ): void => {
      const convertedView = convertFilterToDataTableView(updatedView);
      if (!convertedView) return;

      const updatedCustomViews = (control?.model?.customViews || []).map((view) =>
        view.id === updatedFilterId ? convertedView : view,
      );

      runtimeContext?.bulkUpdateControls?.([
        { value: updatedCustomViews, property: 'model.customViews', controlId: id },
      ]);

      if (setAsDefault) {
        runtimeContext?.bulkUpdateControls?.([
          { value: updatedFilterId, property: 'defaultViewFilter', controlId: id },
        ]);
      }
    },
    [control?.model?.customViews, runtimeContext, id],
  );

  // ============= CRUD Handlers =============

  const handleViewSaveSuccess = useCallback(
    (
      setAsDefault: boolean,
      filterName: string,
      handleChangeView?: (viewId: string, showSelected?: boolean, skipDirtyCheck?: boolean) => void,
    ) =>
      runtimeContext?.loadCustomViewsData?.(control?.id || '', control?.viewFriendlyName || '').then((allViews) => {
        const { myViews, sharedViews } = allViews;
        const lastView =
          myViews.find((view) => view.filter?.filterName === filterName) ||
          sharedViews.find((view) => view.filter?.filterName === filterName);
        const newView = convertFilterToDataTableView(lastView);

        if (!newView) return;

        if (newView.isShared) {
          const existingSharedViews = control?.model?.sharedViews || [];
          const updatedSharedViews = [...existingSharedViews, newView];
          const updatedNewSharedViews = isSharedViewsReordered
            ? separateViews(updatedSharedViews)
            : separateAndSortViews(updatedSharedViews);

          runtimeContext?.bulkUpdateControls?.([
            { value: updatedNewSharedViews, property: 'model.sharedViews', controlId: id },
          ]);
        } else {
          const existingCustomViews = control?.model?.customViews || [];
          const updatedCustomViews = [...existingCustomViews, newView];
          const updatedNewCustomViews = isCustomViewsReordered
            ? separateViews(updatedCustomViews)
            : separateAndSortViews(updatedCustomViews);

          runtimeContext?.bulkUpdateControls?.([
            { value: updatedNewCustomViews, property: 'model.customViews', controlId: id },
          ]);
        }

        if (setAsDefault && control?.defaultViewFilter !== newView.id) {
          runtimeContext?.bulkUpdateControls?.([{ value: newView.id, property: 'defaultViewFilter', controlId: id }]);
        }

        setTimeout(() => handleChangeView?.(newView.id, true, true), 100);
      }),
    [control, runtimeContext, id, isSharedViewsReordered, isCustomViewsReordered],
  );

  const handleViewUpdateSuccess = useCallback(
    (updatedFilterId: string, isDefault: boolean | null | undefined) =>
      runtimeContext?.loadCustomViewsData?.(control?.id || '', control?.viewFriendlyName || '').then((allViews) => {
        const { myViews, sharedViews } = allViews;
        const updatedView =
          myViews.find((view) => view.filter?.filterId === updatedFilterId) ||
          sharedViews.find((view) => view.filter?.filterId === updatedFilterId);

        if (updatedView) {
          updateViewsInState(updatedFilterId, updatedView, isDefault);
        }
      }),
    [control?.id, control?.viewFriendlyName, runtimeContext, updateViewsInState],
  );

  const handleViewDeleteSuccess = useCallback(
    (viewId: string): void => {
      const updatedViewList = (control?.viewList || []).filter((view) => view.id !== viewId);
      const updatedCustomViews = (control?.model?.customViews || []).filter((view) => view.id !== viewId);
      const updatedSharedViews = (control?.model?.sharedViews || []).filter((view) => view.id !== viewId);

      // Also update originalViewListRef to prevent deleted view from appearing as standard view
      if (originalViewListRef.current) {
        const originalList: ControlView[] = JSON.parse(originalViewListRef.current);
        const updatedOriginalList = originalList.filter((view) => view.id !== viewId);
        originalViewListRef.current = JSON.stringify(updatedOriginalList);
      }

      // If the deleted view was currently selected, find fallback view
      if (control?.viewFilter === viewId) {
        // Priority: 1) User's custom default view (if not deleted), 2) First visible view
        const defaultView =
          control?.defaultViewFilter && control.defaultViewFilter !== viewId
            ? updatedViewList.find((v) => v.id === control.defaultViewFilter && v.isVisible !== false)
            : undefined;

        const fallbackView = defaultView || updatedViewList.find((v) => v.isVisible !== false);
        const fallbackViewId = fallbackView?.id;

        // Batch all updates together; include viewFilter only if we have a valid fallback
        const updates: { value: unknown; property: string; controlId: string }[] = [
          { value: updatedViewList, property: 'viewList', controlId: id },
          { value: updatedCustomViews, property: 'model.customViews', controlId: id },
          { value: updatedSharedViews, property: 'model.sharedViews', controlId: id },
        ];

        if (fallbackViewId !== undefined) {
          updates.push({ value: fallbackViewId, property: 'viewFilter', controlId: id });
        }

        runtimeContext?.bulkUpdateControls?.(updates);
      } else {
        // View being deleted is not the active view, just update the lists
        runtimeContext?.bulkUpdateControls?.([
          { value: updatedViewList, property: 'viewList', controlId: id },
          { value: updatedCustomViews, property: 'model.customViews', controlId: id },
          { value: updatedSharedViews, property: 'model.sharedViews', controlId: id },
        ]);
      }
    },
    [
      control?.viewList,
      control?.model?.customViews,
      control?.model?.sharedViews,
      control?.viewFilter,
      control?.defaultViewFilter,
      runtimeContext,
      id,
    ],
  );

  // ============= API Handlers =============

  const handleSaveCustomViewClick = useCallback(
    (
      filterName: string,
      setAsDefault: boolean,
      shareOption: 'me' | 'everyone',
      onValidation: ((message: string) => void) | null,
      handleChangeView?: (viewId: string, showSelected?: boolean, skipDirtyCheck?: boolean) => void,
    ): void => {
      const { viewFriendlyName } = control || {};
      const isShared = shareOption === 'everyone';
      const stockViewCount = control?.viewList?.length || 0;

      const isViewStandard =
        allViewsDisplayState.standardViews.some((view) => view.id === currentView?.id) ||
        (!control?.model?.customViews?.some((v) => v.id === currentView?.id) &&
          !control?.model?.sharedViews?.some((v) => v.id === currentView?.id));

      const newFilter = createNewFilter(filterName, setAsDefault, isViewStandard);

      const filterData = {
        newFilter,
        gridId: control?.id,
        isShared,
        viewFriendlyName,
        stockViewCount,
        gridName: control?.name,
      };

      const handleSuccess = (data: SaveResult): void => {
        if (data?.saveSuccess) {
          handleViewSaveSuccess(setAsDefault, filterName, handleChangeView);
          screenDataContext?.closeDialog?.();
        } else {
          const validationMessage = getValidationMessage(data);
          if (onValidation) onValidation(validationMessage);
        }
      };

      const handleError = (): void => {
        if (onValidation) onValidation('An error occurred while saving the view');
      };

      runtimeContext?.saveCustomView?.(filterData, handleSuccess, handleError);
    },
    [
      control,
      currentView,
      allViewsDisplayState.standardViews,
      createNewFilter,
      handleViewSaveSuccess,
      screenDataContext,
      getValidationMessage,
      runtimeContext,
    ],
  );

  const handleUpdateCustomViewClick = useCallback(
    (
      updatedFilterId: string,
      filterName: string,
      setAsDefault: boolean | null,
      shareOption: 'me' | 'everyone' | 'personal',
      expression: FilterExpression[] | null | undefined,
      advancedExpression: FilterExpression[] | null | undefined,
      standardExpression: FilterExpression[] | null | undefined,
      onValidation: ((message: string) => void) | null,
      isHidden?: boolean,
      viewToUpdate?: ControlView,
    ): void => {
      const { viewFriendlyName } = control || {};
      const isShared = shareOption === 'everyone';
      const stockViewCount = control?.viewList?.length || 0;
      let currentViewToUpdate = viewToUpdate;

      if (!currentViewToUpdate) {
        currentViewToUpdate = control?.viewList?.find((view) => view.id === updatedFilterId);
        if (!currentViewToUpdate) return;
      }

      const isDefault =
        setAsDefault !== undefined && setAsDefault !== null
          ? setAsDefault
          : currentViewToUpdate.id === control?.defaultViewFilter;

      const updatedFilter = createUpdatedFilter(
        updatedFilterId,
        filterName,
        expression,
        advancedExpression,
        standardExpression,
        isDefault,
        isHidden,
      );

      const filterData = {
        updatedFilter,
        gridId: control?.id,
        isShared,
        viewFriendlyName,
        stockViewCount,
        gridName: control?.name,
      };

      const handleSuccess = (data: SaveResult): void => {
        if (data?.saveSuccess) {
          handleViewUpdateSuccess(updatedFilterId, isDefault);
          screenDataContext?.closeDialog?.();
        } else {
          const validationMessage = getValidationMessage(data);
          if (onValidation) onValidation(validationMessage);
        }
      };

      const handleError = (): void => {
        if (onValidation) onValidation('An error occurred while updating the view');
      };

      runtimeContext?.updateCustomView?.(filterData, handleSuccess, handleError);
    },
    [control, createUpdatedFilter, handleViewUpdateSuccess, screenDataContext, getValidationMessage, runtimeContext],
  );

  const handleDeleteCustomViewClick = useCallback(
    (viewId: string): void => {
      if (!viewId) return;

      const viewToDelete = control?.viewList?.find((view) => view.id === viewId);
      if (!viewToDelete) return;

      const filterData = createDeleteFilterData(viewToDelete);

      const handleSuccess = (data: { deleteSuccess?: boolean }): void => {
        if (data?.deleteSuccess) {
          handleViewDeleteSuccess(viewId);

          const isSharedView = control?.model?.sharedViews?.some((v) => v.id === viewId) || viewToDelete.isShared;
          const analyticsData = {
            Action: 'Grid View Deleted',
            Source: 'Editable Grid',
            viewName: viewToDelete.name || 'Unknown View',
            isDefaultView: control?.defaultViewFilter === viewId,
            shareSettings: isSharedView ? 'Shared' : 'Personal',
            gridName: control?.name || control?.caption || 'Unknown Grid',
            gridBaseTable: control?.viewFriendlyName || 'Unknown Table',
          };

          if (isRuntimeMode && runtimeContext) {
            runtimeContext.processAnalytics?.('Runtime Interaction', analyticsData);
          }
        }
      };

      runtimeContext?.deleteCustomView?.(filterData, handleSuccess);
    },
    [control, createDeleteFilterData, handleViewDeleteSuccess, isRuntimeMode, runtimeContext],
  );

  // ============= View Actions =============

  const handleUpdateCurrentView = useCallback((): void => {
    if (!currentView || currentViewType !== 'custom') return;

    handleUpdateCustomViewClick(
      currentView.id,
      currentView.name,
      null,
      'personal',
      advancedSearchExpression?.simple || [],
      advancedSearchExpression?.advanced || [],
      currentView.standardFiltering || [],
      null,
      false,
      currentView,
    );
  }, [currentView, currentViewType, advancedSearchExpression, handleUpdateCustomViewClick]);

  const handleUpdateSharedView = useCallback((): void => {
    if (!currentView || currentViewType !== 'shared' || !canEditSharedView) return;

    handleUpdateCustomViewClick(
      currentView.id,
      currentView.name,
      null,
      'everyone',
      advancedSearchExpression?.simple || [],
      advancedSearchExpression?.advanced || [],
      currentView.standardFiltering || [],
      null,
      false,
      currentView,
    );
  }, [currentView, currentViewType, canEditSharedView, advancedSearchExpression, handleUpdateCustomViewClick]);

  const handleToggleViewVisibility = useCallback(
    (viewId: string, isVisible: boolean): void => {
      if (!viewId) return;

      const { customViews, sharedViews, standardViews } = allViewsDisplayState;
      const allViews = [...customViews, ...sharedViews, ...standardViews];
      const viewToToggle = allViews.find((view) => view.id === viewId);

      if (!viewToToggle) return;
      setIsMaintainViewOrder(true);

      const isViewStandard = standardViews.some((view) => view.id === viewId);

      if (!isViewStandard) {
        handleUpdateCustomViewClick(
          viewId,
          viewToToggle.name,
          null,
          viewToToggle.isShared ? 'everyone' : 'me',
          viewToToggle.filtering,
          viewToToggle.advancedFiltering,
          viewToToggle.standardFiltering,
          () => {},
          !isVisible,
          viewToToggle,
        );
      }
    },
    [allViewsDisplayState, handleUpdateCustomViewClick],
  );

  const handleSetDefaultView = useCallback(
    (viewId: string, setAsDefault: boolean): void => {
      if (!viewId) return;

      const { customViews, sharedViews, standardViews } = allViewsDisplayState;
      const allViews = [...customViews, ...sharedViews, ...standardViews];
      const viewToToggle = allViews.find((view) => view.id === viewId);

      if (!viewToToggle) return;

      const handleSuccess = (data: SaveResult): void => {
        if (data?.saveSuccess) {
          runtimeContext?.bulkUpdateControls?.([
            { value: setAsDefault ? viewId : null, property: 'defaultViewFilter', controlId: id },
          ]);
          setAllViewsDisplayState((prevState) => {
            const updateDefaultInViews = (views: ControlView[]): ControlView[] =>
              views.map((view) => ({
                ...view,
                isDefault: view.id === viewId ? setAsDefault : false,
              }));

            return {
              customViews: updateDefaultInViews(prevState.customViews),
              sharedViews: updateDefaultInViews(prevState.sharedViews),
              standardViews: updateDefaultInViews(prevState.standardViews),
            };
          });
        }
      };

      runtimeContext?.setDefaultView?.(setAsDefault ? viewId : Guid.empty(), control?.id || '', handleSuccess);
    },
    [allViewsDisplayState, runtimeContext, id, control?.id],
  );

  // ============= Drag and Drop =============

  const setViewOrder = useCallback(
    (
      views: ControlView[],
      source: { index: number },
      destination: { index: number },
      isShared: boolean,
    ): ControlView[] => {
      const reordered = reorderArray(views, source.index, destination.index);
      const viewOrder = reordered.map((view) => view.id);

      runtimeContext?.updateCustomViewsOrder?.(viewOrder, control?.id || '', isShared);

      if (isShared) {
        setIsSharedViewsReordered(true);
      } else {
        setIsCustomViewsReordered(true);
      }
      return reordered;
    },
    [runtimeContext, control?.id],
  );

  const handleCustomViewsDragEnd = useCallback(
    (result: DragEndResult): void => {
      const { destination, source } = result;
      if (!destination || !source) return;
      if (destination.index === source.index) return;

      setAllViewsDisplayState((prevState) => {
        let { customViews, sharedViews } = prevState;

        if (!destination.droppableId.includes('My Views')) {
          sharedViews = setViewOrder(sharedViews, source, destination, true);
        } else {
          customViews = setViewOrder(customViews, source, destination, false);
        }

        const updatedState: AllViewsDisplayState = {
          customViews,
          sharedViews,
          standardViews: prevState.standardViews,
        };

        runtimeContext?.bulkUpdateControls?.([
          { value: updatedState.customViews, property: 'model.customViews', controlId: id },
          { value: updatedState.sharedViews, property: 'model.sharedViews', controlId: id },
        ]);

        rebuildMergedViewList(updatedState);
        return updatedState;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setViewOrder, runtimeContext, id],
  );

  const handleManageDoneForViews = useCallback(
    (views: ControlView[], isReordered: boolean, isShared: boolean): void => {
      const separated = isReordered ? separateViews(views) : separateAndSortViews(views);
      const viewOrder = separated.map((view) => view.id);

      if (isReordered) {
        runtimeContext?.updateCustomViewsOrder?.(viewOrder, control?.id || '', isShared);
      }
      runtimeContext?.bulkUpdateControls?.([
        { value: separated, property: isShared ? 'model.sharedViews' : 'model.customViews', controlId: id },
      ]);
    },
    [runtimeContext, control?.id, id],
  );

  const handleCustomViewsManageDoneClick = useCallback((): void => {
    setIsMaintainViewOrder(false);

    runtimeContext?.loadCustomViewsData?.(control?.id || '', control?.viewFriendlyName || '').then((allViews) => {
      const { myViews, sharedViews } = allViews;
      const convertedCustomViews = myViews
        .map((view) => convertFilterToDataTableView(view))
        .filter((view): view is ControlView => view !== null);
      const convertedSharedViews = sharedViews
        .map((view) => convertFilterToDataTableView(view))
        .filter((view): view is ControlView => view !== null);

      handleManageDoneForViews(convertedCustomViews, isCustomViewsReordered, false);
      handleManageDoneForViews(convertedSharedViews, isSharedViewsReordered, true);
    });
  }, [
    runtimeContext,
    control?.id,
    control?.viewFriendlyName,
    handleManageDoneForViews,
    isCustomViewsReordered,
    isSharedViewsReordered,
  ]);

  // ============= Display View List =============

  const displayViewList = useMemo((): ControlView[] | ViewFilterOptions => {
    if (!isRuntimeMode) {
      return control?.viewList && Array.isArray(control.viewList)
        ? control.viewList.filter((x) => x.isVisible || x.isVisible === undefined || x.isVisible === null)
        : [];
    }

    if (shouldEnableCustomViews()) {
      return viewFilterOptions;
    }

    return control?.viewList?.filter((x) => x.isVisible || x.isVisible === undefined || x.isVisible === null) || [];
  }, [control?.viewList, isRuntimeMode, shouldEnableCustomViews, viewFilterOptions]);

  // ============= Return =============

  return {
    // State
    allViewsDisplayState,
    setAllViewsDisplayState,
    viewFilterOptions,
    viewListReady,
    isCustomViewEnabled: Boolean(isCustomViewEnabled),
    egCustomViewsSaveButtonEnabled,
    isCustomViewsReordered,
    isSharedViewsReordered,

    // Computed
    currentView,
    currentViewType,
    canEditSharedView,
    displayViewList,
    shouldEnableCustomViews,

    // Handlers
    handleSaveCustomViewClick,
    handleUpdateCustomViewClick,
    handleDeleteCustomViewClick,
    handleUpdateCurrentView,
    handleUpdateSharedView,
    handleToggleViewVisibility,
    handleSetDefaultView,
    handleCustomViewsDragEnd,
    handleCustomViewsManageDoneClick,
    rebuildMergedViewList,

    // Utilities
    processCustomViewsData,
    getValidationMessage,
  };
};

export default useCustomViews;
