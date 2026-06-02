import React from 'react';
import Scrollbar from '../src';

export default {
  title: 'm-next/Components/Layout/Scrollbar',
  component: Scrollbar,
  parameters: { layout: 'centered' },
};

const fontFamily = "'Source Sans Pro', system-ui, -apple-system, sans-serif";

// A long body of paragraphs to overflow the scroll container.
const longContent = (
  <div style={{ padding: 16, color: '#1F2A33', fontFamily, lineHeight: 1.5 }}>
    {Array.from({ length: 30 }, (_, i) => (
      <p key={i} style={{ margin: '0 0 12px 0' }}>
        Paragraph {i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    ))}
  </div>
);

// A fixed-size frame so SimpleBar has something concrete to size against.
// Real apps usually anchor the scrollbar to a flex-1 region; in Storybook we
// stand in a fixed box.
const Frame = ({ height = 320, width = 360, children }) => (
  <div
    style={{
      height,
      width,
      border: '1px solid #BACAD0',
      borderRadius: 6,
      background: '#FFFFFF',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',
    }}
  >
    {children}
  </div>
);

// =====================================================================
// Basic — a plain scrollable region
// =====================================================================

export const Basic = () => (
  <Frame>
    <Scrollbar>{longContent}</Scrollbar>
  </Frame>
);

// =====================================================================
// With offset header — reserve 56px at the top for a fixed bar
// =====================================================================
//
// This is the original MethodUI pattern: a fixed header sits above the
// scrollable region, and the scrollbar's max-height is calc(100% - 56px)
// so it doesn't overflow.

export const WithOffsetHeader = () => (
  <Frame>
    <div
      style={{
        height: 56,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        fontFamily,
        fontWeight: 600,
        color: '#0F1B31',
        borderBottom: '1px solid #EEF5F7',
        background: '#F6FAFB',
      }}
    >
      Fixed header (56px)
    </div>
    <Scrollbar offset={56}>{longContent}</Scrollbar>
  </Frame>
);

// =====================================================================
// Narrow content — short body so no scrollbar appears
// =====================================================================
//
// The track stays out of the way when the content fits; SimpleBar hides
// the thumb automatically when there's nothing to scroll.

export const NarrowContent = () => (
  <Frame height={200}>
    <Scrollbar>
      <div style={{ padding: 16, color: '#1F2A33', fontFamily }}>
        <p style={{ margin: 0 }}>
          Short content that fits inside the container. No scrollbar thumb
          renders because SimpleBar detects there&apos;s nothing to scroll.
        </p>
      </div>
    </Scrollbar>
  </Frame>
);
