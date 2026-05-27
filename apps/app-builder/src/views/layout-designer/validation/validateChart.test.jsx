import validateChart from './validateChart';

describe('validateChart', () => {
  test('returns valid when control and control.model exist', () => {
    const control = {
      model: {
        viewName: 'someView',
        columns: [{ name: 'XColumn' }, { name: 'YColumn' }],
      },
    };

    const result = validateChart(control);

    expect(result.isValid).toBe(true);
    expect(result.tableName).toBe(null);
    expect(result.columns).toEqual([null, null]);
  });
  test('returns invalid when moodel is not set', () => {
    const result = validateChart({});

    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe('Data source is required.');
    expect(result.columns).toEqual([null, null]);
  });

  test('returns invalid when viewname is not set', () => {
    const result = validateChart({ model: { columns: [] } });

    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe('Data source is required.');
    expect(result.columns).toEqual([null, null]);
  });

  test('returns invalid and sets columns when control.model.columns or their names are missing', () => {
    const invalidControls = [
      { model: { viewName: 'someView', columns: [{ name: 'XColumn' }] } },
      { model: { viewName: 'someView', columns: [{ name: '' }, { name: 'YColumn' }] } },
      { model: { viewName: 'someView', columns: [{ name: 'XColumn' }, { name: '' }] } },
      { model: { viewName: 'someView'} },
    ];

    let result = validateChart(invalidControls[0]);
    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe(null);
    expect(result.columns[1]).toBe('Y axis is required.');

    result = validateChart(invalidControls[1]);
    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe(null);
    expect(result.columns[0]).toBe('X axis is required.');

    result = validateChart(invalidControls[2]);
    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe(null);
    expect(result.columns[1]).toBe('Y axis is required.');

    result = validateChart(invalidControls[3]);
    expect(result.isValid).toBe(false);
    expect(result.tableName).toBe(null);
    expect(result.columns[0]).toBe('X axis is required.');
    expect(result.columns[1]).toBe('Y axis is required.');
  });
});
