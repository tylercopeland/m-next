import { expect } from '@jest/globals';
import { compact, collides, DynamicData, CompactionItem, CompactionItemIn } from './compact';
import { areCompactionItemArraysEqual } from './gridItemArrayEqualityTester';

describe('Compaction Algorithm', () => {
  beforeAll(() => {
    expect.addEqualityTesters([areCompactionItemArraysEqual]);
  });

  // BASIC //
  it('handles empty layout', () => {
    const base: CompactionItemIn[] = [];
    const dynamic: DynamicData[] = [];
    const expected: CompactionItem[] = [];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('keeps layout identical when layout does not change from base', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 1, hidden: false }];
    const expected: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1 }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('responds to dynamic height changes', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 3, hidden: false }];
    const expected: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 3 }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('has minimum size of base layout', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 2, hidden: false }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 1, hidden: false }];
    const expected: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 2 }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // COMPACT / EXPAND //

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   c   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 b   c   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('pushes row group down when component above grows and collides', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c', x: 1, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 0, y: 2, w: 1, h: 1 },
      { id: 'c', x: 1, y: 2, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   b   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('does not push a row when component grows into row but does not collide', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 1, y: 1, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 .   c   c   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 .   b   .   .   .   .
   *   2 .   c   c   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('second row group item is used in calculation', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 0, w: 1, h: 1, hidden: false },
      { id: 'c', x: 1, y: 1, w: 2, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 2, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 1, y: 0, w: 1, h: 2 },
      { id: 'c', x: 1, y: 2, w: 2, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 c   c   .   .   .   .
   *   2 c   c   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 .   b   .   .   .   .
   *   3 c   c   .   .   .   .
   *   4 c   c   .   .   .   .
   */
  it('pushes by the greatest height of colliding components', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 0, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 1, w: 2, h: 2, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 2, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 1, y: 0, w: 1, h: 3 },
      { id: 'c', x: 0, y: 3, w: 2, h: 2 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 c   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 b   .   .   .   .   .
   *   4 c   .   .   .   .   .
   */
  it('handles multiple growing row groups', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 2, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 0, y: 2, w: 1, h: 2 },
      { id: 'c', x: 0, y: 4, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 c   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 a   .   .   .   .   .
   *   4 a   .   .   .   .   .
   *   5 c   .   .   .   .   .
   */
  it('row group adjacent, non-colliding and within height range of growing component keeps relative position', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 3, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 5, hidden: false },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 5 },
      { id: 'b', x: 1, y: 1, w: 1, h: 1 },
      { id: 'c', x: 0, y: 5, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c, d=d]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 c   .   .   .   .   .
   *   2 .   d   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c, d=d]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 c   b   .   .   .   .
   *   2 .   b   .   .   .   .
   *   3 .   d   .   .   .   .
   */
  it('collides with row beyond next row', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 0, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 1, w: 1, h: 1, hidden: false },
      { id: 'd', x: 1, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 1, hidden: false },
      { id: 'd', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 1, y: 0, w: 1, h: 3 },
      { id: 'c', x: 0, y: 1, w: 1, h: 1 },
      { id: 'd', x: 1, y: 3, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // SPACER //

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('preserves spacer row', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 0, y: 2, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('preserves top spacer', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 2, w: 1, h: 1, hidden: false }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 1, hidden: false }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(base);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 b   .   .   .   .   .
   */
  it('preserves spacer when expanding', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 0, y: 3, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   a   .   .   .
   *   1 a   a   a   .   .   .
   *   2 a   a   a   b   b   b
   *   3 .   .   .   b   b   b
   *   4 .   .   .   b   b   b
   *   5 c   c   c   c   c   c
   *   6 c   c   c   c   c   c
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   a   .   .   .
   *   1 a   a   a   .   .   .
   *   2 a   a   a   b   b   b
   *   3 .   .   .   b   b   b
   *   4 .   .   .   b   b   b
   *   5 c   c   c   c   c   c
   *   6 c   c   c   c   c   c
   */
  it('overlapping row groups do not create spacer', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 3, h: 3, hidden: false },
      { id: 'b', x: 3, y: 2, w: 3, h: 3, hidden: false },
      { id: 'c', x: 0, y: 5, w: 6, h: 2, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 2, hidden: false },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(base);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 c   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 b   .   .   .   .   .
   *   4 .   .   .   .   .   .
   *   5 c   .   .   .   .   .
   */
  it('spacer zebra pattern', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 2, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 4, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 0, y: 3, w: 1, h: 1 },
      { id: 'c', x: 0, y: 5, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('preserves spacer when row above is hidden', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: false },
    ];
    // a is hidden (h=0) at y=0; b shifts up by the freed visible height (1), spacer preserved as gap
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 0, y: 1, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 b   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 .   .   .   .   .   .
   *   5 b   .   .   .   .   .
   */
  it('preserves multiple spacers when component grows into them', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 3, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3 },
      { id: 'b', x: 0, y: 5, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // HIDDEN //
  /*
   * === BASE ===
   *   [a=a | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 ah  .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('returns hidden component with h=0', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 1, hidden: true }];
    const expected: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 0 }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 ah  .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('displays hidden component made visible', () => {
    const base: CompactionItemIn[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true }];
    const dynamic: DynamicData[] = [{ id: 'a', height: 1, hidden: false }];
    const expected: CompactionItem[] = [{ id: 'a', x: 0, y: 0, w: 1, h: 1 }];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 ah  bh  .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  b~  .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('returns all components with h=0 when entire row is hidden in dynamic', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true },
      { id: 'b', x: 1, y: 0, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 1, y: 0, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a~/b .    .    .    .    .
   *   1 .    .    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   */
  it('compacts rows when visible is made hidden, returns hidden item with h=0', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: false },
    ];
    // a is hidden (h=0) and stays at its base y=0; b moves up by the freed row height
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 0, y: 0, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 ah  .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('expands when hidden is made visible', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 0, y: 1, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 ah   .    .    .    .    .
   *   1 ah/b .    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 b   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('expands when hidden is made visible v2', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2, hidden: true },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 0, y: 2, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   b   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  b   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('keeps row if at least one component is visible', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 0, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: false },
    ];
    // row is kept because b is visible; a is returned with h=0 at the same y
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c, d=d]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   .   c   .   .   .
   *   2 .   d   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c, d=d | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a~/b .    c    .    .    .
   *   1 .    d    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   */
  it('places components relative to the base layout when component is hidden', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c', x: 2, y: 1, w: 1, h: 1, hidden: false },
      { id: 'd', x: 1, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
      { id: 'd', height: 1, hidden: false },
    ];
    // a is hidden (h=0) at y=0; b, c, d shift up by 1
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 0, y: 0, w: 1, h: 1 },
      { id: 'c', x: 2, y: 0, w: 1, h: 1 },
      { id: 'd', x: 1, y: 1, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // initially hidden component below initially visible component
  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 ah/b .    .    .    .    .
   *   1 .    .    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   *
   * === EXPECTED ===
   *   [a=a, b=b]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 b   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('hidden and visible at same position', () => {
    const base1: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true },
      { id: 'b', x: 0, y: 0, w: 1, h: 1, hidden: false },
    ];
    // same layout but ordering is different
    const base2: CompactionItemIn[] = [
      { id: 'b', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1 },
      { id: 'b', x: 0, y: 1, w: 1, h: 1 },
    ];
    const actual1 = compact(base1, dynamic);
    expect(actual1).toEqual(expected);
    const actual2 = compact(base2, dynamic);
    expect(actual2).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0     1     2     3     4     5
   *    ------------------------------------
   *   0 ah/bh .     .     .     .     .
   *   1 .     .     .     .     .     .
   *   2 .     .     .     .     .     .
   *   3 .     .     .     .     .     .
   */
  it('multiple hidden items in same position', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: true },
      { id: 'b', x: 0, y: 0, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: false },
    ];
    const actual = compact(base, dynamic);
    expect(actual.length).toBe(2);
    expect(actual[0]!.x).toBe(actual[1]!.x);
    expect(collides(actual[0]!, actual[1]!)).toBe(false);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c, d=d | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a    a/ch b/ch b/dh dh   .
   *   1 .    .    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c, d=d]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   c   c   d   d   .
   *   1 a   a   b   b   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('multiple position overlaps between hidden and visible', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 1, hidden: false },
      { id: 'b', x: 2, y: 0, w: 2, h: 1, hidden: false },
      { id: 'c', x: 1, y: 0, w: 2, h: 1, hidden: true },
      { id: 'd', x: 3, y: 0, w: 2, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
      { id: 'd', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'c', x: 1, y: 0, w: 2, h: 1 },
      { id: 'd', x: 3, y: 0, w: 2, h: 1 },
      { id: 'a', x: 0, y: 1, w: 2, h: 1 },
      { id: 'b', x: 2, y: 1, w: 2, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   bh  .   .   .
   *   1 a   a/c c   c   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   b   .   .   .
   *   1 a   a   b   .   .   .
   *   2 .   .   b   .   .   .
   *   3 .   c   c   c   .   .
   */
  it('newly visible expands group row height correctly', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 2, hidden: false },
      { id: 'b', x: 2, y: 0, w: 1, h: 1, hidden: true },
      { id: 'c', x: 1, y: 1, w: 3, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 2 },
      { id: 'b', x: 2, y: 0, w: 1, h: 3 },
      { id: 'c', x: 1, y: 3, w: 3, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a/bh .    .    .    .    .
   *   1 bh/c .    .    .    .    .
   *   2 .    .    .    .    .    .
   *   3 .    .    .    .    .    .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a~/b .    .    .    .    .
   *   1 b    .    .    .    .    .
   *   2 c    .    .    .    .    .
   *   3 .    .    .    .    .    .
   */
  it('toggle to hidden component with greater height expands correctly', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 0, w: 1, h: 2, hidden: true },
      { id: 'c', x: 0, y: 1, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 2, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    // a becomes hidden (h=0) at y=0; b replaces it in the same row group and expands to h=2;
    // c is pushed down to y=2 by the collision pass
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 0, y: 0, w: 1, h: 2 },
      { id: 'c', x: 0, y: 2, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a    a    a    .    .    .
   *   1 a    a    a    b    b    .
   *   2 a    a    a    b    b    .
   *   3 .    ch   ch   b/ch b    .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   a   .   .   .
   *   1 a   a   a   b   b   .
   *   2 a   a   a   b   b   .
   *   3 .   .   .   b   b   .
   *   4 .   c   c   c   .   .
   */
  it('becoming visible does not shift adjacent components', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 3, h: 3, hidden: false },
      { id: 'b', x: 3, y: 1, w: 2, h: 3, hidden: false },
      { id: 'c', x: 1, y: 3, w: 3, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 3, h: 3 },
      { id: 'b', x: 3, y: 1, w: 2, h: 3 },
      { id: 'c', x: 1, y: 4, w: 3, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   .   .   .   .
   *   1 a   a   .   .   .   .
   *   2 a   a   .   .   .   .
   *   3 b   b   .   .   .   .
   *   4 b   b   .   .   .   .
   *   5 b   b   .   .   .   .
   *   6 c   c   .   .   .   .
   *   7 c   c   .   .   .   .
   *   8 c   c   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a    a    .    .    .    .
   *   1 a    a    .    .    .    .
   *   2 a    a    .    .    .    .
   *   3 b~/c b~/c .    .    .    .
   *   4 c    c    .    .    .    .
   *   5 c    c    .    .    .    .
   */
  it('hides tall component', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 3, hidden: false },
      { id: 'b', x: 0, y: 3, w: 2, h: 3, hidden: false },
      { id: 'c', x: 0, y: 6, w: 2, h: 3, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 3, hidden: true },
      { id: 'c', height: 3, hidden: false },
    ];
    // b is hidden (h=0) at its base y=3; c shifts up by the freed visible height (3)
    // b (h=0) and c (y=3) do not collide: b.y + b.h = 3 + 0 = 3 <= c.y = 3
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 3 },
      { id: 'b', x: 0, y: 3, w: 2, h: 0 },
      { id: 'c', x: 0, y: 3, w: 2, h: 3 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   bh  .   .   .   .
   *   3 a   bh  c   .   .   .
   *   4 .   bh  c   .   .   .
   *   5 .   .   c   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   b~  .   .   .   .
   *   3 a   .   c   .   .   .
   *   4 .   .   c   .   .   .
   *   5 .   .   c   .   .   .
   */
  it('base layout w/ hidden component in middle 1', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 1, w: 1, h: 3, hidden: false },
      { id: 'b', x: 1, y: 2, w: 1, h: 3, hidden: true },
      { id: 'c', x: 2, y: 3, w: 1, h: 3, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 3, hidden: true },
      { id: 'c', height: 3, hidden: false },
    ];
    // b was already hidden in base (visible height 0 at y=2), so no offset is generated;
    // b appears in output at its base y=2 with h=0
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 1, w: 1, h: 3 },
      { id: 'b', x: 1, y: 2, w: 1, h: 0 },
      { id: 'c', x: 2, y: 3, w: 1, h: 3 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   bh  .   .   .   .
   *   3 a   bh  .   .   .   .
   *   4 .   bh  .   .   .   .
   *   5 .   bh  .   .   .   .
   *   6 .   bh  c   .   .   .
   *   7 .   .   c   .   .   .
   *   8 .   .   c   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   b~  .   .   .   .
   *   3 a   .   .   .   .   .
   *   4 .   .   c   .   .   .
   *   5 .   .   c   .   .   .
   *   6 .   .   c   .   .   .
   */
  it('base layout w/ hidden component in middle 2', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 1, w: 1, h: 3, hidden: false },
      { id: 'b', x: 1, y: 2, w: 1, h: 5, hidden: true },
      { id: 'c', x: 2, y: 6, w: 1, h: 3, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 5, hidden: true },
      { id: 'c', height: 3, hidden: false },
    ];
    // b was already hidden in base (visible height 0 at y=2), so no offset is generated;
    // b appears in output at its base y=2 with h=0
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 1, w: 1, h: 3 },
      { id: 'b', x: 1, y: 2, w: 1, h: 0 },
      { id: 'c', x: 2, y: 4, w: 1, h: 3 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   bh  .   .   .   .
   *   2 .   bh  .   .   .   .
   *   3 .   .   c   .   .   .
   *   4 .   .   c   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 .   b   .   .   .   .
   *   3 .   .   c   .   .   .
   *   4 .   .   c   .   .   .
   */
  it('base layout w/ hidden component in middle 3', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 2, hidden: true },
      { id: 'c', x: 2, y: 3, w: 1, h: 2, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 2, hidden: false },
      { id: 'c', height: 2, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 1, y: 1, w: 1, h: 2 },
      { id: 'c', x: 2, y: 3, w: 1, h: 2 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   bh  .   .   .   .
   *   2 .   bh  .   .   .   .
   *   3 .   .   c   .   .   .
   *   4 .   .   c   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b~  .   .   .   .
   *   2 .   .   c   .   .   .
   *   3 .   .   c   .   .   .
   */
  it('base layout w/ hidden component in middle 4', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 2, hidden: true },
      { id: 'c', x: 2, y: 3, w: 1, h: 2, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: false },
      { id: 'b', height: 2, hidden: true },
      { id: 'c', height: 2, hidden: false },
    ];
    // b was hidden in base (visible height 0 at y=1), no offset generated;
    // b appears at y=1 with h=0
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 1, y: 1, w: 1, h: 0 },
      { id: 'c', x: 2, y: 2, w: 1, h: 2 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 .   .   c   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  b   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   c   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('newly visible component in freed range is not overwritten by shifted component', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 1, hidden: false },
      // spacer at y=3
      { id: 'c', x: 2, y: 4, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: true },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 1, y: 0, w: 1, h: 1 },
      { id: 'c', x: 2, y: 2, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   bh  .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 .   .   .   .   .   .
   *   5 c   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  b   .   .   .   .
   *   1 .   b   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 c   .   .   .   .   .
   */
  it('shifted component colliding with newly visible insert is placed below it', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3, hidden: false },
      { id: 'b', x: 1, y: 2, w: 1, h: 1, hidden: true },
      { id: 'c', x: 0, y: 5, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 2, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 1, y: 0, w: 1, h: 2 },
      { id: 'c', x: 0, y: 4, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   a   .   .   .   .
   *   1 a   a   .   .   .   .
   *   2 a   a   .   .   .   .
   *   3 a   a   .   b   .   .
   *   4 a   a   .   .   .   .
   *   5 c   c   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  a~  .   b   .   .
   *   1 c   c   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('tall component that surpasses other item becomes hidden, no spacer', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 5, hidden: false },
      { id: 'b', x: 3, y: 3, w: 1, h: 1, hidden: false },
      { id: 'c', x: 0, y: 5, w: 2, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 5, hidden: true },
      { id: 'b', height: 1, hidden: false },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 0 },
      { id: 'b', x: 3, y: 0, w: 1, h: 1 },
      { id: 'c', x: 0, y: 1, w: 2, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // HIDDEN ITEM PUSH //
  // Hidden items have h=0 and are pushed down by growing visible components,
  // just like visible items. A visible item at y=0 with h=3 covers y∈[0,3).
  // A hidden item at y=1 (h=0) lies inside that range → pushed to y=3.
  // At y=3 exactly: a.y+a.h=3 <= b.y=3 → no collision, no push.

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 bh  .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 b~  .   .   .   .   .
   */
  it('pushes hidden item down when visible above grows into it', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 1, hidden: true },
    ];
    // a grows to h=3, overlapping b's position y=1; b is pushed to y=3
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3 },
      { id: 'b', x: 0, y: 3, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 bh  .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a~  .   .   .   .   .
   *   1 b~  .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('stacked components both made hidden', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: true },
      { id: 'b', height: 1, hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 0 },
      { id: 'b', x: 0, y: 1, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   bh  .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   b~  .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   */
  it('does not push hidden item when visible grows in a different column', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 1, y: 1, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 1, hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3 },
      { id: 'b', x: 1, y: 1, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 bh  .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 a   .   .   .   .   .
   *   2 a   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *   4 b~  .   .   .   .   .
   */
  it('does not push hidden item when visible ends exactly at hidden item y', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      // spacer
      { id: 'b', x: 0, y: 2, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 1, hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3 },
      // spacer
      { id: 'b', x: 0, y: 4, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 a   .   .   .   .   .
   *   1 bh  .   .   .   .   .
   *   2 c   .   .   .   .   .
   *   3 .   .   .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 a    .    .    .    .    .
   *   1 a    .    .    .    .    .
   *   2 a    .    .    .    .    .
   *   3 b~/c .    .    .    .    .
   */
  it('pushes hidden item and visible item to same y when both overlap with growing visible', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 1, hidden: false },
      { id: 'b', x: 0, y: 1, w: 1, h: 1, hidden: true },
      { id: 'c', x: 0, y: 2, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 1, hidden: true },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 3 },
      { id: 'b', x: 0, y: 3, w: 1, h: 0 },
      { id: 'c', x: 0, y: 3, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   c   ah  ah  ah  .
   *   1 .   .   ah  ah  ah  .
   *   2 .   .   bh  bh  bh  .
   *   3 .   .   bh  bh  bh  .
   *   4 .   .   bh  bh  bh  .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   c   a~  a~  a~  .
   *   1 .   .   .   .   .   .
   *   2 .   .   b~  b~  b~  .
   *   3 .   .   .   .   .   .
   */
  it('extra #1', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 2, y: 0, w: 3, h: 2, hidden: true },
      { id: 'b', x: 2, y: 2, w: 3, h: 3, hidden: true },
      { id: 'c', x: 1, y: 0, w: 1, h: 1, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 2, hidden: true },
      { id: 'b', height: 3, hidden: true },
      { id: 'c', height: 1, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 2, y: 0, w: 3, h: 0 },
      { id: 'b', x: 2, y: 2, w: 3, h: 0 },
      { id: 'c', x: 1, y: 0, w: 1, h: 1 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b | h=hidden-in-base]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 a   .   .   .   .   .
   *   4 a   bh  .   .   .   .
   *
   * === EXPECTED ===
   *   [a=a, b=b | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   .   .   .   .
   *   1 .   .   .   .   .   .
   *   2 .   .   .   .   .   .
   *   3 a   .   .   .   .   .
   *   4 a   b~  .   .   .   .
   */
  it('extra #2', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 3, w: 1, h: 2, hidden: false },
      { id: 'b', x: 1, y: 4, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 1, hidden: false },
      { id: 'b', height: 1, hidden: true },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 3, w: 1, h: 2 },
      { id: 'b', x: 1, y: 4, w: 1, h: 0 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  /*
   * === BASE ===
   *   [a=a, b=b, c=c | h=hidden-in-base]
   * y\x 0       1       2       3       4       5
   *    ------------------------------------------------
   *   0 a/bh/ch bh      .       .       .       .
   *   1 a/bh    bh      .       .       .       .
   *   2 bh      bh      .       .       .       .
   *   3 .       .       .       .       .       .
   *
   * === EXPECTED ===
   *   [a=a, b=b, c=c]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 b   b   .   .   .   .
   *   1 b   b   .   .   .   .
   *   2 b   b   .   .   .   .
   *   3 c   .   .   .   .   .
   *   4 c   .   .   .   .   .
   *   5 c   .   .   .   .   .
   *   6 a   .   .   .   .   .
   *   7 a   .   .   .   .   .
   *   8 a   .   .   .   .   .
   */
  it('extra #3', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 1, h: 2, hidden: false },
      { id: 'b', x: 0, y: 0, w: 2, h: 3, hidden: true },
      { id: 'c', x: 0, y: 0, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', height: 3, hidden: false },
      { id: 'b', height: 3, hidden: false },
      { id: 'c', height: 3, hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'b', x: 0, y: 0, w: 2, h: 3 },
      { id: 'c', x: 0, y: 3, w: 1, h: 3 },
      { id: 'a', x: 0, y: 6, w: 1, h: 3 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });

  // property test run:185 — hidden-in-base items (c6) inserted at y=2 push c0 (hidden
  // in dynamic, h=0) to y=3, which falls inside c6's range y=2..6, causing a collision.
  /*
   * === BASE ===
   *   [0=c0, 1=c1, 2=c2, 3=c4, 4=c6 | h=hidden-in-base]
   * y\x 0     1     2     3     4     5
   *    ------------------------------------
   *   0 .     .     3h/4h 4h    .     .
   *   1 1h    1h    4h    4h    .     .
   *   2 2     2     0     .     .     .
   *   3 2     2     0     .     .     .
   *
   * === EXPECTED (partial — checks on h and no-collision only) ===
   *   [0=c0, 1=c1, 2=c2, 3=c4, 4=c6 | ~=collapsed(h=0)]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   0 .   .   3   .   .   .
   *   1 1   1   3   .   .   .
   *   2 1   1   4   4   .   .
   *   3 .   .   4   4   .   .
   *   4 .   .   4   4   .   .
   *   5 .   .   4   4   .   .
   *   6 2~  2~  0~  .   .   .
   */
  it('no output collision when hidden-in-base insert causes visible to overlap hidden-in-dynamic item', () => {
    const base: CompactionItemIn[] = [
      { id: 'c0', x: 2, y: 2, w: 1, h: 2, hidden: false },
      { id: 'c1', x: 0, y: 1, w: 2, h: 1, hidden: true },
      { id: 'c2', x: 0, y: 2, w: 2, h: 2, hidden: false },
      { id: 'c4', x: 2, y: 0, w: 1, h: 1, hidden: true },
      { id: 'c6', x: 2, y: 0, w: 2, h: 2, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'c0', height: 3, hidden: true },
      { id: 'c1', height: 2, hidden: false },
      { id: 'c2', height: 2, hidden: true },
      { id: 'c4', height: 2, hidden: false },
      { id: 'c6', height: 4, hidden: false },
    ];
    const actual = compact(base, dynamic);

    // visible in dynamic: c1, c4, c6
    const c1 = actual.find((i) => i.id === 'c1')!;
    const c4 = actual.find((i) => i.id === 'c4')!;
    const c6 = actual.find((i) => i.id === 'c6')!;
    expect(c1.h).toBe(2);
    expect(c4.h).toBe(2);
    expect(c6.h).toBe(4);

    // hidden in dynamic: c0, c2
    const c0 = actual.find((i) => i.id === 'c0')!;
    const c2 = actual.find((i) => i.id === 'c2')!;
    expect(c0.h).toBe(0);
    expect(c2.h).toBe(0);

    // no output collisions
    for (let i = 0; i < actual.length; i++) {
      for (let j = i + 1; j < actual.length; j++) {
        expect(collides(actual[i]!, actual[j]!)).toBe(false);
      }
    }
  });

  // property test FAIL — multiple hidden-in-base items become visible; c4 (h=0)
  // was placed inside c1's range y∈[3,5) at y=4 triggering the no-collision check.
  /*
   * === BASE ===
   *   [0=c0, 1=c1, 2=c2, 3=c3, 4=c4, 5=c5, 6=c6 | h=hidden-in-base]
   * y\x 0     1     2     3     4     5
   *    ------------------------------------
   *   0 .     .     .     .     .     .
   *   1 .     1h    1h/5  3h    .     .
   *   2 0h    4     2h    2h/3h .     .
   *   3 0h    6h    .     .     .     .
   *
   * === EXPECTED (partial — checks on h and no-collision only) ===
   *   [0=c0, 1=c1, 2=c2, 3=c3, 4=c4, 5=c5, 6=c6 | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 .    .    .    .    .    .
   *   1 .    .    5    3~   .    .
   *   2 .    .    5    .    .    .
   *   3 .    1    1    .    .    .
   *   4 0    1    1    .    .    .
   *   5 0    4~/6 2~   2~   .    .
   *   6 0    .    .    .    .    .
   *   7 0    .    .    .    .    .
   */
  it('no output collision when multiple hidden-in-base items become visible with h=0 items inside visible ranges', () => {
    const base: CompactionItemIn[] = [
      { id: 'c0', x: 0, y: 2, w: 1, h: 2, hidden: true },
      { id: 'c1', x: 1, y: 1, w: 2, h: 1, hidden: true },
      { id: 'c2', x: 2, y: 2, w: 2, h: 1, hidden: true },
      { id: 'c3', x: 3, y: 1, w: 1, h: 2, hidden: true },
      { id: 'c4', x: 1, y: 2, w: 1, h: 1, hidden: false },
      { id: 'c5', x: 2, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c6', x: 1, y: 3, w: 1, h: 1, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'c0', height: 4, hidden: false },
      { id: 'c1', height: 2, hidden: false },
      { id: 'c2', height: 3, hidden: true },
      { id: 'c3', height: 3, hidden: true },
      { id: 'c4', height: 3, hidden: true },
      { id: 'c5', height: 2, hidden: false },
      { id: 'c6', height: 1, hidden: false },
    ];
    const actual = compact(base, dynamic);

    // visible in dynamic: c0, c1, c5, c6
    const c0 = actual.find((i) => i.id === 'c0')!;
    const c1 = actual.find((i) => i.id === 'c1')!;
    const c5 = actual.find((i) => i.id === 'c5')!;
    const c6 = actual.find((i) => i.id === 'c6')!;
    expect(c0.h).toBe(4);
    expect(c1.h).toBe(2);
    expect(c5.h).toBe(2);
    expect(c6.h).toBe(1);

    // hidden in dynamic: c2, c3, c4
    const c2 = actual.find((i) => i.id === 'c2')!;
    const c3 = actual.find((i) => i.id === 'c3')!;
    const c4 = actual.find((i) => i.id === 'c4')!;
    expect(c2.h).toBe(0);
    expect(c3.h).toBe(0);
    expect(c4.h).toBe(0);

    // no output collisions
    for (let i = 0; i < actual.length; i++) {
      for (let j = i + 1; j < actual.length; j++) {
        expect(collides(actual[i]!, actual[j]!)).toBe(false);
      }
    }
  });

  // property test FAIL — hidden-in-base c1 becomes visible and c5 stays hidden;
  // c5 (h=0) was placed at y=7 overlapping c1's range y∈[4,8), triggering the
  // no-collision check.
  /*
   * === BASE ===
   *   [0=c0, 1=c1, 2=c2, 3=c3, 4=c4, 5=c5, 6=c6 | h=hidden-in-base]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 .    1h/3 1h/3 .    .    .
   *   1 0    1h/3 1h/3 .    .    .
   *   2 .    .    5h   .    .    .
   *   3 .    4    4    2/6h 6h   .
   *   4 .    4    4    2/6h 6h   .
   *
   * === EXPECTED (partial — checks on h and no-collision only) ===
   *   [0=c0, 1=c1, 2=c2, 3=c3, 4=c4, 5=c5, 6=c6 | ~=collapsed(h=0)]
   * y\x 0    1    2    3    4    5
   *    ------------------------------
   *   0 .    3    3    .    .    .
   *   1 0    3    3    .    .    .
   *   2 0    3    3    .    .    .
   *   3 0    3    3    .    .    .
   *   4 .    1    1/5~ .    .    .
   *   5 .    1    1    .    .    .
   *   6 .    1    1    .    .    .
   *   7 .    1    1    .    .    .
   *   8 .    4    4    2    .    .
   *   9 .    4    4    2    .    .
   *  10 .    4    4    2    .    .
   *  11 .    4    4    2    .    .
   *  12 .    .    .    6    6    .
   *  13 .    .    .    6    6    .
   */
  it('no output collision when newly-visible item and persistent-hidden item overlap', () => {
    const base: CompactionItemIn[] = [
      { id: 'c0', x: 0, y: 1, w: 1, h: 1, hidden: false },
      { id: 'c1', x: 1, y: 0, w: 2, h: 2, hidden: true },
      { id: 'c2', x: 3, y: 3, w: 1, h: 2, hidden: false },
      { id: 'c3', x: 1, y: 0, w: 2, h: 2, hidden: false },
      { id: 'c4', x: 1, y: 3, w: 2, h: 2, hidden: false },
      { id: 'c5', x: 2, y: 2, w: 1, h: 1, hidden: true },
      { id: 'c6', x: 3, y: 3, w: 2, h: 2, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'c0', height: 3, hidden: false },
      { id: 'c1', height: 4, hidden: false },
      { id: 'c2', height: 4, hidden: false },
      { id: 'c3', height: 4, hidden: false },
      { id: 'c4', height: 4, hidden: false },
      { id: 'c5', height: 2, hidden: true },
      { id: 'c6', height: 2, hidden: false },
    ];
    const actual = compact(base, dynamic);

    // visible in dynamic: c0, c1, c2, c3, c4, c6
    const c0 = actual.find((i) => i.id === 'c0')!;
    const c1 = actual.find((i) => i.id === 'c1')!;
    const c2 = actual.find((i) => i.id === 'c2')!;
    const c3 = actual.find((i) => i.id === 'c3')!;
    const c4 = actual.find((i) => i.id === 'c4')!;
    const c6 = actual.find((i) => i.id === 'c6')!;
    expect(c0.h).toBe(3);
    expect(c1.h).toBe(4);
    expect(c2.h).toBe(4);
    expect(c3.h).toBe(4);
    expect(c4.h).toBe(4);
    expect(c6.h).toBe(2);

    // hidden in dynamic: c5
    const c5 = actual.find((i) => i.id === 'c5')!;
    expect(c5.h).toBe(0);

    // no output collisions
    for (let i = 0; i < actual.length; i++) {
      for (let j = i + 1; j < actual.length; j++) {
        expect(collides(actual[i]!, actual[j]!)).toBe(false);
      }
    }
  });

  /*
   * === BASE ===
   *   [c0h=hidden, c1h=hidden, c2h=hidden, c3=visible, c4=visible, c5h=hidden, c6h=hidden]
   * y\x 0   1   2   3   4   5
   *    ------------------------
   *   1 c1h .   c5h c0h .   .
   *         .   c5h c2h .   .
   *   2 .   .   c4  c3  c3  .
   *   3 .   .   c6h c3  c3  .
   *   4 .   .   c6h .   .   .
   *
   * === EXPECTED OUTPUT ===
   * All visible items (c0,c1,c2,c4,c5,c6) must appear with no collisions.
   */
  /**
   * Regression: property-test run 72116.
   *
   * c5 (hidden-in-base, visible-in-dynamic) is an insert item in group row=1.
   * The insert-placement pass pushes c5 to y=5 (c2 blocks y=3..5).
   * During collision resolution, group row=2 (c4) initially needs offset=1
   * to clear c0. But group row=3 (c6) later needs offset=3 to clear c5.
   * maxOffsetNeeded rises to 3, which pushes c4 to y=5 — colliding with c5!
   *
   * Fix: re-run the j-loop until maxOffsetNeeded stabilises. On the second
   * pass, c4 at y=5 collides with c5 at y=5, raising maxOffsetNeeded to 4.
   * c4 ends at y=6 (clear of c5 at y=5).
   */
  it('no collision when insert item placed far below its group blocks a later group pushed to same y', () => {
    const base: CompactionItemIn[] = [
      { id: 'c0', x: 3, y: 1, w: 1, h: 1, hidden: true },
      { id: 'c1', x: 0, y: 1, w: 1, h: 1, hidden: true },
      { id: 'c2', x: 3, y: 1, w: 1, h: 1, hidden: true },
      { id: 'c3', x: 3, y: 2, w: 2, h: 2, hidden: false },
      { id: 'c4', x: 2, y: 2, w: 1, h: 1, hidden: false },
      { id: 'c5', x: 2, y: 1, w: 2, h: 1, hidden: true },
      { id: 'c6', x: 2, y: 3, w: 1, h: 2, hidden: true },
    ];
    const dynamic: DynamicData[] = [
      { id: 'c0', height: 2, hidden: false },
      { id: 'c1', height: 1, hidden: false },
      { id: 'c2', height: 2, hidden: false },
      { id: 'c3', height: 3, hidden: true }, // collapsed
      { id: 'c4', height: 1, hidden: false },
      { id: 'c5', height: 1, hidden: false },
      { id: 'c6', height: 4, hidden: false },
    ];

    const actual = compact(base, dynamic);

    // c3 is hidden in dynamic
    const c3 = actual.find((i) => i.id === 'c3')!;
    expect(c3.h).toBe(0);

    // no output collisions
    for (let i = 0; i < actual.length; i++) {
      for (let j = i + 1; j < actual.length; j++) {
        expect(collides(actual[i]!, actual[j]!)).toBe(false);
      }
    }
  });

  it('does not collapse into row', () => {
    const base: CompactionItemIn[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 3, hidden: true },
      { id: 'b', x: 2, y: 0, w: 3, h: 4, hidden: false },
      { id: 'c', x: 0, y: 3, w: 2, h: 3, hidden: false },
    ];
    const dynamic: DynamicData[] = [
      { id: 'a', hidden: true },
      { id: 'b', hidden: false },
      { id: 'c', hidden: false },
    ];
    const expected: CompactionItem[] = [
      { id: 'a', x: 0, y: 0, w: 2, h: 0 },
      { id: 'b', x: 2, y: 0, w: 3, h: 4 },
      { id: 'c', x: 0, y: 3, w: 2, h: 3 },
    ];
    const actual = compact(base, dynamic);
    expect(actual).toEqual(expected);
  });
});
