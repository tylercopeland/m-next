import spacing from './spacing';
import radius from './radius';
import shadow from './shadow';
import zIndex from './z-index';
import transition from './transition';
import lineHeight from './line-height';
import fontWeight from './font-weight';

const toPx = (val) => (typeof val === 'number' ? `${val}px` : val);

const buildLines = () => {
  const lines = [];
  Object.entries(spacing).forEach(([k, v]) => lines.push(`--space-${k}: ${toPx(v)};`));
  Object.entries(radius).forEach(([k, v]) => lines.push(`--radius-${k}: ${toPx(v)};`));
  Object.entries(shadow).forEach(([k, v]) => lines.push(`--shadow-${k}: ${v};`));
  Object.entries(zIndex).forEach(([k, v]) => lines.push(`--z-${k}: ${v};`));
  Object.entries(transition).forEach(([k, v]) => lines.push(`--transition-${k}: ${v};`));
  Object.entries(lineHeight).forEach(([k, v]) => lines.push(`--line-height-${k}: ${v};`));
  Object.entries(fontWeight).forEach(([k, v]) => lines.push(`--font-weight-${k}: ${v};`));
  return lines;
};

const cssVariables = `:root {\n  ${buildLines().join('\n  ')}\n}`;

export default cssVariables;
