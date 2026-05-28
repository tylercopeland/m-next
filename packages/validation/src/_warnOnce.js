// Shared one-time deprecation warner — fires once per key.
// Used by Validation and ValidationMessage so the two components share a single
// deduplication set rather than each carrying their own.

const seen = new Set();

const warnOnce = (key, message) => {
  if (seen.has(key) || typeof console === 'undefined') return;
  seen.add(key);
  // eslint-disable-next-line no-console
  console.warn(message);
};

export default warnOnce;
