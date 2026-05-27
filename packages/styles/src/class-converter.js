import { WIDGETS } from '@m-next/runtime-interface';
import colors from './colors';
import fontSizes from './font-sizes';

export const convertLegacyCaptionStyle = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        case 'mi-caption-font-xxxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xsmall':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-small':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-normal':
          style.fontSize = '14px';
          break;
        case 'mi-caption-font-large':
          style.fontSize = '14px';
          break;
        case 'mi-caption-font-xlarge':
          style.fontSize = '15.75px';
          break;
        case 'mi-caption-font-xxlarge':
          style.fontSize = '19.25px';
          break;
        case 'mi-caption-font-xxxlarge':
          style.fontSize = '26.25px';
          break;

        // Caption Colors
        case 'mi-caption-alert':
        case 'mi-caption-pink':
          style.color = '#DA211E';
          break;
        case 'mi-caption-primary':
          style.color = '#0D71C8';
          break;
        case 'mi-caption-silver':
          style.color = '#EEF5F7';
          break;
        case 'mi-caption-navigation':
          style.color = '#022266';
          break;
        case 'mi-caption-yellow':
          style.color = '#FDCB2E';
          break;
        case 'mi-caption-success':
          style.color = '#007B4A';
          break;
        case 'mi-caption-grey':
          style.color = '#BACAD0';
          break;
        case 'mi-caption-gunmetal':
          style.color = '#2A394A';
          break;
        case 'mi-caption-black':
          style.color = '#000000';
          break;
        case 'mi-caption-white':
          style.color = '#ffffff';
          break;
        case 'mi-caption-aqua':
          style.color = '#2EC9E8';
          break;
        case 'mi-caption-orange':
        case 'mi-caption-caution':
          style.color = '#E05D2A';
          break;
        case 'mi-caption-purple':
          style.color = '#3B4AED';
          break;

        // Caption Align
        case 'mi-caption-left':
          style.textAlign = 'left';
          break;
        case 'mi-caption-right':
          style.textAlign = 'right';
          break;
        case 'mi-caption-center':
          style.textAlign = 'center';
          break;
        default:
          return null;
      }
    });
  }
  return style;
};

export const convertLegacyControlStyle = (classes, control, options) => {
  const style = {};
  if (classes !== null && classes !== undefined) {
    if (control === WIDGETS.BUTTONGROUP) {
      if (options.ignoreBorder) {
        style.color = colors['white'];
      } else {
        style.borderColor = colors['white'];
      }

      const classList = classes.split(' ');

      if (classes === '') {
        style.color = colors['grey'];
        style.backgroundColor = colors['white'];
        style.borderColor = colors['grey'];

        return style;
      }

      // For button-menus: where background color = Regular and text color != Regular
      if (classList.length === 1) {
        const index = classList[0].indexOf('text');
        if (index !== -1) {
          style.backgroundColor = colors['white'];
          style.borderColor = colors['grey'];
        }
      }
    }

    classes.split(' ').forEach((item) => {
      switch (item) {
        // Caption Font Sizes
        case 'input-font-xxxsmall':
          style.fontSize = fontSizes.caption.xxxsmall;
          break;
        case 'input-font-xxsmall':
          style.fontSize = fontSizes.caption.xxsmall;
          break;
        case 'input-font-xsmall':
          style.fontSize = fontSizes.caption.xsmall;
          break;
        case 'input-font-small':
          style.fontSize = fontSizes.caption.small;
          break;
        case 'input-font-normal':
          style.fontSize = fontSizes.caption.regular;
          break;
        case 'input-font-large':
          style.fontSize = fontSizes.caption.large;
          break;
        case 'input-font-xlarge':
          style.fontSize = fontSizes.caption.xlarge;
          break;
        case 'input-font-xxlarge':
          style.fontSize = fontSizes.caption.xxlarge;
          break;
        case 'input-font-xxxlarge':
          style.fontSize = fontSizes.caption.xxxlarge;
          break;

        // Background Colors
        case 'mi-background-alert':
          style.backgroundColor = colors.red;
          break;
        case 'mi-background-pink':
          style.backgroundColor = colors.fuchsia;
          break;
        case 'mi-background-primary':
          style.backgroundColor = colors.blue;
          break;
        case 'mi-background-silver':
          style.backgroundColor = colors['grey-lightest'];
          break;
        case 'mi-background-navigation':
          style.backgroundColor = colors['blue-dark'];
          break;
        case 'mi-background-yellow':
          style.backgroundColor = colors.yellow;
          break;
        case 'mi-background-success':
          style.backgroundColor = colors.green;
          break;
        case 'mi-background-grey':
          style.backgroundColor = colors['grey-light'];
          break;
        case 'mi-background-dark-grey':
          style.backgroundColor = colors.grey;
          break;
        case 'mi-background-gunmetal':
          style.backgroundColor = colors['grey-dark'];
          break;
        case 'mi-background-black':
          style.backgroundColor = colors.black;
          break;
        case 'mi-background-white':
          style.backgroundColor = colors.white;
          break;
        case 'mi-background-aqua':
          style.backgroundColor = colors.green;
          break;
        case 'mi-background-orange':
        case 'mi-background-caution':
          style.backgroundColor = colors.orange;
          break;
        case 'mi-background-purple':
          style.backgroundColor = colors.purple;
          break;

        // Text Colors
        case 'input-text-alert':
          style.color = colors.red;
          break;
        case 'input-text-pink':
          style.color = colors.fuchsia;
          break;
        case 'input-text-primary':
          style.color = colors['blue'];
          break;
        case 'input-text-silver':
          style.color = colors['grey-lightest'];
          break;
        case 'input-text-navigation':
          style.color = colors['method'];
          break;
        case 'input-text-yellow':
          style.color = colors.yellow;
          break;
        case 'input-text-success':
          style.color = colors.green;
          break;
        case 'input-text-grey':
          style.color = colors.grey;
          break;
        case 'input-text-dark-grey':
          style.color = colors.grey;
          break;
        case 'input-text-gunmetal':
          style.color = colors['grey-dark'];
          break;
        case 'input-text-black':
          style.color = colors['black'];
          break;
        case 'input-text-white':
          style.color = colors['white'];
          break;
        case 'input-text-aqua':
          style.color = colors['green'];
          break;
        case 'input-text-orange':
        case 'input-text-caution':
          style.color = colors['orange'];
          break;
        case 'input-text-purple':
          style.color = colors.purple;
          break;

        // Caption Align
        case 'input-left':
          style.textAlign = 'left';
          break;
        case 'input-right':
          style.textAlign = 'right';
          break;
        case 'input-center':
          style.textAlign = 'center';
          break;

        // Font Weights
        case 'mi-text-bold':
          style.fontWeight = '600';
          break;
        case 'mi-text-bolder':
          style.fontWeight = '900';
          break;

        // Border Width
        case 'mi-left-border-none':
          style.borderLeftWidth = '0px';
          break;
        case 'mi-left-border-normal':
          style.borderLeftWidth = '1px';
          break;
        case 'mi-left-border-2px':
          style.borderLeftWidth = '2px';
          break;
        case 'mi-left-border-4px':
          style.borderLeftWidth = '4px';
          break;
        case 'mi-left-border-6px':
          style.borderLeftWidth = '6px';
          break;
        case 'mi-left-border-8px':
          style.borderLeftWidth = '8px';
          break;
        case 'mi-left-border-10px':
          style.borderLeftWidth = '10px';
          break;

        case 'mi-right-border-none':
          style.borderRightWidth = '0px';
          break;
        case 'mi-right-border-normal':
          style.borderRightWidth = '1px';
          break;
        case 'mi-right-border-2px':
          style.borderRightWidth = '2px';
          break;
        case 'mi-right-border-4px':
          style.borderRightWidth = '4px';
          break;
        case 'mi-right-border-6px':
          style.borderRightWidth = '6px';
          break;
        case 'mi-right-border-8px':
          style.borderRightWidth = '8px';
          break;
        case 'mi-right-border-10px':
          style.borderRightWidth = '10px';
          break;

        case 'mi-top-border-none':
          style.borderTopWidth = '0px';
          break;
        case 'mi-top-border-normal':
          style.borderTopWidth = '1px';
          break;
        case 'mi-top-border-2px':
          style.borderTopWidth = '2px';
          break;
        case 'mi-top-border-4px':
          style.borderTopWidth = '4px';
          break;
        case 'mi-top-border-6px':
          style.borderTopWidth = '6px';
          break;
        case 'mi-top-border-8px':
          style.borderTopWidth = '8px';
          break;
        case 'mi-top-border-10px':
          style.borderTopWidth = '10px';
          break;

        case 'mi-bottom-border-none':
          style.borderBottomWidth = '0px';
          break;
        case 'mi-bottom-border-normal':
          style.borderBottomWidth = '1px';
          break;
        case 'mi-bottom-border-2px':
          style.borderBottomWidth = '2px';
          break;
        case 'mi-bottom-border-4px':
          style.borderBottomWidth = '4px';
          break;
        case 'mi-bottom-order-6px': // hack for bug
        case 'mi-bottom-border-6px':
          style.borderBottomWidth = '6px';
          break;
        case 'mi-bottom-border-8px':
          style.borderBottomWidth = '8px';
          break;
        case 'mi-bottom-border-10px':
          style.borderBottomWidth = '10px';
          break;

        // Border Style
        case 'mi-left-border-dashed':
          style.borderLeftStyle = 'dashed';
          break;
        case 'mi-left-border-dotted':
          style.borderLeftStyle = 'dotted';
          break;
        case 'mi-left-border-solid':
          style.borderLeftStyle = 'solid';
          break;
        case 'mi-left-border-double':
          style.borderLeftStyle = 'double';
          break;

        case 'mi-right-border-dashed':
          style.borderRightStyle = 'dashed';
          break;
        case 'mi-right-border-dotted':
          style.borderRightStyle = 'dotted';
          break;
        case 'mi-right-border-solid':
          style.borderRightStyle = 'solid';
          break;
        case 'mi-right-border-double':
          style.borderRightStyle = 'double';
          break;

        case 'mi-top-border-dashed':
          style.borderTopStyle = 'dashed';
          break;
        case 'mi-top-border-dotted':
          style.borderTopStyle = 'dotted';
          break;
        case 'mi-top-border-solid':
          style.borderTopStyle = 'solid';
          break;
        case 'mi-top-border-double':
          style.borderTopStyle = 'double';
          break;

        case 'mi-bottom-border-dashed':
          style.borderBottomStyle = 'dashed';
          break;
        case 'mi-bottom-border-dotted':
          style.borderBottomStyle = 'dotted';
          break;
        case 'mi-bottom-border-solid':
          style.borderBottomStyle = 'solid';
          break;
        case 'mi-bottom-border-double':
          style.borderBottomStyle = 'double';
          break;

        // Border Colors
        case 'mi-left-border-color-alert':
          style.borderLeftColor = colors.red;
          break;
        case 'mi-left-border-color-pink':
          style.borderLeftColor = colors.fuchsia;
          break;
        case 'mi-left-border-color-primary':
          style.borderLeftColor = colors['blue'];
          break;
        case 'mi-left-border-color-silver':
          style.borderLeftColor = colors['grey-lightest'];
          break;
        case 'mi-left-border-color-navigation':
          style.borderLeftColor = colors['method'];
          break;
        case 'mi-left-border-color-yellow':
          style.borderLeftColor = colors.yellow;
          break;
        case 'mi-left-border-color-success':
          style.borderLeftColor = colors.green;
          break;
        case 'mi-left-border-color-grey':
          style.borderLeftColor = colors.grey;
          break;
        case 'mi-left-border-color-dark-grey':
          style.borderLeftColor = colors.grey;
          break;
        case 'mi-left-border-color-gunmetal':
          style.borderLeftColor = colors['grey-dark'];
          break;
        case 'mi-left-border-color-black':
          style.borderLeftColor = colors['black'];
          break;
        case 'mi-left-border-color-white':
        case 'mi-left-border-color-none':
          style.borderLeftColor = colors['white'];
          break;
        case 'mi-left-border-color-aqua':
          style.borderLeftColor = colors['green'];
          break;
        case 'mi-left-border-color-orange':
        case 'mi-left-border-color-caution':
          style.borderLeftColor = colors['orange'];
          break;
        case 'mi-left-border-color-purple':
          style.borderLeftColor = colors.purple;
          break;

        case 'mi-right-border-color-alert':
          style.borderRightColor = colors.red;
          break;
        case 'mi-right-border-color-pink':
          style.borderRightColor = colors.fuchsia;
          break;
        case 'mi-right-border-color-primary':
          style.borderRightColor = colors['blue'];
          break;
        case 'mi-right-border-color-silver':
          style.borderRightColor = colors['grey-lightest'];
          break;
        case 'mi-right-border-color-navigation':
          style.borderRightColor = colors['method'];
          break;
        case 'mi-right-border-color-yellow':
          style.borderRightColor = colors.yellow;
          break;
        case 'mi-right-border-color-success':
          style.borderRightColor = colors.green;
          break;
        case 'mi-right-border-color-grey':
          style.borderRightColor = colors.grey;
          break;
        case 'mi-right-border-color-dark-grey':
          style.borderRightColor = colors.grey;
          break;
        case 'mi-right-border-color-gunmetal':
          style.borderRightColor = colors['grey-dark'];
          break;
        case 'mi-right-border-color-black':
          style.borderRightColor = colors['black'];
          break;
        case 'mi-right-border-color-white':
        case 'mi-right-border-color-none':
          style.borderRightColor = colors['white'];
          break;
        case 'mi-right-border-color-aqua':
          style.borderRightColor = colors['green'];
          break;
        case 'mi-right-border-color-orange':
        case 'mi-right-border-color-caution':
          style.borderRightColor = colors['orange'];
          break;
        case 'mi-right-border-color-purple':
          style.borderRightColor = colors.purple;
          break;

        case 'mi-top-border-color-alert':
          style.borderTopColor = colors.red;
          break;
        case 'mi-top-border-color-pink':
          style.borderTopColor = colors.fuchsia;
          break;
        case 'mi-top-border-color-primary':
          style.borderTopColor = colors['blue'];
          break;
        case 'mi-top-border-color-silver':
          style.borderTopColor = colors['grey-lightest'];
          break;
        case 'mi-top-border-color-navigation':
          style.borderTopColor = colors['method'];
          break;
        case 'mi-top-border-color-yellow':
          style.borderTopColor = colors.yellow;
          break;
        case 'mi-top-border-color-success':
          style.borderTopColor = colors.green;
          break;
        case 'mi-top-border-color-grey':
          style.borderTopColor = colors.grey;
          break;
        case 'mi-top-border-color-dark-grey':
          style.borderTopColor = colors.grey;
          break;
        case 'mi-top-border-color-gunmetal':
          style.borderTopColor = colors['grey-dark'];
          break;
        case 'mi-top-border-color-black':
          style.borderTopColor = colors['black'];
          break;
        case 'mi-top-border-color-white':
        case 'mi-top-border-color-none':
          style.borderTopColor = colors['white'];
          break;
        case 'mi-top-border-color-aqua':
          style.borderTopColor = colors['green'];
          break;
        case 'mi-top-border-color-orange':
        case 'mi-top-border-color-caution':
          style.borderTopColor = colors['orange'];
          break;
        case 'mi-top-border-color-purple':
          style.borderTopColor = colors.purple;
          break;

        case 'mi-bottom-border-color-alert':
          style.borderBottomColor = colors.red;
          break;
        case 'mi-bottom-border-color-pink':
          style.borderBottomColor = colors.fuchsia;
          break;
        case 'mi-bottom-border-color-primary':
          style.borderBottomColor = colors['blue'];
          break;
        case 'mi-bottom-border-color-silver':
          style.borderBottomColor = colors['grey-lightest'];
          break;
        case 'mi-bottom-border-color-navigation':
          style.borderBottomColor = colors['method'];
          break;
        case 'mi-bottom-border-color-yellow':
          style.borderBottomColor = colors.yellow;
          break;
        case 'mi-bottom-border-color-success':
          style.borderBottomColor = colors.green;
          break;
        case 'mi-bottom-border-color-grey':
          style.borderBottomColor = colors.grey;
          break;
        case 'mi-bottom-border-dark-grey':
          style.borderBottomColor = colors.grey;
          break;
        case 'mi-bottom-border-color-gunmetal':
          style.borderBottomColor = colors['grey-dark'];
          break;
        case 'mi-bottom-border-color-black':
          style.borderBottomColor = colors['black'];
          break;
        case 'mi-bottom-border-color-white':
        case 'mi-bottom-border-color-none':
          style.borderBottomColor = colors['white'];
          break;
        case 'mi-bottom-border-color-aqua':
          style.borderBottomColor = colors['green'];
          break;
        case 'mi-bottom-border-color-orange':
        case 'mi-bottom-border-color-caution':
          style.borderBottomColor = colors['orange'];
          break;
        case 'mi-bottom-border-color-purple':
          style.borderBottomColor = colors.purple;
          break;

        case 'mi-text-normal':
          style.fontWeight = '400';
          break;

        // DTP Font Sizes
        case 'mi-dptext-font-small':
          style.fontSize = fontSizes.dtp.small;
          break;
        case 'mi-dptext-font-normal':
          style.fontSize = fontSizes.dtp.regular;
          break;
        case 'mi-dptext-font-large':
          style.fontSize = fontSizes.dtp.large;
          break;
        case 'mi-dptext-font-xlarge':
          style.fontSize = fontSizes.dtp.xlarge;
          break;
        case 'mi-dptext-font-xxlarge':
          style.fontSize = fontSizes.dtp.xxlarge;
          break;
        case 'mi-dptext-font-xxxlarge':
          style.fontSize = fontSizes.dtp.xxxlarge;
          break;

        // Background Colors
        case 'datepicker-alert':
          style.backgroundColor = colors.fuchsia;
          style.color = colors.white;
          break;
        case 'datepicker-primary':
          style.backgroundColor = colors.blue;
          style.color = colors.white;
          break;
        case 'datepicker-secondary':
          style.backgroundColor = colors['grey-light'];
          style.color = colors.white;
          break;
        case 'datepicker-navigation':
          style.backgroundColor = colors['blue-darker'];
          style.color = colors.white;
          break;
        case 'datepicker-caution':
          style.backgroundColor = colors.yellow;
          style.color = colors.white;
          break;
        case 'datepicker-success':
          style.backgroundColor = colors.green;
          style.color = colors.white;
          break;
        case 'datepicker-darkgrey':
          style.backgroundColor = colors.grey;
          style.color = colors.white;
          break;
        case 'datepicker-silver':
          style.backgroundColor = colors['grey-lighter'];
          style.color = colors.white;
          break;
        case 'datepicker-black':
          style.backgroundColor = colors.black;
          style.color = colors.white;
          break;
        case 'datepicker-white':
          style.backgroundColor = colors.white;
          style.color = colors.black;
          break;

        case 'mi-button-group-alert':
          style.backgroundColor = colors.red;
          break;
        case 'mi-button-group-pink':
          style.backgroundColor = colors.fuchsia;
          break;
        case 'mi-button-group-primary':
          style.backgroundColor = colors['blue'];
          break;
        case 'mi-button-group-silver':
          style.backgroundColor = colors['grey-lightest'];
          break;
        case 'mi-button-group-navigation':
          style.backgroundColor = colors['method'];
          break;
        case 'mi-button-group-yellow':
          style.backgroundColor = colors.yellow;
          break;
        case 'mi-button-group-success':
          style.backgroundColor = colors.green;
          break;
        case 'mi-button-group-grey':
          style.backgroundColor = colors['grey'];
          break;
        case 'mi-button-group-dark-grey':
          style.backgroundColor = colors.grey;
          break;
        case 'mi-button-group-gunmetal':
          style.backgroundColor = colors['grey-dark'];
          break;
        case 'mi-button-group-black':
          style.backgroundColor = colors['black'];
          break;
        case 'mi-button-group-white':
        case 'mi-button-group-secondary':
          style.color = colors['blue'];
          style.backgroundColor = colors['white'];
          if (!options.ignoreBorders) {
            style.borderColor = colors['blue'];
          }
          break;
        case 'mi-button-group-aqua':
          style.backgroundColor = colors['teal'];
          break;
        case 'mi-button-group-orange':
        case 'mi-button-group-caution':
          style.backgroundColor = colors['orange'];
          break;
        case 'mi-button-group-purple':
          style.backgroundColor = colors.purple;
          break;

        // Text Colors
        case 'mi-button-group-text-alert':
          style.color = colors.red;
          break;
        case 'mi-button-group-text-pink':
          style.color = colors.fuchsia;
          break;
        case 'mi-button-group-text-primary':
          style.color = colors['blue'];
          break;
        case 'mi-button-group-text-silver':
          style.color = colors['grey-lightest'];
          break;
        case 'mi-button-group-text-navigation':
          style.color = colors['method'];
          break;
        case 'mi-button-group-text-yellow':
          style.color = colors.yellow;
          break;
        case 'mi-button-group-text-success':
          style.color = colors.green;
          break;
        case 'mi-button-group-text-grey':
          style.color = colors['grey'];
          break;
        case 'mi-button-group-text-dark-grey':
          style.color = colors.grey;
          break;
        case 'mi-button-group-text-gunmetal':
          style.color = colors['grey-dark'];
          break;
        case 'mi-button-group-text-black':
          style.color = colors['black'];
          break;
        case 'mi-button-group-text-white':
          style.color = colors['white'];
          break;
        case 'mi-button-group-text-aqua':
          style.color = colors['teal'];
          break;
        case 'mi-button-group-text-orange':
        case 'mi-button-group-text-caution':
          style.color = colors['orange'];
          break;
        case 'mi-button-group-text-purple':
          style.color = colors.purple;
          break;

        default:
          return null;
      }
    });
  }

  return style;
};

export const convertLegacyStyles = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Caption Font Sizes
        case 'input-font-xxxsmall':
          style.fontSize = fontSizes.caption.xxxsmall;
          break;
        case 'input-font-xxsmall':
          style.fontSize = fontSizes.caption.xxsmall;
          break;
        case 'input-font-xsmall':
          style.fontSize = fontSizes.caption.xsmall;
          break;
        case 'input-font-small':
          style.fontSize = fontSizes.caption.small;
          break;
        case 'input-font-normal':
          style.fontSize = fontSizes.caption.regular;
          break;
        case 'input-font-large':
          style.fontSize = fontSizes.caption.large;
          break;
        case 'input-font-xlarge':
          style.fontSize = fontSizes.caption.xlarge;
          break;
        case 'input-font-xxlarge':
          style.fontSize = fontSizes.caption.xxlarge;
          break;
        case 'input-font-xxxlarge':
          style.fontSize = fontSizes.caption.xxxlarge;
          break;

        // Background Colors
        case 'mi-background-alert':
          style.backgroundColor = colors.red;
          break;
        case 'mi-background-pink':
          style.backgroundColor = colors.fuchsia;
          break;
        case 'mi-background-primary':
          style.backgroundColor = colors.blue;
          break;
        case 'mi-background-silver':
          style.backgroundColor = colors['grey-lightest'];
          break;
        case 'mi-background-navigation':
          style.backgroundColor = colors['blue-dark'];
          break;
        case 'mi-background-yellow':
          style.backgroundColor = colors.yellow;
          break;
        case 'mi-background-success':
          style.backgroundColor = colors.green;
          break;
        case 'mi-background-grey':
          style.backgroundColor = colors['grey-light'];
          break;
        case 'mi-background-dark-grey':
          style.backgroundColor = colors.grey;
          break;
        case 'mi-background-gunmetal':
          style.backgroundColor = colors['grey-dark'];
          break;
        case 'mi-background-black':
          style.backgroundColor = colors.black;
          break;
        case 'mi-background-white':
          style.backgroundColor = colors.white;
          break;
        case 'mi-background-aqua':
          style.backgroundColor = colors.green;
          break;
        case 'mi-background-orange':
        case 'mi-background-caution':
          style.backgroundColor = colors.orange;
          break;
        case 'mi-background-purple':
          style.backgroundColor = colors.purple;
          break;

        // Text Colors
        case 'input-text-alert':
          style.color = colors.red;
          break;
        case 'input-text-pink':
          style.color = colors.fuchsia;
          break;
        case 'input-text-primary':
          style.color = colors['blue'];
          break;
        case 'input-text-silver':
          style.color = colors['grey-lightest'];
          break;
        case 'input-text-navigation':
          style.color = colors['method'];
          break;
        case 'input-text-yellow':
          style.color = colors.yellow;
          break;
        case 'input-text-success':
          style.color = colors.green;
          break;
        case 'input-text-grey':
          style.color = colors.grey;
          break;
        case 'input-text-dark-grey':
          style.color = colors.grey;
          break;
        case 'input-text-gunmetal':
          style.color = colors['grey-dark'];
          break;
        case 'input-text-black':
          style.color = colors['black'];
          break;
        case 'input-text-white':
          style.color = colors['white'];
          break;
        case 'input-text-aqua':
          style.color = colors['green'];
          break;
        case 'input-text-orange':
        case 'input-text-caution':
          style.color = colors['orange'];
          break;
        case 'input-text-purple':
          style.color = colors.purple;
          break;

        // Caption Align
        case 'input-left':
          style.textAlign = 'left';
          break;
        case 'input-right':
          style.textAlign = 'right';
          break;
        case 'input-center':
          style.textAlign = 'center';
          break;

        // Font Weights
        case 'mi-text-bold':
          style.fontWeight = '600';
          break;
        case 'mi-text-bolder':
          style.fontWeight = '900';
          break;

        // Border Width
        case 'mi-left-border-none':
          style.borderLeftWidth = '0px';
          break;
        case 'mi-left-border-normal':
          style.borderLeftWidth = '1px';
          break;
        case 'mi-left-border-2px':
          style.borderLeftWidth = '2px';
          break;
        case 'mi-left-border-4px':
          style.borderLeftWidth = '4px';
          break;
        case 'mi-left-border-6px':
          style.borderLeftWidth = '6px';
          break;
        case 'mi-left-border-8px':
          style.borderLeftWidth = '8px';
          break;
        case 'mi-left-border-10px':
          style.borderLeftWidth = '10px';
          break;

        case 'mi-right-border-none':
          style.borderRightWidth = '0px';
          break;
        case 'mi-right-border-normal':
          style.borderRightWidth = '1px';
          break;
        case 'mi-right-border-2px':
          style.borderRightWidth = '2px';
          break;
        case 'mi-right-border-4px':
          style.borderRightWidth = '4px';
          break;
        case 'mi-right-border-6px':
          style.borderRightWidth = '6px';
          break;
        case 'mi-right-border-8px':
          style.borderRightWidth = '8px';
          break;
        case 'mi-right-border-10px':
          style.borderRightWidth = '10px';
          break;

        case 'mi-top-border-none':
          style.borderTopWidth = '0px';
          break;
        case 'mi-top-border-normal':
          style.borderTopWidth = '1px';
          break;
        case 'mi-top-border-2px':
          style.borderTopWidth = '2px';
          break;
        case 'mi-top-border-4px':
          style.borderTopWidth = '4px';
          break;
        case 'mi-top-border-6px':
          style.borderTopWidth = '6px';
          break;
        case 'mi-top-border-8px':
          style.borderTopWidth = '8px';
          break;
        case 'mi-top-border-10px':
          style.borderTopWidth = '10px';
          break;

        case 'mi-bottom-border-none':
          style.borderBottomWidth = '0px';
          break;
        case 'mi-bottom-border-normal':
          style.borderBottomWidth = '1px';
          break;
        case 'mi-bottom-border-2px':
          style.borderBottomWidth = '2px';
          break;
        case 'mi-bottom-border-4px':
          style.borderBottomWidth = '4px';
          break;
        case 'mi-bottom-order-6px': // hack for bug
        case 'mi-bottom-border-6px':
          style.borderBottomWidth = '6px';
          break;
        case 'mi-bottom-border-8px':
          style.borderBottomWidth = '8px';
          break;
        case 'mi-bottom-border-10px':
          style.borderBottomWidth = '10px';
          break;

        // Border Style
        case 'mi-left-border-dashed':
          style.borderLeftStyle = 'dashed';
          break;
        case 'mi-left-border-dotted':
          style.borderLeftStyle = 'dotted';
          break;
        case 'mi-left-border-solid':
          style.borderLeftStyle = 'solid';
          break;
        case 'mi-left-border-double':
          style.borderLeftStyle = 'double';
          break;

        case 'mi-right-border-dashed':
          style.borderRightStyle = 'dashed';
          break;
        case 'mi-right-border-dotted':
          style.borderRightStyle = 'dotted';
          break;
        case 'mi-right-border-solid':
          style.borderRightStyle = 'solid';
          break;
        case 'mi-right-border-double':
          style.borderRightStyle = 'double';
          break;

        case 'mi-top-border-dashed':
          style.borderTopStyle = 'dashed';
          break;
        case 'mi-top-border-dotted':
          style.borderTopStyle = 'dotted';
          break;
        case 'mi-top-border-solid':
          style.borderTopStyle = 'solid';
          break;
        case 'mi-top-border-double':
          style.borderTopStyle = 'double';
          break;

        case 'mi-bottom-border-dashed':
          style.borderBottomStyle = 'dashed';
          break;
        case 'mi-bottom-border-dotted':
          style.borderBottomStyle = 'dotted';
          break;
        case 'mi-bottom-border-solid':
          style.borderBottomStyle = 'solid';
          break;
        case 'mi-bottom-border-double':
          style.borderBottomStyle = 'double';
          break;

        // Border Colors
        case 'mi-left-border-color-alert':
          style.borderLeftColor = colors.red;
          break;
        case 'mi-left-border-color-pink':
          style.borderLeftColor = colors.fuchsia;
          break;
        case 'mi-left-border-color-primary':
          style.borderLeftColor = colors['blue'];
          break;
        case 'mi-left-border-color-silver':
          style.borderLeftColor = colors['grey-lightest'];
          break;
        case 'mi-left-border-color-navigation':
          style.borderLeftColor = colors['method'];
          break;
        case 'mi-left-border-color-yellow':
          style.borderLeftColor = colors.yellow;
          break;
        case 'mi-left-border-color-success':
          style.borderLeftColor = colors.green;
          break;
        case 'mi-left-border-color-grey':
          style.borderLeftColor = colors.grey;
          break;
        case 'mi-left-border-color-dark-grey':
          style.borderLeftColor = colors.grey;
          break;
        case 'mi-left-border-color-gunmetal':
          style.borderLeftColor = colors['grey-dark'];
          break;
        case 'mi-left-border-color-black':
          style.borderLeftColor = colors['black'];
          break;
        case 'mi-left-border-color-white':
        case 'mi-left-border-color-none':
          style.borderLeftColor = colors['white'];
          break;
        case 'mi-left-border-color-aqua':
          style.borderLeftColor = colors['green'];
          break;
        case 'mi-left-border-color-orange':
        case 'mi-left-border-color-caution':
          style.borderLeftColor = colors['orange'];
          break;
        case 'mi-left-border-color-purple':
          style.borderLeftColor = colors.purple;
          break;

        case 'mi-right-border-color-alert':
          style.borderRightColor = colors.red;
          break;
        case 'mi-right-border-color-pink':
          style.borderRightColor = colors.fuchsia;
          break;
        case 'mi-right-border-color-primary':
          style.borderRightColor = colors['blue'];
          break;
        case 'mi-right-border-color-silver':
          style.borderRightColor = colors['grey-lightest'];
          break;
        case 'mi-right-border-color-navigation':
          style.borderRightColor = colors['method'];
          break;
        case 'mi-right-border-color-yellow':
          style.borderRightColor = colors.yellow;
          break;
        case 'mi-right-border-color-success':
          style.borderRightColor = colors.green;
          break;
        case 'mi-right-border-color-grey':
          style.borderRightColor = colors.grey;
          break;
        case 'mi-right-border-color-dark-grey':
          style.borderRightColor = colors.grey;
          break;
        case 'mi-right-border-color-gunmetal':
          style.borderRightColor = colors['grey-dark'];
          break;
        case 'mi-right-border-color-black':
          style.borderRightColor = colors['black'];
          break;
        case 'mi-right-border-color-white':
        case 'mi-right-border-color-none':
          style.borderRightColor = colors['white'];
          break;
        case 'mi-right-border-color-aqua':
          style.borderRightColor = colors['green'];
          break;
        case 'mi-right-border-color-orange':
        case 'mi-right-border-color-caution':
          style.borderRightColor = colors['orange'];
          break;
        case 'mi-right-border-color-purple':
          style.borderRightColor = colors.purple;
          break;

        case 'mi-top-border-color-alert':
          style.borderTopColor = colors.red;
          break;
        case 'mi-top-border-color-pink':
          style.borderTopColor = colors.fuchsia;
          break;
        case 'mi-top-border-color-primary':
          style.borderTopColor = colors['blue'];
          break;
        case 'mi-top-border-color-silver':
          style.borderTopColor = colors['grey-lightest'];
          break;
        case 'mi-top-border-color-navigation':
          style.borderTopColor = colors['method'];
          break;
        case 'mi-top-border-color-yellow':
          style.borderTopColor = colors.yellow;
          break;
        case 'mi-top-border-color-success':
          style.borderTopColor = colors.green;
          break;
        case 'mi-top-border-color-grey':
          style.borderTopColor = colors.grey;
          break;
        case 'mi-top-border-color-dark-grey':
          style.borderTopColor = colors.grey;
          break;
        case 'mi-top-border-color-gunmetal':
          style.borderTopColor = colors['grey-dark'];
          break;
        case 'mi-top-border-color-black':
          style.borderTopColor = colors['black'];
          break;
        case 'mi-top-border-color-white':
        case 'mi-top-border-color-none':
          style.borderTopColor = colors['white'];
          break;
        case 'mi-top-border-color-aqua':
          style.borderTopColor = colors['green'];
          break;
        case 'mi-top-border-color-orange':
        case 'mi-top-border-color-caution':
          style.borderTopColor = colors['orange'];
          break;
        case 'mi-top-border-color-purple':
          style.borderTopColor = colors.purple;
          break;

        case 'mi-bottom-border-color-alert':
          style.borderBottomColor = colors.red;
          break;
        case 'mi-bottom-border-color-pink':
          style.borderBottomColor = colors.fuchsia;
          break;
        case 'mi-bottom-border-color-primary':
          style.borderBottomColor = colors['blue'];
          break;
        case 'mi-bottom-border-color-silver':
          style.borderBottomColor = colors['grey-lightest'];
          break;
        case 'mi-bottom-border-color-navigation':
          style.borderBottomColor = colors['method'];
          break;
        case 'mi-bottom-border-color-yellow':
          style.borderBottomColor = colors.yellow;
          break;
        case 'mi-bottom-border-color-success':
          style.borderBottomColor = colors.green;
          break;
        case 'mi-bottom-border-color-grey':
          style.borderBottomColor = colors.grey;
          break;
        case 'mi-bottom-border-dark-grey':
          style.borderBottomColor = colors.grey;
          break;
        case 'mi-bottom-border-color-gunmetal':
          style.borderBottomColor = colors['grey-dark'];
          break;
        case 'mi-bottom-border-color-black':
          style.borderBottomColor = colors['black'];
          break;
        case 'mi-bottom-border-color-white':
        case 'mi-bottom-border-color-none':
          style.borderBottomColor = colors['white'];
          break;
        case 'mi-bottom-border-color-aqua':
          style.borderBottomColor = colors['green'];
          break;
        case 'mi-bottom-border-color-orange':
        case 'mi-bottom-border-color-caution':
          style.borderBottomColor = colors['orange'];
          break;
        case 'mi-bottom-border-color-purple':
          style.borderBottomColor = colors.purple;
          break;
        case 'mi-caption-font-xxxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xsmall':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-small':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-normal':
          style.fontSize = '14px';
          break;
        case 'mi-caption-font-large':
          style.fontSize = '14px';
          break;
        case 'mi-caption-font-xlarge':
          style.fontSize = '15.75px';
          break;
        case 'mi-caption-font-xxlarge':
          style.fontSize = '19.25px';
          break;
        case 'mi-caption-font-xxxlarge':
          style.fontSize = '26.25px';
          break;

        // Caption Colors
        case 'mi-caption-alert':
        case 'mi-caption-pink':
          style.color = '#DA211E';
          break;
        case 'mi-caption-primary':
          style.color = '#0D71C8';
          break;
        case 'mi-caption-silver':
          style.color = '#EEF5F7';
          break;
        case 'mi-caption-navigation':
          style.color = '#022266';
          break;
        case 'mi-caption-yellow':
          style.color = '#FDCB2E';
          break;
        case 'mi-caption-success':
          style.color = '#007B4A';
          break;
        case 'mi-caption-grey':
          style.color = '#BACAD0';
          break;
        case 'mi-caption-gunmetal':
          style.color = '#2A394A';
          break;
        case 'mi-caption-black':
          style.color = '#000000';
          break;
        case 'mi-caption-white':
          style.color = '#ffffff';
          break;
        case 'mi-caption-aqua':
          style.color = '#2EC9E8';
          break;
        case 'mi-caption-orange':
        case 'mi-caption-caution':
          style.color = '#E05D2A';
          break;
        case 'mi-caption-purple':
          style.color = '#3B4AED';
          break;

        // Caption Align
        case 'mi-caption-left':
          style.textAlign = 'left';
          break;
        case 'mi-caption-right':
          style.textAlign = 'right';
          break;
        case 'mi-caption-center':
          style.textAlign = 'center';
          break;

        case 'mi-text-normal':
          style.fontWeight = '400';
          break;

        case 'button-alert':
          // DA211E
          style.backgroundColor = `${colors.red} !important`;
          break;
        case 'button-primary':
          // 0D71C8
          style.backgroundColor = `${colors.blue} !important`;
          break;
        case 'button-grey':
          // 545F67
          style.backgroundColor = `${colors.grey} !important`;
          break;
        case 'button-silver':
          // EEF5F7
          style.backgroundColor = `${colors['grey-lighter']} !important`;
          break;

        case 'button-navigation':
        case 'button-dark-blue':
          // 022266
          style.backgroundColor = `${colors['blue-darker']} !important`;
          break;

        case 'button-caution':
          // E05D2A
          style.backgroundColor = `${colors.orange} !important`;
          break;

        case 'button-success':
          // 007B4A
          style.backgroundColor = `${colors.green} !important`;
          break;

        case 'button-gunmetal':
          // 2A394A
          style.backgroundColor = `${colors['grey-dark']} !important`;
          break;

        case 'button-black':
          // 000
          style.backgroundColor = `${colors.black} !important`;
          break;

        case 'button-white':
        case 'button-secondary':
          // FFF
          style.backgroundColor = `${colors.white} !important`;
          break;

        case 'button-pink':
          // D81F47
          style.backgroundColor = `${colors.fuchsia} !important`;
          break;

        case 'button-purple':
          // 3B4AED
          style.backgroundColor = `${colors.purple} !important`;
          break;

        case 'button-yellow':
          // FDCB2E
          style.backgroundColor = `${colors.yellow} !important`;
          break;

        case 'button-aqua':
          // 2EC9E8
          style.backgroundColor = `${colors.teal} !important`;
          break;

        // text Colors
        case 'mi-color-alert':
        case 'mi-color-pink':
          style.color = '#DA211E';
          break;
        case 'mi-color-primary':
          style.color = '#0D71C8';
          break;
        case 'mi-color-silver':
          style.color = '#EEF5F7';
          break;
        case 'mi-color-navigation':
          style.color = '#022266';
          break;
        case 'mi-color-yellow':
          style.color = '#FDCB2E';
          break;
        case 'mi-color-success':
          style.color = '#007B4A';
          break;
        case 'mi-color-grey':
          style.color = '#BACAD0';
          break;
        case 'mi-color-gunmetal':
          style.color = '#2A394A';
          break;
        case 'mi-color-black':
          style.color = '#000000';
          break;
        case 'mi-color-white':
          style.color = '#ffffff';
          break;
        case 'mi-color-aqua':
          style.color = '#2EC9E8';
          break;
        case 'mi-color-orange':
        case 'mi-color-caution':
          style.color = '#E05D2A';
          break;
        case 'mi-color-purple':
          style.color = '#3B4AED';
          break;

        default:
          return null;
      }
    });
  }

  return style;
};

export default convertLegacyStyles;
