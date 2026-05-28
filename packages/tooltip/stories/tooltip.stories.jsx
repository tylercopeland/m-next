import React from 'react';
import { Tooltip } from '../src';

export default {
  title: 'm-next/Components/Feedback/Tooltip',
  component: Tooltip,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const demoButton = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 14px',
  background: '#ffffff',
  color: '#374151',
  border: '1px solid #d1d5db',
  borderRadius: 4,
  fontFamily,
  fontSize: 14,
  cursor: 'pointer',
};

export const Placements = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, max-content)',
      gap: 64,
      padding: 64,
      fontFamily,
    }}
  >
    <Tooltip content="Tooltip on top" placement="top">
      <button type="button" style={demoButton}>
        Top
      </button>
    </Tooltip>
    <Tooltip content="Tooltip on bottom" placement="bottom">
      <button type="button" style={demoButton}>
        Bottom
      </button>
    </Tooltip>
    <Tooltip content="Tooltip on left" placement="left">
      <button type="button" style={demoButton}>
        Left
      </button>
    </Tooltip>
    <Tooltip content="Tooltip on right" placement="right">
      <button type="button" style={demoButton}>
        Right
      </button>
    </Tooltip>
  </div>
);

export const OnButton = () => (
  <div style={{ fontFamily, padding: 32 }}>
    <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 13 }}>
      Tab to the button — tooltip shows on focus, hides on blur.
    </p>
    <Tooltip content="Save the current invoice (Ctrl+S)">
      <button
        type="button"
        style={{
          ...demoButton,
          background: '#0D71C8',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
        }}
        onClick={() => {}}
      >
        Save
      </button>
    </Tooltip>
  </div>
);

export const OnInlineLink = () => (
  <div style={{ fontFamily, color: '#374151', maxWidth: 560, padding: 32, lineHeight: 1.6 }}>
    <p>
      Invoices can be sent by email directly from Method. Just open the invoice and click{' '}
      <Tooltip content="Sends the PDF to the customer's billing email">
        <a
          href="#send"
          style={{ color: '#0D71C8', textDecoration: 'underline' }}
          onClick={(event) => event.preventDefault()}
        >
          Send
        </a>
      </Tooltip>{' '}
      in the toolbar. You can also{' '}
      <Tooltip content="Schedules delivery for a future date" placement="bottom">
        <a
          href="#schedule"
          style={{ color: '#0D71C8', textDecoration: 'underline' }}
          onClick={(event) => event.preventDefault()}
        >
          schedule it
        </a>
      </Tooltip>{' '}
      to send later.
    </p>
  </div>
);

export const LongContent = () => (
  <div style={{ fontFamily, padding: 64 }}>
    <Tooltip
      content="This will permanently delete the selected invoice and all of its associated line items. This action cannot be undone."
      placement="right"
    >
      <button
        type="button"
        style={{
          ...demoButton,
          background: '#8A1F1F',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
        }}
      >
        Delete invoice
      </button>
    </Tooltip>
  </div>
);

export const ZeroDelay = () => (
  <div style={{ fontFamily, padding: 32 }}>
    <p style={{ color: '#6b7280', marginBottom: 16, fontSize: 13 }}>
      Hover the button — tooltip shows instantly (no 300ms wait).
    </p>
    <Tooltip content="Shows the moment you hover" delay={0}>
      <button type="button" style={demoButton}>
        Hover me
      </button>
    </Tooltip>
  </div>
);
