import React from 'react';
import { colors } from '@m-next/tokens';
import { Icon } from '../src';
import iconPaths from '../src/icon-paths';

export default {
  title: 'm-next/Components/Display/Icon',
  component: Icon,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 160, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
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

const additionalIcons = [
  'count-of',
  'settings',
  'settings2',
  'filter-group',
  'expand-V4',
  'circle-plus-V4',
  'arrow-right-alt',
  'arrow-left-alt',
  'compare',
  'check-circle',
  'check-circle-filled',
  'grid-V4',
  'arrow-up-down',
  'arrow-up-V4',
  'arrow-down-V4',
  'drag-V4',
  'filter-V4',
  'eye-open-V4',
  'eye-closed-V4',
  'tabs-V4',
  'tabs-condensed-V4',
  'link-2',
  'plus-V4',
  'screens-V4',
  'screen-V4',
  'font-color',
  'align-left',
  'align-center',
  'align-right',
  'text-align-left',
  'text-align-center',
  'text-align-right',
  'font-weight-regular',
  'font-weight-bold',
  'font-weight-xbold',
  'trash-V4',
  'edit-V4',
  'reset-V4',
  'fill-color',
  'horizontal',
  'vertical',
  'portrait-image',
  'landscape-image',
  'checklist',
  'user',
  'calendar-V4',
  'mission-graphic',
  'palette',
  'back',
  'book',
  'ai-icon',
  'ai-gradient-icon',
  'files-folder',
  'home',
  'pages',
  'ai-chat',
  'box-rounded',
  'close-compact',
  'edit-pen',
  'target-V4',
];

export const Basic = () => (
  <Section title="Basic icon">
    <Row label="default"><Icon name="count-of" size={24} label="Count of" /></Row>
    <Row label="small"><Icon name="check-circle" size={16} label="Saved" color={colors.green.base} /></Row>
    <Row label="large"><Icon name="settings" size={32} label="Settings" /></Row>
  </Section>
);

export const Sizes = () => (
  <Section title="Sizes">
    {[12, 16, 20, 24, 32, 48].map((s) => (
      <Row key={s} label={`size={${s}}`}><Icon name="check-circle" size={s} label="Saved" /></Row>
    ))}
  </Section>
);

export const Colors = () => (
  <Section title="Colors via @m-next/tokens">
    <Row label="blue.base"><Icon name="check-circle" size={20} color={colors.blue.base} label="Info" /></Row>
    <Row label="green.base"><Icon name="check-circle" size={20} color={colors.green.base} label="Success" /></Row>
    <Row label="red.base"><Icon name="warning-sign" size={20} color={colors.red.base} label="Error" /></Row>
    <Row label="yellow.base"><Icon name="warning-sign" size={20} color={colors.yellow.base} label="Warning" /></Row>
    <Row label="grey.base"><Icon name="settings" size={20} color={colors.grey.base} label="Settings" /></Row>
  </Section>
);

export const A11yPatterns = () => (
  <Section title="Accessibility — meaningful vs decorative">
    <Row label="decorative">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name="settings" size={16} decorative /> Settings
      </span>
    </Row>
    <Row label="label='Saved'"><Icon name="check-circle" size={20} color={colors.green.base} label="Saved" /></Row>
    <Row label="label='Delete'"><Icon name="trash-V4" size={20} color={colors.red.base} label="Delete" onClick={() => {}} /></Row>
  </Section>
);

export const States = () => (
  <Section title="States">
    <Row label="default"><Icon name="settings" size={20} label="Settings" /></Row>
    <Row label="onClick (focusable)"><Icon name="settings" size={20} label="Settings" onClick={() => {}} /></Row>
    <Row label="disabled"><Icon name="settings" size={20} label="Settings" disabled /></Row>
    <Row label="border"><Icon name="settings" size={20} label="Settings" border /></Row>
    <Row label="isRound + bg">
      <Icon
        name="settings"
        size={20}
        label="Settings"
        isRound
        backgroundColor={colors.blue.lighter}
        color={colors.blue.base}
      />
    </Row>
    <Row label="hover color">
      <Icon name="settings" size={20} label="Settings" color={colors.grey.base} hoverColor={colors.blue.base} />
    </Row>
  </Section>
);

export const IconList = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, overflow: 'scroll', height: 480, padding: 8 }}>
    {iconPaths.icons.map((icon) =>
      icon.properties.name.split(',').map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            gap: 8,
            flexDirection: 'column',
            width: 80,
            alignItems: 'center',
            padding: 8,
            border: '1px solid #EEF5F7',
            borderRadius: 4,
          }}
        >
          <Icon name={name} size={24} label={name} />
          <div style={{ wordBreak: 'break-word', textAlign: 'center', fontSize: 11, fontFamily: 'monospace' }}>
            {name}
          </div>
        </div>
      )),
    )}
    {additionalIcons.map((name) => (
      <div
        key={name}
        style={{
          display: 'flex',
          gap: 8,
          flexDirection: 'column',
          width: 80,
          alignItems: 'center',
          padding: 8,
          border: '1px solid #EEF5F7',
          borderRadius: 4,
        }}
      >
        <Icon name={name} size={24} label={name} />
        <div style={{ wordBreak: 'break-word', textAlign: 'center', fontSize: 11, fontFamily: 'monospace' }}>
          {name}
        </div>
      </div>
    ))}
  </div>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards compatibility — both names work, legacy ghosts accepted">
    <Row label="default export">
      {/* eslint-disable-next-line global-require */}
      {(() => {
        const SvgIcon = require('../src').default;
        return <SvgIcon name="settings" size={20} label="Settings (default export)" />;
      })()}
    </Row>
    <Row label="legacy ghosts (no effect)">
      <Icon
        name="settings"
        size={20}
        label="Settings"
        isV4Design
        isMobile
        legacyClass="ignored"
        displayAuto
        compactStyle
      />
    </Row>
    <Row label="forwardRef prop (warns)">
      <Icon
        name="settings"
        size={20}
        label="Settings"
        forwardRef={(node) => {
          // legacy callback ref — receives the wrapper element
          void node;
        }}
      />
    </Row>
  </Section>
);
