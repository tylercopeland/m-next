import React, { useState } from 'react';
import HeroBanner from '../src';

export default {
  title: 'm-next/Components/Feedback/HeroBanner',
  component: HeroBanner,
  parameters: { layout: 'padded' },
  argTypes: {
    backgroundColor: {
      control: { type: 'select' },
      options: ['blue', 'orange', 'green', 'red'],
    },
    onPrimaryButtonClick: { action: 'primary clicked' },
    onSecondaryButtonClick: { action: 'secondary clicked' },
    onClose: { action: 'closed' },
  },
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

const SAMPLE_IMAGE =
  'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002076/GSFC_20171208_Archive_e002076~medium.jpg';

export const Basic = () => (
  <Section title="Basic">
    <HeroBanner
      title="Welcome to Method"
      description="Get started with our platform and learn how Method can help you save time and win more work."
      imageSrc={SAMPLE_IMAGE}
    />
  </Section>
);

export const WithPrimaryAction = () => (
  <Section title="Primary action">
    <HeroBanner
      title="Welcome to Method"
      description="Get started with our platform and learn how Method can help you save time and win more work."
      imageSrc={SAMPLE_IMAGE}
      primaryButton="Get started"
    />
  </Section>
);

export const WithBothActions = () => (
  <Section title="Primary + secondary actions">
    <HeroBanner
      title="Welcome to Method"
      description="Get started with our platform and learn how Method can help you save time and win more work."
      imageSrc={SAMPLE_IMAGE}
      primaryButton="Get started"
      secondaryButton="Learn more"
    />
  </Section>
);

export const Backgrounds = () => (
  <Section title="backgroundColor — blue / orange / green / red">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HeroBanner
        title="Blue (default)"
        description="Neutral / informational tone."
        backgroundColor="blue"
        primaryButton="Action"
      />
      <HeroBanner
        title="Orange"
        description="Campaigns, marketing, or in-progress states."
        backgroundColor="orange"
        primaryButton="Action"
      />
      <HeroBanner
        title="Green"
        description="Success, payment, or positive milestones."
        backgroundColor="green"
        primaryButton="Action"
      />
      <HeroBanner
        title="Red"
        description="Critical announcements (use sparingly)."
        backgroundColor="red"
        primaryButton="Action"
      />
    </div>
  </Section>
);

export const Closeable = () => {
  const [visible, setVisible] = useState(true);
  return (
    <Section title="Close button (real <button> with aria-label)">
      {visible ? (
        <HeroBanner
          title="Schedule your demo"
          description="Book a personalized walkthrough."
          imageSrc={SAMPLE_IMAGE}
          primaryButton="Book demo"
          backgroundColor="green"
          hasClose
          onClose={() => setVisible(false)}
        />
      ) : (
        <button type="button" onClick={() => setVisible(true)}>
          Restore banner
        </button>
      )}
    </Section>
  );
};

export const TitleOnly = () => (
  <Section title="Title only — no description, no image, no actions">
    <HeroBanner title="Simple promotional banner" />
  </Section>
);

export const Interactive = () => {
  const [count, setCount] = useState(0);
  return (
    <Section title="Interactive — click count is updated by both buttons">
      <HeroBanner
        title="Interactive example"
        description="Click the buttons to see the click counter update."
        imageSrc={SAMPLE_IMAGE}
        primaryButton="Primary"
        secondaryButton="Secondary"
        onPrimaryButtonClick={() => setCount((c) => c + 1)}
        onSecondaryButtonClick={() => setCount((c) => c + 1)}
      />
      <div style={{ fontFamily: 'monospace', marginTop: 12 }}>clicks: {count}</div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <HeroBanner
        id="legacy-1"
        title="Legacy backgroundColor='blue-lighter'"
        description="Old '-lighter' suffix still renders — translated to 'blue'."
        backgroundColor="blue-lighter"
        primaryButton="OK"
      />
      <HeroBanner
        id="legacy-2"
        title="Legacy canDismiss + onBannerDismiss"
        description="Old prop names still work and are translated to hasClose + onClose."
        canDismiss
        onBannerDismiss={() => {
          // eslint-disable-next-line no-alert
          alert('dismissed via legacy onBannerDismiss');
        }}
        backgroundColor="orange-lighter"
      />
      <HeroBanner
        id="legacy-3"
        title="Legacy isMobile prop"
        description="isMobile is accepted but ignored — responsive behaviour is now CSS-driven (resize the viewport to see the layout shift)."
        isMobile
        imageSrc={SAMPLE_IMAGE}
        primaryButton="Action"
        backgroundColor="green-lighter"
      />
    </div>
  </Section>
);
