import React from 'react';
import { colors, colorFamilies, colorShades } from '../src';

export default {
  title: 'm-next/Foundation/Colors',
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

// Naive luminance check so the label sits readable on top of the swatch.
const isLight = (hex) => {
  const h = hex.replace('#', '');
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
};

const Swatch = ({ hex, label, sub }) => (
  <div
    style={{
      background: hex,
      color: isLight(hex) ? '#111827' : '#ffffff',
      borderRadius: 8,
      padding: '12px 14px',
      minWidth: 132,
      border: '1px solid rgba(0,0,0,0.06)',
      fontFamily,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
    <span style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.85 }}>{hex}</span>
    {sub && <span style={{ fontSize: 11, opacity: 0.75 }}>{sub}</span>}
  </div>
);

const FamilyRow = ({ family, shadeMap }) => (
  <div style={{ marginBottom: 24, fontFamily }}>
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#374151',
        marginBottom: 8,
      }}
    >
      {family}
    </h3>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {colorShades.map((shade) => {
        const hex = shadeMap[shade];
        if (!hex) return null;
        return <Swatch key={shade} hex={hex} label={shade} sub={`colors.${family}.${shade}`} />;
      })}
    </div>
  </div>
);

export const FullPalette = () => (
  <div>
    <p style={{ fontFamily, color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 720 }}>
      Method's 9 color families, each with up to 7 shades. The <code>base</code> shade is the
      canonical color (referenced as <code>colors.&lt;family&gt;.base</code>); the others are darker or
      lighter variants. Use <code>base</code> for fills and accents; <code>darker</code> /{' '}
      <code>darkest</code> for text on light surfaces; <code>lighter</code> / <code>lightest</code>{' '}
      for subtle backgrounds.
    </p>
    {colorFamilies.map((family) => (
      <FamilyRow key={family} family={family} shadeMap={colors[family]} />
    ))}
  </div>
);

export const Neutrals = () => (
  <div style={{ fontFamily }}>
    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 720 }}>
      Black, white, and concrete (Method's off-white) sit outside the family/shade structure. Use
      <code> concrete</code> for app-level backgrounds.
    </p>
    <div style={{ display: 'flex', gap: 8 }}>
      <Swatch hex={colors.black} label="black" sub="colors.black" />
      <Swatch hex={colors.white} label="white" sub="colors.white" />
      <Swatch hex={colors.concrete} label="concrete" sub="colors.concrete" />
    </div>
  </div>
);

export const BrandMethod = () => (
  <div style={{ fontFamily }}>
    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 720 }}>
      The Method brand mark — a deep navy with two muted lights. Use sparingly: app shell,
      identity, marketing surfaces. Not for content or status.
    </p>
    <div style={{ display: 'flex', gap: 8 }}>
      <Swatch hex={colors.method.base} label="method" sub="colors.method.base" />
      <Swatch hex={colors.method.light} label="method light" sub="colors.method.light" />
      <Swatch hex={colors.method.lightest} label="method lightest" sub="colors.method.lightest" />
    </div>
  </div>
);

export const Base = () => (
  <div style={{ fontFamily }}>
    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 720 }}>
      Just the canonical <code>base</code> shade for each family — the colors most consumer code
      reaches for.
    </p>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {colorFamilies.map((family) => (
        <Swatch
          key={family}
          hex={colors[family].base}
          label={family}
          sub={`colors.${family}.base`}
        />
      ))}
    </div>
  </div>
);

export const SemanticUses = () => (
  <div style={{ fontFamily }}>
    <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, maxWidth: 720 }}>
      Suggested semantic mapping for status/intent. These are conventions, not enforced — the
      named theme objects in <code>@m-next/styles</code> use the same mapping for theme.informative
      / theme.positive / etc.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
      <Swatch hex={colors.blue.base} label="informative" sub="colors.blue.base" />
      <Swatch hex={colors.green.base} label="positive / success" sub="colors.green.base" />
      <Swatch hex={colors.yellow.dark} label="warning" sub="colors.yellow.dark" />
      <Swatch hex={colors.red.base} label="negative / error" sub="colors.red.base" />
      <Swatch hex={colors.grey.dark} label="text primary" sub="colors.grey.dark" />
      <Swatch hex={colors.grey.base} label="text secondary" sub="colors.grey.base" />
      <Swatch hex={colors.grey.light} label="border / divider" sub="colors.grey.light" />
      <Swatch hex={colors.concrete} label="page background" sub="colors.concrete" />
    </div>
  </div>
);
