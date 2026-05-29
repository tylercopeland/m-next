import React, { useState } from 'react';
import SearchInput from '../src';

export default {
  title: 'm-next/Components/Form/SearchInput',
  component: SearchInput,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 360 }}>{children}</div>
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

const ControlledSearch = ({ initialValue = '', ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return <SearchInput value={value} onChange={setValue} suppressAutoFocus {...rest} />;
};

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Basic = () => (
  <Section title="Basic search input">
    <Row label="default"><ControlledSearch placeholder="Search…" /></Row>
    <Row label="with placeholder"><ControlledSearch placeholder="Search invoices…" /></Row>
    <Row label="with label"><ControlledSearch label="Search" placeholder="Search invoices…" /></Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledSearch placeholder="Search…" /></Row>
    <Row label="disabled"><ControlledSearch placeholder="Search…" disabled /></Row>
    <Row label="readOnly"><ControlledSearch initialValue="locked search term" readOnly /></Row>
    <Row label="with value"><ControlledSearch initialValue="open invoices" /></Row>
  </Section>
);

export const ClearButton = () => (
  <Section title="showClearButton">
    <Row label="showClearButton"><ControlledSearch placeholder="Type to see ×" showClearButton /></Row>
    <Row label="initial value">
      <ControlledSearch initialValue="invoices > 30 days" showClearButton onClear={() => console.log('cleared')} />
    </Row>
  </Section>
);

export const IconOptions = () => (
  <Section title="leftIcon">
    <Row label="default (search)"><ControlledSearch placeholder="Default icon" /></Row>
    <Row label="custom leftIcon"><ControlledSearch leftIcon={<StarIcon />} placeholder="Custom icon" /></Row>
    <Row label="leftIcon={null}"><ControlledSearch leftIcon={null} placeholder="No leading icon" /></Row>
  </Section>
);

export const RealWorld = () => {
  const [query, setQuery] = useState('');
  const items = ['Invoice #INV-2024-0041', 'Invoice #INV-2024-0042', 'Estimate #EST-2024-0007', 'Customer: Acme Co', 'Customer: Globex'];
  const filtered = items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));
  return (
    <Section title="Filtering a list">
      <div style={{ maxWidth: 400 }}>
        <SearchInput placeholder="Filter…" showClearButton onChange={setQuery} suppressAutoFocus />
        <ul style={{ marginTop: 12, paddingLeft: 20, color: '#374151' }}>
          {filtered.map((i) => (<li key={i}>{i}</li>))}
          {filtered.length === 0 && <li style={{ color: '#9ca3af', listStyle: 'none', marginLeft: -20 }}>No matches</li>}
        </ul>
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label='caption'><ControlledSearch id="legacy-1" caption="Search (legacy caption)" placeholder="Caption -> label" /></Row>
    <Row label='prefixIcon (str)'><ControlledSearch id="legacy-2" prefixIcon="search" placeholder="Legacy prefixIcon" /></Row>
    <Row label='ariaDescribedby'><ControlledSearch id="legacy-3" ariaDescribedby="legacy-hint-id" placeholder="Legacy ARIA prop" /></Row>
    <Row label='readonly (lowercase)'><ControlledSearch id="legacy-4" readonly initialValue="locked legacy" /></Row>
    <Row label='isV4Design + isMobile (ignored)'><ControlledSearch id="legacy-5" isV4Design isMobile placeholder="Ghost props ignored" /></Row>
  </Section>
);
