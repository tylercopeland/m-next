import React from 'react';
import Card from '../src';

export default {
  title: 'm-next/Components/Display/Card',
  component: Card,
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

// ============ Fixture data ============

const data = {
  RecordId: 1,
  FullName: 'Jane Smith',
  Email: 'jane.s@redbubble.co.uk',
  Phone: '555-0142',
  Balance: 12345.678,
  Counter: 0,
  BirthDate: '2021-04-12T08:56:39',
  IsCool: 'true',
  TagList: 'one,cake,bunny,Add Tag 12',
};

const fields = {
  FullName: {
    name: 'FullName',
    caption: 'Full Name',
    type: 'Text',
    isVisible: true,
    isRequired: true,
    maxLength: 40,
    styling: { bold: true, fontSize: 'large' },
  },
  Email: {
    name: 'Email',
    caption: 'Email',
    type: 'Email',
    isVisible: true,
  },
  Phone: {
    name: 'Phone',
    caption: 'Phone',
    type: 'Text',
    isVisible: true,
  },
  Balance: {
    name: 'Balance',
    caption: 'Balance',
    type: 'Money',
    isVisible: true,
    displayAs: 'pill',
  },
  Counter: {
    name: 'Counter',
    caption: 'Counter',
    type: 'Decimal',
    isVisible: true,
    displayAs: 'pill',
    conditionalFormatting: [{ value: 0, color: 'red' }],
  },
  BirthDate: {
    name: 'BirthDate',
    caption: 'Birth Date',
    type: 'DateTime',
    isVisible: true,
    displayOptions: { dateFormat: 4 },
  },
  TagList: {
    name: 'TagList',
    caption: 'Tags',
    type: 'Tags',
    isVisible: true,
  },
};

const tagsList = [
  { colour: '#B3E5FF', name: 'one' },
  { colour: '#FFCDAB', name: 'cake' },
  { colour: '#B3E5FF', name: 'bunny' },
  { colour: '#A9D9BF', name: 'Add Tag 12' },
];

const avatarUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg';

// ============ Stories ============

export const Basic = () => (
  <Section title="Two columns with avatar">
    <Card
      hasAvatar
      avatar={avatarUrl}
      field1={fields.FullName}
      field2={fields.Email}
      field3={fields.Phone}
      field4={fields.Balance}
      field5={fields.BirthDate}
      field6={fields.TagList}
      data={data}
      tagsList={tagsList}
    />
  </Section>
);

export const NoAvatar = () => (
  <Section title="Without avatar slot">
    <Card
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Balance}
      field5={fields.BirthDate}
      data={data}
    />
  </Section>
);

export const SmallSize = () => (
  <Section title='size="small"'>
    <Card
      size="small"
      hasAvatar
      avatar={avatarUrl}
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Phone}
      field5={fields.BirthDate}
      data={data}
    />
  </Section>
);

export const Loading = () => (
  <Section title="Loading state (skeleton)">
    <Card
      hasAvatar
      isLoading
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Balance}
      field5={fields.BirthDate}
      data={data}
    />
  </Section>
);

export const NoData = () => (
  <Section title="Field shape with no record bound">
    <Card
      hasAvatar
      avatar={null}
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Balance}
      field5={fields.BirthDate}
      data={null}
    />
  </Section>
);

export const HideEmptyFields = () => (
  <Section title="hideEmptyFields — compact grid treatment">
    <Card
      hideEmptyFields
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Balance}
      data={{ ...data, Email: '', Balance: null }}
    />
  </Section>
);

export const Clickable = () => (
  <Section title="onClick handler">
    <Card
      hasAvatar
      avatar={avatarUrl}
      field1={fields.FullName}
      field2={fields.Email}
      field4={fields.Balance}
      field5={fields.BirthDate}
      data={data}
      // eslint-disable-next-line no-alert
      onClick={() => alert('Card clicked')}
    />
  </Section>
);

export const LegacyAPIStillWorks = () => {
  // Demonstrates the forwardRef-prop soft shim. Fires one console.warn at first use.
  const legacyRef = React.useRef(null);
  return (
    <Section title="Backwards-compat shim (fires one console.warn at first use)">
      <Card
        id="legacy-card"
        // eslint-disable-next-line react/no-unknown-property
        forwardRef={legacyRef}
        // Silently-ignored ghosts — accepted, no effect:
        isV4Design
        isMobile
        legacyClass="legacy-card-class"
        displayAuto
        compactStyle
        hasAvatar
        avatar={avatarUrl}
        field1={fields.FullName}
        field2={fields.Email}
        field4={fields.Balance}
        field5={fields.BirthDate}
        data={data}
      />
    </Section>
  );
};
