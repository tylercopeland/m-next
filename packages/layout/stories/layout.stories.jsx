import React from 'react';
import { Box, Stack, Inline, Flex, Divider } from '../src';

export default {
  title: 'm-next/Foundation/Layout',
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const Demo = ({ children, label }) => (
  <Box padding="md" background="#f9fafb" style={{ borderRadius: 8, fontFamily, marginBottom: 16 }}>
    {label && (
      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        {label}
      </div>
    )}
    {children}
  </Box>
);

const Swatch = ({ children, background = '#dbeafe' }) => (
  <Box padding="sm" background={background} style={{ borderRadius: 4, fontFamily, fontSize: 13 }}>
    {children}
  </Box>
);

export const BoxPadding = () => (
  <Stack gap="md">
    <Demo label='padding="md"'>
      <Box padding="md" background="#dbeafe" style={{ borderRadius: 4 }}>
        12px on all sides
      </Box>
    </Demo>
    <Demo label='paddingX="lg" paddingY="sm"'>
      <Box paddingX="lg" paddingY="sm" background="#dbeafe" style={{ borderRadius: 4 }}>
        16px sides, 8px top/bottom
      </Box>
    </Demo>
    <Demo label='paddingTop="2xl" paddingBottom="xs"'>
      <Box paddingTop="2xl" paddingBottom="xs" paddingX="md" background="#dbeafe" style={{ borderRadius: 4 }}>
        32px top, 4px bottom — sides default to md
      </Box>
    </Demo>
  </Stack>
);

export const BoxSizing = () => (
  <Stack gap="md">
    <Demo label='width=240, height=80'>
      <Box width={240} height={80} background="#dbeafe" padding="md" style={{ borderRadius: 4 }}>
        fixed dims
      </Box>
    </Demo>
    <Demo label='maxWidth="32rem"'>
      <Box maxWidth="32rem" background="#dbeafe" padding="md" style={{ borderRadius: 4 }}>
        Capped at 32rem — strings pass through
      </Box>
    </Demo>
  </Stack>
);

export const BoxBorders = () => (
  <Demo label='borderTop borderBottom borderColor="#3b82f6"'>
    <Box paddingY="md" borderTop borderBottom borderColor="#3b82f6">
      Borders on top and bottom only
    </Box>
  </Demo>
);

export const StackGaps = () => (
  <Stack gap="lg">
    {['xs', 'sm', 'md', 'lg', 'xl'].map((gap) => (
      <Demo key={gap} label={`Stack gap="${gap}"`}>
        <Stack gap={gap}>
          <Swatch>A</Swatch>
          <Swatch>B</Swatch>
          <Swatch>C</Swatch>
        </Stack>
      </Demo>
    ))}
  </Stack>
);

export const StackAlign = () => (
  <Stack gap="md">
    {['start', 'center', 'end', 'stretch'].map((align) => (
      <Demo key={align} label={`Stack align="${align}"`}>
        <Stack gap="sm" align={align}>
          <Swatch>Short</Swatch>
          <Swatch>A longer label here</Swatch>
        </Stack>
      </Demo>
    ))}
  </Stack>
);

export const InlineBasic = () => (
  <Stack gap="lg">
    {['xs', 'sm', 'md', 'lg'].map((gap) => (
      <Demo key={gap} label={`Inline gap="${gap}"`}>
        <Inline gap={gap}>
          <Swatch>One</Swatch>
          <Swatch>Two</Swatch>
          <Swatch>Three</Swatch>
        </Inline>
      </Demo>
    ))}
  </Stack>
);

export const InlineJustify = () => (
  <Stack gap="md">
    {['start', 'center', 'end', 'spaceBetween', 'spaceAround'].map((justify) => (
      <Demo key={justify} label={`Inline justify="${justify}"`}>
        <Inline gap="sm" justify={justify}>
          <Swatch>A</Swatch>
          <Swatch>B</Swatch>
          <Swatch>C</Swatch>
        </Inline>
      </Demo>
    ))}
  </Stack>
);

export const FlexDirection = () => (
  <Stack gap="md">
    {['row', 'column', 'rowReverse', 'columnReverse'].map((direction) => (
      <Demo key={direction} label={`Flex direction="${direction}"`}>
        <Flex direction={direction} gap="sm">
          <Swatch>1</Swatch>
          <Swatch>2</Swatch>
          <Swatch>3</Swatch>
        </Flex>
      </Demo>
    ))}
  </Stack>
);

export const DividerHorizontal = () => (
  <Stack gap="sm">
    <Box padding="sm">Section one</Box>
    <Divider />
    <Box padding="sm">Section two</Box>
    <Divider variant="dashed" color="#9ca3af" />
    <Box padding="sm">Section three</Box>
    <Divider variant="dotted" color="#9ca3af" spacing="lg" />
    <Box padding="sm">Section four</Box>
  </Stack>
);

export const DividerVertical = () => (
  <Inline gap="md" align="stretch" style={{ height: 80 }}>
    <Box padding="md" background="#dbeafe" style={{ borderRadius: 4 }}>
      Left
    </Box>
    <Divider orientation="vertical" />
    <Box padding="md" background="#dbeafe" style={{ borderRadius: 4 }}>
      Middle
    </Box>
    <Divider orientation="vertical" variant="dashed" color="#9ca3af" />
    <Box padding="md" background="#dbeafe" style={{ borderRadius: 4 }}>
      Right
    </Box>
  </Inline>
);

export const ComposedPageSection = () => (
  <Box padding="xl" background="#fff" style={{ borderRadius: 12, boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)', fontFamily, maxWidth: 720 }}>
    <Stack gap="lg">
      <Inline justify="spaceBetween" align="center">
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Invoices</h2>
        <Inline gap="sm">
          <button type="button" style={{ padding: '6px 14px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer' }}>
            Filter
          </button>
          <button type="button" style={{ padding: '6px 14px', background: '#111827', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            New invoice
          </button>
        </Inline>
      </Inline>
      <Divider spacing="none" color="#e5e7eb" />
      <Stack gap="sm">
        {[1, 2, 3].map((n) => (
          <Box key={n} padding="md" background="#f9fafb" style={{ borderRadius: 6 }}>
            <Inline justify="spaceBetween" align="center">
              <span style={{ fontWeight: 500 }}>Invoice #{2024 + n}</span>
              <span style={{ color: '#6b7280', fontSize: 13 }}>$1,2{n}{n}.00</span>
            </Inline>
          </Box>
        ))}
      </Stack>
    </Stack>
  </Box>
);
