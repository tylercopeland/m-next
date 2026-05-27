/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseControl } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import {
  createDuplicateControl,
  isEventPropertyWithGuid,
  canDuplicateControl,
  generateDuplicateName,
  findAvailablePlacement,
} from './duplicateControlHelper';
import type { LayoutItemV4, LayoutV4 } from './duplicateControlHelper.types';

// Track Guid.create calls to return unique predictable GUIDs
let guidCounter = 0;
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: jest.fn(() => {
      guidCounter += 1;
      return `00000000-0000-0000-0000-${String(guidCounter).padStart(12, '0')}`;
    }),
    valid: jest.fn((value) =>
      /^\{?[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}\}?$/.test(value),
    ),
    empty: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
  },
}));

jest.mock('@m-next/runtime-interface', () => ({
  WIDGETS: {
    SIGNATURE: 'SIG',
    TAGLIST: 'TGL',
    SYNCWIDGET: 'SYN',
    DOCUMENTSWIDGET: 'DOC',
    RECURRENCE: 'REC',
    LAYOUT_CONTAINER: 'LCN',
    SECTION: 'SEC',
  },
}));

jest.mock('@m-next/types', () => ({
  CurrentState: { REGULAR: 0 },
}));

// ============================================================================
// Test Helpers
// ============================================================================

const GUID_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const GUID_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const GUID_C = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const GUID_D = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const GUID_E = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const GUID_F = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

const makeActionSet = (id: string) => ({
  ActionSetId: id,
  Key: id,
  Actions: [{ ActionId: 99, Description: `Action for ${id}` }],
});

const makeEvents = (guids: string[]) => {
  const events: Record<string, string[]> = {};
  guids.forEach((g) => {
    events[g] = [g];
  });
  return events;
};

const makeActionUpserts = (guids: string[]) => {
  const upserts: Record<string, unknown> = {};
  guids.forEach((g) => {
    upserts[g] = makeActionSet(g);
  });
  return upserts;
};

const emptyLayout = { content: [] };
const emptyControls = {};

const callCreateDuplicate = (
  control: Record<string, unknown>,
  actionGuids: string[],
  controlList: Record<string, unknown> = emptyControls,
  layout = emptyLayout,
) =>
  createDuplicateControl(
    control as any,
    controlList as any,
    layout,
    12,
    makeActionUpserts(actionGuids),
    makeEvents(actionGuids),
    [],
  );

// ============================================================================
// Tests
// ============================================================================

beforeEach(() => {
  guidCounter = 0;
  (Guid.create as jest.Mock).mockClear();
});

describe('isEventPropertyWithGuid', () => {
  it('returns true for on* property with valid GUID value', () => {
    expect(isEventPropertyWithGuid('onClick', GUID_A)).toBe(true);
    expect(isEventPropertyWithGuid('onChange', GUID_B)).toBe(true);
    expect(isEventPropertyWithGuid('onActiveRowChange', GUID_C)).toBe(true);
    expect(isEventPropertyWithGuid('onCustomRowClick', GUID_D)).toBe(true);
    expect(isEventPropertyWithGuid('onLoseFocus', GUID_E)).toBe(true);
    expect(isEventPropertyWithGuid('onChangeEvent', GUID_F)).toBe(true);
  });

  it('returns false for non-GUID string values', () => {
    expect(isEventPropertyWithGuid('onLabel', 'On')).toBe(false);
    expect(isEventPropertyWithGuid('onClick', 'not-a-guid')).toBe(false);
    expect(isEventPropertyWithGuid('onChange', '')).toBe(false);
  });

  it('returns false for null/undefined values', () => {
    expect(isEventPropertyWithGuid('onClick', null)).toBe(false);
    expect(isEventPropertyWithGuid('onClick', undefined)).toBe(false);
  });

  it('returns false for non-event property keys', () => {
    expect(isEventPropertyWithGuid('id', GUID_A)).toBe(false);
    expect(isEventPropertyWithGuid('name', GUID_A)).toBe(false);
    expect(isEventPropertyWithGuid('on', GUID_A)).toBe(false);
    expect(isEventPropertyWithGuid('once', GUID_A)).toBe(false);
  });
});

describe('createDuplicateControl - root-level action set copying', () => {
  it('copies the base 4 action set properties (onClick, onChange, onBlur, onFocus)', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Text1',
      type: 'LBL',
      onClick: GUID_A,
      onChange: GUID_B,
      onBlur: GUID_C,
      onFocus: GUID_D,
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B, GUID_C, GUID_D]) as any;

    // Each on* property should have a NEW GUID (not the original)
    expect(result.control.onClick).not.toBe(GUID_A);
    expect(result.control.onChange).not.toBe(GUID_B);
    expect(result.control.onBlur).not.toBe(GUID_C);
    expect(result.control.onFocus).not.toBe(GUID_D);

    // Should have valid GUIDs
    expect(Guid.valid(result.control.onClick)).toBe(true);
    expect(Guid.valid(result.control.onChange)).toBe(true);
    expect(Guid.valid(result.control.onBlur)).toBe(true);
    expect(Guid.valid(result.control.onFocus)).toBe(true);

    // Should have 4 copied action sets
    expect(result.copiedActionSets).toHaveLength(4);
  });

  it('copies Dropdown-specific events: onLoseFocus, onCustomRowClick', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Dropdown1',
      type: 'DRP',
      onChange: GUID_A,
      onBlur: GUID_B,
      onLoseFocus: GUID_C,
      onCustomRowClick: GUID_D,
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B, GUID_C, GUID_D]) as any;

    expect(result.control.onLoseFocus).not.toBe(GUID_C);
    expect(result.control.onCustomRowClick).not.toBe(GUID_D);
    expect(Guid.valid(result.control.onLoseFocus)).toBe(true);
    expect(Guid.valid(result.control.onCustomRowClick)).toBe(true);
    expect(result.copiedActionSets).toHaveLength(4);
  });

  it('copies Grid onActiveRowChange', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Grid1',
      type: 'GRD',
      onActiveRowChange: GUID_A,
      columns: [],
      viewList: [],
    };

    const result = callCreateDuplicate(control, [GUID_A]) as any;

    expect(result.control.onActiveRowChange).not.toBe(GUID_A);
    expect(Guid.valid(result.control.onActiveRowChange)).toBe(true);
    expect(result.copiedActionSets).toHaveLength(1);
  });

  it('skips null on* properties gracefully', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Text1',
      type: 'LBL',
      onClick: null,
      onChange: null,
      onBlur: null,
      onFocus: null,
    };

    const result = callCreateDuplicate(control, []);

    expect(result.control.onClick).toBeNull();
    expect(result.control.onChange).toBeNull();
    expect(result.copiedActionSets).toBeUndefined();
  });

  it('does not treat non-GUID on* values as action sets (e.g., onLabel)', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Toggle1',
      type: 'TGG',
      onLabel: 'On',
      offLabel: 'Off',
    };

    const result = callCreateDuplicate(control, []) as any;

    // onLabel should remain unchanged — it's a display string, not an action set
    expect(result.control.onLabel).toBe('On');
    expect(result.copiedActionSets).toBeUndefined();
  });

  it('returns no copiedActionSets when control has no on* GUIDs', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Label1',
      type: 'LBL',
    };

    const result = callCreateDuplicate(control, []);

    expect(result.copiedActionSets).toBeUndefined();
  });
});

describe('createDuplicateControl - ButtonGroup nested buttons', () => {
  it('copies onClick on each button in a ButtonGroup', () => {
    const control = {
      id: 'ctrl-1',
      name: 'ButtonGroup1',
      type: 'BGR',
      buttons: [
        { id: 'btn-1', name: 'ButtonGroup1~~btn-1', onClick: GUID_A },
        { id: 'btn-2', name: 'ButtonGroup1~~btn-2', onClick: GUID_B },
      ],
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B]) as any;

    const dupButtons = result.control.buttons as Array<Record<string, unknown>>;
    expect(dupButtons).toHaveLength(2);

    // Button IDs should be regenerated
    expect(dupButtons[0].id).not.toBe('btn-1');
    expect(dupButtons[1].id).not.toBe('btn-2');

    // Button onClick GUIDs should be new
    expect(dupButtons[0].onClick).not.toBe(GUID_A);
    expect(dupButtons[1].onClick).not.toBe(GUID_B);
    expect(Guid.valid(dupButtons[0].onClick as string)).toBe(true);
    expect(Guid.valid(dupButtons[1].onClick as string)).toBe(true);

    // Should have 2 copied action sets (one per button)
    expect(result.copiedActionSets).toHaveLength(2);
  });

  it('handles buttons with null onClick gracefully', () => {
    const control = {
      id: 'ctrl-1',
      name: 'ButtonGroup1',
      type: 'BGR',
      buttons: [{ id: 'btn-1', name: 'ButtonGroup1~~btn-1', onClick: null }],
    };

    const result = callCreateDuplicate(control, []) as any;

    const dupButtons = result.control.buttons as Array<Record<string, unknown>>;
    expect(dupButtons[0].onClick).toBeNull();
    expect(result.copiedActionSets).toBeUndefined();
  });
});

describe('createDuplicateControl - Grid column action sets', () => {
  it('copies onChangeEvent on grid columns', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Grid1',
      type: 'GRD',
      columns: [
        { field: 'Name', header: 'Name', onChangeEvent: GUID_A },
        { field: 'Email', header: 'Email', onChangeEvent: GUID_B },
      ],
      viewList: [],
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B]) as any;

    const dupCols = result.control.columns as Array<Record<string, unknown>>;
    expect(dupCols[0].onChangeEvent).not.toBe(GUID_A);
    expect(dupCols[1].onChangeEvent).not.toBe(GUID_B);
    expect(Guid.valid(dupCols[0].onChangeEvent as string)).toBe(true);
    expect(Guid.valid(dupCols[1].onChangeEvent as string)).toBe(true);
    expect(result.copiedActionSets).toHaveLength(2);
  });

  it('copies on* properties from nested control inside a grid column', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Grid1',
      type: 'GRD',
      columns: [
        {
          field: 'Action',
          header: 'Action',
          onChangeEvent: null,
          control: {
            type: 'BTN',
            onClick: GUID_A,
          },
        },
        {
          field: 'Status',
          header: 'Status',
          onChangeEvent: GUID_B,
          control: {
            type: 'DRP',
            onChange: GUID_C,
            onCustomRowClick: GUID_D,
          },
        },
      ],
      viewList: [],
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B, GUID_C, GUID_D]) as any;

    const dupCols = result.control.columns as Array<Record<string, unknown>>;

    // Column 0: nested button onClick
    const nestedBtn = dupCols[0].control as Record<string, unknown>;
    expect(nestedBtn.onClick).not.toBe(GUID_A);
    expect(Guid.valid(nestedBtn.onClick as string)).toBe(true);

    // Column 1: column-level onChangeEvent + nested dropdown onChange and onCustomRowClick
    expect(dupCols[1].onChangeEvent).not.toBe(GUID_B);
    const nestedDrp = dupCols[1].control as Record<string, unknown>;
    expect(nestedDrp.onChange).not.toBe(GUID_C);
    expect(nestedDrp.onCustomRowClick).not.toBe(GUID_D);
    expect(Guid.valid(nestedDrp.onChange as string)).toBe(true);
    expect(Guid.valid(nestedDrp.onCustomRowClick as string)).toBe(true);

    // 4 total: 1 nested button + 1 column + 2 nested dropdown
    expect(result.copiedActionSets).toHaveLength(4);
  });

  it('handles columns with no on* properties or nested controls', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Grid1',
      type: 'GRD',
      columns: [{ field: 'Name', header: 'Name', onChangeEvent: null }],
      viewList: [],
    };

    const result = callCreateDuplicate(control, []) as any;

    const dupCols = result.control.columns as Array<Record<string, unknown>>;
    expect(dupCols[0].onChangeEvent).toBeNull();
    expect(result.copiedActionSets).toBeUndefined();
  });
});

describe('createDuplicateControl - combined complex control', () => {
  it('copies all action sets on a Grid with onActiveRowChange, column events, and nested controls', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Grid1',
      type: 'GRD',
      onActiveRowChange: GUID_A,
      columns: [
        {
          field: 'Name',
          header: 'Name',
          onChangeEvent: GUID_B,
        },
        {
          field: 'Action',
          header: 'Action',
          onChangeEvent: null,
          control: {
            type: 'BTN',
            onClick: GUID_C,
          },
        },
      ],
      viewList: [],
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B, GUID_C]) as any;

    // Root-level onActiveRowChange
    expect(result.control.onActiveRowChange).not.toBe(GUID_A);
    expect(Guid.valid(result.control.onActiveRowChange)).toBe(true);

    // Column onChangeEvent
    const dupCols = result.control.columns as Array<Record<string, unknown>>;
    expect(dupCols[0].onChangeEvent).not.toBe(GUID_B);

    // Nested button onClick
    const nestedBtn = dupCols[1].control as Record<string, unknown>;
    expect(nestedBtn.onClick).not.toBe(GUID_C);

    // 3 total action sets
    expect(result.copiedActionSets).toHaveLength(3);
  });

  it('generates unique GUIDs for each copied action set', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Text1',
      type: 'LBL',
      onClick: GUID_A,
      onChange: GUID_B,
      onBlur: GUID_C,
    };

    const result = callCreateDuplicate(control, [GUID_A, GUID_B, GUID_C]);

    const newGuids = [result.control.onClick, result.control.onChange, result.control.onBlur];

    // All GUIDs should be unique
    const uniqueGuids = new Set(newGuids);
    expect(uniqueGuids.size).toBe(3);

    // None should match originals
    expect(newGuids).not.toContain(GUID_A);
    expect(newGuids).not.toContain(GUID_B);
    expect(newGuids).not.toContain(GUID_C);
  });

  it('deep clones action set content so mutations do not affect original', () => {
    const control = {
      id: 'ctrl-1',
      name: 'Btn1',
      type: 'BTN',
      onClick: GUID_A,
    };

    const actionUpserts = makeActionUpserts([GUID_A]);
    const events = makeEvents([GUID_A]);

    const result = createDuplicateControl(control as any, {}, emptyLayout, 12, actionUpserts, events, []);

    // Mutate the copied action set
    const copiedActionSet = result.copiedActionSets![0].actionSet as Record<string, unknown>;
    copiedActionSet.ActionSetId = 'mutated';

    // Original should be untouched
    const original = actionUpserts[GUID_A] as Record<string, unknown>;
    expect(original.ActionSetId).toBe(GUID_A);
  });
});

// ============================================================================
// canDuplicateControl
// ============================================================================

describe('canDuplicateControl', () => {
  it('returns canDuplicate: true for a normal control', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'BTN', name: 'Button1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('returns false for null/undefined control', () => {
    const result = canDuplicateControl({
      control: null as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
    expect(result.reason).toBe('Control not found');
  });

  it('blocks duplication of single-instance widgets (SIGNATURE)', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'SIG', name: 'Signature1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
    expect(result.reason).toBe('Single-instance component');
    expect(result.tooltipMessage).toBe('Only one instance allowed per screen');
  });

  it('blocks duplication of single-instance widgets (TAGLIST)', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'TGL', name: 'Tags1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
    expect(result.reason).toBe('Single-instance component');
  });

  it('blocks duplication of single-instance widgets (SYNCWIDGET)', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'SYN', name: 'Sync1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
  });

  it('blocks duplication of single-instance widgets (DOCUMENTSWIDGET)', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'DOC', name: 'Docs1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
  });

  it('blocks duplication of single-instance widgets (RECURRENCE)', () => {
    const result = canDuplicateControl({
      control: { id: 'ctrl-1', type: 'REC', name: 'Recurrence1' } as unknown as BaseControl,
      controlList: {},
      screenData: null,
    });
    expect(result.canDuplicate).toBe(false);
  });

  it('allows container duplication but flags single-instance children (via layoutV4)', () => {
    const layout = {
      content: [
        {
          id: 'container-1',
          containerId: null,
          desktop: { x: 0, y: 0, width: 12, height: 6, currentState: 0 },
          content: [
            {
              id: 'child-btn',
              containerId: 'container-1',
              desktop: { x: 0, y: 0, width: 4, height: 2, currentState: 0 },
              content: [],
            },
            {
              id: 'child-sig',
              containerId: 'container-1',
              desktop: { x: 4, y: 0, width: 4, height: 2, currentState: 0 },
              content: [],
            },
          ],
        },
      ],
    };
    const controlList = {
      'container-1': { id: 'container-1', type: 'LCN', name: 'Container1' },
      'child-btn': { id: 'child-btn', type: 'BTN', name: 'Button1' },
      'child-sig': { id: 'child-sig', type: 'SIG', name: 'Signature1' },
    };

    const result = canDuplicateControl({
      control: controlList['container-1'] as any,
      controlList: controlList as any,
      layoutV4: layout as LayoutV4,
      screenData: null,
    });

    expect(result.canDuplicate).toBe(true);
    expect(result.reason).toBe('Container with single-instance children');
  });

  it('allows container duplication with no single-instance children', () => {
    const layout = {
      content: [
        {
          id: 'container-1',
          containerId: null,
          desktop: { x: 0, y: 0, width: 12, height: 6, currentState: 0 },
          content: [
            {
              id: 'child-btn',
              containerId: 'container-1',
              desktop: { x: 0, y: 0, width: 4, height: 2, currentState: 0 },
              content: [],
            },
          ],
        },
      ],
    };
    const controlList = {
      'container-1': { id: 'container-1', type: 'LCN', name: 'Container1' },
      'child-btn': { id: 'child-btn', type: 'BTN', name: 'Button1' },
    };

    const result = canDuplicateControl({
      control: controlList['container-1'] as any,
      controlList: controlList as any,
      layoutV4: layout as LayoutV4,
      screenData: null,
    });

    expect(result.canDuplicate).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('uses controlList fallback when layoutV4 is not provided', () => {
    const controlList = {
      'container-1': { id: 'container-1', type: 'SEC', name: 'Section1' },
      'child-sig': { id: 'child-sig', type: 'SIG', name: 'Signature1', containerId: 'container-1' },
    };

    const result = canDuplicateControl({
      control: controlList['container-1'] as any,
      controlList: controlList as any,
      screenData: null,
    });

    expect(result.canDuplicate).toBe(true);
    expect(result.reason).toBe('Container with single-instance children');
  });
});

// ============================================================================
// generateDuplicateName
// ============================================================================

describe('generateDuplicateName', () => {
  it('returns original name if not in use', () => {
    const result = generateDuplicateName('Button1', {});
    expect(result).toBe('Button1');
  });

  it('appends _Copy when original name exists', () => {
    const controls = {
      'ctrl-1': { name: 'Button1' },
    } as any;

    const result = generateDuplicateName('Button1', controls);
    expect(result).toBe('Button1_Copy');
  });

  it('appends _Copy_2 when _Copy already exists', () => {
    const controls = {
      'ctrl-1': { name: 'Button1' },
      'ctrl-2': { name: 'Button1_Copy' },
    } as any;

    const result = generateDuplicateName('Button1', controls);
    expect(result).toBe('Button1_Copy_2');
  });

  it('increments copy number when duplicating a _Copy control', () => {
    const controls = {
      'ctrl-1': { name: 'Button1' },
      'ctrl-2': { name: 'Button1_Copy' },
    } as any;

    const result = generateDuplicateName('Button1_Copy', controls);
    expect(result).toBe('Button1_Copy_2');
  });

  it('increments copy number when duplicating a _Copy_N control', () => {
    const controls = {
      'ctrl-1': { name: 'Button1' },
      'ctrl-2': { name: 'Button1_Copy' },
      'ctrl-3': { name: 'Button1_Copy_2' },
    } as any;

    const result = generateDuplicateName('Button1_Copy_2', controls);
    expect(result).toBe('Button1_Copy_3');
  });

  it('skips to next available number when there are gaps', () => {
    const controls = {
      'ctrl-1': { name: 'Button1' },
      'ctrl-2': { name: 'Button1_Copy' },
      'ctrl-3': { name: 'Button1_Copy_2' },
      'ctrl-4': { name: 'Button1_Copy_3' },
    } as any;

    const result = generateDuplicateName('Button1', controls);
    expect(result).toBe('Button1_Copy_4');
  });

  it('handles names with special characters', () => {
    const controls = {
      'ctrl-1': { name: 'My Button (1)' },
    } as any;

    const result = generateDuplicateName('My Button (1)', controls);
    expect(result).toBe('My Button (1)_Copy');
  });
});

// ============================================================================
// findAvailablePlacement
// ============================================================================

describe('findAvailablePlacement', () => {
  const makeLayoutItem = (id: string, x: number, y: number, width: number, height: number) => ({
    id,
    containerId: null,
    desktop: { x, y, width, height, currentState: 0 },
    content: [],
  });

  it('returns {0, 0} when layoutV4 is null', () => {
    const result = findAvailablePlacement(makeLayoutItem('a', 0, 0, 4, 2) as LayoutItemV4, null as unknown as LayoutV4);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('returns {0, 0} when originalComponent is null', () => {
    const result = findAvailablePlacement(null as unknown as LayoutItemV4, emptyLayout as LayoutV4);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('places duplicate below original when space is available', () => {
    const original = makeLayoutItem('a', 0, 0, 4, 2);
    const layout = { content: [original] };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12);

    // Should be placed directly below: same x, y = origY + origHeight
    expect(result).toEqual({ x: 0, y: 2 });
  });

  it('places to the right when below is occupied', () => {
    const original = makeLayoutItem('a', 0, 0, 4, 2);
    const blocker = makeLayoutItem('b', 0, 2, 4, 2); // blocks directly below
    const layout = { content: [original, blocker] };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12);

    // Below is blocked, should try right: x = 0 + 4 = 4, y = 0
    expect(result).toEqual({ x: 4, y: 0 });
  });

  it('places to the left when below and right are occupied', () => {
    const original = makeLayoutItem('a', 4, 0, 4, 2);
    const blockerBelow = makeLayoutItem('b', 4, 2, 4, 2);
    const blockerRight = makeLayoutItem('c', 8, 0, 4, 2);
    const layout = { content: [original, blockerBelow, blockerRight] };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12);

    // Below blocked, right blocked, should try left: x = 4 - 4 = 0, y = 0
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('does not place to the right if it would exceed grid columns', () => {
    const original = makeLayoutItem('a', 8, 0, 4, 2);
    const blockerBelow = makeLayoutItem('b', 8, 2, 4, 2);
    // Right would be x=12, which exceeds 12-column grid
    const layout = { content: [original, blockerBelow] };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12);

    // Below blocked, right out of bounds, should try left: x = 8 - 4 = 4
    expect(result).toEqual({ x: 4, y: 0 });
  });

  it('does not place to the left if it would go negative', () => {
    const original = makeLayoutItem('a', 0, 0, 4, 2);
    const blockerBelow = makeLayoutItem('b', 0, 2, 4, 2);
    const blockerRight = makeLayoutItem('c', 4, 0, 4, 2);
    // Left would be x=-4, invalid
    const layout = { content: [original, blockerBelow, blockerRight] };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12);

    // Falls through to grid scan - should find first open spot
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
  });

  it('scans grid when all preferred positions are taken', () => {
    // Use 1x1 items on a 3-column grid so we can fill rows completely.
    // Original at (1,0). Fill rows 0 and 1 fully with other items overlapping original's position.
    const original = makeLayoutItem('a', 1, 0, 1, 1);
    const items = [
      original,
      // Row 0: cover all 3 columns (overlapper at x=1 ensures self-skip doesn't leave a gap)
      makeLayoutItem('b', 0, 0, 1, 1),
      makeLayoutItem('overlap', 1, 0, 1, 1), // overlaps original's position
      makeLayoutItem('c', 2, 0, 1, 1),
      // Row 1 (below original): fully covered
      makeLayoutItem('d', 0, 1, 1, 1),
      makeLayoutItem('e', 1, 1, 1, 1),
      makeLayoutItem('f', 2, 1, 1, 1),
    ];
    const layout = { content: items };

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 3);

    // Below blocked, right blocked (x=2+1 > 3), left blocked (x=0 occupied).
    // Grid scan from y=0: row 0 all blocked (overlap item covers self position), row 1 all blocked.
    // Should find first open at y=2.
    expect(result.y).toBeGreaterThanOrEqual(2);
  });

  it('accounts for pending items to prevent stacking during rapid duplication', () => {
    const original = makeLayoutItem('a', 0, 0, 4, 2);
    const layout = { content: [original] };

    // First duplicate would go at y=2, so mark that as pending
    const pendingItems = [{ id: 'pending-1', x: 0, y: 2, width: 4, height: 2, containerId: null }];

    const result = findAvailablePlacement(original as LayoutItemV4, layout as LayoutV4, 12, null, pendingItems);

    // y=2 is taken by pending, should go to y=4 or right
    expect(result.y !== 2 || result.x !== 0).toBe(true);
  });

  it('checks siblings only when inside a container', () => {
    const container = {
      id: 'container-1',
      containerId: null,
      desktop: { x: 0, y: 0, width: 12, height: 10, currentState: 0 },
      content: [makeLayoutItem('child-a', 0, 0, 4, 2)],
    };
    // Another item at root level that should NOT affect placement inside container
    const rootItem = makeLayoutItem('root-b', 0, 2, 12, 2);
    const layout = { content: [container, rootItem] };

    const childOriginal = container.content[0];
    const result = findAvailablePlacement(childOriginal as LayoutItemV4, layout as LayoutV4, 12, 'container-1');

    // Should place below child-a at y=2, ignoring root-b
    expect(result).toEqual({ x: 0, y: 2 });
  });
});
