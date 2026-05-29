import * as React from 'react';
import PhoneInput from '../src';

export default {
  title: 'm-next/Components/Form/PhoneInput',
  component: PhoneInput,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 24,
      padding: '12px 0',
      fontFamily,
    }}
  >
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>
      {label}
    </div>
    <div style={{ flex: 1, maxWidth: 360 }}>{children}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
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

export const Basic = () => (
  <Section title='Basic phone input'>
    <Row label='default'>
      <PhoneInput id='basic-default' label='Phone' />
    </Row>
    <Row label='with value'>
      <PhoneInput id='basic-value' label='Phone' value='+14372207682' />
    </Row>
    <Row label='no label'>
      <PhoneInput id='basic-nolabel' />
    </Row>
  </Section>
);

export const Countries = () => (
  <Section title='defaultCountry'>
    <Row label="defaultCountry='ca' (default)">
      <PhoneInput id='country-ca' label='Phone' defaultCountry='ca' />
    </Row>
    <Row label="defaultCountry='us'">
      <PhoneInput id='country-us' label='Phone' defaultCountry='us' />
    </Row>
    <Row label="defaultCountry='gb'">
      <PhoneInput id='country-gb' label='Phone' defaultCountry='gb' />
    </Row>
    <Row label="defaultCountry='in'">
      <PhoneInput id='country-in' label='Phone' defaultCountry='in' />
    </Row>
  </Section>
);

export const Search = () => (
  <Section title='Country search'>
    <Row label='enableSearch (default)'>
      <PhoneInput id='search-on' label='Phone' />
    </Row>
    <Row label='enableSearch=false'>
      <PhoneInput id='search-off' label='Phone' enableSearch={false} />
    </Row>
    <Row label='custom search placeholder'>
      <PhoneInput id='search-custom' label='Phone' searchPlaceholder='Find a country…' />
    </Row>
  </Section>
);

export const ErrorState = () => (
  <Section title='Error message'>
    <Row label='errorMessage'>
      <PhoneInput
        id='err-1'
        label='Phone'
        value='+1437'
        errorMessage='Please enter a valid phone number'
      />
    </Row>
    <Row label='long error'>
      <PhoneInput
        id='err-2'
        label='Phone'
        value='+1437'
        errorMessage='Phone number must include a country dial code and have between 7 and 15 digits in length.'
      />
    </Row>
  </Section>
);

export const RealWorldForm = () => {
  const [phone, setPhone] = React.useState<string>('');
  return (
    <Section title='A realistic contact form'>
      <div style={{ maxWidth: 400 }}>
        <PhoneInput
          id='realworld-phone'
          label='Mobile phone'
          defaultCountry='ca'
          value={phone}
          onChange={(_value, _data, _event, formatted) => setPhone(formatted)}
        />
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
    <Row label='placeholder (legacy label)'>
      <PhoneInput id='legacy-1' placeholder='Legacy placeholder' />
    </Row>
    <Row label='validationMessage'>
      <PhoneInput
        id='legacy-2'
        label='Phone'
        value='+1437'
        validationMessage='Old API still renders this error'
      />
    </Row>
    <Row label='handleChange'>
      <PhoneInput
        id='legacy-3'
        label='Phone'
        handleChange={() => {
          /* legacy handler */
        }}
      />
    </Row>
    <Row label='country (legacy defaultCountry)'>
      <PhoneInput id='legacy-4' label='Phone' country='us' />
    </Row>
    <Row label='isV4Design (ignored)'>
      <PhoneInput id='legacy-5' label='Phone' isV4Design />
    </Row>
    <Row label='isMobile (ignored)'>
      <PhoneInput id='legacy-6' label='Phone' isMobile />
    </Row>
  </Section>
);
