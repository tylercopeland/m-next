import { BaseControlTranslator } from './base-control-translator';
import { AttachmentsControl } from './controls/attachmentsControl';
import type { AttachmentsWidgetProps, AttachmentsTranslationResult } from './types';

/**
 * Attachments event handlers interface
 */
export interface AttachmentsEventHandlers {
  onAttachmentUpload?: (files: File[]) => void;
  onAttachmentDelete?: (id: string, documentId: string) => void;
  onAttachmentClick?: (documentId: string, url: string) => void;
  onToggleEmailAttachment?: (documentId: string, attachToEmail: boolean) => void;
}

/**
 * Attachments-specific control translator that extends the base translator
 */
export class AttachmentsControlTranslator extends BaseControlTranslator<AttachmentsWidgetProps> {
  /**
   * Translates complete backend control to frontend attachments widget props
   */
  public translateControl(
    control: AttachmentsControl,
    eventHandlers: AttachmentsEventHandlers = {},
  ): AttachmentsTranslationResult {
    const baseProps = this.getBaseWidgetProps(control);

    const widgetProps: AttachmentsWidgetProps = {
      ...baseProps,
      caption: control.caption || 'Attachments',
      visible: control.visible !== false, // Default to true if not specified
      disabled: control.disabled || false,
      enableEmailAttachment: control.enableEmailAttachment || false,
      onAttachmentUpload: eventHandlers.onAttachmentUpload,
      onAttachmentDelete: eventHandlers.onAttachmentDelete,
      onAttachmentClick: eventHandlers.onAttachmentClick,
      onToggleEmailAttachment: eventHandlers.onToggleEmailAttachment,
    };

    return {
      widgetProps,
      v4Styling: {},
    };
  }
}

// Create a singleton instance for the attachments translator
const attachmentsTranslator = new AttachmentsControlTranslator();

export function translateAttachmentsControl(
  control: AttachmentsControl,
  eventHandlers: AttachmentsEventHandlers = {},
): AttachmentsTranslationResult {
  return attachmentsTranslator.translateControl(control, eventHandlers);
}
