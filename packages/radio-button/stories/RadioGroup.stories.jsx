import React, { useState } from 'react';
import RadioGroup from '../src/RadioGroup';

export default {
  title: 'm-next/Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

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

const sizeOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl', disabled: true },
];

const planOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro', hint: 'Best for individuals.' },
  { label: 'Team', value: 'team', hint: 'Includes 5 seats.' },
];

const systemOptions = [
  {
    label: 'Compact list',
    value: 'one',
    subtext: 'A dense layout that minimizes vertical space — best when scanning many rows.',
  },
  { label: 'Roomy list', value: 'two' },
  {
    label: 'Cards',
    value: 'three',
    subtext: 'Visual emphasis on each row, more screen real estate per item.',
  },
];

export const Basic = () => {
  const [value, setValue] = useState('md');
  return (
    <Section title='Column layout (default)'>
      <RadioGroup
        name='size'
        label='Size'
        options={sizeOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const Row = () => {
  const [value, setValue] = useState('md');
  return (
    <Section title='Row layout'>
      <RadioGroup
        name='size-row'
        label='Size'
        direction='row'
        options={sizeOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const WithHint = () => {
  const [value, setValue] = useState('pro');
  return (
    <Section title='Options with tooltip hints'>
      <RadioGroup
        name='plan'
        label='Plan'
        options={planOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const WithSubtext = () => {
  const [value, setValue] = useState('one');
  return (
    <Section title='Options with subtext'>
      <RadioGroup
        name='layout'
        label='Layout style'
        options={systemOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const CustomColor = () => {
  const [value, setValue] = useState('confirm');
  return (
    <Section title='Custom indicator color'>
      <RadioGroup
        name='action'
        label='Action'
        color='#137E58'
        options={[
          { label: 'Confirm', value: 'confirm' },
          { label: 'Cancel', value: 'cancel' },
        ]}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const NoLabel = () => {
  const [value, setValue] = useState('md');
  return (
    <Section title='Without a Caption (provide an aria-label instead)'>
      <RadioGroup
        name='size-nolabel'
        aria-label='Size'
        options={sizeOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const [value, setValue] = useState('md');
  return (
    <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
      {/* `caption` is the legacy name for `label`. `customColor` is the legacy name for `color`.
          `isV4Design`, `isRuntime`, `hideCaption` etc. silently no-op. */}
      <RadioGroup
        id='legacy-radio-group'
        name='legacy'
        caption='Legacy caption prop'
        customColor='#137E58'
        customFontSize='14px'
        isV4Design
        isRuntime
        hideCaption={false}
        options={sizeOptions}
        selectedValue={value}
        onChange={(_, v) => setValue(v)}
      />
    </Section>
  );
};
