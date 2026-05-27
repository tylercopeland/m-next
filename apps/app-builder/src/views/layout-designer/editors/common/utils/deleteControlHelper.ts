import type { BaseControl } from '@m-next/runtime-interface';
import { WIDGETS } from '@m-next/runtime-interface';
import { hasControlReferences, getControlEvents, containerOrChildrenHaveEvents, type ContainerChildReference, type ActionSet } from '../components/control-references-utils';

// Additional interfaces for better typing
interface ControlWithContainerId extends BaseControl {
    containerId?: string;
    buttons?: BaseControl[];
}

// Re-using the proper screen data structure interface (compatible with hasControlReferences)
interface ScreenDataStructure {
    [key: string]: unknown;
}

interface LayoutComponentStructure {
    id: string;
    [key: string]: unknown;
}

interface LayoutV4Structure {
    content?: LayoutComponentStructure[];
    [key: string]: unknown;
}



export interface DeleteControlOptions {
    control: BaseControl;
    controlList: Record<string, BaseControl>;
     
    screenData: ScreenDataStructure;
     
    screenProperties: Record<string, unknown>;
     
    layoutV4?: LayoutV4Structure; // Optional for backward compatibility
}

export interface CanDeleteResult {
    canDelete: boolean;
    reason?: string;
    referencedChildren?: ContainerChildReference[]; // For containers, list of children with references
}

/**
 * Gets all child control IDs for a container using the flattened structure
 * Instead of traversing the layoutV4 tree, we look at the containerId property on controls
 */
 
const getContainerChildrenFlattened = (containerId: string, controlList: Record<string, ControlWithContainerId>): string[] => {
    const children: string[] = [];

    // Iterate through all controls and find those with matching containerId
    for (const [controlId, control] of Object.entries(controlList)) {
        if (control.containerId === containerId) {
            children.push(controlId);
        }
    }

    return children;
};

/**
 * Checks if a container is a valid container type
 */
const isContainerType = (controlType: string): boolean => controlType === WIDGETS.LAYOUT_CONTAINER || controlType === WIDGETS.SECTION;

/**
 * Finds a layout item by ID in a nested layoutV4 content tree.
 */
const findInNested = (items: LayoutComponentStructure[], targetId: string): LayoutComponentStructure | null => {
    for (const item of items) {
        if (item.id === targetId) return item;
        const children = item.content as LayoutComponentStructure[] | undefined;
        if (children && children.length > 0) {
            const found = findInNested(children, targetId);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Recursively collects all descendant IDs from a layoutV4 content subtree.
 */
const collectAllDescendants = (items: LayoutComponentStructure[], idsToDelete: string[], idSet: Set<string>): void => {
    items.forEach((child) => {
        if (child.id && !idSet.has(child.id)) {
            idsToDelete.push(child.id);
            idSet.add(child.id);
        }
        const children = child.content as LayoutComponentStructure[] | undefined;
        if (children?.length) {
            collectAllDescendants(children, idsToDelete, idSet);
        }
    });
};

/**
 * Collects all control IDs that should be deleted when a given control is removed.
 * Handles:
 * - Container/Section children (recursive layoutV4 tree walk + flat containerId fallback)
 * - ButtonGroup/Calendar sub-controls (buttons array) for any control in the delete set
 *
 * @param controlId - The ID of the control being deleted
 * @param controlList - All controls on the screen
 * @param layoutV4 - The V4 layout structure
 * @returns Array of all control IDs to delete
 */
export const collectIdsToDelete = (
    controlId: string,
    controlList: Record<string, BaseControl>,
    layoutV4: LayoutV4Structure,
): string[] => {
    const controlToDelete = controlList[controlId] as ControlWithContainerId | undefined;
    const idsToDelete = [controlId];
    const idSet = new Set<string>([controlId]);

    // Container children: recursive layout walk + flat containerId fallback
    if (
        controlToDelete &&
        isContainerType(controlToDelete.type as string)
    ) {
        const content = layoutV4.content as LayoutComponentStructure[] | undefined;
        if (content) {
            const containerLayoutItem = findInNested(content, controlId);
            const containerChildren = containerLayoutItem?.content as LayoutComponentStructure[] | undefined;
            if (containerChildren) {
                collectAllDescendants(containerChildren, idsToDelete, idSet);
            }
        }

        // Also catch orphaned controls via flat containerId references
        Object.values(controlList).forEach((control) => {
            const c = control as ControlWithContainerId;
            if (c.containerId === controlId && !idSet.has(c.id)) {
                idsToDelete.push(c.id);
                idSet.add(c.id);
            }
        });
    }

    // BGR/Calendar buttons cleanup for ALL collected IDs.
    // Use index-based loop so newly added items are also processed.
    for (let i = 0; i < idsToDelete.length; i++) {
        const ctrl = controlList[idsToDelete[i]] as ControlWithContainerId | undefined;
        if (
            ctrl &&
            (ctrl.type === WIDGETS.BUTTONGROUP || ctrl.type === WIDGETS.CALENDAR) &&
            Array.isArray(ctrl.buttons)
        ) {
            ctrl.buttons.forEach((btn) => {
                if (btn.id && !idSet.has(btn.id)) {
                    idsToDelete.push(btn.id);
                    idSet.add(btn.id);
                }
            });
        }
    }

    return idsToDelete;
};

/**
 * Removes controls from a layoutV4 content tree by ID list (recursive).
 *
 * @param layoutV4 - The V4 layout structure
 * @param idsToRemove - Array of control IDs to remove
 * @returns Updated layout structure with controls removed
 */
export const removeControlsFromLayout = (
    layoutV4: LayoutV4Structure,
    idsToRemove: string[],
): LayoutV4Structure => {
    if (!layoutV4?.content) return layoutV4;

    const removeFromContent = (items: LayoutComponentStructure[]): LayoutComponentStructure[] =>
        items
            .filter((item) => !idsToRemove.includes(item.id))
            .map((item) => {
                const children = item.content as LayoutComponentStructure[] | undefined;
                return children?.length
                    ? { ...item, content: removeFromContent(children) }
                    : item;
            });

    return {
        ...layoutV4,
        content: removeFromContent(layoutV4.content as LayoutComponentStructure[]),
    };
};

/**
 * Checks if a control can be safely deleted
 * @param options - Options containing control and related data
 * @returns Object indicating if control can be deleted and reason if not
 */
export const canDeleteControl = (options: DeleteControlOptions): CanDeleteResult => {
    const { control, controlList, screenData, screenProperties } = options;

    if (!control) {
        return {
            canDelete: false,
            reason: 'Control not found'
        };
    }

    // Check if control itself has references
    const hasReferences = hasControlReferences(
        control,
        controlList as Record<string, BaseControl & { [key: string]: unknown }>,
        screenData,
        screenProperties
    );

    if (hasReferences) {
        return {
            canDelete: false,
            reason: 'Control has references'
        };
    }

    // If this is a container, check if any children have references
    if (typeof control.type === 'string' && isContainerType(control.type) && control.id !== null) {
        // Use flattened structure to get children
        const childIds = getContainerChildrenFlattened(control.id, controlList as Record<string, ControlWithContainerId>);
        const referencedChildren: ContainerChildReference[] = [];

        // Check each child for references
        for (const childId of childIds) {
            const childControl = controlList[childId];
            if (childControl && hasControlReferences(childControl, controlList as Record<string, BaseControl & { [key: string]: unknown }>, screenData, screenProperties)) {
                referencedChildren.push({
                    controlId: childId,
                    controlName: childControl.name || childControl.caption || 'Unnamed'
                });
            }
        }

        if (referencedChildren.length > 0) {
            return {
                canDelete: false,
                reason: 'Container has children with references',
                referencedChildren
            };
        }
    }

    return {
        canDelete: true
    };
};

/**
 * Deletes a control from the layout
 * This function should be extended based on your specific implementation
 * @param controlId - ID of the control to delete
 * @param layoutV4 - V4 layout structure
 * @returns Updated layout structure
 */
 
export const deleteControlFromLayout = (controlId: string, layoutV4: LayoutV4Structure): LayoutV4Structure => {
    if (!layoutV4 || !layoutV4.content) {
        return layoutV4;
    }

    // Remove the control from the content array
    const updatedContent = layoutV4.content.filter(

        (component: LayoutComponentStructure) => component.id !== controlId
    );

    return {
        ...layoutV4,
        content: updatedContent
    };
};

/**
 * Delete action types returned by getDeleteAction
 */
export type DeleteActionType =
    | 'delete'           // Delete immediately (no events/references)
    | 'showConfirmDialog' // Show confirmation dialog (has events)
    | 'showBlockedDialog' // Show blocked dialog (container has children with references)
    | 'blocked';          // Cannot delete (control itself has references)

export interface DeleteActionResult {
    action: DeleteActionType;
    isContainer: boolean;
    referencedChildren: ContainerChildReference[];
    blockReason?: string;
}

export interface GetDeleteActionOptions {
    control: BaseControl;
    controlList: Record<string, BaseControl>;
    screenData: ScreenDataStructure;
    screenProperties: Record<string, unknown>;
    layoutV4?: LayoutV4Structure;
    actionUpserts?: Record<string, unknown>;
}

/**
 * Determines what action to take when attempting to delete a control.
 * This centralizes the delete decision logic for use by both keyboard shortcuts and UI buttons.
 *
 * @param options - Options containing control and related data
 * @returns Object indicating what action to take and relevant data
 */
export const getDeleteAction = (options: GetDeleteActionOptions): DeleteActionResult => {
    const { control, controlList, screenData, screenProperties, layoutV4, actionUpserts } = options;

    if (!control) {
        return {
            action: 'blocked',
            isContainer: false,
            referencedChildren: [],
            blockReason: 'Control not found'
        };
    }

    // Check if this is a container type
    const isContainer = typeof control.type === 'string' && isContainerType(control.type);

    // Check if control can be deleted (blocks controls with references)
    const { canDelete, reason, referencedChildren } = canDeleteControl({
        control,
        controlList,
        screenData,
        screenProperties,
        layoutV4
    });

    // If control itself has references, block deletion
    if (!canDelete && reason === 'Control has references') {
        return {
            action: 'blocked',
            isContainer,
            referencedChildren: [],
            blockReason: "Component cannot be deleted as it is referenced by other controls. Review control references first."
        };
    }

    // If container has children with references, show blocked dialog
    if (!canDelete && reason === 'Container has children with references' && referencedChildren?.length) {
        return {
            action: 'showBlockedDialog',
            isContainer: true,
            referencedChildren
        };
    }

    // Check if control has events/actions attached
    const controlEvents = getControlEvents(control as BaseControl & { [key: string]: unknown }, screenData, actionUpserts as Record<string, ActionSet> | undefined);

    // Check if container or children have events
    let hasContainerOrChildrenEvents = false;
    if (isContainer && layoutV4) {
        hasContainerOrChildrenEvents = containerOrChildrenHaveEvents(
            control as BaseControl & { [key: string]: unknown },
            controlList as Record<string, BaseControl & { [key: string]: unknown }>,
            screenData,
            layoutV4 as Record<string, unknown>,
            actionUpserts as Record<string, ActionSet> | undefined
        );
    }

    // Show confirmation dialog if control or container/children have events
    if ((isContainer && hasContainerOrChildrenEvents) || (controlEvents.hasEvents && controlEvents.eventCount > 0)) {
        return {
            action: 'showConfirmDialog',
            isContainer,
            referencedChildren: []
        };
    }

    // No events or references - can delete immediately
    return {
        action: 'delete',
        isContainer,
        referencedChildren: []
    };
};
