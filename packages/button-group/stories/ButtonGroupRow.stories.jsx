import React, { useState } from 'react';
import { ButtonGroupRow } from '../src';

export default {
  title: 'm-next/Components/Action/ButtonGroup',
  component: ButtonGroupRow,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 180, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>{children}</div>
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

const SegmentedExample = () => {
  const [view, setView] = useState('list');
  return (
    <ButtonGroupRow
      selected={view}
      data={[
        { value: 'list', label: 'List' },
        { value: 'grid', label: 'Grid' },
        { value: 'kanban', label: 'Kanban' },
      ]}
      onClick={(item) => setView(item.value)}
      aria-label="Choose view"
    />
  );
};

export const Row_TwoOptions = () => (
  <Section title="ButtonGroupRow — two-option toggle">
    <Row label="text">
      <ButtonGroupRow
        selected={1}
        data={[
          { value: 1, label: 'On' },
          { value: 2, label: 'Off' },
        ]}
        aria-label="Toggle on/off"
      />
    </Row>
    <Row label="icon">
      <ButtonGroupRow
        selected={1}
        data={[
          { value: 1, icon: 'tabs-V4' },
          { value: 2, icon: 'tabs-condensed-V4' },
        ]}
        aria-label="Choose view"
      />
    </Row>
  </Section>
);

export const Row_ThreeOptions = () => (
  <Section title="ButtonGroupRow — three-option, controlled">
    <Row label="controlled">
      <SegmentedExample />
    </Row>
  </Section>
);

export const Row_DisabledOptions = () => (
  <Section title="ButtonGroupRow — with disabled items">
    <Row label="disabled item">
      <ButtonGroupRow
        selected="list"
        data={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid', disabled: true },
          { value: 'kanban', label: 'Kanban' },
        ]}
        aria-label="Choose view"
      />
    </Row>
  </Section>
);

export const Row_LegacyAPIStillWorks = () => (
  <Section title="ButtonGroupRow — backwards-compat shim">
    <Row label="silent ghosts (isV4Design, isMobile, legacyClass)">
      <ButtonGroupRow
        id="legacy-row-1"
        isV4Design
        isMobile={false}
        legacyClass="mi-button-group-row"
        selected={1}
        data={[
          { value: 1, label: 'On' },
          { value: 2, label: 'Off' },
        ]}
      />
    </Row>
  </Section>
);
