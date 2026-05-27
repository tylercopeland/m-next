import { translateButtonGroupControl, translateV4Styling, translateWidth } from './button-group-translator';
import { ButtonGroupControl, createButtonGroupControl } from './controls/buttonGroupControl';
import { ButtonControl } from './controls/buttonControl';
import { colors } from './colors';

jest.mock('@m-next/styles', () => ({
  colors: {
    blue: '#0000ff',
    white: '#ffffff',
    teal: '#008080',
    yellow: '#ffff00',
    grey: '#888888',
    'grey-lightest': '#f7f7f7',
  },
}));

describe('translateButtonGroupControl', () => {
  it('should translate a basic ButtonGroupControl with visible and invisible buttons', () => {
    const buttons: ButtonControl[] = [
      {
        id: 'b1',
        caption: 'A',
        visible: true,
        disabled: false,
        type: 'button',
        hideCaption: false,
        classes: '',
        name: 'button',
        widthType: 'auto',
        width: null,
        height: null,
        isBound: false,
        defaultValue: null,
        onClick: null,
        icon: null,
        iconAlign: null,
        isWorking: false,
      },
      {
        id: 'b2',
        caption: 'B',
        visible: false,
        disabled: false,
        type: 'button',
        hideCaption: false,
        classes: '',
        name: 'button',
        widthType: 'auto',
        width: null,
        height: null,
        isBound: false,
        defaultValue: null,
        onClick: null,
        icon: null,
        iconAlign: null,
        isWorking: false,
      },
      {
        id: 'b3',
        caption: 'C',
        visible: true,
        disabled: true,
        type: 'button',
        hideCaption: false,
        classes: '',
        name: 'button',
        widthType: 'auto',
        width: null,
        height: null,
        isBound: false,
        defaultValue: null,
        onClick: null,
        icon: null,
        iconAlign: null,
        isWorking: false,
      },
    ];
    const control: ButtonGroupControl = createButtonGroupControl({
      id: 'g1',
      caption: 'Group',
      name: 'group',
      buttons,
      widthType: 'fixed',
      width: 123,
      hideCaption: false,
      menuLabel: 'Menu',
      hasMenuLabel: true,
    });
    const onClick = jest.fn();
    const result = translateButtonGroupControl(control, onClick);
    expect(result.widgetProps).toMatchObject({
      id: 'g1',
      label: 'Group',
      name: 'group',
      data: [
        { label: 'A', disabled: false },
        { label: 'C', disabled: true },
      ],
      width: '123px',
      displayAuto: false,
      showCaption: true,
      onClick,
      menuLabel: 'Menu',
      hasMenuLabel: true,
    });
    // v4Styling is null by default
    expect(result.v4Styling).toBeNull();
  });
});

describe('translateV4Styling', () => {
  it('should return null if no styles', () => {
    const control = createButtonGroupControl();
    expect(translateV4Styling(control)).toBeNull();
  });

  it('should translate primary variant with color', () => {
    const control = createButtonGroupControl();
    control.styles = { variant: 'primary', color: 'blue' };

    const result = translateV4Styling(control);
    expect(result).toEqual({
      backgroundColor: colors.blue,
      borderColor: null,
      color: colors.white,
    });
  });

  it('should use grey text for special background colors in primary', () => {
    const control = createButtonGroupControl();
    control.styles = { variant: 'primary', color: 'white' };

    const result = translateV4Styling(control);
    expect(result).toEqual({
      backgroundColor: colors.white,
      borderColor: null,
      color: colors.grey,
    });
  });

  it('should translate secondary variant with color', () => {
    const control = createButtonGroupControl();
    control.styles = { variant: 'secondary', color: 'teal' };
    const result = translateV4Styling(control);
    expect(result).toEqual({
      backgroundColor: colors.white,
      borderColor: colors.teal,
      color: colors.teal,
    });
  });

  it('should translate tertiary variant with color', () => {
    const control = createButtonGroupControl();
    control.styles = { variant: 'tertiary', color: 'yellow' };
    const result = translateV4Styling(control);
    expect(result).toEqual({
      backgroundColor: null,
      borderColor: null,
      color: colors.yellow,
    });
  });

  it('should handle unknown variant gracefully', () => {
    const control = createButtonGroupControl();
    control.styles = { variant: 'tertiary', color: 'blue' };
    expect(translateV4Styling(control)).toEqual({
      backgroundColor: null,
      borderColor: null,
      color: colors.blue,
    });
  });
});

describe('translateWidth', () => {
  it('should call the class method and return its value', () => {
    const control = createButtonGroupControl({ width: 42, widthType: 'fixed' });
    // The class method just returns control.width as string if present
    expect(translateWidth(control)).toBe('42px');
  });
});
