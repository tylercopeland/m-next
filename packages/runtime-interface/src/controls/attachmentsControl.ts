import { Guid } from '@m-next/utilities';
import { BaseControl, BaseControlInput } from './baseControl';

// Attachments control interface extending BaseControl
export interface AttachmentsControl extends BaseControl {
  enableEmailAttachment: boolean;
  // Backwards compatibility properties
  allowMultiple?: boolean;
  maxFileSize?: number | null;
  acceptedTypes?: string | null;
  files?: unknown[];
}

// Input data interface for AttachmentsControl - all properties are optional
export interface AttachmentsControlInput extends BaseControlInput {
  enableEmailAttachment?: boolean;
}

// Factory function with proper typing
export const createAttachmentsControl = (data: AttachmentsControlInput = {}): AttachmentsControl => ({
  id: data.id || Guid.create(),
  type: data.type || 'attachments',
  hideCaption: data.hideCaption === undefined ? true : data.hideCaption,
  caption: data.caption || '',
  classes: data.classes || '',
  name: data.name || 'attachments',
  widthType: data.widthType || 'auto',
  width: data.width || null,
  height: data.height || null,
  visible: data.visible === undefined ? true : data.visible,
  disabled: data.disabled === undefined ? false : data.disabled,
  isBound: data.isBound === undefined ? false : data.isBound,
  defaultValue: data.defaultValue || null,
  enableEmailAttachment: data.enableEmailAttachment === undefined ? false : data.enableEmailAttachment,
  isWorking: data.isWorking === undefined ? false : data.isWorking,
});

export default createAttachmentsControl;
