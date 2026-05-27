import { resolveControlValues } from './controlValueResolver';

describe('resolveControlValues', () => {
  describe('gallery (GAL)', () => {
    it('always returns null for all three values', () => {
      const result = resolveControlValues('GAL', { defaultValue: 'test', value: 'test', content: 'test' }, 'Gallery');
      expect(result).toEqual({ defaultValue: null, defaultValueWrapper: null, value: null });
    });

    it('returns null even with empty component', () => {
      const result = resolveControlValues('GAL', {}, 'Gallery');
      expect(result).toEqual({ defaultValue: null, defaultValueWrapper: null, value: null });
    });
  });

  describe('input controls (TXT, EDT, DRP, etc.)', () => {
    const inputTypes = ['TXT', 'EDT', 'DRP', 'CHK', 'TGL', 'DTP', 'TXA', 'TAG', 'HTM', 'SIG', 'ADR'];

    it.each(inputTypes)('%s: returns component.defaultValue when set', (type) => {
      const result = resolveControlValues(type, { defaultValue: 'Hello' }, 'Input');
      expect(result.defaultValue).toBe('Hello');
      expect(result.defaultValueWrapper).toBe('Hello');
    });

    it.each(inputTypes)('%s: returns null when no defaultValue', (type) => {
      const result = resolveControlValues(type, {}, 'Input');
      expect(result.defaultValue).toBeNull();
      expect(result.defaultValueWrapper).toBeNull();
    });

    // HTM is in defaultValue input types but NOT in value null types (matches original behavior)
    const nullValueInputTypes = ['TXT', 'EDT', 'DRP', 'CHK', 'TGL', 'DTP', 'TXA', 'TAG', 'SIG', 'ADR'];
    it.each(nullValueInputTypes)('%s: value is null when no component.value', (type) => {
      const result = resolveControlValues(type, {}, 'Input');
      expect(result.value).toBeNull();
    });

    it('HTM: value has not fallback', () => {
      const result = resolveControlValues('HTM', {}, 'HTML Editor');
      expect(result.value).toBe(null);
    });

    it('respects explicit component.value', () => {
      const result = resolveControlValues('TXT', { value: 'explicit' }, 'Input');
      expect(result.value).toBe('explicit');
    });
  });

  describe('calendar (CAL) and chart (CHT)', () => {
    it('CAL: defaultValue is the default caption', () => {
      const result = resolveControlValues('CAL', {}, 'Calendar');
      expect(result.defaultValue).toBe('Calendar');
      expect(result.defaultValueWrapper).toBe('Calendar');
    });

    it('CHT: defaultValue is the default caption', () => {
      const result = resolveControlValues('CHT', {}, 'Chart');
      expect(result.defaultValue).toBe('Chart');
      expect(result.defaultValueWrapper).toBe('Chart');
    });

    it('CAL: value is null', () => {
      const result = resolveControlValues('CAL', {}, 'Calendar');
      expect(result.value).toBeNull();
    });

    it('CHT: value is null', () => {
      const result = resolveControlValues('CHT', {}, 'Chart');
      expect(result.value).toBeNull();
    });
  });

  describe('picture (PIC)', () => {
    it('value is null to prevent 404 errors', () => {
      const result = resolveControlValues('PIC', {}, 'Image');
      expect(result.value).toBeNull();
    });

    it('defaultValue uses component content or caption', () => {
      const result = resolveControlValues('PIC', { content: 'My Image' }, 'Image');
      expect(result.defaultValue).toBe(null);
    });

    it('defaultValue falls back to default caption', () => {
      const result = resolveControlValues('PIC', {}, 'Image');
      expect(result.defaultValue).toBe(null);
    });
  });

  describe('button (BTN) and label (LBL)', () => {
    it('BTN: uses content for all values', () => {
      const result = resolveControlValues('BTN', { content: 'Save' }, 'Button');
      expect(result.defaultValue).toBe('Save');
      expect(result.defaultValueWrapper).toBe('Save');
      expect(result.value).toBe('Save');
    });

    it('BTN: falls back to default caption', () => {
      const result = resolveControlValues('BTN', {}, 'Button');
      expect(result.defaultValue).toBe('Button');
      expect(result.value).toBe('Button');
    });

    it('LBL: uses content for all values', () => {
      const result = resolveControlValues('LBL', { content: 'My Label' }, 'Label');
      expect(result.defaultValue).toBe('My Label');
      expect(result.value).toBe('My Label');
    });
  });

  describe('defaultValue and defaultValueWrapper are always identical', () => {
    const testCases = [
      { type: 'BTN', component: { content: 'Save' }, caption: 'Button' },
      { type: 'TXT', component: { defaultValue: 'Hello' }, caption: 'Input' },
      { type: 'CAL', component: {}, caption: 'Calendar' },
      { type: 'GAL', component: {}, caption: 'Gallery' },
    ];

    it.each(testCases)('$type: defaultValue === defaultValueWrapper', ({ type, component, caption }) => {
      const result = resolveControlValues(type, component, caption);
      expect(result.defaultValue).toEqual(result.defaultValueWrapper);
    });
  });
});
