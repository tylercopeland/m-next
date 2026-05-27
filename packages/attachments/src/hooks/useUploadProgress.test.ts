import { renderHook } from '@testing-library/react-hooks';
import { useUploadProgress } from './useUploadProgress';

describe('useUploadProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onUploadEnd when uploading transitions from true to false', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: true },
    });

    // Change from uploading to not uploading
    rerender({ isUploading: false });

    expect(onUploadEnd).toHaveBeenCalledTimes(1);
  });

  it('does not call onUploadEnd when uploading transitions from false to true', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: false },
    });

    // Change from not uploading to uploading
    rerender({ isUploading: true });

    expect(onUploadEnd).not.toHaveBeenCalled();
  });

  it('does not call onUploadEnd when uploading stays true', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: true },
    });

    // Stay uploading
    rerender({ isUploading: true });

    expect(onUploadEnd).not.toHaveBeenCalled();
  });

  it('does not call onUploadEnd when uploading stays false', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: false },
    });

    // Stay not uploading
    rerender({ isUploading: false });

    expect(onUploadEnd).not.toHaveBeenCalled();
  });

  it('handles multiple upload cycles', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: false },
    });

    // Start uploading
    rerender({ isUploading: true });
    expect(onUploadEnd).not.toHaveBeenCalled();

    // Finish uploading
    rerender({ isUploading: false });
    expect(onUploadEnd).toHaveBeenCalledTimes(1);

    // Start uploading again
    rerender({ isUploading: true });
    expect(onUploadEnd).toHaveBeenCalledTimes(1);

    // Finish uploading again
    rerender({ isUploading: false });
    expect(onUploadEnd).toHaveBeenCalledTimes(2);
  });

  it('does not call onUploadEnd when callback is not provided', () => {
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, undefined), {
      initialProps: { isUploading: true },
    });

    // Change from uploading to not uploading
    rerender({ isUploading: false });

    // Should not throw any errors
    expect(true).toBe(true);
  });

  it('handles rapid state changes', () => {
    const onUploadEnd = jest.fn();
    const { rerender } = renderHook(({ isUploading }) => useUploadProgress(isUploading, onUploadEnd), {
      initialProps: { isUploading: false },
    });

    // Rapid state changes
    rerender({ isUploading: true });
    rerender({ isUploading: false });
    rerender({ isUploading: true });
    rerender({ isUploading: false });

    expect(onUploadEnd).toHaveBeenCalledTimes(2);
  });

  it('initializes correctly with false isUploading', () => {
    const onUploadEnd = jest.fn();
    renderHook(() => useUploadProgress(false, onUploadEnd));

    expect(onUploadEnd).not.toHaveBeenCalled();
  });

  it('initializes correctly with true isUploading', () => {
    const onUploadEnd = jest.fn();
    renderHook(() => useUploadProgress(true, onUploadEnd));

    expect(onUploadEnd).not.toHaveBeenCalled();
  });
});
