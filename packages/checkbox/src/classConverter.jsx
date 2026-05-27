import { colors } from '@m-next/tokens';

export const checkboxColor = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Checkbox Colors
        case 'mi-checkbox-alert':
          style.backgroundColor = colors.red.base;
          style.borderColor = colors.red.base;
          break;
        case 'mi-checkbox-primary':
          style.backgroundColor = colors.blue.base;
          style.borderColor = colors.blue.base;
          break;
        case 'mi-checkbox-navigation':
          style.backgroundColor = colors.method.base;
          style.borderColor = colors.method.base;
          break;
        case 'mi-checkbox-caution':
          style.backgroundColor = colors.orange.base;
          style.borderColor = colors.orange.base;
          break;
        case 'mi-checkbox-success':
          style.backgroundColor = colors.green.base;
          style.borderColor = colors.green.base;
          break;
        case 'mi-checkbox-grey':
          style.backgroundColor = colors.grey.light;
          style.borderColor = colors.grey.light;
          break;
        case 'mi-checkbox-dark-grey':
          style.backgroundColor = colors.grey.base;
          style.borderColor = colors.grey.base;
          break;
        case 'mi-checkbox-silver':
          style.backgroundColor = colors.grey.lighter;
          style.borderColor = colors.grey.lighter;
          break;
        default:
          return null;
      }
    });
  }

  return style;
};

export const captionStyle = (classes) => {
  const style = {};

  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Caption Colors
        case 'mi-checkbox-label-alert':
          style.color = colors.red.base;
          break;
        case 'mi-checkbox-label-primary':
          style.color = colors.blue.base;
          break;
        case 'mi-checkbox-label-navigation':
          style.color = colors.method.base;
          break;
        case 'mi-checkbox-label-caution':
          style.color = colors.orange.base;
          break;
        case 'mi-checkbox-label-success':
          style.color = colors.green.base;
          break;
        case 'mi-checkbox-label-grey':
          style.color = colors.grey.light;
          break;
        case 'mi-checkbox-label-gunmetal':
          style.color = colors.grey.base;
          break;
        case 'mi-checkbox-label-silver':
          style.color = colors.grey.lighter;
          break;
        case 'mi-checkbox-label-black':
          style.color = colors.black;
          break;
        case 'mi-checkbox-label-white':
          style.color = colors.white;
          break;

        // Caption Align
        case 'mi-caption-font-xxsmall':
          style.fontSize = '8.75px';
          break;
        case 'mi-caption-font-xsmall':
          style.fontSize = '10.5px';
          break;
        case 'mi-caption-font-small':
          style.fontSize = '10.5px';
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

        // Font Weights
        case 'mi-text-bold':
          style.fontWeight = '600';
          break;
        case 'mi-text-bolder':
          style.fontWeight = '900';
          break;
        default:
          return null;
      }
    });
  }

  return style;
};

export const checkboxDark = (classes) => {
  let dark = false;
  if (classes) {
    classes.split(' ').forEach((item) => {
      switch (item) {
        // Checkbox Colors
        case 'mi-checkbox-silver':
          dark = true;
          break;
        default:
          dark = false;
          break;
      }
    });
  }

  return dark;
};
