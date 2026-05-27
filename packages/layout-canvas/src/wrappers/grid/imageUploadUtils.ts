/**
 * Utility functions for handling image uploads in Grid component.
 * These help manage upload state and progress tracking.
 */
import type {
  EnrichedData,
  FieldMetadata,
  ImageUploadHandlers,
  UploadResponse,
  UploadError,
  CreateImageUploadHandlersParams,
  CreateUploadImageHandlerParams,
  UploadImageHandler,
} from './types';

/**
 * Extended ProgressEvent interface with additional properties
 */
interface ExtendedProgressEvent extends ProgressEvent {
  target: EventTarget & {
    getResponseHeader?: (name: string) => string | null;
  };
}

/**
 * Creates a set of image upload handlers for the Grid component.
 *
 * @param params - Configuration object
 * @param params.getEnrichedData - Function to get current enriched data state
 * @param params.setEnrichedData - Function to set enriched data state
 * @param params.handleColumnChangeEvent - Handler for column change events
 * @returns Object containing upload handler functions
 */
export const createImageUploadHandlers = ({
  getEnrichedData,
  setEnrichedData,
  handleColumnChangeEvent,
}: CreateImageUploadHandlersParams): ImageUploadHandlers => {
  /**
   * Updates metadata for a specific field in a row.
   * @param rowIdx - The row index
   * @param field - The field name
   * @param fieldData - The data to set for the field
   * @returns The updated metadata object
   */
  const updateFieldMetadata = (rowIdx: number, field: string, fieldData: FieldMetadata): EnrichedData => {
    const metadata = { ...getEnrichedData() };
    if (!metadata[rowIdx]) {
      metadata[rowIdx] = {};
    }
    const rowData = metadata[rowIdx];
    if (rowData) {
      rowData[field] = fieldData;
    }
    setEnrichedData(metadata);
    return metadata;
  };

  /**
   * Handles the start of an upload.
   * @param rowIdx - The row index
   * @param field - The field name
   * @param filename - The name of the file being uploaded
   */
  const handleStartUpload = (rowIdx: number, field: string, filename: string): void => {
    updateFieldMetadata(rowIdx, field, {
      progress: 0,
      uploading: true,
      filename,
    });
  };

  /**
   * Handles upload progress updates.
   * @param progressEvent - The progress event from the upload
   * @param rowIdx - The row index
   * @param field - The field name
   */
  const handleUploadProgress = (progressEvent: ProgressEvent, rowIdx: number, field: string): void => {
    const metadata = { ...getEnrichedData() };
    if (!metadata[rowIdx]) metadata[rowIdx] = {};

    const extendedEvent = progressEvent as ExtendedProgressEvent;
    const totalLength = progressEvent.lengthComputable
      ? progressEvent.total
      : extendedEvent.target?.getResponseHeader?.('content-length') ||
        extendedEvent.target?.getResponseHeader?.('x-decompressed-content-length');

    if (totalLength !== null && totalLength !== undefined) {
      const total = typeof totalLength === 'string' ? parseInt(totalLength, 10) : totalLength;
      const rowData = metadata[rowIdx];
      const fieldData = rowData?.[field];
      if (metadata && rowData && fieldData) {
        fieldData.progress = Math.round((progressEvent.loaded * 100) / total);
        setEnrichedData(metadata);
      }
    }
  };

  /**
   * Handles successful upload completion.
   * @param res - The response from the upload
   * @param rowIdx - The row index
   * @param field - The field name
   * @param recordId - The record ID
   */
  const handleUploadSuccess = (res: UploadResponse, rowIdx: number, field: string, recordId: string | number): void => {
    updateFieldMetadata(rowIdx, field, { uploading: false, progress: 0 });
    handleColumnChangeEvent(field, res.data.url, { onChangeEvent: null }, rowIdx, recordId);
  };

  /**
   * Handles upload errors.
   * @param e - The error object
   * @param rowIdx - The row index
   * @param field - The field name
   * @returns The error message from the server
   */
  const handleUploadError = (e: UploadError, rowIdx: number, field: string): string => {
    const fieldData: FieldMetadata = { uploading: false, progress: 0 };
    if (e && e.data && e.status === 400) {
      fieldData.error = e.data;
    }
    updateFieldMetadata(rowIdx, field, fieldData);
    return e.data || ''; // passing server's error message (response) because it is a customErrorMsg can be toasted
  };

  /**
   * Handles upload cancellation.
   * @param rowIdx - The row index
   * @param field - The field name
   */
  const handleUploadCancel = (rowIdx: number, field: string): void => {
    updateFieldMetadata(rowIdx, field, { uploading: false, progress: 0 });
  };

  return {
    handleStartUpload,
    handleUploadProgress,
    handleUploadSuccess,
    handleUploadError,
    handleUploadCancel,
  };
};

/**
 * Creates the main image upload handler for the Grid.
 *
 * @param params - Configuration object
 * @param params.isRuntimeMode - Whether we're in runtime mode
 * @param params.getEnrichedData - Function to get current enriched data state
 * @param params.setEnrichedData - Function to set enriched data state
 * @param params.runtimeContext - The runtime context with uploadGridImage
 * @param params.uploadHandlers - The upload handler functions
 * @returns The handleUploadImage function
 */
export const createUploadImageHandler = ({
  isRuntimeMode,
  getEnrichedData,
  setEnrichedData,
  runtimeContext,
  uploadHandlers,
}: CreateUploadImageHandlerParams): UploadImageHandler => {
  /**
   * Handles image upload for a grid cell.
   * @param file - The file to upload
   * @param field - The field name
   * @param rowIdx - The row index
   * @param recordId - The record ID
   */
  return (file: File, field: string, rowIdx: number, recordId: string | number): void => {
    if (!isRuntimeMode) {
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    const metadata = { ...getEnrichedData() };
    if (!metadata[rowIdx]) {
      metadata[rowIdx] = {};
    }
    const rowData = metadata[rowIdx];
    if (rowData) {
      rowData[field] = {
        progress: 0,
        uploading: true,
        filename: file.name,
      };
    }
    setEnrichedData(metadata);

    runtimeContext?.uploadGridImage?.(
      formData,
      field,
      rowIdx,
      file.name,
      recordId,
      uploadHandlers.handleStartUpload,
      uploadHandlers.handleUploadProgress,
      uploadHandlers.handleUploadSuccess,
      uploadHandlers.handleUploadError,
      uploadHandlers.handleUploadCancel,
    );
  };
};
