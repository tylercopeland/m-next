/**
 * ActionSet Migrator Tests
 */

import {
  migrateEventAndActionSets,
  migrateEdtEvents,
  migrateGrdEvents,
  migrateChtEvents,
  migrateButtonEvents,
  migrateStandardEvents,
  migrateControlActionSets,
  buildControlIdMapping,
} from './actionSetMigrator';
import type {
  DesignerControl,
  EventIdMapping,
  ActionSetIdMapping,
} from '../types';

describe('actionSetMigrator', () => {
  describe('migrateEventAndActionSets', () => {
    test('returns null for falsy event ID', () => {
      const result = migrateEventAndActionSets(null, {}, {}, {}, {});
      expect(result).toBeNull();
    });

    test('returns null when event has no actionSets', () => {
      const designerEvents = { 'event-1': [] };
      const result = migrateEventAndActionSets('event-1', designerEvents, {}, {}, {});
      expect(result).toBeNull();
    });

    test('migrates event with single actionSet, preserving original IDs', () => {
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': {
          ActionSetId: 'actionset-1',
          Key: 'actionset-1',
          name: 'Test Action',
        },
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEventAndActionSets(
        'event-1',
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      expect(result).not.toBeNull();
      expect(result?.eventId).toBe('event-1'); // Original ID preserved
      expect(result?.actionSetIds).toEqual(['actionset-1']); // Original IDs preserved
      expect(result?.actionSets).toBeDefined();
      expect(result?.actionSets['actionset-1']).toBeDefined();
      expect(eventIdMapping['event-1']).toBe('event-1');
      expect(actionSetIdMapping['actionset-1']).toBe('actionset-1');
    });

    test('migrates event with multiple actionSets, preserving original IDs', () => {
      const designerEvents = { 'event-1': ['actionset-1', 'actionset-2'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1', name: 'Action 1' },
        'actionset-2': { ActionSetId: 'actionset-2', name: 'Action 2' },
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEventAndActionSets(
        'event-1',
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      expect(result?.eventId).toBe('event-1');
      expect(result?.actionSetIds).toEqual(['actionset-1', 'actionset-2']);
      expect(Object.keys(result?.actionSets || {})).toHaveLength(2);
      expect(result?.actionSets['actionset-1']).toBeDefined();
      expect(result?.actionSets['actionset-2']).toBeDefined();
    });

    test('preserves actionSet data and original IDs', () => {
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': {
          ActionSetId: 'actionset-1',
          Key: 'actionset-1',
          name: 'Test',
        },
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEventAndActionSets(
        'event-1',
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      const actionSetId = result?.actionSetIds[0];
      const migratedActionSet = result?.actionSets[actionSetId || ''];

      expect(actionSetId).toBe('actionset-1'); // Original ID preserved
      expect(migratedActionSet?.ActionSetId).toBe('actionset-1');
      expect(migratedActionSet?.Key).toBe('actionset-1');
      expect(migratedActionSet?.name).toBe('Test');
    });

    test('handles missing actionSet data gracefully', () => {
      const designerEvents = { 'event-1': ['actionset-1', 'actionset-2'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1', name: 'Action 1' },
        // actionset-2 is missing
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEventAndActionSets(
        'event-1',
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      // Should preserve both IDs in actionSetIds, but only migrate the existing actionSet
      expect(result?.actionSetIds).toEqual(['actionset-1', 'actionset-2']);
      expect(Object.keys(result?.actionSets || {})).toHaveLength(1);
      expect(result?.actionSets['actionset-1']).toBeDefined();
    });
  });

  describe('migrateEdtEvents', () => {
    test('migrates onActiveRowChange event', () => {
      const oldControl: DesignerControl = {
        Type: 'EDT',
        onActiveRowChange: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'EDT' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1', name: 'Row Change Action' },
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEdtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onActiveRowChange).toBeDefined();
      expect(typeof newControl.onActiveRowChange).toBe('string');
    });

    test('migrates column onChange events', () => {
      const oldControl: DesignerControl = {
        Type: 'EDT',
        columns: [
          { header: 'Col1', onChangeEvent: 'event-1' },
          { header: 'Col2', onChangeEvent: 'event-2' },
        ],
      };
      const newControl: Record<string, unknown> = {
        Type: 'EDT',
        columns: [{ header: 'Col1' }, { header: 'Col2' }],
      };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1', name: 'Action 1' },
        'actionset-2': { ActionSetId: 'actionset-2', name: 'Action 2' },
      };
      const eventIdMapping: EventIdMapping = {};
      const actionSetIdMapping: ActionSetIdMapping = {};

      const result = migrateEdtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        eventIdMapping,
        actionSetIdMapping
      );

      expect(result.migratedCount).toBe(2);
      const columns = newControl.columns as Array<Record<string, unknown>>;
      expect(columns[0].onChangeEvent).toBeDefined();
      expect(columns[1].onChangeEvent).toBeDefined();
    });

    test('handles EDT with both control and column events', () => {
      const oldControl: DesignerControl = {
        Type: 'EDT',
        onActiveRowChange: 'event-1',
        columns: [{ header: 'Col1', onChangeEvent: 'event-2' }],
      };
      const newControl: Record<string, unknown> = {
        Type: 'EDT',
        columns: [{ header: 'Col1' }],
      };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
        'actionset-2': { ActionSetId: 'actionset-2' },
      };

      const result = migrateEdtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(2);
    });

    test('handles EDT with no events', () => {
      const oldControl: DesignerControl = { Type: 'EDT' };
      const newControl: Record<string, unknown> = { Type: 'EDT' };

      const result = migrateEdtEvents(oldControl, newControl, {}, {}, {}, {});

      expect(result.migratedCount).toBe(0);
    });
  });

  describe('migrateGrdEvents', () => {
    test('migrates onActiveRowChange event', () => {
      const oldControl: DesignerControl = {
        Type: 'GRD',
        onActiveRowChange: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'GRD' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateGrdEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onActiveRowChange).toBeDefined();
    });

    test('migrates column onClick events', () => {
      const oldControl: DesignerControl = {
        Type: 'GRD',
        model: {
          columns: [
            { name: 'Col1', onClick: 'event-1' },
            { name: 'Col2', onClick: 'event-2' },
          ],
        },
      };
      const newControl: Record<string, unknown> = {
        Type: 'GRD',
        model: {
          columns: [{ name: 'Col1' }, { name: 'Col2' }],
        },
      };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
        'actionset-2': { ActionSetId: 'actionset-2' },
      };

      const result = migrateGrdEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(2);
      const model = newControl.model as Record<string, unknown>;
      const columns = model.columns as Array<Record<string, unknown>>;
      expect(columns[0].onClick).toBeDefined();
      expect(columns[1].onClick).toBeDefined();
    });

    test('handles GRD with no model', () => {
      const oldControl: DesignerControl = { Type: 'GRD' };
      const newControl: Record<string, unknown> = { Type: 'GRD' };

      const result = migrateGrdEvents(oldControl, newControl, {}, {}, {}, {});

      expect(result.migratedCount).toBe(0);
    });
  });

  describe('migrateChtEvents', () => {
    test('migrates first column onClick event', () => {
      const oldControl: DesignerControl = {
        Type: 'CHT',
        model: {
          columns: [{ name: 'Col1', onClick: 'event-1' }],
        },
      };
      const newControl: Record<string, unknown> = {
        Type: 'CHT',
        model: {
          columns: [{ name: 'Col1' }],
        },
      };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateChtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      const model = newControl.model as Record<string, unknown>;
      const columns = model.columns as Array<Record<string, unknown>>;
      expect(columns[0].onClick).toBeDefined();
    });

    test('handles chart with no columns', () => {
      const oldControl: DesignerControl = {
        Type: 'CHT',
        model: { columns: [] },
      };
      const newControl: Record<string, unknown> = {
        Type: 'CHT',
        model: { columns: [] },
      };

      const result = migrateChtEvents(oldControl, newControl, {}, {}, {}, {});

      expect(result.migratedCount).toBe(0);
    });

    test('only migrates first column, ignores others', () => {
      const oldControl: DesignerControl = {
        Type: 'CHT',
        model: {
          columns: [
            { name: 'Col1', onClick: 'event-1' },
            { name: 'Col2', onClick: 'event-2' },
          ],
        },
      };
      const newControl: Record<string, unknown> = {
        Type: 'CHT',
        model: {
          columns: [{ name: 'Col1' }, { name: 'Col2' }],
        },
      };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
        'actionset-2': { ActionSetId: 'actionset-2' },
      };

      const result = migrateChtEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      const model = newControl.model as Record<string, unknown>;
      const columns = model.columns as Array<Record<string, unknown>>;
      expect(columns[0].onClick).toBeDefined();
      expect(columns[1].onClick).toBeUndefined();
    });
  });

  describe('migrateButtonEvents', () => {
    test('migrates button onClick events', () => {
      const oldControl: DesignerControl = {
        Type: 'BGR',
        buttons: [
          { caption: 'Button 1', onClick: 'event-1' },
          { caption: 'Button 2', onClick: 'event-2' },
        ],
      };
      const newControl: Record<string, unknown> = {
        Type: 'BGR',
        buttons: [{ caption: 'Button 1' }, { caption: 'Button 2' }],
      };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
        'actionset-2': { ActionSetId: 'actionset-2' },
      };

      const result = migrateButtonEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(2);
      const buttons = newControl.buttons as Array<Record<string, unknown>>;
      expect(buttons[0].onClick).toBeDefined();
      expect(buttons[1].onClick).toBeDefined();
    });

    test('handles control with no buttons', () => {
      const oldControl: DesignerControl = { Type: 'BGR' };
      const newControl: Record<string, unknown> = { Type: 'BGR' };

      const result = migrateButtonEvents(oldControl, newControl, {}, {}, {}, {});

      expect(result.migratedCount).toBe(0);
    });

    test('works for CAL control type', () => {
      const oldControl: DesignerControl = {
        Type: 'CAL',
        buttons: [{ caption: 'Today', onClick: 'event-1' }],
      };
      const newControl: Record<string, unknown> = {
        Type: 'CAL',
        buttons: [{ caption: 'Today' }],
      };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateButtonEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
    });
  });

  describe('migrateStandardEvents', () => {
    test('migrates onClick event', () => {
      const oldControl: DesignerControl = {
        Type: 'BTN',
        onClick: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'BTN' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateStandardEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onClick).toBeDefined();
    });

    test('migrates onChange event', () => {
      const oldControl: DesignerControl = {
        Type: 'TXT',
        onChange: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'TXT' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateStandardEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onChange).toBeDefined();
    });

    test('migrates multiple standard events', () => {
      const oldControl: DesignerControl = {
        Type: 'TXT',
        onClick: 'event-1',
        onChange: 'event-2',
        onBlur: 'event-3',
        onFocus: 'event-4',
      };
      const newControl: Record<string, unknown> = { Type: 'TXT' };
      const designerEvents = {
        'event-1': ['actionset-1'],
        'event-2': ['actionset-2'],
        'event-3': ['actionset-3'],
        'event-4': ['actionset-4'],
      };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
        'actionset-2': { ActionSetId: 'actionset-2' },
        'actionset-3': { ActionSetId: 'actionset-3' },
        'actionset-4': { ActionSetId: 'actionset-4' },
      };

      const result = migrateStandardEvents(
        oldControl,
        newControl,
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(4);
      expect(newControl.onClick).toBeDefined();
      expect(newControl.onChange).toBeDefined();
      expect(newControl.onBlur).toBeDefined();
      expect(newControl.onFocus).toBeDefined();
    });

    test('handles control with no events', () => {
      const oldControl: DesignerControl = { Type: 'BTN' };
      const newControl: Record<string, unknown> = { Type: 'BTN' };

      const result = migrateStandardEvents(oldControl, newControl, {}, {}, {}, {});

      expect(result.migratedCount).toBe(0);
    });
  });

  describe('migrateControlActionSets', () => {
    test('routes EDT to EDT-specific migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'EDT',
        onActiveRowChange: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'EDT' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'EDT',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onActiveRowChange).toBeDefined();
    });

    test('routes GRD to GRD-specific migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'GRD',
        onActiveRowChange: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'GRD' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'GRD',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
    });

    test('routes CHT to chart-specific migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'CHT',
        model: { columns: [{ onClick: 'event-1' }] },
      };
      const newControl: Record<string, unknown> = {
        Type: 'CHT',
        model: { columns: [{}] },
      };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'CHT',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
    });

    test('routes BGR to button-specific migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'BGR',
        buttons: [{ onClick: 'event-1' }],
      };
      const newControl: Record<string, unknown> = {
        Type: 'BGR',
        buttons: [{}],
      };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'BGR',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
    });

    test('routes CAL to button-specific migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'CAL',
        buttons: [{ onClick: 'event-1' }],
      };
      const newControl: Record<string, unknown> = {
        Type: 'CAL',
        buttons: [{}],
      };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'CAL',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
    });

    test('routes unknown types to standard migrator', () => {
      const oldControl: DesignerControl = {
        Type: 'BTN',
        onClick: 'event-1',
      };
      const newControl: Record<string, unknown> = { Type: 'BTN' };
      const designerEvents = { 'event-1': ['actionset-1'] };
      const designerActionSets = {
        'actionset-1': { ActionSetId: 'actionset-1' },
      };

      const result = migrateControlActionSets(
        oldControl,
        newControl,
        'BTN',
        designerEvents,
        designerActionSets,
        {},
        {}
      );

      expect(result.migratedCount).toBe(1);
      expect(newControl.onClick).toBeDefined();
    });
  });

  describe('buildControlIdMapping', () => {
    test('returns empty mapping for empty inputs', () => {
      const result = buildControlIdMapping([], {});
      expect(result).toEqual({});
    });

    test('builds mapping for controls with matching names', () => {
      const designerControls: DesignerControl[] = [
        { Id: 'old-id-1', name: 'Control1', Type: 'BTN' },
        { Id: 'old-id-2', name: 'Control2', Type: 'TXT' },
      ];
      const layoutV4Controls = {
        'new-id-1': { name: 'Control1', Type: 'BTN' },
        'new-id-2': { name: 'Control2', Type: 'TXT' },
      };

      const result = buildControlIdMapping(designerControls, layoutV4Controls);

      expect(result['old-id-1']).toBe('new-id-1');
      expect(result['old-id-2']).toBe('new-id-2');
    });

    test('ignores controls without names', () => {
      const designerControls: DesignerControl[] = [
        { Id: 'old-id-1', Type: 'BTN' },
        { Id: 'old-id-2', name: 'Control2', Type: 'TXT' },
      ];
      const layoutV4Controls = {
        'new-id-1': { Type: 'BTN' },
        'new-id-2': { name: 'Control2', Type: 'TXT' },
      };

      const result = buildControlIdMapping(designerControls, layoutV4Controls);

      expect(result['old-id-1']).toBeUndefined();
      expect(result['old-id-2']).toBe('new-id-2');
    });

    test('ignores controls with same old and new IDs', () => {
      const designerControls: DesignerControl[] = [
        { Id: 'same-id', name: 'Control1', Type: 'BTN' },
      ];
      const layoutV4Controls = {
        'same-id': { name: 'Control1', Type: 'BTN' },
      };

      const result = buildControlIdMapping(designerControls, layoutV4Controls);

      expect(result['same-id']).toBeUndefined();
    });

    test('handles controls with no matching names', () => {
      const designerControls: DesignerControl[] = [
        { Id: 'old-id-1', name: 'Control1', Type: 'BTN' },
      ];
      const layoutV4Controls = {
        'new-id-1': { name: 'DifferentControl', Type: 'BTN' },
      };

      const result = buildControlIdMapping(designerControls, layoutV4Controls);

      expect(result).toEqual({});
    });

    test('handles id vs Id property naming', () => {
      const designerControls: DesignerControl[] = [
        { id: 'old-id-1', name: 'Control1', Type: 'BTN' } as DesignerControl,
      ];
      const layoutV4Controls = {
        'new-id-1': { name: 'Control1', Type: 'BTN' },
      };

      const result = buildControlIdMapping(designerControls, layoutV4Controls);

      expect(result['old-id-1']).toBe('new-id-1');
    });
  });
});
