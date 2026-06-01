import React, { useState } from 'react';
import Sidebar from '../src';

export default {
  title: 'm-next/Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// A simple emoji-icon helper so the stories don't depend on @m-next/svg-icon
// (sidebar should be foundation-light; icons are caller-supplied).
const Icon = ({ char }) => (
  <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden='true'>
    {char}
  </span>
);

// A frame that gives the sidebar a realistic viewport context.
const Frame = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh', fontFamily }}>
    {children}
    <main
      style={{
        flex: 1,
        padding: 24,
        background: '#FFFFFF',
        color: '#1F2A33',
        overflow: 'auto',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Page content</h1>
      <p>The sidebar sits to the left. Toggle the open/closed state in the story controls.</p>
    </main>
  </div>
);

// =====================================================================
// Basic
// =====================================================================

export const Basic = () => (
  <Frame>
    <Sidebar>
      <Sidebar.Header>
        <strong style={{ fontSize: 16 }}>Acme Inc.</strong>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Group title='Workspace'>
          <Sidebar.Item icon={<Icon char='⌂' />} active>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item icon={<Icon char='👥' />}>Customers</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='📄' />}>Invoices</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='💳' />} badge='3'>
            Payments
          </Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Group title='Tools' collapsible>
          <Sidebar.Item icon={<Icon char='🛠' />}>App Builder</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='📊' />}>Reports</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='⚙️' />} disabled>
            Admin (coming soon)
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Body>
      <Sidebar.Footer>
        <div style={{ fontSize: 12, color: '#5A6B7B' }}>v5.4.0</div>
      </Sidebar.Footer>
    </Sidebar>
  </Frame>
);

// =====================================================================
// Open / Closed
// =====================================================================

export const Collapsed = () => (
  <Frame>
    <Sidebar isOpen={false}>
      <Sidebar.Header>
        <strong>A</strong>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Item icon={<Icon char='⌂' />} active aria-label='Dashboard'>
          {' '}
        </Sidebar.Item>
        <Sidebar.Item icon={<Icon char='👥' />} aria-label='Customers'>
          {' '}
        </Sidebar.Item>
        <Sidebar.Item icon={<Icon char='📄' />} aria-label='Invoices'>
          {' '}
        </Sidebar.Item>
      </Sidebar.Body>
    </Sidebar>
  </Frame>
);

// =====================================================================
// Controlled open/close
// =====================================================================

export const ControlledOpenClose = () => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily }}>
      <Sidebar isOpen={open}>
        <Sidebar.Header>
          <strong>{open ? 'Acme Inc.' : 'A'}</strong>
        </Sidebar.Header>
        <Sidebar.Body>
          <Sidebar.Group title={open ? 'Workspace' : undefined}>
            <Sidebar.Item icon={<Icon char='⌂' />} active aria-label='Dashboard'>
              {open ? 'Dashboard' : ' '}
            </Sidebar.Item>
            <Sidebar.Item icon={<Icon char='👥' />} aria-label='Customers'>
              {open ? 'Customers' : ' '}
            </Sidebar.Item>
            <Sidebar.Item icon={<Icon char='📄' />} aria-label='Invoices'>
              {open ? 'Invoices' : ' '}
            </Sidebar.Item>
          </Sidebar.Group>
        </Sidebar.Body>
      </Sidebar>
      <main style={{ flex: 1, padding: 24, background: '#FFFFFF', color: '#1F2A33' }}>
        <button
          type='button'
          onClick={() => setOpen((v) => !v)}
          style={{
            padding: '6px 12px',
            fontSize: 13,
            background: '#0D71C8',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontFamily,
          }}
        >
          {open ? 'Collapse sidebar' : 'Expand sidebar'}
        </button>
      </main>
    </div>
  );
};

// =====================================================================
// Items rendered as links (as='a')
// =====================================================================

export const AsLinks = () => (
  <Frame>
    <Sidebar>
      <Sidebar.Header>
        <strong>Acme Inc.</strong>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Group title='Navigation'>
          <Sidebar.Item as='a' href='#dashboard' icon={<Icon char='⌂' />} active>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item as='a' href='#customers' icon={<Icon char='👥' />}>
            Customers
          </Sidebar.Item>
          <Sidebar.Item as='a' href='#invoices' icon={<Icon char='📄' />}>
            Invoices
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Body>
    </Sidebar>
  </Frame>
);

// =====================================================================
// Collapsible groups
// =====================================================================

export const CollapsibleGroups = () => (
  <Frame>
    <Sidebar>
      <Sidebar.Header>
        <strong>Acme Inc.</strong>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Group title='Pinned'>
          <Sidebar.Item icon={<Icon char='⌂' />} active>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item icon={<Icon char='⭐' />}>Favorites</Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Group title='Sales' collapsible defaultExpanded={false}>
          <Sidebar.Item icon={<Icon char='💼' />}>Leads</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='🤝' />}>Deals</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='📞' />}>Calls</Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Group title='Finance' collapsible defaultExpanded={false}>
          <Sidebar.Item icon={<Icon char='📄' />}>Invoices</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='💳' />}>Payments</Sidebar.Item>
          <Sidebar.Item icon={<Icon char='📊' />}>Reports</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Body>
    </Sidebar>
  </Frame>
);

// =====================================================================
// Legacy API shim demo
// =====================================================================

export const LegacyAPIStillWorks = () => (
  <Frame>
    <Sidebar
      // Legacy ghosts — accepted but no-op.
      isV4Design
      isMobile
      legacyClass='old-class'
      displayAuto
      compactStyle
    >
      <Sidebar.Header>
        <strong>Acme Inc.</strong>
      </Sidebar.Header>
      <Sidebar.Body>
        <Sidebar.Group title='Workspace'>
          <Sidebar.Item icon={<Icon char='⌂' />} active>
            Dashboard
          </Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Body>
    </Sidebar>
  </Frame>
);
