import { expect } from '@jest/globals';
import { compareCompactionItemArrays, areCompactionItemArraysEqual } from './gridItemArrayEqualityTester';
import { CompactionItem } from './compact';

describe('CompactionItem Array Equality Tester', () => {
  beforeAll(() => {
    expect.addEqualityTesters([areCompactionItemArraysEqual]);
  });

  it('compares equal arrays regardless of order', () => {
    const array1: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
    ];

    const array2: CompactionItem[] = [
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
    ];

    expect(array1).toEqual(array2);
  });

  it('detects missing items', () => {
    const array1: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1 }];

    const array2: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
    ];

    expect(array1).not.toEqual(array2);
  });

  it('detects property differences', () => {
    const array1: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1 }];

    const array2: CompactionItem[] = [{ id: 'a', x: 5, y: 10, w: 2, h: 3 }];

    expect(array1).not.toEqual(array2);
  });

  it('shows all differences when arrays do not match', () => {
    const array1: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'c', x: 2, y: 2, w: 1, h: 1 },
    ];

    const array2: CompactionItem[] = [
      { id: 'a', x: 5, y: 10, w: 2, h: 3 },
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
    ];

    const result = compareCompactionItemArrays(array1, array2);

    expect(result.equal).toBe(false);
    expect(result.differences).toContain('Missing item with id: "b"');
    expect(result.differences).toContain('Unexpected item with id: "c"');
    expect(result.differences.some((d) => d.includes('Item with id "a" has different properties'))).toBe(true);
    expect(result.differences.some((d) => d.includes('x: expected 5, received 0'))).toBe(true);
    expect(result.differences.some((d) => d.includes('y: expected 10, received 0'))).toBe(true);
    expect(result.differences.some((d) => d.includes('w: expected 2, received 1'))).toBe(true);
    expect(result.differences.some((d) => d.includes('h: expected 3, received 1'))).toBe(true);
  });

  it('handles empty arrays', () => {
    const array1: CompactionItem[] = [];
    const array2: CompactionItem[] = [];

    expect(array1).toEqual(array2);
  });
});
