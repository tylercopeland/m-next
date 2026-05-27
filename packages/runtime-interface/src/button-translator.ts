import { colors } from './colors';
import { BaseControlTranslator } from './base-control-translator';
import type {
  WidgetColorStyling,
  WidgetIcon,
  ButtonWidgetProps,
  ButtonTranslationResult,
  ButtonControl,
} from './types';

/**
 * Button-specific control translator that extends the base translator
 */
export class ButtonControlTranslator extends BaseControlTranslator<ButtonWidgetProps> {
  /**
   * Translates complete backend control to frontend button widget props
   */
  public translateControl(control: ButtonControl, onClick: () => void): ButtonTranslationResult {
    const icon = translateIcon(control);
    const v4Styling = translateV4Styling(control);
    const baseProps = this.getBaseWidgetProps(control);
    let btnClass = `mi-button ${control.classes}`;
    if (v4Styling) {
      btnClass = '';
    }

    const widgetProps: ButtonWidgetProps = {
      ...baseProps,
      className: btnClass,
      classes: control.classes?.split(' ') || [],
      value: control.hideCaption ? '' : ` ${control.caption} `,
      icon,
      backgroundColor: v4Styling?.backgroundColor || undefined,
      color: v4Styling?.color || undefined,
      borderColor: v4Styling?.borderColor || undefined,
      buttonStyle: control.styles?.variant === 'tertiary' ? 'link' : 'primary',
      onClick: onClick,
      isV4Design: !!v4Styling, // Indicate this is a v4 design widget
      disabled: control.disabled || control.isWorking || false,
      // Override padding for tertiary variant to remove horizontal padding
      style: control.styles?.variant === 'tertiary' ? { paddingLeft: '0px', paddingRight: '0px' } : undefined,
    };

    return {
      widgetProps,
      v4Styling,
    };
  }
}

// Create a singleton instance for the button translator
const buttonTranslator = new ButtonControlTranslator();

/**
 * Standalone utility functions for backward compatibility
 */

export function generateBaseStyle(
  control: ButtonControl,
  v4Styling: WidgetColorStyling | null,
): React.CSSProperties | undefined {
  if (!v4Styling) {
    return undefined;
  }

  return {
    margin: '0 5px 10px',
    padding: control.styles?.variant === 'tertiary' ? '8px 0px' : undefined,
  };
}
/**
 * Translates backend control icon configuration to frontend widget icon
 */
export function translateIcon(control: ButtonControl): WidgetIcon | undefined {
  if (!control.icon) {
    return undefined;
  }

  return {
    name: control.icon.replace('mi-icon-', ''),
    position: (control.iconAlign?.toLowerCase() === 'right' ? 'right' : 'left') as 'left' | 'right',
    size: 14,
  };
}

/**
 * Translates backend control width configuration to frontend widget width
 */
export function translateWidth(control: ButtonControl): string | undefined {
  return buttonTranslator['translateWidth'](control);
}

/**
 * Translates backend control styles to v4 color styling
 */
export function translateV4Styling(control: ButtonControl): WidgetColorStyling | null {
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
    colorMap.borderColor = resolvedColor;
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

/**
 * Translates complete backend control to frontend button widget props
 */
export function translateButtonControl(control: ButtonControl, onClick: () => void): ButtonTranslationResult {
  return buttonTranslator.translateControl(control, onClick);
}
