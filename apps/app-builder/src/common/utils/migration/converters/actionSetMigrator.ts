/**
 * ActionSet Migrator
 *
 * Migrates actionSets from designer payload to layout-v4 payload for all control types.
 * Preserves original event IDs and actionSet IDs for idempotency and traceability.
 *
 * Handles events for:
 * - EDT (Editable Grid): column onChange, onActiveRowChange
 * - GRD (Grid): column onClick, onActiveRowChange
 * - CHT (Chart): column onClick
 * - BGR/CAL (Button Group/Calendar): button onClick
 * - Standard controls: onClick, onChange, onBlur, onFocus, etc.
 */

import { STANDARD_EVENT_PROPERTIES } from '../constants';
import type {
  DesignerControl,
  ActionSet,
  ActionSetMigrationResult,
  ControlIdMapping,
  EventIdMapping,
  ActionSetIdMapping,
} from '../types';

/**
 * Migrates a single event and its associated actionSets
 *
 * Note: This function preserves the original event IDs and actionSet IDs from the designer
 * payload. This makes the migration idempotent and easier to trace/debug.
 *
 * @param eventId - The event ID from the designer payload (preserved as-is)
 * @param designerEvents - Map of event IDs to actionSet IDs from designer
 * @param designerActionSets - Map of actionSet IDs to actionSet data from designer
 * @param eventIdMapping - Accumulator for tracking event ID mappings (for reference only)
 * @param actionSetIdMapping - Accumulator for tracking actionSet ID mappings (for reference only)
 * @returns Object with event ID and migrated actionSets, or null if no actionSets found
 */
export function migrateEventAndActionSets(
  eventId: string | null | undefined,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): {
  eventId: string;
  actionSets: Record<string, ActionSet>;
  actionSetIds: string[];
} | null {
  if (!eventId) {
    return null;
  }

  // Look up the actionSets for this event
  const actionSetIds = designerEvents[eventId];
  if (!actionSetIds || actionSetIds.length === 0) {
    return null;
  }

  // Track the mapping (original ID -> original ID, for consistency tracking)
  eventIdMapping[eventId] = eventId;

  const migratedActionSets: Record<string, ActionSet> = {};

  // Migrate each actionSet, preserving original IDs
  for (const actionSetId of actionSetIds) {
    // Track the mapping (original ID -> original ID)
    actionSetIdMapping[actionSetId] = actionSetId;

    // Get actionSet data from designer
    const actionSetData = designerActionSets[actionSetId];
    if (!actionSetData) {
      continue;
    }

    // Copy actionSet data, preserving original IDs
    const migratedActionSet: ActionSet = {
      ...actionSetData,
    };

    migratedActionSets[actionSetId] = migratedActionSet;
  }

  return {
    eventId,
    actionSets: migratedActionSets,
    actionSetIds,
  };
}

/**
 * Migrates standard control events
 *
 * Handles: onClick, onChange, onBlur, onFocus, onLoad, onSave, onDelete, onSelect
 */
export function migrateStandardEvents(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  const result: ActionSetMigrationResult = {
    actionSets: {},
    events: {},
    eventIdMapping,
    actionSetIdMapping,
    migratedCount: 0,
  };

  for (const eventProp of STANDARD_EVENT_PROPERTIES) {
    const eventId = oldControl[eventProp] as string | undefined;
    if (eventId) {
      const migrated = migrateEventAndActionSets(
        eventId,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      if (migrated) {
        newControl[eventProp] = migrated.eventId;
        Object.assign(result.actionSets, migrated.actionSets);
        result.events[migrated.eventId] = migrated.actionSetIds;
        result.migratedCount += 1;
      }
    }
  }

  return result;
}

/**
 * Migrates EDT (Editable Grid) events
 *
 * Handles:
 * - onActiveRowChange event on the control
 * - onChangeEvent on individual columns
 */
export function migrateEdtEvents(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  const result: ActionSetMigrationResult = {
    actionSets: {},
    events: {},
    eventIdMapping,
    actionSetIdMapping,
    migratedCount: 0,
  };

  // First, migrate standard events (onClick, onChange, onBlur, etc.)
  const standardResult = migrateStandardEvents(
    oldControl,
    newControl,
    designerEvents,
    designerActionSets,
    eventIdMapping,
    actionSetIdMapping
  );
  Object.assign(result.actionSets, standardResult.actionSets);
  Object.assign(result.events, standardResult.events);
  result.migratedCount += standardResult.migratedCount;

  // Then, migrate EDT-specific events
  // Migrate onActiveRowChange
  const onActiveRowChange = oldControl.onActiveRowChange as string | undefined;
  if (onActiveRowChange) {
    const migrated = migrateEventAndActionSets(
      onActiveRowChange,
      designerEvents,
      designerActionSets,
      eventIdMapping,
      actionSetIdMapping
    );

    if (migrated) {
      newControl.onActiveRowChange = migrated.eventId;
      Object.assign(result.actionSets, migrated.actionSets);
      result.events[migrated.eventId] = migrated.actionSetIds;
      result.migratedCount += 1;
    }
  }

  // Migrate column onChange events
  const oldColumns = (oldControl.columns as Array<Record<string, unknown>>) || [];
  const newColumns = (newControl.columns as Array<Record<string, unknown>>) || [];

  for (let idx = 0; idx < oldColumns.length && idx < newColumns.length; idx += 1) {
    const onChangeEvent = oldColumns[idx].onChangeEvent as string | undefined;
    if (onChangeEvent) {
      const migrated = migrateEventAndActionSets(
        onChangeEvent,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      if (migrated) {
        newColumns[idx].onChangeEvent = migrated.eventId;
        Object.assign(result.actionSets, migrated.actionSets);
        result.events[migrated.eventId] = migrated.actionSetIds;
        result.migratedCount += 1;
      }
    }
  }

  return result;
}

/**
 * Migrates GRD (Grid) events
 *
 * Handles:
 * - onActiveRowChange event on the control
 * - onClick on individual columns (in model.columns)
 */
export function migrateGrdEvents(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  const result: ActionSetMigrationResult = {
    actionSets: {},
    events: {},
    eventIdMapping,
    actionSetIdMapping,
    migratedCount: 0,
  };

  // First, migrate standard events (onClick, onChange, onBlur, etc.)
  const standardResult = migrateStandardEvents(
    oldControl,
    newControl,
    designerEvents,
    designerActionSets,
    eventIdMapping,
    actionSetIdMapping
  );
  Object.assign(result.actionSets, standardResult.actionSets);
  Object.assign(result.events, standardResult.events);
  result.migratedCount += standardResult.migratedCount;

  // Then, migrate GRD-specific events
  // Migrate onActiveRowChange
  const onActiveRowChange = oldControl.onActiveRowChange as string | undefined;
  if (onActiveRowChange) {
    const migrated = migrateEventAndActionSets(
      onActiveRowChange,
      designerEvents,
      designerActionSets,
      eventIdMapping,
      actionSetIdMapping
    );

    if (migrated) {
      newControl.onActiveRowChange = migrated.eventId;
      Object.assign(result.actionSets, migrated.actionSets);
      result.events[migrated.eventId] = migrated.actionSetIds;
      result.migratedCount += 1;
    }
  }

  // Migrate column onClick events
  const oldModel = (oldControl.model as Record<string, unknown>) || {};
  const oldColumns = (oldModel.columns as Array<Record<string, unknown>>) || [];

  const newModel = (newControl.model as Record<string, unknown>) || {};
  const newColumns = (newModel.columns as Array<Record<string, unknown>>) || [];

  for (let idx = 0; idx < oldColumns.length && idx < newColumns.length; idx += 1) {
    const onClick = oldColumns[idx].onClick as string | undefined;
    if (onClick) {
      const migrated = migrateEventAndActionSets(
        onClick,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      if (migrated) {
        newColumns[idx].onClick = migrated.eventId;
        Object.assign(result.actionSets, migrated.actionSets);
        result.events[migrated.eventId] = migrated.actionSetIds;
        result.migratedCount += 1;
      }
    }
  }

  return result;
}

/**
 * Migrates CHT (Chart) events
 *
 * Handles:
 * - onClick on first column (in model.columns)
 */
export function migrateChtEvents(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  const result: ActionSetMigrationResult = {
    actionSets: {},
    events: {},
    eventIdMapping,
    actionSetIdMapping,
    migratedCount: 0,
  };

  // First, migrate standard events (onClick, onChange, onBlur, etc.)
  const standardResult = migrateStandardEvents(
    oldControl,
    newControl,
    designerEvents,
    designerActionSets,
    eventIdMapping,
    actionSetIdMapping
  );
  Object.assign(result.actionSets, standardResult.actionSets);
  Object.assign(result.events, standardResult.events);
  result.migratedCount += standardResult.migratedCount;

  // Then, migrate CHT-specific events (column onClick)
  // Charts typically only have first column clickable
  const oldModel = (oldControl.model as Record<string, unknown>) || {};
  const oldColumns = (oldModel.columns as Array<Record<string, unknown>>) || [];

  const newModel = (newControl.model as Record<string, unknown>) || {};
  const newColumns = (newModel.columns as Array<Record<string, unknown>>) || [];

  if (oldColumns.length > 0 && newColumns.length > 0) {
    const onClick = oldColumns[0].onClick as string | undefined;
    if (onClick) {
      const migrated = migrateEventAndActionSets(
        onClick,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      if (migrated) {
        newColumns[0].onClick = migrated.eventId;
        Object.assign(result.actionSets, migrated.actionSets);
        result.events[migrated.eventId] = migrated.actionSetIds;
        result.migratedCount += 1;
      }
    }
  }

  return result;
}

/**
 * Migrates BGR/CAL (Button Group/Calendar) events
 *
 * Handles:
 * - onClick on individual buttons
 */
export function migrateButtonEvents(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  const result: ActionSetMigrationResult = {
    actionSets: {},
    events: {},
    eventIdMapping,
    actionSetIdMapping,
    migratedCount: 0,
  };

  // First, migrate standard events (onClick, onChange, onBlur, etc.)
  const standardResult = migrateStandardEvents(
    oldControl,
    newControl,
    designerEvents,
    designerActionSets,
    eventIdMapping,
    actionSetIdMapping
  );
  Object.assign(result.actionSets, standardResult.actionSets);
  Object.assign(result.events, standardResult.events);
  result.migratedCount += standardResult.migratedCount;

  // Then, migrate BGR/CAL-specific events (button onClick)
  const oldButtons = (oldControl.buttons as Array<Record<string, unknown>>) || [];
  const newButtons = (newControl.buttons as Array<Record<string, unknown>>) || [];

  for (let idx = 0; idx < oldButtons.length && idx < newButtons.length; idx += 1) {
    const onClick = oldButtons[idx].onClick as string | undefined;
    if (onClick) {
      const migrated = migrateEventAndActionSets(
        onClick,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      if (migrated) {
        newButtons[idx].onClick = migrated.eventId;
        Object.assign(result.actionSets, migrated.actionSets);
        result.events[migrated.eventId] = migrated.actionSetIds;
        result.migratedCount += 1;
      }
    }
  }

  return result;
}

/**
 * Migrates all actionSets for a single control based on its type
 *
 * @param oldControl - Control from designer payload
 * @param newControl - Corresponding control in layout-v4 payload (will be mutated)
 * @param controlType - Type of the control (BTN, EDT, GRD, etc.)
 * @param designerEvents - Map of event IDs to actionSet IDs from designer
 * @param designerActionSets - Map of actionSet IDs to actionSet data from designer
 * @param eventIdMapping - Accumulator for old -> new event ID mappings
 * @param actionSetIdMapping - Accumulator for old -> new actionSet ID mappings
 * @returns Migration result with actionSets, events, and mappings
 */
export function migrateControlActionSets(
  oldControl: DesignerControl,
  newControl: Record<string, unknown>,
  controlType: string,
  designerEvents: Record<string, string[]>,
  designerActionSets: Record<string, ActionSet>,
  eventIdMapping: EventIdMapping,
  actionSetIdMapping: ActionSetIdMapping
): ActionSetMigrationResult {
  // Route to appropriate migrator based on control type
  switch (controlType) {
    case 'EDT':
      return migrateEdtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

    case 'GRD':
      return migrateGrdEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

    case 'CHT':
      return migrateChtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

    case 'BGR':
    case 'CAL':
      return migrateButtonEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

    default:
      return migrateStandardEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );
  }
}

/**
 * Builds a mapping of control IDs by matching control names
 *
 * @param designerControls - Array of controls from designer payload
 * @param layoutV4Controls - Map of controls from layout-v4 payload
 * @returns Mapping of old control IDs to new control IDs
 */
export function buildControlIdMapping(
  designerControls: DesignerControl[],
  layoutV4Controls: Record<string, Record<string, unknown>>
): ControlIdMapping {
  const mapping: ControlIdMapping = {};

  // Build name -> ID mapping for designer controls
  const designerByName: Record<string, string> = {};
  for (const control of designerControls) {
    const name = control.name as string | undefined;
    const id = control.Id || control.id;
    if (name && id) {
      designerByName[name] = id as string;
    }
  }

  // Build name -> ID mapping for layout-v4 controls
  const layoutByName: Record<string, string> = {};
  for (const [controlId, controlData] of Object.entries(layoutV4Controls)) {
    const name = controlData.name as string | undefined;
    if (name) {
      layoutByName[name] = controlId;
    }
  }

  // Match by name
  for (const [name, oldId] of Object.entries(designerByName)) {
    const newId = layoutByName[name];
    if (newId && newId !== oldId) {
      mapping[oldId] = newId;
    }
  }

  return mapping;
}
