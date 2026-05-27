import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import { ValidationRule } from '../validationRule';
import WIDGETS from '../types/widgetTypes';

// Signature-specific data interface
export interface SignatureControlData {
  signatureData?: string | null;
  width?: number | null;
  height?: number | null;
  backgroundColor?: string | null;
  penColor?: string | null;
  penWidth?: number | null;
  required?: boolean;
  clearButtonText?: string | null;
  placeholder?: string | null;
  readonly?: boolean;
  acceptCaption?: string;
  cancelCaption?: string;
  hideCancel?: boolean;
  onAccept?: string;
  onCancel?: string;
  validationRules?: ValidationRule[];
}

// Complete signature control interface
export interface SignatureControl extends BaseControl {
  type: string;
  signatureData?: string | null;
  width?: number | null;
  height?: number | null;
  backgroundColor?: string | null;
  penColor?: string | null;
  penWidth?: number | null;
  required?: boolean;
  clearButtonText?: string | null;
  placeholder?: string | null;
  readonly?: boolean;
  acceptCaption: string;
  cancelCaption: string;
  hideCancel: boolean;
  onAccept: string;
  onCancel: string;
  validationRules: ValidationRule[];
}

// Factory function to create signature control
export const createSignatureControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Signature',
    classes: '',
    name: 'signature',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: SignatureControlData = {
    signatureData: null,
    width: 400,
    height: 200,
    backgroundColor: '#ffffff',
    penColor: '#000000',
    penWidth: 2,
    required: false,
    clearButtonText: 'Clear',
    placeholder: 'Sign here',
    readonly: false,
    acceptCaption: 'Accept',
    cancelCaption: 'Cancel',
    hideCancel: false,
    onAccept: '',
    onCancel: '',
    validationRules: [],
  },
): SignatureControl => ({
  ...createBaseControl(base),
  type: WIDGETS.SIGNATURE,
  signatureData: data.signatureData || null,
  width: data.width || 400,
  height: data.height || 200,
  backgroundColor: data.backgroundColor || '#ffffff',
  penColor: data.penColor || '#000000',
  penWidth: data.penWidth || 2,
  required: data.required !== undefined ? data.required : false,
  clearButtonText: data.clearButtonText || 'Clear',
  placeholder: data.placeholder || 'Sign here',
  readonly: data.readonly !== undefined ? data.readonly : false,
  acceptCaption: data.acceptCaption || 'Accept',
  cancelCaption: data.cancelCaption || 'Cancel',
  hideCancel: data.hideCancel !== undefined ? data.hideCancel : false,
  onAccept: data.onAccept || '',
  onCancel: data.onCancel || '',
  validationRules: data.validationRules || [],
});

// Type guard function
export const isSignatureControl = (control: unknown): control is SignatureControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.SIGNATURE
  );
};

export default createSignatureControl;
