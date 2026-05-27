import {
  getHandleColor,
  getHeightResizableWidgets,
  computeValidationError,
  getBadgePosition,
} from './componentDisplayUtils';

// Use the actual string values from WIDGETS constants to avoid import issues
// These match @m-next/types and @m-next/runtime-interface widgetTypes
const WIDGET_TYPES = {
  PICTURE: 'PIC',
  CALENDAR: 'CAL',
  CHART: 'CHT',
  SECTION: 'SEC',
  DATATABLE: 'EDT',
  GALLERY: 'GAL',
  HTMLEDITOR: 'HTM',
  MAP: 'MAP',
  TEXTAREA: 'TXA',
  LAYOUT_CONTAINER: 'L-CON',
  LABEL: 'LBL',
  BUTTON: 'BTN',
  TEXTBOX: 'TXT',
  CHECKBOX: 'CHK',
};

describe('componentDisplayUtils', () => {
  describe('getHandleColor', () => {
    it('returns red when hasValidationError is true', () => {
      expect(getHandleColor(true, false)).toBe('#DA211E');
    });

    it('returns red when hasValidationError is true even if isSelected', () => {
      expect(getHandleColor(true, true)).toBe('#DA211E');
    });

    it('returns blue when isSelected is true and no error', () => {
      expect(getHandleColor(false, true)).toBe('#0D71C8');
    });

    it('returns light blue (#84C3F5) when neither error nor selected (hovered state)', () => {
      expect(getHandleColor(false, false)).toBe('#84C3F5');
    });
  });

  describe('getHeightResizableWidgets', () => {
    it('returns the correct widget type array', () => {
      const result = getHeightResizableWidgets();
      expect(result).toContain(WIDGET_TYPES.CALENDAR);
      expect(result).toContain(WIDGET_TYPES.CHART);
      expect(result).toContain(WIDGET_TYPES.SECTION);
      expect(result).toContain(WIDGET_TYPES.DATATABLE);
      expect(result).toContain(WIDGET_TYPES.GALLERY);
      expect(result).toContain(WIDGET_TYPES.HTMLEDITOR);
      expect(result).toContain(WIDGET_TYPES.PICTURE);
      expect(result).toContain(WIDGET_TYPES.MAP);
      expect(result).toContain(WIDGET_TYPES.TEXTAREA);
      expect(result).toContain(WIDGET_TYPES.LAYOUT_CONTAINER);
      expect(result).toContain(WIDGET_TYPES.LABEL);
    });

    it('does not contain non-resizable widget types', () => {
      const result = getHeightResizableWidgets();
      expect(result).not.toContain(WIDGET_TYPES.BUTTON);
      expect(result).not.toContain(WIDGET_TYPES.TEXTBOX);
      expect(result).not.toContain(WIDGET_TYPES.CHECKBOX);
    });

    it('returns a stable reference (same array on repeated calls)', () => {
      const result1 = getHeightResizableWidgets();
      const result2 = getHeightResizableWidgets();
      expect(result1).toBe(result2);
    });
  });

  describe('computeValidationError', () => {
    it('returns true for explicit error string', () => {
      const component = { type: WIDGET_TYPES.BUTTON, validationError: 'Field is required' };
      expect(computeValidationError(component)).toBe(true);
    });

    it('returns true for PICTURE with no value and not bound', () => {
      const component = { type: WIDGET_TYPES.PICTURE, isBound: false, value: null };
      expect(computeValidationError(component)).toBe(true);
    });

    it('returns true for PICTURE with empty string value and not bound', () => {
      const component = { type: WIDGET_TYPES.PICTURE, isBound: false, value: '' };
      expect(computeValidationError(component)).toBe(true);
    });

    it('returns true for PICTURE with whitespace-only value and not bound', () => {
      const component = { type: WIDGET_TYPES.PICTURE, isBound: false, value: '   ' };
      expect(computeValidationError(component)).toBe(true);
    });

    it('returns false for bound PICTURE even with no value', () => {
      const component = { type: WIDGET_TYPES.PICTURE, isBound: true, value: null };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false for PICTURE with a value', () => {
      const component = { type: WIDGET_TYPES.PICTURE, isBound: false, value: 'https://example.com/img.png' };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false for PICTURE with defaultValue when value is empty', () => {
      const component = {
        type: WIDGET_TYPES.PICTURE,
        isBound: false,
        value: '',
        defaultValue: 'https://example.com/img.png',
      };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false for non-PICTURE with no error', () => {
      const component = { type: WIDGET_TYPES.BUTTON, validationError: null };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false when validationError is empty string', () => {
      const component = { type: WIDGET_TYPES.BUTTON, validationError: '' };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false when validationError is whitespace-only', () => {
      const component = { type: WIDGET_TYPES.BUTTON, validationError: '   ' };
      expect(computeValidationError(component)).toBe(false);
    });

    it('returns false when validationError is undefined', () => {
      const component = { type: WIDGET_TYPES.BUTTON };
      expect(computeValidationError(component)).toBe(false);
    });

    it('handles component with isBound undefined (defaults to false)', () => {
      const component = { type: WIDGET_TYPES.PICTURE, value: null };
      expect(computeValidationError(component)).toBe(true);
    });
  });

  describe('getBadgePosition', () => {
    it('returns "bottom" when near top (regardless of height-resizable)', () => {
      expect(getBadgePosition(true)).toBe('bottom');
      expect(getBadgePosition(true)).toBe('bottom');
    });

    it('returns "top" when not near top (regardless of height-resizable)', () => {
      expect(getBadgePosition(false)).toBe('top');
      expect(getBadgePosition(false)).toBe('top');
    });
  });
});
