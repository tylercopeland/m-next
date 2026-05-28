// One-time deprecation warner — fires once per key.
// Mirrors the pattern in @m-next/input and @m-next/toggle.

const seen = new Set<string>();

const warnOnce = (key: string, message: string): void => {
  if (seen.has(key) || typeof console === 'undefined') return;
  seen.add(key);
  // eslint-disable-next-line no-console
  console.warn(message);
};

export default warnOnce;
