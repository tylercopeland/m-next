import { sanitizeFilename, formatFileSize, getFileExtension, generateFileId } from './fileUtils';

describe('fileUtils', () => {
  describe('sanitizeFilename', () => {
    it('removes invalid characters from filename', () => {
      const filename = 'file/with\\invalid:chars*?<>|.txt';
      const result = sanitizeFilename(filename);
      expect(result).toBe('file_with_invalid_chars_.txt');
    });

    it('removes non-ASCII characters', () => {
      const filename = 'file-with-émojis-🚀.txt';
      const result = sanitizeFilename(filename);
      expect(result).toBe('file-with-_mojis-_.txt');
    });

    it('trims whitespace', () => {
      const filename = '  filename.txt  ';
      const result = sanitizeFilename(filename);
      expect(result).toBe('filename.txt');
    });

    it('handles empty string', () => {
      const result = sanitizeFilename('');
      expect(result).toBe('');
    });

    it('handles filename with only invalid characters', () => {
      const filename = '\\/:*?<>|';
      const result = sanitizeFilename(filename);
      expect(result).toBe('_');
    });

    it('preserves valid characters', () => {
      const filename = 'valid-filename_123.txt';
      const result = sanitizeFilename(filename);
      expect(result).toBe('valid-filename_123.txt');
    });
  });

  describe('formatFileSize', () => {
    it('formats 0 bytes', () => {
      const result = formatFileSize(0);
      expect(result).toBe('0 Bytes');
    });

    it('formats bytes', () => {
      const result = formatFileSize(512);
      expect(result).toBe('512 Bytes');
    });

    it('formats kilobytes', () => {
      const result = formatFileSize(1536);
      expect(result).toBe('1.5 KB');
    });

    it('formats megabytes', () => {
      const result = formatFileSize(1572864);
      expect(result).toBe('1.5 MB');
    });

    it('formats gigabytes', () => {
      const result = formatFileSize(1610612736);
      expect(result).toBe('1.5 GB');
    });

    it('handles exact kilobyte values', () => {
      const result = formatFileSize(1024);
      expect(result).toBe('1 KB');
    });

    it('handles exact megabyte values', () => {
      const result = formatFileSize(1048576);
      expect(result).toBe('1 MB');
    });

    it('handles exact gigabyte values', () => {
      const result = formatFileSize(1073741824);
      expect(result).toBe('1 GB');
    });

    it('handles very large numbers', () => {
      const result = formatFileSize(1099511627776); // 1 TB
      expect(result).toBe('1 TB');
    });

    it('handles decimal precision correctly', () => {
      const result = formatFileSize(1536);
      expect(result).toBe('1.5 KB');
    });
  });

  describe('getFileExtension', () => {
    it('extracts file extension from filename', () => {
      const result = getFileExtension('document.pdf');
      expect(result).toBe('pdf');
    });

    it('returns lowercase extension', () => {
      const result = getFileExtension('document.PDF');
      expect(result).toBe('pdf');
    });

    it('handles filename without extension', () => {
      const result = getFileExtension('document');
      expect(result).toBe('document');
    });

    it('handles filename with multiple dots', () => {
      const result = getFileExtension('document.backup.txt');
      expect(result).toBe('txt');
    });

    it('handles filename ending with dot', () => {
      const result = getFileExtension('document.');
      expect(result).toBe('');
    });

    it('handles filename starting with dot', () => {
      const result = getFileExtension('.htaccess');
      expect(result).toBe('htaccess');
    });

    it('handles empty string', () => {
      const result = getFileExtension('');
      expect(result).toBe('');
    });

    it('handles filename with spaces', () => {
      const result = getFileExtension('my document.txt');
      expect(result).toBe('txt');
    });
  });

  describe('generateFileId', () => {
    it('generates unique file IDs', () => {
      const id1 = generateFileId();
      const id2 = generateFileId();
      expect(id1).not.toBe(id2);
    });

    it('generates IDs with correct format', () => {
      const id = generateFileId();
      expect(id).toMatch(/^file_\d+_[a-z0-9]{9}$/);
    });

    it('includes timestamp in ID', () => {
      const before = Date.now();
      const id = generateFileId();
      const after = Date.now();

      const timestamp = parseInt(id.split('_')[1]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('generates multiple unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateFileId());
      }
      expect(ids.size).toBe(100);
    });
  });
});
