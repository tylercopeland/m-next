import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import AppBar from '../src';

export default {
  title: 'm-next/Components/Navigation/AppBar',
  component: AppBar,
  parameters: { layout: 'fullscreen' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// Production navy used for text + icons on the white app-bar surface.
const METHOD_NAVY = '#022266';

// Small icon button wrapper. Replicates the production NavPanelItem visual
// (grey-on-white icon, blue on hover/active). Story-local so the AppBar
// package doesn't depend on a button component.
const IconButton = ({ iconName, label }) => (
  <button
    type='button'
    aria-label={label}
    style={{
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      width: 40,
      height: 40,
      padding: 0,
      borderRadius: 4,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#545F67',
    }}
  >
    <SvgIcon name={iconName} size={20} color='#545F67' />
  </button>
);

// Method's TitleDropdown — the left-side "page title + caret" affordance.
// Renders the current page name in navy with a small chevron next to it.
const TitleDropdown = ({ title }) => (
  <button
    type='button'
    aria-label={`Configure ${title}`}
    style={{
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 8px 4px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      color: METHOD_NAVY,
      fontFamily,
      fontSize: 18,
      fontWeight: 600,
    }}
  >
    {title}
    <SvgIcon name='chevron-down' size={14} color={METHOD_NAVY} />
  </button>
);

// User avatar — circular initials button. Production shows the user's
// profile photo here; the story uses initials.
const UserAvatar = ({ initials = 'TC' }) => (
  <button
    type='button'
    aria-label='User menu'
    style={{
      background: '#E5F0FA',
      color: METHOD_NAVY,
      width: 36,
      height: 36,
      borderRadius: 18,
      border: 'none',
      cursor: 'pointer',
      fontFamily,
      fontWeight: 600,
      fontSize: 12,
    }}
  >
    {initials}
  </button>
);

// Vertical hairline separator between the icon row and the user avatar
// (matches s.VerticalDivider in production TopNav.styles.js).
const VerticalDivider = () => (
  <span
    aria-hidden='true'
    style={{
      display: 'inline-block',
      width: 1,
      height: 24,
      background: '#BACAD0',
      margin: '0 4px',
    }}
  />
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
// Method-style (matches production TopNav)
// =====================================================================
//
// Left: page-title dropdown (production's <TitleDropdown />). Right: row of
// action icons (Global Add, Search, Help) + vertical divider + user avatar.
// White surface, navy text, grey icons that go blue on hover/active.

export const MethodStyle = () => (
  <Frame>
    <AppBar>
      <AppBar.Start>
        <TitleDropdown title='Customers' />
      </AppBar.Start>
      <AppBar.End>
        <IconButton iconName='circle-plus' label='Global add' />
        <IconButton iconName='search' label='Search' />
        <IconButton iconName='question' label='Help and support' />
        <VerticalDivider />
        <UserAvatar />
      </AppBar.End>
    </AppBar>
  </Frame>
);
