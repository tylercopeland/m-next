import React from 'react';
import { Link } from '../src';

export default {
  title: 'm-next/Components/Action/Link',
  component: Link,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 120, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>{children}</div>
  </div>
);

export const Variants = () => (
  <div style={{ fontFamily, color: '#374151' }}>
    <Row label='variant="primary"'>
      <Link href="#primary">View invoices</Link>
    </Row>
    <Row label='variant="subtle"'>
      <Link href="#subtle" variant="subtle">
        View invoices
      </Link>
    </Row>
    <Row label='variant="button"'>
      <Link href="#button" variant="button">
        View invoices
      </Link>
    </Row>
  </div>
);

export const External = () => (
  <div style={{ fontFamily, color: '#374151' }}>
    <Row label="primary internal">
      <Link href="/invoices">Invoices</Link>
    </Row>
    <Row label="primary external">
      <Link href="https://example.com" external>
        Method docs
      </Link>
    </Row>
    <Row label="subtle internal">
      <Link href="/invoices" variant="subtle">
        Invoices
      </Link>
    </Row>
    <Row label="subtle external">
      <Link href="https://example.com" variant="subtle" external>
        Method docs
      </Link>
    </Row>
    <Row label="button internal">
      <Link href="/invoices" variant="button">
        Invoices
      </Link>
    </Row>
    <Row label="button external">
      <Link href="https://example.com" variant="button" external>
        Method docs
      </Link>
    </Row>
  </div>
);

export const InlineWithText = () => (
  <div style={{ fontFamily, color: '#374151', maxWidth: 560, lineHeight: 1.6 }}>
    <p>
      The new invoice flow lets you{' '}
      <Link href="/invoices/new">create an invoice in one click</Link> and email it directly to
      your customer. For the historical record, see your{' '}
      <Link href="/invoices" variant="subtle">
        invoice archive
      </Link>
      . Full release notes are in{' '}
      <Link href="https://example.com/changelog" external>
        the changelog
      </Link>
      .
    </p>
  </div>
);

export const StandaloneCTA = () => (
  <div style={{ fontFamily, color: '#374151' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12,
        padding: 24,
        background: '#f9fafb',
        borderRadius: 8,
        maxWidth: 360,
      }}
    >
      <div style={{ fontWeight: 600, color: '#111827' }}>Set up your first workflow</div>
      <div style={{ color: '#6b7280', fontSize: 14 }}>
        Templates get you to a running app in under a minute.
      </div>
      <Link href="/workflows/new" variant="button">
        Browse templates
      </Link>
    </div>
  </div>
);

export const OnDarkBackground = () => (
  <div style={{ fontFamily, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div
      style={{
        width: 200,
        height: 60,
        background: '#111827',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
    >
      <Link href="#primary">Primary link</Link>
    </div>
    <div
      style={{
        width: 200,
        height: 60,
        background: '#111827',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
    >
      <Link href="#subtle" variant="subtle">
        Subtle link
      </Link>
    </div>
  </div>
);
