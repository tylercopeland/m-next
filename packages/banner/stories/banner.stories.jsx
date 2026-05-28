import React, { useState } from 'react';
import Banner from '../src';

export default {
  title: 'm-next/Components/Feedback/Banner',
  component: Banner,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 160, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
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
  <Section title="Basic">
    <Row label="message">
      <Banner>
        You&rsquo;re using a draft version of this screen. To publish this version to all users or revert back to
        the original version click Manage.
      </Banner>
    </Row>
    <Row label="rich children">
      <Banner>
        <span>
          <strong>You&rsquo;re using a draft version of this screen.</strong> To publish or revert back to the
          original version.
        </span>
      </Banner>
    </Row>
  </Section>
);

export const Statuses = () => (
  <Section title="Status">
    <Row label="info (default)">
      <Banner icon="warning-sign">
        Welcome to your new account. Take a look around — anything you create is autosaved.
      </Banner>
    </Row>
    <Row label="success">
      <Banner status="success" icon="check-circle-1-v4">
        12 records are ready for import.
      </Banner>
    </Row>
    <Row label="warning">
      <Banner status="warning" icon="warning-sign">
        Your trial ends in 3 days. Add a payment method to keep your data.
      </Banner>
    </Row>
    <Row label="error">
      <Banner status="error" icon="warning-sign">
        2 records have conflicts. These issues must be addressed before moving forward.
      </Banner>
    </Row>
  </Section>
);

export const WithActions = () => {
  const [count, setCount] = useState(0);
  return (
    <Section title="Actions">
      <Row label="primary only">
        <Banner
          primaryButton="Learn more"
          onPrimaryButtonClick={() => setCount((c) => c + 1)}
          variant="trailing"
        >
          You&rsquo;re using a draft version of this screen.
        </Banner>
      </Row>
      <Row label="primary + secondary">
        <Banner
          primaryButton="Manage"
          secondaryButton="Make live"
          onPrimaryButtonClick={() => setCount((c) => c + 1)}
          onSecondaryButtonClick={() => setCount((c) => c + 1)}
        >
          You&rsquo;re using a draft version of this screen. To publish or revert back to the original version
          click Manage.
        </Banner>
      </Row>
      <Row label="error + action">
        <Banner status="error" primaryButton="Resolve conflicts">
          2 records have conflicts. These issues must be addressed before moving forward.
        </Banner>
      </Row>
      <Row label="click count">
        <span style={{ fontFamily: 'monospace' }}>{count}</span>
      </Row>
    </Section>
  );
};

export const Closeable = () => {
  const [visible, setVisible] = useState({ a: true, b: true });
  return (
    <Section title="Close button (real <button> with aria-label)">
      {visible.a && (
        <Row label="info + close">
          <Banner hasClose onClose={() => setVisible((v) => ({ ...v, a: false }))}>
            You&rsquo;re using a draft version of this screen.
          </Banner>
        </Row>
      )}
      {visible.b && (
        <Row label="error + close">
          <Banner
            status="error"
            icon="warning-sign"
            hasClose
            onClose={() => setVisible((v) => ({ ...v, b: false }))}
          >
            Your last import failed. Try again or contact support.
          </Banner>
        </Row>
      )}
      <Row label="reset">
        <button type="button" onClick={() => setVisible({ a: true, b: true })}>
          Reset
        </button>
      </Row>
    </Section>
  );
};

export const WithIcon = () => (
  <Section title="Icon slot">
    <Row label="info">
      <Banner icon="mi-icon-cloud-download-V4" primaryButton="Download template" variant="full">
        <p style={{ margin: 0 }}>
          <b>Template</b> &mdash; download our leads template to help organize your file before importing.
        </p>
      </Banner>
    </Row>
    <Row label="success + icon">
      <Banner status="success" icon="check-circle-1-v4" primaryButton="View import">
        12 records are ready for import.
      </Banner>
    </Row>
    <Row label="error + icon">
      <Banner status="error" icon="warning-sign" primaryButton="Learn more">
        2 records with conflicts. These issues must be addressed before moving forward.
      </Banner>
    </Row>
  </Section>
);

export const Variants = () => (
  <Section title="Variant: full vs trailing">
    <Row label="full (default)">
      <Banner variant="full" primaryButton="Manage">
        Message grows to fill the row; action sits at the end.
      </Banner>
    </Row>
    <Row label="trailing">
      <Banner variant="trailing" primaryButton="Manage">
        Message stays tight against the action.
      </Banner>
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="message prop">
      <Banner id="legacy-1" message="Old `message` prop still renders as children." />
    </Row>
    <Row label="severity='informational'">
      <Banner id="legacy-2" severity="informational" message="Old `severity` → new `status` (mapped to info)." />
    </Row>
    <Row label="severity='error'">
      <Banner id="legacy-3" severity="error" icon="warning-sign" message="Severity error still works." />
    </Row>
    <Row label="severity='clear'">
      <Banner id="legacy-4" severity="clear" message="Legacy 'clear' folds into 'info'." />
    </Row>
    <Row label="severity='loading'">
      <Banner id="legacy-5" severity="loading" message="Legacy 'loading' folds into 'info'." />
    </Row>
    <Row label="bannerStyle='trailing'">
      <Banner id="legacy-6" bannerStyle="trailing" primaryButton="Action" message="`bannerStyle` → `variant`." />
    </Row>
    <Row label="hasClose (a11y)">
      <Banner id="legacy-7" hasClose message="Close button is now a real <button aria-label='Close'>." />
    </Row>
  </Section>
);
