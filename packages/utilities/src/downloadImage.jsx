/**
 * Shared image download helpers.
 * Used by GridWrapper (legacy, V4, V5) and EditableImage to download
 * images either from the CDN (unsigned) or via the authenticated API.
 */

/**
 * Low-level helper: creates a temporary anchor, triggers a download,
 * then cleans up the object URL after a short delay.
 *
 * @param {Blob}   blob     - The file content to download.
 * @param {string} filename - Suggested filename for the download.
 */
export function triggerBlobDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

/**
 * High-level image download orchestrator.
 *
 * Chooses between two strategies:
 *  - **CDN path** (no auth) for unsaved rows (recordId falsy / -1) or
 *    partial URLs that contain `/partial/`.
 *  - **API path** (auth) for saved records with a valid recordId.
 *
 * @param {Object}   opts
 * @param {string}   opts.imageUrl        - Source URL of the image.
 * @param {string}   opts.columnName      - Column / field name.
 * @param {number}   opts.recordId        - Row identifier (-1 = unsaved).
 * @param {string}   opts.viewName        - View identifier.
 * @param {string}   opts.authToken       - Bearer token for the API path.
 * @param {string}   opts.runtimeCoreUrl  - Base URL for the runtime API.
 * @param {Function} [opts.onError]       - Optional error callback.
 */
export async function downloadImage({ imageUrl, columnName, recordId, viewName, authToken, runtimeCoreUrl, onError }) {
  const handleError = (err) => {
    if (onError) {
      onError(err);
    } else {
      // eslint-disable-next-line no-console
      console.error('Image download error:', err);
    }
  };

  const useCdnPath = !recordId || recordId === -1 || imageUrl?.includes('/partial/');

  if (useCdnPath) {
    // CDN (unsigned) path
    if (!imageUrl) return;

    try {
      const response = await window.fetch(`${imageUrl}?v=${Date.now()}`, {
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`CDN download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      triggerBlobDownload(blob, imageUrl.split('/').pop() || 'image');
    } catch (err) {
      handleError(err);
    }
  } else {
    // API (authenticated) path
    if (!authToken || !runtimeCoreUrl) return;

    try {
      let fileName = '';
      try {
        const parsed = new window.URL(imageUrl);
        const segments = parsed.pathname.split('/');
        fileName = segments[segments.length - 1] || '';
      } catch {
        fileName = imageUrl.split('/').pop() || '';
      }

      const params = new window.URLSearchParams({
        view: viewName || '',
        column: columnName,
        key: 'RecordID',
        recordId: String(recordId),
        fileName,
      });

      const url = `${runtimeCoreUrl}/api/v1/image/download?${params}`;

      const response = await window.fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        throw new Error(`API download failed with status ${response.status}`);
      }

      const disposition = response.headers.get('Content-Disposition');
      let downloadFileName = fileName;
      if (disposition) {
        const match = disposition.match(/filename[^;=\n]*=["']?([^"';\n]*)["']?/);
        if (match) {
          [, downloadFileName] = match;
        }
      }

      const blob = await response.blob();
      triggerBlobDownload(blob, downloadFileName);
    } catch (err) {
      handleError(err);
    }
  }
}
