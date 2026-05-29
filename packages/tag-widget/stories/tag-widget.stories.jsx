import React, { useState } from 'react';
import TagWidget, { EditableTagWidget, ReadOnlyTagWidget } from '../src';

export default {
  title: 'm-next/Components/Form/TagWidget',
  component: TagWidget,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 480 }}>{children}</div>
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

const tagsList = [
  { name: 'aaa', colour: '#84F3FF' },
  { name: 'bbb', colour: '#A9D9BF' },
  { name: 'ccc', colour: '#FFABB5' },
  { name: 'ddd', colour: '#BACAD0' },
  { name: 'eee', colour: '#FFEA80' },
  { name: 'fff', colour: '#FFACA1' },
  { name: 'ggg', colour: '#91A2FF' },
  { name: 'hhh', colour: '#FFCDAB' },
  { name: 'iii', colour: '' },
];

const ControlledEditable = ({ initialValue = [], ...rest }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <EditableTagWidget
      tagsList={tagsList}
      value={value}
      onChange={(commaJoined) => setValue(commaJoined.split(',').filter(Boolean))}
      {...rest}
    />
  );
};

export const ReadOnly = () => (
  <Section title="Read-only — colored pills, no interaction">
    <Row label="all known tags">
      <ReadOnlyTagWidget
        label="Applied tags"
        tagsList={tagsList}
        value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh']}
      />
    </Row>
    <Row label="unknown tag (blue fallback)">
      <ReadOnlyTagWidget label="Tags" tagsList={tagsList} value={['design', 'system', 'audit']} />
    </Row>
    <Row label="empty">
      <ReadOnlyTagWidget label="Empty list" tagsList={tagsList} value={[]} />
    </Row>
    <Row label="no label">
      <ReadOnlyTagWidget tagsList={tagsList} value={['aaa', 'bbb']} />
    </Row>
    <Row label="size=regular">
      <ReadOnlyTagWidget
        label="Larger pills"
        tagsList={tagsList}
        value={['aaa', 'bbb', 'ccc']}
        size="regular"
      />
    </Row>
  </Section>
);

export const Editable = () => (
  <Section title="Editable — type, Enter to add, × to remove">
    <Row label="basic">
      <ControlledEditable label="Tags" suggestions={['eee', 'ggg']} initialValue={['aaa', 'bbb']} />
    </Row>
    <Row label="with manage button">
      <ControlledEditable
        label="Tags"
        suggestions={['eee', 'ggg']}
        initialValue={['aaa', 'bbb']}
        showManageTags
        onActionButtonClick={() => alert('Manage tags clicked')}
      />
    </Row>
    <Row label="disabled">
      <EditableTagWidget label="Locked" tagsList={tagsList} value={['aaa', 'bbb']} disabled />
    </Row>
    <Row label="empty">
      <ControlledEditable label="No tags yet" suggestions={['aaa', 'bbb']} />
    </Row>
  </Section>
);

export const Wrapper = () => {
  const [value, setValue] = useState(['aaa', 'bbb']);
  const [isEditable, setIsEditable] = useState(false);
  return (
    <Section title="TagWidget wrapper — toggle isEditable">
      <Row label="toggle">
        <label style={{ fontFamily, fontSize: 13 }}>
          <input
            type="checkbox"
            checked={isEditable}
            onChange={(e) => setIsEditable(e.target.checked)}
          />{' '}
          isEditable
        </label>
      </Row>
      <Row label={`mode = ${isEditable ? 'editable' : 'read-only'}`}>
        <TagWidget
          label="Tags"
          tagsList={tagsList}
          value={value}
          isEditable={isEditable}
          suggestions={['eee', 'ggg']}
          onChange={(commaJoined) => setValue(commaJoined.split(',').filter(Boolean))}
        />
      </Row>
    </Section>
  );
};

export const ColorMapping = () => (
  <Section title="All 8 mapped colours + fallback (blue)">
    <Row label="every family">
      <ReadOnlyTagWidget
        label="One tag per colour"
        tagsList={tagsList}
        value={['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii']}
      />
    </Row>
    <Row label="unknown tags fall back to blue">
      <ReadOnlyTagWidget label="Free-form names" tagsList={[]} value={['urgent', 'review', 'shipped']} />
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="caption (read-only)">
      <ReadOnlyTagWidget
        id="legacy-1"
        caption="Legacy caption prop"
        tagsList={tagsList}
        value={['aaa', 'bbb']}
      />
    </Row>
    <Row label="caption (editable)">
      <EditableTagWidget
        id="legacy-2"
        caption="Legacy caption prop"
        tagsList={tagsList}
        value={['aaa']}
      />
    </Row>
    <Row label="isV4Design / isMobile / displayAuto (ignored)">
      <ReadOnlyTagWidget
        id="legacy-3"
        label="Ghost props no-op"
        tagsList={tagsList}
        value={['ggg']}
        isV4Design
        isMobile
        displayAuto
        compactStyle
        legacyClass="ignored"
      />
    </Row>
  </Section>
);
