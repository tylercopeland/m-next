import { triggerBlobDownload, downloadImage } from './downloadImage';

// ---------------------------------------------------------------------------
// Helpers & shared mocks
// ---------------------------------------------------------------------------

function makeFakeBlob() {
  return new Blob(['pixels'], { type: 'image/png' });
}

function makeOkResponse(blob, contentDisposition) {
  const headers = new Map();
  if (contentDisposition) {
    headers.set('Content-Disposition', contentDisposition);
  }
  return {
    ok: true,
    status: 200,
    blob: jest.fn().mockResolvedValue(blob),
    headers: { get: (key) => headers.get(key) || null },
  };
}

function makeFailResponse(status = 500) {
  return {
    ok: false,
    status,
    blob: jest.fn(),
    headers: { get: () => null },
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let anchorEl;
let originalCreateElement;
let originalAppendChild;
let originalRemoveChild;

beforeEach(() => {
  jest.useFakeTimers();

  // Anchor element mock
  anchorEl = { href: '', download: '', click: jest.fn() };
  originalCreateElement = document.createElement;
  document.createElement = jest.fn((tag) => {
    if (tag === 'a') return anchorEl;
    return originalCreateElement.call(document, tag);
  });

  originalAppendChild = document.body.appendChild;
  document.body.appendChild = jest.fn();

  originalRemoveChild = document.body.removeChild;
  document.body.removeChild = jest.fn();

  // window.URL helpers
  window.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake');
  window.URL.revokeObjectURL = jest.fn();

  // window.fetch
  window.fetch = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  document.createElement = originalCreateElement;
  document.body.appendChild = originalAppendChild;
  document.body.removeChild = originalRemoveChild;
});

// ---------------------------------------------------------------------------
// 1. triggerBlobDownload
// ---------------------------------------------------------------------------

describe('triggerBlobDownload', () => {
  it('creates an anchor, sets href/download, appends to body, clicks, removes, and revokes URL after timeout', () => {
    const blob = makeFakeBlob();

    triggerBlobDownload(blob, 'photo.png');

    // createObjectURL called with the blob
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);

    // Anchor configured
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(anchorEl.href).toBe('blob:http://localhost/fake');
    expect(anchorEl.download).toBe('photo.png');

    // Appended, clicked, removed
    expect(document.body.appendChild).toHaveBeenCalledWith(anchorEl);
    expect(anchorEl.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(anchorEl);

    // revokeObjectURL is deferred
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/fake');
  });
});

// ---------------------------------------------------------------------------
// 2-4. CDN path
// ---------------------------------------------------------------------------

describe('downloadImage – CDN path', () => {
  const imageUrl = 'https://cdn.example.com/images/pic.png';

  it('fetches via CDN when recordId is null', async () => {
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob));

    await downloadImage({ imageUrl, recordId: null });

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/cdn\.example\.com\/images\/pic\.png\?v=\d+$/),
      { mode: 'cors' },
    );
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(anchorEl.download).toBe('pic.png');
  });

  it('fetches via CDN when recordId is undefined', async () => {
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob));

    await downloadImage({ imageUrl, recordId: undefined });

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/cdn\.example\.com\/images\/pic\.png\?v=\d+$/),
      { mode: 'cors' },
    );
  });

  it('fetches via CDN when recordId is 0', async () => {
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob));

    await downloadImage({ imageUrl, recordId: 0 });

    expect(window.fetch).toHaveBeenCalled();
    expect(anchorEl.download).toBe('pic.png');
  });

  it('fetches via CDN when recordId is -1', async () => {
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob));

    await downloadImage({ imageUrl, recordId: -1 });

    expect(window.fetch).toHaveBeenCalledWith(expect.stringMatching(/\?v=\d+$/), { mode: 'cors' });
    expect(anchorEl.download).toBe('pic.png');
  });

  it('fetches via CDN when imageUrl contains /partial/ regardless of recordId', async () => {
    const partialUrl = 'https://cdn.example.com/partial/img.jpg';
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob));

    await downloadImage({
      imageUrl: partialUrl,
      recordId: 42,
      authToken: 'tok',
      runtimeCoreUrl: 'https://api.example.com',
    });

    // Should still use CDN path, not API path
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/cdn\.example\.com\/partial\/img\.jpg\?v=\d+$/),
      { mode: 'cors' },
    );
    expect(anchorEl.download).toBe('img.jpg');
  });

  it('returns early without fetching when imageUrl is falsy', async () => {
    await downloadImage({ imageUrl: '', recordId: null });
    await downloadImage({ imageUrl: null, recordId: null });
    await downloadImage({ imageUrl: undefined, recordId: null });

    expect(window.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 6. API (authenticated) path
// ---------------------------------------------------------------------------

describe('downloadImage – API path', () => {
  const baseOpts = {
    imageUrl: 'https://cdn.example.com/uploads/photo.png',
    columnName: 'Avatar',
    recordId: 42,
    viewName: 'ContactList',
    authToken: 'jwt-token-123',
    runtimeCoreUrl: 'https://runtime.example.com',
  };

  it('builds the correct URL, sends Bearer auth, parses Content-Disposition, and triggers download', async () => {
    const blob = makeFakeBlob();
    const resp = makeOkResponse(blob, 'attachment; filename="server-name.png"');
    window.fetch.mockResolvedValue(resp);

    await downloadImage(baseOpts);

    // Verify URL structure
    const fetchUrl = window.fetch.mock.calls[0][0];
    expect(fetchUrl).toContain('https://runtime.example.com/api/v1/image/download?');
    expect(fetchUrl).toContain('view=ContactList');
    expect(fetchUrl).toContain('column=Avatar');
    expect(fetchUrl).toContain('key=RecordID');
    expect(fetchUrl).toContain('recordId=42');
    expect(fetchUrl).toContain('fileName=photo.png');

    // Auth header
    const fetchOpts = window.fetch.mock.calls[0][1];
    expect(fetchOpts.headers.Authorization).toBe('Bearer jwt-token-123');

    // Content-Disposition filename used for download
    expect(anchorEl.download).toBe('server-name.png');
  });

  it('falls back to parsed fileName when Content-Disposition is absent', async () => {
    const blob = makeFakeBlob();
    window.fetch.mockResolvedValue(makeOkResponse(blob, null));

    await downloadImage(baseOpts);

    expect(anchorEl.download).toBe('photo.png');
  });

  it('returns early without fetching when authToken is missing', async () => {
    await downloadImage({ ...baseOpts, authToken: '' });
    await downloadImage({ ...baseOpts, authToken: null });
    await downloadImage({ ...baseOpts, authToken: undefined });

    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('returns early without fetching when runtimeCoreUrl is missing', async () => {
    await downloadImage({ ...baseOpts, runtimeCoreUrl: '' });
    await downloadImage({ ...baseOpts, runtimeCoreUrl: null });
    await downloadImage({ ...baseOpts, runtimeCoreUrl: undefined });

    expect(window.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 9-10. Error handling
// ---------------------------------------------------------------------------

describe('downloadImage – error handling', () => {
  it('calls onError callback when fetch fails', async () => {
    const onError = jest.fn();
    window.fetch.mockRejectedValue(new Error('network down'));

    await downloadImage({
      imageUrl: 'https://cdn.example.com/pic.png',
      recordId: null,
      onError,
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onError.mock.calls[0][0].message).toBe('network down');
  });

  it('calls onError when CDN response is not ok', async () => {
    const onError = jest.fn();
    window.fetch.mockResolvedValue(makeFailResponse(404));

    await downloadImage({
      imageUrl: 'https://cdn.example.com/pic.png',
      recordId: null,
      onError,
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onError.mock.calls[0][0].message).toContain('404');
  });

  it('calls onError when API response is not ok', async () => {
    const onError = jest.fn();
    window.fetch.mockResolvedValue(makeFailResponse(403));

    await downloadImage({
      imageUrl: 'https://cdn.example.com/uploads/photo.png',
      columnName: 'Avatar',
      recordId: 42,
      authToken: 'tok',
      runtimeCoreUrl: 'https://api.example.com',
      onError,
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(onError.mock.calls[0][0].message).toContain('403');
  });

  it('falls back to console.error when onError is not provided', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    window.fetch.mockRejectedValue(new Error('boom'));

    await downloadImage({
      imageUrl: 'https://cdn.example.com/pic.png',
      recordId: null,
    });

    expect(spy).toHaveBeenCalledWith('Image download error:', expect.any(Error));
    spy.mockRestore();
  });
});
