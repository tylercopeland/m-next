import React, { useState } from 'react';
import AddressLookup, { AddressLookupOption } from '../src/AddressLookup';

export default {
  title: 'm-next/Components/Form/AddressLookup',
  component: AddressLookup,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 180, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 480 }}>{children}</div>
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

// The component reaches out to a gateway URL for ipgeo + Mapbox suggestions.
// In Storybook there is no real gateway, so we leave gatewayUrl empty and the
// ipgeo fetch silently no-ops. Mapbox calls fail open and just return no suggestions.
const sandboxGatewayUrl = '';

const Demo = (props: React.ComponentProps<typeof AddressLookup>) => {
  const [selected, setSelected] = useState<AddressLookupOption | null>(null);
  return (
    <div>
      <AddressLookup
        gatewayUrl={sandboxGatewayUrl}
        {...props}
        onChange={(option) => {
          setSelected(option);
          if (props.onChange) props.onChange(option);
        }}
      />
      {selected && (
        <pre
          style={{
            marginTop: 12,
            background: '#F6FAFB',
            color: '#2A394A',
            padding: 12,
            fontSize: 12,
            borderRadius: 4,
          }}
        >
          {JSON.stringify(
            {
              label: selected.label,
              streetAddress: selected.streetAddress,
              city: selected.city,
              stateProvince: selected.stateProvince,
              zipPostalCode: selected.zipPostalCode,
              country: selected.country,
              longitude: selected.longitude,
              latitude: selected.latitude,
            },
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
};

export const Basic = () => (
  <Section title='Basic'>
    <Row label='default'>
      <Demo label='Address' placeholder='Search for an address…' width={400} />
    </Row>
    <Row label='no label'>
      <Demo placeholder='Search for an address…' width={400} />
    </Row>
  </Section>
);

export const States = () => (
  <Section title='States'>
    <Row label='required'>
      <Demo label='Billing address' required placeholder='Search…' width={400} />
    </Row>
    <Row label='disabled'>
      <Demo label='Billing address' disabled placeholder='Locked' width={400} />
    </Row>
    <Row label='errorMessage'>
      <Demo
        label='Shipping address'
        errorMessage='Please enter a valid address'
        placeholder='Search…'
        width={400}
      />
    </Row>
  </Section>
);

export const MenuPlacement = () => (
  <Section title='Menu placement'>
    <Row label='auto (default)'>
      <Demo label='Address' placeholder='Search…' width={400} />
    </Row>
    <Row label='top'>
      <Demo label='Address' placeholder='Search…' width={400} menuPlacement='top' />
    </Row>
    <Row label='bottom'>
      <Demo label='Address' placeholder='Search…' width={400} menuPlacement='bottom' />
    </Row>
  </Section>
);

export const RealWorldForm = () => {
  const [selected, setSelected] = useState<AddressLookupOption | null>(null);
  return (
    <Section title='In a checkout-style form'>
      <div style={{ maxWidth: 480 }}>
        <AddressLookup
          label='Shipping address'
          placeholder='Start typing an address…'
          required
          width='100%'
          gatewayUrl={sandboxGatewayUrl}
          onChange={setSelected}
        />
        {selected && (
          <div style={{ marginTop: 12, fontFamily, fontSize: 14, color: '#2A394A' }}>
            <div><strong>{selected.streetAddress || selected.label}</strong></div>
            <div>
              {[selected.city, selected.stateProvince, selected.zipPostalCode].filter(Boolean).join(', ')}
            </div>
            <div>{selected.country}</div>
          </div>
        )}
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
    <Row label='caption'>
      <AddressLookup
        id='legacy-1'
        caption='Legacy caption prop'
        placeholder='Search…'
        gatewayUrl={sandboxGatewayUrl}
      />
    </Row>
    <Row label='validationMessage + isValid'>
      <AddressLookup
        id='legacy-2'
        caption='Old API still renders'
        isValid={false}
        validationMessage='Legacy validation message'
        placeholder='Search…'
        gatewayUrl={sandboxGatewayUrl}
      />
    </Row>
    <Row label='isV4Design / legacyClass (ignored)'>
      <AddressLookup
        id='legacy-3'
        label='Ignored ghosts'
        isV4Design
        legacyClass='legacy-class'
        displayAuto
        compactStyle
        isMobile
        placeholder='Search…'
        gatewayUrl={sandboxGatewayUrl}
      />
    </Row>
  </Section>
);
