import React, { useState } from 'react';
import Tabs from '../src';

export default {
  title: 'm-next/Components/Navigation/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

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

const Panel = ({ children }) => (
  <div style={{ padding: 24, fontFamily, fontSize: 14, color: '#374151' }}>{children}</div>
);

const ControlledTabs = ({ tabList, initial, ...rest }) => {
  const [selected, setSelected] = useState(initial ?? tabList[0]?.id);
  return (
    <Tabs
      tabList={tabList}
      selectedTab={selected}
      onChange={(id) => setSelected(id)}
      onRenderTabContent={() => <Panel>Content for &quot;{selected}&quot;</Panel>}
      {...rest}
    />
  );
};

const fewTabs = [
  { id: 'data', caption: 'Data' },
  { id: 'display', caption: 'Display' },
  { id: 'formatting', caption: 'Formatting' },
];

const manyTabs = [
  { id: 'data', caption: 'Data' },
  { id: 'display', caption: 'Display' },
  { id: 'formatting', caption: 'Formatting' },
  { id: 'settings', caption: 'Settings' },
  { id: 'validation', caption: 'Validation' },
  { id: 'notes', caption: 'Notes' },
  { id: 'analytics', caption: 'Analytics' },
  { id: 'permissions', caption: 'Permissions' },
  { id: 'security', caption: 'Security' },
  { id: 'export', caption: 'Export' },
  { id: 'import', caption: 'Import' },
  { id: 'integrations', caption: 'Integrations' },
];

export const Basic = () => (
  <Section title="Basic">
    <ControlledTabs tabList={fewTabs} />
  </Section>
);

export const FullWidth = () => (
  <Section title="fullWidthTabs — distributes evenly, no More-menu">
    <ControlledTabs tabList={fewTabs} fullWidthTabs />
  </Section>
);

export const Overflow = () => (
  <Section title="Overflow — extra tabs roll into a More-menu">
    <div style={{ maxWidth: 600 }}>
      <ControlledTabs tabList={manyTabs} />
    </div>
  </Section>
);

export const DisabledTab = () => (
  <Section title="Disabled tab">
    <ControlledTabs
      tabList={[
        { id: 'a', caption: 'Active' },
        { id: 'b', caption: 'Available' },
        { id: 'c', caption: 'Locked', disabled: true },
      ]}
    />
  </Section>
);

export const Draggable = () => {
  const [tabs, setTabs] = useState(fewTabs);
  const [selected, setSelected] = useState(tabs[0].id);
  return (
    <Section title="Drag to reorder">
      <Tabs
        tabList={tabs}
        selectedTab={selected}
        onChange={(id) => setSelected(id)}
        onRenderTabContent={() => <Panel>Selected: {selected}</Panel>}
        onTabOrderChange={(next) => setTabs(next.map(({ id, caption }) => ({ id, caption })))}
      />
    </Section>
  );
};

export const CustomRenderHeader = () => (
  <Section title="onRenderTabHeader — custom button content">
    <ControlledTabs
      tabList={fewTabs}
      onRenderTabHeader={(tab) => (
        <span style={{ fontFamily }}>
          <span style={{ marginRight: 6 }}>•</span>
          {tab.caption}
        </span>
      )}
    />
  </Section>
);

export const RightIcon = () => (
  <Section title="onRenderTabHeaderRightIcon — trailing action slot">
    <ControlledTabs
      tabList={fewTabs}
      onRenderTabHeaderRightIcon={() => (
        <button type="button" style={{ fontFamily, fontSize: 13 }}>
          Add tab
        </button>
      )}
    />
  </Section>
);

export const Borderless = () => (
  <Section title="borderless — strip the panel's 1px border">
    <ControlledTabs tabList={fewTabs} borderless />
  </Section>
);

export const LegacyAPIStillWorks = () => {
  const [selected, setSelected] = useState('data');
  // eslint-disable-next-line no-console
  console.info('Legacy props supplied: forwardRef, isMobile, isV4Design, legacyClass, onRenderTabHeaderMobile');
  return (
    <Section title="Backwards-compat shim — legacy props accepted (forwardRef warns once)">
      <Tabs
        id="legacy-tabs"
        tabList={fewTabs}
        selectedTab={selected}
        onChange={(id) => setSelected(id)}
        onRenderTabContent={() => <Panel>Selected: {selected}</Panel>}
        // soft-shim — warns once:
        forwardRef={null}
        // silently ignored:
        isV4Design
        isMobile={false}
        legacyClass="my-old-class"
        displayAuto
        onRenderTabHeaderMobile={() => null}
      />
    </Section>
  );
};
