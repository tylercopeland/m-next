import React from 'react';
import { ThemeProvider, useTheme } from '@m-next/theme';
import { Box, Stack, Inline, Divider } from '@m-next/layout';
import { Sidebar } from '@m-next/sidebar';
import { AppBar } from '@m-next/app-bar';
import { Button } from '@m-next/button';
import { Text } from '@m-next/text';
import { Container } from '@m-next/container';
import { InsightCard } from '@m-next/insight-card';
import { Pill } from '@m-next/pill';
import { MethodLogo } from '@m-next/brand';
import { SvgIcon } from '@m-next/svg-icon';

// ---------------------------------------------------------------------------
// Everything below the shell is yours to replace. The shell (Sidebar + AppBar
// inside a ThemeProvider) is the canonical Method screen frame — keep it, and
// swap out <Body /> for whatever you're prototyping.
// ---------------------------------------------------------------------------

const INSIGHTS = [
  { title: 'Total revenue this month', value: '$84,250', delta: { value: '12%', label: 'vs last month' } },
  { title: 'New leads', value: '38', delta: { value: '4', label: 'vs last week' } },
  { title: 'Open invoices', value: '12', delta: { value: -3, label: 'fewer than last week' } },
];

const Body = () => {
  const theme = useTheme();
  return (
    <Stack gap="lg" style={{ maxWidth: 1280, marginInline: 'auto', width: '100%' }}>
      <Inline justify="spaceBetween" align="center">
        <Stack gap="xs">
          <Text as="H1" fontSize="24px" lineHeight="28px" fontWeight={700} mt="0px" mb="0px">
            m-next lab
          </Text>
          <Text fontSize="14px" lineHeight="20px" fontColor={theme.content.subtle}>
            Edit <code>src/App.jsx</code> and this updates on save.
          </Text>
        </Stack>
        <Inline gap="sm" align="center">
          <Pill colorScheme="green">ready</Pill>
          <Button variant="primary">Primary action</Button>
        </Inline>
      </Inline>

      <Inline gap="md" wrap>
        {INSIGHTS.map((insight) => (
          <Box key={insight.title} style={{ flex: '1 1 220px', minWidth: 220 }}>
            <InsightCard title={insight.title} value={insight.value} delta={insight.delta} />
          </Box>
        ))}
      </Inline>

      <Container bordered padding="24px">
        <Stack gap="md">
          <Text as="H2" fontSize="16px" lineHeight="20px" fontWeight={600} mt="0px" mb="0px">
            Start here
          </Text>
          <Divider spacing="none" />
          <Text fontSize="14px" lineHeight="20px" fontColor={theme.content.subtle}>
            Every component is imported by name — see AGENTS.md Rule 4. Copy the exact
            import line from registry.json rather than guessing.
          </Text>
        </Stack>
      </Container>
    </Stack>
  );
};

const Shell = () => {
  const theme = useTheme();
  return (
    <Box style={{ display: 'flex', width: '100%', height: '100vh', fontFamily: theme.fontFamily }}>
      <Sidebar>
        <Sidebar.Header>
          <MethodLogo height={20} />
        </Sidebar.Header>
        <Sidebar.Body>
          <Sidebar.Item icon={<SvgIcon name="dashboard" size={20} color="white" />} active>
            Home
          </Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="contacts" size={20} color="white" />}>
            Customers &amp; Leads
          </Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="invoice" size={20} color="white" />}>
            Invoices
          </Sidebar.Item>
        </Sidebar.Body>
      </Sidebar>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AppBar>
          <AppBar.Start>
            <Button variant="tertiary">Home</Button>
          </AppBar.Start>
          <AppBar.End>
            <Button
              variant="ghost"
              aria-label="Search"
              leftIcon={<SvgIcon name="search" size={20} color="currentColor" />}
            />
          </AppBar.End>
        </AppBar>

        <Box
          padding="xl"
          style={{ flex: 1, overflowY: 'auto', background: theme.background.page || theme.background.subtle }}
        >
          <Body />
        </Box>
      </Box>
    </Box>
  );
};

const App = () => (
  <ThemeProvider defaultName="light">
    <Shell />
  </ThemeProvider>
);

export default App;
