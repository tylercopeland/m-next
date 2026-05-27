import { parseDropdownData } from './dropdownDataParser';

describe('parseDropdownData', () => {
  it('returns empty options for null data', () => {
    const result = parseDropdownData(null);
    expect(result).toEqual({ options: [], hasMultiLine: false });
  });

  it('returns empty options for undefined data', () => {
    const result = parseDropdownData(undefined);
    expect(result).toEqual({ options: [], hasMultiLine: false });
  });

  it('returns empty options for empty array', () => {
    const result = parseDropdownData([]);
    expect(result).toEqual({ options: [], hasMultiLine: false });
  });

  it('handles single-column rows (value used as label)', () => {
    const data = [{ col0: 'Alpha' }, { col0: 'Beta' }];
    const result = parseDropdownData(data);
    expect(result.options).toEqual([
      { label: 'Alpha', value: 'Alpha', lines: undefined },
      { label: 'Beta', value: 'Beta', lines: undefined },
    ]);
    expect(result.hasMultiLine).toBe(false);
  });

  it('handles two-column rows (value + label)', () => {
    const data = [
      { RecordID: '1', Name: 'Alice' },
      { RecordID: '2', Name: 'Bob' },
    ];
    const result = parseDropdownData(data);
    expect(result.options).toEqual([
      { label: 'Alice', value: '1', lines: undefined },
      { label: 'Bob', value: '2', lines: undefined },
    ]);
    expect(result.hasMultiLine).toBe(false);
  });

  it('handles three+ column rows (multiLine)', () => {
    const data: Record<string, string>[] = [
      { RecordID: '1', Name: 'Alice', Email: 'alice@test.com' },
      { RecordID: '2', Name: 'Bob', Email: 'bob@test.com', Phone: '555-1234' },
    ];
    const result = parseDropdownData(data);
    expect(result.options).toEqual([
      { label: 'Alice', value: '1', lines: ['alice@test.com'] },
      { label: 'Bob', value: '2', lines: ['bob@test.com', '555-1234'] },
    ]);
    expect(result.hasMultiLine).toBe(true);
  });

  it('handles empty string values', () => {
    const data = [{ RecordID: '', Name: '' }];
    const result = parseDropdownData(data);
    expect(result.options).toEqual([{ label: '', value: '', lines: undefined }]);
  });

  it('handles mixed column counts across rows', () => {
    const data: Record<string, string>[] = [
      { RecordID: '1', Name: 'Alice' },
      { RecordID: '2', Name: 'Bob', Email: 'bob@test.com' },
    ];
    const result = parseDropdownData(data);
    expect(result.options).toHaveLength(2);
    expect(result.options[0]!.lines).toBeUndefined();
    expect(result.options[1]!.lines).toEqual(['bob@test.com']);
    expect(result.hasMultiLine).toBe(true);
  });
});
