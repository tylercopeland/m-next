import { BackendControlStyles } from '../types';
import WIDGETS from '../types/widgetTypes';
import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';

export interface ButtonGroupControl extends BaseControl {
  type: string;
  buttons: BaseControl[];
  hasMenuLabel: boolean;
  menuLabel: string;
  styles?: BackendControlStyles;
}

export interface ButtonGroupControlInput extends BaseControlInput {
  buttons?: BaseControlInput[];
  hasMenuLabel?: boolean;
  menuLabel?: string;
}

export interface ButtonItemControlInput extends BaseControlInput {
  parentName?: string;
}

export const createButtonGroupItemControl = (base: ButtonItemControlInput = {}): BaseControl => {
  const button = {
    ...createBaseControl(base),
  };
  button.type = WIDGETS.BUTTONGROUPITEM;
  button.typeOverride = WIDGETS.BUTTONGROUPITEM;
  button.name = `${base.parentName}~~${button.id}`;

  return button as BaseControl;
};

export const createButtonGroupControl = (base: ButtonGroupControlInput = {}): ButtonGroupControl => {
  const group = {
    ...createBaseControl(base),
    type: WIDGETS.BUTTONGROUP,
    buttons: base.buttons || [],
    hasMenuLabel: base.hasMenuLabel === undefined ? false : base.hasMenuLabel,
    menuLabel: base.menuLabel || 'More actions',
  };
  if (group.buttons.length === 0) {
    const newButton = createButtonGroupItemControl({
      parentName: group.name,
      name: 'MenuItem1',
      caption: 'Menu item 1',
    });
    group.buttons.push(newButton);
  }
  if (group.buttons.length === 1) {
    const newButton = createButtonGroupItemControl({
      parentName: group.name,
      name: 'MenuItem2',
      caption: 'Menu item 2',
    });
    group.buttons.push(newButton);
  }
  return group as ButtonGroupControl;
};
// Button style mapping types
type ButtonBackgroundColor =
  | 'mi-button-group-primary'
  | 'mi-button-group-grey'
  | 'mi-button-group-navigation'
  | 'mi-button-group-caution'
  | 'mi-button-group-success'
  | 'mi-button-group-gunmetal'
  | 'mi-button-group-black'
  | 'mi-button-group-alert'
  | 'mi-button-group-secondary'
  | 'mi-button-group-transparent'
  | 'mi-button-group-pink'
  | 'mi-button-group-purple'
  | 'mi-button-group-aqua'
  | 'mi-button-group-yellow'
  | 'mi-button-group-white'
  | 'mi-button-group-silver';

type TextColor =
  | 'mi-button-group-text-alert'
  | 'mi-button-group-text-primary'
  | 'mi-button-group-text-navigation'
  | 'mi-button-group-text-caution'
  | 'mi-button-group-text-success'
  | 'mi-button-group-text-pink'
  | 'mi-button-group-text-purple'
  | 'mi-button-group-text-aqua'
  | 'mi-button-group-text-yellow'
  | 'mi-button-group-text-grey'
  | 'mi-button-group-text-gunmetal'
  | 'mi-button-group-text-silver'
  | 'mi-button-group-text-black'
  | 'mi-button-group-text-white';

// Button styles interface
export interface ButtonStyles {
  variant: 'primary' | 'secondary' | 'tertiary';
  color: string;
}

export const migrateTextColor = (
  txtColor: string | null | TextColor,
  bgColor: string | ButtonBackgroundColor,
): string => {
  if (txtColor === null || txtColor === '') {
    switch (bgColor) {
      case 'mi-button-group-primary':
      case 'mi-button-group-grey':
      case 'mi-button-group-navigation':
      case 'mi-button-group-caution':
      case 'mi-button-group-success':
      case 'mi-button-group-gunmetal':
      case 'mi-button-group-black':
      case 'mi-button-group-alert':
        return 'white';

      case 'mi-button-group-secondary':
      case 'mi-button-group-transparent':
      case 'mi-button-group-pink':
      case 'mi-button-group-purple':
      case 'mi-button-group-aqua':
      case 'mi-button-group-yellow':
      case 'mi-button-group-white':
      case 'mi-button-group-silver':
        return 'black';
      default:
        return 'grey';
    }
  }

  switch (txtColor) {
    case 'mi-button-group-text-alert':
      return 'red';
    case 'mi-button-group-text-primary':
      return 'blue';
    case 'mi-button-group-text-navigation':
      return 'blue-darker';
    case 'mi-button-group-text-caution':
      return 'yellow';
    case 'mi-button-group-text-success':
      return 'green';
    case 'mi-button-group-text-pink':
      return 'fuchsia';
    case 'mi-button-group-text-purple':
      return 'purple';
    case 'mi-button-group-text-aqua':
      return 'teal';
    case 'mi-button-group-text-yellow':
      return 'yellow';
    case 'mi-button-group-text-grey':
      return 'grey-light';
    case 'mi-button-group-text-gunmetal':
      return 'grey-darker';
    case 'mi-button-group-text-silver':
      return 'grey-light';
    case 'mi-button-group-text-black':
      return 'black';
    case 'mi-button-group-text-white':
      return 'white';
    default:
      return txtColor || 'grey';
  }
};

export const migrateButtonBackground = (bgColor: string | ButtonBackgroundColor): string => {
  switch (bgColor) {
    case 'mi-button-group-alert':
      return 'red';
    case 'mi-button-group-primary':
      return 'blue';
    case 'mi-button-group-grey':
    case 'mi-button-group-navigation':
      return 'grey';
    case 'mi-button-group-caution':
      return 'orange';
    case 'mi-button-group-success':
      return 'green';
    case 'mi-button-group-pink':
      return 'fuchsia';
    case 'mi-button-group-purple':
      return 'purple';
    case 'mi-button-group-aqua':
      return 'teal';
    case 'mi-button-group-yellow':
      return 'yellow';
    case 'mi-button-group-gunmetal':
      return 'grey-darker';
    case 'mi-button-group-silver':
      return 'grey-lighter';
    case 'mi-button-group-black':
      return 'black';
    case 'mi-button-group-secondary':
    case 'mi-button-group-white':
    case 'mi-button-group-transparent':
      return 'white';
    default:
      return bgColor;
  }
};

export const migrateButtonGroupControl = (control: ButtonGroupControl): ButtonGroupControl | null => {
  let migrated = false;
  const updated: ButtonGroupControl = { ...control };

  if (!updated.styles || Object.keys(updated.styles).length === 0) {
    migrated = true;
    updated.styles = {
      variant: 'secondary',
      color: 'dark-grey',
    };

    if (control.classes) {
      const parts = control.classes.split(' ');
      const bgColor =
        parts.find((x) => x.startsWith('mi-button-group-') && !x.startsWith('mi-button-group-text-')) || 'white';
      const txtColor = parts.find((x) => x.startsWith('mi-button-group-text-') || x.startsWith('text-')) || 'dark-grey';
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
      updated.styles.variant = 'secondary';
      updated.styles.color = 'dark-grey';
    }
  }

  return migrated ? updated : null;
};

export default createButtonGroupControl;
