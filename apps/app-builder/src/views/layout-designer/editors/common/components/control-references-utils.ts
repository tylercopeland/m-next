import { BaseControl } from '@m-next/runtime-interface';

// Control types that should be ignored when checking for references
const IGNORED_CONTROL_TYPES = ['GRD', 'ICO'];

// Screen event types that are available on the Screen widget
const SCREEN_EVENT_TYPES = [
  { name: 'Load', func: 'onLoad' },
  { name: 'Focus', func: 'onFocus' },
  { name: 'Active Record Change', func: 'onActiveRecordChange' },
];

// Control event types that are available on controls
const CONTROL_EVENT_TYPES = [
  { name: 'Click', label: 'Click', func: 'onClick' },
  { name: 'Change', label: 'Change', func: 'onChange' },
  { name: 'Add Event', label: 'Add calendar', func: 'onAddEvent' },
  { name: 'Drag Move Event', label: 'Drag/Move', func: 'onDragMoveEvent' },
  { name: 'Selection', label: 'Selection', func: 'onSelectEvent' },
  { name: 'Focus', label: 'Focus', func: 'onFocus' },
  { name: 'Lose Focus', label: 'Lose Focus', func: 'onBlur' },
  { name: 'Row Click', label: 'Row Click', func: 'onActiveRowChange' },
  { name: 'Accept', label: 'Accept', func: 'onAccept' },
  { name: 'Cancel', label: 'Cancel', func: 'onCancel' },
  { name: 'Custom Row Click', label: 'Action item click', func: 'onCustomRowClick' },
];

interface ColumnWithEvents {
  [key: string]: unknown;
  header?: string;
  field?: string;
  onClick?: string;
  onChangeEvent?: string;
  defaultValue?: {
    ValueType?: number;
    valueType?: number;
    Value?: string;
    value?: string;
  };
  control?: {
    model?: {
      viewFilter?: {
        expression: unknown;
        filterName?: string;
      };
    };
  };
}

interface FilterDefinition {
  expression: unknown;
  filterName?: string;
}

interface ViewDefinition {
  id: string;
  name?: string;
  filtering: unknown;
}

export interface Reference {
  controlName: string;
  event: string;
  eventLabel: string;
  control?: { id: string; type: string | null };
  columnName?: string;
  selectedView?: string;
}

export interface Action {
  action: string;
  maml: string;
}
export interface ActionSet {
  ActionSetId: string;
  Actions: Action[];
}

export interface ActionSets {
  [actionSetId: string]: ActionSet;
}

export interface ControlReferencesResult {
  events: Reference[];
  filters: Reference[];
  defaultValues: Reference[];
}

export interface CalendarControl extends BaseControl {
  buttons: BaseControl[];
}

// Define interfaces for better typing
interface ControlWithDynamicProps extends BaseControl {
  [key: string]: unknown;
  buttons?: ControlWithDynamicProps[];
  model?: {
    columns?: ColumnWithEvents[];
    viewFilter?: {
      expression: unknown;
      filterName?: string;
    };
  };
  columns?: ColumnWithEvents[];
  filterDef?: FilterDefinition[];
  viewList?: ViewDefinition[];
}

interface ScreenDataStructure {
  Data?: {
    screen?: {
      actionSets?: ActionSets;
      events?: Record<string, string[]>;
    };
  };
}

interface ActionReference {
  Type?: string;
  ActionSetId?: string;
  [key: string]: unknown;
}

// Recursively searches through action objects to find references to a control ID or name
// Note: Some actions (Show/Hide Controls, Set Focus, Enable/Disable, Set View Filter, etc.)
// store control references by name, not ID. We need to search for both.

const findIdReference = (
  controlId: string,
  searchItem: unknown,
  array: unknown[],
  controlActionSetId: string[],
  controlName?: string,
): unknown[] => {
  if (typeof searchItem === 'function') return array;

  if (Array.isArray(searchItem)) {
    if (searchItem.indexOf(controlId) > -1 || (controlName && searchItem.indexOf(controlName) > -1)) {
      array.push(searchItem);
    } else {
      for (let i = 0; i < searchItem.length; i++) {
        findIdReference(controlId, searchItem[i], array, controlActionSetId, controlName);
      }
    }
  } else if (searchItem && typeof searchItem === 'object') {
    const actionRef = searchItem as ActionReference;
    if (actionRef.Type === 'Call Routine') {
      if (actionRef.ActionSetId && controlActionSetId.includes(actionRef.ActionSetId)) {
        array.push(searchItem);
      }
    }

    const searchObject = searchItem as Record<string, unknown>;
    for (const prop in searchObject) {
      if (searchObject[prop] instanceof Object || Array.isArray(searchObject[prop])) {
        findIdReference(controlId, searchObject[prop], array, controlActionSetId, controlName);
      }
      if (searchObject[prop] === controlId || (controlName && searchObject[prop] === controlName)) {
        array.push(searchItem);
      }
    }
  }
  return array;
};

const checkForCalendarButtonReferences = (
  controlList: Record<string, ControlWithDynamicProps>,
  existingControl: BaseControl,
): CalendarControl | null => {
  for (const control of Object.values(controlList)) {
    if (control.type === 'CAL' && control.buttons) {
      const calendarControl = control as CalendarControl;
      const buttonControl = calendarControl.buttons.find((button: BaseControl) => button.id === existingControl.id);

      if (buttonControl) {
        return calendarControl;
      }
    }
  }
  return null;
};

/**
 * Main function to find all references to a control
 */
export const findControlReferences = (
  control: ControlWithDynamicProps,

  controlList: Record<string, ControlWithDynamicProps>,

  screenData: ScreenDataStructure,

  screenProperties: Record<string, unknown>,
): ControlReferencesResult => {
  if (!control) {
    return { events: [], filters: [], defaultValues: [] };
  }

  const actionSets: ActionSets = screenData?.Data?.screen?.actionSets || {};
  const screenEventsMap: Record<string, string[]> = screenData?.Data?.screen?.events || {};

  const updatedEvents: Reference[] = [];
  const updatedFilters: Reference[] = [];
  const updatedDefaultValues: Reference[] = [];
  const controlActionSetIds: string[] = [];
  const controlEventIds: string[] = [];

  CONTROL_EVENT_TYPES.forEach((event: { name: string; label: string; func: string }) => {
    if (control[event.func]) {
      controlEventIds.push(control[event.func] as string);
    }
    if (control.type === 'BGR') {
      control.buttons?.forEach((btn: ControlWithDynamicProps) => {
        if (btn[event.func]) {
          controlEventIds.push(btn[event.func] as string);
        }
      });
    }
    if (control.type === 'CHT') {
      control.model?.columns?.forEach((column: ColumnWithEvents) => {
        if (column[event.func]) {
          controlEventIds.push(column[event.func] as string);
        }
      });
    }
    if (control.type === 'EDT' && control.model?.columns) {
      control.model?.columns?.forEach((column: ColumnWithEvents) => {
        if (column[event.func]) {
          controlEventIds.push(column[event.func] as string);
        }
      });
    }
  });

  // loop through controlEventIds and add the actionSetId to controlActionSetIds
  for (const eventId of controlEventIds) {
    if (screenEventsMap[eventId] && screenEventsMap[eventId]!.length > 0) {
      const actionSetId = screenEventsMap[eventId]![0]!;
      if (actionSets[actionSetId]) {
        controlActionSetIds.push(actionSetId);
      }
    }
  }

  // Loop through all controls on the screen

  Object.values(controlList).forEach((existingControl: ControlWithDynamicProps) => {
    // Skip if this is the same control we're checking
    if (existingControl.id === control.id) return;

    if (IGNORED_CONTROL_TYPES.includes(existingControl.type || '')) return;

    // Check Button Group controls
    if (existingControl.type === 'BGR' && existingControl.buttons) {
      existingControl.buttons.forEach((btn: ControlWithDynamicProps) => {
        if (btn.onClick && screenEventsMap[btn.onClick] && screenEventsMap[btn.onClick]!.length > 0) {
          const actionSetId = screenEventsMap[btn.onClick]![0]!;
          if (actionSets[actionSetId]) {
            const references = findIdReference(control.id, actionSets[actionSetId]!.Actions, [], controlActionSetIds, control.name);
            if (references.length > 0) {
              updatedEvents.push({
                controlName: existingControl.name || existingControl.caption || 'Unnamed',
                event: `${btn.caption || 'Button'} Click`,
                eventLabel: `"${btn.caption || 'Button'}" Click`,
                control: { id: existingControl.id, type: existingControl.type },
              });
            }
          }
        }
      });
    }

    // Check Chart controls
    if (existingControl.type === 'CHT' && existingControl.model?.columns) {
      existingControl.model?.columns?.forEach((column: ColumnWithEvents) => {
        if (column.onClick && screenEventsMap[column.onClick] && screenEventsMap[column.onClick].length > 0) {
          const actionSetId = screenEventsMap[column.onClick][0];
          if (actionSets[actionSetId]) {
            const references = findIdReference(control.id, actionSets[actionSetId]!.Actions, [], controlActionSetIds, control.name);
            if (references.length > 0) {
              updatedEvents.push({
                controlName: existingControl.name || existingControl.caption || 'Unnamed',
                event: 'Point click',
                eventLabel: 'Point click',
                control: { id: column.field || '', type: 'column' },
              });
            }
          }
        }
      });
    }

    // Check Edit Grid controls
    if (existingControl.type === 'EDT' && existingControl.columns) {
      existingControl.columns.forEach((column: ColumnWithEvents) => {
        // Check for default value references
        if (
          (column.defaultValue?.ValueType === 5 || column.defaultValue?.valueType === 5) &&
          (column.defaultValue?.Value === control.id || column.defaultValue?.value === control.id)
        ) {
          updatedDefaultValues.push({
            controlName: existingControl.name || existingControl.caption || 'Unnamed',
            event: column.header || 'Column',
            eventLabel: `"${column.header}"` || 'Column',
            columnName: column.field || 'Column',
            control: { id: existingControl.id, type: existingControl.type },
          });
        }

        // Check for onChange events
        if (
          column.onChangeEvent &&
          screenEventsMap[column.onChangeEvent] &&
          screenEventsMap[column.onChangeEvent]!.length > 0
        ) {
          const actionSetId = screenEventsMap[column.onChangeEvent]![0]!;
          if (actionSets[actionSetId]) {
            const references = findIdReference(control.id, actionSets[actionSetId]!.Actions, [], controlActionSetIds, control.name);
            if (references.length > 0) {
              updatedEvents.push({
                controlName: existingControl.name || existingControl.caption || 'Unnamed',
                event: `${column.header || 'Column'} Change`,
                eventLabel: `"${column.header || 'Column'}" Change`,
                control: { id: existingControl.id, type: existingControl.type },
              });
            }
          }
        }

        // Check for column filter definitions
        if (column.control?.model?.viewFilter) {
          const { viewFilter } = column.control.model;
          const expression = JSON.stringify(viewFilter.expression);
          const matches = expression.match(new RegExp(control.id, 'g'));
          const occurrences = matches ? matches.length : 0;

          if (occurrences > 0) {
            const eventName = viewFilter.filterName || 'Column Filter';

            updatedFilters.push({
              controlName: existingControl.name || existingControl.caption || 'Unnamed',
              event: `${column.header || column.field || 'Column'} - ${eventName}`,
              eventLabel: `"${column.header || column.field || 'Column'}" - ${eventName}`,
              columnName: column.field || 'Column',
              control: { id: existingControl.id, type: existingControl.type },
            });
          }
        }
      });
    }

    // Check standard control events
    CONTROL_EVENT_TYPES.forEach((event: { name: string; label: string; func: string }) => {
      const eventId = existingControl[event.func] as string;
      if (eventId && screenEventsMap[eventId] && screenEventsMap[eventId]!.length > 0) {
        const actionSetId = screenEventsMap[eventId]![0]!;
        if (actionSets[actionSetId]) {
          const references = findIdReference(control.id, actionSets[actionSetId]!.Actions, [], controlActionSetIds, control.name);
          if (references.length > 0) {
            // Check for calendar button references
            if (existingControl.type === 'BGI') {
              const calendarControl = checkForCalendarButtonReferences(controlList, existingControl as BaseControl);
              if (calendarControl) {
                const buttonControl = calendarControl?.buttons.find(
                  (button: BaseControl) => button.id === existingControl.id,
                );
                updatedEvents.push({
                  controlName: `${calendarControl.caption} - ${buttonControl?.caption}` || 'Unnamed',
                  event: `${buttonControl?.caption} ${event.name}`,
                  eventLabel: `"${buttonControl?.caption}" ${event.label}`,
                  control: { id: calendarControl.id, type: calendarControl.type },
                });
              }
            } else {
              updatedEvents.push({
                controlName: existingControl.name || existingControl.caption || 'Unnamed',
                event: event.name,
                eventLabel: event.label,
                control: { id: existingControl.id, type: existingControl.type },
              });
            }
          }
        }
      }
    });

    // Check filter definitions
    if (existingControl.filterDef && Array.isArray(existingControl.filterDef)) {
      existingControl.filterDef.forEach((filterDef: FilterDefinition) => {
        const expression = JSON.stringify(filterDef.expression);
        const matches = expression.match(new RegExp(control.id, 'g'));
        const occurrences = matches ? matches.length : 0;

        if (occurrences > 0) {
          const eventName =
            existingControl.type === 'GRD' || existingControl.type === 'EDT'
              ? filterDef.filterName || 'Filter'
              : 'Default Filter';

          updatedFilters.push({
            controlName: existingControl.name || existingControl.caption || 'Unnamed',
            event: eventName,
            eventLabel: eventName,
            control: { id: existingControl.id, type: existingControl.type },
          });
        }
      });
    }

    // Check view list filters
    if (existingControl.viewList && Array.isArray(existingControl.viewList)) {
      existingControl.viewList.forEach((viewDef: ViewDefinition) => {
        const expression = JSON.stringify(viewDef.filtering);
        const matches = expression.match(new RegExp(control.id, 'g'));
        const occurrences = matches ? matches.length : 0;

        if (occurrences > 0) {
          const eventName =
            existingControl.type === 'GRD' || existingControl.type === 'EDT'
              ? viewDef.name || 'View Filter'
              : 'Default Filter';

          updatedFilters.push({
            controlName: existingControl.name || existingControl.caption || 'Unnamed',
            event: eventName,
            eventLabel: eventName,
            selectedView: viewDef.id,
            control: { id: existingControl.id, type: existingControl.type },
          });
        }
      });
    }

    // Check default values - cast to access custom defaultValue properties
    const existingControlWithDefaultValue = existingControl as ControlWithDynamicProps & {
      defaultValue?: {
        ValueType?: number;
        valueType?: number;
        Value?: string;
        value?: string;
      };
    };

    if (
      (existingControlWithDefaultValue.defaultValue?.ValueType === 5 ||
        existingControlWithDefaultValue.defaultValue?.valueType === 5) &&
      (existingControlWithDefaultValue.defaultValue?.Value === control.id ||
        existingControlWithDefaultValue.defaultValue?.value === control.id)
    ) {
      updatedDefaultValues.push({
        controlName: existingControl.name || existingControl.caption || 'Unnamed',
        event: 'Default Value',
        eventLabel: 'Default Value',
        control: { id: existingControl.id, type: existingControl.type },
      });
    }
  });

  // Check for screen-level references
  // Loop through events available on Screen widget
  SCREEN_EVENT_TYPES.forEach((screenEventType) => {
    const eventId = screenProperties?.[screenEventType.func] as string;

    const screenEvent = screenEventsMap[eventId];
    if (screenEvent) {
      const idRefResult = findIdReference(control.id, actionSets[screenEvent[0]].Actions, [], controlActionSetIds, control.name);
      if (idRefResult.length > 0) {
        updatedEvents.push({
          controlName: 'Screen',
          event: screenEventType.name,
          eventLabel: screenEventType.name,
        });
      }
    }
  });

  // Sort all arrays alphabetically by controlName
  const sortByControlName = (a: Reference, b: Reference) => {
    const nameA = a.controlName.toLowerCase();
    const nameB = b.controlName.toLowerCase();
    return nameA.localeCompare(nameB);
  };

  return {
    events: updatedEvents.sort(sortByControlName),
    filters: updatedFilters.sort(sortByControlName),
    defaultValues: updatedDefaultValues.sort(sortByControlName),
  };
};

/**
 * Utility function to check if a control has any references
 */
export const hasControlReferences = (
  control: BaseControl | CalendarControl,

  controlList: Record<string, ControlWithDynamicProps>,

  screenData: ScreenDataStructure,

  screenProperties: Record<string, unknown>,
): boolean => {
  if (!control) {
    return false;
  }

  const result = findControlReferences(control as ControlWithDynamicProps, controlList, screenData, screenProperties);
  return result.events.length > 0 || result.filters.length > 0 || result.defaultValues.length > 0;
};

export interface ControlEventsResult {
  hasEvents: boolean;
  eventCount: number;
  eventTypes: string[];
}

/**
 * Checks if a control has any events/actions attached to it (not references TO it, but actions ON it)
 * @param control - The control to check
 * @param screenData - The screen data containing events and actionSets
 * @returns Object with event information
 */
export const getControlEvents = (
  control: ControlWithDynamicProps,

  screenData: ScreenDataStructure,

  unsavedActionSets?: Record<string, ActionSet>,
): ControlEventsResult => {
  if (!control || !screenData) {
    return { hasEvents: false, eventCount: 0, eventTypes: [] };
  }

  const actionSets: ActionSets = screenData?.Data?.screen?.actionSets || {};
  const screenEventsMap: Record<string, string[]> = screenData?.Data?.screen?.events || {};
  const eventTypes: string[] = [];

  // Helper function to check if an event ID has actual actions
  const hasActionsForEvent = (eventId: string): boolean => {
    if (!eventId) return false;
    const eventActionSetIds = screenEventsMap[eventId];

    if (eventActionSetIds && eventActionSetIds.length > 0) {
      // Check if any of the action sets have actual actions
      return eventActionSetIds.some((actionSetId) => {
        const actionSet = actionSets[actionSetId];
        return actionSet && actionSet.Actions && actionSet.Actions.length > 0;
      });
    }

    if (unsavedActionSets?.[eventId]) {
      const actionSet = unsavedActionSets[eventId] as ActionSet;
      return actionSet && actionSet.Actions && actionSet.Actions.length > 0;
    }
    
    if (eventId && !screenEventsMap[eventId]) {
      return true;
    }
    return false;
  };

  // Check standard events on the control
  CONTROL_EVENT_TYPES.forEach((event) => {
    if (control[event.func] && hasActionsForEvent(control[event.func] as string)) {
      eventTypes.push(event.label);
    }
  });

  // Check Button Group buttons
  if (control.type === 'BGR' && control.buttons) {
    control.buttons?.forEach((btn: ControlWithDynamicProps, index: number) => {
      CONTROL_EVENT_TYPES.forEach((event) => {
        if (btn[event.func] && hasActionsForEvent(btn[event.func] as string)) {
          const buttonCaption = btn.caption || `Button ${index + 1}`;
          eventTypes.push(`${buttonCaption} ${event.label}`);
        }
      });
    });
  }

  // Check Chart columns
  if (control.type === 'CHT' && control.model?.columns) {
    control.model?.columns?.forEach((column: ColumnWithEvents, index: number) => {
      CONTROL_EVENT_TYPES.forEach((event) => {
        if (column[event.func] && hasActionsForEvent(column[event.func] as string)) {
          eventTypes.push(`Column ${index + 1} ${event.label}`);
        }
      });
    });
  }

  // Check Edit Grid columns
  if (control.type === 'EDT' && control.model?.columns) {
    control.model?.columns?.forEach((column: ColumnWithEvents) => {
      if (column.onChangeEvent && hasActionsForEvent(column.onChangeEvent)) {
        eventTypes.push(`${column.header || 'Column'} Change`);
      }
    });
  }

  return {
    hasEvents: eventTypes.length > 0,
    eventCount: eventTypes.length,
    eventTypes,
  };
};

/**
 * Gets all child control IDs using the flattened structure (containerId property)
 * This is more reliable than traversing the layout tree
 */

const getContainerChildrenFlat = (
  containerId: string,
  controlList: Record<string, ControlWithDynamicProps>,
): string[] => {
  const children: string[] = [];

  // Iterate through all controls and find those with matching containerId
  for (const [controlId, control] of Object.entries(controlList)) {
    if (control.containerId === containerId) {
      children.push(controlId);
      // Recursively get children of child containers
      if (control.type === 'L-CON' || control.type === 'SEC') {
        const nestedChildren = getContainerChildrenFlat(controlId, controlList);
        children.push(...nestedChildren);
      }
    }
  }

  return children;
};

/**
 * Gets all child control IDs from a container recursively
 * Falls back to layout traversal if containerId approach doesn't work
 */

const getContainerChildren = (
  container: ControlWithDynamicProps,
  layoutV4: Record<string, unknown>,
  controlList?: Record<string, ControlWithDynamicProps>,
): string[] => {
  // Try flattened approach first if controlList is available
  if (controlList) {
    const children = getContainerChildrenFlat(container.id, controlList);
    if (children.length > 0) {
      return children;
    }
  }

  // Fall back to layout traversal
  const children: string[] = [];

  if (!container || !layoutV4) {
    return children;
  }

  // Find the container in the layout

  const findContainer = (content: Record<string, unknown>[]): Record<string, unknown> | null => {
    for (const item of content) {
      if (item.id === container.id) {
        return item;
      }
      if (item.content && Array.isArray(item.content)) {
        const found = findContainer(item.content as Record<string, unknown>[]);
        if (found) return found;
      }
    }
    return null;
  };

  const containerInLayout = findContainer((layoutV4.content || []) as Record<string, unknown>[]);

  if (!containerInLayout || !containerInLayout.content) {
    return children;
  }

  // Recursively collect all child IDs

  const collectChildren = (content: Record<string, unknown>[]) => {
    for (const item of content) {
      if (item.id && item.id !== container.id) {
        children.push(item.id as string);
      }
      if (item.content && Array.isArray(item.content)) {
        collectChildren(item.content as Record<string, unknown>[]);
      }
    }
  };

  collectChildren((containerInLayout.content || []) as Record<string, unknown>[]);
  return children;
};

export interface ContainerChildReference {
  controlId: string;
  controlName: string;
}

/**
 * Checks if any children of a container have references
 * Returns array of children that have references
 */
export const checkContainerChildrenReferences = (
  container: ControlWithDynamicProps,

  controlList: Record<string, ControlWithDynamicProps>,

  screenData: ScreenDataStructure,

  screenProperties: Record<string, unknown>,

  layoutV4: Record<string, unknown>,
): ContainerChildReference[] => {
  const referencedChildren: ContainerChildReference[] = [];

  // Get all child control IDs
  const childIds = getContainerChildren(container, layoutV4);

  // Check each child for references
  for (const childId of childIds) {
    const childControl = controlList[childId];
    if (childControl && hasControlReferences(childControl as BaseControl, controlList, screenData, screenProperties)) {
      referencedChildren.push({
        controlId: childId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        controlName: (childControl as any).name || (childControl as any).caption || 'Unnamed',
      });
    }
  }

  return referencedChildren;
};

/**
 * Checks if a container or any of its children have events/actions attached
 * @param container - The container control to check
 * @param controlList - All controls on the screen
 * @param screenData - The screen data containing events and actionSets
 * @param layoutV4 - The V4 layout structure
 * @returns true if container or any children have events
 */
export const containerOrChildrenHaveEvents = (
  container: ControlWithDynamicProps,

  controlList: Record<string, ControlWithDynamicProps>,

  screenData: ScreenDataStructure,

  layoutV4: Record<string, unknown>,

  unsavedActionSets?: Record<string, ActionSet>,
): boolean => {
  // Check if container itself has events
  const containerEvents = getControlEvents(container, screenData, unsavedActionSets);
  if (containerEvents.hasEvents) {
    return true;
  }

  // Get all child control IDs - pass controlList for flattened approach
  const childIds = getContainerChildren(container, layoutV4, controlList);

  // Check if any child has events
  for (const childId of childIds) {
    const childControl = controlList[childId];
    if (childControl) {
      const childEvents = getControlEvents(childControl, screenData, unsavedActionSets);
      if (childEvents.hasEvents) {
        return true;
      }
    }
  }

  return false;
};
