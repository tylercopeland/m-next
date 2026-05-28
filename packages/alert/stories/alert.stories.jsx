import React, { useState } from 'react';
import { Alert } from '../src';

export default {
  title: 'm-next/Components/Feedback/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Stack = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640, fontFamily }}>
    {children}
  </div>
);

export const AllStatuses = () => (
  <Stack>
    <Alert status="info" title="Heads up">
      Your subscription renews on the 1st of next month.
    </Alert>
    <Alert status="success" title="Invoice saved">
      Invoice #1043 was saved and emailed to the customer.
    </Alert>
    <Alert status="warning" title="Unsaved changes">
      You have unsaved edits — navigating away will discard them.
    </Alert>
    <Alert status="error" title="Couldn't save invoice">
      The server returned a 500 error. Please try again in a moment.
    </Alert>
  </Stack>
);

export const WithoutTitle = () => (
  <Stack>
    <Alert status="info">Your subscription renews on the 1st.</Alert>
    <Alert status="success">Invoice saved.</Alert>
    <Alert status="warning">You have unsaved changes.</Alert>
    <Alert status="error">Couldn't reach the server.</Alert>
  </Stack>
);

const DismissibleAlert = ({ status, title, children }) => {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <div style={{ fontFamily, fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>
        {status} alert dismissed —{' '}
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: '#0D71C8',
            cursor: 'pointer',
            fontFamily,
            fontSize: 13,
            textDecoration: 'underline',
          }}
        >
          restore
        </button>
      </div>
    );
  }
  return (
    <Alert status={status} title={title} onDismiss={() => setOpen(false)}>
      {children}
    </Alert>
  );
};

export const WithDismiss = () => (
  <Stack>
    <DismissibleAlert status="info" title="Heads up">
      Your subscription renews on the 1st of next month.
    </DismissibleAlert>
    <DismissibleAlert status="success" title="Invoice saved">
      Invoice #1043 was saved and emailed to the customer.
    </DismissibleAlert>
    <DismissibleAlert status="warning" title="Unsaved changes">
      You have unsaved edits — navigating away will discard them.
    </DismissibleAlert>
    <DismissibleAlert status="error" title="Couldn't save invoice">
      The server returned a 500 error. Please try again in a moment.
    </DismissibleAlert>
  </Stack>
);

const retryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 12px',
  background: '#DC2626',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontFamily,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const linkStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#047857',
  fontFamily,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
};

export const WithAction = () => (
  <Stack>
    <Alert
      status="error"
      title="Couldn't save invoice"
      action={
        <button type="button" style={retryButtonStyle} onClick={() => {}}>
          Retry
        </button>
      }
    >
      The server returned a 500 error. We'll keep your changes locally.
    </Alert>
    <Alert
      status="success"
      title="Invoice saved"
      action={
        <button type="button" style={linkStyle} onClick={() => {}}>
          View details
        </button>
      }
    >
      Invoice #1043 was saved and emailed to the customer.
    </Alert>
  </Stack>
);

export const LongContent = () => (
  <Stack>
    <Alert status="warning" title="Migration in progress">
      <p style={{ margin: '0 0 8px' }}>
        We're upgrading the invoice engine across all accounts. During the migration, you may see
        delays of up to a minute when saving invoices, and some reports will be unavailable for
        short windows.
      </p>
      <p style={{ margin: '0 0 8px' }}>
        Your data is safe and no action is required on your part. If you have automations that
        depend on real-time invoice events, consider pausing them until the migration completes.
      </p>
      <p style={{ margin: 0 }}>
        We expect the upgrade to finish within the next 4 hours. We'll send a follow-up email when
        everything is back to normal.
      </p>
    </Alert>
  </Stack>
);
