import type { BaseWidgetProps } from './types';
import { BaseControl } from './controls/baseControl';

/**
 * Base control translator class containing common translation logic
 * that can be extended by specific control translators
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class BaseControlTranslator<_TWidgetProps extends BaseWidgetProps = BaseWidgetProps> {
  /**
   * Translates backend control width configuration to frontend widget width
   */
  protected translateWidth(control: BaseControl): string | undefined {
    if (control.widthType === 'fixed' && control.width) {
      if (String(control.width).endsWith('px') || String(control.width).endsWith('%')) {
        return String(control.width);
      }
      return `${control.width}px`;
    }
    if (control.widthType === 'full') {
      return '100%';
    }
    return control.width ? String(control.width) : undefined;
  }

  /**
   * Generates base widget properties that are common across all control types
   */
  protected getBaseWidgetProps(control: BaseControl): BaseWidgetProps {
    return {
      id: control.id,
      widthType: control.widthType,
      width: this.translateWidth(control),
      disabled: control.disabled,
      visible: control.visible,
    };
  }

  /**
   * Abstract method that subclasses must implement to translate
   * the complete backend control to frontend widget props
   */
  public abstract translateControl(control: BaseControl | undefined, ...args: unknown[]): unknown;
}

/**
 * Translates backend control width configuration to frontend widget width
 */
export function translateWidth(control: BaseControl): string | undefined {
  const translator = new (class extends BaseControlTranslator {
    protected getBaseClassName(): string {
      return '';
    }
    public translateControl(): null {
      return null;
    }
  })();

  return translator['translateWidth'](control);
}
