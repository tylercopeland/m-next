import React, { useState } from 'react';
import Button from '../src';

export default {
  title: 'm-next/Components/Button',
  component: Button,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 140, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>{children}</div>
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

export const Variants = () => (
  <Section title="Variants">
    <Row label="primary">
      <Button variant="primary">Primary</Button>
    </Row>
    <Row label="secondary">
      <Button variant="secondary">Secondary</Button>
    </Row>
    <Row label="ghost">
      <Button variant="ghost">Ghost</Button>
    </Row>
    <Row label="link">
      <Button variant="link">Link button</Button>
    </Row>
  </Section>
);

export const Sizes = () => (
  <div>
    {['primary', 'secondary', 'ghost'].map((variant) => (
      <Section title={`variant="${variant}"`} key={variant}>
        <Row label='size="sm"'>
          <Button variant={variant} size="sm">
            Small
          </Button>
        </Row>
        <Row label='size="md"'>
          <Button variant={variant} size="md">
            Medium (default)
          </Button>
        </Row>
        <Row label='size="lg"'>
          <Button variant={variant} size="lg">
            Large
          </Button>
        </Row>
      </Section>
    ))}
  </div>
);

const PaperIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const WithIcons = () => (
  <div>
    <Section title="leftIcon / rightIcon as ReactNode">
      <Row label="leftIcon">
        <Button leftIcon={<PaperIcon />}>New invoice</Button>
        <Button variant="secondary" leftIcon={<PaperIcon />}>New invoice</Button>
      </Row>
      <Row label="rightIcon">
        <Button rightIcon={<ArrowRight />}>Continue</Button>
        <Button variant="ghost" rightIcon={<ArrowRight />}>Continue</Button>
      </Row>
      <Row label="both">
        <Button leftIcon={<PaperIcon />} rightIcon={<ArrowRight />}>Save and next</Button>
      </Row>
    </Section>
  </div>
);

export const States = () => (
  <Section title="States">
    <Row label="default">
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Save</Button>
      <Button variant="ghost">Save</Button>
    </Row>
    <Row label="disabled">
      <Button variant="primary" disabled>Save</Button>
      <Button variant="secondary" disabled>Save</Button>
      <Button variant="ghost" disabled>Save</Button>
    </Row>
  </Section>
);

export const FullWidth = () => (
  <div style={{ maxWidth: 400, fontFamily }}>
    <p style={{ fontSize: 13, color: '#6b7280' }}>fullWidth fills its container.</p>
    <Button fullWidth>Submit invoice</Button>
    <div style={{ height: 12 }} />
    <Button fullWidth variant="secondary">Save draft</Button>
  </div>
);

export const Accessibility = () => (
  <Section title="ARIA passthrough — props spread to the underlying <button>">
    <Row label="aria-label">
      <Button aria-label="Close dialog" variant="ghost">×</Button>
    </Row>
    <Row label="aria-pressed (toggle)">
      <PressedToggle />
    </Row>
    <Row label="type=submit">
      <Button type="submit">Submit form</Button>
    </Row>
  </Section>
);

const PressedToggle = () => {
  const [pressed, setPressed] = useState(false);
  return (
    <Button
      variant={pressed ? 'primary' : 'secondary'}
      aria-pressed={pressed}
      onClick={() => setPressed((p) => !p)}
    >
      {pressed ? 'Pinned' : 'Pin'}
    </Button>
  );
};

export const RealWorldRow = () => (
  <Section title="Action rows you actually ship">
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </div>
    <div style={{ height: 16 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button variant="link">← Back to invoices</Button>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary">Save draft</Button>
        <Button variant="primary" rightIcon={<ArrowRight />}>Send invoice</Button>
      </div>
    </div>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (warns once in the console, then works)">
    <Row label='value="..."'>
      <Button id="legacy-1" value="Save (legacy value prop)" />
    </Row>
    <Row label='buttonStyle="primary"'>
      <Button id="legacy-2" buttonStyle="primary" value="Legacy buttonStyle" />
    </Row>
    <Row label='size="medium"'>
      <Button id="legacy-3" size="medium" value="Legacy size" />
    </Row>
    <Row label='icon={{ name, position }}'>
      <Button id="legacy-4" icon={{ name: 'email', size: 16, color: 'white', position: 'left' }} value="Legacy icon" />
    </Row>
  </Section>
);
