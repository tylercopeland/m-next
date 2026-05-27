import { useRef, useEffect } from 'react';

export const useUploadProgress = (isUploading: boolean, onUploadEnd?: () => void) => {
  const wasUploadingRef = useRef(false);

  useEffect(() => {
    if (wasUploadingRef.current && !isUploading && onUploadEnd) {
      onUploadEnd();
    }
    wasUploadingRef.current = isUploading;
  }, [isUploading, onUploadEnd]);
};
