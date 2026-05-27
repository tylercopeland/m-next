import { clampControlDimensions, clampDimension, getDisplayRestrictions } from './dimensionUtils';

describe('dimensionUtils', () => {
  describe('clampDimension', () => {
    test('clamps value to minimum', () => {
      expect(clampDimension(1, 2, 10)).toBe(2);
    });

    test('clamps value to maximum', () => {
      expect(clampDimension(15, 2, 10)).toBe(10);
    });

    test('allows value within range', () => {
      expect(clampDimension(5, 2, 10)).toBe(5);
    });

    test('handles undefined min/max', () => {
      expect(clampDimension(5)).toBe(5);
      expect(clampDimension(5, undefined, 10)).toBe(5);
      expect(clampDimension(5, 2)).toBe(5);
    });
  });

  describe('getDisplayRestrictions', () => {
    test('returns restrictions for button', () => {
      const restrictions = getDisplayRestrictions('BTN');
      expect(restrictions).toEqual({
        minWidth: 1,
        maxWidth: 6,
        minHeight: 1,
        maxHeight: 3,
        defaultWidth: 2,
        defaultHeight: 3,
      });
    });

    test('returns restrictions for dropdown', () => {
      const restrictions = getDisplayRestrictions('DRP');
      expect(restrictions).toEqual({
        minWidth: 2,
        maxWidth: 8,
        minHeight: 3,
        maxHeight: 3,
        defaultWidth: 3,
        defaultHeight: 3,
      });
    });

    test('returns default restrictions for unknown type', () => {
      const restrictions = getDisplayRestrictions('UNKNOWN');
      expect(restrictions).toEqual({
        minWidth: 1,
        maxWidth: 12,
        minHeight: 2,
        maxHeight: 100,
      });
    });
  });

  describe('clampControlDimensions', () => {
    test('clamps button width to max of 6', () => {
      const result = clampControlDimensions(12, 3, 'BTN');
      expect(result).toEqual({ width: 6, height: 3 });
    });

    test('clamps button width to min of 1', () => {
      const result = clampControlDimensions(0, 3, 'BTN');
      expect(result).toEqual({ width: 1, height: 3 });
    });

    test('clamps dropdown width to max of 8', () => {
      const result = clampControlDimensions(12, 3, 'DRP');
      expect(result).toEqual({ width: 8, height: 3 });
    });

    test('clamps checkbox width to max of 6', () => {
      const result = clampControlDimensions(10, 3, 'CHK');
      expect(result).toEqual({ width: 6, height: 3 });
    });

    test('clamps toggle width to max of 4', () => {
      const result = clampControlDimensions(8, 3, 'TGL');
      expect(result).toEqual({ width: 4, height: 3 });
    });

    test('allows valid button dimensions', () => {
      const result = clampControlDimensions(2, 3, 'BTN');
      expect(result).toEqual({ width: 2, height: 3 });
    });

    test('clamps height if exceeds max', () => {
      const result = clampControlDimensions(2, 10, 'BTN');
      expect(result).toEqual({ width: 2, height: 3 });
    });

    test('clamps height to min', () => {
      const result = clampControlDimensions(2, 1, 'DRP');
      expect(result).toEqual({ width: 2, height: 3 });
    });

    test('allows grid full width', () => {
      const result = clampControlDimensions(12, 20, 'EDT');
      expect(result).toEqual({ width: 12, height: 20 });
    });

    test('enforces grid minimum width', () => {
      const result = clampControlDimensions(2, 20, 'GRD');
      expect(result).toEqual({ width: 4, height: 20 });
    });
  });
});
