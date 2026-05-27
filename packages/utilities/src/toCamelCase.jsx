/**
 * Converts object keys to camelCase recursively
 * @param {Object|Array|null|undefined} source - Input to convert
 * @returns {Object|Array|null|undefined} Converted output
 */
function toCamelCase(source) {
  if (source == null) {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map((item) => (typeof item === 'object' ? toCamelCase(item) : item));
  }

  if (typeof source !== 'object') {
    return source;
  }

  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      value != null && (typeof value === 'object' || Array.isArray(value)) ? toCamelCase(value) : value,
    ]),
  );
}

export default toCamelCase;
