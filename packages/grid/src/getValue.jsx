Object.byDotNotation = (object, key) => {
  let result = key.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  result = result.replace(/^\./, ''); // strip a leading dot
  const a = result.split('.');
  let output = object;
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (output !== null) {
      if (k in output) {
        output = output[k];
      } else {
        return;
      }
    }
  }
  return output;
};

export default function getValue(data, idx, key, prop) {
  let value = '';
  if (key !== null && data[idx]) {
    value = Object.byDotNotation(data[idx], prop ? `${key}.${prop}` : key);
    return value || '';
  }
  return value;
}
