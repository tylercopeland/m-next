import React, { useState } from 'react';
import Toggle from '../src';

export default {
  title: 'm-next/Components/Form/Toggle',
  component: Toggle,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
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

const ControlledToggle = ({ initialChecked = false, ...rest }) => {
  const [checked, setChecked] = useState(initialChecked);
  return <Toggle checked={checked} onChange={setChecked} {...rest} />;
};

export const Basic = () => (
  <Section title="Basic toggle">
    <Row label="default"><ControlledToggle label="Enable notifications" /></Row>
    <Row label="checked"><ControlledToggle label="Subscribe to updates" initialChecked /></Row>
    <Row label="no label"><ControlledToggle /></Row>
    <Row label="long label"><ControlledToggle label="Send me a weekly digest of activity in my workspace" /></Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledToggle label="Default" /></Row>
    <Row label="checked"><ControlledToggle label="Checked" initialChecked /></Row>
    <Row label="disabled"><ControlledToggle label="Disabled" disabled /></Row>
    <Row label="disabled + checked"><ControlledToggle label="Disabled + checked" disabled initialChecked /></Row>
  </Section>
);

export const Sizes = () => (
  <Section title="Sizes">
    <Row label="size=small"><ControlledToggle label="Small" size="small" initialChecked /></Row>
    <Row label="size=medium (default)"><ControlledToggle label="Medium" size="medium" initialChecked /></Row>
    <Row label="size=large"><ControlledToggle label="Large" size="large" initialChecked /></Row>
  </Section>
);

export const Alignment = () => (
  <Section title="Alignment">
    <Row label="label left (default)"><ControlledToggle label="Default" /></Row>
    <Row label="alignRight"><ControlledToggle label="Label on the right" alignRight initialChecked /></Row>
    <Row label="bold"><ControlledToggle label="Bold label" bold initialChecked /></Row>
  </Section>
);

export const RuntimeMode = () => (
  <Section title="Runtime mode (inline text in track)">
    <Row label="textOpt=Blank"><ControlledToggle id="rt-blank" label="Blank" isRuntime initialChecked /></Row>
    <Row label="textOpt=Yes/No"><ControlledToggle id="rt-yn" label="Yes / No" isRuntime textOpt="Yes/No" initialChecked /></Row>
    <Row label="textOpt=On/Off"><ControlledToggle id="rt-onoff" label="On / Off" isRuntime textOpt="On/Off" initialChecked /></Row>
    <Row label="textOpt=True/False"><ControlledToggle id="rt-tf" label="True / False" isRuntime textOpt="True/False" /></Row>
  </Section>
);

export const Color = () => (
  <Section title="Custom color">
    <Row label="default"><ControlledToggle label="Default blue" initialChecked /></Row>
    <Row label="color=green"><ControlledToggle label="Green" color="#007B4A" initialChecked /></Row>
    <Row label="color=red"><ControlledToggle label="Red" color="#DA211E" initialChecked /></Row>
    <Row label="color=purple"><ControlledToggle label="Purple" color="#3B4AED" initialChecked /></Row>
  </Section>
);

export const RealWorldForm = () => {
  const [prefs, setPrefs] = useState({ email: true, sms: false, push: true });
  const update = (key) => (v) => setPrefs((p) => ({ ...p, [key]: v }));
  return (
    <Section title="A realistic settings list">
      <div style={{ maxWidth: 400 }}>
        <Toggle label="Email notifications" checked={prefs.email} onChange={update('email')} />
        <Toggle label="Text messages" checked={prefs.sms} onChange={update('sms')} />
        <Toggle label="Push notifications" checked={prefs.push} onChange={update('push')} />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const legacyRef = React.useRef(null);
  return (
    <Section title="Backwards-compat shim (fires one console.warn at first use)">
      <Row label="forwardRef prop"><ControlledToggle id="legacy-1" label="Forwarded via prop" forwardRef={legacyRef} /></Row>
      <Row label="isV4Design (ignored)"><ControlledToggle id="legacy-2" label="isV4Design ghost" isV4Design /></Row>
      <Row label="isMobile (ignored)"><ControlledToggle id="legacy-3" label="isMobile ghost" isMobile /></Row>
      <Row label="legacyClass (ignored)"><ControlledToggle id="legacy-4" label="legacyClass ghost" legacyClass="old-class" /></Row>
      <Row label="compactStyle (ignored)"><ControlledToggle id="legacy-5" label="compactStyle ghost" compactStyle /></Row>
      <Row label="displayAuto (ignored)"><ControlledToggle id="legacy-6" label="displayAuto ghost" displayAuto /></Row>
    </Section>
  );
};
