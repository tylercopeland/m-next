import React, { useRef, useState } from 'react';
import Container, { InfiniteScrollContainer } from '../src';

export default {
  title: 'm-next/Components/Display/Container',
  component: Container,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, padding: '12px 0', fontFamily }}>
    <div style={{ width: 200, fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{label}</div>
    <div style={{ flex: 1, maxWidth: 520 }}>{children}</div>
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

const SampleContent = ({ lines = 1 }) => (
  <div style={{ fontFamily }}>
    {Array.from({ length: lines }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <p key={i} style={{ margin: '4px 0' }}>
        Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
    ))}
  </div>
);

export const Basic = () => (
  <Section title="Basic surface">
    <Row label="default"><Container><SampleContent /></Container></Row>
    <Row label="elevated (borderless={false})">
      <Container borderless={false}><SampleContent /></Container>
    </Row>
    <Row label="square (isRound={false})">
      <Container isRound={false}><SampleContent /></Container>
    </Row>
    <Row label="custom padding"><Container padding="32px"><SampleContent /></Container></Row>
    <Row label="hidden (isVisible={false})">
      <Container isVisible={false}><SampleContent /></Container>
    </Row>
  </Section>
);

export const Sizing = () => (
  <Section title="Width / height">
    <Row label="width=320"><Container width="320px"><SampleContent /></Container></Row>
    <Row label="width=50%"><Container width="50%"><SampleContent /></Container></Row>
    <Row label="height=120"><Container height="120px"><SampleContent /></Container></Row>
    <Row label="maxHeight=80">
      <Container maxHeight="80px"><SampleContent lines={6} /></Container>
    </Row>
  </Section>
);

export const Loading = () => (
  <Section title="Loading state">
    <Row label="isLoading">
      <Container isLoading width="320px" height="120px"><SampleContent /></Container>
    </Row>
    <Row label="isLoading + hasChildLoading (children own skeleton)">
      <Container isLoading hasChildLoading width="320px" height="120px">
        <SampleContent />
      </Container>
    </Row>
  </Section>
);

export const Interactive = () => {
  const [hoverCount, setHoverCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  return (
    <Section title="Interactive">
      <Row label="onClick (cursor flips)">
        <Container onClick={() => setClickCount((c) => c + 1)} borderless={false}>
          Clicked {clickCount} times.
        </Container>
      </Row>
      <Row label="hoverStyle">
        <Container
          hoverStyle={{ backgroundColor: '#EEF5F7', cursor: 'pointer' }}
          onMouseEnter={() => setHoverCount((c) => c + 1)}
          borderless={false}
        >
          Hovered {hoverCount} times. Mouse over to see the hover background.
        </Container>
      </Row>
    </Section>
  );
};

export const Scrollable = () => (
  <Section title="scrollable (uses simplebar-react)">
    <Row label="scrollable, height=200">
      <Container scrollable height="200px" borderless={false}>
        <SampleContent lines={20} />
      </Container>
    </Row>
    <Row label="scrollable + onScroll">
      <Container
        scrollable
        height="200px"
        borderless={false}
        onScroll={(e) => {
          // eslint-disable-next-line no-console
          console.log('scrollTop:', e.target.scrollTop);
        }}
      >
        <SampleContent lines={20} />
      </Container>
    </Row>
  </Section>
);

export const WithRef = () => {
  const ref = useRef(null);
  const [bounds, setBounds] = useState(null);
  return (
    <Section title="React forwardRef API">
      <Row label="ref={…}">
        <div>
          <Container ref={ref} borderless={false}>
            Click the button below; the container ref is forwarded to the
            underlying surface div, so `getBoundingClientRect` works.
          </Container>
          <button
            type="button"
            style={{ marginTop: 12, fontFamily }}
            onClick={() => {
              const rect = ref.current?.getBoundingClientRect();
              setBounds(rect ? `${Math.round(rect.width)}×${Math.round(rect.height)}` : null);
            }}
          >
            Measure
          </button>
          {bounds && <div style={{ marginTop: 8, fontFamily: 'monospace' }}>Bounds: {bounds}</div>}
        </div>
      </Row>
    </Section>
  );
};

export const InfiniteScroll = () => {
  const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => i + 1));
  const fetchData = () => {
    setItems((current) => {
      const next = current.length + 1;
      return [...current, ...Array.from({ length: 10 }, (_, i) => next + i)];
    });
  };
  return (
    <Section title="InfiniteScrollContainer — fetchData fires on sentinel intersect">
      <Row label="loaded items">
        <InfiniteScrollContainer height="240px" fetchData={fetchData}>
          {items.map((i) => (
            <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #EEF5F7', fontFamily }}>
              Record #{i}
            </div>
          ))}
        </InfiniteScrollContainer>
      </Row>
    </Section>
  );
};

export const LegacyAPIStillWorks = () => {
  const legacyRef = useRef(null);
  return (
    <Section title="Backwards-compat shim (fires one console.warn at first use)">
      <Row label="forwardRef={ref} (legacy)">
        <Container id="legacy-1" forwardRef={legacyRef} borderless={false}>
          Legacy `forwardRef` prop still works — chained with the React ref API.
        </Container>
      </Row>
      <Row label="isV4Design, isMobile, etc. (silently ignored)">
        <Container
          id="legacy-2"
          isV4Design
          isMobile
          legacyClass="old-class"
          displayAuto
          compactStyle
          hidden={false}
          borderless={false}
        >
          Legacy ghosts accept their value but have no behavioral effect.
        </Container>
      </Row>
    </Section>
  );
};
