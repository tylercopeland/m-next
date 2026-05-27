/**
 * Responsive Utilities Tests
 *
 * Tests for shared responsive utilities used by App Builder and MethodUI Runtime.
 */

import {
  DisplayLayout,
  SCREEN_BREAKPOINTS,
  getScreenTypeFromWidth,
  displayLayoutToResolution,
  getGridColumns,
} from './responsive';

describe('Responsive Utilities', () => {
  describe('DisplayLayout enum', () => {
    it('should have correct values', () => {
      expect(DisplayLayout.Desktop).toBe(0);
      expect(DisplayLayout.Tablet).toBe(1);
      expect(DisplayLayout.Mobile).toBe(2);
    });
  });

  describe('SCREEN_BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(SCREEN_BREAKPOINTS.MOBILE).toBe(768);
      expect(SCREEN_BREAKPOINTS.TABLET).toBe(1024);
    });
  });

  describe('getScreenTypeFromWidth', () => {
    it('should return mobile for width < 768', () => {
      expect(getScreenTypeFromWidth(0)).toBe('mobile');
      expect(getScreenTypeFromWidth(375)).toBe('mobile');
      expect(getScreenTypeFromWidth(767)).toBe('mobile');
    });

    it('should return tablet for width 768-1023', () => {
      expect(getScreenTypeFromWidth(768)).toBe('tablet');
      expect(getScreenTypeFromWidth(800)).toBe('tablet');
      expect(getScreenTypeFromWidth(1023)).toBe('tablet');
    });

    it('should return desktop for width >= 1024', () => {
      expect(getScreenTypeFromWidth(1024)).toBe('desktop');
      expect(getScreenTypeFromWidth(1200)).toBe('desktop');
      expect(getScreenTypeFromWidth(1920)).toBe('desktop');
    });

    it('should handle edge cases at breakpoint boundaries', () => {
      // Exactly at mobile breakpoint (768) should be tablet
      expect(getScreenTypeFromWidth(768)).toBe('tablet');
      // One pixel below should be mobile
      expect(getScreenTypeFromWidth(767)).toBe('mobile');

      // Exactly at tablet breakpoint (1024) should be desktop
      expect(getScreenTypeFromWidth(1024)).toBe('desktop');
      // One pixel below should be tablet
      expect(getScreenTypeFromWidth(1023)).toBe('tablet');
    });
  });

  describe('displayLayoutToResolution', () => {
    it('should convert Desktop enum to desktop string', () => {
      expect(displayLayoutToResolution(DisplayLayout.Desktop)).toBe('desktop');
    });

    it('should convert Tablet enum to tablet string', () => {
      expect(displayLayoutToResolution(DisplayLayout.Tablet)).toBe('tablet');
    });

    it('should convert Mobile enum to mobile string', () => {
      expect(displayLayoutToResolution(DisplayLayout.Mobile)).toBe('mobile');
    });

    it('should default to desktop for invalid/unknown values', () => {
      expect(displayLayoutToResolution(-1)).toBe('desktop');
      expect(displayLayoutToResolution(99)).toBe('desktop');
    });
  });

  describe('getGridColumns', () => {
    it('should return 4 columns for mobile', () => {
      expect(getGridColumns('mobile')).toBe(4);
    });

    it('should return 8 columns for tablet', () => {
      expect(getGridColumns('tablet')).toBe(8);
    });

    it('should return 12 columns for desktop', () => {
      expect(getGridColumns('desktop')).toBe(12);
    });

    it('should default to 12 columns for invalid resolution', () => {
      // @ts-expect-error - Testing invalid input
      expect(getGridColumns('invalid')).toBe(12);
      // @ts-expect-error - Testing undefined input
      expect(getGridColumns(undefined)).toBe(12);
    });
  });

  describe('Integration: width to columns', () => {
    it('should correctly calculate columns from width', () => {
      // Mobile widths -> 4 columns
      expect(getGridColumns(getScreenTypeFromWidth(375))).toBe(4);
      expect(getGridColumns(getScreenTypeFromWidth(414))).toBe(4);

      // Tablet widths -> 8 columns
      expect(getGridColumns(getScreenTypeFromWidth(768))).toBe(8);
      expect(getGridColumns(getScreenTypeFromWidth(834))).toBe(8);

      // Desktop widths -> 12 columns
      expect(getGridColumns(getScreenTypeFromWidth(1024))).toBe(12);
      expect(getGridColumns(getScreenTypeFromWidth(1440))).toBe(12);
    });
  });
});
