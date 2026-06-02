import React, { useState } from 'react';
import Accordion from '../src';

export default {
  title: 'm-next/Components/Display/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// A consistent storybook frame so width/typography read like a real settings
// panel rather than a stretched-to-viewport block.
const Frame = ({ children }) => (
  <div style={{ maxWidth: 640, fontFamily, color: '#0F1B31' }}>{children}</div>
);

// =====================================================================
// Basic — radio-style (default). Opening one item closes the others.
// =====================================================================

export const Basic = () => (
  <Frame>
    <Accordion defaultExpanded='general'>
      <Accordion.Item id='general' title='General settings'>
        <p>Workspace name, timezone, locale, and default landing page.</p>
      </Accordion.Item>
      <Accordion.Item id='security' title='Security'>
        <p>Two-factor authentication, session length, and SSO configuration.</p>
      </Accordion.Item>
      <Accordion.Item id='billing' title='Billing' disabled>
        <p>Contact your workspace admin to manage billing settings.</p>
      </Accordion.Item>
    </Accordion>
  </Frame>
);

// =====================================================================
// MultipleExpanded — allowMultiple lets several items stay open.
// =====================================================================

export const MultipleExpanded = () => (
  <Frame>
    <Accordion allowMultiple defaultExpanded={['general', 'security']}>
      <Accordion.Item id='general' title='General settings'>
        <p>Workspace name, timezone, locale, and default landing page.</p>
      </Accordion.Item>
      <Accordion.Item id='security' title='Security'>
        <p>Two-factor authentication, session length, and SSO configuration.</p>
      </Accordion.Item>
      <Accordion.Item id='notifications' title='Notifications'>
        <p>Email digests, in-app banners, and mobile push preferences.</p>
      </Accordion.Item>
    </Accordion>
  </Frame>
);

// =====================================================================
// Controlled — parent owns the expanded state. Demonstrates how to
// observe and react to changes (here: an external panel reflects state).
// =====================================================================

export const Controlled = () => {
  const [expanded, setExpanded] = useState(['security']);
  return (
    <Frame>
      <div
        style={{
          marginBottom: 16,
          padding: '8px 12px',
          background: '#EEF5F7',
          borderRadius: 4,
          fontSize: 13,
          color: '#545F67',
        }}
      >
        <strong>Open ids:</strong>{' '}
        {expanded.length === 0 ? '(none)' : expanded.join(', ')}
      </div>
      <Accordion allowMultiple expanded={expanded} onExpandedChange={setExpanded}>
        <Accordion.Item id='general' title='General settings'>
          <p>Workspace name, timezone, locale.</p>
        </Accordion.Item>
        <Accordion.Item id='security' title='Security'>
          <p>Two-factor authentication, session length.</p>
        </Accordion.Item>
        <Accordion.Item id='notifications' title='Notifications'>
          <p>Email digests, in-app banners.</p>
        </Accordion.Item>
      </Accordion>
    </Frame>
  );
};

// =====================================================================
// NestedContent — accordion items can hold arbitrary JSX, including form
// fields, checkboxes, or other m-next primitives. The body slot is a real
// region so screen readers announce it as a labelled section.
// =====================================================================

export const NestedContent = () => (
  <Frame>
    <Accordion allowMultiple defaultExpanded={['permissions']}>
      <Accordion.Item id='permissions' title='Permissions'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' defaultChecked /> View contacts
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' defaultChecked /> Edit contacts
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' /> Delete contacts
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' /> Manage owners
          </label>
        </div>
      </Accordion.Item>
      <Accordion.Item id='integrations' title='Integrations'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' defaultChecked /> QuickBooks Online
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' /> Gmail
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type='checkbox' /> Outlook
          </label>
        </div>
      </Accordion.Item>
    </Accordion>
  </Frame>
);

// =====================================================================
// LegacyAPIStillWorks — soft-shimmed deprecated `forwardRef` prop. Emits
// a one-time console.warn pointing at the modern API. Existing consumers
// keep working during the migration window.
// =====================================================================

export const LegacyAPIStillWorks = () => {
  const ref = React.useRef(null);
  return (
    <Frame>
      <p style={{ color: '#545F67', fontSize: 13, marginBottom: 12 }}>
        This story passes a legacy <code>forwardRef</code> prop. Open the
        console: a one-time deprecation warning fires. The accordion still
        renders.
      </p>
      <Accordion forwardRef={ref} defaultExpanded='general'>
        <Accordion.Item id='general' title='General settings'>
          <p>Renders normally. The legacy prop is shimmed, not removed.</p>
        </Accordion.Item>
        <Accordion.Item id='security' title='Security'>
          <p>Click any header — state still toggles.</p>
        </Accordion.Item>
      </Accordion>
    </Frame>
  );
};
