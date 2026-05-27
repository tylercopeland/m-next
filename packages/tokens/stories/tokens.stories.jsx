import React from 'react';
import {
  spacing,
  radius,
  shadow,
  zIndex,
  transition,
  lineHeight,
  fontWeight,
} from '../src';

export default {
  title: 'm-next/Foundation/Tokens',
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, value, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', fontFamily }}>
    <div style={{ width: 80, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ width: 80, fontFamily: 'monospace', fontSize: 13, color: '#111827' }}>{value}</div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 40, fontFamily }}>
    <h3 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#374151', marginBottom: 12 }}>
      {title}
    </h3>
    <div>{children}</div>
  </section>
);

export const SpacingScale = () => (
  <Section title="Spacing">
    {Object.entries(spacing).map(([key, val]) => (
      <Row key={key} label={key} value={`${val}px`}>
        <div style={{ height: 12, width: val || 1, background: '#3b82f6', borderRadius: 2 }} />
      </Row>
    ))}
  </Section>
);

export const RadiusScale = () => (
  <Section title="Radius">
    {Object.entries(radius).map(([key, val]) => (
      <Row key={key} label={key} value={`${val}px`}>
        <div
          style={{
            height: 48,
            width: 80,
            background: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: val,
          }}
        />
      </Row>
    ))}
  </Section>
);

export const ShadowScale = () => (
  <Section title="Shadow">
    {Object.entries(shadow).map(([key, val]) => (
      <Row key={key} label={key} value={val === 'none' ? 'none' : 'see CSS'}>
        <div
          style={{
            height: 56,
            width: 120,
            background: '#fff',
            borderRadius: 8,
            boxShadow: val,
          }}
        />
      </Row>
    ))}
  </Section>
);

export const ZIndexScale = () => (
  <Section title="Z-Index">
    {Object.entries(zIndex).map(([key, val]) => (
      <Row key={key} label={key} value={String(val)}>
        <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>
          {key === 'base' && 'page content'}
          {key === 'dropdown' && 'menus, select popovers'}
          {key === 'sticky' && 'sticky headers, toolbars'}
          {key === 'modal' && 'dialogs, sheets'}
          {key === 'popover' && 'tooltips on top of modals'}
          {key === 'toast' && 'highest — toast/snackbar notifications'}
        </div>
      </Row>
    ))}
  </Section>
);

export const TransitionScale = () => (
  <Section title="Transition">
    {Object.entries(transition).map(([key, val]) => (
      <Row key={key} label={key} value={val}>
        <div
          style={{
            height: 24,
            width: 'fit-content',
            padding: '4px 10px',
            background: '#ede9fe',
            color: '#5b21b6',
            borderRadius: 4,
            fontSize: 13,
            fontFamily: 'monospace',
            transition: `transform ${val} ease`,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(120px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          hover me ({val})
        </div>
      </Row>
    ))}
  </Section>
);

export const LineHeightScale = () => (
  <Section title="Line Height">
    {Object.entries(lineHeight).map(([key, val]) => (
      <Row key={key} label={key} value={String(val)}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: val,
            maxWidth: 360,
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: 4,
          }}
        >
          The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
        </p>
      </Row>
    ))}
  </Section>
);

export const FontWeightScale = () => (
  <Section title="Font Weight">
    {Object.entries(fontWeight).map(([key, val]) => (
      <Row key={key} label={key} value={String(val)}>
        <span style={{ fontSize: 16, fontWeight: val }}>
          The quick brown fox
        </span>
      </Row>
    ))}
  </Section>
);

export const AllScales = () => (
  <div>
    <SpacingScale />
    <RadiusScale />
    <ShadowScale />
    <ZIndexScale />
    <TransitionScale />
    <LineHeightScale />
    <FontWeightScale />
  </div>
);
