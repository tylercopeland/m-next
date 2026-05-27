import React, { useState } from 'react';
import { ToastProvider, useToast } from '../src';

export default {
  title: 'm-next/Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 14px',
  background: '#fff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: 4,
  fontFamily,
  fontSize: 14,
  cursor: 'pointer',
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: '#0D71C8',
  borderColor: '#0D71C8',
  color: '#fff',
};

const Panel = ({ children, note }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 640,
      padding: 24,
      border: '1px dashed #d1d5db',
      borderRadius: 8,
      background: '#f9fafb',
      fontFamily,
      color: '#374151',
    }}
  >
    {note ? (
      <div style={{ fontSize: 13, color: '#6b7280' }}>{note}</div>
    ) : null}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
  </div>
);

// --- Default ---------------------------------------------------------------

const DefaultControls = () => {
  const toast = useToast();
  return (
    <Panel note="Click a button to fire a toast. Position: top-right (default).">
      <button type="button" style={buttonStyle} onClick={() => toast.info('New comment on Invoice #1043.')}>
        Fire info
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.success('Invoice saved.')}>
        Fire success
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.warning('You have unsaved changes.')}>
        Fire warning
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.error('Could not reach the server.')}>
        Fire error
      </button>
    </Panel>
  );
};

export const Default = () => (
  <ToastProvider>
    <DefaultControls />
  </ToastProvider>
);

// --- Positions -------------------------------------------------------------

const PositionControls = () => {
  const toast = useToast();
  return (
    <Panel note="Use the position picker above the panel to remount the provider, then fire toasts.">
      <button type="button" style={buttonStyle} onClick={() => toast.info('Info toast')}>
        Fire info
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.success('Success toast')}>
        Fire success
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.error('Error toast')}>
        Fire error
      </button>
    </Panel>
  );
};

const POSITIONS = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
];

export const Positions = () => {
  const [position, setPosition] = useState('top-right');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {POSITIONS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPosition(p)}
            style={p === position ? primaryButtonStyle : buttonStyle}
          >
            {p}
          </button>
        ))}
      </div>
      <ToastProvider key={position} position={position}>
        <PositionControls />
      </ToastProvider>
    </div>
  );
};

// --- WithTitle -------------------------------------------------------------

const WithTitleControls = () => {
  const toast = useToast();
  return (
    <Panel>
      <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          toast.success('Invoice #1043 was saved and emailed to the customer.', {
            title: 'Invoice saved',
          })
        }
      >
        Success with title
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          toast.error('The server returned a 500 error. Try again in a moment.', {
            title: "Couldn't save invoice",
          })
        }
      >
        Error with title
      </button>
    </Panel>
  );
};

export const WithTitle = () => (
  <ToastProvider>
    <WithTitleControls />
  </ToastProvider>
);

// --- WithAction ------------------------------------------------------------

const ActionLink = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: 'transparent',
      border: 'none',
      padding: 0,
      color: '#0D71C8',
      cursor: 'pointer',
      fontFamily,
      fontSize: 14,
      fontWeight: 600,
      textDecoration: 'underline',
    }}
  >
    {children}
  </button>
);

const WithActionControls = () => {
  const toast = useToast();
  return (
    <Panel>
      <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          toast.error('Could not connect to the server.', {
            title: 'Connection lost',
            duration: null,
            action: (
              <ActionLink onClick={() => toast.success('Retried — connection restored.')}>
                Retry
              </ActionLink>
            ),
          })
        }
      >
        Error with Retry action
      </button>
    </Panel>
  );
};

export const WithAction = () => (
  <ToastProvider>
    <WithActionControls />
  </ToastProvider>
);

// --- Persistent -----------------------------------------------------------

const PersistentControls = () => {
  const toast = useToast();
  const [id, setId] = useState(null);
  return (
    <Panel note="duration={null} keeps the toast until manually dismissed.">
      <button
        type="button"
        style={buttonStyle}
        onClick={() => {
          const newId = toast.info('Sync in progress — this will stay until you dismiss it.', {
            title: 'Long-running operation',
            duration: null,
          });
          setId(newId);
        }}
      >
        Fire persistent toast
      </button>
      <button
        type="button"
        style={buttonStyle}
        disabled={!id}
        onClick={() => {
          if (id) toast.dismiss(id);
          setId(null);
        }}
      >
        Dismiss by id
      </button>
    </Panel>
  );
};

export const Persistent = () => (
  <ToastProvider>
    <PersistentControls />
  </ToastProvider>
);

// --- MultipleStacked ------------------------------------------------------

const StackedControls = () => {
  const toast = useToast();
  return (
    <Panel note="Click to fire 7 toasts in quick succession — only the most recent 5 stay (maxToasts=5).">
      <button
        type="button"
        style={buttonStyle}
        onClick={() => {
          toast.info('Toast 1');
          toast.success('Toast 2');
          toast.warning('Toast 3');
          toast.info('Toast 4');
          toast.success('Toast 5');
          toast.warning('Toast 6');
          toast.info('Toast 7 — toasts 1 and 2 should already be gone.');
        }}
      >
        Fire 7 toasts
      </button>
      <button type="button" style={buttonStyle} onClick={() => toast.dismissAll()}>
        Dismiss all
      </button>
    </Panel>
  );
};

export const MultipleStacked = () => (
  <ToastProvider maxToasts={5}>
    <StackedControls />
  </ToastProvider>
);

// --- LongContent ----------------------------------------------------------

const LongContentControls = () => {
  const toast = useToast();
  return (
    <Panel>
      <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          toast.warning(
            "We've detected several scheduled invoices that reference a deleted customer. Open the scheduler to choose a replacement customer or remove the affected invoices — they won't send until this is resolved.",
            {
              title: 'Scheduled invoices need attention',
              duration: 12000,
            }
          )
        }
      >
        Fire long toast
      </button>
    </Panel>
  );
};

export const LongContent = () => (
  <ToastProvider>
    <LongContentControls />
  </ToastProvider>
);
