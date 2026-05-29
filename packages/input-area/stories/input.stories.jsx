import React, { useState, useRef } from 'react';
import { Textarea } from '../src';

export default {
  title: 'm-next/Components/Form/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
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

const ControlledTextarea = ({ initialValue = '', ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return <Textarea value={value} onChange={(e) => setValue(e.target.value)} {...rest} />;
};

export const Basic = () => (
  <Section title="Basic textarea">
    <Row label="default"><ControlledTextarea label="Notes" placeholder="Add a note…" /></Row>
    <Row label="rows={6}"><ControlledTextarea label="Description" placeholder="Long description…" rows={6} /></Row>
    <Row label="with value">
      <ControlledTextarea
        label="Bio"
        initialValue="Method CRM is the #1 QuickBooks-integrated CRM."
      />
    </Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledTextarea label="Notes" /></Row>
    <Row label="required"><ControlledTextarea label="Notes" required /></Row>
    <Row label="disabled"><ControlledTextarea label="Notes" disabled initialValue="Locked value." /></Row>
    <Row label="readOnly"><ControlledTextarea label="Account note" readOnly initialValue="Read-only contents." /></Row>
    <Row label="errorMessage">
      <ControlledTextarea
        label="Description"
        errorMessage="Description must be at least 10 characters"
        initialValue="too short"
      />
    </Row>
  </Section>
);

export const Sizing = () => (
  <Section title="Sizing and resize">
    <Row label="autoGrow"><ControlledTextarea label="Auto-grow" autoGrow placeholder="Type a lot…" maxHeight={300} /></Row>
    <Row label="disableResize"><ControlledTextarea label="Fixed size" disableResize rows={4} /></Row>
    <Row label='resize="vertical"'><ControlledTextarea label="Vertical only" resize="vertical" rows={4} /></Row>
    <Row label="initialHeight=100"><ControlledTextarea label="Starts taller" initialHeight={100} /></Row>
  </Section>
);

export const LabelOptions = () => (
  <Section title="Labels">
    <Row label="hideLabel"><ControlledTextarea label="Notes" hideLabel placeholder="No visible label" /></Row>
    <Row label="aria-label only"><ControlledTextarea aria-label="Comments" placeholder="ARIA only" /></Row>
  </Section>
);

export const ImperativeRef = () => {
  const ref = useRef();
  return (
    <Section title="Imperative ref handle">
      <Row label="focus()">
        <div>
          <Textarea ref={ref} label="Comments" placeholder="Click the button to focus me" />
          <button
            type="button"
            onClick={() => ref.current?.focus()}
            style={{ marginTop: 8, padding: '6px 12px', fontFamily }}
          >
            Focus textarea
          </button>
        </div>
      </Row>
    </Section>
  );
};

export const RealWorldForm = () => {
  const [form, setForm] = useState({ summary: '', notes: '' });
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Section title="A realistic form">
      <div style={{ maxWidth: 500 }}>
        <Textarea label="Summary" value={form.summary} onChange={update('summary')} rows={2} required />
        <Textarea label="Detailed notes" value={form.notes} onChange={update('notes')} rows={6} autoGrow />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="validationMessage">
      <ControlledTextarea id="legacy-1" label="Old error API" validationMessage="Old API still renders" initialValue="bad" />
    </Row>
    <Row label="hideCaption">
      <ControlledTextarea id="legacy-2" label="Hidden caption" hideCaption placeholder="No visible label" />
    </Row>
    <Row label="ariaDescribedby">
      <ControlledTextarea id="legacy-3" label="ARIA legacy" ariaDescribedby="legacy-hint-id" placeholder="Legacy ARIA prop" />
    </Row>
    <Row label="ariaLabel">
      <ControlledTextarea id="legacy-4" ariaLabel="Legacy aria label" placeholder="No visible label" hideLabel />
    </Row>
    <Row label="readonly (lowercase)">
      <ControlledTextarea id="legacy-5" label="Legacy readonly" readonly initialValue="locked" />
    </Row>
    <Row label="forwardRef prop">
      <ControlledTextarea id="legacy-6" label="Legacy forwardRef" forwardRef={{ current: null }} placeholder="Soft-shimmed" />
    </Row>
  </Section>
);
