import { widgets } from '@m-next/types';
import { createBaseControl } from '@m-next/runtime-interface';

export const createButtonControl = (
  base = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'button',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data = {
    onClick: null,
    icon: null,
    iconAlign: null,
  },
) => ({
  ...createBaseControl(base),
  type: widgets.BUTTON,
  onClick: data.onClick || null,
  icon: data.icon || null,
  iconAlign: data.iconAlign || null,
});

const migrateTextColor = (txtColor, bgColor) => {
  if (txtColor === null || txtColor === '') {
    switch (bgColor) {
      case 'button-primary':
      case 'button-grey':
      case 'button-navigation':
      case 'button-caution':
      case 'button-success':
      case 'button-gunmetal':
      case 'button-black':
      case 'button-alert':
        return 'white';

      case 'button-secondary':
      case 'button-transparent':
      case 'button-pink':
      case 'button-purple':
      case 'button-aqua':
      case 'button-yellow':
      case 'button-white':
      case 'button-silver':
        return 'black';
      default:
        return 'grey';
    }
  }

  switch (txtColor) {
    case 'mi-color-alert':
      return 'red';
    case 'mi-color-primary':
      return 'blue';
    case 'mi-color-navigation':
      return 'blue-darker';
    case 'mi-color-caution':
      return 'yellow';
    case 'mi-color-success':
      return 'green';
    case 'mi-color-pink':
      return 'fuchsia';
    case 'mi-color-purple':
      return 'purple';
    case 'mi-color-aqua':
      return 'teal';
    case 'mi-color-yellow':
      return 'yellow';
    case 'mi-color-grey':
      return 'grey-light';
    case 'mi-color-gunmetal':
      return 'grey-darker';
    case 'mi-color-silver':
      return 'grey-light';
    case 'mi-color-black':
      return 'black';
    case 'mi-color-white':
      return 'white';
    default:
      return txtColor;
  }
};

const migrateButtonBackground = (bgColor) => {
  switch (bgColor) {
    case 'button-alert':
      return 'red';
    case 'button-primary':
      return 'blue';
    case 'button-grey':
    case 'button-navigation':
      return 'grey';
    case 'button-caution':
      return 'orange';
    case 'button-success':
      return 'green';
    case 'button-pink':
      return 'fuchsia';
    case 'button-purple':
      return 'purple';
    case 'button-aqua':
      return 'teal';
    case 'button-yellow':
      return 'yellow';
    case 'button-gunmetal':
      return 'grey-darker';
    case 'button-silver':
      return 'grey-lighter';
    case 'button-black':
      return 'black';
    case 'button-secondary':
    case 'button-white':
    case 'button-transparent':
      return 'white';
    default:
      return bgColor;
  }
};

export const migrateButtonControl = (control) => {
  let migrated = false;
  const updated = { ...control };
  if (!updated.styles || Object.keys(updated.styles).length === 0) {
    migrated = true;
    updated.styles = {
      variant: 'primary',
      color: 'blue',
    };

    if (control.classes) {
      const parts = control.classes.split(' ');
      const bgColor = parts.find((x) => x.startsWith('button-')) || 'white';
      const txtColor = parts.find((x) => x.startsWith('mi-color-') || x.startsWith('text-')) || 'grey-darker';
      const migratedBgColor = migrateButtonBackground(bgColor);
      const migratedTxtColor = migrateTextColor(txtColor, migratedBgColor);
      if (bgColor === 'white') {
        updated.styles.variant = 'secondary';
        updated.styles.color = migratedTxtColor;
      } else {
        updated.styles.variant = 'primary';
        updated.styles.color = migratedBgColor;
      }
    }
    if (control.classes === '') {
      updated.styles.variant = 'primary';
      updated.styles.color = 'blue';
    }
  }

  return migrated ? updated : null;
};

export default createButtonControl;
