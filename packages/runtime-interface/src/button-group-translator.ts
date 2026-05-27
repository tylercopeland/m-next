import { BaseControlTranslator } from './base-control-translator';
import type { ButtonGroupTranslationResult, ButtonGroupWidgetProps, WidgetColorStyling } from './types';
import type { ButtonGroupControl } from './controls/buttonGroupControl';
import { colors } from './colors';

export class ButtonGroupControlTranslator extends BaseControlTranslator<ButtonGroupWidgetProps> {
  public translateControl(control: ButtonGroupControl | undefined, onClick: () => void): ButtonGroupTranslationResult {
    if (!control) {
      return {
        widgetProps: {
          disabled: false,
          id: '',
          label: '',
          name: '',
          data: [],
          width: '',
          displayAuto: false,
          showCaption: true,
          onClick: () => {},
          hasMenuLabel: true,
          menuLabel: 'More actions',
          legacyClass: '',
          buttonStyle: 'primary',
          isV4Design: false,
        },
        v4Styling: null,
      };
    }
    const v4Styling = translateV4Styling(control);
    let btnClass = control.classes;
    if (v4Styling) {
      btnClass = '';
    }

    const visibleButtons = (control.buttons || []).filter((btn) => btn.visible !== false);
    const data = visibleButtons.map((button) => ({ label: button.caption || '', disabled: button.disabled }));
    const updatedWidth = translateWidth(control);
    const widgetProps = {
      id: control.id,
      disabled: control.disabled || control.isWorking,
      label: control.caption,
      name: control.name,
      data: data ?? [],
      width: updatedWidth || '',
      displayAuto: control.widthType === 'auto',
      showCaption: !control.hideCaption,
      onClick: onClick,
      menuLabel: control.menuLabel,
      hasMenuLabel: control.hasMenuLabel !== false, // Default to true if not specified
      legacyClass: btnClass,
      backgroundColor: v4Styling?.backgroundColor || undefined,
      color: v4Styling?.color || undefined,
      borderColor: v4Styling?.borderColor || undefined,
      buttonStyle: control.styles?.variant === 'tertiary' ? 'link' : 'primary',
      isV4Design: !!v4Styling, // Indicate this is a v4 design widget
    };
    return { widgetProps, v4Styling };
  }
}

/**
 * Translates backend control styles to v4 color styling
 */
export function translateV4Styling(control: ButtonGroupControl): WidgetColorStyling | null {
  if (!control.styles || Object.keys(control.styles).length === 0) {
    return null;
  }

  const colorMap: WidgetColorStyling = {
    backgroundColor: null,
    color: null,
    borderColor: null,
  };

  const { variant, color } = control.styles;

  if (variant === 'primary') {
    const resolvedColor = color ? colors[color as keyof typeof colors] || color : null;
    colorMap.backgroundColor = resolvedColor;
    colorMap.color = colors.white;

    // Special handling for certain colors in primary variant
    if (
      colorMap.backgroundColor &&
      [colors.white, colors.teal, colors.yellow, colors['grey-lightest']].includes(colorMap.backgroundColor)
    ) {
      colorMap.color = colors.grey;
    }
  } else if (variant === 'secondary') {
    const resolvedColor = color ? colors[color as keyof typeof colors] || color : null;
    colorMap.color = resolvedColor;
    colorMap.borderColor = resolvedColor;
    colorMap.backgroundColor = colors.white;
  } else if (variant === 'tertiary') {
    const resolvedColor = color ? colors[color as keyof typeof colors] || color : null;
    colorMap.color = resolvedColor;
    colorMap.borderColor = null;
    colorMap.backgroundColor = null;
  }

  return colorMap;
}

const buttonGroupTranslator = new ButtonGroupControlTranslator();

export function translateButtonGroupControl(
  control: ButtonGroupControl | undefined,
  onClick: () => void,
): ButtonGroupTranslationResult {
  return buttonGroupTranslator.translateControl(control, onClick) as ButtonGroupTranslationResult;
}

/**
 * Translates backend control width configuration to frontend widget width
 */
export function translateWidth(control: ButtonGroupControl): string | null {
  if (control.widthType === 'fixed' && control.width) {
    if (String(control.width).endsWith('px') || String(control.width).endsWith('%')) {
      return String(control.width);
    }
    return `${control.width}px`;
  }
  if (control.widthType === 'full') {
    return '100%';
  }
  return null;
}
