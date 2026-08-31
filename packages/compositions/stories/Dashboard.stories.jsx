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
import { Link } from '@m-next/link';
import { MethodLogo } from '@m-next/brand';
import { SvgIcon } from '@m-next/svg-icon';

export default {
  title: 'm-next/Compositions/Dashboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Overview dashboard: row of <InsightCard> KPIs with deltas, a recent-activity card with bordered <Container>, and a "today" list. Demonstrates the canonical Method "metric overview" pattern.',
      },
    },
  },
};

const INSIGHTS = [
  { title: 'Total revenue this month', value: '$84,250', delta: { value: '12%', label: 'vs last month' } },
  { title: 'New leads', value: '38', delta: { value: '4', label: 'vs last week' } },
  { title: 'Open invoices', value: '12', delta: { value: -3, label: 'fewer than last week' } },
  { title: 'Avg. response time', value: '2.4 hrs' },
];

const ACTIVITY = [
  { id: 'a1', who: 'Alex Chen', what: 'paid invoice #2049', when: '10 minutes ago', kind: 'paid' },
  { id: 'a2', who: 'Robin Park', what: 'created invoice #2050', when: '1 hour ago', kind: 'created' },
  { id: 'a3', who: 'Jamie Lee', what: 'marked invoice #2047 overdue', when: '3 hours ago', kind: 'overdue' },
  { id: 'a4', who: 'Sam Rivera', what: 'sent reminder for #2042', when: 'Yesterday', kind: 'reminder' },
  { id: 'a5', who: 'Priya Sharma', what: 'logged a call with Bellworks', when: 'Yesterday', kind: 'call' },
];

const TODAY = [
  { id: 't1', title: 'Follow up with Northwind Traders', due: '2:00 PM', priority: 'high' },
  { id: 't2', title: 'Send proposal to Reyes Studio', due: '4:30 PM', priority: 'medium' },
  { id: 't3', title: 'Review Brightlabs contract', due: 'EOD', priority: 'low' },
];

const PRIORITY_SCHEME = { high: 'red', medium: 'yellow', low: 'green' };

const SectionHeading = ({ children }) => (
  <Text as="H2" fontSize="16px" lineHeight="20px" fontWeight={600} mt="0px" mb="0px">
    {children}
  </Text>
);

const DashboardBody = () => {
  const theme = useTheme();
  return (
    <Stack
      gap="lg"
      style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
    >
      <Inline justify="spaceBetween" align="center">
        <Stack gap="xs">
          <Text as="H1" fontSize="24px" lineHeight="28px" fontWeight={700} mt="0px" mb="0px">
            Good evening, Tyler
          </Text>
          <Text fontSize="14px" lineHeight="20px" fontColor={theme.content.subtle}>
            Here's what's happening across your account today.
          </Text>
        </Stack>
        <Inline gap="sm">
          <Button variant="secondary">Export</Button>
          <Button
            variant="primary"
            leftIcon={<SvgIcon name="circle-plus" size={14} color="currentColor" />}
          >
            Create
          </Button>
        </Inline>
      </Inline>

      {/* Row of InsightCards. flex: 1 1 220px gives each card a minimum
          width and lets them wrap on narrow screens. */}
      <Inline gap="md" wrap>
        {INSIGHTS.map((insight) => (
          <Box key={insight.title} style={{ flex: '1 1 220px', minWidth: 220 }}>
            <InsightCard title={insight.title} value={insight.value} delta={insight.delta} />
          </Box>
        ))}
      </Inline>

      {/* Two-column section: recent activity (wider) + today list (narrower) */}
      <Inline gap="lg" align="stretch" wrap>
        <Box style={{ flex: '2 1 480px', minWidth: 320 }}>
          <Container bordered padding="24px">
            <Stack gap="md">
              <Inline justify="spaceBetween" align="center">
                <SectionHeading>Recent activity</SectionHeading>
                <Link href="#">View all</Link>
              </Inline>
              <Divider spacing="none" />
              <Stack gap="none">
                {ACTIVITY.map((a, i) => (
                  <React.Fragment key={a.id}>
                    <Inline gap="md" align="center" style={{ padding: `${theme.spacing.sm}px 0` }}>
                      <Box
                        style={{
                          width: 32, height: 32, borderRadius: theme.radius.full,
                          background: theme.informative.iconBackground,
                          color: theme.informative.icon,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: theme.fontWeight.semibold, flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {a.who.slice(0, 1)}
                      </Box>
                      <Stack gap="none" style={{ flex: 1 }}>
                        <Text fontSize="14px" lineHeight="20px">
                          <strong style={{ fontWeight: theme.fontWeight.semibold }}>{a.who}</strong>{' '}
                          {a.what}
                        </Text>
                        <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
                          {a.when}
                        </Text>
                      </Stack>
                    </Inline>
                    {i < ACTIVITY.length - 1 && <Divider spacing="none" />}
                  </React.Fragment>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Box style={{ flex: '1 1 280px', minWidth: 240 }}>
          <Container bordered padding="24px">
            <Stack gap="md">
              <Inline justify="spaceBetween" align="center">
                <SectionHeading>Today</SectionHeading>
                <Link href="#">View calendar</Link>
              </Inline>
              <Divider spacing="none" />
              <Stack gap="md">
                {TODAY.map((t) => (
                  <Inline key={t.id} gap="sm" align="flex-start">
                    <Pill colorScheme={PRIORITY_SCHEME[t.priority]} variant="subtle" size="sm">
                      {t.priority}
                    </Pill>
                    <Stack gap="none" style={{ flex: 1 }}>
                      <Text fontSize="14px" lineHeight="20px" fontWeight={500}>
                        {t.title}
                      </Text>
                      <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
                        Due {t.due}
                      </Text>
                    </Stack>
                  </Inline>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Inline>
    </Stack>
  );
};

const DashboardShell = () => {
  const theme = useTheme();
  return (
    <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', fontFamily: theme.fontFamily }}>
      <Sidebar>
        <Sidebar.Header>
          <MethodLogo height={20} />
        </Sidebar.Header>
        <Sidebar.Item icon={<SvgIcon name="dashboard" size={20} color="white" />} active>
          Home
        </Sidebar.Item>
        <Sidebar.Item icon={<SvgIcon name="customize" size={20} color="white" />}>App Studio</Sidebar.Item>
        <Sidebar.Divider />
        <Sidebar.Body>
          <Sidebar.Item icon={<SvgIcon name="opportunity" size={20} color="white" />}>Opportunities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="activities" size={20} color="white" />}>Activities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="contacts" size={20} color="white" />}>Customers &amp; Leads</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="invoice" size={20} color="white" />}>Invoices</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="estimate" size={20} color="white" />}>Estimates</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="payments" size={20} color="white" />}>Payments</Sidebar.Item>
        </Sidebar.Body>
      </Sidebar>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AppBar>
          <AppBar.Start>
            <Button
              variant="tertiary"
              rightIcon={<SvgIcon name="chevron-down" size={14} color="currentColor" />}
            >
              Home
            </Button>
          </AppBar.Start>
          <AppBar.End>
            <Button variant="ghost" aria-label="Global add" leftIcon={<SvgIcon name="circle-plus" size={20} color="currentColor" />} />
            <Button variant="ghost" aria-label="Search" leftIcon={<SvgIcon name="search" size={20} color="currentColor" />} />
          </AppBar.End>
        </AppBar>

        <Box padding="xl" style={{ flex: 1, overflowY: 'auto', background: theme.background.page || theme.background.subtle }}>
          <DashboardBody />
        </Box>
      </Box>
    </Box>
  );
};

export const Default = () => (
  <ThemeProvider defaultName="light">
    <DashboardShell />
  </ThemeProvider>
);
Default.storyName = 'Dashboard';
