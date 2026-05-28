import React from 'react';
import { EmptyState } from '../src';

export default {
  title: 'm-next/Components/Feedback/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const PrimaryButton = ({ children, ...rest }) => (
  <button
    type="button"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: '#0D71C8',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      fontFamily,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
    }}
    {...rest}
  >
    {children}
  </button>
);

const SecondaryButton = ({ children, ...rest }) => (
  <button
    type="button"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      background: 'transparent',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: 4,
      fontFamily,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
    }}
    {...rest}
  >
    {children}
  </button>
);

const VariantLabel = ({ children }) => (
  <div
    style={{
      fontFamily: 'monospace',
      fontSize: 13,
      color: '#6b7280',
      marginBottom: 8,
    }}
  >
    {children}
  </div>
);

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
    <div>
      <VariantLabel>variant=&quot;subtle&quot; (default)</VariantLabel>
      <EmptyState
        title="No invoices yet"
        description="Once you create an invoice, it will show up here."
        action={<PrimaryButton>New invoice</PrimaryButton>}
      />
    </div>
    <div>
      <VariantLabel>variant=&quot;bordered&quot;</VariantLabel>
      <EmptyState
        variant="bordered"
        title="No invoices yet"
        description="Once you create an invoice, it will show up here."
        action={<PrimaryButton>New invoice</PrimaryButton>}
      />
    </div>
    <div>
      <VariantLabel>variant=&quot;banner&quot;</VariantLabel>
      <EmptyState
        variant="banner"
        title="No invoices yet"
        description="Once you create an invoice, it will show up here."
        action={<PrimaryButton>New invoice</PrimaryButton>}
      />
    </div>
  </div>
);

const ClipboardIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="8" y="3" width="8" height="4" rx="1" />
    <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);

export const WithIcon = () => (
  <EmptyState
    variant="bordered"
    icon={<ClipboardIcon />}
    title="No invoices yet"
    description="Once you create an invoice, it will show up here."
    action={<PrimaryButton>New invoice</PrimaryButton>}
  />
);

export const WithoutAction = () => (
  <EmptyState
    variant="bordered"
    title="No activity in the last 30 days"
    description="Activity will appear here as your team works in the app."
  />
);

export const SearchNoResults = () => (
  <EmptyState
    variant="bordered"
    icon="🔍"
    title="No invoices match your search"
    description="Try a different search term or clear filters to see all invoices."
    action={<SecondaryButton>Clear filters</SecondaryButton>}
  />
);

export const Minimal = () => <EmptyState title="Nothing here yet" />;
