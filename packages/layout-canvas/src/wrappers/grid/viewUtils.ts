/**
 * View utility functions for Grid component.
 * These are pure utility functions for manipulating view data structures.
 */
import type { ControlView, ViewColumn, ControlModel, AllViewsDisplayState, ApiViewItem } from './types';

/**
 * Checks if a view is visible.
 * Views are visible if isVisible is true, undefined, or null.
 * @param view - The view object to check
 * @returns True if the view is visible
 */
export const isViewVisible = (view: ControlView): boolean =>
  view.isVisible === true || view.isVisible === undefined || view.isVisible === null;

/**
 * Filters an array of views to only include visible ones.
 * @param views - Array of view objects
 * @returns Array of visible views
 */
export const filterVisibleViews = (views: ControlView[]): ControlView[] => views.filter(isViewVisible);

/**
 * Sorts views alphabetically by name.
 * Note: This mutates the original array. Use with a copy if needed.
 * @param views - Array of view objects with name property
 * @returns The sorted array
 */
export const sortByName = (views: ControlView[]): ControlView[] => views.sort((a, b) => a.name.localeCompare(b.name));

/**
 * Separates views into visible and hidden, sorting both groups by name.
 * @param allViews - Array of all views
 * @returns Array with visible views (sorted) followed by hidden views (sorted)
 */
export const separateAndSortViews = (allViews: ControlView[]): ControlView[] => {
  const visibleViews = allViews.filter(
    (x) => x.isVisible === true || x.isVisible === undefined || x.isVisible === null,
  );
  const hiddenViews = allViews.filter((x) => x.isVisible === false);
  return [...sortByName(visibleViews), ...sortByName(hiddenViews)];
};

/**
 * Separates views into visible and hidden.
 * Visible views maintain their order, hidden views are sorted by name.
 * @param allViews - Array of all views
 * @returns Array with visible views (original order) followed by hidden views (sorted)
 */
export const separateViews = (allViews: ControlView[]): ControlView[] => {
  const visibleViews = allViews.filter(
    (x) => x.isVisible === true || x.isVisible === undefined || x.isVisible === null,
  );
  const hiddenViews = allViews.filter((x) => x.isVisible === false);
  return [...visibleViews, ...sortByName(hiddenViews)];
};

/**
 * Reorders elements in an array by moving an item from startIndex to endIndex.
 * @param array - The array to reorder
 * @param startIndex - The index of the item to move
 * @param endIndex - The index to move the item to
 * @returns A new array with the item moved
 */
export const reorderArray = <T>(array: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  if (removed !== undefined) {
    result.splice(endIndex, 0, removed);
  }
  return result;
};

/**
 * Converts visible and hidden column arrays into a unified column format.
 * @param visibleColumns - Array of visible column names
 * @param hiddenColumns - Array of hidden column names
 * @returns Array of column objects with field and visible properties
 */
export const convertAllColumns = (
  visibleColumns: string[] | undefined | null,
  hiddenColumns: string[] | undefined | null,
): ViewColumn[] => {
  const result: ViewColumn[] = [];

  if (Array.isArray(visibleColumns)) {
    result.push(
      ...visibleColumns.map((col) => ({
        field: col,
        visible: true,
      })),
    );
  }

  if (Array.isArray(hiddenColumns)) {
    result.push(
      ...hiddenColumns.map((col) => ({
        field: col,
        visible: false,
      })),
    );
  }

  return result;
};

/**
 * Converts a filter object from API format to DataTable view format.
 * @param view - The view object from API with filter property
 * @returns The converted view object or null if invalid
 */
export const convertFilterToDataTableView = (view: ApiViewItem | null | undefined): ControlView | null => {
  if (!view || !view.filter) return null;
  const { filter } = view;

  return {
    id: filter.filterId,
    name: filter.filterName,
    searchString: filter.searchString || null,
    sorting: filter.sorting || [],
    filtering: filter.expression || [],
    advancedFiltering: filter.advancedExpression || [],
    standardFiltering: filter.standardExpression || [],
    enableDynamicDates: false,
    isVisible: !filter.isHidden,
    columns: convertAllColumns(filter.visibleColumns, filter.hidden),
    isShared: view.isShared || false,
    userID: view.userID,
  };
};

/**
 * Gets the type of a view based on its presence in custom or shared views.
 * @param viewId - The view ID to check
 * @param model - The control model containing customViews and sharedViews
 * @returns 'Personal', 'Shared', or 'Standard'
 */
export const getViewType = (
  viewId: string,
  model: ControlModel | null | undefined,
): 'Personal' | 'Shared' | 'Standard' => {
  if (model?.customViews?.some((v) => v.id === viewId)) {
    return 'Personal';
  }
  if (model?.sharedViews?.some((v) => v.id === viewId)) {
    return 'Shared';
  }
  return 'Standard';
};

/**
 * Checks if a view is a standard view (not custom or shared).
 * @param viewId - The view ID to check
 * @param allViewsDisplayState - State object with customViews, sharedViews, standardViews
 * @param model - The control model containing customViews and sharedViews
 * @returns True if the view is a standard view
 */
export const isStandardView = (
  viewId: string,
  allViewsDisplayState: AllViewsDisplayState,
  model: ControlModel | null | undefined,
): boolean =>
  allViewsDisplayState.standardViews.some((view) => view.id === viewId) ||
  (!model?.customViews?.some((v) => v.id === viewId) && !model?.sharedViews?.some((v) => v.id === viewId));

/**
 * Builds a merged view list from the categorized view state.
 * Combines visible views from standard, custom, and shared categories.
 * @param updatedState - State object with customViews, sharedViews, standardViews
 * @returns Merged array of visible views in order: standard, custom, shared
 */
export const getMergedViewList = (updatedState: AllViewsDisplayState): ControlView[] => {
  const visibleViews = {
    custom: filterVisibleViews(updatedState.customViews),
    shared: filterVisibleViews(updatedState.sharedViews),
    standard: filterVisibleViews(updatedState.standardViews),
  };

  return [...visibleViews.standard, ...visibleViews.custom, ...visibleViews.shared];
};
