import React from 'react';
import Pill from '../src';

export default {
  title: 'm-next/Components/Pill',
  component: Pill,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const COLOR_SCHEMES = [
  'blue',
  'green',
  'fuchsia',
  'grey',
  'yellow',
  'red',
  'purple',
  'orange',
  'teal',
  'transparent',
];
const VARIANTS = ['subtle', 'solid', 'ghost'];

const Row = ({ label, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '12px 0',
      fontFamily,
    }}
  >
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>
      {label}
    </div>
    <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {children}
    </div>
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

export const Basic = () => (
  <Section title="Basic pills">
    <Row label="default">
      <Pill>Hello</Pill>
    </Row>
    <Row label="colorScheme=green">
      <Pill colorScheme="green">Active</Pill>
    </Row>
    <Row label="size=sm">
      <Pill size="sm" colorScheme="blue">
        small
      </Pill>
    </Row>
    <Row label="size=md (default)">
      <Pill size="md" colorScheme="blue">
        medium
      </Pill>
    </Row>
  </Section>
);

export const Colors = () => (
  <Section title="All colorSchemes (subtle variant)">
    <Row label="subtle">
      {COLOR_SCHEMES.map((scheme) => (
        <Pill key={scheme} colorScheme={scheme} variant="subtle">
          {scheme}
        </Pill>
      ))}
    </Row>
    <Row label="solid">
      {COLOR_SCHEMES.map((scheme) => (
        <Pill key={scheme} colorScheme={scheme} variant="solid">
          {scheme}
        </Pill>
      ))}
    </Row>
    <Row label="ghost">
      {COLOR_SCHEMES.map((scheme) => (
        <Pill key={scheme} colorScheme={scheme} variant="ghost">
          {scheme}
        </Pill>
      ))}
    </Row>
  </Section>
);

export const Variants = () => (
  <Section title="Variants">
    {VARIANTS.map((variant) => (
      <Row key={variant} label={variant}>
        <Pill variant={variant} colorScheme="blue">
          blue {variant}
        </Pill>
        <Pill variant={variant} colorScheme="green">
          green {variant}
        </Pill>
        <Pill variant={variant} colorScheme="red">
          red {variant}
        </Pill>
      </Row>
    ))}
  </Section>
);

export const Sizes = () => (
  <Section title="Sizes">
    <Row label="sm">
      <Pill size="sm" colorScheme="blue">
        blue
      </Pill>
      <Pill size="sm" colorScheme="green" variant="solid">
        green solid
      </Pill>
      <Pill size="sm" colorScheme="grey" leadIcon={{ name: 'dot' }}>
        with dot
      </Pill>
    </Row>
    <Row label="md">
      <Pill size="md" colorScheme="blue">
        blue
      </Pill>
      <Pill size="md" colorScheme="green" variant="solid">
        green solid
      </Pill>
      <Pill size="md" colorScheme="grey" leadIcon={{ name: 'dot' }}>
        with dot
      </Pill>
    </Row>
  </Section>
);

export const WithLeadingDot = () => (
  <Section title="Leading dot (status pattern)">
    {COLOR_SCHEMES.filter((s) => s !== 'transparent').map((scheme) => (
      <Row key={scheme} label={scheme}>
        <Pill colorScheme={scheme} leadIcon={{ name: 'dot' }}>
          {scheme}
        </Pill>
      </Row>
    ))}
  </Section>
);

export const Deletable = () => (
  <Section title="onDelete renders a trailing ×">
    <Row label="onDelete">
      <Pill colorScheme="blue" onDelete={() => {}}>
        Removable tag
      </Pill>
      <Pill colorScheme="green" onDelete={() => {}}>
        Another tag
      </Pill>
      <Pill colorScheme="fuchsia" variant="solid" onDelete={() => {}}>
        Solid tag
      </Pill>
    </Row>
    <Row label="disabled">
      <Pill colorScheme="grey" disabled onDelete={() => {}}>
        Locked tag
      </Pill>
    </Row>
  </Section>
);

export const Clickable = () => (
  <Section title="onClick — pill behaves like an inline action">
    <Row label="ghost + trailing plus">
      <Pill
        colorScheme="transparent"
        variant="ghost"
        bold={false}
        fontSize={14}
        trailIcon={{ name: 'plus', size: 12 }}
        onClick={() => {}}
      >
        Add filter
      </Pill>
    </Row>
  </Section>
);

export const TruncatesLongText = () => (
  <Section title="maxWidth + long children">
    <Row label="maxWidth=160px">
      <Pill colorScheme="blue" maxWidth={160}>
        This pill has way more content than fits.
      </Pill>
    </Row>
  </Section>
);

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label='size="narrow"'>
      <Pill id="legacy-narrow" size="narrow" colorScheme="blue">
        legacy narrow
      </Pill>
    </Row>
    <Row label='size="regular"'>
      <Pill id="legacy-regular" size="regular" colorScheme="green">
        legacy regular
      </Pill>
    </Row>
    <Row label='colorScheme="v4-blue"'>
      <Pill id="legacy-v4-blue" colorScheme="v4-blue">
        legacy v4-blue
      </Pill>
    </Row>
    <Row label='colorScheme="v4-gray"'>
      <Pill id="legacy-v4-gray" colorScheme="v4-gray">
        legacy v4-gray
      </Pill>
    </Row>
    <Row label='colorScheme="v4-red"'>
      <Pill id="legacy-v4-red" colorScheme="v4-red">
        legacy v4-red
      </Pill>
    </Row>
    <Row label="forwardRef prop">
      <Pill id="legacy-forwardRef" forwardRef={React.createRef()} colorScheme="grey">
        legacy forwardRef
      </Pill>
    </Row>
  </Section>
);
