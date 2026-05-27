import React, { useState } from 'react';
import MultiSelect from '../src';

export default {
  title: 'm-next/Components/MultiSelect',
  component: MultiSelect,
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

export const Basic = () => (
  <Section title="Free-text entry">
    <Row label="empty">
      <MultiSelect placeholder="Add tags..." />
    </Row>
    <Row label="prefilled options">
      <MultiSelect options={['design', 'system', 'audit']} placeholder="Add another tag..." />
    </Row>
    <Row label="all pills deletable">
      <MultiSelect
        options={['alpha', 'beta', 'gamma']}
        placeholder="Add..."
        areAllPillsDeletable
      />
    </Row>
  </Section>
);

export const EmailMode = () => {
  const [error, setError] = useState('');
  return (
    <Section title="Email mode (validates + dedupes)">
      <Row label="basic">
        <MultiSelect
          type="email"
          placeholder="first.last@mail.com, comma-separated..."
          options={['a.smith@method.me', 'j.biden@method.me']}
          onError={setError}
        />
      </Row>
      <Row label="with conflicts">
        <MultiSelect
          type="email"
          placeholder="Try: taken@example.com"
          existingEmails={['taken@example.com']}
          tenantEmails={['other@tenant.com']}
          onError={setError}
        />
      </Row>
      {error ? (
        <Row label="last error">
          <div style={{ color: '#A10007', fontSize: 13 }}>{error}</div>
        </Row>
      ) : null}
    </Section>
  );
};

export const DropdownMode = () => (
  <Section title="Dropdown picker">
    <Row label="default">
      <MultiSelect
        isDropdown
        placeholder=""
        options={['Current tenant']}
        dropdownOptions={['Tenant 2', 'Tenant 3', 'Tenant 4', 'Tenant 5', 'Tenant 6']}
        height="fit-content"
      />
    </Row>
    <Row label="all deletable">
      <MultiSelect
        isDropdown
        placeholder="Add value..."
        dropdownOptions={['Apples', 'Bananas', 'Cherries', 'Durian']}
        height="fit-content"
        areAllPillsDeletable
      />
    </Row>
  </Section>
);

export const ControlledHeight = () => (
  <Section title="Custom height">
    <Row label="height=60px">
      <MultiSelect placeholder="Tight..." height="60px" />
    </Row>
    <Row label="height=160px">
      <MultiSelect placeholder="Roomy..." height="160px" />
    </Row>
  </Section>
);

export const Callbacks = () => {
  const [log, setLog] = useState([]);
  const append = (line) => setLog((l) => [line, ...l].slice(0, 8));
  return (
    <Section title="onChange / onDelete / onError">
      <Row label="email + log">
        <MultiSelect
          type="email"
          placeholder="Type emails, press Enter or comma..."
          existingEmails={['taken@example.com']}
          onChange={(v) => append(`onChange: ${v}`)}
          onDelete={(v, isValid) => append(`onDelete: ${v} (valid=${isValid})`)}
          onError={(m) => append(`onError: ${m.trim()}`)}
        />
      </Row>
      <Row label="event log">
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151' }}>
          {log.length === 0 ? <em>(empty)</em> : log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </Row>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="inputType=email">
      <MultiSelect
        id="legacy-1"
        inputType="email"
        placeholder="Legacy inputType prop"
        options={['a@example.com']}
      />
    </Row>
    <Row label="onSelect">
      <MultiSelect
        id="legacy-2"
        placeholder="Legacy onSelect callback"
        onSelect={(v) => console.log('legacy onSelect:', v)}
      />
    </Row>
    <Row label="isMobile / fullSize (ignored)">
      <MultiSelect
        id="legacy-3"
        placeholder="isMobile + fullSize no longer apply"
        isMobile
        fullSize
      />
    </Row>
  </Section>
);
