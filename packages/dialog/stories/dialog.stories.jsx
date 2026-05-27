import React, { useState } from 'react';
import Dialog from '../src';

export default {
  title: 'm-next/Components/Dialog',
  component: Dialog,
  parameters: { layout: 'fullscreen' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 32, padding: 16, fontFamily }}>
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#374151',
        marginBottom: 12,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 0', fontFamily }}>
    <div style={{ width: 220, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div>{children}</div>
  </div>
);

const TriggerButton = ({ onClick, children }) => (
  <button
    type='button'
    onClick={onClick}
    style={{
      padding: '8px 12px',
      border: '1px solid #BACAD0',
      borderRadius: 4,
      background: '#fff',
      cursor: 'pointer',
      fontFamily,
      fontSize: 14,
    }}
  >
    {children}
  </button>
);

const Demo = ({ buttonLabel, ...dialogProps }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TriggerButton onClick={() => setOpen(true)}>{buttonLabel}</TriggerButton>
      <Dialog {...dialogProps} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const Basic = () => (
  <Section title='Basic dialog'>
    <Row label='title + body'>
      <Demo
        buttonLabel='Open basic dialog'
        title='Leave without saving?'
      >
        <div>You have unsaved changes. Leaving now will discard them.</div>
      </Demo>
    </Row>
  </Section>
);

export const WithFooter = () => (
  <Section title='Dialog with footer buttons'>
    <Row label='primary + secondary'>
      <Demo
        buttonLabel='Confirm dismiss'
        title='Leave app builder without saving'
        footer={{
          primaryButtonLabel: "Don't save and close",
          secondaryButtonLabel: 'Cancel',
          onPrimaryButtonClick: () => {},
          onSecondaryButtonClick: () => {},
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>You have not saved this screen since you last made changes to it.</span>
          <span>Leaving the app builder without saving will result in your changes being lost.</span>
        </div>
      </Demo>
    </Row>
  </Section>
);

export const AlertDialog = () => (
  <Section title='Alert dialog (destructive confirms)'>
    <Row label='role="alertdialog"'>
      <Demo
        buttonLabel='Delete account'
        role='alertdialog'
        title='Delete account?'
        footer={{
          primaryButtonLabel: 'Delete account',
          primaryVariant: 'critical',
          secondaryButtonLabel: 'Cancel',
          onPrimaryButtonClick: () => {},
          onSecondaryButtonClick: () => {},
        }}
      >
        <div>This action cannot be undone. All data associated with this account will be permanently removed.</div>
      </Demo>
    </Row>
  </Section>
);

export const HideDismissButton = () => (
  <Section title='No header dismiss button'>
    <Row label='hideDismissButton'>
      <Demo
        buttonLabel='Open forced-confirm'
        title='Verify your email'
        hideDismissButton
        footer={{
          primaryButtonLabel: 'Continue',
          onPrimaryButtonClick: () => {},
        }}
      >
        <div>We sent a confirmation link to jane@example.com. Please verify before continuing.</div>
      </Demo>
    </Row>
  </Section>
);

export const SizingOptions = () => (
  <Section title='Width and maxHeight'>
    <Row label='width={400}'>
      <Demo buttonLabel='Narrow' title='Narrow dialog' width={400}>
        <div>Width set to 400px.</div>
      </Demo>
    </Row>
    <Row label='width={900}'>
      <Demo buttonLabel='Wide' title='Wide dialog' width={900}>
        <div>Width set to 900px.</div>
      </Demo>
    </Row>
    <Row label='maxHeight={240}'>
      <Demo buttonLabel='Scrollable body' title='Scrolling body' maxHeight={240}>
        <div>
          {Array.from({ length: 30 }).map((_, i) => (
            <p key={i}>Paragraph #{i + 1} — body content overflows and scrolls.</p>
          ))}
        </div>
      </Demo>
    </Row>
  </Section>
);

export const CustomComposition = () => (
  <Section title='Custom composition (hideDefault*)'>
    <Row label='hideDefaultHeader'>
      <Demo
        buttonLabel='Custom header'
        hideDefaultHeader
      >
        <div style={{ padding: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Fully custom header</h2>
          <p>Renders `children` directly with no default header chrome.</p>
        </div>
      </Demo>
    </Row>
    <Row label='hideDefaultBody'>
      <Demo
        buttonLabel='Custom body'
        title='Custom body wrapper'
        hideDefaultBody
      >
        <div style={{ padding: 32, background: '#EEF5F7' }}>
          Renders without the default body padding/scroll wrapper.
        </div>
      </Demo>
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
    <Row label='forwardRef={ref} (deprecated)'>
      <Demo
        buttonLabel='Open legacy dialog'
        id='legacy-dialog-1'
        title='Legacy API still renders'
        forwardRef={React.createRef()}
      >
        <div>This dialog received the deprecated `forwardRef` prop; check the console for the warning.</div>
      </Demo>
    </Row>
    <Row label='isV4Design / isMobile / legacyClass (silently ignored)'>
      <Demo
        buttonLabel='Open legacy ghosts'
        id='legacy-dialog-2'
        title='Silently-ignored legacy props'
        isV4Design
        isMobile
        legacyClass='something-old'
      >
        <div>These props are accepted (no warn) but have no behavioral effect.</div>
      </Demo>
    </Row>
  </Section>
);
