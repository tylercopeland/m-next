import React, { useState } from 'react';
import { RadioButton } from '../src';

export default {
  title: 'm-next/Components/RadioButton',
  component: RadioButton,
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

const ControlledRadio = ({ initialValue = '', value, label, name = 'demo', ...rest }) => {
  const [selected, setSelected] = useState(initialValue);
  return (
    <RadioButton
      name={name}
      value={value}
      label={label}
      checked={selected === value}
      onChange={(e) => setSelected(e.target.value)}
      {...rest}
    />
  );
};

const Group = ({ name, options, initial }) => {
  const [selected, setSelected] = useState(initial);
  return (
    <fieldset
      role='radiogroup'
      style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {options.map(({ value, label, hint, disabled }) => (
        <RadioButton
          key={value}
          name={name}
          value={value}
          label={label}
          checked={selected === value}
          onChange={(e) => setSelected(e.target.value)}
          hint={hint}
          disabled={disabled}
        />
      ))}
    </fieldset>
  );
};

export const Basic = () => (
  <Section title='Single radio (controlled)'>
    <Row label='unchecked'>
      <ControlledRadio value='a' label='Option A' />
    </Row>
    <Row label='checked'>
      <ControlledRadio value='a' label='Option A' initialValue='a' />
    </Row>
    <Row label='disabled'>
      <ControlledRadio value='a' label='Option A' disabled />
    </Row>
    <Row label='disabled+checked'>
      <ControlledRadio value='a' label='Option A' disabled initialValue='a' />
    </Row>
  </Section>
);

export const Group_Column = () => (
  <Section title='Column-layout group (recommended composition)'>
    <Group
      name='size'
      initial='md'
      options={[
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large', disabled: true },
      ]}
    />
  </Section>
);

export const WithHint = () => (
  <Section title='Radio with a tooltip hint'>
    <Group
      name='access'
      initial='public'
      options={[
        { value: 'public', label: 'Public', hint: 'Anyone with the link can view.' },
        { value: 'team', label: 'Team only', hint: 'Members of your team can view.' },
        { value: 'private', label: 'Private', hint: 'Only you can view.' },
      ]}
    />
  </Section>
);

export const CustomColor = () => (
  <Section title='Custom indicator color'>
    <Row label='green'>
      <ControlledRadio value='a' label='Confirm' initialValue='a' color='#137E58' />
    </Row>
    <Row label='red'>
      <ControlledRadio value='a' label='Decline' initialValue='a' color='#DA211E' />
    </Row>
  </Section>
);

export const RealWorldForm = () => {
  const [plan, setPlan] = useState('pro');
  const [billing, setBilling] = useState('annual');
  return (
    <Section title='A realistic form'>
      <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <fieldset role='radiogroup' aria-label='Plan' style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>Plan</legend>
          <RadioButton name='plan' value='free' label='Free' checked={plan === 'free'} onChange={(e) => setPlan(e.target.value)} />
          <RadioButton name='plan' value='pro' label='Pro' checked={plan === 'pro'} onChange={(e) => setPlan(e.target.value)} hint='Best for individuals.' />
          <RadioButton name='plan' value='team' label='Team' checked={plan === 'team'} onChange={(e) => setPlan(e.target.value)} hint='Includes 5 seats.' />
        </fieldset>
        <fieldset role='radiogroup' aria-label='Billing' style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>Billing</legend>
          <RadioButton name='billing' value='monthly' label='Monthly' checked={billing === 'monthly'} onChange={(e) => setBilling(e.target.value)} />
          <RadioButton name='billing' value='annual' label='Annual (save 20%)' checked={billing === 'annual'} onChange={(e) => setBilling(e.target.value)} />
        </fieldset>
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
    <Row label='customColor'>
      <ControlledRadio id='legacy-1' value='a' label='Legacy color prop' initialValue='a' customColor='#137E58' />
    </Row>
    <Row label='ariaChecked'>
      <ControlledRadio id='legacy-2' value='a' label='Legacy aria-checked' initialValue='a' ariaChecked />
    </Row>
    <Row label='isV4Design (ignored)'>
      <ControlledRadio id='legacy-3' value='a' label='Legacy V4 flag (no effect)' initialValue='a' isV4Design />
    </Row>
    <Row label='isMobile (ignored)'>
      <ControlledRadio id='legacy-4' value='a' label='Legacy mobile flag (no effect)' initialValue='a' isMobile />
    </Row>
    <Row label='legacyClass (ignored)'>
      <ControlledRadio id='legacy-5' value='a' label='Legacy class (no effect)' initialValue='a' legacyClass='ignored' />
    </Row>
  </Section>
);
