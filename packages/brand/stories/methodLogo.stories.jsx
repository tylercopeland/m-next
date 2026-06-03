import React from 'react';
import MethodLogo from '../src';

export default {
  title: 'm-next/Components/Display/MethodLogo',
  component: MethodLogo,
  parameters: { layout: 'padded' },
};

const Frame = ({ background = '#022266', children, label }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
    <div
      style={{
        background,
        padding: 24,
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
    {label && <small style={{ color: '#6B7280', fontFamily: 'monospace' }}>{label}</small>}
  </div>
);

export const Default = () => (
  <Frame>
    <MethodLogo />
  </Frame>
);

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Frame label="height={16}">
      <MethodLogo height={16} />
    </Frame>
    <Frame label="height={24} (default)">
      <MethodLogo height={24} />
    </Frame>
    <Frame label="height={40}">
      <MethodLogo height={40} />
    </Frame>
    <Frame label="height={64}">
      <MethodLogo height={64} />
    </Frame>
  </div>
);

export const InSidebarHeader = () => (
  <div
    style={{
      background: '#022266',
      width: 240,
      padding: '12px 16px',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <MethodLogo height={20} />
    <button
      type='button'
      aria-label='Toggle sidebar'
      style={{
        marginLeft: 'auto',
        background: 'transparent',
        border: 'none',
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      ☰
    </button>
  </div>
);

export const CustomSrc = () => (
  <div>
    <p style={{ color: '#374151', marginBottom: 12 }}>
      Pass <code>src</code> to swap in a different variant — once Method
      publishes navy-on-white or icon-only assets, point to them here.
    </p>
    <Frame label='default src (white wordmark)'>
      <MethodLogo height={32} />
    </Frame>
  </div>
);

export const Decorative = () => (
  <div>
    <p style={{ color: '#374151', marginBottom: 12 }}>
      Pass <code>decorative</code> when the surrounding text already conveys
      "Method" — sets <code>aria-hidden</code> so screen readers skip it.
    </p>
    <Frame>
      <MethodLogo height={24} decorative />
    </Frame>
  </div>
);
