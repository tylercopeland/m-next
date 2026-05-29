/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useState } from 'react';
import { MenuList, MenuItem, IconMenuList } from '../src';

export default {
  title: 'm-next/Components/Overlay/Menu',
  component: MenuList,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>
      {label}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const Section = ({ title, children }) => (
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

const TriggerButton = React.forwardRef(function TriggerButton({ children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type='button'
      style={{
        padding: '6px 12px',
        background: '#0D71C8',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily,
        fontSize: 14,
      }}
      {...rest}
    >
      {children}
    </button>
  );
});

// A simple controlled wrapper that opens a MenuList from a button.
const MenuWithTrigger = ({ label = 'Open menu', children, ...menuProps }) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <TriggerButton ref={ref} onClick={() => setOpen((o) => !o)}>
        {label}
      </TriggerButton>
      <MenuList
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={ref.current}
        {...menuProps}
      >
        {children}
      </MenuList>
    </>
  );
};

export const Basic = () => (
  <Section title='Basic menu'>
    <Row label='MenuList + MenuItem'>
      <MenuWithTrigger label='Actions'>
        <MenuItem onClick={() => {}}>Rename</MenuItem>
        <MenuItem onClick={() => {}}>Duplicate</MenuItem>
        <MenuItem onClick={() => {}}>Archive</MenuItem>
      </MenuWithTrigger>
    </Row>
    <Row label='With header'>
      <MenuWithTrigger label='Sort by' header='Order'>
        <MenuItem onClick={() => {}}>Name (A–Z)</MenuItem>
        <MenuItem onClick={() => {}}>Name (Z–A)</MenuItem>
        <MenuItem onClick={() => {}}>Date created</MenuItem>
      </MenuWithTrigger>
    </Row>
  </Section>
);

export const States = () => (
  <Section title='Item states'>
    <Row label='selected / active / disabled'>
      <MenuWithTrigger label='Filter'>
        <MenuItem onClick={() => {}} selected>
          All items
        </MenuItem>
        <MenuItem onClick={() => {}} active>
          Active only
        </MenuItem>
        <MenuItem onClick={() => {}}>Archived</MenuItem>
        <MenuItem disabled>Trashed (unavailable)</MenuItem>
      </MenuWithTrigger>
    </Row>
  </Section>
);

export const KeyboardNavigation = () => (
  <Section title='Keyboard navigation'>
    <Row label='Open → ArrowDown / Up / Home / End'>
      <MenuWithTrigger label='Open and try keys'>
        <MenuItem onClick={() => {}}>First</MenuItem>
        <MenuItem onClick={() => {}}>Second</MenuItem>
        <MenuItem disabled>Disabled (skipped)</MenuItem>
        <MenuItem onClick={() => {}}>Third</MenuItem>
        <MenuItem onClick={() => {}}>Fourth</MenuItem>
        <MenuItem onClick={() => {}}>Last</MenuItem>
      </MenuWithTrigger>
    </Row>
    <Row label='ESC closes / Enter activates'>
      <MenuWithTrigger label='Test ESC / Enter'>
        <MenuItem onClick={() => {}}>Press Enter on me</MenuItem>
        <MenuItem onClick={() => {}}>Or press ESC to close</MenuItem>
      </MenuWithTrigger>
    </Row>
  </Section>
);

export const Scrollable = () => (
  <Section title='Many items (auto-scroll at 10+)'>
    <Row label='maxHeight=240'>
      <MenuWithTrigger label='Long list' maxHeight={240}>
        {Array.from({ length: 18 }).map((_, i) => (
          <MenuItem key={i} onClick={() => {}}>
            Item {i + 1}
          </MenuItem>
        ))}
      </MenuWithTrigger>
    </Row>
  </Section>
);

export const IconMenu = () => (
  <Section title='IconMenuList — trigger + menu in one'>
    <Row label='Default chevron'>
      <IconMenuList header='Choose'>
        <MenuItem onClick={() => {}}>Edit</MenuItem>
        <MenuItem onClick={() => {}}>Share</MenuItem>
        <MenuItem onClick={() => {}}>Delete</MenuItem>
      </IconMenuList>
    </Row>
    <Row label='Custom icon + width'>
      <IconMenuList icon='ellipsis-V4' iconSize={20} width={180}>
        <MenuItem onClick={() => {}}>Move to top</MenuItem>
        <MenuItem onClick={() => {}}>Move to bottom</MenuItem>
      </IconMenuList>
    </Row>
    <Row label='disabled'>
      <IconMenuList disabled>
        <MenuItem onClick={() => {}}>Should not open</MenuItem>
      </IconMenuList>
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => {
  const legacyRef = useRef(null);
  return (
    <Section title='Backwards-compat shim (each fires one console.warn at first use)'>
      <Row label='forwardRef prop (MenuList)'>
        <MenuWithTrigger label='Legacy forwardRef'>
          <MenuItem forwardRef={legacyRef} onClick={() => {}}>
            Item with legacy forwardRef prop
          </MenuItem>
          <MenuItem onClick={() => {}}>Sibling</MenuItem>
        </MenuWithTrigger>
      </Row>
      <Row label='Ghost props (silently ignored)'>
        <MenuWithTrigger
          label='Ghosts'
          isV4Design
          isMobile
          legacyClass='legacy-class-noop'
          compactStyle
          displayAuto
        >
          <MenuItem onClick={() => {}}>Ghosts have no effect</MenuItem>
        </MenuWithTrigger>
      </Row>
      <Row label='IconMenuList forwardRef'>
        <IconMenuList forwardRef={legacyRef}>
          <MenuItem onClick={() => {}}>Legacy IconMenuList ref</MenuItem>
        </IconMenuList>
      </Row>
    </Section>
  );
};
