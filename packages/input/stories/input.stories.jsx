import React, { useState } from 'react';
import Input from '../src';

export default {
  title: 'm-next/Components/Form/Input',
  component: Input,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 160, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
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

const ControlledInput = ({ initialValue = '', ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return <Input value={value} onChange={(e) => setValue(e.target.value)} {...rest} />;
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const Basic = () => (
  <Section title="Basic input">
    <Row label="text"><ControlledInput label="Name" placeholder="Jane Doe" /></Row>
    <Row label="email"><ControlledInput label="Email" type="email" placeholder="jane@example.com" /></Row>
    <Row label="number"><ControlledInput label="Quantity" type="number" placeholder="0" minValue={0} maxValue={100} /></Row>
    <Row label="password"><ControlledInput label="Password" type="password" autoComplete="current-password" /></Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledInput label="Account name" /></Row>
    <Row label="required"><ControlledInput label="Account name" required /></Row>
    <Row label="disabled"><ControlledInput label="Account name" disabled initialValue="Locked value" /></Row>
    <Row label="readOnly"><ControlledInput label="Account ID" readOnly initialValue="INV-2024-0042" /></Row>
    <Row label="errorMessage"><ControlledInput label="Email" type="email" errorMessage="Please enter a valid email address" initialValue="not-an-email" /></Row>
  </Section>
);

export const WithIcons = () => (
  <Section title="leftIcon / rightContent">
    <Row label="leftIcon"><ControlledInput label="Search" placeholder="Find invoices…" leftIcon={<SearchIcon />} /></Row>
    <Row label="leftIcon (mail)"><ControlledInput label="Email" type="email" leftIcon={<MailIcon />} placeholder="jane@example.com" /></Row>
    <Row label="rightContent (text)"><ControlledInput label="Email alias" rightContent="@method.me" placeholder="jane" /></Row>
    <Row label="rightContent (badge)">
      <ControlledInput
        label="Discount code"
        placeholder="Enter code…"
        rightContent={
          <span style={{ fontSize: 11, padding: '2px 6px', background: '#ECFDF5', color: '#137E58', borderRadius: 999, fontWeight: 600 }}>
            VALID
          </span>
        }
      />
    </Row>
  </Section>
);

export const ErrorStates = () => (
  <Section title="Error and validation messages">
    <Row label="errorMessage"><ControlledInput label="Email" errorMessage="That email is already in use" initialValue="taken@example.com" /></Row>
    <Row label="required + empty"><ControlledInput label="Required field" required errorMessage="This field is required" /></Row>
    <Row label="long error">
      <ControlledInput
        label="Invoice number"
        errorMessage="Invoice number must be alphanumeric and between 6 and 12 characters in length."
        initialValue="!!"
      />
    </Row>
  </Section>
);

export const LabelOptions = () => (
  <Section title="Labels">
    <Row label="hideLabel (a11y kept)"><ControlledInput label="Search" placeholder="Quick search…" hideLabel leftIcon={<SearchIcon />} /></Row>
    <Row label="no label, aria-label"><ControlledInput aria-label="Search invoices" placeholder="Search…" leftIcon={<SearchIcon />} /></Row>
  </Section>
);

export const RealWorldForm = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  return (
    <Section title="A realistic form">
      <div style={{ maxWidth: 400 }}>
        <Input label="Full name" value={form.name} onChange={update('name')} required />
        <Input label="Email" type="email" value={form.email} onChange={update('email')} required leftIcon={<MailIcon />} />
        <Input label="Company" value={form.company} onChange={update('company')} />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label='prefixIcon (str)'><ControlledInput id="legacy-1" label="Search" prefixIcon="search" placeholder="Legacy prefixIcon" /></Row>
    <Row label='suffixText'><ControlledInput id="legacy-2" label="Username" suffixText="@method.me" placeholder="Legacy suffix" /></Row>
    <Row label='validationMessage'><ControlledInput id="legacy-3" label="Legacy error" validationMessage="Old API still renders" initialValue="bad" /></Row>
    <Row label='hideCaption'><ControlledInput id="legacy-4" label="Hidden" hideCaption placeholder="No visible label" /></Row>
    <Row label='ariaDescribedby'><ControlledInput id="legacy-5" label="ARIA legacy" ariaDescribedby="legacy-hint-id" placeholder="Legacy ARIA prop" /></Row>
    <Row label='readonly (lowercase)'><ControlledInput id="legacy-6" label="Legacy readonly" readonly initialValue="locked" /></Row>
  </Section>
);
