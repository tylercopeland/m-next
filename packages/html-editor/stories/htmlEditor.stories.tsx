import * as React from 'react';
import HtmlEditor from '../src';

export default {
  title: 'm-next/Components/Form/HtmlEditor',
  component: HtmlEditor,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

// Stories run outside the real Method runtime, so we provide a stub auth
// context. Image uploads will fail (no real backend) but the editor mounts
// and is fully editable for keyboard / formatting demo purposes.
const mockAuthContext = {
  account: 'storybook',
  authToken: 'sb-token',
  identity: 'sb-identity',
  runtimeCoreUrl: 'https://example.invalid',
  secureToken: 'sb-secure',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
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

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: '12px 0',
      fontFamily,
    }}
  >
    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div>{children}</div>
  </div>
);

export const Basic = () => (
  <Section title='Empty editor'>
    <Row label='default'>
      <HtmlEditor
        id='basic-default'
        authContext={mockAuthContext}
        caption='Notes'
        height='180px'
        width='100%'
      />
    </Row>
    <Row label='with placeholder text only (data is empty)'>
      <HtmlEditor
        id='basic-placeholder'
        authContext={mockAuthContext}
        caption='Description'
        placeholder='Type something rich here…'
        height='180px'
        width='100%'
      />
    </Row>
  </Section>
);

export const WithContent = () => (
  <Section title='Pre-populated HTML'>
    <Row label='simple paragraph'>
      <HtmlEditor
        id='content-simple'
        authContext={mockAuthContext}
        caption='Bio'
        data='<p>A short bio with <strong>bold</strong> and <em>italic</em> text.</p>'
        height='180px'
        width='100%'
      />
    </Row>
    <Row label='rich content (headings, lists, link, blockquote)'>
      <HtmlEditor
        id='content-rich'
        authContext={mockAuthContext}
        caption='Article body'
        data={`
          <h2>Onboarding checklist</h2>
          <p>Complete the following before your first call:</p>
          <ul>
            <li>Verify your <strong>account email</strong>.</li>
            <li>Connect <em>QuickBooks</em>.</li>
            <li>Invite at least one teammate.</li>
          </ul>
          <blockquote>Tip: you can revisit any of these from Settings.</blockquote>
          <p>See the <a href='https://method.me'>Method help center</a> for more.</p>
        `}
        height='280px'
        width='100%'
      />
    </Row>
  </Section>
);

export const DisabledAndValidation = () => (
  <Section title='Disabled and validation states'>
    <Row label='disabled (read-only)'>
      <HtmlEditor
        id='state-disabled'
        authContext={mockAuthContext}
        caption='Locked notes'
        data='<p>This editor is disabled. Toolbar still renders, but content cannot be edited.</p>'
        disabled
        height='180px'
        width='100%'
      />
    </Row>
    <Row label='required + validationMessage'>
      <HtmlEditor
        id='state-error'
        authContext={mockAuthContext}
        caption='Description'
        required
        validationMessage='Description is required.'
        height='180px'
        width='100%'
      />
    </Row>
    <Row label='isV4Design (kept as a real prop — adjusts wrapper margin)'>
      <HtmlEditor
        id='state-v4'
        authContext={mockAuthContext}
        caption='V4 spacing'
        isV4Design
        data='<p>Wrapper picks up the V4 margin treatment, and the validation row inherits the V4 layout below.</p>'
        validationMessage='V4 design also styles this message.'
        height='180px'
        width='100%'
      />
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => {
  // Soft-shimmed: the deprecated `forwardRef` prop still chains onto the
  // wrapper element. Each first use of a deprecated prop emits one
  // console.warn — modeled on @m-next/input.
  const legacyRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <Section title='Backwards-compat shim (fires one console.warn at first use)'>
      <Row label='forwardRef prop (deprecated — use React ref directly)'>
        <HtmlEditor
          id='legacy-forwardref'
          authContext={mockAuthContext}
          caption='Legacy ref attachment'
          data='<p>This editor still accepts the old <code>forwardRef</code> prop. It is chained onto the internal wrapper alongside the modern <code>ref</code>.</p>'
          forwardRef={legacyRef}
          height='180px'
          width='100%'
        />
      </Row>
      <Row label='legacyClass / displayAuto / compactStyle / hidden (silently ignored)'>
        <HtmlEditor
          id='legacy-ghosts'
          authContext={mockAuthContext}
          caption='Ghost props'
          data='<p>Legacy presentation props are accepted but have no effect.</p>'
          legacyClass='some-old-class'
          displayAuto
          compactStyle
          hidden
          height='180px'
          width='100%'
        />
      </Row>
    </Section>
  );
};
