import React from 'react';
import Carousel from '../src';

export default {
  title: 'm-next/Components/Display/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// Simple card used as slide content across stories. Inline-styled so the
// stories don't have to depend on @m-next/card — Carousel itself is the
// thing under test.
const SampleCard = ({ label, color = '#0D71C8' }) => (
  <div
    style={{
      width: '100%',
      maxWidth: 480,
      height: 200,
      background: color,
      color: '#FFFFFF',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
      fontSize: 18,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

// =====================================================================
// Basic — single slide visible at any given time (default responsive).
// =====================================================================
export const Basic = () => (
  <div style={{ width: 720, padding: 24 }}>
    <Carousel>
      <SampleCard label='Slide 1' color='#0D71C8' />
      <SampleCard label='Slide 2' color='#064499' />
      <SampleCard label='Slide 3' color='#022266' />
    </Carousel>
  </div>
);

// =====================================================================
// With title — centered Source Sans heading above the slides.
// =====================================================================
export const WithTitle = () => (
  <div style={{ width: 720, padding: 24 }}>
    <Carousel title='Featured apps'>
      <SampleCard label='Field Service' color='#0D71C8' />
      <SampleCard label='Property Management' color='#064499' />
      <SampleCard label='Donations' color='#115B40' />
    </Carousel>
  </div>
);

// =====================================================================
// Multi-item — three items per viewport via a custom responsive config.
// =====================================================================
export const MultiItem = () => (
  <div style={{ width: 960, padding: 24 }}>
    <Carousel
      title='App library'
      sideMarginPX={12}
      responsive={{
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
        tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
        mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
      }}
    >
      <SampleCard label='Customers' color='#0D71C8' />
      <SampleCard label='Invoices' color='#064499' />
      <SampleCard label='Estimates' color='#022266' />
      <SampleCard label='Payments' color='#115B40' />
      <SampleCard label='Items' color='#2A394A' />
      <SampleCard label='Activities' color='#0A1071' />
    </Carousel>
  </div>
);
