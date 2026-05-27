import type { BaseControl } from '@m-next/runtime-interface';
import { WIDGETS } from '@m-next/runtime-interface';
import { CurrentState } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import type {
  DuplicateControlOptions,
  CanDuplicateResult,
  DuplicateControlResult,
  LayoutV4,
  LayoutItemV4,
  GridPosition,
  PendingLayoutItem,
} from './duplicateControlHelper.types';

/**
 * Checks if a property key is an event handler (on[A-Z]...) whose value is a valid GUID (action set reference).
 * Used to generically detect all action set properties on controls without hardcoding property names.
 */
export const isEventPropertyWithGuid = (key: string, value: unknown): value is string =>
  typeof value === 'string' && /^on[A-Z]/.test(key) && Guid.valid(value);

/**
 * Single-instance components that cannot be duplicated
 */
const SINGLE_INSTANCE_WIDGETS = [
  WIDGETS.SIGNATURE,
  WIDGETS.TAGLIST,
  WIDGETS.SYNCWIDGET,
  WIDGETS.DOCUMENTSWIDGET,
  WIDGETS.RECURRENCE,
];

/**
 * Checks if a widget type is a single-instance component
 */
const isSingleInstanceWidget = (controlType: string): boolean => SINGLE_INSTANCE_WIDGETS.includes(controlType);

/**
 * Checks if a control is a container type
 */
const isContainerType = (controlType: string): boolean =>
  controlType === WIDGETS.LAYOUT_CONTAINER || controlType === WIDGETS.SECTION;

/**
 * Gets all child control IDs for a container using the layoutV4 nested structure
 * Falls back to flattened controlList if layoutV4 is not available
 */
const getContainerChildren = (
  containerId: string,
  controlList: Record<string, BaseControl>,
  layoutV4?: LayoutV4,
): string[] => {
  // Primary: Use layoutV4 nested structure (most reliable, always up-to-date from backend)
  // On initial load after refresh, controlList.containerId may not be populated yet
  if (layoutV4?.content) {
    const findInNested = (items: LayoutItemV4[], targetId: string): LayoutItemV4 | null =>
      items.reduce<LayoutItemV4 | null>((found, item) => {
        if (found) return found;
        if (item.id === targetId) return item;
        if (item.content && item.content.length > 0) {
          return findInNested(item.content, targetId);
        }
        return null;
      }, null);

    const containerItem = findInNested(layoutV4.content, containerId);
    if (containerItem?.content) {
      return containerItem.content.map((child) => child.id);
    }
  }

  // Fallback: Use flattened controlList (may be stale on initial load)
  return Object.entries(controlList)
    .filter(([, control]) => control.containerId === containerId)
    .map(([controlId]) => controlId);
};

/**
 * Checks if a control can be duplicated
 * @param options - Options containing control and related data
 * @returns Object indicating if control can be duplicated and reason if not
 */
export const canDuplicateControl = (options: DuplicateControlOptions): CanDuplicateResult => {
  const { control, controlList, layoutV4 } = options;

  if (!control) {
    return {
      canDuplicate: false,
      reason: 'Control not found',
    };
  }

  // Check if control is a single-instance widget
  if (typeof control.type === 'string' && isSingleInstanceWidget(control.type)) {
    return {
      canDuplicate: false,
      reason: 'Single-instance component',
      tooltipMessage: 'Only one instance allowed per screen',
    };
  }

  // Check if this is a container with single-instance children
  if (typeof control.type === 'string' && isContainerType(control.type) && control.id !== null) {
    // Use layoutV4 for finding children (most reliable on initial load)
    const childIds = getContainerChildren(control.id, controlList, layoutV4);
    const hasSingleInstanceChild = childIds.some((childId) => {
      const childControl = controlList[childId];
      return childControl && typeof childControl.type === 'string' && isSingleInstanceWidget(childControl.type);
    });

    if (hasSingleInstanceChild) {
      return {
        canDuplicate: true,
        reason: 'Container with single-instance children',
      };
    }
  }

  return {
    canDuplicate: true,
  };
};

/**
 * Generates a new unique name for a duplicated control
 * If the original name is available (not in use), use it directly.
 * Otherwise, follows the naming convention: "Component_Copy", "Component_Copy_2", etc.
 */
export const generateDuplicateName = (originalName: string, controlList: Record<string, BaseControl>): string => {
  // Get all existing names for uniqueness check
  const existingNames = new Set(
    Object.values(controlList)
      .map((c) => c.name)
      .filter(Boolean),
  );

  // If the original name is not in use, use it directly
  // This handles the case where a component was copied, then the original was renamed,
  // and then the clipboard is pasted - the pasted component should get the original name
  if (!existingNames.has(originalName)) {
    return originalName;
  }

  // Check if the name already ends with "_Copy" or "_Copy_N"
  const copyRegex = /_Copy(_\d+)?$/;
  const match = originalName.match(copyRegex);

  let baseName: string;
  let copyNumber: number;

  if (match) {
    // Extract base name without the copy suffix
    baseName = originalName.replace(copyRegex, '');
    // Extract copy number if it exists
    const existingNumber = match[1] ? parseInt(match[1].replace('_', ''), 10) : 1;
    copyNumber = existingNumber + 1;
  } else {
    baseName = originalName;
    copyNumber = 1;
  }

  // Generate new name
  let newName = copyNumber === 1 ? `${baseName}_Copy` : `${baseName}_Copy_${copyNumber}`;

  // Ensure the name is unique
  while (existingNames.has(newName)) {
    copyNumber += 1;
    newName = `${baseName}_Copy_${copyNumber}`;
  }

  return newName;
};

/**
 * Recursively searches for a layout item in nested V4 structure
 * @param layoutV4 - The V4 layout structure
 * @param itemId - ID of the item to find
 * @returns The layout item if found, undefined otherwise
 */
const findLayoutItemRecursive = (layoutV4: LayoutV4, itemId: string): LayoutItemV4 | undefined => {
  if (!layoutV4 || !layoutV4.content) {
    return undefined;
  }

  const searchInContent = (items: LayoutItemV4[]): LayoutItemV4 | undefined =>
    items.reduce<LayoutItemV4 | undefined>((found, item) => {
      if (found) return found;
      if (item.id === itemId) return item;
      if (item.content && item.content.length > 0) {
        return searchInContent(item.content);
      }
      return undefined;
    }, undefined);

  return searchInContent(layoutV4.content);
};

/**
 * Collects all layout items recursively for overlap detection
 * @param layoutV4 - The V4 layout structure
 * @returns Flat array of all layout items with their position data
 */
const collectAllLayoutItems = (layoutV4: LayoutV4): LayoutItemV4[] => {
  if (!layoutV4 || !layoutV4.content) {
    return [];
  }

  const allItems: LayoutItemV4[] = [];

  const collectFromContent = (items: LayoutItemV4[]) => {
    items.forEach((item: LayoutItemV4) => {
      allItems.push(item);
      // Recursively collect from nested content
      if (item.content && item.content.length > 0) {
        collectFromContent(item.content);
      }
    });
  };

  collectFromContent(layoutV4.content);
  return allItems;
};

/**
 * Finds the next available grid position for a duplicated component
 * Tries to place below the original, then to the right/left
 * @param originalComponent - The original component layout item
 * @param layoutV4 - The V4 layout structure
 * @param gridColumns - Number of grid columns
 * @param containerId - Optional container ID to limit overlap checking to siblings only
 * @param pendingItems - Optional array of pending layout items not yet in layoutV4 (for rapid duplication)
 */
export const findAvailablePlacement = (
  originalComponent: LayoutItemV4,
  layoutV4: LayoutV4,
  gridColumns: number = 12,
  containerId: string | null = null,
  pendingItems: PendingLayoutItem[] = [],
): GridPosition => {
  if (!layoutV4 || !layoutV4.content || !originalComponent) {
    return { x: 0, y: 0 };
  }

  // Extract position from V4 format (desktop object) or fallback to direct properties
  const origX = originalComponent.desktop?.x ?? originalComponent.x ?? 0;
  const origY = originalComponent.desktop?.y ?? originalComponent.y ?? 0;
  const origWidth = originalComponent.desktop?.width ?? originalComponent.width ?? 1;
  const origHeight = originalComponent.desktop?.height ?? originalComponent.height ?? 1;

  // Collect items for overlap checking
  let itemsToCheck: LayoutItemV4[];

  if (containerId) {
    // Component is inside a container - only check siblings in the same container
    const parentContainer = findLayoutItemRecursive(layoutV4, containerId);
    itemsToCheck = parentContainer?.content || [];
  } else {
    // Component is at root level - collect all items
    itemsToCheck = collectAllLayoutItems(layoutV4);
  }

  // Filter pending items to only those in the same container context
  const relevantPendingItems = pendingItems.filter((p) => p.containerId === containerId);

  // Helper function to check if a position overlaps with existing components OR pending items
  const hasOverlap = (testX: number, testY: number, testWidth: number, testHeight: number): boolean => {
    // Check against existing layout items
    const overlapsExisting = itemsToCheck.some((comp: LayoutItemV4) => {
      if (comp.id === originalComponent.id) return false; // Skip self

      // Extract position from V4 format or fallback
      const compX = comp.desktop?.x ?? comp.x ?? 0;
      const compY = comp.desktop?.y ?? comp.y ?? 0;
      const compWidth = comp.desktop?.width ?? comp.width ?? 1;
      const compHeight = comp.desktop?.height ?? comp.height ?? 1;

      // Check if rectangles overlap
      return !(
        testX + testWidth <= compX ||
        testX >= compX + compWidth ||
        testY + testHeight <= compY ||
        testY >= compY + compHeight
      );
    });

    if (overlapsExisting) return true;

    // Check against pending items (duplicates not yet in layoutV4)
    const overlapsPending = relevantPendingItems.some(
      (pending: PendingLayoutItem) =>
        !(
          testX + testWidth <= pending.x ||
          testX >= pending.x + pending.width ||
          testY + testHeight <= pending.y ||
          testY >= pending.y + pending.height
        ),
    );

    return overlapsPending;
  };

  // Try placing below the original component
  const newY = origY + origHeight;
  if (!hasOverlap(origX, newY, origWidth, origHeight)) {
    return { x: origX, y: newY };
  }

  // Try placing to the right
  let newX = origX + origWidth;
  if (newX + origWidth <= gridColumns && !hasOverlap(newX, origY, origWidth, origHeight)) {
    return { x: newX, y: origY };
  }

  // Try placing to the left
  newX = origX - origWidth;
  if (newX >= 0 && !hasOverlap(newX, origY, origWidth, origHeight)) {
    return { x: newX, y: origY };
  }

  // Calculate maxY including pending items
  const existingMaxY =
    itemsToCheck.length > 0
      ? Math.max(
          ...itemsToCheck.map((c: LayoutItemV4) => {
            const y = c.desktop?.y ?? c.y ?? 0;
            const height = c.desktop?.height ?? c.height ?? 1;
            return y + height;
          }),
        )
      : 0;

  const pendingMaxY =
    relevantPendingItems.length > 0 ? Math.max(...relevantPendingItems.map((p) => p.y + p.height)) : 0;

  const maxY = Math.max(existingMaxY, pendingMaxY, origY + origHeight);

  // Scan from the original's Y position downward to keep the duplicate nearby,
  // rather than scanning from y=0 which would place it at the top of the screen.
  for (let y = origY; y <= maxY + 10; y++) {
    for (let x = 0; x <= gridColumns - origWidth; x++) {
      if (!hasOverlap(x, y, origWidth, origHeight)) {
        return { x, y };
      }
    }
  }

  // Fallback: place at the bottom below all content
  return { x: origX, y: maxY + 1 };
};

/**
 * Creates a deep copy of a control with a new ID and modified properties
 * @param original - The original control to duplicate
 * @param controlList - All controls in the screen
 * @param layoutV4 - The V4 layout structure
 * @param gridColumns - Number of grid columns
 * @param actionUpserts - Action sets to copy
 * @param events - Event mappings
 * @param pendingItems - Optional array of pending layout items not yet in layoutV4 (for rapid duplication)
 */
export const createDuplicateControl = (
  original: BaseControl,
  controlList: Record<string, BaseControl>,
  layoutV4: LayoutV4,
  gridColumns: number = 12,
  actionUpserts: Record<string, unknown> = {},
  events: Record<string, string[]> = {},
  pendingItems: PendingLayoutItem[] = [],
): DuplicateControlResult => {
  const newId = Guid.create();
  const newName = generateDuplicateName(original.name || original.caption || 'Component', controlList);

  // Deep copy the control
  const duplicatedControl: BaseControl = {
    ...JSON.parse(JSON.stringify(original)),
    id: newId,
    name: newName,
    // Update caption/label to match the new name
    caption: newName,
    // Clear field mappings (requirement: mapped components should duplicate as unmapped)
    isBound: false,
    boundField: null,
    dataSource: null,
    // Preserve validation rules (they're part of the component's configuration)
    // Only clear validation error state (runtime state, not configuration)
    validationError: null,
  };

  const copiedActionSets: Array<{ id: string; actionSet: unknown }> = [];

  // Map to track old button ID -> new button ID (for action copying)
  const buttonIdMap: Record<string, string> = {};

  // Handle ButtonGroup: regenerate IDs for nested buttons
  const dupControl = duplicatedControl as BaseControl & Record<string, unknown>;
  if (Array.isArray(dupControl.buttons)) {
    dupControl.buttons = dupControl.buttons.map((button: Record<string, unknown>) => {
      const oldButtonId = button.id as string;
      const newButtonId = Guid.create();

      // Track the mapping for action copying
      if (oldButtonId) {
        buttonIdMap[oldButtonId] = newButtonId;
      }

      // Update button name to use new parent name
      let newButtonName = button.name as string;
      if (newButtonName && typeof newButtonName === 'string') {
        // Handle names like "Button_Group~~buttonId" -> "Button_Group_Copy~~newButtonId"
        if (newButtonName.includes('~~')) {
          newButtonName = `${newName}~~${newButtonId}`;
        }
      }

      return {
        ...button,
        id: newButtonId,
        name: newButtonName,
      };
    });
  }

  const NESTABLE_ACTION_IDS = [1, 26, 29, 38, 53];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regenerateNestedActionSetIds = (actionSet: any): void => {
    if (!actionSet || typeof actionSet !== 'object') return;

    if (actionSet.ActionSetId) {
      const regeneratedId = Guid.create();
      Object.assign(actionSet, { ActionSetId: regeneratedId, Key: regeneratedId });
    }

    if (Array.isArray(actionSet.Actions)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      actionSet.Actions.forEach((action: Record<string, any>) => {
        // NOTE: Do NOT regenerate ActionResultId - these are internal references
        // within the action set. Other actions (like Show Message) reference these
        // by their ID. Regenerating breaks the references and causes {0} to appear.
        // This matches the legacy designer behavior which preserves ActionResultIds.

        if (NESTABLE_ACTION_IDS.includes(action.ActionId)) {
          if (action.ActionId === 1) {
            if (action.ActionSetOnTrue) {
              regenerateNestedActionSetIds(action.ActionSetOnTrue);
            }
            if (action.ActionSetOnFalse) {
              regenerateNestedActionSetIds(action.ActionSetOnFalse);
            }
          } else if ([26, 29, 38, 53].includes(action.ActionId)) {
            if (action.LoopActionSet) {
              regenerateNestedActionSetIds(action.LoopActionSet);
            }
          }
        }
      });
    }
  };

  const copyActionSet = (eventId: string): string => {
    const actionSetIds = events[eventId];

    if (!actionSetIds || actionSetIds.length === 0) {
      return Guid.create();
    }

    const originalActionSetId = actionSetIds[0];
    const newEventId = Guid.create();
    const newActionSetId = newEventId;
    const originalActionSet = actionUpserts[originalActionSetId];

    if (originalActionSet) {
      const copiedActionSet = JSON.parse(JSON.stringify(originalActionSet));
      if (typeof copiedActionSet === 'object' && copiedActionSet !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actionSetObj = copiedActionSet as Record<string, any>;

        actionSetObj.ActionSetId = newActionSetId;
        actionSetObj.Key = newActionSetId;

        if (Array.isArray(actionSetObj.Actions)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          actionSetObj.Actions.forEach((action: Record<string, any>) => {
            // NOTE: Do NOT regenerate ActionResultId - these are internal references
            // within the action set. Other actions (like Show Message) reference these
            // by their ID. Regenerating breaks the references and causes {0} to appear.
            // This matches the legacy designer behavior which preserves ActionResultIds.

            if (NESTABLE_ACTION_IDS.includes(action.ActionId)) {
              if (action.ActionId === 1) {
                if (action.ActionSetOnTrue) {
                  regenerateNestedActionSetIds(action.ActionSetOnTrue);
                }
                if (action.ActionSetOnFalse) {
                  regenerateNestedActionSetIds(action.ActionSetOnFalse);
                }
              } else if ([26, 29, 38, 53].includes(action.ActionId)) {
                if (action.LoopActionSet) {
                  regenerateNestedActionSetIds(action.LoopActionSet);
                }
              }
            }
          });
        }
      }
      copiedActionSets.push({ id: newActionSetId, actionSet: copiedActionSet });
    }

    return newEventId;
  };

  // Generic: copy all root-level on* event properties that contain action set GUIDs
  const origControl = original as BaseControl & Record<string, unknown>;
  Object.keys(origControl).forEach((key) => {
    if (isEventPropertyWithGuid(key, origControl[key])) {
      dupControl[key] = copyActionSet(origControl[key]);
    }
  });

  // Handle ButtonGroup/Calendar: copy all on* action properties for each nested button
  if (Array.isArray(origControl.buttons) && Array.isArray(dupControl.buttons)) {
    origControl.buttons.forEach((origButton: Record<string, unknown>, index: number) => {
      const dupButton = dupControl.buttons[index];
      if (!dupButton) return;
      Object.keys(origButton).forEach((key) => {
        if (isEventPropertyWithGuid(key, origButton[key])) {
          dupButton[key] = copyActionSet(origButton[key] as string);
        }
      });
    });
  }

  // Handle Grid/EDT columns: copy on* action properties on each column
  // and on nested controls within columns (Button, Dropdown, Card)
  const copyColumnActionSets = (
    origColumns: Array<Record<string, unknown>>,
    dupColumns: Array<Record<string, unknown>>,
  ) => {
    for (let i = 0; i < origColumns.length && i < dupColumns.length; i++) {
      const origCol = origColumns[i];
      const dupCol = dupColumns[i];

      // Column-level on* properties (e.g., onChangeEvent)
      Object.keys(origCol).forEach((key) => {
        if (isEventPropertyWithGuid(key, origCol[key])) {
          dupCol[key] = copyActionSet(origCol[key] as string);
        }
      });

      // Nested control within the column (e.g., Button, Dropdown, Card)
      const origNested = origCol.control as Record<string, unknown> | undefined;
      const dupNested = dupCol.control as Record<string, unknown> | undefined;
      if (origNested && dupNested && typeof origNested === 'object') {
        Object.keys(origNested).forEach((key) => {
          if (isEventPropertyWithGuid(key, origNested[key])) {
            dupNested[key] = copyActionSet(origNested[key] as string);
          }
        });
      }
    }
  };

  if (Array.isArray(origControl.columns) && Array.isArray(dupControl.columns)) {
    copyColumnActionSets(origControl.columns, dupControl.columns);
  }

  const originalLayoutItem = findLayoutItemRecursive(layoutV4, original.id);

  if (!originalLayoutItem) {
    return {
      control: duplicatedControl,
      layoutItem: {
        id: newId,
        containerId: original.containerId || null,
        desktop: {
          x: 0,
          y: 0,
          width: 4,
          height: 2,
          currentState: CurrentState.REGULAR,
        },
        content: [],
      },
      copiedActionSets: copiedActionSets.length > 0 ? copiedActionSets : undefined,
    };
  }

  const newPosition = findAvailablePlacement(
    originalLayoutItem,
    layoutV4,
    gridColumns,
    original.containerId || null,
    pendingItems,
  );

  // Create layout item for the duplicate using V4 format
  const duplicatedLayoutItem = {
    id: newId,
    containerId: original.containerId || null,
    desktop: {
      x: newPosition.x,
      y: newPosition.y,
      // Extract width/height from original V4 format or fallback
      width: originalLayoutItem.desktop?.width ?? originalLayoutItem.width ?? 4,
      height: originalLayoutItem.desktop?.height ?? originalLayoutItem.height ?? 2,
      currentState: originalLayoutItem.desktop?.currentState ?? 0,
    },
    // Preserve tablet override if it exists
    ...(originalLayoutItem.tabletOverride && {
      tabletOverride: {
        ...originalLayoutItem.tabletOverride,
        // Keep same relative position for tablet
        x: originalLayoutItem.tabletOverride.x,
        y: originalLayoutItem.tabletOverride.y,
      },
    }),
    // Preserve mobile override if it exists
    ...(originalLayoutItem.mobileOverride && {
      mobileOverride: {
        ...originalLayoutItem.mobileOverride,
        // Keep same relative position for mobile
        x: originalLayoutItem.mobileOverride.x,
        y: originalLayoutItem.mobileOverride.y,
      },
    }),
    // Clear nested content array (children are added separately)
    content: [],
  };

  return {
    control: duplicatedControl,
    layoutItem: duplicatedLayoutItem,
    copiedActionSets: copiedActionSets.length > 0 ? copiedActionSets : undefined,
  };
};
