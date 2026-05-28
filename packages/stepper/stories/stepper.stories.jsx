import React, { useState } from 'react';
import Stepper from '../src';

export default {
  title: 'm-next/Components/Navigation/Stepper',
  component: Stepper,
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

const Row = ({ label, children }) => (
  <div style={{ padding: '12px 0', fontFamily }}>
    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{label}</div>
    <div>{children}</div>
  </div>
);

export const Basic = () => (
  <Section title="Basic — number of steps, current step">
    <Row label="steps={4} activeStep={0}">
      <Stepper steps={4} activeStep={0} showLabels />
    </Row>
    <Row label="steps={4} activeStep={1}">
      <Stepper steps={4} activeStep={1} showLabels />
    </Row>
    <Row label="steps={4} activeStep={3}">
      <Stepper steps={4} activeStep={3} showLabels />
    </Row>
  </Section>
);

export const WithLabels = () => (
  <Section title="Steps with explicit labels">
    <Row label='steps=[{label: ...}]'>
      <Stepper
        steps={[
          { label: 'Account' },
          { label: 'Details' },
          { label: 'Billing' },
          { label: 'Review' },
        ]}
        activeStep={1}
        showLabels
      />
    </Row>
    <Row label='steps={[strings]} (shorthand)'>
      <Stepper steps={['Account', 'Details', 'Billing', 'Review']} activeStep={2} showLabels />
    </Row>
  </Section>
);

export const AlternateLabel = () => (
  <Section title="alternativeLabel — labels under indicators">
    <Row label="alternativeLabel">
      <Stepper steps={4} activeStep={1} showLabels alternativeLabel />
    </Row>
    <Row label="alternativeLabel + named">
      <Stepper
        steps={['Account', 'Details', 'Billing', 'Review']}
        activeStep={1}
        showLabels
        alternativeLabel
      />
    </Row>
  </Section>
);

export const NoLabels = () => (
  <Section title="Indicators only — no labels">
    <Row label="showLabels={false}">
      <Stepper steps={4} activeStep={1} />
    </Row>
    <Row label="alternativeLabel + no labels">
      <Stepper steps={5} activeStep={2} alternativeLabel />
    </Row>
  </Section>
);

export const CustomIcon = () => (
  <Section title="Custom completed-step icon">
    <Row label='iconName="user"'>
      <Stepper steps={4} activeStep={2} showLabels iconName="user" />
    </Row>
  </Section>
);

export const Clickable = () => {
  const [active, setActive] = useState(2);
  const stepList = ['Account', 'Details', 'Billing', 'Review'];
  return (
    <Section title="onStepClick — completed + active steps are focusable">
      <Row label="click a step to navigate back">
        <Stepper steps={stepList} activeStep={active} showLabels onStepClick={(i) => setActive(i)} />
      </Row>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
        Active step: {active}. Try Tab to focus a step, then Enter or Space to activate.
      </div>
    </Section>
  );
};

export const InteractiveWizard = () => {
  const [step, setStep] = useState(0);
  const steps = ['Account', 'Details', 'Billing', 'Review'];
  return (
    <Section title="Wizard pattern">
      <Stepper steps={steps} activeStep={step} showLabels alternativeLabel />
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{ padding: '6px 14px' }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          style={{ padding: '6px 14px' }}
        >
          Next
        </button>
      </div>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => (
  <Section title="Backwards-compat shim (each fires one console.warn at first use)">
    <Row label="displayLabel (legacy)">
      <Stepper id="legacy-1" steps={4} activeStep={1} displayLabel />
    </Row>
    <Row label="isV4Design + isMobile (ignored)">
      <Stepper id="legacy-2" steps={3} activeStep={1} showLabels isV4Design isMobile />
    </Row>
    <Row label="legacyClass + displayAuto + compactStyle (ignored)">
      <Stepper
        id="legacy-3"
        steps={3}
        activeStep={2}
        showLabels
        legacyClass="ignored"
        displayAuto
        compactStyle
      />
    </Row>
  </Section>
);
