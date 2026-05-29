import React from 'react';
import { Skeleton } from '../src';

export default {
  title: 'm-next/Components/Feedback/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 160, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 480 }}>{children}</div>
  </div>
);

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 32, fontFamily }}>
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
      {title}
    </h3>
    {children}
  </section>
);

export const Basic = () => (
  <Section title="Basic skeletons">
    <Row label="default"><Skeleton width={240} /></Row>
    <Row label="height={32}"><Skeleton width={240} height={32} /></Row>
    <Row label='width="80%"'><Skeleton width="80%" /></Row>
    <Row label="full-width"><Skeleton /></Row>
  </Section>
);

export const Variants = () => (
  <Section title="Variants">
    <Row label='variant="rect"'><Skeleton width={240} height={48} variant="rect" /></Row>
    <Row label='variant="text"'><Skeleton width={240} variant="text" /></Row>
    <Row label='variant="circle"'>
      <Skeleton width={64} height={64} variant="circle" />
    </Row>
  </Section>
);

export const Count = () => (
  <Section title="Multiple skeletons via `count`">
    <Row label="count={3}"><Skeleton count={3} /></Row>
    <Row label="count={5}, height={12}"><Skeleton count={5} height={12} /></Row>
  </Section>
);

export const CardPlaceholder = () => (
  <Section title="Card placeholder composition">
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        maxWidth: 480,
      }}
    >
      <Skeleton width={56} height={56} variant="circle" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height={16} />
        <div style={{ height: 8 }} />
        <Skeleton count={2} />
      </div>
    </div>
  </Section>
);

export const ListRows = () => (
  <Section title="List of placeholder rows">
    <div style={{ maxWidth: 480 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          <Skeleton width={32} height={32} variant="circle" />
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height={14} />
            <Skeleton width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  </Section>
);

export const CustomColors = () => (
  <Section title="Custom shimmer colors">
    <Row label="default tokens"><Skeleton width={240} height={24} /></Row>
    <Row label="blue tint">
      <Skeleton width={240} height={24} baseColor="#E5F7FF" highlightColor="#FFFFFF" />
    </Row>
    <Row label="dark on dark">
      <div style={{ background: '#0F1B31', padding: 12 }}>
        <Skeleton width={240} height={24} baseColor="#2A394A" highlightColor="#545F67" />
      </div>
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="circle (boolean)">
      {/* legacy: circle as a boolean rather than variant="circle" */}
      <Skeleton width={64} height={64} circle />
    </Row>
    <Row label="LoadingSkeleton default">
      {/* legacy: importing the default works identically */}
      {/* eslint-disable-next-line global-require */}
      {React.createElement(require('../src').default, { width: 240, height: 24 })}
    </Row>
  </Section>
);
