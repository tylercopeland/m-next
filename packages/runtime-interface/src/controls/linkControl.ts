import { BaseControl, BaseControlInput, createBaseControl } from './baseControl';

export interface LinkControl extends BaseControl {
  url?: string;
  target?: string;
  text?: string;
  color?: string;
  underline?: boolean;
  fontSize?: string;
  fontWeight?: string;
  tooltip?: string;
  noFollow?: boolean;
  noOpener?: boolean;
  cssClass?: string;
  style?: Record<string, unknown>;
}

export interface LinkControlInput extends BaseControlInput {
  url?: string;
  target?: string;
  text?: string;
  color?: string;
  underline?: boolean;
  fontSize?: string;
  fontWeight?: string;
  tooltip?: string;
  noFollow?: boolean;
  noOpener?: boolean;
  cssClass?: string;
  style?: Record<string, unknown>;
}

export const createLinkControl = (data: LinkControlInput = {}): LinkControl => ({
  ...createBaseControl(data),
  type: data.type || 'link',
  name: data.name || 'link',
  url: data.url || '#',
  target: data.target || '_self',
  text: data.text || '',
  color: data.color || '#007bff',
  underline: data.underline !== false,
  fontSize: data.fontSize || '14px',
  fontWeight: data.fontWeight || 'normal',
  tooltip: data.tooltip || '',
  noFollow: data.noFollow || false,
  noOpener: data.noOpener || false,
  cssClass: data.cssClass || '',
  style: data.style || {},
});

export default createLinkControl;
