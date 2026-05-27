import { widgets } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import createButtonControl from './buttonControl';

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
      onFocus: null,
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: widgets.BUTTON,
      typeOverride: null,
      styles: null,
      validationError: null,
      validationRules: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      height: null,
      isWorking: false, // Assuming isWorking is a default property

    });
  });

  it('should create a button control with custom base values', () => {
    const base = {
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
      isWorking: false, // Assuming isWorking is a default property

    };
    const control = createButtonControl(base);
    expect(control).toEqual({
      ...base,
      type: widgets.BUTTON,
      typeOverride: null,
      onClick: null,
      icon: null,
      iconAlign: null,
      validationError: null,
      onFocus: null,
      styles: null,
      validationRules: null,
      isWorking: false, // Assuming isWorking is a default property
    });
  });

  it('should create a button control with custom data values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    const data = {
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
      type: widgets.BUTTON,
      typeOverride: null,
      icon: data.icon,
      iconAlign: data.iconAlign,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      onClick: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      height: null,
      isWorking: false, // Assuming isWorking is a default property
    });
  });

  it('should create a button control with custom base and data values', () => {
    const base = {
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
      isWorking: false, // Assuming isWorking is a default property

    };
    const data = {
      onClick: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      icon: 'test-icon',
      iconAlign: 'left',
    };
    const control = createButtonControl(base, data);
    expect(control).toEqual({
      ...base,
      type: widgets.BUTTON,
      typeOverride: null,
      onClick: data.onClick,
      icon: data.icon,
      iconAlign: data.iconAlign,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
    });
  });
});
