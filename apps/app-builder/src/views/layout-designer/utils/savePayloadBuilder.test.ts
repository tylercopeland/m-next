import { buildV4ControlsPayload, transformScreenProperties, buildSaveRequestBody } from './savePayloadBuilder';

describe('buildV4ControlsPayload', () => {
  it('merges existing controls with version changes', () => {
    const controls = {
      c1: { id: 'c1', Type: 'BTN', name: 'Save', caption: 'Save' },
    };
    const changes = {
      c1: { caption: 'Updated Save' },
    };
    const result = buildV4ControlsPayload(controls, changes);

    expect(result.c1.id).toBe('c1');
    expect(result.c1.Type).toBe('BTN');
    expect(result.c1.caption).toBe('Updated Save');
  });

  it('includes new controls from changes not in existing controls', () => {
    const controls = {};
    const changes = {
      c2: { id: 'c2', Type: 'TXT', name: 'NewField', caption: 'New Field' },
    };
    const result = buildV4ControlsPayload(controls, changes);

    expect(result.c2).toBeDefined();
    expect(result.c2.Type).toBe('TXT');
  });

  it('defaults input control defaultValue to null', () => {
    const controls = {
      c1: { id: 'c1', Type: 'TXT', TypeOverride: 'TXT', name: 'Input' },
    };
    const result = buildV4ControlsPayload(controls, {});

    expect(result.c1.defaultValue).toBeNull();
  });

  it('preserves explicit defaultValue for input controls', () => {
    const controls = {
      c1: { id: 'c1', Type: 'TXT', TypeOverride: 'TXT', name: 'Input', defaultValue: 'Hello' },
    };
    const result = buildV4ControlsPayload(controls, {});

    expect(result.c1.defaultValue).toBe('Hello');
  });

  it('transforms staticLayout to enableCompaction for L-CON controls', () => {
    const controls = {
      c1: { id: 'c1', Type: 'L-CON', name: 'Container', staticLayout: true },
    };
    const result = buildV4ControlsPayload(controls, {});

    expect(result.c1.enableCompaction).toBe(false);
  });

  it('preserves additional control-specific properties', () => {
    const controls = {
      c1: { id: 'c1', Type: 'DRP', name: 'Dropdown', model: { viewName: 'MyTable' }, customProp: 42 },
    };
    const result = buildV4ControlsPayload(controls, {});

    expect(result.c1.model).toEqual({ viewName: 'MyTable' });
    expect(result.c1.customProp).toBe(42);
  });

  it('handles empty controls and changes', () => {
    const result = buildV4ControlsPayload({}, {});
    expect(result).toEqual({});
  });

  describe('NCNG-582: bound LBL controls must not fall back to content/caption for defaultValue', () => {
    it('LBL isBound=true: defaultValue is null even when content="Label_2"', () => {
      const controls = {
        lbl1: { id: 'lbl1', Type: 'LBL', name: 'CompanyName', isBound: true, content: 'Label_2', caption: 'Label_2' },
      };
      const result = buildV4ControlsPayload(controls, {});

      expect(result.lbl1.defaultValue).toBeNull();
    });

    it('LBL isBound=true: defaultValue is null when defaultValue was explicitly cleared (undefined)', () => {
      const controls = {
        lbl1: { id: 'lbl1', Type: 'LBL', name: 'CompanyName', isBound: true, defaultValue: undefined, content: 'Label_2' },
      };
      const result = buildV4ControlsPayload(controls, {});

      expect(result.lbl1.defaultValue).toBeNull();
    });

    it('LBL isBound=false: defaultValue still falls back to content (static label unaffected)', () => {
      const controls = {
        lbl1: { id: 'lbl1', Type: 'LBL', name: 'WelcomeLabel', isBound: false, content: 'Welcome', caption: 'Welcome' },
      };
      const result = buildV4ControlsPayload(controls, {});

      expect(result.lbl1.defaultValue).toBe('Welcome');
    });

    it('LBL isBound=true with an explicit non-null defaultValue: preserves it (e.g. user set a default via ComplexValue)', () => {
      const controls = {
        lbl1: { id: 'lbl1', Type: 'LBL', name: 'CompanyName', isBound: true, defaultValue: { valueType: 9, value: 'N/A' } },
      };
      const result = buildV4ControlsPayload(controls, {});

      expect(result.lbl1.defaultValue).toEqual({ valueType: 9, value: 'N/A' });
    });

    it('value=undefined on a bound LBL is saved as null (line 156: control.value || null)', () => {
      const controls = {
        lbl1: { id: 'lbl1', Type: 'LBL', name: 'CompanyName', isBound: true, value: undefined },
      };
      const result = buildV4ControlsPayload(controls, {});

      expect(result.lbl1.value).toBeNull();
    });
  });
});

describe('transformScreenProperties', () => {
  it('transforms staticLayout true to enableCompaction false', () => {
    const result = transformScreenProperties({ staticLayout: true, color: 'blue' });
    expect(result.enableCompaction).toBe(false);
    expect(result.color).toBe('blue');
    expect(result.staticLayout).toBeUndefined();
  });

  it('transforms staticLayout false to enableCompaction true', () => {
    const result = transformScreenProperties({ staticLayout: false });
    expect(result.enableCompaction).toBe(true);
  });

  it('omits enableCompaction when staticLayout is not set', () => {
    const result = transformScreenProperties({ color: 'red' });
    expect(result.enableCompaction).toBeUndefined();
    expect(result.color).toBe('red');
  });

  it('handles undefined input', () => {
    const result = transformScreenProperties(undefined);
    expect(result).toEqual({});
  });
});

describe('buildSaveRequestBody', () => {
  it('assembles complete request body', () => {
    const result = buildSaveRequestBody({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controlsPayload: { c1: { id: 'c1' } } as any,
      versionId: 'v1',
      actionUpserts: { a1: {} },
      ribbonConfiguration: {},
      ribbonVisualization: {},
      transformedScreenProperties: { enableCompaction: true },
      layoutV4: { canvasId: 'canvas1', content: [] },
      isV4Screen: true,
    });

    expect(result.controls).toEqual({ v1: { c1: { id: 'c1' } } });
    expect(result.screenProperties).toEqual({ v1: { enableCompaction: true } });
    expect(result.LayoutV4).toEqual({ v1: { canvasId: 'canvas1', content: [] } });
    expect(result.isV4Screen).toBe(true);
  });

  it('omits LayoutV4 when null', () => {
    const result = buildSaveRequestBody({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      controlsPayload: {} as any,
      versionId: 'v1',
      actionUpserts: {},
      ribbonConfiguration: {},
      ribbonVisualization: {},
      transformedScreenProperties: {},
      layoutV4: null,
      isV4Screen: false,
    });

    expect(result.LayoutV4).toBeUndefined();
  });
});
