// Stubs for MethodUI/shared components that pull in heavy runtime deps
// when fully imported. Kit demos render placeholders so the rest of the
// shell can mount.

import React from 'react';

export const ImageWidget = ({ alt, src, ...rest }) => (
  <div
    role="img"
    aria-label={alt}
    style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: '#0D71C8',
      color: '#FFF',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 600,
    }}
    {...rest}
  >
    {alt ? alt.slice(0, 2).toUpperCase() : 'U'}
  </div>
);

export const BANNER_TYPES = {
  ALERT: 'alert',
  PRIMARY: 'primary',
  WARNING: 'warning',
  INFO: 'info',
};

// Other shared/* re-exports referenced transitively by some MethodUI files
// even when the kit shell doesn't render them directly. Stubs keep imports
// from failing.
export const CheckBoxSelection = ({ children }) => <>{children}</>;
export const Accordion = ({ children }) => <div>{children}</div>;
export const Button = ({ children, ...rest }) => <button type="button" {...rest}>{children}</button>;

export const NotificationBanner = ({ message, onMessageClick, onDismissClick, bannerType }) => (
  <div
    style={{
      padding: '10px 16px',
      background: bannerType === BANNER_TYPES.ALERT ? '#FDE8EC' : '#EAF3FB',
      color: bannerType === BANNER_TYPES.ALERT ? '#7A0E25' : '#0C3B6E',
      fontSize: 13,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span style={{ cursor: 'pointer' }} onClick={onMessageClick}>{message}</span>
    <button
      type="button"
      onClick={onDismissClick}
      style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
    >
      ×
    </button>
  </div>
);
