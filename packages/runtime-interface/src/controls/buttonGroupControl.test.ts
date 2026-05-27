import { createButtonGroupControl, ButtonGroupControl, migrateButtonGroupControl } from './buttonGroupControl';
import { createBaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Mock the Guid utility if needed (for createBaseControl)
jest.mock('@m-next/utilities', () => ({
  Guid: {
    create: jest.fn(() => 'mocked-guid-123'),
  },
}));

describe('createButtonGroupControl', () => {
  it('should create a button group control with default values', () => {
    const control = createButtonGroupControl();
    expect(control).toEqual({
      ...createBaseControl(),
      type: WIDGETS.BUTTONGROUP,
      buttons: [
        {
          caption: 'Menu item 1',
          classes: '',
          defaultValue: null,
          disabled: false,
          height: null,
          hideCaption: true,
          id: 'mocked-guid-123',
          isBound: false,
          name: 'dropdown~~mocked-guid-123',
          type: 'BGI',
          typeOverride: 'BGI',
          visible: true,
          width: null,
          widthType: 'auto',
          onClick: null,
          onFocus: null,
          styles: null,
          validationError: null,
          validationRules: null,
          isWorking: false,
        },
        {
          caption: 'Menu item 2',
          classes: '',
          defaultValue: null,
          disabled: false,
          height: null,
          hideCaption: true,
          id: 'mocked-guid-123',
          isBound: false,
          name: 'dropdown~~mocked-guid-123',
          type: 'BGI',
          typeOverride: 'BGI',
          visible: true,
          width: null,
          widthType: 'auto',
          onClick: null,
          onFocus: null,
          styles: null,
          validationError: null,
          validationRules: null,
          isWorking: false,
        },
      ],
      hasMenuLabel: false,
      menuLabel: 'More actions',
    });
  });
});

describe('migrateButtonControl', () => {
  it('should return null if styles already exist', () => {
    const button: ButtonGroupControl = {
      id: 'btn-1',

      hideCaption: true,
      caption: 'Button 1',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      styles: { variant: 'primary', color: 'blue' },
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toBeNull();
  });

  it('should migrate button with no styles and button-primary class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-2',
      hideCaption: true,
      caption: 'Button 2',
      classes: 'mi-button-group-primary',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'blue' },
    });
  });

  it('should migrate button with empty classes', () => {
    const button: ButtonGroupControl = {
      id: 'btn-3',

      hideCaption: true,
      caption: 'Button 3',
      classes: '',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'secondary', color: 'dark-grey' },
    });
  });

  it('should migrate button with button-alert class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-4',
      hideCaption: true,
      caption: 'Button 4',
      classes: 'mi-button-group-alert',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'red' },
    });
  });

  it('should migrate button with button-white class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-5',
      hideCaption: true,
      caption: 'Button 5',
      classes: 'mi-button-group-white',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'white' },
    });
  });

  it('should migrate button with button-secondary class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-6',
      hideCaption: true,
      caption: 'Button 6',
      classes: 'mi-button-group-secondary',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'white' },
    });
  });

  it('should migrate button with text color classes', () => {
    const button: ButtonGroupControl = {
      id: 'btn-7',
      hideCaption: true,
      caption: 'Button 7',
      classes: 'mi-button-group-primary mi-button-group-text-white',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'blue' },
    });
  });

  it('should migrate button with button-success class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-8',
      hideCaption: true,
      caption: 'Button 8',
      classes: 'mi-button-group-success',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'green' },
    });
  });

  it('should migrate button with button-caution class', () => {
    const button: ButtonGroupControl = {
      id: 'btn-9',
      hideCaption: true,
      caption: 'Button 9',
      classes: 'mi-button-group-caution',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
    };
    expect(migrateButtonGroupControl(button)).toEqual({
      ...button,
      styles: { variant: 'primary', color: 'orange' },
    });
  });

  it('should return null when styles object is not empty', () => {
    const button: ButtonGroupControl = {
      id: 'btn-10',
      hideCaption: true,
      caption: 'Button 10',
      classes: 'mi-button-group-primary',
      name: 'button',
      widthType: 'auto',
      width: null,
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      type: WIDGETS.BUTTONGROUP,
      hasMenuLabel: false,
      menuLabel: '',
      buttons: [],
      isWorking: false,
      styles: {
        variant: 'secondary',
        color: 'dark-grey',
      },
    };
    expect(migrateButtonGroupControl(button)).toBeNull();
  });
});
