import React, { useState } from 'react';
import Select from '../src';

export default {
  title: 'm-next/Components/Select',
  component: Select,
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

const Note = ({ children }) => (
  <p style={{ fontFamily, fontSize: 13, color: '#6b7280', maxWidth: 640, marginBottom: 16 }}>
    {children}
  </p>
);

const baseOptions = [
  {
    icon: 'address-lookup',
    title: 'Explore',
    description: 'Discover new ways to manage your business',
  },
  {
    icon: 'checklist',
    title: 'Organize',
    description: 'Create and sync with accounting software',
  },
  {
    icon: 'cloud-download-V4',
    title: 'Download',
    description: 'Export millions of options exclusive to Method',
  },
];

export const Basic = () => (
  <Section title="Basic radio-card chooser">
    <Note>
      Heads up: despite the name, Select is a radio-card chooser, not a form
      &lt;select&gt; dropdown. For the standard form-select pattern, use Dropdown.
    </Note>
    <Select label="Choose a starting point" options={baseOptions} selectedValue="Explore" />
  </Section>
);

export const Sizes = () => (
  <Section title="Sizes">
    <Note>size="lg" (default) — 80px icon, generous padding.</Note>
    <Select label="Large cards" options={baseOptions} selectedValue="Explore" size="lg" />
    <div style={{ height: 24 }} />
    <Note>size="sm" — 40px icon, tighter padding.</Note>
    <Select label="Small cards" options={baseOptions} selectedValue="Organize" size="sm" />
  </Section>
);

export const OptionVariants = () => (
  <Section title="Option content variants">
    <Note>Description-only is fine. Title-only is fine. Both is the default.</Note>
    <Select
      label="No description"
      options={[
        { icon: 'address-lookup', title: 'Explore' },
        { icon: 'checklist', title: 'Organize' },
        { icon: 'cloud-download-V4', title: 'Download' },
      ]}
      selectedValue="Explore"
    />
    <div style={{ height: 24 }} />
    <Select
      label="No title"
      options={[
        { icon: 'address-lookup', description: 'Discover new ways to manage your business' },
        { icon: 'checklist', description: 'Create and sync with accounting software' },
        { icon: 'cloud-download-V4', description: 'Export millions of options exclusive to Method' },
      ]}
    />
  </Section>
);

export const DisabledOption = () => (
  <Section title="Disabled option">
    <Select
      label="Pick one"
      options={[
        { icon: 'address-lookup', title: 'Explore', description: 'Available' },
        { icon: 'checklist', title: 'Organize', description: 'Available' },
        {
          icon: 'cloud-download-V4',
          title: 'Download',
          description: 'Not available on your plan',
          disabled: true,
        },
      ]}
      selectedValue="Explore"
    />
  </Section>
);

export const Controlled = () => {
  const [picked, setPicked] = useState('Explore');
  return (
    <Section title="Controlled selection">
      <Note>Current selection: <strong>{picked}</strong></Note>
      <Select
        label="Controlled chooser"
        options={baseOptions}
        selectedValue={picked}
        onChange={(opt) => setPicked(opt.title)}
      />
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Note>
      Old prop names continue to work via a soft shim. Each emits a single
      console.warn the first time it's used and translates to the new API.
    </Note>

    <Note>
      <code>caption="..."</code> → <code>label</code>
    </Note>
    <Select id="legacy-caption" caption="Legacy caption prop" options={baseOptions} />

    <div style={{ height: 24 }} />

    <Note>
      <code>size="small"</code> → <code>size="sm"</code>
    </Note>
    <Select
      id="legacy-size-small"
      label="Legacy small size"
      options={baseOptions}
      selectedValue="Organize"
      size="small"
    />

    <div style={{ height: 24 }} />

    <Note>
      <code>size="large"</code> → <code>size="lg"</code>
    </Note>
    <Select
      id="legacy-size-large"
      label="Legacy large size"
      options={baseOptions}
      selectedValue="Explore"
      size="large"
    />

    <div style={{ height: 24 }} />

    <Note>
      Legacy ghosts <code>isV4Design</code>, <code>isMobile</code>, <code>legacyClass</code>,
      <code> displayAuto</code> are accepted but ignored.
    </Note>
    <Select
      id="legacy-ghosts"
      label="Ghosts are silently ignored"
      options={baseOptions}
      selectedValue="Download"
      isV4Design
      isMobile
      legacyClass="old-css-hook"
      displayAuto
    />
  </Section>
);
