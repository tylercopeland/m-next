import React, { useState } from 'react';
import { IconRadioGroup } from '../src';

export default {
  title: 'm-next/Components/Form/IconRadioGroup',
  component: IconRadioGroup,
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

const chartOptions = [
  { value: 1, icon: 'mi-icon-bar-chart', label: 'Column' },
  { value: 0, icon: 'mi-icon-graph-bar-1', label: 'Bar' },
  { value: 3, icon: 'mi-icon-graph-line-2', label: 'Line' },
  { value: 6, icon: 'mi-icon-graph-line-4', label: 'Area' },
  { value: 4, icon: 'mi-icon-pie-chart', label: 'Pie' },
  { value: 7, icon: 'mi-icon-doughnut-chart', label: 'Donut' },
];

export const Basic = () => {
  const [value, setValue] = useState(1);
  return (
    <Section title='Chart type picker'>
      <IconRadioGroup
        label='Chart type'
        options={chartOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const Disabled = () => (
  <Section title='Whole group disabled'>
    <IconRadioGroup
      label='Chart type'
      disabled
      options={chartOptions}
      selectedValue={1}
      onChange={() => {}}
    />
  </Section>
);

export const NoLabel = () => {
  const [value, setValue] = useState(1);
  return (
    <Section title='Without a Caption (provide an aria-label instead)'>
      <IconRadioGroup
        aria-label='Chart type'
        options={chartOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const [value, setValue] = useState(1);
  return (
    <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
      {/* `caption` is the legacy name for `label`. `isV4Design`, `isMobile`, `legacyClass` silently no-op. */}
      <IconRadioGroup
        id='legacy-icon-radio-group'
        caption='Legacy caption prop'
        isV4Design
        isMobile
        legacyClass='ignored'
        options={chartOptions}
        selectedValue={value}
        onChange={(item) => setValue(item.value)}
      />
    </Section>
  );
};
