import React, { useState } from 'react';
import ButtonGroup from '../src';

export default {
  title: 'm-next/Components/Action/ButtonGroup',
  component: ButtonGroup,
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

const saveActions = [
  { value: 'save', label: 'Save' },
  { value: 'save-close', label: 'Save and close' },
  { value: 'save-new', label: 'Save and create new' },
];

const singleAction = [{ value: 'save', label: 'Save' }];

export const Variants = () => (
  <Section title="buttonStyle variants">
    <Row label="primary">
      <ButtonGroup buttonStyle="primary" isDropdown data={saveActions} />
    </Row>
    <Row label="ghost">
      <ButtonGroup buttonStyle="ghost" isDropdown data={saveActions} />
    </Row>
    <Row label="plain">
      <ButtonGroup buttonStyle="plain" isDropdown data={saveActions} />
    </Row>
    <Row label="calendarMenu">
      <ButtonGroup buttonStyle="calendarMenu" isDropdown data={saveActions} />
    </Row>
  </Section>
);

export const SplitButton = () => (
  <Section title="Split-button — primary action plus dropdown">
    <Row label="isDropdown">
      <ButtonGroup buttonStyle="primary" isDropdown data={saveActions} onClick={() => {}} />
    </Row>
    <Row label="single action">
      <ButtonGroup buttonStyle="primary" data={singleAction} onClick={() => {}} />
    </Row>
  </Section>
);

export const WithMenuLabel = () => (
  <Section title="hasMenuLabel — static button text, items in the menu">
    <Row label="hasMenuLabel">
      <ButtonGroup
        buttonStyle="primary"
        hasMenuLabel
        menuLabel="Actions"
        data={[
          { value: 'placeholder', label: 'Actions' },
          { value: 'edit', label: 'Edit' },
          { value: 'duplicate', label: 'Duplicate' },
          { value: 'delete', label: 'Delete' },
        ]}
      />
    </Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default">
      <ButtonGroup buttonStyle="primary" isDropdown data={saveActions} />
    </Row>
    <Row label="disabled">
      <ButtonGroup buttonStyle="primary" isDropdown data={saveActions} disabled />
    </Row>
    <Row label="item disabled">
      <ButtonGroup
        buttonStyle="primary"
        isDropdown
        data={[
          { value: 'save', label: 'Save' },
          { value: 'close', label: 'Save and close', disabled: true },
          { value: 'new', label: 'Save and create new' },
        ]}
      />
    </Row>
  </Section>
);

export const WithLabel = () => (
  <Section title="With caption label">
    <Row label="label + showCaption">
      <ButtonGroup
        buttonStyle="primary"
        label="Save actions"
        isDropdown
        data={saveActions}
      />
    </Row>
  </Section>
);

export const Sizes = () => (
  <Section title="size">
    <Row label='size="medium"'>
      <ButtonGroup buttonStyle="primary" size="medium" isDropdown data={saveActions} />
    </Row>
    <Row label='size="small"'>
      <ButtonGroup buttonStyle="primary" size="small" isDropdown data={saveActions} />
    </Row>
  </Section>
);

// Used by ButtonGroupRow stories — kept in same hierarchy via the title above
// (Storybook will surface them as sibling stories).
// eslint-disable-next-line no-unused-vars
const _shared = { Row, Section, fontFamily };

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="legacyClass">
      <ButtonGroup
        id="legacy-1"
        buttonStyle="primary"
        legacyClass="mi-button-group-primary"
        isDropdown
        data={saveActions}
      />
    </Row>
    <Row label="backgroundColor (hex)">
      <ButtonGroup
        id="legacy-2"
        buttonStyle="primary"
        backgroundColor="#0D71C8"
        color="#ffffff"
        isDropdown
        data={saveActions}
      />
    </Row>
    <Row label="silent ghosts (isV4Design, isMobile, displayAuto, compactStyle)">
      <ButtonGroup
        id="legacy-3"
        buttonStyle="primary"
        isV4Design
        isMobile={false}
        displayAuto
        compactStyle
        isDropdown
        data={saveActions}
      />
    </Row>
  </Section>
);
