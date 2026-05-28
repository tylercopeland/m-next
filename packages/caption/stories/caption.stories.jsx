import React, { useState } from 'react';
import Caption from '../src';

export default {
  title: 'm-next/Components/Form/Caption',
  component: Caption,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
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

// A simulated input shell so floating-label stories make visual sense.
const InputShell = ({ children, focused }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: 40,
      border: `1px solid ${focused ? '#0D71C8' : '#BACAD0'}`,
      borderRadius: 4,
      paddingTop: 14,
      paddingLeft: 8,
      boxSizing: 'border-box',
      transition: 'border-color 150ms ease',
    }}
  >
    {children}
  </div>
);

// ============ Stories ============

export const Basic = () => (
  <Section title="Plain label">
    <Row label="label"><Caption label="Free cupcakes" /></Row>
    <Row label="required"><Caption label="Free cupcakes" required /></Row>
    <Row label="htmlFor (bound)">
      <>
        <Caption label="Email address" htmlFor="email-demo" required />
        <input id="email-demo" type="email" placeholder="jane@example.com" style={{ display: 'block', marginTop: 4, padding: '6px 8px', width: '100%', boxSizing: 'border-box' }} />
      </>
    </Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><Caption label="Account name" /></Row>
    <Row label="disabled"><Caption label="Account name" disabled /></Row>
    <Row label="readOnly"><Caption label="Account ID" readOnly /></Row>
    <Row label="invalid"><Caption label="Email" isValid={false} /></Row>
    <Row label="required + invalid"><Caption label="Email" required isValid={false} /></Row>
  </Section>
);

export const Alignment = () => (
  <Section title="Alignment">
    <Row label="left (default)"><Caption label="Label content" align="left" /></Row>
    <Row label="center"><Caption label="Label content" align="center" /></Row>
    <Row label="right"><Caption label="Label content" align="right" /></Row>
  </Section>
);

export const FloatingLabel = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const float = focused || Boolean(value);
  return (
    <Section title='Floating-label mode (float / focused / floatYPos)'>
      <Row label="float=false (inline)">
        <InputShell focused={false}>
          <Caption label="Email" float={false} />
        </InputShell>
      </Row>
      <Row label="float=true (above)">
        <InputShell focused>
          <Caption label="Email" float focused />
        </InputShell>
      </Row>
      <Row label="float=true + invalid">
        <InputShell focused={false}>
          <Caption label="Email" float isValid={false} />
        </InputShell>
      </Row>
      <Row label="interactive (focus / type)">
        <InputShell focused={focused}>
          <Caption label="Email" float={float} focused={focused} />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              position: 'absolute',
              left: 8,
              bottom: 6,
              right: 8,
              top: 18,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily,
              fontSize: 14,
            }}
          />
        </InputShell>
      </Row>
    </Section>
  );
};

export const ReactNodeLabel = () => (
  <Section title="ReactNode label (no dangerouslySetInnerHTML)">
    <Row label="bold + icon">
      <Caption
        label={
          <span>
            <strong>Important:</strong> read this <span aria-hidden style={{ marginLeft: 4 }}>⚡</span>
          </span>
        }
      />
    </Row>
    <Row label="link inside">
      <Caption
        label={
          <span>
            By continuing you agree to our <a href="#terms">terms</a>.
          </span>
        }
      />
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="caption (str)">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Caption id="legacy-1" caption="Old prop name" />
    </Row>
    <Row label="elFor">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Caption id="legacy-2" label="Bound the legacy way" elFor="legacy-input" />
    </Row>
    <Row label="readonly (lowercase)">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Caption id="legacy-3" label="Lowercase readonly" readonly />
    </Row>
    <Row label="legacyClass">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Caption id="legacy-4" label="Old class-based styling" legacyClass="mi-caption-primary mi-caption-font-small" />
    </Row>
    <Row label="silently ignored ghosts">
      <Caption
        id="legacy-5"
        label="Ghosts (no warning, no effect)"
        // eslint-disable-next-line react/no-unknown-property
        isV4Design
        // eslint-disable-next-line react/no-unknown-property
        isMobile
        // eslint-disable-next-line react/no-unknown-property
        isLabelBolded
        // eslint-disable-next-line react/no-unknown-property
        background="#FFEA80"
      />
    </Row>
  </Section>
);
