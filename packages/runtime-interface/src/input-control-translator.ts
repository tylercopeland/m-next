import { BaseControlTranslator } from './base-control-translator';
import type { InputControl } from './controls/inputControl';
import { ValidationRuleTypes } from './validationRuleTypes';
import type { BaseWidgetProps } from './types';

interface BaseInputWidgetProps extends BaseWidgetProps {
  disabled: boolean;
  label: string | null;
  required: boolean;
  placeholder?: string;
  legacyClass?: string;
  value: string | number | null;
  width?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  displayAuto: boolean;
  isV4Design: boolean;
  ariaLabel: string;
  validationError?: string | null;
  validationMessage?: string | null;
}

export interface InputWidgetProps extends BaseInputWidgetProps {
  type: string;
}

export interface InputAreaWidgetProps extends BaseInputWidgetProps {
  rows: number;
}

export type InputTranslationResult = {
  widgetProps: InputWidgetProps | InputAreaWidgetProps;
};

export class InputControlTranslator extends BaseControlTranslator<InputWidgetProps | InputAreaWidgetProps> {
  public translateControl(
    control: InputControl,
    value: string | number | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
  ): InputTranslationResult {
    const baseProps = this.getBaseWidgetProps(control);

    const widgetProps: InputWidgetProps = {
      ...baseProps,
      disabled: control.disabled,
      label: control.hideCaption ? null : control.caption || null,
      required: translateIsRequired(control),
      placeholder: control.placeholder,
      legacyClass: control.classes,
      value: value,
      width: translateWidth(control),
      type: translateInputType(control),
      onBlur: onBlur,
      onChange: onChange,
      onFocus: onFocus,
      displayAuto: control.widthType === 'auto',
      isV4Design: false,
      ariaLabel: control.caption || '',
      validationError: control.validationError || null,
      validationMessage: control.validationError || null,
    };

    if (control.rows && control.rows > 1) {
      const areaWidgetProps: InputAreaWidgetProps = {
        ...widgetProps,
        rows: Number(control.rows),
      };
      return { widgetProps: areaWidgetProps };
    }

    return { widgetProps };
  }
}

const inputControlTranslator = new InputControlTranslator();

export function translateInputControl(
  control: InputControl,
  value: string | number | null,
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
): InputTranslationResult {
  return inputControlTranslator.translateControl(control, value, onChange, onBlur, onFocus);
}

export function translateWidth(control: InputControl): string | undefined {
  if (control.widthType === 'fixed' && control.width) {
    if (String(control.width).endsWith('px') || String(control.width).endsWith('%')) {
      return String(control.width);
    }
    return `${control.width}px`;
  }
  if (control.widthType === 'full') {
    return '100%';
  }
  return undefined;
}

export function translateIsRequired(control: InputControl): boolean {
  if (control.validationRules) {
    const match = control.validationRules.find(({ rule }) => rule === ValidationRuleTypes.Required);
    if (match) return true;
  }
  return false;
}

export function translateInputType(control: InputControl): string {
  return control.inputType;
}
