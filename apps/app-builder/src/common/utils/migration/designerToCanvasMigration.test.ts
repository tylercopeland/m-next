import { createDesignerToCanvasMigration } from './designerToCanvasMigration';
import { COLUMN_TYPES } from './constants';
import { CurrentState } from '@m-next/types';

describe('DesignerToCanvasMigration', () => {
  describe('migrate', () => {
    test('successfully migrates empty layout', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {},
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.layoutV4Payload.LayoutV4?.v1).toBeDefined();
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toEqual([]);
    });

    test('migrates simple control to canvas', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'btn-1',
                  Type: 'BTN',
                  Caption: 'Click Me',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'btn-1': {
              id: 'btn-1',
              Type: 'BTN',
              caption: 'Click Me',
            },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toHaveLength(1);
      expect(result.layoutV4Payload.LayoutV4?.v1.content[0].id).toBe('btn-1');
      expect(result.layoutV4Payload.LayoutV4?.v1.content[0].desktop.x).toBe(0);
      expect(result.layoutV4Payload.LayoutV4?.v1.content[0].desktop.y).toBe(0);
    });

    test('migrates nested row and column layout', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'row-1',
                  Type: 'L-ROW',
                  Content: [
                    {
                      Id: 'col-1',
                      Type: 'L-COL',
                      Width: '6',
                      Content: [
                        {
                          Id: 'btn-1',
                          Type: 'BTN',
                        },
                      ],
                    },
                    {
                      Id: 'col-2',
                      Type: 'L-COL',
                      Width: '6',
                      Content: [
                        {
                          Id: 'btn-2',
                          Type: 'BTN',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'btn-1': { id: 'btn-1', Type: 'BTN' },
            'btn-2': { id: 'btn-2', Type: 'BTN' },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toHaveLength(2);

      // First button should be in left column
      const btn1 = result.layoutV4Payload.LayoutV4?.v1.content.find((item) => item.id === 'btn-1');
      expect(btn1).toBeDefined();
      expect(btn1?.desktop.x).toBe(0);
      expect(btn1?.desktop.width).toBe(6);

      // Second button should be in right column
      const btn2 = result.layoutV4Payload.LayoutV4?.v1.content.find((item) => item.id === 'btn-2');
      expect(btn2).toBeDefined();
      expect(btn2?.desktop.x).toBe(6);
      expect(btn2?.desktop.width).toBe(6);
    });

    test('migrates legacy grid to editable grid', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'grid-1',
                  Type: 'GRD',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'grid-1': {
              id: 'grid-1',
              Type: 'GRD',
              IsComplexType: true,
              name: 'testGrid',
              model: {
                columns: [],
              },
              filterDef: [],
            },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.migratedControlsCount).toBe(1);

      // Should create new control with new ID
      const layoutContent = result.layoutV4Payload.LayoutV4?.v1.content;
      expect(layoutContent).toHaveLength(1);
      expect(layoutContent?.[0].id).not.toBe('grid-1'); // New ID should be different

      // Should have new EDT control in controls
      const newId = layoutContent?.[0].id;
      expect(result.layoutV4Payload.controls?.v1?.[newId as string]).toBeDefined();
      expect(result.layoutV4Payload.controls?.v1?.[newId as string].Type).toBe('EDT');
    });

    test('skips APP_RIBBON controls', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'ribbon-1',
                  Type: 'APR',
                },
                {
                  Id: 'btn-1',
                  Type: 'BTN',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'ribbon-1': { id: 'ribbon-1', Type: 'APR' },
            'btn-1': { id: 'btn-1', Type: 'BTN' },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.skippedControlsCount).toBe(1);
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toHaveLength(1);
      expect(result.layoutV4Payload.LayoutV4?.v1.content[0].id).toBe('btn-1');
    });

    test('skips ICON controls', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'icon-1',
                  Type: 'ICON',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'icon-1': { id: 'icon-1', Type: 'ICON' },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      expect(result.skippedControlsCount).toBe(1);
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toHaveLength(0);
    });

    test('converts expression columns to formula in controls', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'grid-1': {
              id: 'grid-1',
              Type: 'EDT',
              columns: [
                {
                  field: 'FullName',
                  columnType: COLUMN_TYPES.EXPRESSION,
                  expression: [
                    {
                      source: {
                        valueType: 1,
                        value: 'FirstName',
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      const gridControl = result.layoutV4Payload.controls?.v1?.['grid-1'];
      expect(gridControl.columns[0].columnType).toBe(COLUMN_TYPES.FORMULA);
      expect(gridControl.columns[0].formula).toBeTruthy();
      expect(gridControl.columns[0].expression).toBeNull();
    });

    test('handles hidden controls', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'btn-1',
                  Type: 'BTN',
                  LegacyClass: 'controlHide',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'btn-1': { id: 'btn-1', Type: 'BTN', LegacyClass: 'controlHide' },
          },
        },
        LayoutV4: {},
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      const layoutItem = result.layoutV4Payload.LayoutV4?.v1.content[0];
      expect(layoutItem?.desktop.currentState).toBe(1); // Hidden state
    });

    test('handles missing versionId', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            layout: {
              Content: [],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {},
        LayoutV4: {
          'container-1': {
            canvasId: 'container-1',
            type: 'Grid',
            content: [],
          },
        },
      };

      const result = migration.migrate(designerPayload, layoutV4Payload);

      expect(result.success).toBe(true);
      expect(result.layoutV4Payload.LayoutV4?.['container-1']).toBeDefined();
    });

    test('preserves existing controls in LayoutV4', () => {
      const migration = createDesignerToCanvasMigration();

      const designerPayload = {
        Data: {
          screen: {
            versionId: 'v1',
            layout: {
              Content: [
                {
                  Id: 'btn-1',
                  Type: 'BTN',
                },
              ],
            },
          },
        },
      };

      const layoutV4Payload = {
        controls: {
          v1: {
            'btn-1': { id: 'btn-1', Type: 'BTN' },
            'btn-2': { id: 'btn-2', Type: 'BTN' },
          },
        },
        LayoutV4: {
          v1: {
            canvasId: 'v1',
            type: 'Grid',
            size: 12,
            content: [
              {
                id: 'btn-2',
                containerId: null,
                desktop: { x: 0, y: 0, width: 12, height: 2, currentState: CurrentState.REGULAR },
                tabletOverride: null,
                mobileOverride: null,
                content: [],
              },
            ],
          },
        },
      };

      const result = migration.migrate(designerPayload, layoutV4Payload, 'v1');

      expect(result.success).toBe(true);
      // Should have both btn-1 (from designer) and btn-2 (existing in v4)
      expect(result.layoutV4Payload.LayoutV4?.v1.content).toHaveLength(2);
    });
  });
});
