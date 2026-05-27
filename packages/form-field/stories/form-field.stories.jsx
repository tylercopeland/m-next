import React, { useState } from 'react';
import { FormField } from '../src';

export default {
  title: 'm-next/Components/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const nativeInputStyle = {
  fontFamily,
  fontSize: 14,
  padding: '6px 10px',
  border: '1px solid #BACAD0',
  borderRadius: 4,
  width: 320,
  boxSizing: 'border-box',
  color: '#2A394A',
};

const Frame = ({ children }) => (
  <div style={{ fontFamily, maxWidth: 480 }}>{children}</div>
);

export const Basic = () => (
  <Frame>
    <FormField label="Company name" htmlFor="basic-input">
      <input id="basic-input" type="text" style={nativeInputStyle} defaultValue="Acme Inc." />
    </FormField>
  </Frame>
);

export const WithDescription = () => (
  <Frame>
    <FormField
      label="Subdomain"
      description="Lowercase letters, numbers, and hyphens. Used in your workspace URL."
      htmlFor="subdomain-input"
    >
      <input id="subdomain-input" type="text" style={nativeInputStyle} placeholder="acme" />
    </FormField>
  </Frame>
);

export const WithError = () => (
  <Frame>
    <FormField
      label="Email address"
      errorMessage="Enter a valid email address."
      htmlFor="email-input"
    >
      <input
        id="email-input"
        type="email"
        style={{ ...nativeInputStyle, borderColor: '#DA211E' }}
        defaultValue="not-an-email"
      />
    </FormField>
  </Frame>
);

export const RequiredField = () => (
  <Frame>
    <FormField label="Account name" required htmlFor="required-input">
      <input id="required-input" type="text" required style={nativeInputStyle} />
    </FormField>
  </Frame>
);

export const HideLabel = () => (
  <Frame>
    <FormField label="Search invoices" hideLabel htmlFor="search-input">
      <input
        id="search-input"
        type="search"
        placeholder="Search invoices…"
        style={nativeInputStyle}
      />
    </FormField>
  </Frame>
);

export const AutoIdWiring = () => (
  <Frame>
    <FormField
      label="Phone number"
      description="Used for two-factor authentication."
      errorMessage="Enter a valid phone number."
    >
      {/* No id on the child — FormField generates one and wires htmlFor + aria-describedby + aria-invalid. */}
      <input type="tel" style={{ ...nativeInputStyle, borderColor: '#DA211E' }} defaultValue="abc" />
    </FormField>
  </Frame>
);

export const ManualIdControl = () => (
  <Frame>
    <FormField
      label="Tax ID"
      description="Federal Employer Identification Number."
      htmlFor="manual-tax-id"
    >
      <input
        id="manual-tax-id"
        type="text"
        style={nativeInputStyle}
        placeholder="00-0000000"
        aria-describedby="external-help"
      />
    </FormField>
    <div id="external-help" style={{ fontFamily, fontSize: 12, color: '#545F67', marginTop: 8 }}>
      (External help text — merged into aria-describedby.)
    </div>
  </Frame>
);

const CustomCombobox = React.forwardRef(function CustomCombobox(props, ref) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Net 30');
  const options = ['Due on receipt', 'Net 15', 'Net 30', 'Net 60'];
  return (
    <div style={{ position: 'relative', width: 320 }}>
      <div
        ref={ref}
        role="combobox"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        style={{
          ...nativeInputStyle,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        {...props}
      >
        <span>{value}</span>
        <span aria-hidden="true" style={{ color: '#545F67' }}>
          ▾
        </span>
      </div>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            background: '#fff',
            border: '1px solid #BACAD0',
            borderRadius: 4,
            zIndex: 1,
          }}
        >
          {options.map((o) => (
            <li
              key={o}
              role="option"
              aria-selected={value === o}
              onClick={() => {
                setValue(o);
                setOpen(false);
              }}
              style={{
                padding: '6px 8px',
                cursor: 'pointer',
                fontFamily,
                fontSize: 14,
                color: '#2A394A',
                background: value === o ? '#EEF5F7' : 'transparent',
              }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export const WithCustomControl = () => (
  <Frame>
    <FormField
      label="Payment terms"
      description="Default terms applied to new invoices."
    >
      <CustomCombobox />
    </FormField>
  </Frame>
);

export const RealForm = () => (
  <Frame>
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <FormField label="Workspace name" required htmlFor="form-name">
        <input id="form-name" type="text" required style={nativeInputStyle} defaultValue="Acme" />
      </FormField>
      <FormField
        label="Subdomain"
        description="Used in your workspace URL."
        htmlFor="form-subdomain"
      >
        <input id="form-subdomain" type="text" style={nativeInputStyle} placeholder="acme" />
      </FormField>
      <FormField
        label="Billing email"
        required
        errorMessage="Enter a valid email address."
        htmlFor="form-email"
      >
        <input
          id="form-email"
          type="email"
          required
          style={{ ...nativeInputStyle, borderColor: '#DA211E' }}
          defaultValue="billing@"
        />
      </FormField>
      <button
        type="submit"
        style={{
          alignSelf: 'flex-start',
          padding: '8px 16px',
          background: '#0D71C8',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontFamily,
          cursor: 'pointer',
        }}
      >
        Create workspace
      </button>
    </form>
  </Frame>
);
