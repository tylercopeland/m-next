import {
  ButtonControlTranslator,
  translateButtonControl,
  translateIcon,
  translateV4Styling,
  translateWidth,
  generateBaseStyle,
} from './button-translator';
import { createButtonControl } from './controls/buttonControl';
import { ButtonControl } from './types';

describe('ButtonControlTranslator', () => {
  const translator = new ButtonControlTranslator();
  const onClick = jest.fn();

  it('should map base and button properties correctly', () => {
    const control = createButtonControl({ caption: 'Test', hideCaption: false }) as ButtonControl;
    const result = translator.translateControl(control, onClick);
    expect(result.widgetProps).toMatchObject({
      id: control.id,
      value: ' Test ',
      buttonStyle: 'primary',
      onClick,
      isV4Design: false,
    });
  });

  it('should set value to empty string if hideCaption is true', () => {
    const control = createButtonControl({ caption: 'Should be hidden', hideCaption: true }) as ButtonControl;
    const result = translator.translateControl(control, onClick);
    expect(result.widgetProps.value).toBe('');
  });

  it('should set buttonStyle to link for tertiary variant', () => {
    const control = createButtonControl({ caption: 'Tertiary' }, { icon: null, iconAlign: null }) as ButtonControl;
    control.styles = { variant: 'tertiary', color: 'red' };
    const result = translator.translateControl(control, onClick);
    expect(result.widgetProps.buttonStyle).toBe('link');
  });

  it('should set isV4Design true if v4Styling is present', () => {
    const control = createButtonControl({ caption: 'Primary' }) as ButtonControl;
    control.styles = { variant: 'primary', color: 'blue' };
    const result = translator.translateControl(control, onClick);
    expect(result.widgetProps.isV4Design).toBe(true);
    expect(result.v4Styling).toBeTruthy();
  });
});

describe('translateButtonControl (singleton)', () => {
  it('should delegate to the singleton translator and return correct result', () => {
    const control = createButtonControl({ caption: 'Singleton', hideCaption: false }) as ButtonControl;
    const onClick = jest.fn();
    const result = translateButtonControl(control, onClick);
    expect(result.widgetProps.value).toBe(' Singleton ');
    expect(result.widgetProps.onClick).toBe(onClick);
  });
});

describe('translateIcon', () => {
  it('should return undefined if no icon', () => {
    const control = createButtonControl() as ButtonControl;
    expect(translateIcon(control)).toBeUndefined();
  });
  it('should parse icon name and default to left position', () => {
    const control = createButtonControl({}, { icon: 'mi-icon-test', iconAlign: 'Left' }) as ButtonControl;
    expect(translateIcon(control)).toMatchObject({ name: 'test', position: 'left', size: 14 });
  });
  it('should set position to right if iconAlign is right', () => {
    const control = createButtonControl({}, { icon: 'mi-icon-test', iconAlign: 'Right' }) as ButtonControl;
    expect(translateIcon(control)).toMatchObject({ position: 'right' });
  });
});

describe('translateV4Styling', () => {
  it('should return null if no styles', () => {
    const control = createButtonControl() as ButtonControl;
    expect(translateV4Styling(control)).toBeNull();
  });

  it('should return null if styles is empty object', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = {};
    expect(translateV4Styling(control)).toBeNull();
  });

  it('should return correct colorMap for primary variant', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'blue' };
    const result = translateV4Styling(control);
    expect(result).toMatchObject({
      backgroundColor: expect.anything(),
      color: expect.anything(),
      borderColor: expect.anything(),
    });
  });

  it('should return correct colorMap for primary variant with special colors requiring grey text', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'white' };
    const result = translateV4Styling(control);
    expect(result?.color).toBe('#545F67'); // colors.grey
    expect(result?.backgroundColor).toBe('#FFFFFF'); // colors.white
  });

  it('should return correct colorMap for primary variant with teal color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'teal' };
    const result = translateV4Styling(control);
    expect(result?.color).toBe('#545F67'); // colors.grey
    expect(result?.backgroundColor).toBe('#2EC9E8'); // colors.teal
  });

  it('should return correct colorMap for primary variant with yellow color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'yellow' };
    const result = translateV4Styling(control);
    expect(result?.color).toBe('#545F67'); // colors.grey
    expect(result?.backgroundColor).toBe('#FDCB2E'); // colors.yellow
  });

  it('should return correct colorMap for primary variant with grey-lightest color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'grey-lightest' };
    const result = translateV4Styling(control);
    expect(result?.color).toBe('#545F67'); // colors.grey
    expect(result?.backgroundColor).toBe('#EEF5F7'); // colors['grey-lightest']
  });

  it('should return correct colorMap for primary variant with no color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: '' };
    const result = translateV4Styling(control);
    expect(result?.backgroundColor).toBeNull();
    expect(result?.borderColor).toBeNull();
    expect(result?.color).toBe('#FFFFFF'); // colors.white
  });

  it('should return correct colorMap for secondary variant', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'secondary', color: 'red' };
    const result = translateV4Styling(control);
    expect(result).toMatchObject({
      backgroundColor: expect.anything(),
      color: expect.anything(),
      borderColor: expect.anything(),
    });
  });

  it('should return correct colorMap for secondary variant with no color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'secondary', color: '' };
    const result = translateV4Styling(control);
    expect(result?.color).toBeNull();
    expect(result?.borderColor).toBeNull();
    expect(result?.backgroundColor).toBe('#FFFFFF'); // colors.white
  });

  it('should return correct colorMap for tertiary variant', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'tertiary', color: 'green' };
    const result = translateV4Styling(control);
    expect(result).toMatchObject({ backgroundColor: null, borderColor: null, color: expect.anything() });
  });

  it('should return correct colorMap for tertiary variant with no color', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'tertiary', color: '' };
    const result = translateV4Styling(control);
    expect(result?.color).toBeNull();
    expect(result?.borderColor).toBeNull();
    expect(result?.backgroundColor).toBeNull();
  });
});

describe('translateWidth', () => {
  it('should delegate to the singleton translator', () => {
    const control = createButtonControl({ widthType: 'fixed', width: '123px' }) as ButtonControl;
    expect(translateWidth(control)).toBe('123px');
  });
});

describe('generateBaseStyle', () => {
  it('should return undefined if no v4Styling', () => {
    const control = createButtonControl() as ButtonControl;
    expect(generateBaseStyle(control, null)).toBeUndefined();
  });

  it('should return correct base style for non-tertiary variant', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'primary', color: 'blue' };
    const v4Styling = { backgroundColor: 'blue', color: 'white', borderColor: 'blue' };
    const result = generateBaseStyle(control, v4Styling);
    expect(result).toEqual({
      margin: '0 5px 10px',
      padding: undefined,
    });
  });

  it('should return correct base style for tertiary variant', () => {
    const control = createButtonControl() as ButtonControl;
    control.styles = { variant: 'tertiary', color: 'red' };
    const v4Styling = { backgroundColor: null, color: 'red', borderColor: null };
    const result = generateBaseStyle(control, v4Styling);
    expect(result).toEqual({
      margin: '0 5px 10px',
      padding: '8px 0px',
    });
  });
});
