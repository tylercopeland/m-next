import React, { useState } from 'react';
import { FieldTypeNames } from '@m-next/types';
import FieldBlock, { FormSection } from '../src';

export default {
  title: 'm-next/Components/Form/FormSection',
  component: FormSection,
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

const baseData = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
  Email: 'jane.s@redbubble.co.uk',
  Phone: '',
  Website: '',
  TagList: 'aaa,bbb,ccc',
  IsCool: 'true',
  IsNotCool: 'false',
};

const tagsList = [
  { name: 'aaa', colour: '#84f3ff' },
  { name: 'bbb', colour: '#A9d9bf' },
  { name: 'ccc', colour: '#ffabb5' },
  { name: 'ddd', colour: '#bacad0' },
  { name: 'eee', colour: '#ffea80' },
];

const fields = [
  { name: 'RecordId', caption: 'RecordId', type: 'Id', isVisible: false, isRequired: false },
  { name: 'FirstName', caption: 'First Name', type: 'Text', isVisible: true, isRequired: true, maxLength: 40 },
  { name: 'LastName', caption: 'Last Name', type: 'Text', isVisible: true, isRequired: false, maxLength: 40 },
  { name: 'Email', caption: 'Email', type: 'Email', isVisible: true, isRequired: false, maxLength: 400 },
  { name: 'Phone', caption: 'Phone', type: 'Text', isVisible: true, isRequired: false, maxLength: 12 },
  { name: 'Website', caption: 'Website', type: 'Text', isVisible: true, isRequired: false, maxLength: 400 },
  { name: 'TagList', caption: 'Tag list', type: FieldTypeNames.Tags, isVisible: true, isRequired: false },
  { name: 'IsCool', caption: 'IsCool', type: 'YesNo', isVisible: true, isRequired: false },
];

const Frame = ({ children }) => (
  <div style={{ maxWidth: 480, padding: 12, fontFamily }}>{children}</div>
);

export const Basic = () => (
  <Section title="FormSection — read-only">
    <Frame>
      <FormSection
        id="basic"
        title="Contact details"
        description="How customers can reach this account."
        fields={fields}
        data={baseData}
        tagsList={tagsList}
      />
    </Frame>
  </Section>
);

export const Editable = () => {
  const [data, setData] = useState(baseData);
  return (
    <Section title="Editable mode (mode={1})">
      <Frame>
        <FormSection
          id="editable"
          title="Contact details"
          description="Save when you're done."
          fields={fields}
          data={data}
          tagsList={tagsList}
          mode={1}
          showSave
          showClearAndNew
          onSaveClick={(next) => setData(next)}
          onClearClick={() => setData({ ...baseData })}
        />
      </Frame>
    </Section>
  );
};

export const CollapseEmpty = () => (
  <Section title="collapseEmpty — hides empty fields behind a toggle">
    <Frame>
      <FormSection
        id="collapse"
        title="Contact details"
        fields={fields}
        data={baseData}
        tagsList={tagsList}
        collapseEmpty
      />
    </Frame>
  </Section>
);

export const Loading = () => (
  <Section title="isLoading">
    <Frame>
      <FormSection
        id="loading"
        title="Contact details"
        fields={fields}
        data={baseData}
        tagsList={tagsList}
        isLoading
      />
    </Frame>
  </Section>
);

export const ErrorState = () => (
  <Section title="error — block-level retry">
    <Frame>
      <FormSection
        id="error"
        title="Contact details"
        fields={fields}
        data={baseData}
        tagsList={tagsList}
        error="Network request failed"
        onRefetch={() => {}}
      />
    </Frame>
  </Section>
);

export const NoTitle = () => (
  <Section title="No title — region role / aria-labelledby is omitted">
    <Frame>
      <FormSection
        id="no-title"
        fields={fields}
        data={baseData}
        tagsList={tagsList}
      />
    </Frame>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Frame>
      <p style={{ fontFamily, fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
        Legacy props <code>heading</code>, <code>hint</code>, and the <code>forwardRef</code> prop are
        soft-shimmed. The legacy default export <code>FieldBlock</code> is still the same component.
      </p>
      <FieldBlock
        id="legacy"
        heading="Contact details (legacy `heading` prop)"
        hint="Legacy `hint` prop — translated to `description`."
        fields={fields}
        data={baseData}
        tagsList={tagsList}
      />
    </Frame>
  </Section>
);
