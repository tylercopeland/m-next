import { useCallback } from 'react';
import { BLOCKED_EXTENSIONS, DEFAULT_MAX_FILE_SIZE } from '../utils/constants';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const useFileValidation = (maxFileSize = DEFAULT_MAX_FILE_SIZE, allowedExtensions?: string[]) => {
  const validateFile = useCallback(
    (file: File): ValidationResult => {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || extension.length > 5) {
        return { isValid: false, error: 'Invalid file extension' };
      }

      if (BLOCKED_EXTENSIONS.includes(extension)) {
        return { isValid: false, error: 'File type not allowed for security reasons' };
      }

      if (allowedExtensions && !allowedExtensions.includes(extension)) {
        return { isValid: false, error: 'File type not allowed' };
      }

      if (file.size > maxFileSize) {
        const maxSizeMB = Math.floor(maxFileSize / (1024 * 1024));
        return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
      }

      return { isValid: true, error: null };
    },
    [maxFileSize, allowedExtensions],
  );

  return { validateFile };
};
