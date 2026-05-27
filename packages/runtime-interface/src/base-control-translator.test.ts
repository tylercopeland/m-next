import { BaseControlTranslator, translateWidth } from './base-control-translator';
import type { BaseControl } from './controls/baseControl';

describe('BaseControlTranslator', () => {
  // Concrete subclass for testing
  class TestTranslator extends BaseControlTranslator {
    public translateControl(control: BaseControl) {
      return this.getBaseWidgetProps(control);
    }
  }
  const translator = new TestTranslator();

  const base: BaseControl = {
    id: 'id',
    type: 'test',
    hideCaption: false,
    caption: 'caption',
    classes: '',
    name: 'test',
    widthType: 'auto',
    width: null,
    height: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
    isWorking: false,
  };

  it('should return undefined width for auto widthType', () => {
    const control = { ...base, widthType: 'auto', width: null } as BaseControl;
    expect(translator['translateWidth'](control)).toBeUndefined();
    expect(translator.translateControl(control)).toMatchObject({ width: undefined });
  });

  it('should return width as string for fixed widthType with px', () => {
    const control = { ...base, widthType: 'fixed', width: '100px' } as BaseControl;
    expect(translator['translateWidth'](control)).toBe('100px');
    expect(translator.translateControl(control)).toMatchObject({ width: '100px' });
  });

  it('should return width as string for fixed widthType with %', () => {
    const control = { ...base, widthType: 'fixed', width: '50%' } as BaseControl;
    expect(translator['translateWidth'](control)).toBe('50%');
    expect(translator.translateControl(control)).toMatchObject({ width: '50%' });
  });

  it('should return 100% for full widthType', () => {
    const control = { ...base, widthType: 'full', width: null } as BaseControl;
    expect(translator['translateWidth'](control)).toBe('100%');
    expect(translator.translateControl(control)).toMatchObject({ width: '100%' });
  });

  it('should return undefined for fixed widthType with no width', () => {
    const control = { ...base, widthType: 'fixed', width: null } as BaseControl;
    expect(translator['translateWidth'](control)).toBeUndefined();
    expect(translator.translateControl(control)).toMatchObject({ width: undefined });
  });

  it('should return undefined for fixed widthType with non-px/% width', () => {
    const control = { ...base, widthType: 'fixed', width: 123 } as BaseControl;
    expect(translator['translateWidth'](control)).toBe('123px');
    expect(translator.translateControl(control)).toMatchObject({ width: '123px' });
  });
});

describe('translateWidth (exported function)', () => {
  it('should match BaseControlTranslator.translateWidth logic', () => {
    const control: BaseControl = {
      id: 'id',
      type: 'test',
      hideCaption: false,
      caption: 'caption',
      classes: '',
      name: 'test',
      widthType: 'fixed',
      width: '123px',
      height: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      isWorking: false,
    };
    expect(translateWidth(control)).toBe('123px');
  });
});
