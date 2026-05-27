// Main exports
export { Attachments } from './components/Attachments';
export { AttachmentItem } from './components/AttachmentItem';
export { FileDropZone } from './components/FileDropZone';
export { StatusNotifier } from './components/StatusNotifier';
export { VisuallyHidden } from './components/VisuallyHidden';

// Type exports
export type {
  AttachmentFile,
  AttachmentItemProps,
  AttachmentsProps,
  FileDropZoneProps,
  StatusNotifierProps,
  VisuallyHiddenProps,
} from './types';

// Hook exports
export { useUploadProgress, useFileValidation } from './hooks';

// Utility exports
export { sanitizeFilename, formatFileSize, getFileExtension, generateFileId } from './utils';

// Constants
export { BLOCKED_EXTENSIONS, DEFAULT_MAX_FILE_SIZE, DEFAULT_CHECKBOX_LABEL, DEFAULT_CAPTION } from './utils/constants';
