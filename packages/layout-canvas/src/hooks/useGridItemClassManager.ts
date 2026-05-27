import { useEffect } from 'react';

export interface UseGridItemClassManagerParams {
  /**
   * CSS scope selector prefix for querySelector calls.
   * Empty/undefined = global (LayoutCanvas), '.nested-layout' = scoped (LayoutContainer).
   */
  scope?: string;

  /** Currently selected component ID (null/undefined when nothing is selected) */
  selectedComponentId?: string | null;

  /** Components to manage top-row class for (any object with id and y) */
  components: ReadonlyArray<{ id: string; y: number }>;

  /** Callback invoked when a component is selected (e.g., to clear hover state) */
  onSelectionChange?: () => void;

  /** Currently hovered component ID (optional — only needed if hover class is managed via DOM) */
  hoveredComponentId?: string | null;

  /**
   * Whether the mouse is actually over a child component (vs container background).
   * Only relevant for LayoutContainer. Defaults to true.
   */
  isOverChildComponent?: boolean;
}

/**
 * Finds the closest .react-grid-item ancestor of a component identified by data-testid.
 * When a scope is set, validates that the grid item is within the scope.
 */
function findGridItem(componentId: string, scope?: string): Element | null {
  const element = document.querySelector(`[data-testid="component-${componentId}"]`);
  const gridItem = element?.closest('.react-grid-item');
  if (!gridItem) return null;

  // If scope is set, ensure the grid item is within the scoped container
  if (scope && !gridItem.closest(scope)) return null;

  return gridItem;
}

/**
 * Removes a class from all matching grid items, optionally scoped to a container.
 */
function removeClassFromAll(className: string, scope?: string): void {
  const selector = scope ? `${scope} .react-grid-item.${className}` : `.react-grid-item.${className}`;
  document.querySelectorAll(selector).forEach((item) => {
    item.classList.remove(className);
  });
}

/**
 * Manages CSS classes on .react-grid-item elements via DOM manipulation.
 *
 * React Grid Layout creates wrapper .react-grid-item elements that we can't
 * directly control via React props. This hook synchronises CSS classes
 * (selected-item, top-row, hovered) on those wrapper elements based on
 * component state, eliminating duplicated useEffect blocks in LayoutCanvas
 * and LayoutContainer.
 *
 * The `scope` parameter controls which grid items are targeted:
 * - No scope (default): targets all `.react-grid-item` elements (LayoutCanvas)
 * - `'.nested-layout'`: targets only items inside `.nested-layout` (LayoutContainer)
 */
export function useGridItemClassManager({
  scope,
  selectedComponentId,
  components,
  onSelectionChange,
  hoveredComponentId,
  isOverChildComponent = true,
}: UseGridItemClassManagerParams): void {
  // Manage selected-item class
  useEffect(() => {
    removeClassFromAll('selected-item', scope);

    if (selectedComponentId) {
      const gridItem = findGridItem(selectedComponentId, scope);
      if (gridItem) {
        gridItem.classList.add('selected-item');
      }
      onSelectionChange?.();
    }
  }, [selectedComponentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Manage top-row class for components at y=0
  useEffect(() => {
    removeClassFromAll('top-row', scope);

    components.forEach((component) => {
      if (component.y === 0) {
        const gridItem = findGridItem(component.id, scope);
        if (gridItem) {
          gridItem.classList.add('top-row');
        }
      }
    });
  }, [components, scope]);

  // Manage hovered class (optional — only when hoveredComponentId is provided)
  useEffect(() => {
    if (hoveredComponentId === undefined) return;

    removeClassFromAll('hovered', scope);

    if (hoveredComponentId && isOverChildComponent) {
      const gridItem = findGridItem(hoveredComponentId, scope);
      if (gridItem) {
        gridItem.classList.add('hovered');
      }
    }
  }, [hoveredComponentId, isOverChildComponent, scope]);
}
