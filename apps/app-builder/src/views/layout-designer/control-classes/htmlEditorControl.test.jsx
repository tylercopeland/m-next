import { complexValueTypes, widgets } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import createHtmlEditorControl, { migrateHtmlEditorControl } from './htmlEditorControl';

describe('createHtmlEditorControl', () => {
  it('should create an HTML editor control with default values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');

    const control = createHtmlEditorControl();

    expect(control).toEqual({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: false,
      caption: '',
      classes: '',
      name: 'htmlEditor',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: widgets.HTMLEDITOR,
      typeOverride: null,
      styles: null,
      validationError: null,
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

  it('should create an HTML editor control with provided base values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    const base = {
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-htmlEditor',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: '<p>Default HTML</p>',
    };

    const control = createHtmlEditorControl(base);

    expect(control).toMatchObject({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-htmlEditor',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      type: widgets.HTMLEDITOR,
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
      onBlur: null,
      onChange: null,
      onClick: null,
      onFocus: null,
    });
  });
});

describe('migrateHtmlEditorControl', () => {
  it('should return null if the control version matches the current version', () => {
    const oldControl = {
      version: '1.0.0',
      defaultValue: null,
    };

    const result = migrateHtmlEditorControl(oldControl);

    expect(result).toBeNull();
  });

  it('should update the version and add default validation rules if missing', () => {
    const oldControl = {
      version: '0.9.0',
      defaultValue: '<p>Some HTML</p>',
      validationRules: [],
    };

    const result = migrateHtmlEditorControl(oldControl);

    expect(result).toEqual({
      version: '1.0.0',
      defaultValue: {
        value: '<p>Some HTML</p>',
        valueType: complexValueTypes.Text,
      },
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
    });
  });

  it('should update the version and keep existing validation rules if present', () => {
    const oldControl = {
      version: '0.9.0',
      defaultValue: '<p>Some HTML</p>',
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: false, canDelete: false },
      ],
    };

    const result = migrateHtmlEditorControl(oldControl);

    expect(result).toEqual({
      version: '1.0.0',
      defaultValue: {
        value: '<p>Some HTML</p>',
        valueType: complexValueTypes.Text,
      },
      validationRules: [
        { rule: ValidationRuleTypes.MaliciousValues, value: false, canDelete: false },
      ],
    });
  });
}); 