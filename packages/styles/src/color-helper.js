/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */

// Convert back to RGB
function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  if (s === 0) {
    r = l; // achromatic
    g = l;
    b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert back to hex
const toHex = (n) => {
  const hex = n.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};
/**
 * Darkens a hex color by reducing its lightness
 * @param {string} hex - The hex color code (e.g., '#0D71C8')
 * @param {number} amount - Amount to darken (0-1, default 0.3)
 * @returns {string} The darkened hex color
 */
export function darkenColor(hex, amount = 0.3) {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(cleanHex.substr(0, 2), 16);
  const g = parseInt(cleanHex.substr(2, 2), 16);
  const b = parseInt(cleanHex.substr(4, 2), 16);

  // Convert to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h;
  let s;
  let l;

  // Calculate lightness
  l = (max + min) / 2;

  if (diff === 0) {
    h = 0; // achromatic
    s = 0; // achromatic
  } else {
    // Calculate saturation
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    // Calculate hue
    // eslint-disable-next-line default-case
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / diff + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / diff + 4;
        break;
    }
    h /= 6;
  }

  // Darken by reducing lightness
  l = Math.max(0, l - amount);

  const [newR, newG, newB] = hslToRgb(h, s, l);

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
