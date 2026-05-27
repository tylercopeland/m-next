import { widgets, complexValueTypes } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import createDatetimePickerControl, { migrateDatetimePickerControl } from './datetimePickerControl';

describe('createDatetimePickerControl', () => {
  it('should create a datetime picker control with default values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');

    const control = createDatetimePickerControl();

    expect(control).toEqual({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: false,
      caption: '',
      classes: '',
      name: 'datetimePicker',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      styles: null,
      validationError: null,
      type: widgets.DTP,
      typeOverride: null,
      dtFormat: 'MMM-DD-YYYY',
      formatType: 'Short Date',
      placeholder: null,
      useDateFormatPlaceholder: false,
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
      onBlur: null,
      onChange: null,
      onClick: null,
      onFocus: null,
      isWorking: false,
    });
  });

  it('should create a datetime picker control with provided base values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    const base = {
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-datetimePicker',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: '2025-02-02 15:30:55',
    };

    const control = createDatetimePickerControl(base);

    expect(control).toMatchObject({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-datetimePicker',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      type: widgets.DTP,
      dtFormat: 'MMM-DD-YYYY',
      formatType: 'Short Date',
      placeholder: null,
      useDateFormatPlaceholder: false,
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
      onBlur: null,
      onChange: null,
      onClick: null,
      onFocus: null,
    });
  });

  describe('migrateDatetimePickerControl', () => {
    it('should return null if the control version matches the current version', () => {
      const oldControl = {
        version: '1.0.0',
        defaultValue: null,
      };

      const result = migrateDatetimePickerControl(oldControl);

      expect(result).toBeNull();
    });

    it('should update the version and transform defaultValue if it is a string', () => {
      const oldControl = {
        version: '0.9.0',
        defaultValue: '2025-02-02 15:30:55',
      };

      const result = migrateDatetimePickerControl(oldControl);

      expect(result).toEqual({
        version: '1.0.0',
        defaultValue: {
          value: '2025-02-02 15:30:55',
          valueType: complexValueTypes.Date,
        },
        value: '2025-02-02 15:30:55',
        validationRules: [
          { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
        ],
      });
    });

    it('should update the version without modifying defaultValue if it is not a string', () => {
      const oldControl = {
        version: '0.9.0',
        defaultValue: { value: '2025-02-02 15:30:55', valueType: complexValueTypes.Text },
      };

      const result = migrateDatetimePickerControl(oldControl);

      expect(result).toEqual({
        version: '1.0.0',
        defaultValue: { value: '2025-02-02 15:30:55', valueType: complexValueTypes.Text },
        validationRules: [
          { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
        ],
      });
    });
  });
});
