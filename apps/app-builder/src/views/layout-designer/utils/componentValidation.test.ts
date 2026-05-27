import { WIDGETS } from '@m-next/runtime-interface';
import { computeValidationError } from './componentValidation';

describe('computeValidationError', () => {
  // --- Dropdown ---
  it('returns error for dropdown without viewName', () => {
    const component = { type: WIDGETS.DROPDOWN, isBound: false, value: null };
    const control = { model: {} };
    expect(computeValidationError(component, control)).toBe('Table not configured');
  });

  it('returns null for dropdown with viewName', () => {
    const component = { type: WIDGETS.DROPDOWN, isBound: false, value: null };
    const control = { model: { viewName: 'SomeTable' } };
    expect(computeValidationError(component, control)).toBeNull();
  });

  it('returns null for dropdown without control', () => {
    const component = { type: WIDGETS.DROPDOWN, isBound: false, value: null };
    expect(computeValidationError(component, null)).toBeNull();
  });

  // --- Picture ---
  it('returns error for picture not bound and no value', () => {
    const component = { type: WIDGETS.PICTURE, isBound: false, value: null };
    expect(computeValidationError(component)).toBe('Image source not configured');
  });

  it('returns null for bound picture', () => {
    const component = { type: WIDGETS.PICTURE, isBound: true, value: null };
    expect(computeValidationError(component)).toBeNull();
  });

  it('returns null for picture with value', () => {
    const component = { type: WIDGETS.PICTURE, isBound: false, value: 'some-url' };
    expect(computeValidationError(component)).toBeNull();
  });

  // --- Gallery ---
  it('returns error for gallery without imageField', () => {
    const component = { type: WIDGETS.GALLERY, isBound: false, value: null };
    const control = { model: {} };
    expect(computeValidationError(component, control)).toBe('Gallery not configured');
  });

  it('returns null for gallery with imageField', () => {
    const component = { type: WIDGETS.GALLERY, isBound: false, value: null };
    const control = { model: { imageField: 'Photo' } };
    expect(computeValidationError(component, control)).toBeNull();
  });

  it('returns null for gallery without control', () => {
    const component = { type: WIDGETS.GALLERY, isBound: false, value: null };
    expect(computeValidationError(component, null)).toBeNull();
  });

  // --- Other types ---
  it('returns null for button', () => {
    const component = { type: WIDGETS.BUTTON, isBound: false, value: null };
    expect(computeValidationError(component)).toBeNull();
  });

  it('returns null for textbox', () => {
    const component = { type: WIDGETS.TEXTBOX, isBound: true, value: 'hello' };
    expect(computeValidationError(component)).toBeNull();
  });
});
