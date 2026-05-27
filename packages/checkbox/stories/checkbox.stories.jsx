import React, { useState } from 'react';
import Checkbox, { CheckboxGroup } from '../src';

export default {
  title: 'm-next/Components/Checkbox',
  component: Checkbox,
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

const ControlledCheckbox = ({ initialChecked = false, ...rest }) => {
  const [checked, setChecked] = useState(initialChecked);
  return <Checkbox checked={checked} onChange={setChecked} {...rest} />;
};

export const Basic = () => (
  <Section title="Basic checkbox">
    <Row label="unchecked"><ControlledCheckbox label="Subscribe to updates" /></Row>
    <Row label="checked"><ControlledCheckbox label="I agree to the terms" initialChecked /></Row>
    <Row label="halfChecked"><ControlledCheckbox label="Select all" halfChecked /></Row>
    <Row label="no label">
      <ControlledCheckbox aria-label="Unlabeled checkbox" />
    </Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledCheckbox label="Default" /></Row>
    <Row label="checked"><ControlledCheckbox label="Checked" initialChecked /></Row>
    <Row label="disabled"><ControlledCheckbox label="Disabled" disabled /></Row>
    <Row label="disabled + checked"><ControlledCheckbox label="Disabled checked" disabled initialChecked /></Row>
    <Row label="indeterminate"><ControlledCheckbox label="Mixed selection" halfChecked /></Row>
    <Row label="rounded"><ControlledCheckbox label="Rounded corners" rounded initialChecked /></Row>
    <Row label="bold label"><ControlledCheckbox label="Bold label" bold initialChecked /></Row>
  </Section>
);

export const Alignment = () => (
  <Section title="align">
    <Row label="left (default)"><ControlledCheckbox label="Box on the left" align="left" /></Row>
    <Row label="right">
      <div style={{ width: 240 }}>
        <ControlledCheckbox label="Box on the right" align="right" />
      </div>
    </Row>
    <Row label="center">
      <div style={{ width: 240 }}>
        <ControlledCheckbox label="Centered" align="center" />
      </div>
    </Row>
  </Section>
);

export const Group = () => {
  const [state, setState] = useState({ a: true, b: false, c: false });
  const items = ['a', 'b', 'c'].map((key) => ({
    id: `group-${key}`,
    label: `Option ${key.toUpperCase()}`,
    checked: state[key],
    onChange: (next) => setState((s) => ({ ...s, [key]: next })),
  }));
  return (
    <Section title="CheckboxGroup">
      <Row label="vertical">
        <CheckboxGroup align="vertical" items={items} />
      </Row>
      <Row label="horizontal">
        <CheckboxGroup
          align="horizontal"
          items={items.map((it, i) => ({ ...it, id: `group-h-${i}` }))}
        />
      </Row>
    </Section>
  );
};

export const RealWorldForm = () => {
  const [form, setForm] = useState({ tos: false, newsletter: true, beta: false });
  const update = (key) => (next) => setForm((f) => ({ ...f, [key]: next }));
  return (
    <Section title="A realistic form">
      <div style={{ maxWidth: 400 }}>
        <Checkbox label="I agree to the Terms of Service" checked={form.tos} onChange={update('tos')} />
        <Checkbox label="Sign me up for the monthly newsletter" checked={form.newsletter} onChange={update('newsletter')} />
        <Checkbox label="Enroll in the beta program" checked={form.beta} onChange={update('beta')} />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="hideCaption">
      <ControlledCheckbox id="legacy-1" label="Visually hidden" hideCaption initialChecked />
    </Row>
    <Row label="controlId">
      <ControlledCheckbox id="legacy-2" controlId="custom-label-id" label="Custom label id" />
    </Row>
    <Row label="forwardRef prop">
      <ControlledCheckbox
        id="legacy-3"
        label="Imperative handle still works"
        forwardRef={{ current: null }}
      />
    </Row>
    <Row label="isMobile (ignored)">
      <ControlledCheckbox id="legacy-4" label="isMobile is a no-op" isMobile />
    </Row>
    <Row label="legacyClasses (ignored)">
      <ControlledCheckbox id="legacy-5" label="legacyClasses is a no-op" legacyClasses="mi-checkbox-primary" />
    </Row>
  </Section>
);
