import { colors } from '@m-next/styles';

// Define fontSizes locally since it's not properly exported from @m-next/styles
const fontSizes = {
  legacy: {
    xxxsmall: '10px',
    xxsmall: '11px',
    xsmall: '12px',
    small: '13px',
    normal: '14px',
    regular: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '24px',
    xxlarge: '32px',
    xxxlarge: '48px',
    button: {
      xxxlarge: '48px',
      xxlarge: '32px',
      xlarge: '24px',
      large: '18px',
      normal: '14px',
      small: '13px',
    },
  },
  caption: {
    xxxsmall: '10px',
    xxsmall: '11px',
    xsmall: '12px',
    small: '13px',
    regular: '14px',
    large: '16px',
    xlarge: '18px',
    xxlarge: '24px',
    xxxlarge: '32px',
  },
  dtp: {
    small: '13px',
    regular: '14px',
    large: '16px',
    xlarge: '18px',
    xxlarge: '24px',
    xxxlarge: '32px',
  },
};

// Define types for the fontSizes and colors objects
interface FontSizes {
  legacy: {
    xxxsmall: string;
    xxsmall: string;
    xsmall: string;
    small: string;
    normal: string;
    regular?: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge: string;
    xxxlarge: string;
    button: {
      xxxlarge: string;
      xxlarge: string;
      xlarge: string;
      large: string;
      normal: string;
      small: string;
    };
  };
  caption: {
    xxxsmall: string;
    xxsmall: string;
    xsmall: string;
    small: string;
    regular: string;
    large: string;
    xlarge: string;
    xxlarge: string;
    xxxlarge: string;
  };
  dtp: {
    small: string;
    regular: string;
    large: string;
    xlarge: string;
    xxlarge: string;
    xxxlarge: string;
  };
}

interface Colors {
  black: string;
  white: string;
  blue: string;
  green: string;
  orange: string;
  teal: string;
  'grey-lightest': string;
  method: string;
  legacy: {
    red: string;
    pink: string;
    yellow: string;
    green: string;
    grey: string;
    mDarkGrey: string;
    greyDark: string;
    purple: string;
    [key: string]: string;
  };
  [key: string]: string | { [key: string]: string };
}

// Create a base object to match the structure expected in the code
const base = {
  colors: colors as unknown as Colors,
  fontSizes: fontSizes as unknown as FontSizes,
};

interface StyleObject {
  [key: string]: string;
}

export default function (classes?: string): StyleObject {
  const style: StyleObject = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Caption Font Sizes
        case 'mi-caption-font-xxxsmall':
          style.fontSize = base.fontSizes.caption.xxxsmall;
          break;
        case 'mi-caption-font-xxsmall':
          style.fontSize = base.fontSizes.caption.xxsmall;
          break;
        case 'mi-caption-font-xsmall':
          style.fontSize = base.fontSizes.caption.xsmall;
          break;
        case 'mi-caption-font-small':
          style.fontSize = base.fontSizes.caption.small;
          break;
        case 'mi-caption-font-normal':
          style.fontSize = base.fontSizes.caption.regular;
          break;
        case 'mi-caption-font-large':
          style.fontSize = base.fontSizes.caption.large;
          break;
        case 'mi-caption-font-xlarge':
          style.fontSize = base.fontSizes.caption.xlarge;
          break;
        case 'mi-caption-font-xxlarge':
          style.fontSize = base.fontSizes.caption.xxlarge;
          break;
        case 'mi-caption-font-xxxlarge':
          style.fontSize = base.fontSizes.caption.xxxlarge;
          break;

        // legacy font sizes
        case 'font-xxxsmall':
          style.fontSize = base.fontSizes.legacy.xxxsmall;
          break;
        case 'font-xxsmall':
          style.fontSize = base.fontSizes.legacy.xxsmall;
          break;
        case 'font-xsmall':
          style.fontSize = base.fontSizes.legacy.xsmall;
          style.lineHeight = '1.1em';
          break;
        case 'font-small':
          style.fontSize = base.fontSizes.legacy.small;
          style.lineHeight = '1.4em';
          break;
        case 'font-normal':
          style.fontSize = base.fontSizes.legacy.regular || base.fontSizes.legacy.normal;
          break;
        case 'font-large':
          style.fontSize = base.fontSizes.legacy.large;
          style.lineHeight = '1em';
          break;
        case 'font-xlarge':
          style.fontSize = base.fontSizes.legacy.xlarge;
          style.lineHeight = '0.95em';
          break;
        case 'font-xxlarge':
          style.fontSize = base.fontSizes.legacy.xxlarge;
          break;
        case 'font-xxxlarge':
          style.fontSize = base.fontSizes.legacy.xxxlarge;
          break;

        // Background Colors
        case 'mi-background-alert':
          style.backgroundColor = base.colors.legacy['red'];
          break;
        case 'mi-background-pink':
          style.backgroundColor = base.colors.legacy['pink'];
          break;
        case 'mi-background-primary':
          style.backgroundColor = base.colors['blue'];
          break;
        case 'mi-background-silver':
          style.backgroundColor = base.colors['grey-lightest'];
          break;
        case 'mi-background-navigation':
          style.backgroundColor = base.colors['method'];
          break;
        case 'mi-background-yellow':
          style.backgroundColor = base.colors.legacy['yellow'];
          break;
        case 'mi-background-success':
          style.backgroundColor = base.colors.legacy['green'];
          break;
        case 'mi-background-grey':
          style.backgroundColor = base.colors.legacy['grey'];
          break;
        case 'mi-background-dark-grey':
          style.backgroundColor = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-background-gunmetal':
          style.backgroundColor = base.colors.legacy['greyDark'];
          break;
        case 'mi-background-black':
          style.backgroundColor = base.colors['black'];
          break;
        case 'mi-background-white':
          style.backgroundColor = base.colors['white'];
          break;
        case 'mi-background-aqua':
          style.backgroundColor = base.colors['green'];
          break;
        case 'mi-background-orange':
        case 'mi-background-caution':
          style.backgroundColor = base.colors['orange'];
          break;
        case 'mi-background-purple':
          style.backgroundColor = base.colors.legacy['purple'];
          break;

        // Text Colors
        case 'mi-caption-alert':
        case 'mi-color-alert':
          style.color = base.colors.legacy['red'];
          break;
        case 'mi-caption-pink':
        case 'mi-color-pink':
          style.color = base.colors.legacy['pink'];
          break;
        case 'mi-caption-primary':
        case 'mi-color-primary':
          style.color = base.colors['blue'];
          break;
        case 'mi-caption-silver':
        case 'mi-color-silver':
          style.color = base.colors['grey-lightest'];
          break;
        case 'mi-caption-navigation':
        case 'mi-color-navigation':
          style.color = base.colors['method'];
          break;
        case 'mi-caption-yellow':
        case 'mi-color-yellow':
          style.color = base.colors.legacy['yellow'];
          break;
        case 'mi-caption-success':
        case 'mi-color-success':
          style.color = base.colors.legacy['green'];
          break;
        case 'mi-caption-grey':
        case 'mi-color-grey':
          style.color = base.colors.legacy['grey'];
          break;
        case 'mi-caption-dark-grey':
        case 'mi-color-dark-grey':
          style.color = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-caption-gunmetal':
        case 'mi-color-gunmetal':
          style.color = base.colors.legacy['greyDark'];
          break;
        case 'mi-caption-black':
        case 'mi-color-black':
          style.color = base.colors['black'];
          break;
        case 'mi-caption-white':
        case 'mi-color-white':
          style.color = base.colors['white'];
          break;
        case 'mi-caption-aqua':
        case 'mi-color-aqua':
          style.color = base.colors['teal'];
          break;
        case 'mi-caption-orange':
        case 'mi-caption-caution':
        case 'mi-color-orange':
        case 'mi-color-caution':
          style.color = base.colors['orange'];
          break;
        case 'mi-color-purple':
          style.color = base.colors.legacy['purple'];
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
          style.borderLeftColor = base.colors.legacy['red'];
          break;
        case 'mi-left-border-color-pink':
          style.borderLeftColor = base.colors.legacy['pink'];
          break;
        case 'mi-left-border-color-primary':
          style.borderLeftColor = base.colors['blue'];
          break;
        case 'mi-left-border-color-silver':
          style.borderLeftColor = base.colors['grey-lightest'];
          break;
        case 'mi-left-border-color-navigation':
          style.borderLeftColor = base.colors['method'];
          break;
        case 'mi-left-border-color-yellow':
          style.borderLeftColor = base.colors.legacy['yellow'];
          break;
        case 'mi-left-border-color-success':
          style.borderLeftColor = base.colors.legacy['green'];
          break;
        case 'mi-left-border-color-grey':
          style.borderLeftColor = base.colors.legacy['grey'];
          break;
        case 'mi-left-border-color-dark-grey':
          style.borderLeftColor = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-left-border-color-gunmetal':
          style.borderLeftColor = base.colors.legacy['greyDark'];
          break;
        case 'mi-left-border-color-black':
          style.borderLeftColor = base.colors['black'];
          break;
        case 'mi-left-border-color-white':
        case 'mi-left-border-color-none':
          style.borderLeftColor = base.colors['white'];
          break;
        case 'mi-left-border-color-aqua':
          style.borderLeftColor = base.colors['green'];
          break;
        case 'mi-left-border-color-orange':
        case 'mi-left-border-color-caution':
          style.borderLeftColor = base.colors['orange'];
          break;
        case 'mi-left-border-color-purple':
          style.borderLeftColor = base.colors.legacy['purple'];
          break;

        case 'mi-right-border-color-alert':
          style.borderRightColor = base.colors.legacy['red'];
          break;
        case 'mi-right-border-color-pink':
          style.borderRightColor = base.colors.legacy['pink'];
          break;
        case 'mi-right-border-color-primary':
          style.borderRightColor = base.colors['blue'];
          break;
        case 'mi-right-border-color-silver':
          style.borderRightColor = base.colors['grey-lightest'];
          break;
        case 'mi-right-border-color-navigation':
          style.borderRightColor = base.colors['method'];
          break;
        case 'mi-right-border-color-yellow':
          style.borderRightColor = base.colors.legacy['yellow'];
          break;
        case 'mi-right-border-color-success':
          style.borderRightColor = base.colors.legacy['green'];
          break;
        case 'mi-right-border-color-grey':
          style.borderRightColor = base.colors.legacy['grey'];
          break;
        case 'mi-right-border-color-dark-grey':
          style.borderRightColor = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-right-border-color-gunmetal':
          style.borderRightColor = base.colors.legacy['greyDark'];
          break;
        case 'mi-right-border-color-black':
          style.borderRightColor = base.colors['black'];
          break;
        case 'mi-right-border-color-white':
        case 'mi-right-border-color-none':
          style.borderRightColor = base.colors['white'];
          break;
        case 'mi-right-border-color-aqua':
          style.borderRightColor = base.colors['green'];
          break;
        case 'mi-right-border-color-orange':
        case 'mi-right-border-color-caution':
          style.borderRightColor = base.colors['orange'];
          break;
        case 'mi-right-border-color-purple':
          style.borderRightColor = base.colors.legacy['purple'];
          break;

        case 'mi-top-border-color-alert':
          style.borderTopColor = base.colors.legacy['red'];
          break;
        case 'mi-top-border-color-pink':
          style.borderTopColor = base.colors.legacy['pink'];
          break;
        case 'mi-top-border-color-primary':
          style.borderTopColor = base.colors['blue'];
          break;
        case 'mi-top-border-color-silver':
          style.borderTopColor = base.colors['grey-lightest'];
          break;
        case 'mi-top-border-color-navigation':
          style.borderTopColor = base.colors['method'];
          break;
        case 'mi-top-border-color-yellow':
          style.borderTopColor = base.colors.legacy['yellow'];
          break;
        case 'mi-top-border-color-success':
          style.borderTopColor = base.colors.legacy['green'];
          break;
        case 'mi-top-border-color-grey':
          style.borderTopColor = base.colors.legacy['grey'];
          break;
        case 'mi-top-border-color-dark-grey':
          style.borderTopColor = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-top-border-color-gunmetal':
          style.borderTopColor = base.colors.legacy['greyDark'];
          break;
        case 'mi-top-border-color-black':
          style.borderTopColor = base.colors['black'];
          break;
        case 'mi-top-border-color-white':
        case 'mi-top-border-color-none':
          style.borderTopColor = base.colors['white'];
          break;
        case 'mi-top-border-color-aqua':
          style.borderTopColor = base.colors['green'];
          break;
        case 'mi-top-border-color-orange':
        case 'mi-top-border-color-caution':
          style.borderTopColor = base.colors['orange'];
          break;
        case 'mi-top-border-color-purple':
          style.borderTopColor = base.colors.legacy['purple'];
          break;

        case 'mi-bottom-border-color-alert':
          style.borderBottomColor = base.colors.legacy['red'];
          break;
        case 'mi-bottom-border-color-pink':
          style.borderBottomColor = base.colors.legacy['pink'];
          break;
        case 'mi-bottom-border-color-primary':
          style.borderBottomColor = base.colors['blue'];
          break;
        case 'mi-bottom-border-color-silver':
          style.borderBottomColor = base.colors['grey-lightest'];
          break;
        case 'mi-bottom-border-color-navigation':
          style.borderBottomColor = base.colors['method'];
          break;
        case 'mi-bottom-border-color-yellow':
          style.borderBottomColor = base.colors.legacy['yellow'];
          break;
        case 'mi-bottom-border-color-success':
          style.borderBottomColor = base.colors.legacy['green'];
          break;
        case 'mi-bottom-border-color-grey':
          style.borderBottomColor = base.colors.legacy['grey'];
          break;
        case 'mi-bottom-border-dark-grey':
          style.borderBottomColor = base.colors.legacy['mDarkGrey'];
          break;
        case 'mi-bottom-border-color-gunmetal':
          style.borderBottomColor = base.colors.legacy['greyDark'];
          break;
        case 'mi-bottom-border-color-black':
          style.borderBottomColor = base.colors['black'];
          break;
        case 'mi-bottom-border-color-white':
        case 'mi-bottom-border-color-none':
          style.borderBottomColor = base.colors['white'];
          break;
        case 'mi-bottom-border-color-aqua':
          style.borderBottomColor = base.colors['green'];
          break;
        case 'mi-bottom-border-color-orange':
        case 'mi-bottom-border-color-caution':
          style.borderBottomColor = base.colors['orange'];
          break;
        case 'mi-bottom-border-color-purple':
          style.borderBottomColor = base.colors.legacy['purple'];
          break;
        default:
          break;
      }
    });
  }

  return style;
}
