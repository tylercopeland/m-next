/**
 * V4 layout persistence utilities.
 *
 * Eliminates 4x copy-pasted blocks (~400 lines) in LayoutCanvasWrapper that
 * convert flat ResponsiveComponent[] → nested ResponsiveLayoutItem[] → LayoutCanvas.
 *
 * Two strategies are provided:
 *   - buildFlatLayoutItems:        merges from existingResponsive + layoutV4 nestedSearch (full merge)
 *   - buildFlatLayoutItemsSimple:  merges from existingResponsive only (resolution-aware)
 *
 * Both feed into assembleLayoutCanvas → onLayoutV4Change.
 */
import { ResponsiveComponent } from '@m-next/layout-canvas';
import { CurrentState } from '@m-next/types';
import type { ResponsiveLayoutItem, LayoutCanvas } from './layoutDataMappers';

// ---------------------------------------------------------------------------
// buildNestedFromFlat — shared recursive nesting (was duplicated 4x)
// ---------------------------------------------------------------------------

/**
 * Converts a flat array of ResponsiveLayoutItems into a nested tree
 * based on containerId relationships.
 */
export const buildNestedFromFlat = (
  items: ResponsiveLayoutItem[],
  parentId: string | null = null,
): ResponsiveLayoutItem[] =>
  items
    .filter((item) => item.containerId === parentId)
    .map((item) => ({
      ...item,
      content: buildNestedFromFlat(items, item.id),
    }));

// ---------------------------------------------------------------------------
// assembleLayoutCanvas — shared final assembly (was duplicated 4x)
// ---------------------------------------------------------------------------

/**
 * Assembles a complete LayoutCanvas from flat items + existing layout metadata.
 */
export const assembleLayoutCanvas = (
  flatItems: ResponsiveLayoutItem[],
  layoutV4: LayoutCanvas | undefined,
  versionId: string | undefined,
): LayoutCanvas => {
  const nestedContent = buildNestedFromFlat(flatItems, null);

  return {
    canvasId: layoutV4?.canvasId || versionId || 'default-canvas',
    type: layoutV4?.type || 'Grid',
    size: layoutV4?.size || 12,
    content: nestedContent,
  };
};

// ---------------------------------------------------------------------------
// nestedSearch — helper to find a layout item inside layoutV4
// ---------------------------------------------------------------------------

const nestedSearch = (
  entry: ResponsiveLayoutItem | ResponsiveLayoutItem[],
  targetId: string,
): ResponsiveLayoutItem | undefined => {
  if (Array.isArray(entry)) {
    for (const item of entry) {
      const result = nestedSearch(item, targetId);
      if (result) return result;
    }
  } else if (entry.id === targetId) {
    return entry;
  } else if (entry.content && Array.isArray(entry.content)) {
    for (const item of entry.content) {
      const result = nestedSearch(item, targetId);
      if (result) return result;
    }
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// buildFlatLayoutItems — Pattern A (full merge with layoutV4 search)
// Used by handleComponentsChange for new control creation and debounced updates
// ---------------------------------------------------------------------------

/**
 * Builds flat ResponsiveLayoutItems by merging component positions with
 * existing responsive overrides and layoutV4 currentState data.
 *
 * This is the "full merge" strategy: it searches layoutV4 for each component's
 * existing layout item to preserve currentState values across breakpoints.
 */
export const buildFlatLayoutItems = (
  components: ResponsiveComponent[],
  canvasComponents: ResponsiveComponent[],
  layoutV4: LayoutCanvas | undefined,
  resolution: string | undefined,
): ResponsiveLayoutItem[] => {
  return components.map((component) => {
    const existingComponent = canvasComponents.find(c => c.id === component.id);
    const existingResponsive = existingComponent?.responsive;
    // Prefer layoutV4 (always updated on save) over canvasComponents.responsive
    // (not updated by drag handlers). Fall back to canvasComponents when layoutV4 is absent.
    const existingLayout = layoutV4 ? nestedSearch(layoutV4.content, component.id) : undefined;

    const updatedData = {
      x: component.x,
      y: component.y,
      width: component.width,
      height: component.height,
    };

    const currentStateDesktop = existingLayout?.desktop?.currentState ?? CurrentState.REGULAR;
    const currentStateTablet = existingLayout?.tabletOverride?.currentState ?? CurrentState.REGULAR;
    const currentStateMobile = existingLayout?.mobileOverride?.currentState ?? CurrentState.REGULAR;

    const desktopSource = existingLayout?.desktop ?? existingResponsive?.desktop;
    let desktopData = desktopSource
      ? { x: desktopSource.x, y: desktopSource.y, width: desktopSource.width, height: desktopSource.height, currentState: currentStateDesktop }
      : { ...updatedData, currentState: currentStateDesktop };

    const tabletSource = existingLayout?.tabletOverride ?? existingResponsive?.tabletOverride;
    let tabletData = tabletSource && {
      x: tabletSource.x, y: tabletSource.y,
      width: tabletSource.width, height: tabletSource.height,
      currentState: currentStateTablet,
    };

    const mobileSource = existingLayout?.mobileOverride ?? existingResponsive?.mobileOverride;
    let mobileData = mobileSource && {
      x: mobileSource.x, y: mobileSource.y,
      width: mobileSource.width, height: mobileSource.height,
      currentState: currentStateMobile,
    };

    // Apply update to current resolution.
    // For tablet/mobile: always create the override even if none existed before —
    // the guard `&& tabletData` would silently drop first-time changes at that resolution.
    if (resolution === 'desktop') {
      desktopData = { ...desktopData, ...updatedData };
    }
    if (resolution === 'tablet') {
      tabletData = tabletData
        ? { ...tabletData, ...updatedData }
        : { ...updatedData, currentState: currentStateTablet };
    }
    if (resolution === 'mobile') {
      mobileData = mobileData
        ? { ...mobileData, ...updatedData }
        : { ...updatedData, currentState: currentStateMobile };
    }

    const baseStructure: ResponsiveLayoutItem = {
      id: component.id,
      containerId: component.containerId,
      desktop: desktopData,
      content: [],
    };

    if (tabletData) {
      baseStructure.tabletOverride = tabletData;
    }
    if (mobileData) {
      baseStructure.mobileOverride = mobileData;
    }

    return baseStructure;
  });
};

// ---------------------------------------------------------------------------
// buildFlatLayoutItemsSimple — Pattern B (layoutV4-aware, resolution-specific save)
// Used by container drop handlers
// ---------------------------------------------------------------------------

/**
 * Builds flat ResponsiveLayoutItems: writes component's current position into the
 * active resolution's slot and preserves all other breakpoints from layoutV4.
 */
export const buildFlatLayoutItemsSimple = (
  components: ResponsiveComponent[],
  canvasComponents: ResponsiveComponent[],
  resolution: string | undefined,
  layoutV4?: LayoutCanvas,
): ResponsiveLayoutItem[] => {
  return components.map((component) => {
    const existingComponent = canvasComponents.find(c => c.id === component.id);
    const existingResponsive = existingComponent?.responsive;
    // Prefer layoutV4 (authoritative after each save), fall back to canvasComponents.responsive.
    const existingLayout = layoutV4 ? nestedSearch(layoutV4.content, component.id) : undefined;

    const tabletSource = existingLayout?.tabletOverride ?? existingResponsive?.tabletOverride;
    const mobileSource = existingLayout?.mobileOverride ?? existingResponsive?.mobileOverride;
    const desktopSource = existingLayout?.desktop ?? existingResponsive?.desktop;

    const updatedPos = { x: component.x, y: component.y, width: component.width, height: component.height };

    const baseStructure: ResponsiveLayoutItem = {
      id: component.id,
      containerId: component.containerId,
      desktop: resolution === 'desktop'
        ? { ...updatedPos, currentState: desktopSource?.currentState ?? CurrentState.REGULAR }
        : desktopSource
          ? { x: desktopSource.x, y: desktopSource.y, width: desktopSource.width, height: desktopSource.height, currentState: desktopSource.currentState ?? CurrentState.REGULAR }
          : { ...updatedPos, currentState: CurrentState.REGULAR },
      content: [],
    };

    if (resolution === 'tablet') {
      baseStructure.tabletOverride = { ...updatedPos, currentState: tabletSource?.currentState ?? CurrentState.REGULAR };
      if (mobileSource) baseStructure.mobileOverride = { ...mobileSource };
    } else if (resolution === 'mobile') {
      baseStructure.mobileOverride = { ...updatedPos, currentState: mobileSource?.currentState ?? CurrentState.REGULAR };
      if (tabletSource) baseStructure.tabletOverride = { ...tabletSource };
    } else {
      if (tabletSource) baseStructure.tabletOverride = { ...tabletSource };
      if (mobileSource) baseStructure.mobileOverride = { ...mobileSource };
    }

    return baseStructure;
  });
};
