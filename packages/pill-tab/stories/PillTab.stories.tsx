import React, { useState } from 'react';
import PillTab, { SegmentedControl } from '../src';
import { PillTabOption } from '../src/types';

export default {
  title: 'm-next/Components/Form/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
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

const basicOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build' },
];

const tripleOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build' },
  { value: 'deploy', label: 'Deploy' },
];

const disabledOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build', disabled: true },
  { value: 'deploy', label: 'Deploy' },
];

const linkOptions: PillTabOption[] = [
  { value: 'home', label: 'Home', href: '#home' },
  { value: 'about', label: 'About', href: '#about' },
  { value: 'contact', label: 'Contact', href: '#contact' },
];

export const Basic = () => {
  const [value, setValue] = useState('plan');
  return (
    <Section title="Two options">
      <Row label="default">
        <SegmentedControl
          options={basicOptions}
          value={value}
          onChange={(v) => setValue(v)}
          aria-label="Workspace view"
        />
      </Row>
    </Section>
  );
};

export const ThreeOptions = () => {
  const [value, setValue] = useState('plan');
  return (
    <Section title="Three options">
      <Row label="size=md (default)">
        <SegmentedControl
          options={tripleOptions}
          value={value}
          onChange={(v) => setValue(v)}
          aria-label="Workflow stage"
        />
      </Row>
    </Section>
  );
};

export const Sizes = () => {
  const [a, setA] = useState('plan');
  const [b, setB] = useState('plan');
  return (
    <Section title="Sizes">
      <Row label="size=sm">
        <SegmentedControl
          options={tripleOptions}
          value={a}
          onChange={setA}
          size="sm"
          aria-label="Small segmented control"
        />
      </Row>
      <Row label="size=md (default)">
        <SegmentedControl
          options={tripleOptions}
          value={b}
          onChange={setB}
          size="md"
          aria-label="Medium segmented control"
        />
      </Row>
    </Section>
  );
};

export const WithDisabled = () => {
  const [value, setValue] = useState('plan');
  return (
    <Section title="With a disabled option">
      <Row label="middle disabled">
        <SegmentedControl
          options={disabledOptions}
          value={value}
          onChange={(v) => setValue(v)}
          aria-label="Workflow stage"
        />
      </Row>
    </Section>
  );
};

export const AsLinks = () => {
  const [value, setValue] = useState('home');
  return (
    <Section title="Anchor-based navigation">
      <Row label="href on each option">
        <SegmentedControl
          options={linkOptions}
          value={value}
          onChange={(v) => setValue(v)}
          aria-label="Site sections"
        />
      </Row>
    </Section>
  );
};

export const MixedLinksAndButtons = () => {
  const externalLinkOptions: PillTabOption[] = [
    { value: 'docs', label: 'Docs', href: 'https://example.com/docs', target: '_blank', rel: 'noopener noreferrer' },
    { value: 'api', label: 'API', href: 'https://example.com/api', target: '_blank', rel: 'noopener noreferrer' },
    { value: 'local', label: 'Local' },
  ];
  const [value, setValue] = useState('docs');
  return (
    <Section title="Mix of links and buttons">
      <Row label="2 links + 1 button">
        <SegmentedControl
          options={externalLinkOptions}
          value={value}
          onChange={(v) => setValue(v)}
          aria-label="Resources"
        />
      </Row>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const legacyRef = React.useRef<HTMLDivElement | null>(null);
  const [a, setA] = useState('plan');
  const [b, setB] = useState('plan');
  const [c, setC] = useState('plan');
  const [d, setD] = useState('plan');
  return (
    <Section title="Backwards-compat shim (each fires one console.warn at first use)">
      <Row label="default export `PillTab`">
        {/* PillTab is the legacy default export — identical to SegmentedControl. */}
        <PillTab
          options={basicOptions}
          value={a}
          onChange={(v) => setA(v as string)}
          aria-label="Legacy default export"
        />
      </Row>
      <Row label="items (was: options)">
        {/* @ts-expect-error - legacy prop intentionally exercised */}
        <SegmentedControl
          items={basicOptions}
          value={b}
          onChange={(v: string) => setB(v)}
          aria-label="Legacy items prop"
        />
      </Row>
      <Row label="selected (was: value)">
        {/* @ts-expect-error - legacy prop intentionally exercised */}
        <SegmentedControl
          options={basicOptions}
          selected={c}
          onChange={(v: string) => setC(v)}
          aria-label="Legacy selected prop"
        />
      </Row>
      <Row label='size="narrow" (was)'>
        {/* @ts-expect-error - legacy size intentionally exercised */}
        <SegmentedControl
          options={tripleOptions}
          value={d}
          onChange={(v: string) => setD(v)}
          size="narrow"
          aria-label="Legacy narrow size"
        />
      </Row>
      <Row label="forwardRef prop (was)">
        {/* @ts-expect-error - legacy forwardRef intentionally exercised */}
        <SegmentedControl
          options={basicOptions}
          value="plan"
          onChange={() => {}}
          forwardRef={legacyRef}
          aria-label="Legacy forwardRef prop"
        />
      </Row>
      <Row label="isV4Design (ignored)">
        {/* @ts-expect-error - legacy ghost intentionally exercised */}
        <SegmentedControl
          options={basicOptions}
          value="plan"
          onChange={() => {}}
          isV4Design
          aria-label="isV4Design ghost"
        />
      </Row>
      <Row label="isMobile (ignored)">
        {/* @ts-expect-error - legacy ghost intentionally exercised */}
        <SegmentedControl
          options={basicOptions}
          value="plan"
          onChange={() => {}}
          isMobile
          aria-label="isMobile ghost"
        />
      </Row>
      <Row label="legacyClass (ignored)">
        {/* @ts-expect-error - legacy ghost intentionally exercised */}
        <SegmentedControl
          options={basicOptions}
          value="plan"
          onChange={() => {}}
          legacyClass="old-class"
          aria-label="legacyClass ghost"
        />
      </Row>
    </Section>
  );
};
