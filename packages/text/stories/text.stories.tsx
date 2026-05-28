import React, { useRef } from 'react';
import { colors } from '@m-next/tokens';
import Text from '../src';

export default {
  title: 'm-next/Foundation/Text',
  component: Text,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

type RowProps = { label: string; children: React.ReactNode };
const Row = ({ label, children }: RowProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 24,
      padding: '12px 0',
      fontFamily,
    }}
  >
    <div
      style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: colors.grey.base }}
    >
      {label}
    </div>
    <div style={{ flex: 1, maxWidth: 540 }}>{children}</div>
  </div>
);

type SectionProps = { title: string; children: React.ReactNode };
const Section = ({ title, children }: SectionProps) => (
  <section style={{ marginBottom: 32, fontFamily }}>
    <h3
      style={{
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.grey.dark,
        marginBottom: 8,
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

export const Basic = () => (
  <Section title='Basic'>
    <Row label='paragraph (default)'>
      <Text>The quick brown fox jumps over the lazy dog.</Text>
    </Row>
    <Row label='as=DIV'>
      <Text as='DIV'>Rendered as a &lt;div&gt;.</Text>
    </Row>
    <Row label='as=H1'>
      <Text as='H1'>Rendered as a heading.</Text>
    </Row>
  </Section>
);

export const Typography = () => (
  <Section title='Font size / weight / line-height'>
    <Row label='fontSize=12px'>
      <Text fontSize='12px'>Small text — 12px.</Text>
    </Row>
    <Row label='fontSize=14px (default)'>
      <Text fontSize='14px'>Regular text — 14px.</Text>
    </Row>
    <Row label='fontSize=18px'>
      <Text fontSize='18px'>Larger text — 18px.</Text>
    </Row>
    <Row label='fontWeight=bold'>
      <Text fontWeight='bold'>Bold text.</Text>
    </Row>
    <Row label='fontWeight=600'>
      <Text fontWeight={600}>Semibold text (600).</Text>
    </Row>
    <Row label='lineHeight=32px'>
      <Text lineHeight='32px'>Lines spaced at 32px to give breathing room.</Text>
    </Row>
  </Section>
);

export const Colors = () => (
  <Section title='Color'>
    <Row label='default (inherits)'>
      <Text>No fontColor set — inherits from parent.</Text>
    </Row>
    <Row label='colors.grey.darkest'>
      <Text fontColor={colors.grey.darkest}>Darkest grey — body text.</Text>
    </Row>
    <Row label='colors.grey.base'>
      <Text fontColor={colors.grey.base}>Base grey — secondary text.</Text>
    </Row>
    <Row label='colors.blue.base'>
      <Text fontColor={colors.blue.base}>Blue accent.</Text>
    </Row>
    <Row label='colors.red.base'>
      <Text fontColor={colors.red.base}>Error red.</Text>
    </Row>
  </Section>
);

export const Spacing = () => (
  <Section title='Margins'>
    <Row label='mt=24, mb=24'>
      <div style={{ background: colors.grey.lighter, padding: 1 }}>
        <Text mt='24px' mb='24px' fontColor={colors.grey.darkest}>
          Text with 24px top and bottom margin (visible against the tinted background).
        </Text>
      </div>
    </Row>
    <Row label='ml=16'>
      <Text ml='16px' fontColor={colors.grey.darkest}>
        Text with 16px left margin.
      </Text>
    </Row>
  </Section>
);

export const Alignment = () => (
  <Section title='Alignment + wrapping'>
    <Row label='center'>
      <Text center>Centered text.</Text>
    </Row>
    <Row label='wordBreak=break-all'>
      <div style={{ width: 220, border: `1px dashed ${colors.grey.light}` }}>
        <Text wordBreak='break-all'>
          Supercalifragilisticexpialidocious — break-all forces mid-word wrapping.
        </Text>
      </div>
    </Row>
    <Row label='whiteSpace=nowrap'>
      <div
        style={{
          width: 220,
          overflow: 'hidden',
          border: `1px dashed ${colors.grey.light}`,
        }}
      >
        <Text whiteSpace='nowrap' overflow='hidden'>
          A single line that should not wrap and overflows its container.
        </Text>
      </div>
    </Row>
  </Section>
);

export const InlineStyling = () => (
  <Section title='inlineStyling / sx'>
    <Row label='inlineStyling'>
      <Text inlineStyling={{ fontStyle: 'italic', letterSpacing: '0.5px' }}>
        Italics applied via inlineStyling.
      </Text>
    </Row>
    <Row label='sx (DIV)'>
      <Text
        as='DIV'
        sx={{ padding: '12px', background: colors.blue.lighter, borderRadius: 4 }}
      >
        Padded div with sx overrides.
      </Text>
    </Row>
  </Section>
);

export const LegacyClasses = () => (
  <Section title='legacyClasses — kept functional for Method UI 3 markup'>
    <Row label='caption-font-xlarge'>
      <Text legacyClasses='mi-caption-font-xlarge'>Translated to fontSize 18px.</Text>
    </Row>
    <Row label='font-large + color-primary'>
      <Text legacyClasses='font-large mi-color-primary'>Translated by classConverter.</Text>
    </Row>
  </Section>
);

export const Nested = () => (
  <Section title='Nested Text'>
    <Row label='inline children'>
      <Text fontSize='16px' fontColor={colors.grey.darkest}>
        This is a parent text with
        <Text
          as='DIV'
          fontSize='14px'
          fontColor={colors.red.base}
          sx={{ display: 'inline', margin: '0 5px' }}
        >
          nested child text
        </Text>
        inside it.
      </Text>
    </Row>
  </Section>
);

const ForwardRefDemo = () => {
  const ref = useRef<HTMLParagraphElement | null>(null);
  return (
    <>
      <Text ref={ref} fontColor={colors.grey.darkest}>
        Text accessed via React ref.
      </Text>
      <button
        type='button'
        onClick={() => ref.current && ref.current.scrollIntoView({ behavior: 'smooth' })}
        style={{ marginTop: 8 }}
      >
        Scroll to me
      </button>
    </>
  );
};

export const WithRef = () => (
  <Section title='React ref forwarding'>
    <Row label='ref={ref}'>
      <ForwardRefDemo />
    </Row>
  </Section>
);

const LegacyForwardRefDemo = () => {
  const legacyRef = useRef<HTMLParagraphElement | null>(null);
  return (
    <Text id='legacy-fr' forwardRef={legacyRef} fontColor={colors.grey.darkest}>
      Forwarded via legacy `forwardRef` prop (warns once).
    </Text>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title='Backwards-compat shim (forwardRef warns once; ghosts are silently ignored)'>
    <Row label='forwardRef prop'>
      <LegacyForwardRefDemo />
    </Row>
    <Row label='isV4Design (ignored)'>
      <Text id='legacy-v4' isV4Design>
        isV4Design has no effect.
      </Text>
    </Row>
    <Row label='isMobile (ignored)'>
      <Text id='legacy-mobile' isMobile>
        isMobile has no effect — use CSS media queries.
      </Text>
    </Row>
    <Row label='legacyClass (ignored)'>
      <Text id='legacy-class' legacyClass='old-class'>
        legacyClass is ignored — use `className` or `legacyClasses`.
      </Text>
    </Row>
    <Row label='displayAuto (ignored)'>
      <Text id='legacy-display' displayAuto>
        displayAuto has no effect.
      </Text>
    </Row>
    <Row label='compactStyle (ignored)'>
      <Text id='legacy-compact' compactStyle>
        compactStyle has no effect.
      </Text>
    </Row>
  </Section>
);
