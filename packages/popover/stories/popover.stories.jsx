import React, { useRef, useState } from 'react';
import Popover from '../src';

export default {
  title: 'm-next/Components/Overlay/Popover',
  component: Popover,
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

const TriggerButton = React.forwardRef(function TriggerButton({ children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      style={{
        padding: '8px 14px',
        background: '#022266',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        fontFamily,
        fontSize: 13,
        cursor: 'pointer',
      }}
      {...rest}
    >
      {children}
    </button>
  );
});

const PanelBody = ({ children }) => (
  <div style={{ padding: 16, minWidth: 240, fontFamily, fontSize: 13, lineHeight: 1.5 }}>
    {children}
  </div>
);

// ============ Basic ============

export const Basic = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Section title="Click to open, click-outside / ESC to close">
      <TriggerButton
        onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
      >
        Open popover
      </TriggerButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        marginVertical={4}
      >
        <PanelBody>
          <strong>Popover content</strong>
          <p style={{ margin: '4px 0 0' }}>Click outside to dismiss.</p>
        </PanelBody>
      </Popover>
    </Section>
  );
};

// ============ Placement matrix ============

const PlacementExample = ({ anchorOrigin, transformOrigin, label }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <div style={{ display: 'inline-block', margin: 24 }}>
      <TriggerButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        {label}
      </TriggerButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        marginVertical={6}
        marginHorizontal={6}
      >
        <PanelBody>{label}</PanelBody>
      </Popover>
    </div>
  );
};

export const Placements = () => (
  <Section title="anchorOrigin + transformOrigin">
    <PlacementExample
      label="bottom-left"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    />
    <PlacementExample
      label="bottom-right"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    />
    <PlacementExample
      label="top-left"
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    />
    <PlacementExample
      label="right-center"
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    />
  </Section>
);

// ============ Modal-style popover ============

export const ModalWithFocusTrap = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Section title="modal + trapFocus (role='dialog', aria-modal='true')">
      <TriggerButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        Open modal popover
      </TriggerButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        marginVertical={6}
        modal
        trapFocus
        width={320}
        aria-label="Edit name"
      >
        <PanelBody>
          <label htmlFor="popover-name" style={{ display: 'block', marginBottom: 4 }}>
            Name
          </label>
          <input
            id="popover-name"
            type="text"
            defaultValue="Jane"
            style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <TriggerButton onClick={() => setAnchorEl(null)}>Cancel</TriggerButton>
            <TriggerButton onClick={() => setAnchorEl(null)}>Save</TriggerButton>
          </div>
        </PanelBody>
      </Popover>
    </Section>
  );
};

// ============ Inline (no portal) ============

export const Inline = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Section title="inline mode renders without a portal">
      <div style={{ position: 'relative', padding: 24, border: '1px dashed #BACAD0' }}>
        <TriggerButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
          Inline trigger
        </TriggerButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          inline
          relativeToParent
          marginVertical={4}
        >
          <PanelBody>I render inside the dashed box, not on the body portal.</PanelBody>
        </Popover>
      </div>
    </Section>
  );
};

// ============ Custom widths ============

export const WidthAndStyle = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <Section title="width + style overrides">
      <TriggerButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
        Open wide popover
      </TriggerButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        marginVertical={4}
        width={420}
        style={{ background: '#FFFFFF', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      >
        <PanelBody>
          A 420px-wide popover with a soft shadow + rounded corners — supplied via the standard
          <code> style </code> prop.
        </PanelBody>
      </Popover>
    </Section>
  );
};

// ============ Soft-shim demo ============

export const LegacyAPIStillWorks = () => {
  const triggerRef = useRef(null);
  const legacyRef = useRef(null);
  const [openTrigger, setOpenTrigger] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Section title="Backwards-compat shim (each fires one console.warn at first use)">
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <TriggerButton ref={triggerRef} onClick={() => setOpenTrigger((v) => !v)}>
            triggerRef
          </TriggerButton>
          <Popover
            id="legacy-popover-1"
            open={openTrigger}
            triggerRef={triggerRef}
            onClose={() => setOpenTrigger(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            marginVertical={4}
          >
            <PanelBody>Anchored via legacy `triggerRef` (warns once).</PanelBody>
          </Popover>
        </div>

        <div>
          <TriggerButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
            disableClickOutside
          </TriggerButton>
          <Popover
            id="legacy-popover-2"
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            disableClickOutside
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            marginVertical={4}
          >
            <PanelBody>
              Closes only via ESC — `disableClickOutside` legacy prop still wired.
            </PanelBody>
          </Popover>
        </div>

        <div>
          <TriggerButton
            onClick={(e) => setOpenDisable(true) || setAnchorEl(e.currentTarget)}
          >
            forwardRef prop
          </TriggerButton>
          <Popover
            id="legacy-popover-3"
            open={openDisable && Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setOpenDisable(false)}
            forwardRef={legacyRef}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            marginVertical={4}
            isV4Design
            isMobile
            displayAuto
            compactStyle
            legacyClass="ignored"
          >
            <PanelBody>
              `forwardRef` prop chained; silently-ignored ghosts (`isV4Design`, etc.) accepted.
            </PanelBody>
          </Popover>
        </div>
      </div>
    </Section>
  );
};
