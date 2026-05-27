import { createBaseControl, BaseControlInput } from './baseControl';

// Mock the Guid utility
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: jest.fn(() => 'mocked-guid-123'),
  },
}));

describe('BaseControl', () => {
  describe('createBaseControl', () => {
    it('should create a control with default values when no input provided', () => {
      const control = createBaseControl();

      expect(control).toEqual({
        id: 'mocked-guid-123',
        type: null,
        typeOverride: null,
        hideCaption: true,
        caption: '',
        classes: '',
        name: 'dropdown',
        widthType: 'auto',
        width: null,
        height: null,
        visible: true,
        disabled: false,
        isBound: false,
        defaultValue: null,
        styles: null,
        onClick: null,
        onFocus: null,
        validationRules: null,
        validationError: null,
        isWorking: false,
      });
    });

    it('should create a control with provided values', () => {
      const input: BaseControlInput = {
        id: 'custom-id',
        type: 'text',
        hideCaption: false,
        caption: 'Test Caption',
        classes: 'test-class',
        name: 'testControl',
        widthType: 'fixed',
        width: 200,
        height: 50,
        visible: false,
        disabled: true,
        isBound: true,
        defaultValue: 'test value',
      };

      const control = createBaseControl(input);

      expect(control).toEqual({
        id: 'custom-id',
        type: 'text',
        typeOverride: null,
        hideCaption: false,
        caption: 'Test Caption',
        classes: 'test-class',
        name: 'testControl',
        widthType: 'fixed',
        width: 200,
        height: 50,
        visible: false,
        disabled: true,
        isBound: true,
        defaultValue: 'test value',
        styles: null,
        onClick: null,
        onFocus: null,
        validationRules: null,
        validationError: null,
        isWorking: false,
      });
    });

    it('should handle boolean defaults correctly when explicitly set to false', () => {
      const input: BaseControlInput = {
        hideCaption: false,
        visible: false,
        disabled: false,
        isBound: false,
      };

      const control = createBaseControl(input);

      expect(control.hideCaption).toBe(false);
      expect(control.visible).toBe(false);
      expect(control.disabled).toBe(false);
      expect(control.isBound).toBe(false);
    });

    it('should handle different ControlValue types', () => {
      const stringValue = createBaseControl({ defaultValue: 'string' });
      const numberValue = createBaseControl({ defaultValue: 42 });
      const booleanValue = createBaseControl({ defaultValue: true });
      const nullValue = createBaseControl({ defaultValue: null });
      const undefinedValue = createBaseControl({ defaultValue: undefined });

      expect(stringValue.defaultValue).toBe('string');
      expect(numberValue.defaultValue).toBe(42);
      expect(booleanValue.defaultValue).toBe(true);
      expect(nullValue.defaultValue).toBe(null);
      expect(undefinedValue.defaultValue).toBe(null);
    });

    it('should handle different WidthType values', () => {
      const fixedWidth = createBaseControl({ widthType: 'fixed' });
      const autoWidth = createBaseControl({ widthType: 'auto' });
      const fullWidth = createBaseControl({ widthType: 'full' });
      const nullWidth = createBaseControl({ widthType: null });

      expect(fixedWidth.widthType).toBe('fixed');
      expect(autoWidth.widthType).toBe('auto');
      expect(fullWidth.widthType).toBe('full');
      expect(nullWidth.widthType).toBe('auto');
    });

    it('should handle width and height as number or string', () => {
      const numberDimensions = createBaseControl({ width: 100, height: 200 });
      const stringDimensions = createBaseControl({ width: '50%', height: '100px' });

      expect(numberDimensions.width).toBe(100);
      expect(numberDimensions.height).toBe(200);
      expect(stringDimensions.width).toBe('50%');
      expect(stringDimensions.height).toBe('100px');
    });
  });
});
