import React, { useState } from 'react';
import { Drawer } from '../src';

export default {
  title: 'm-next/Components/Overlay/Drawer',
  component: Drawer,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 16px',
  background: '#0D71C8',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontFamily,
  fontSize: 14,
  cursor: 'pointer',
};

const subtleButtonStyle = {
  ...buttonStyle,
  background: 'transparent',
  color: '#374151',
  border: '1px solid #d1d5db',
};

const paragraph = {
  fontFamily,
  color: '#374151',
  fontSize: 14,
  lineHeight: 1.55,
  margin: 0,
};

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily }}>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Edit invoice">
        <p style={paragraph}>
          A right-placed drawer. Click outside, press ESC, or use the close button to dismiss.
        </p>
      </Drawer>
    </div>
  );
};

export const Placements = () => {
  const [which, setWhich] = useState(null);
  const placements = ['left', 'right', 'top', 'bottom'];
  return (
    <div style={{ fontFamily, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {placements.map((p) => (
        <button key={p} type="button" style={subtleButtonStyle} onClick={() => setWhich(p)}>
          Open {p}
        </button>
      ))}
      <Drawer
        open={which !== null}
        onClose={() => setWhich(null)}
        placement={which || 'right'}
        title={which ? `${which.charAt(0).toUpperCase()}${which.slice(1)} drawer` : ''}
      >
        <p style={paragraph}>This drawer slid in from the {which} edge.</p>
      </Drawer>
    </div>
  );
};

export const Sizes = () => {
  const [size, setSize] = useState(null);
  const sizes = ['sm', 'md', 'lg', 'full'];
  return (
    <div style={{ fontFamily, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {sizes.map((s) => (
        <button key={s} type="button" style={subtleButtonStyle} onClick={() => setSize(s)}>
          Open size={'"'}
          {s}
          {'"'}
        </button>
      ))}
      <Drawer
        open={size !== null}
        onClose={() => setSize(null)}
        size={size || 'md'}
        title={size ? `Size: ${size}` : ''}
      >
        <p style={paragraph}>
          Horizontal placements: sm=320, md=480, lg=720, full=100vw. Vertical placements use a
          shorter scale (sm=240, md=360, lg=480, full=100vh).
        </p>
      </Drawer>
    </div>
  );
};

export const WithoutTitle = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily }}>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        Open drawer (no title)
      </button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <p style={paragraph}>
          No title, but the close button is still rendered. The header collapses to just the ×.
        </p>
      </Drawer>
    </div>
  );
};

export const WithLongContent = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily }}>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        Open drawer with long content
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Release notes">
        {Array.from({ length: 40 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i} style={{ ...paragraph, marginBottom: 12 }}>
            <strong>Item {i + 1}.</strong> Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Praesent faucibus, leo a accumsan dictum, est nisi tincidunt risus, vitae
            congue nibh nulla ut velit. The body region scrolls independently of the header.
          </p>
        ))}
      </Drawer>
    </div>
  );
};

export const WithFooterActions = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const fieldLabel = { display: 'block', fontSize: 13, color: '#374151', marginBottom: 4 };
  const fieldInput = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontFamily,
    fontSize: 14,
  };

  return (
    <div style={{ fontFamily }}>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        Open form drawer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Add contact">
        <form
          onSubmit={submit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            margin: -16,
          }}
        >
          <div style={{ padding: 16, flex: 1, overflow: 'auto' }}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="contact-name" style={fieldLabel}>
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={fieldInput}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="contact-email" style={fieldLabel}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={fieldInput}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              padding: 16,
              borderTop: '1px solid #BACAD0',
              background: '#fff',
            }}
          >
            <button type="button" style={subtleButtonStyle} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" style={buttonStyle}>
              Save
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export const NoCloseOnOverlay = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ fontFamily }}>
      <button type="button" style={buttonStyle} onClick={() => setOpen(true)}>
        Open sticky drawer
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm before closing"
        closeOnOverlayClick={false}
      >
        <p style={paragraph}>
          Clicking the dimmed backdrop will not close this drawer. Use the × in the header
          (or ESC) instead.
        </p>
      </Drawer>
    </div>
  );
};
