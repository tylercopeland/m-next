/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseControl } from '@m-next/runtime-interface';
import {
  canDeleteControl,
  collectIdsToDelete,
  deleteControlFromLayout,
  getDeleteAction,
  removeControlsFromLayout,
} from './deleteControlHelper';

// ============================================================================
// Mocks
// ============================================================================

jest.mock('@m-next/runtime-interface', () => ({
  WIDGETS: {
    LAYOUT_CONTAINER: 'LCN',
    SECTION: 'SEC',
    BUTTONGROUP: 'BGR',
    CALENDAR: 'CAL',
    BUTTONGROUPITEM: 'BGI',
  },
}));

const mockHasControlReferences = jest.fn(() => false);
const mockGetControlEvents = jest.fn(() => ({ hasEvents: false, eventCount: 0, eventTypes: [] }));
const mockContainerOrChildrenHaveEvents = jest.fn(() => false);

jest.mock('../components/control-references-utils', () => ({
  hasControlReferences: (...args: unknown[]) => mockHasControlReferences(...args),
  getControlEvents: (...args: unknown[]) => mockGetControlEvents(...args),
  containerOrChildrenHaveEvents: (...args: unknown[]) => mockContainerOrChildrenHaveEvents(...args),
}));

// ============================================================================
// Test Helpers
// ============================================================================

const GUID_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const GUID_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const GUID_C = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const GUID_D = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const GUID_E = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

const makeControl = (overrides: Partial<BaseControl> & { containerId?: string } = {}): BaseControl =>
  ({
    id: GUID_A,
    type: 'BTN',
    name: 'Button1',
    ...overrides,
  }) as BaseControl;

const makeContainer = (overrides: Partial<BaseControl> & { containerId?: string } = {}): BaseControl =>
  makeControl({ type: 'LCN', name: 'Container1', ...overrides });

const makeSection = (overrides: Partial<BaseControl> & { containerId?: string } = {}): BaseControl =>
  makeControl({ type: 'SEC', name: 'Section1', ...overrides });

const makeBGR = (overrides: Partial<BaseControl> & { buttons?: BaseControl[] } = {}): BaseControl =>
  makeControl({ type: 'BGR', name: 'ButtonMenu1', ...overrides });

const makeCalendar = (overrides: Partial<BaseControl> & { buttons?: BaseControl[] } = {}): BaseControl =>
  makeControl({ type: 'CAL', name: 'Calendar1', ...overrides });

const emptyScreenData = {} as Record<string, unknown>;
const emptyScreenProps = {} as Record<string, unknown>;

// ============================================================================
// canDeleteControl
// ============================================================================

describe('canDeleteControl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns canDelete: false when control is null/undefined', () => {
    const result = canDeleteControl({
      control: null as any,
      controlList: {},
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: false, reason: 'Control not found' });
  });

  it('returns canDelete: true for a simple control with no references', () => {
    const ctrl = makeControl({ id: GUID_A });
    const result = canDeleteControl({
      control: ctrl,
      controlList: { [GUID_A]: ctrl },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: true });
  });

  it('returns canDelete: false when control has references', () => {
    mockHasControlReferences.mockReturnValueOnce(true);
    const ctrl = makeControl({ id: GUID_A });

    const result = canDeleteControl({
      control: ctrl,
      controlList: { [GUID_A]: ctrl },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: false, reason: 'Control has references' });
  });

  it('returns canDelete: true for an empty container', () => {
    const container = makeContainer({ id: GUID_A });

    const result = canDeleteControl({
      control: container,
      controlList: { [GUID_A]: container },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: true });
  });

  it('returns canDelete: true for a container whose children have no references', () => {
    const container = makeContainer({ id: GUID_A });
    const child = makeControl({ id: GUID_B, containerId: GUID_A } as any);

    const result = canDeleteControl({
      control: container,
      controlList: { [GUID_A]: container, [GUID_B]: child },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: true });
  });

  it('returns canDelete: false when a container child has references', () => {
    const container = makeContainer({ id: GUID_A });
    const child = makeControl({ id: GUID_B, name: 'ChildBtn', containerId: GUID_A } as any);

    // First call: container itself has no references
    // Second call: child has references
    mockHasControlReferences
      .mockReturnValueOnce(false) // container
      .mockReturnValueOnce(true); // child

    const result = canDeleteControl({
      control: container,
      controlList: { [GUID_A]: container, [GUID_B]: child },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({
      canDelete: false,
      reason: 'Container has children with references',
      referencedChildren: [{ controlId: GUID_B, controlName: 'ChildBtn' }],
    });
  });

  it('checks children for a SECTION the same as LAYOUT_CONTAINER', () => {
    const section = makeSection({ id: GUID_A });
    const child = makeControl({ id: GUID_B, name: 'SectionChild', containerId: GUID_A } as any);

    mockHasControlReferences
      .mockReturnValueOnce(false) // section
      .mockReturnValueOnce(true); // child

    const result = canDeleteControl({
      control: section,
      controlList: { [GUID_A]: section, [GUID_B]: child },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.canDelete).toBe(false);
    expect(result.reason).toBe('Container has children with references');
    expect(result.referencedChildren).toHaveLength(1);
  });

  it('uses flattened containerId lookup (not layoutV4 tree) for children', () => {
    const container = makeContainer({ id: GUID_A });
    const child1 = makeControl({ id: GUID_B, containerId: GUID_A } as any);
    const child2 = makeControl({ id: GUID_C, containerId: GUID_A } as any);
    const unrelated = makeControl({ id: GUID_D, containerId: GUID_E } as any);

    const result = canDeleteControl({
      control: container,
      controlList: {
        [GUID_A]: container,
        [GUID_B]: child1,
        [GUID_C]: child2,
        [GUID_D]: unrelated,
      },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({ canDelete: true });
    // hasControlReferences called once for container, once per child (B, C) — not for D
    expect(mockHasControlReferences).toHaveBeenCalledTimes(3);
  });
});

// ============================================================================
// deleteControlFromLayout
// ============================================================================

describe('deleteControlFromLayout', () => {
  it('returns layoutV4 unchanged when content is missing', () => {
    const layout = { someField: 'value' } as any;
    expect(deleteControlFromLayout(GUID_A, layout)).toEqual(layout);
  });

  it('returns layoutV4 unchanged when it is null/undefined', () => {
    expect(deleteControlFromLayout(GUID_A, null as any)).toBeNull();
    expect(deleteControlFromLayout(GUID_A, undefined as any)).toBeUndefined();
  });

  it('removes a top-level control from content', () => {
    const layout = {
      content: [
        { id: GUID_A, type: 'BTN' },
        { id: GUID_B, type: 'LBL' },
      ],
    };

    const result = deleteControlFromLayout(GUID_A, layout);
    expect(result.content).toHaveLength(1);
    expect(result.content![0].id).toBe(GUID_B);
  });

  it('does not remove controls that are not the target', () => {
    const layout = {
      content: [
        { id: GUID_A, type: 'BTN' },
        { id: GUID_B, type: 'LBL' },
      ],
    };

    const result = deleteControlFromLayout(GUID_C, layout);
    expect(result.content).toHaveLength(2);
  });

  it('only filters top-level content (does NOT recurse into nested content)', () => {
    const layout = {
      content: [
        {
          id: GUID_A,
          type: 'LCN',
          content: [{ id: GUID_B, type: 'BTN' }],
        },
      ],
    };

    // Trying to delete GUID_B should NOT remove it because deleteControlFromLayout
    // only filters top-level content — this documents current (limited) behavior.
    const result = deleteControlFromLayout(GUID_B, layout);
    expect(result.content).toHaveLength(1);
    expect((result.content![0] as any).content).toHaveLength(1);
  });
});

// ============================================================================
// getDeleteAction
// ============================================================================

describe('getDeleteAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns blocked when control is null', () => {
    const result = getDeleteAction({
      control: null as any,
      controlList: {},
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result).toEqual({
      action: 'blocked',
      isContainer: false,
      referencedChildren: [],
      blockReason: 'Control not found',
    });
  });

  it('returns "delete" for a simple control with no references or events', () => {
    const ctrl = makeControl({ id: GUID_A });

    const result = getDeleteAction({
      control: ctrl,
      controlList: { [GUID_A]: ctrl },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.action).toBe('delete');
    expect(result.isContainer).toBe(false);
  });

  it('returns "blocked" when control has references', () => {
    mockHasControlReferences.mockReturnValueOnce(true);
    const ctrl = makeControl({ id: GUID_A });

    const result = getDeleteAction({
      control: ctrl,
      controlList: { [GUID_A]: ctrl },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.action).toBe('blocked');
    expect(result.blockReason).toContain('referenced by other controls');
  });

  it('returns "showBlockedDialog" when container child has references', () => {
    const container = makeContainer({ id: GUID_A });
    const child = makeControl({ id: GUID_B, name: 'ChildBtn', containerId: GUID_A } as any);

    mockHasControlReferences
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const result = getDeleteAction({
      control: container,
      controlList: { [GUID_A]: container, [GUID_B]: child },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.action).toBe('showBlockedDialog');
    expect(result.isContainer).toBe(true);
    expect(result.referencedChildren).toHaveLength(1);
  });

  it('returns "showConfirmDialog" when control has events', () => {
    mockGetControlEvents.mockReturnValueOnce({
      hasEvents: true,
      eventCount: 2,
      eventTypes: ['onClick'],
    });
    const ctrl = makeControl({ id: GUID_A });

    const result = getDeleteAction({
      control: ctrl,
      controlList: { [GUID_A]: ctrl },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.action).toBe('showConfirmDialog');
  });

  it('returns "showConfirmDialog" when container children have events', () => {
    const container = makeContainer({ id: GUID_A });

    mockGetControlEvents.mockReturnValueOnce({ hasEvents: false, eventCount: 0, eventTypes: [] });
    mockContainerOrChildrenHaveEvents.mockReturnValueOnce(true);

    const result = getDeleteAction({
      control: container,
      controlList: { [GUID_A]: container },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
      layoutV4: { content: [] },
    });

    expect(result.action).toBe('showConfirmDialog');
    expect(result.isContainer).toBe(true);
  });

  it('returns "delete" for an empty container with no events or references', () => {
    const container = makeContainer({ id: GUID_A });

    const result = getDeleteAction({
      control: container,
      controlList: { [GUID_A]: container },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.action).toBe('delete');
    expect(result.isContainer).toBe(true);
  });

  it('identifies SECTION as a container type', () => {
    const section = makeSection({ id: GUID_A });

    const result = getDeleteAction({
      control: section,
      controlList: { [GUID_A]: section },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.isContainer).toBe(true);
    expect(result.action).toBe('delete');
  });

  it('does not treat BGR as a container', () => {
    const bgr = makeBGR({ id: GUID_A });

    const result = getDeleteAction({
      control: bgr,
      controlList: { [GUID_A]: bgr },
      screenData: emptyScreenData,
      screenProperties: emptyScreenProps,
    });

    expect(result.isContainer).toBe(false);
  });
});

// ============================================================================
// collectIdsToDelete
// ============================================================================

describe('collectIdsToDelete', () => {
  it('returns just the control ID for a simple control', () => {
    const controls = { [GUID_A]: makeControl({ id: GUID_A }) };
    const layout = { content: [{ id: GUID_A }] };

    expect(collectIdsToDelete(GUID_A, controls, layout)).toEqual([GUID_A]);
  });

  it('collects direct children of a container', () => {
    const controls = {
      [GUID_A]: makeContainer({ id: GUID_A }),
      [GUID_B]: makeControl({ id: GUID_B, containerId: GUID_A } as any),
      [GUID_C]: makeControl({ id: GUID_C, containerId: GUID_A } as any),
    };
    const layout = {
      content: [
        { id: GUID_A, content: [{ id: GUID_B }, { id: GUID_C }] },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toContain(GUID_C);
    expect(result).toHaveLength(3);
  });

  it('recursively collects deeply nested descendants of a container', () => {
    const controls = {
      [GUID_A]: makeContainer({ id: GUID_A }),
      [GUID_B]: makeContainer({ id: GUID_B, containerId: GUID_A } as any),
      [GUID_C]: makeControl({ id: GUID_C, containerId: GUID_B } as any),
    };
    const layout = {
      content: [
        {
          id: GUID_A,
          content: [
            { id: GUID_B, content: [{ id: GUID_C }] },
          ],
        },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toContain(GUID_C);
    expect(result).toHaveLength(3);
  });

  it('collects BGR button children (BGIs) when deleting a BGR directly', () => {
    const bgiControl1 = makeControl({ id: GUID_B, type: 'BGI' });
    const bgiControl2 = makeControl({ id: GUID_C, type: 'BGI' });
    const bgr = makeBGR({
      id: GUID_A,
      buttons: [bgiControl1, bgiControl2],
    } as any);

    const controls = {
      [GUID_A]: bgr,
      [GUID_B]: bgiControl1,
      [GUID_C]: bgiControl2,
    };
    const layout = { content: [{ id: GUID_A }] };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toContain(GUID_C);
    expect(result).toHaveLength(3);
  });

  it('collects Calendar button children when deleting a Calendar directly', () => {
    const bgi = makeControl({ id: GUID_B, type: 'BGI' });
    const cal = makeCalendar({
      id: GUID_A,
      buttons: [bgi],
    } as any);

    const controls = { [GUID_A]: cal, [GUID_B]: bgi };
    const layout = { content: [{ id: GUID_A }] };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toHaveLength(2);
  });

  it('collects BGR + BGI children when deleting a container that holds a BGR', () => {
    const bgi = makeControl({ id: GUID_C, type: 'BGI' });
    const bgr = makeBGR({
      id: GUID_B,
      containerId: GUID_A,
      buttons: [bgi],
    } as any);
    const container = makeContainer({ id: GUID_A });

    const controls = {
      [GUID_A]: container,
      [GUID_B]: bgr,
      [GUID_C]: bgi,
    };
    const layout = {
      content: [
        { id: GUID_A, content: [{ id: GUID_B }] },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A); // container
    expect(result).toContain(GUID_B); // BGR
    expect(result).toContain(GUID_C); // BGI (child of BGR)
    expect(result).toHaveLength(3);
  });

  it('collects Calendar + BGI children when deleting a container that holds a Calendar', () => {
    const bgi = makeControl({ id: GUID_C, type: 'BGI' });
    const cal = makeCalendar({
      id: GUID_B,
      containerId: GUID_A,
      buttons: [bgi],
    } as any);
    const container = makeContainer({ id: GUID_A });

    const controls = {
      [GUID_A]: container,
      [GUID_B]: cal,
      [GUID_C]: bgi,
    };
    const layout = {
      content: [
        { id: GUID_A, content: [{ id: GUID_B }] },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toContain(GUID_C);
    expect(result).toHaveLength(3);
  });

  it('handles container with mixed children: regular controls + BGR with BGIs', () => {
    const bgi1 = makeControl({ id: GUID_D, type: 'BGI' });
    const bgi2 = makeControl({ id: GUID_E, type: 'BGI' });
    const bgr = makeBGR({
      id: GUID_B,
      containerId: GUID_A,
      buttons: [bgi1, bgi2],
    } as any);
    const label = makeControl({ id: GUID_C, type: 'LBL', containerId: GUID_A } as any);
    const container = makeContainer({ id: GUID_A });

    const controls = {
      [GUID_A]: container,
      [GUID_B]: bgr,
      [GUID_C]: label,
      [GUID_D]: bgi1,
      [GUID_E]: bgi2,
    };
    const layout = {
      content: [
        { id: GUID_A, content: [{ id: GUID_B }, { id: GUID_C }] },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A); // container
    expect(result).toContain(GUID_B); // BGR
    expect(result).toContain(GUID_C); // label
    expect(result).toContain(GUID_D); // BGI
    expect(result).toContain(GUID_E); // BGI
    expect(result).toHaveLength(5);
  });

  it('catches orphaned controls via containerId even when not in layoutV4', () => {
    const container = makeContainer({ id: GUID_A });
    const orphan = makeControl({ id: GUID_B, containerId: GUID_A } as any);

    const controls = {
      [GUID_A]: container,
      [GUID_B]: orphan,
    };
    // Orphan not in layoutV4 content tree
    const layout = {
      content: [{ id: GUID_A, content: [] }],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toHaveLength(2);
  });

  it('does not duplicate IDs when control appears in both layout tree and containerId', () => {
    const container = makeContainer({ id: GUID_A });
    const child = makeControl({ id: GUID_B, containerId: GUID_A } as any);

    const controls = {
      [GUID_A]: container,
      [GUID_B]: child,
    };
    const layout = {
      content: [{ id: GUID_A, content: [{ id: GUID_B }] }],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toHaveLength(2);
    expect(result.filter((id) => id === GUID_B)).toHaveLength(1);
  });

  it('does not collect children for non-container types', () => {
    const bgr = makeBGR({ id: GUID_A });
    const unrelated = makeControl({ id: GUID_B, containerId: GUID_A } as any);

    const controls = { [GUID_A]: bgr, [GUID_B]: unrelated };
    const layout = {
      content: [{ id: GUID_A, content: [{ id: GUID_B }] }],
    };

    // BGR is not a container type, so containerId scan should NOT run.
    // Only the BGR buttons cleanup runs.
    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toEqual([GUID_A]);
  });

  it('collects BGIs from a BGR inside a deeply nested container', () => {
    const bgi = makeControl({ id: GUID_D, type: 'BGI' });
    const bgr = makeBGR({
      id: GUID_C,
      containerId: GUID_B,
      buttons: [bgi],
    } as any);
    const innerContainer = makeContainer({ id: GUID_B, containerId: GUID_A } as any);
    const outerContainer = makeContainer({ id: GUID_A });

    const controls = {
      [GUID_A]: outerContainer,
      [GUID_B]: innerContainer,
      [GUID_C]: bgr,
      [GUID_D]: bgi,
    };
    const layout = {
      content: [
        {
          id: GUID_A,
          content: [
            { id: GUID_B, content: [{ id: GUID_C }] },
          ],
        },
      ],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A); // outer container
    expect(result).toContain(GUID_B); // inner container
    expect(result).toContain(GUID_C); // BGR
    expect(result).toContain(GUID_D); // BGI
    expect(result).toHaveLength(4);
  });

  it('collects children for a Section the same as a container', () => {
    const section = makeSection({ id: GUID_A });
    const child = makeControl({ id: GUID_B, containerId: GUID_A } as any);

    const controls = { [GUID_A]: section, [GUID_B]: child };
    const layout = {
      content: [{ id: GUID_A, content: [{ id: GUID_B }] }],
    };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toContain(GUID_A);
    expect(result).toContain(GUID_B);
    expect(result).toHaveLength(2);
  });

  it('handles control not found in controls map gracefully', () => {
    const controls = {};
    const layout = { content: [{ id: GUID_A }] };

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toEqual([GUID_A]);
  });

  it('handles layoutV4 with no content', () => {
    const ctrl = makeControl({ id: GUID_A });
    const controls = { [GUID_A]: ctrl };
    const layout = {} as any;

    const result = collectIdsToDelete(GUID_A, controls, layout);
    expect(result).toEqual([GUID_A]);
  });
});

// ============================================================================
// removeControlsFromLayout
// ============================================================================

describe('removeControlsFromLayout', () => {
  it('returns layout unchanged when content is missing', () => {
    const layout = { someField: 'value' } as any;
    expect(removeControlsFromLayout(layout, [GUID_A])).toEqual(layout);
  });

  it('returns layout unchanged when it is null/undefined', () => {
    expect(removeControlsFromLayout(null as any, [GUID_A])).toBeNull();
    expect(removeControlsFromLayout(undefined as any, [GUID_A])).toBeUndefined();
  });

  it('removes a top-level control by ID', () => {
    const layout = {
      content: [{ id: GUID_A }, { id: GUID_B }],
    };

    const result = removeControlsFromLayout(layout, [GUID_A]);
    expect(result.content).toHaveLength(1);
    expect((result.content as any[])[0].id).toBe(GUID_B);
  });

  it('removes multiple controls at once', () => {
    const layout = {
      content: [{ id: GUID_A }, { id: GUID_B }, { id: GUID_C }],
    };

    const result = removeControlsFromLayout(layout, [GUID_A, GUID_C]);
    expect(result.content).toHaveLength(1);
    expect((result.content as any[])[0].id).toBe(GUID_B);
  });

  it('recursively removes nested controls', () => {
    const layout = {
      content: [
        {
          id: GUID_A,
          content: [
            { id: GUID_B },
            { id: GUID_C },
          ],
        },
      ],
    };

    const result = removeControlsFromLayout(layout, [GUID_B]);
    const container = (result.content as any[])[0];
    expect(container.content).toHaveLength(1);
    expect(container.content[0].id).toBe(GUID_C);
  });

  it('removes an entire container and its children from the tree', () => {
    const layout = {
      content: [
        {
          id: GUID_A,
          content: [{ id: GUID_B }, { id: GUID_C }],
        },
        { id: GUID_D },
      ],
    };

    const result = removeControlsFromLayout(layout, [GUID_A, GUID_B, GUID_C]);
    expect(result.content).toHaveLength(1);
    expect((result.content as any[])[0].id).toBe(GUID_D);
  });

  it('removes deeply nested controls (3 levels deep)', () => {
    const layout = {
      content: [
        {
          id: GUID_A,
          content: [
            {
              id: GUID_B,
              content: [{ id: GUID_C }],
            },
          ],
        },
      ],
    };

    const result = removeControlsFromLayout(layout, [GUID_C]);
    const outerContainer = (result.content as any[])[0];
    const innerContainer = outerContainer.content[0];
    expect(innerContainer.content).toHaveLength(0);
  });

  it('does not mutate the original layout', () => {
    const layout = {
      content: [{ id: GUID_A }, { id: GUID_B }],
    };

    const result = removeControlsFromLayout(layout, [GUID_A]);
    expect(layout.content).toHaveLength(2); // original unchanged
    expect(result.content).toHaveLength(1);
  });

  it('handles empty idsToRemove gracefully', () => {
    const layout = {
      content: [{ id: GUID_A }, { id: GUID_B }],
    };

    const result = removeControlsFromLayout(layout, []);
    expect(result.content).toHaveLength(2);
  });
});
