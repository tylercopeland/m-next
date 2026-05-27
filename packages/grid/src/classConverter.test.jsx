import { colors, fontSizes } from '@m-next/styles';
import classConverter from './classConverter';

describe('classConverter', () => {
  it('should return null if no classes are provided', () => {
    expect(classConverter()).toBeNull();
  });

  it('should convert caption font size classes correctly', () => {
    expect(classConverter('mi-caption-font-xxxsmall')).toEqual({ capSize: fontSizes.caption.xxxsmall });
    expect(classConverter('mi-caption-font-xxsmall')).toEqual({ capSize: fontSizes.caption.xxsmall });
    expect(classConverter('mi-caption-font-xsmall')).toEqual({ capSize: fontSizes.caption.xsmall });
    expect(classConverter('mi-caption-font-small')).toEqual({ capSize: fontSizes.caption.small });
    expect(classConverter('mi-caption-font-normal')).toEqual({ capSize: fontSizes.caption.normal });
    expect(classConverter('mi-caption-font-large')).toEqual({ capSize: fontSizes.caption.large });
    expect(classConverter('mi-caption-font-xlarge')).toEqual({ capSize: fontSizes.caption.xlarge });
    expect(classConverter('mi-caption-font-xxlarge')).toEqual({ capSize: fontSizes.caption.xxlarge });
    expect(classConverter('mi-caption-font-xxxlarge')).toEqual({ capSize: fontSizes.caption.xxxlarge });
  });

  it('should convert caption color classes correctly', () => {
    expect(classConverter('mi-caption-alert')).toEqual({ capColor: colors.red });
    expect(classConverter('mi-caption-primary')).toEqual({ capColor: colors.blue });
    expect(classConverter('mi-caption-silver')).toEqual({ capColor: colors['grey-lighter'] });
    expect(classConverter('mi-caption-navigation')).toEqual({ capColor: colors['blue-dark'] });
    expect(classConverter('mi-caption-yellow')).toEqual({ capColor: colors.yellow });
    expect(classConverter('mi-caption-success')).toEqual({ capColor: colors.green });
    expect(classConverter('mi-caption-grey')).toEqual({ capColor: colors.grey });
    expect(classConverter('mi-caption-gunmetal')).toEqual({ capColor: colors['grey-dark'] });
    expect(classConverter('mi-caption-black')).toEqual({ capColor: colors.black });
    expect(classConverter('mi-caption-white')).toEqual({ capColor: colors.white });
    expect(classConverter('mi-caption-aqua')).toEqual({ capColor: colors.teal });
    expect(classConverter('mi-caption-orange')).toEqual({ capColor: colors.orange });
    expect(classConverter('mi-caption-purple')).toEqual({ capColor: colors.purple });
  });

  it('should convert caption alignment classes correctly', () => {
    expect(classConverter('mi-caption-left')).toEqual({ capAlign: 'left' });
    expect(classConverter('mi-caption-right')).toEqual({ capAlign: 'right' });
    expect(classConverter('mi-caption-center')).toEqual({ capAlign: 'center' });
  });

  it('should convert font weight classes correctly', () => {
    expect(classConverter('mi-text-bold')).toEqual({ fontWeight: 600 });
    expect(classConverter('mi-text-bolder')).toEqual({ fontWeight: 900 });
  });

  it('should convert DTP font size classes correctly', () => {
    expect(classConverter('mi-dptext-font-small')).toEqual({ fontSize: fontSizes.dtp.small });
    expect(classConverter('mi-dptext-font-normal')).toEqual({ fontSize: fontSizes.dtp.regular });
    expect(classConverter('mi-dptext-font-large')).toEqual({ fontSize: fontSizes.dtp.large });
    expect(classConverter('mi-dptext-font-xlarge')).toEqual({ fontSize: fontSizes.dtp.xlarge });
    expect(classConverter('mi-dptext-font-xxlarge')).toEqual({ fontSize: fontSizes.dtp.xxlarge });
    expect(classConverter('mi-dptext-font-xxxlarge')).toEqual({ fontSize: fontSizes.dtp.xxxlarge });
  });

  it('should convert background color classes correctly', () => {
    expect(classConverter('datepicker-alert')).toEqual({ bgColor: colors.fuchsia, color: colors.white });
    expect(classConverter('datepicker-primary')).toEqual({ bgColor: colors.blue, color: colors.white });
    expect(classConverter('datepicker-secondary')).toEqual({ bgColor: colors['grey-lighter'], color: colors.white });
    expect(classConverter('datepicker-navigation')).toEqual({ bgColor: colors['blue-darker'], color: colors.white });
    expect(classConverter('datepicker-caution')).toEqual({ bgColor: colors.yellow, color: colors.white });
    expect(classConverter('datepicker-success')).toEqual({ bgColor: colors.green, color: colors.white });
    expect(classConverter('datepicker-darkgrey')).toEqual({ bgColor: colors['grey-darker'], color: colors.white });
    expect(classConverter('datepicker-silver')).toEqual({ bgColor: colors['grey-lighter'], color: colors.white });
    expect(classConverter('datepicker-black')).toEqual({ bgColor: colors.black, color: colors.white });
    expect(classConverter('datepicker-white')).toEqual({ bgColor: colors.white, color: colors.black });
  });
});
