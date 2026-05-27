import { colors, fontSizes } from '@m-next/styles';

export default function (classes = null) {
  let obj = null;
  if (classes) {
    const classNames = classes.split(' ');
    if (classNames.length > 0) {
      obj = {};

      classNames.forEach((name) => {
        switch (name) {
          // Caption Font Sizes
          case 'mi-caption-font-xxxsmall':
            obj.capSize = fontSizes.caption.xxxsmall;
            break;
          case 'mi-caption-font-xxsmall':
            obj.capSize = fontSizes.caption.xxsmall;
            break;
          case 'mi-caption-font-xsmall':
            obj.capSize = fontSizes.caption.xsmall;
            break;
          case 'mi-caption-font-small':
            obj.capSize = fontSizes.caption.small;
            break;
          case 'mi-caption-font-normal':
            obj.capSize = fontSizes.caption.normal;
            break;
          case 'mi-caption-font-large':
            obj.capSize = fontSizes.caption.large;
            break;
          case 'mi-caption-font-xlarge':
            obj.capSize = fontSizes.caption.xlarge;
            break;
          case 'mi-caption-font-xxlarge':
            obj.capSize = fontSizes.caption.xxlarge;
            break;
          case 'mi-caption-font-xxxlarge':
            obj.capSize = fontSizes.caption.xxxlarge;
            break;

          // Caption Colors
          case 'mi-caption-alert':
          case 'mi-caption-pink':
            obj.capColor = colors.red;
            break;
          case 'mi-caption-primary':
            obj.capColor = colors.blue;
            break;
          case 'mi-caption-silver':
            obj.capColor = colors['grey-lighter'];
            break;
          case 'mi-caption-navigation':
            obj.capColor = colors['blue-dark'];
            break;
          case 'mi-caption-yellow':
            obj.capColor = colors.yellow;
            break;
          case 'mi-caption-success':
            obj.capColor = colors.green;
            break;
          case 'mi-caption-grey':
            obj.capColor = colors.grey;
            break;
          case 'mi-caption-gunmetal':
            obj.capColor = colors['grey-dark'];
            break;
          case 'mi-caption-black':
            obj.capColor = colors.black;
            break;
          case 'mi-caption-white':
            obj.capColor = colors.white;
            break;
          case 'mi-caption-aqua':
            obj.capColor = colors.teal;
            break;
          case 'mi-caption-orange':
          case 'mi-caption-caution':
            obj.capColor = colors.orange;
            break;
          case 'mi-caption-purple':
            obj.capColor = colors.purple;
            break;

          // Caption Align
          case 'mi-caption-left':
            obj.capAlign = 'left';
            break;
          case 'mi-caption-right':
            obj.capAlign = 'right';
            break;
          case 'mi-caption-center':
            obj.capAlign = 'center';
            break;

          // Font Weights
          case 'mi-text-bold':
            obj.fontWeight = 600;
            break;
          case 'mi-text-bolder':
            obj.fontWeight = 900;
            break;

          // DTP Font Sizes
          case 'mi-dptext-font-small':
            obj.fontSize = fontSizes.dtp.small;
            break;
          case 'mi-dptext-font-normal':
            obj.fontSize = fontSizes.dtp.regular;
            break;
          case 'mi-dptext-font-large':
            obj.fontSize = fontSizes.dtp.large;
            break;
          case 'mi-dptext-font-xlarge':
            obj.fontSize = fontSizes.dtp.xlarge;
            break;
          case 'mi-dptext-font-xxlarge':
            obj.fontSize = fontSizes.dtp.xxlarge;
            break;
          case 'mi-dptext-font-xxxlarge':
            obj.fontSize = fontSizes.dtp.xxxlarge;
            break;

          // Background Colors
          case 'datepicker-alert':
            obj.bgColor = colors.fuchsia;
            obj.color = colors.white;
            break;
          case 'datepicker-primary':
            obj.bgColor = colors.blue;
            obj.color = colors.white;
            break;
          case 'datepicker-secondary':
            obj.bgColor = colors['grey-lighter'];
            obj.color = colors.white;
            break;
          case 'datepicker-navigation':
            obj.bgColor = colors['blue-darker'];
            obj.color = colors.white;
            break;
          case 'datepicker-caution':
            obj.bgColor = colors.yellow;
            obj.color = colors.white;
            break;
          case 'datepicker-success':
            obj.bgColor = colors.green;
            obj.color = colors.white;
            break;
          case 'datepicker-darkgrey':
            obj.bgColor = colors['grey-darker'];
            obj.color = colors.white;
            break;
          case 'datepicker-silver':
            obj.bgColor = colors['grey-lighter'];
            obj.color = colors.white;
            break;
          case 'datepicker-black':
            obj.bgColor = colors.black;
            obj.color = colors.white;
            break;
          case 'datepicker-white':
            obj.bgColor = colors.white;
            obj.color = colors.black;
            break;
          default:
            break;
        }
      });
    }
  }

  return obj;
}
