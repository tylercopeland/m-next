import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';
import { ValidationRule } from '../validationRule';

// HTML Editor-specific data interface
export interface HtmlEditorControlData {
  content?: string | null;
  height?: number | null;
  toolbar?: string[] | null;
  readonly?: boolean;
  placeholder?: string | null;
  allowImages?: boolean;
  allowLinks?: boolean;
  allowTables?: boolean;
  allowCodeView?: boolean;
  maxLength?: number | null;
  theme?: 'light' | 'dark';
  spellCheck?: boolean;
}

// Complete HTML editor control interface
export interface HtmlEditorControl extends BaseControl {
  type: string;
  content?: string | null;
  height?: number | string | null;
  toolbar?: string[] | null;
  readonly?: boolean;
  placeholder?: string | null;
  allowImages?: boolean;
  allowLinks?: boolean;
  allowTables?: boolean;
  allowCodeView?: boolean;
  maxLength?: number | null;
  theme?: 'light' | 'dark';
  spellCheck?: boolean;
  onChange?: string | null;
  onBlur?: string | null;
  onFocus?: string | null;
  validationRules?: ValidationRule[] | null;
  componentVersion?: string;
}

// Factory function to create HTML editor control
export const createHtmlEditorControl = (control: HtmlEditorControl): HtmlEditorControl => {
  const baseDefaults: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'HTML Editor',
    classes: '',
    name: 'htmlEditor',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  };
  const base = createBaseControl({ ...baseDefaults, ...control });

  const dataDefaults: HtmlEditorControlData = {
    content: '',
    height: 300,
    toolbar: ['bold', 'italic', 'underline', 'link', 'bulletList', 'numberedList'],
    readonly: false,
    placeholder: '',
    allowImages: true,
    allowLinks: true,
    allowTables: true,
    allowCodeView: false,
    maxLength: null,
    theme: 'light',
    spellCheck: true,
  };

  return {
    ...base,
    ...dataDefaults,
    ...control,
    validationRules:
      Array.isArray(control.validationRules) && control.validationRules.length ? control.validationRules : null,
    // !! type and typeOverride must be this for HTML editor to work !!
    type: WIDGETS.TEXTBOX,
    typeOverride: WIDGETS.HTMLEDITOR,
  };
};

// Type guard function
export const isHtmlEditorControl = (control: unknown): control is HtmlEditorControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.HTMLEDITOR
  );
};

export default createHtmlEditorControl;
