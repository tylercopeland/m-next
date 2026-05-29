import React, { useState } from 'react';
import Address from '../src';

export default {
  title: 'm-next/Components/Form/Address',
  component: Address,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 160, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 480 }}>{children}</div>
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

const SAMPLE = {
  Line1: '123 Fake St',
  Line2: 'Apt 4',
  Line3: 'Box 12',
  City: 'Toronto',
  State: 'Ontario',
  PostalCode: 'M5J 2N8',
  Country: 'Canada',
};

const ControlledAddress = ({ initialValue = SAMPLE, ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return <Address value={value} onChange={setValue} {...rest} />;
};

export const ReadOnly = () => (
  <Section title="Read-only address">
    <Row label="full">
      <Address value={SAMPLE} />
    </Row>
    <Row label="minimal">
      <Address value={{ Line1: '500 King St W', City: 'Toronto', Country: 'Canada' }} />
    </Row>
    <Row label="locality only">
      <Address value={{ City: 'Toronto', State: 'Ontario', PostalCode: 'M5J 2N8' }} />
    </Row>
  </Section>
);

export const Editable = () => (
  <Section title="Editable form">
    <Row label="prefilled">
      <ControlledAddress isEditable label="Billing address" />
    </Row>
    <Row label="empty + required">
      <ControlledAddress initialValue={{}} isEditable label="Shipping address" required />
    </Row>
    <Row label="disabled">
      <ControlledAddress isEditable label="Billing address" disabled />
    </Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="loading (read-only)">
      <Address isLoading />
    </Row>
    <Row label="loading (editable)">
      <Address isLoading isEditable />
    </Row>
    <Row label="empty (read-only)">
      <Address value={{}} />
    </Row>
  </Section>
);

export const WithLabel = () => (
  <Section title="Section heading drives aria-labelledby">
    <Row label="labeled">
      <ControlledAddress isEditable label="Primary address" />
    </Row>
    <Row label="no label">
      <ControlledAddress isEditable />
    </Row>
  </Section>
);

export const RealWorldForm = () => {
  const [billing, setBilling] = useState({});
  const [shipping, setShipping] = useState(SAMPLE);
  return (
    <Section title="A realistic checkout form">
      <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Address value={billing} onChange={setBilling} isEditable label="Billing address" required />
        <Address value={shipping} onChange={setShipping} isEditable label="Shipping address" />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  // Legacy flat-prop API. Each first-use fires a single console.warn.
  const [v, setV] = useState(SAMPLE);
  const handleChange = (delta) => setV(delta);
  return (
    <Section title="Backwards-compat shim (each fires one console.warn at first use)">
      <Row label="flat props (read-only)">
        <Address
          id="legacy-1"
          Line1="123 Fake St"
          Line2="Apt 4"
          City="Toronto"
          State="Ontario"
          PostalCode="M5J 2N8"
          Country="Canada"
        />
      </Row>
      <Row label="flat props (editable)">
        <Address
          id="legacy-2"
          isEditable
          Line1={v.Line1}
          Line2={v.Line2}
          Line3={v.Line3}
          Line4={v.Line4}
          Line5={v.Line5}
          City={v.City}
          State={v.State}
          PostalCode={v.PostalCode}
          Country={v.Country}
          onChange={handleChange}
        />
      </Row>
      <Row label="caption (alias)">
        <Address id="legacy-3" caption="Legacy caption alias" isEditable value={SAMPLE} />
      </Row>
      <Row label="ignored ghosts">
        <Address
          id="legacy-4"
          isV4Design
          isMobile
          compactStyle
          displayAuto
          legacyClass="legacy"
          value={SAMPLE}
        />
      </Row>
    </Section>
  );
};
