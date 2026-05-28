import React, { useState } from 'react';
import Dropdown from '../src';

export default {
  title: 'm-next/Components/Form/Dropdown',
  component: Dropdown,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 180, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
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

const baseOptions = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' },
];

const iconOptions = [
  { value: 1, label: 'Calls', icon: 'phone' },
  { value: 2, label: 'Filter', icon: 'filter' },
  { value: 3, label: 'Cloud', icon: 'cloud' },
];

const multiLineOptions = [
  { value: 1, label: 'First', lines: ['Line 1', 'Line 2'] },
  { value: 2, label: 'Second', lines: ['Line A', 'Line B'] },
  { value: 3, label: 'Third', lines: ['Line X', 'Line Y'] },
];

const multiIconOptions = [
  { value: 1, label: 'Calls', lines: ['Inbound', 'Outbound'], icon: 'phone' },
  { value: 2, label: 'Filter', lines: ['Saved', 'Recent'], icon: 'filter' },
  { value: 3, label: 'Cloud', lines: ['Synced', 'Pending'], icon: 'cloud' },
];

const colouredOptions = [
  { value: 'new', label: 'New', colour: 'blue' },
  { value: 'open', label: 'Open', colour: 'green' },
  { value: 'overdue', label: 'Overdue', colour: 'red' },
  { value: 'done', label: 'Done', colour: 'grey' },
];

const ControlledDropdown = ({ initialValue = null, ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return <Dropdown value={value} onChange={setValue} {...rest} />;
};

export const Basic = () => (
  <Section title="Basic dropdown">
    <Row label="default"><ControlledDropdown label="Country" options={baseOptions} placeholder="Pick one…" /></Row>
    <Row label="with value"><ControlledDropdown label="Country" options={baseOptions} initialValue={baseOptions[1]} /></Row>
    <Row label="searchable"><ControlledDropdown label="Country" options={baseOptions} isSearchable placeholder="Type or pick…" /></Row>
    <Row label="clearable"><ControlledDropdown label="Status" options={baseOptions} isClearable initialValue={baseOptions[0]} /></Row>
  </Section>
);

export const Variants = () => (
  <Section title="variant axis">
    <Row label="single (default)"><ControlledDropdown label="Single" variant="single" options={baseOptions} initialValue={baseOptions[0]} /></Row>
    <Row label="icon"><ControlledDropdown label="Icon" variant="icon" options={iconOptions} initialValue={iconOptions[0]} /></Row>
    <Row label="multi"><ControlledDropdown label="Multi" variant="multi" options={multiLineOptions} initialValue={multiLineOptions[0]} /></Row>
    <Row label="multi-icon"><ControlledDropdown label="Multi + icon" variant="multi-icon" options={multiIconOptions} initialValue={multiIconOptions[0]} /></Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><ControlledDropdown label="Country" options={baseOptions} /></Row>
    <Row label="required"><ControlledDropdown label="Country" required options={baseOptions} /></Row>
    <Row label="disabled"><ControlledDropdown label="Country" disabled options={baseOptions} initialValue={baseOptions[0]} /></Row>
    <Row label="loading"><ControlledDropdown label="Country" isLoading options={baseOptions} /></Row>
    <Row label="errorMessage"><ControlledDropdown label="Country" required errorMessage="Please select a country" options={baseOptions} /></Row>
  </Section>
);

export const MultiSelect = () => (
  <Section title="isMultiSelect">
    <Row label="plain multi"><ControlledDropdown label="Tags" isMultiSelect options={baseOptions} placeholder="Pick multiple…" /></Row>
    <Row label="coloured pills">
      <ControlledDropdown
        label="Status"
        isMultiSelect
        options={colouredOptions}
        initialValue={[colouredOptions[0], colouredOptions[1]]}
      />
    </Row>
    <Row label="with isFixed pin">
      <ControlledDropdown
        label="Members"
        isMultiSelect
        options={baseOptions}
        initialValue={[
          { ...baseOptions[0], isFixed: true, colour: 'grey' },
          { ...baseOptions[1], colour: 'blue' },
        ]}
      />
    </Row>
  </Section>
);

export const CreatableAndActions = () => (
  <Section title="Creatable + action button">
    <Row label="isCreatable">
      <ControlledDropdown
        label="Tag"
        isCreatable
        options={baseOptions}
        placeholder="Pick or type…"
        // eslint-disable-next-line no-console, no-alert
        onCreate={(v) => console.log('created', v)}
      />
    </Row>
    <Row label="actionButtonText">
      <ControlledDropdown
        label="Choose"
        options={baseOptions}
        actionButtonText="+ Add new option"
        // eslint-disable-next-line no-alert
        onActionButtonClick={() => alert('Action clicked')}
        open
      />
    </Row>
  </Section>
);

export const RealWorldForm = () => {
  const [form, setForm] = useState({ country: null, status: null, tags: [] });
  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  return (
    <Section title="A realistic form">
      <div style={{ maxWidth: 400 }}>
        <Dropdown label="Country" required options={baseOptions} value={form.country} onChange={update('country')} />
        <Dropdown label="Status" variant="icon" options={iconOptions} value={form.status} onChange={update('status')} />
        <Dropdown label="Tags" isMultiSelect options={colouredOptions} value={form.tags} onChange={update('tags')} />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="caption (str)">
      <ControlledDropdown id="legacy-1" caption="Legacy caption" options={baseOptions} placeholder="caption→label" />
    </Row>
    <Row label="dropdownStyle">
      <ControlledDropdown id="legacy-2" label="Status" dropdownStyle="icon" options={iconOptions} initialValue={iconOptions[0]} />
    </Row>
    <Row label="validationMessage">
      <ControlledDropdown id="legacy-3" label="Legacy error" validationMessage="Old API still renders" options={baseOptions} />
    </Row>
    <Row label="isCreateable (typo)">
      <ControlledDropdown id="legacy-4" label="Tag" isCreateable options={baseOptions} placeholder="Pick or type…" />
    </Row>
    <Row label="ariaLabel">
      <ControlledDropdown id="legacy-5" ariaLabel="Legacy aria-label" options={baseOptions} placeholder="No visible label" />
    </Row>
  </Section>
);
