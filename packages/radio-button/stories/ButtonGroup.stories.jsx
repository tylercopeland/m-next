import React, { useState } from 'react';
import { ButtonRadioGroup } from '../src';

export default {
  title: 'm-next/Components/Form/ButtonRadioGroup',
  component: ButtonRadioGroup,
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

const aggregationOptions = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'max', label: 'Max' },
  { value: 'min', label: 'Min' },
];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export const Basic = () => {
  const [value, setValue] = useState('sum');
  return (
    <Section title='Segmented button group'>
      <ButtonRadioGroup
        label='Aggregation'
        options={aggregationOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const OneLine = () => {
  const [value, setValue] = useState('center');
  return (
    <Section title='Force-fit on a single line'>
      <ButtonRadioGroup
        label='Alignment'
        isOneLine
        options={alignOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const FixedButtonWidth = () => {
  const [value, setValue] = useState('avg');
  return (
    <Section title='Each button has a fixed width'>
      <ButtonRadioGroup
        label='Aggregation'
        buttonWidth={80}
        options={aggregationOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const Disabled = () => (
  <Section title='Whole group disabled'>
    <ButtonRadioGroup
      label='Aggregation'
      disabled
      options={aggregationOptions}
      selectedValue='sum'
      onChange={() => {}}
    />
  </Section>
);

export const NoLabel = () => {
  const [value, setValue] = useState('sum');
  return (
    <Section title='Without a Caption (provide an aria-label instead)'>
      <ButtonRadioGroup
        aria-label='Aggregation'
        options={aggregationOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const [value, setValue] = useState('sum');
  return (
    <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
      {/* `caption` is the legacy name for `label`. `isV4Design`, `isMobile`, `legacyClass` silently no-op. */}
      <ButtonRadioGroup
        id='legacy-button-radio-group'
        caption='Legacy caption prop'
        isV4Design
        isMobile
        legacyClass='ignored'
        options={aggregationOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};
