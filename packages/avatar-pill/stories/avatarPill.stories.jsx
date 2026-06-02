import React, { useState } from 'react';
import AvatarPill from '../src';

export default {
  title: 'm-next/Components/Display/AvatarPill',
  component: AvatarPill,
  parameters: { layout: 'padded' },
};

const Row = ({ children, label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      padding: '8px 0',
      borderBottom: '1px dashed #EEF5F7',
    }}
  >
    {label && (
      <span
        style={{
          minWidth: 120,
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: '#545F67',
          fontFamily: "'Source Sans Pro', system-ui, sans-serif",
        }}
      >
        {label}
      </span>
    )}
    {children}
  </div>
);

// ============================================================
// Default — derived initials, the "just give me a chip" path
// ============================================================
export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row label='Default'>
      <AvatarPill>Tyler Copeland</AvatarPill>
    </Row>
    <Row label='Single word'>
      <AvatarPill>Method</AvatarPill>
    </Row>
    <Row label='Three words'>
      <AvatarPill>Ben Robinson Jr</AvatarPill>
    </Row>
  </div>
);

// ============================================================
// Color scheme matrix
// ============================================================
const COLORS = ['blue', 'green', 'fuchsia', 'grey', 'yellow', 'red', 'purple', 'orange', 'teal'];

export const ColorSchemes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row label='Subtle (default)'>
      {COLORS.map((c) => (
        <AvatarPill key={c} colorScheme={c} avatar={{ initials: c.slice(0, 2).toUpperCase() }}>
          {c}
        </AvatarPill>
      ))}
    </Row>
    <Row label='Solid'>
      {COLORS.map((c) => (
        <AvatarPill
          key={c}
          variant='solid'
          colorScheme={c}
          avatar={{ initials: c.slice(0, 2).toUpperCase() }}
        >
          {c}
        </AvatarPill>
      ))}
    </Row>
  </div>
);

// ============================================================
// Sizes
// ============================================================
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row label='Small'>
      <AvatarPill size='sm' avatar={{ initials: 'TC' }}>
        Tyler Copeland
      </AvatarPill>
      <AvatarPill size='sm' colorScheme='green' avatar={{ initials: 'BR' }}>
        Ben Robinson
      </AvatarPill>
    </Row>
    <Row label='Medium (default)'>
      <AvatarPill size='md' avatar={{ initials: 'TC' }}>
        Tyler Copeland
      </AvatarPill>
      <AvatarPill size='md' colorScheme='green' avatar={{ initials: 'BR' }}>
        Ben Robinson
      </AvatarPill>
    </Row>
    <Row label='Large'>
      <AvatarPill size='lg' avatar={{ initials: 'TC' }}>
        Tyler Copeland
      </AvatarPill>
      <AvatarPill size='lg' colorScheme='green' avatar={{ initials: 'BR' }}>
        Ben Robinson
      </AvatarPill>
    </Row>
  </div>
);

// ============================================================
// Photo avatars
// ============================================================
export const PhotoAvatars = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row label='With photos'>
      <AvatarPill
        size='lg'
        avatar={{
          src: 'https://i.pravatar.cc/64?img=12',
          alt: 'Tyler Copeland',
        }}
      >
        Tyler Copeland
      </AvatarPill>
      <AvatarPill
        size='lg'
        colorScheme='purple'
        avatar={{
          src: 'https://i.pravatar.cc/64?img=8',
          alt: 'Ben Robinson',
        }}
      >
        Ben Robinson
      </AvatarPill>
      <AvatarPill
        size='lg'
        colorScheme='teal'
        avatar={{
          src: 'https://i.pravatar.cc/64?img=32',
          alt: 'Alex Chen',
        }}
      >
        Alex Chen
      </AvatarPill>
    </Row>
  </div>
);

// ============================================================
// Dismissible chips (multi-select recipient list pattern)
// ============================================================
export const Dismissible = () => {
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Tyler Copeland', color: 'blue' },
    { id: 2, name: 'Ben Robinson', color: 'green' },
    { id: 3, name: 'Alex Chen', color: 'purple' },
    { id: 4, name: 'Paul Mendelson', color: 'orange' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Row label='Recipients'>
        {recipients.map((r) => (
          <AvatarPill
            key={r.id}
            colorScheme={r.color}
            avatar={{ initials: r.name.split(' ').map((w) => w[0]).join('') }}
            onTrailingIconClick={() =>
              setRecipients((prev) => prev.filter((p) => p.id !== r.id))
            }
            trailingIconLabel={`Remove ${r.name}`}
          >
            {r.name}
          </AvatarPill>
        ))}
        {recipients.length === 0 && (
          <span style={{ color: '#545F67', fontFamily: 'sans-serif' }}>(none)</span>
        )}
      </Row>
    </div>
  );
};

// ============================================================
// Clickable + leading icon
// ============================================================
const StatusDot = ({ color }) => (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      display: 'inline-block',
    }}
  />
);

export const ClickableAndLeading = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Row label='Clickable (chip)'>
      <AvatarPill
        avatar={{ initials: 'TC' }}
        onClick={() => alert('Opening profile')} // eslint-disable-line no-alert
      >
        Tyler Copeland
      </AvatarPill>
    </Row>
    <Row label='With status dot'>
      <AvatarPill
        leadingIcon={<StatusDot color='#007B4A' />}
        avatar={{ initials: 'TC' }}
        colorScheme='green'
      >
        Tyler (online)
      </AvatarPill>
      <AvatarPill
        leadingIcon={<StatusDot color='#DA211E' />}
        avatar={{ initials: 'BR' }}
        colorScheme='red'
      >
        Ben (offline)
      </AvatarPill>
    </Row>
  </div>
);
