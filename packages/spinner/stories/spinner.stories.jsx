import React from 'react';
import { Spinner } from '../src';

export default {
  title: 'm-next/Components/Spinner',
  component: Spinner,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 120, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>{children}</div>
  </div>
);

export const Sizes = () => (
  <div>
    <Row label='size="sm"'>
      <Spinner size="sm" />
    </Row>
    <Row label='size="md"'>
      <Spinner size="md" />
    </Row>
    <Row label='size="lg"'>
      <Spinner size="lg" />
    </Row>
    <Row label='size={48}'>
      <Spinner size={48} />
    </Row>
  </div>
);

export const Colors = () => (
  <div>
    <Row label="default">
      <Spinner />
    </Row>
    <Row label='#137E58 (green)'>
      <Spinner color="#137E58" />
    </Row>
    <Row label='#8A1F1F (red)'>
      <Spinner color="#8A1F1F" />
    </Row>
    <Row label='#6b7280 (grey)'>
      <Spinner color="#6b7280" />
    </Row>
  </div>
);

export const InsideButton = () => (
  <div style={{ display: 'flex', gap: 16, fontFamily }}>
    <button
      type="button"
      disabled
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: '#0D71C8',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        fontFamily,
        cursor: 'not-allowed',
        opacity: 0.85,
      }}
    >
      <Spinner size="sm" color="#fff" label="Saving" />
      <span>Saving…</span>
    </button>
    <button
      type="button"
      disabled
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'transparent',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: 4,
        fontFamily,
        cursor: 'not-allowed',
      }}
    >
      <Spinner size="sm" color="#6b7280" />
      <span>Loading…</span>
    </button>
  </div>
);

export const InlineWithText = () => (
  <div style={{ fontFamily, color: '#374151' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Spinner size="sm" />
      <span>Fetching invoices…</span>
    </div>
  </div>
);

export const Block = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: 48,
      background: '#f9fafb',
      borderRadius: 8,
      fontFamily,
      color: '#6b7280',
    }}
  >
    <Spinner size="lg" />
    <span>Loading workspace…</span>
  </div>
);

export const CustomThickness = () => (
  <div>
    <Row label="thickness=1">
      <Spinner size={32} thickness={1} />
    </Row>
    <Row label="thickness=2.5 (default)">
      <Spinner size={32} thickness={2.5} />
    </Row>
    <Row label="thickness=4">
      <Spinner size={32} thickness={4} />
    </Row>
  </div>
);
