// Shared one-time deprecation warner — fires once per key.
// Used by RadioButton + the three group composites in this package.
// Mirrors the inline implementation in RadioButton.jsx so multiple components
// share the same deduplication set rather than each carrying their own.

const seen = new Set();

const warnOnce = (key, message) => {
  if (seen.has(key) || typeof console === 'undefined') return;
  seen.add(key);
  // eslint-disable-next-line no-console
  console.warn(message);
};

export default warnOnce;
