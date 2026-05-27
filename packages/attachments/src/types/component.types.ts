import { AttachmentFile } from './attachment.types';

export interface AttachmentItemProps {
  id: string;
  parentId?: string;
  filename: string;
  fileExtension?: string;
  url?: string;
  size?: number;
  modifiedBy?: string;
  createdDate?: string;
  errorMessage?: string;
  progress?: number;
  uploading?: boolean;
  float?: boolean;
  disabled?: boolean;
  displayCheckbox?: boolean;
  isCheckboxChecked?: boolean;
  hasScrollbar?: boolean;
  minWidth?: number | string;
  checkboxLabel?: string;
  onLinkClick: (id: string, url: string) => void;
  onRemove: (id: string) => void;
  onToggleCheckbox: (id: string, checked: boolean) => void;
  onUploadEnd: () => void;
}

export interface AttachmentsProps {
  data?: AttachmentFile[];
  id: string;
  visible?: boolean;
  disabled?: boolean;
  disableDropZone?: boolean;
  isLoading?: boolean;
  hideTitle?: boolean;
  caption?: string;
  className?: string;
  enableEmailAttachment?: boolean;
  widthType?: 'fixed' | 'auto' | 'full' | null;
  width?: string;
  isMobile?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];

  onAttachmentUpload: (acceptedFiles: File[], rejectedFiles: File[], errorMessages: string[]) => void;
  onAttachmentDelete: (documentId: string) => void;
  onAttachmentClick: (documentId: string, url: string) => void;
  onToggleEmailAttachment: (documentId: string, attachToEmail: boolean) => void;
  onUploadEnd: () => void;
}

export interface FileDropZoneProps {
  onFilesAdded: (acceptedFiles: File[], rejectedFiles: File[], errorMessages: string[]) => void;
  disabled?: boolean;
  maxFileSize?: number;
  allowedExtensions?: string[];
  multiple?: boolean;
  isMobile?: boolean;
}

export interface StatusNotifierProps {
  ariaLive?: 'assertive' | 'polite';
  pending?: boolean;
  messages: {
    idle?: string;
    pending?: string;
    done?: string;
  };
}

export interface VisuallyHiddenProps {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
