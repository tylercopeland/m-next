import {
  InputControlTranslator,
  translateInputControl,
  translateWidth,
  translateIsRequired,
  translateInputType,
} from './input-control-translator';
import type { InputControl } from './controls/inputControl';
import { ValidationRuleTypes } from './validationRuleTypes';

describe('InputControlTranslator', () => {
  let translator: InputControlTranslator;
  let mockOnChange: jest.Mock;
  let mockOnBlur: jest.Mock;
  let mockOnFocus: jest.Mock;

  beforeEach(() => {
    translator = new InputControlTranslator();
    mockOnChange = jest.fn();
    mockOnBlur = jest.fn();
    mockOnFocus = jest.fn();
  });

  const createMockControl = (overrides: Partial<InputControl> = {}): InputControl =>
    ({
      disabled: false,
      hideCaption: false,
      caption: 'Test Caption',
      placeholder: 'Test Placeholder',
      classes: 'test-class',
      widthType: 'auto',
      width: undefined,
      rows: 1,
      inputType: 'text',
      validationRules: [],
      ...overrides,
    }) as InputControl;

  describe('translateControl', () => {
    it('should translate basic input control', () => {
      const control = createMockControl();
      const result = translator.translateControl(control, 'test value', mockOnChange, mockOnBlur, mockOnFocus);

      expect(result.widgetProps).toMatchObject({
        disabled: false,
        label: 'Test Caption',
        required: false,
        placeholder: 'Test Placeholder',
        legacyClass: 'test-class',
        value: 'test value',
        type: 'text',
        displayAuto: true,
        isV4Design: false,
        ariaLabel: 'Test Caption',
      });
    });

    it('should return InputAreaWidgetProps when rows > 1', () => {
      const control = createMockControl({ rows: 3 });
      const result = translator.translateControl(control, null, mockOnChange, mockOnBlur, mockOnFocus);

      expect(result.widgetProps).toHaveProperty('rows', 3);
    });

    it('should handle hidden caption', () => {
      const control = createMockControl({ hideCaption: true });
      const result = translator.translateControl(control, null, mockOnChange, mockOnBlur, mockOnFocus);

      expect(result.widgetProps.label).toBeNull();
    });

    it('should handle undefined caption', () => {
      const control = createMockControl({ caption: undefined });
      const result = translator.translateControl(control, null, mockOnChange, mockOnBlur, mockOnFocus);

      expect(result.widgetProps.label).toBeNull();
      expect(result.widgetProps.ariaLabel).toBe('');
    });
  });

  describe('translateInputControl', () => {
    it('should use singleton translator instance', () => {
      const control = createMockControl();
      const result = translateInputControl(control, 'value', mockOnChange, mockOnBlur, mockOnFocus);

      expect(result.widgetProps).toBeDefined();
    });
  });

  describe('translateWidth', () => {
    it('should return undefined for auto width', () => {
      const control = createMockControl({ widthType: 'auto' });
      expect(translateWidth(control)).toBeUndefined();
    });

    it('should return 100% for full width', () => {
      const control = createMockControl({ widthType: 'full' });
      expect(translateWidth(control)).toBe('100%');
    });

    it('should return pixel value for fixed width', () => {
      const control = createMockControl({ widthType: 'fixed', width: 200 });
      expect(translateWidth(control)).toBe('200px');
    });

    it('should preserve existing px suffix', () => {
      const control = createMockControl({ widthType: 'fixed', width: '200px' });
      expect(translateWidth(control)).toBe('200px');
    });

    it('should preserve existing % suffix', () => {
      const control = createMockControl({ widthType: 'fixed', width: '50%' });
      expect(translateWidth(control)).toBe('50%');
    });
  });

  describe('translateIsRequired', () => {
    it('should return false when no validation rules', () => {
      const control = createMockControl({ validationRules: undefined });
      expect(translateIsRequired(control)).toBe(false);
    });

    it('should return false when no Required rule', () => {
      const control = createMockControl({
        validationRules: [
          { rule: ValidationRuleTypes.MinLength, canDelete: false },
          { rule: ValidationRuleTypes.MaxLength, canDelete: false },
        ],
      });
      expect(translateIsRequired(control)).toBe(false);
    });

    it('should return true when Required rule exists', () => {
      const control = createMockControl({
        validationRules: [
          { rule: ValidationRuleTypes.Required, canDelete: false },
          { rule: ValidationRuleTypes.MinLength, canDelete: true },
        ],
      });
      expect(translateIsRequired(control)).toBe(true);
    });
  });

  describe('translateInputType', () => {
    it('should return number for number input type', () => {
      const control = createMockControl({ inputType: 'number' });
      expect(translateInputType(control)).toBe('number');
    });

    it('should return original type for other input types', () => {
      const control = createMockControl({ inputType: 'email' });
      expect(translateInputType(control)).toBe('email');
    });
  });
});
