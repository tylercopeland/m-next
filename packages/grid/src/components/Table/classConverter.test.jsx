import { colors, fontSizes } from '@m-next/styles';
import classConverter from './classConverter';

describe('classConverter', () => {
  it('should return null if no classes are provided', () => {
    expect(classConverter()).toBeNull();
  });

  it('should return correct font size for mi-caption-font-xxxsmall', () => {
    const result = classConverter('mi-caption-font-xxxsmall');
    expect(result).toEqual({ capSize: fontSizes.caption.xxxsmall });
  });

  it('should return correct color for mi-caption-alert', () => {
    const result = classConverter('mi-caption-alert');
    expect(result).toEqual({ capColor: colors.red });
  });

  it('should return correct alignment for mi-caption-left', () => {
    const result = classConverter('mi-caption-left');
    expect(result).toEqual({ capAlign: 'left' });
  });

  it('should return correct font weight for mi-text-bold', () => {
    const result = classConverter('mi-text-bold');
    expect(result).toEqual({ fontWeight: 600 });
  });

  it('should return correct background color for datepicker-alert', () => {
    const result = classConverter('datepicker-alert');
    expect(result).toEqual({ bgColor: colors.fuchsia, color: colors.white });
  });

  it('should handle multiple classes', () => {
    const result = classConverter(
      'mi-caption-font-xxxsmall mi-caption-alert mi-caption-left mi-text-bold datepicker-alert',
    );
    expect(result).toEqual({
      capSize: fontSizes.caption.xxxsmall,
      capColor: colors.red,
      capAlign: 'left',
      fontWeight: 600,
      bgColor: colors.fuchsia,
      color: colors.white,
    });
  });

  it('should return correct font size for mi-dptext-font-large', () => {
    const result = classConverter('mi-dptext-font-large');
    expect(result).toEqual({ fontSize: fontSizes.dtp.large });
  });

  it('should return correct color for mi-caption-primary', () => {
    const result = classConverter('mi-caption-primary');
    expect(result).toEqual({ capColor: colors.blue });
  });

  it('should return correct alignment for mi-caption-center', () => {
    const result = classConverter('mi-caption-center');
    expect(result).toEqual({ capAlign: 'center' });
  });

  it('should return correct font weight for mi-text-bolder', () => {
    const result = classConverter('mi-text-bolder');
    expect(result).toEqual({ fontWeight: 900 });
  });

  it('should return correct background color for datepicker-primary', () => {
    const result = classConverter('datepicker-primary');
    expect(result).toEqual({ bgColor: colors.blue, color: colors.white });
  });
});
