import React, { useState } from 'react';
import { Validation, ValidationMessage } from '../src';

export default {
  title: 'm-next/Components/Form/Validation',
  component: Validation,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
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

const StubField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <label style={{ display: 'block', fontSize: 13, color: '#374151' }}>
    <div style={{ marginBottom: 4 }}>{label}</div>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '6px 8px',
        border: '1px solid #BACAD0',
        borderRadius: 4,
        fontSize: 14,
        fontFamily,
      }}
    />
  </label>
);

export const MessageBasic = () => (
  <Section title="ValidationMessage — standalone">
    <Row label="message (string)"><ValidationMessage message="That email is already in use" /></Row>
    <Row label="message (ReactNode)">
      <ValidationMessage
        message={<span>You need to <a href="#x">link a payment method</a> first.</span>}
      />
    </Row>
    <Row label="children alias"><ValidationMessage>Validation via children prop</ValidationMessage></Row>
    <Row label="no message (renders null)"><ValidationMessage /></Row>
  </Section>
);

export const RuleEngine_Required = () => {
  const [value, setValue] = useState('');
  return (
    <Section title="isRequired">
      <Row label="value (try clearing)">
        <StubField label="Name" value={value} onChange={setValue} placeholder="Type something…" />
      </Row>
      <Row label="<Validation>"><Validation value={value} rules={[{ type: 'isRequired' }]} /></Row>
      <Row label="custom message">
        <Validation value={value} rules={[{ type: 'isRequired', customMessage: 'Name is required to proceed.' }]} />
      </Row>
    </Section>
  );
};

export const RuleEngine_Email = () => {
  const [value, setValue] = useState('not-an-email');
  return (
    <Section title="isValidEmail">
      <Row label="value"><StubField label="Email" type="email" value={value} onChange={setValue} placeholder="jane@example.com" /></Row>
      <Row label="<Validation>"><Validation value={value} rules={[{ type: 'isValidEmail' }]} /></Row>
    </Section>
  );
};

export const RuleEngine_Length = () => {
  const [value, setValue] = useState('hi');
  return (
    <Section title="isValidLength">
      <Row label="value (8–64)"><StubField label="Password" type="password" value={value} onChange={setValue} placeholder="At least 8 characters" /></Row>
      <Row label="<Validation>">
        <Validation
          value={value}
          rules={[{ type: 'isValidLength', minLength: 8, maxLength: 64 }]}
        />
      </Row>
      <Row label="min only">
        <Validation value={value} rules={[{ type: 'isValidLength', minLength: 8 }]} />
      </Row>
      <Row label="max only">
        <Validation value={value} rules={[{ type: 'isValidLength', maxLength: 4 }]} />
      </Row>
    </Section>
  );
};

export const RuleEngine_Range = () => {
  const [value, setValue] = useState('150');
  return (
    <Section title="isValidRange">
      <Row label="value (1–100)"><StubField label="Quantity" type="number" value={value} onChange={setValue} /></Row>
      <Row label="<Validation>">
        <Validation
          value={value}
          rules={[{ type: 'isValidRange', minValue: 1, maxValue: 100 }]}
        />
      </Row>
    </Section>
  );
};

export const RuleEngine_Composed = () => {
  const [value, setValue] = useState('');
  return (
    <Section title="Composed rules — first failing wins, in order">
      <Row label="value"><StubField label="Email" type="email" value={value} onChange={setValue} placeholder="Try empty, then 'bad', then 'a@b.cd'" /></Row>
      <Row label="rules">
        <Validation
          value={value}
          rules={[
            { type: 'isRequired' },
            { type: 'isValidEmail' },
            { type: 'isValidLength', maxLength: 64 },
          ]}
        />
      </Row>
    </Section>
  );
};

export const RuleEngine_OnValidation = () => {
  const [value, setValue] = useState('jane@example.com');
  const [isValid, setIsValid] = useState(true);
  return (
    <Section title="onValidation callback">
      <Row label="value"><StubField label="Email" type="email" value={value} onChange={setValue} /></Row>
      <Row label="<Validation>">
        <Validation
          value={value}
          rules={[{ type: 'isRequired' }, { type: 'isValidEmail' }]}
          onValidation={setIsValid}
        />
      </Row>
      <Row label="external state">
        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
          isValid: <strong>{String(isValid)}</strong>
        </span>
      </Row>
    </Section>
  );
};

export const Override_MessageProp = () => {
  const [value, setValue] = useState('jane@example.com');
  return (
    <Section title="Pre-resolved message overrides rule output">
      <Row label="value"><StubField label="Email" value={value} onChange={setValue} /></Row>
      <Row label="rules would pass">
        <Validation
          value={value}
          rules={[{ type: 'isValidEmail' }]}
          message="That email is already in use (server-side check)"
        />
      </Row>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="isV4Design (ignored)">
      <ValidationMessage id="legacy-1" message="Still renders — isV4Design is now silently ignored" isV4Design />
    </Row>
    <Row label="compactStyle (ignored)">
      <ValidationMessage id="legacy-2" message="Still renders — compactStyle is now silently ignored" compactStyle />
    </Row>
    <Row label="isMobile (ignored)">
      <ValidationMessage id="legacy-3" message="Still renders — isMobile is now silently ignored" isMobile />
    </Row>
    <Row label="legacyClass (ignored)">
      <ValidationMessage id="legacy-4" message="Still renders — legacyClass is now silently ignored" legacyClass="old-class" />
    </Row>
    <Row label="forwardRef (warns)">
      <ValidationMessage id="legacy-5" message="forwardRef prop on ValidationMessage warns once" forwardRef={() => {}} />
    </Row>
    <Row label="<Validation> with isV4Design">
      <Validation id="legacy-6" value="" rules={[{ type: 'isRequired' }]} isV4Design />
    </Row>
  </Section>
);
