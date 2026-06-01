import React from 'react';
import AppBar from '../src';

export default {
  title: 'm-next/Components/Navigation/AppBar',
  component: AppBar,
  parameters: { layout: 'fullscreen' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

const Logo = () => (
  <span
    style={{
      fontWeight: 700,
      fontSize: 16,
      color: '#0D71C8',
      letterSpacing: 0.3,
    }}
  >
    Acme
  </span>
);

const IconButton = ({ char, label }) => (
  <button
    type='button'
    aria-label={label}
    style={{
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      width: 32,
      height: 32,
      borderRadius: 6,
      fontSize: 16,
      color: '#5A6B7B',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {char}
  </button>
);

const UserAvatar = ({ initials = 'AC' }) => (
  <button
    type='button'
    aria-label='User menu'
    style={{
      background: '#E5F0FA',
      color: '#0D71C8',
      width: 32,
      height: 32,
      borderRadius: 16,
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 12,
    }}
  >
    {initials}
  </button>
);

const Frame = ({ children }) => (
  <div style={{ fontFamily, background: '#F7F9FA', minHeight: '100vh' }}>
    {children}
    <main style={{ padding: 24, color: '#1F2A33' }}>
      <h1 style={{ marginTop: 0 }}>Page content</h1>
      <p>The app bar sits at the top.</p>
    </main>
  </div>
);

// =====================================================================
// Basic
// =====================================================================

export const Basic = () => (
  <Frame>
    <AppBar>
      <AppBar.Start>
        <Logo />
      </AppBar.Start>
      <AppBar.End>
        <IconButton char='?' label='Help' />
        <IconButton char='🔔' label='Notifications' />
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);

// =====================================================================
// All three slots
// =====================================================================

export const AllSlots = () => (
  <Frame>
    <AppBar>
      <AppBar.Start>
        <Logo />
        <span style={{ color: '#5A6B7B', fontSize: 13 }}>· Dashboard</span>
      </AppBar.Start>
      <AppBar.Center>
        <input
          type='text'
          placeholder='Search…'
          style={{
            width: '100%',
            maxWidth: 480,
            padding: '6px 10px',
            fontSize: 13,
            border: '1px solid #D1D5DB',
            borderRadius: 6,
            fontFamily,
          }}
        />
      </AppBar.Center>
      <AppBar.End>
        <IconButton char='?' label='Help' />
        <IconButton char='🔔' label='Notifications' />
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);

// =====================================================================
// Page title in center
// =====================================================================

export const PageTitleCenter = () => (
  <Frame>
    <AppBar>
      <AppBar.Start>
        <IconButton char='☰' label='Toggle sidebar' />
        <Logo />
      </AppBar.Start>
      <AppBar.Center>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Acme Corp — Customer detail</span>
      </AppBar.Center>
      <AppBar.End>
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);

// =====================================================================
// Borderless variant (for stacked surfaces)
// =====================================================================

export const Borderless = () => (
  <Frame>
    <AppBar borderless>
      <AppBar.Start>
        <Logo />
      </AppBar.Start>
      <AppBar.End>
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);

// =====================================================================
// Sticky
// =====================================================================

export const Sticky = () => (
  <Frame>
    <AppBar sticky>
      <AppBar.Start>
        <Logo />
      </AppBar.Start>
      <AppBar.End>
        <UserAvatar />
      </AppBar.End>
    </AppBar>
    {/* Long content to make scrolling demonstrate the sticky behavior */}
    <div style={{ padding: 24, color: '#1F2A33' }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <p key={i}>
          Scroll the storybook iframe to see the app bar pin to the top. Item {i + 1}.
        </p>
      ))}
    </div>
  </Frame>
);

// =====================================================================
// Custom height
// =====================================================================

export const CustomHeight = () => (
  <Frame>
    <AppBar height={72}>
      <AppBar.Start>
        <Logo />
      </AppBar.Start>
      <AppBar.End>
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);

// =====================================================================
// Legacy API shim demo
// =====================================================================

export const LegacyAPIStillWorks = () => (
  <Frame>
    <AppBar isV4Design isMobile legacyClass='old-class' displayAuto compactStyle>
      <AppBar.Start>
        <Logo />
      </AppBar.Start>
      <AppBar.End>
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);
