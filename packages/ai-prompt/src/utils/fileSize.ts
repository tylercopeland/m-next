/**
 * Formats a file size in bytes to a human-readable string.
 * @param bytes - The file size in bytes
 * @param decimals - Number of decimal places to display (default: 2)
 * @returns A human-readable file size string (e.g., "86.3 KB", "1.2 MB")
 */
export default function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0 || bytes < 0 || !Number.isFinite(bytes)) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}
