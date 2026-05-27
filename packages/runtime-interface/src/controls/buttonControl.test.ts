import { Guid } from '@m-next/utilities';
import createButtonControl, { ButtonControlData, ButtonControl, migrateButtonControl } from './buttonControl';
import { BaseControlInput } from './baseControl';
import WIDGETS from '../types/widgetTypes';

describe('createButtonControl', () => {
  it('should create a button control with default values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    const control = createButtonControl();
    expect(control).toEqual({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTON,
      typeOverride: null,
      onClick: null,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      icon: null,
      iconAlign: null,
      height: null,
      isWorking: false,
    });
  });

  it('should create a button control with custom base values', () => {
    const base: BaseControlInput = {
      id: 'test-id',
      hideCaption: false,
      caption: 'Test Button',
      classes: 'btn-primary',
      name: 'button',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: 'default',
      height: null,
    };
    const control = createButtonControl(base);
    expect(control).toEqual({
      ...base,
      type: WIDGETS.BUTTON,
      typeOverride: null,
      onClick: null,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    });
  });

  it('should create a button control with custom data values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    const data: ButtonControlData = {
      onClick: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      icon: 'test-icon',
      iconAlign: 'left',
    };
    const control = createButtonControl(undefined, data);
    expect(control).toEqual({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTON,
      typeOverride: null,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      icon: data.icon,
      iconAlign: data.iconAlign,
      onClick: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      height: null,
      isWorking: false,
    });
  });

  it('should create a button control with custom base and data values', () => {
    const base: BaseControlInput = {
      id: 'test-id',
      hideCaption: false,
      caption: 'Test Button',
      classes: 'btn-primary',
      name: 'button',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: 'default',
      height: null,
    };
    const data: ButtonControlData = {
      onClick: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      icon: 'test-icon',
      iconAlign: 'left',
    };
    const control = createButtonControl(base, data);
    expect(control).toEqual({
      ...base,
      type: WIDGETS.BUTTON,
      typeOverride: null,
      onClick: data.onClick,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      icon: data.icon,
      iconAlign: data.iconAlign,
      isWorking: false,
    });
  });
});

describe('migrateButtonControl', () => {
  it('should return null when styles already exist', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      styles: {
        variant: 'primary',
        color: 'blue',
      },
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toBeNull();
  });

  it('should migrate button with primary background class', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'button-primary',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'blue',
      },
    });
  });

  it('should migrate button with white background class', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'button-white mi-color-primary',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'white',
      },
    });
  });

  it('should migrate button with empty classes', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'blue',
      },
    });
  });

  it('should migrate button with alert background class', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'button-alert',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'red',
      },
    });
  });

  it('should migrate button with success background class', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'button-success',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'green',
      },
    });
  });

  it('should migrate button with custom text color and background', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'button-secondary mi-color-success',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'primary',
        color: 'white',
      },
    });
  });

  it('should handle non-standard background classes', () => {
    const control: ButtonControl = {
      id: 'test-id',
      type: WIDGETS.BUTTON,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: 'custom-class',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      isWorking: false,
    };

    const result = migrateButtonControl(control);
    expect(result).toEqual({
      ...control,
      styles: {
        variant: 'secondary',
        color: 'dark-grey',
      },
    });
  });

  it('should migrate button with grey background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-grey',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'grey',
    });
  });

  it('should migrate button with caution background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-caution',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'orange',
    });
  });

  it('should migrate button with pink background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-pink',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'fuchsia',
    });
  });

  it('should migrate button with purple background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-purple',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'purple',
    });
  });

  it('should migrate button with aqua background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-aqua',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'teal',
    });
  });

  it('should migrate button with yellow background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-yellow',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'yellow',
    });
  });

  it('should migrate button with gunmetal background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-gunmetal',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'grey-darker',
    });
  });

  it('should migrate button with silver background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-silver',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'grey-lighter',
    });
  });

  it('should migrate button with black background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-black',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'black',
    });
  });

  it('should migrate button with transparent background class', () => {
    const control: ButtonControl = {
      ...createButtonControl(),
      classes: 'button-transparent mi-color-primary',
    };

    const result = migrateButtonControl(control);
    expect(result?.styles).toEqual({
      variant: 'primary',
      color: 'white',
    });
  });

  it('should migrate button with various text colors when no button- class (defaults to white)', () => {
    const testCases = [
      { textColor: 'mi-color-alert', expected: 'red' },
      { textColor: 'mi-color-navigation', expected: 'blue-darker' },
      { textColor: 'mi-color-caution', expected: 'yellow' },
      { textColor: 'mi-color-pink', expected: 'fuchsia' },
      { textColor: 'mi-color-purple', expected: 'purple' },
      { textColor: 'mi-color-aqua', expected: 'teal' },
      { textColor: 'mi-color-yellow', expected: 'yellow' },
      { textColor: 'mi-color-grey', expected: 'grey-light' },
      { textColor: 'mi-color-gunmetal', expected: 'grey-darker' },
      { textColor: 'mi-color-silver', expected: 'grey-light' },
      { textColor: 'mi-color-black', expected: 'black' },
      { textColor: 'mi-color-white', expected: 'white' },
    ];

    testCases.forEach(({ textColor, expected }) => {
      const control: ButtonControl = {
        ...createButtonControl(),
        classes: `some-other-class ${textColor}`, // No button- class, so bgColor defaults to 'white'
      };

      const result = migrateButtonControl(control);
      expect(result?.styles).toEqual({
        variant: 'secondary',
        color: expected,
      });
    });
  });
});
