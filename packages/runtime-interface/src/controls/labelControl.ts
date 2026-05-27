import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

export interface LabelControl extends BaseControl {
  text?: string;
  htmlContent?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}

export interface LabelControlInput extends BaseControlInput {
  text?: string;
  htmlContent?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}

export const createLabelControl = (data: LabelControlInput = {}): LabelControl => ({
  ...createBaseControl(data),
  type: data.type || 'LABEL',
  name: data.name || 'label',
  text: data.text || '',
  htmlContent: data.htmlContent || undefined,
  fontSize: data.fontSize || '14px',
  fontWeight: data.fontWeight || 'normal',
  textAlign: data.textAlign || 'left',
  color: data.color || undefined,
});

export default createLabelControl;
