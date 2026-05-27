export interface AttachmentFile {
  id: string;
  filename: string;
  fileExtension?: string;
  url?: string;
  size?: number;
  modifiedBy?: string;
  createdDate?: string;
  errorMessage?: string;
  uploading?: boolean;
  progress?: number;
  links?: Array<{ attachToEmail: boolean }>;
}
