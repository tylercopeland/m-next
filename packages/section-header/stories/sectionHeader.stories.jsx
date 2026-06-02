import React from 'react';
import SectionHeader from '../src';

export default {
  title: 'm-next/Components/Typography/SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// A frame that gives the section header a realistic form-section context.
const Frame = ({ children }) => (
  <div
    style={{
      maxWidth: 560,
      padding: 24,
      background: '#FFFFFF',
      color: '#1F2A33',
      fontFamily,
    }}
  >
    {children}
  </div>
);

// =====================================================================
// Default — title and subtitle, the most common shape
// =====================================================================

export const Default = () => (
  <Frame>
    <SectionHeader
      title='Billing details'
      subTitle='Used for invoicing and tax purposes.'
    />
    <p style={{ color: '#5A6B78', margin: 0 }}>
      (Form fields, table, or other section content would render here.)
    </p>
  </Frame>
);

// =====================================================================
// TitleOnly — bare heading, no helper copy
// =====================================================================

export const TitleOnly = () => (
  <Frame>
    <SectionHeader title='Recent activity' />
    <p style={{ color: '#5A6B78', margin: 0 }}>(Activity list would render here.)</p>
  </Frame>
);

// =====================================================================
// MultipleSections — back-to-back headers, showing the visual rhythm
// =====================================================================

export const MultipleSections = () => (
  <Frame>
    <SectionHeader
      title='Contact'
      subTitle='How customers can reach this account.'
    />
    <p style={{ color: '#5A6B78', margin: 0, marginBottom: 24 }}>
      (Contact form fields would render here.)
    </p>

    <SectionHeader
      title='Billing details'
      subTitle='Used for invoicing and tax purposes.'
    />
    <p style={{ color: '#5A6B78', margin: 0, marginBottom: 24 }}>
      (Billing form fields would render here.)
    </p>

    <SectionHeader title='Preferences' />
    <p style={{ color: '#5A6B78', margin: 0 }}>(Toggles would render here.)</p>
  </Frame>
);
