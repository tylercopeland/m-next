import React from 'react';
import { Breadcrumbs } from '../src';

export default {
  title: 'm-next/Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    cssresources: [
      {
        id: 'Method Styles',
        code: '<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>',
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/OxikbbciwluLzZ4hTdUTWr/Design-System?type=design&node-id=21%3A86&t=9PD8SbHk2QC8A4EN-1',
    },
  },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 520 }}>{children}</div>
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

const sampleCrumbs = [
  { id: 'home', label: 'Home', onClick: () => {}, tooltip: 'Go to Home' },
  { id: 'section', label: 'Customers', onClick: () => {}, tooltip: 'Go to Customers' },
  { id: 'current', label: 'Acme Corp', onClick: () => {}, tooltip: 'You are here' },
];

const sampleMenu = [
  { id: 'menu-1', label: 'Edit', onClick: () => {} },
  { id: 'menu-2', label: 'Duplicate', onClick: () => {} },
  { id: 'menu-3', label: 'Archive', onClick: () => {} },
];

export const Default = () => (
  <Section title="Default trail">
    <Row label="basic">
      <Breadcrumbs crumbs={sampleCrumbs} tooltipId="default-tooltip" />
    </Row>
    <Row label="single crumb">
      <Breadcrumbs crumbs={[{ id: 'home', label: 'Home', onClick: () => {} }]} />
    </Row>
    <Row label="two crumbs">
      <Breadcrumbs crumbs={sampleCrumbs.slice(0, 2)} />
    </Row>
  </Section>
);

export const WithOverflowMenu = () => (
  <Section title="Trailing overflow menu">
    <Row label="crumbs + menu">
      <Breadcrumbs crumbs={sampleCrumbs} showMenu menuItems={sampleMenu} tooltipId="menu-tooltip" />
    </Row>
    <Row label="menu only">
      <Breadcrumbs crumbs={[]} showMenu menuItems={sampleMenu} tooltipId="menu-only-tooltip" />
    </Row>
  </Section>
);

export const Empty = () => (
  <Section title="Empty">
    <Row label="no crumbs, no menu">
      <Breadcrumbs crumbs={[]} />
    </Row>
  </Section>
);

export const CustomAriaLabel = () => (
  <Section title="Customised landmark name">
    <Row label='aria-label="Account location"'>
      <Breadcrumbs crumbs={sampleCrumbs} aria-label="Account location" />
    </Row>
  </Section>
);

export const LongLabels = () => (
  <Section title="Long labels truncate gracefully">
    <Row label="long crumb labels">
      <Breadcrumbs
        crumbs={[
          { id: 'home', label: 'Home', onClick: () => {} },
          { id: 'b', label: 'Customers and prospects', onClick: () => {} },
          { id: 'c', label: 'Acme Industrial Holdings International Ltd.', onClick: () => {} },
        ]}
      />
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="forwardRef prop">
      <Breadcrumbs
        id="legacy-fwdref"
        crumbs={sampleCrumbs}
        // legacy: callback ref via the deprecated `forwardRef` prop
        forwardRef={(el) => el}
      />
    </Row>
    <Row label="ariaLabel (camelCase)">
      <Breadcrumbs id="legacy-aria" crumbs={sampleCrumbs} ariaLabel="Legacy ARIA name" />
    </Row>
    <Row label="silently-ignored ghosts">
      <Breadcrumbs
        id="legacy-ghosts"
        crumbs={sampleCrumbs}
        isV4Design
        isMobile
        compactStyle
        displayAuto
        legacyClass="ignored-class"
      />
    </Row>
    <Row label="legacy default export">
      {/* The pre-existing `BreadCrumbsHeader` default export is unchanged. */}
      {React.createElement(require('../src').default, {
        id: 'legacy-default-export',
        crumbs: sampleCrumbs,
      })}
    </Row>
  </Section>
);
