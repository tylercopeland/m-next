import React, { useState } from 'react';
import { ThemeProvider, useTheme } from '@m-next/theme';
import { Box, Stack, Inline } from '@m-next/layout';
import { Sidebar } from '@m-next/sidebar';
import { AppBar } from '@m-next/app-bar';
import { Button } from '@m-next/button';
import { Tabs } from '@m-next/tabs';
import { Text } from '@m-next/text';
import { Container } from '@m-next/container';
import { HeroBanner } from '@m-next/hero-banner';
import { InsightCard } from '@m-next/insight-card';
import { Checkbox } from '@m-next/checkbox';
import { Pill } from '@m-next/pill';
import { EmptyState } from '@m-next/empty-state';
import { MethodLogo } from '@m-next/brand';
import { SvgIcon } from '@m-next/svg-icon';
import { colors, spacing, radius, fontSize, fontWeight, iconSize } from '@m-next/tokens';

// Onboarding hero art. Imported as a module rather than referenced by a
// public-path string or a data URI:
//   - Storybook has no `staticDirs` configured, so `/onboarding-hero.svg`
//     would 404.
//   - @m-next/image (which <HeroBanner imageSrc> renders through) explicitly
//     rejects `data:image` values and silently substitutes its own generic
//     placeholder (Image.jsx: `if (!value || value.indexOf('data:image') > -1)
//     return getPlaceholderSvg(...)`).
// Storybook's webpack5 builder maps .svg to `asset/resource`, so this import
// resolves to a real URL string. Replace with the real asset when it exists.
import ONBOARDING_IMAGE from './assets/onboarding-hero.svg';

export default {
  title: 'm-next/Compositions/Home',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Landing screen composition: top-level <Tabs> over a greeting, a dismissible onboarding <HeroBanner>, a nested Insights/Learn tab strip holding a row of <InsightCard> KPIs, and a two-column To-Dos (<Checkbox> + <Pill> rows) / Quick actions section in bordered <Container> surfaces. Demonstrates the canonical Method "home / overview" pattern.',
      },
    },
  },
};

// =====================================================================
// Mock data
// =====================================================================

const HOME_INSIGHTS = [
  {
    id: 'revenue-distribution',
    title: 'Revenue distribution',
    value: '60%',
    iconName: 'opportunity',
    linkText: 'View customers',
    showInfoIcon: true,
    infoTooltipContent: 'Percentage of revenue from your top 20% of customers.',
  },
  {
    id: 'pending-estimates',
    title: 'Pending estimates',
    value: '$45,000.00',
    iconName: 'estimate',
    linkText: 'View estimates',
  },
  {
    id: 'low-health-score',
    title: 'Low health score',
    value: '23',
    iconName: 'contacts',
    linkText: 'View customers',
  },
  {
    id: 'active-leads',
    title: 'Active leads',
    value: '0',
    iconName: 'contacts',
    linkText: 'Add a lead',
  },
];

const HOME_TODOS = [
  {
    id: 'follow-up-lead',
    title: 'Follow-up with a lead [Example]',
    description: 'Try using your activities to set follow-up reminders for new leads.',
    status: 'completed',
    dueLabel: 'Due: Today at 05:00pm',
  },
  {
    id: 'meet-customer',
    title: 'Meet with a customer [Example]',
    description: 'Use the activities to track scheduled meetings with customers.',
    status: 'not-started',
    dueLabel: 'Due: Tomorrow at 05:00pm',
  },
  {
    id: 'follow-up-email',
    title: 'Send a follow-up email [Example]',
    description:
      "Practice logging a customer interaction — email a customer or lead from Method and watch it appear in the customer's activity log.",
    status: 'in-progress',
    dueLabel: 'Due: Dec-13-2025 05:00 PM',
  },
];

const HOME_QUICK_ACTIONS = [
  { id: 'new-contact', label: 'New Contact', iconName: 'contacts' },
  { id: 'log-activity', label: 'Log Activity', iconName: 'activities' },
  { id: 'new-opportunity', label: 'New Opportunity', iconName: 'opportunity' },
  { id: 'create-invoice', label: 'Create Invoice', iconName: 'invoice' },
  { id: 'create-estimate', label: 'Create Estimate', iconName: 'estimate' },
];

const TODO_STATUS_PILL = {
  completed: { label: 'Completed', scheme: 'green' },
  'not-started': { label: 'Not started', scheme: 'grey' },
  'in-progress': { label: 'In progress', scheme: 'blue' },
};

// =====================================================================
// Helpers
// =====================================================================

const formatGreetingDate = (d) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const getGreeting = (d) => {
  const hr = d.getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
};

// =====================================================================
// Rows
// =====================================================================

// To-Do row. Uses Checkbox `rounded` for the circle shape, SvgIcon
// CircleCheck for the completed state, and a background + border + opacity
// treatment per status. Layout is title + status pill on row 1, description +
// calendar icon + due date on row 2.
const TodoRow = ({ todo, checked, onToggle }) => {
  const pill = TODO_STATUS_PILL[todo.status];
  const completed = todo.status === 'completed';
  const dueLabelText = todo.dueLabel.replace(/^(Overdue|Due):\s*/, '');
  return (
    <Box
      style={{
        padding: spacing.md,
        borderRadius: radius.lg,
        background: completed ? colors.green.lightest : colors.white,
        border: `1px solid ${completed ? colors.green.light : colors.grey.lighter}`,
        opacity: completed ? 0.75 : 1,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Inline gap="sm" align="flex-start" style={{ width: '100%', minWidth: 0 }}>
        <Box style={{ width: iconSize.sm, height: iconSize.sm, flexShrink: 0, marginTop: 2 }}>
          {completed ? (
            <SvgIcon name="CircleCheck" size={iconSize.sm} color={colors.green.base} />
          ) : (
            <Checkbox
              checked={checked}
              onChange={onToggle}
              aria-label={todo.title}
              hideLabel
              rounded
            />
          )}
        </Box>
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Inline gap="md" align="flex-start" justify="spaceBetween" style={{ width: '100%' }}>
            <Text
              fontSize={`${fontSize.sm}px`}
              lineHeight="16px"
              fontWeight={fontWeight.semibold}
              fontColor={colors.grey.darker}
              style={{ flex: 1, minWidth: 0 }}
            >
              {todo.title}
            </Text>
            <Pill colorScheme={pill.scheme} variant="subtle" size="sm">
              {pill.label}
            </Pill>
          </Inline>
          <Inline gap="md" align="center" justify="spaceBetween" style={{ width: '100%' }}>
            <Text
              fontSize={`${fontSize.xs}px`}
              lineHeight="16px"
              fontColor={colors.grey.base}
              style={{ flex: 1, minWidth: 0 }}
            >
              {todo.description}
            </Text>
            <Inline gap="xs" align="center" style={{ flexShrink: 0 }}>
              <SvgIcon
                name="calendar-V4"
                size={iconSize['2xs']}
                color={todo.overdue ? colors.red.base : colors.grey.base}
              />
              <Text
                fontSize={`${fontSize.xs}px`}
                lineHeight="16px"
                fontWeight={fontWeight.normal}
                fontColor={todo.overdue ? colors.red.base : colors.grey.base}
              >
                {todo.overdue ? 'Overdue:' : 'Due:'} {dueLabelText}
              </Text>
            </Inline>
          </Inline>
        </Stack>
      </Inline>
    </Box>
  );
};

// Quick-action row.
//
// Audit signal: m-next has no "icon-tile list row" / quick-action primitive.
// Button can't produce the tinted square icon tile + full-bleed hover row, and
// Sidebar.Item is scoped to the nav rail. Using an inline <button> until the
// pattern is canonized. Two off-scale literals survive here for the same
// reason: the 6px tile radius (radius.md is 4, radius.lg is 8) and the 18px
// icon (iconSize.sm is 16, iconSize.md is 20).
const QuickActionRow = ({ action }) => {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={() => {}}
      style={{
        display: 'flex', alignItems: 'center', gap: spacing.md,
        width: '100%', padding: `${spacing.sm}px ${spacing.md}px`,
        background: 'transparent', border: 'none', borderRadius: 6,
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        color: theme.content.emphasize,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = colors.grey.lightest; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <Box
        style={{
          width: iconSize.xl, height: iconSize.xl, borderRadius: 6,
          background: colors.blue.lighter,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <SvgIcon name={action.iconName} size={18} color={colors.blue.base} />
      </Box>
      <Text fontSize={`${fontSize.sm}px`} lineHeight="20px" fontWeight={fontWeight.medium}>
        {action.label}
      </Text>
    </button>
  );
};

// =====================================================================
// Body
// =====================================================================

const HomeBody = () => {
  const theme = useTheme();
  const [activeTopTab, setActiveTopTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('insights');
  const [heroDismissed, setHeroDismissed] = useState(false);
  const [showAllTodos, setShowAllTodos] = useState(false);
  const [checkedTodos, setCheckedTodos] = useState(() =>
    HOME_TODOS.reduce((acc, t) => ({ ...acc, [t.id]: t.status === 'completed' }), {})
  );

  const today = new Date();
  const visibleTodos = showAllTodos ? HOME_TODOS : HOME_TODOS.slice(0, 6);

  const renderHomeBody = () => (
    <Stack gap="lg" style={{ flex: 1, minWidth: 0, width: '100%' }}>
      {/* One card holds greeting -> hero -> Insights. Keeping them in a
          single surface is what gives the page its two-band structure;
          floating the greeting and hero loose on the page background made
          the rhythm read wrong no matter how the gaps were tuned. */}
      <Container borderless={false} padding="xl">
        <Stack gap="lg" style={{ width: '100%' }}>
          <Inline justify="spaceBetween" align="flex-start" wrap gap="md">
            <Stack gap="xs">
              <Text fontSize={`${fontSize.xs}px`} lineHeight="16px" fontColor={theme.content.subtle}>
                {formatGreetingDate(today)}
              </Text>
              <Text
                as="H1"
                fontSize={`${fontSize.xl}px`}
                lineHeight="28px"
                fontWeight={fontWeight.bold}
                mt={`${spacing.none}px`}
                mb={`${spacing.none}px`}
              >
                {getGreeting(today)}, Paul
              </Text>
            </Stack>
            <Pill colorScheme="green" variant="subtle" size="sm">
              ● Sync Status: Connected
            </Pill>
          </Inline>

          {!heroDismissed && (
            <HeroBanner
              backgroundColor="blue"
              imageSrc={ONBOARDING_IMAGE}
              eyebrow="Onboarding Step 1 of 4"
              title="Welcome to Method. Let's add your first lead"
              description="Start by adding a lead so you can see how work flows through Method, from first contact to estimate and invoice."
              primaryButton="Add a lead"
              onPrimaryButtonClick={() => {}}
              hasClose
              onClose={() => setHeroDismissed(true)}
            />
          )}

          <Tabs
            width="100%"
            tabList={[
              { id: 'insights', caption: 'Insights' },
              { id: 'learn', caption: 'Learn' },
            ]}
            selectedTab={activeSubTab}
            onChange={setActiveSubTab}
            panelBackground="transparent"
            contentStyle={{ padding: spacing.none, border: 'none', minHeight: 0, marginTop: theme.spacing.xl }}
            onRenderTabContent={() => {
              if (activeSubTab === 'learn') {
                return (
                  <Box padding="xl">
                    <EmptyState
                      variant="subtle"
                      title="Learning content coming soon"
                      description="Tutorials and walkthroughs will live here."
                    />
                  </Box>
                );
              }
              return (
                <Stack gap="md" style={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <Inline gap="md" style={{ width: '100%' }}>
                    {HOME_INSIGHTS.map((ins) => (
                      <InsightCard
                        key={ins.id}
                        title={ins.title}
                        value={ins.value}
                        iconName={ins.iconName}
                        linkText={ins.linkText}
                        onCardClick={() => {}}
                        showInfoIcon={ins.showInfoIcon || false}
                        infoTooltipContent={ins.infoTooltipContent}
                      />
                    ))}
                  </Inline>
                </Stack>
              );
            }}
          />
        </Stack>
      </Container>

      {/* To-Dos + Quick actions — two-column layout. */}
      <Inline gap="lg" align="stretch" wrap>
        <Box style={{ flex: '2 1 560px', minWidth: 320 }}>
          <Container borderless={false} padding="xl">
            <Stack gap="md">
              <Inline justify="spaceBetween" align="center">
                <Text
                  as="H2"
                  fontSize={`${fontSize.lg}px`}
                  lineHeight="24px"
                  fontWeight={fontWeight.bold}
                  mt={`${spacing.none}px`}
                  mb={`${spacing.none}px`}
                >
                  To-Dos
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="To-Dos settings"
                  leftIcon={<SvgIcon name="cog" size={iconSize.sm} color="currentColor" />}
                />
              </Inline>
              <Stack gap="sm">
                {visibleTodos.map((todo) => (
                  <TodoRow
                    key={todo.id}
                    todo={todo}
                    checked={checkedTodos[todo.id]}
                    onToggle={(v) => setCheckedTodos((prev) => ({ ...prev, [todo.id]: v }))}
                  />
                ))}
              </Stack>
              {/* Collapse affordance appears once the list runs past six rows.
                  The mock data has three, so it stays hidden here. */}
              {HOME_TODOS.length > 6 && (
                <Box style={{ textAlign: 'center' }}>
                  <Button
                    variant="tertiary"
                    onClick={() => setShowAllTodos((v) => !v)}
                    rightIcon={
                      <SvgIcon
                        name={showAllTodos ? 'chevron-up' : 'chevron-down'}
                        size={iconSize.xs}
                        color="currentColor"
                      />
                    }
                  >
                    {showAllTodos ? 'View less' : 'View more'}
                  </Button>
                </Box>
              )}
            </Stack>
          </Container>
        </Box>

        <Box style={{ flex: '1 1 280px', minWidth: 240 }}>
          <Container borderless={false} padding="lg">
            <Stack gap="sm">
              <Inline justify="spaceBetween" align="center">
                <Text
                  as="H2"
                  fontSize={`${fontSize.md}px`}
                  lineHeight="20px"
                  fontWeight={fontWeight.bold}
                  mt={`${spacing.none}px`}
                  mb={`${spacing.none}px`}
                >
                  Quick actions
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Quick actions settings"
                  leftIcon={<SvgIcon name="cog" size={iconSize.sm} color="currentColor" />}
                />
              </Inline>
              <Stack gap="none">
                {HOME_QUICK_ACTIONS.map((action) => (
                  <QuickActionRow key={action.id} action={action} />
                ))}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Inline>
    </Stack>
  );

  return (
    <Stack gap="lg" style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      {/* Top-level tabs: Home / Apps / Insights — pinned to the very top.
          Greeting + sync status live inside the Home tab body. */}
      <Tabs
        width="100%"
        tabList={[
          { id: 'home', caption: 'Home' },
          { id: 'apps', caption: 'Apps' },
          { id: 'insights', caption: 'Insights' },
        ]}
        selectedTab={activeTopTab}
        onChange={setActiveTopTab}
        panelBackground="transparent"
        contentStyle={{ padding: spacing.none, border: 'none', minHeight: 0, marginTop: theme.spacing.xl }}
        onRenderTabContent={() => {
          if (activeTopTab === 'apps') {
            return (
              <Box padding="xl">
                <EmptyState
                  variant="subtle"
                  title="App browser coming soon"
                  description="Your apps and integrations will live here."
                />
              </Box>
            );
          }
          if (activeTopTab === 'insights') {
            return (
              <Box padding="xl">
                <EmptyState
                  variant="subtle"
                  title="Detailed insights coming soon"
                  description="Full reporting and analytics will live here."
                />
              </Box>
            );
          }
          return renderHomeBody();
        }}
      />
    </Stack>
  );
};

// =====================================================================
// Shell
// =====================================================================

const HomeShell = () => {
  const theme = useTheme();
  return (
    <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', fontFamily: theme.fontFamily }}>
      <Sidebar>
        <Sidebar.Header>
          <MethodLogo height={20} />
        </Sidebar.Header>
        <Sidebar.Item icon={<SvgIcon name="dashboard" size={iconSize.md} color="white" />} active>
          Home
        </Sidebar.Item>
        <Sidebar.Item icon={<SvgIcon name="customize" size={iconSize.md} color="white" />}>App Studio</Sidebar.Item>
        <Sidebar.Divider />
        <Sidebar.Body>
          <Sidebar.Item icon={<SvgIcon name="opportunity" size={iconSize.md} color="white" />}>Opportunities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="activities" size={iconSize.md} color="white" />}>Activities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="contacts" size={iconSize.md} color="white" />}>Customers &amp; Leads</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="invoice" size={iconSize.md} color="white" />}>Invoices</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="estimate" size={iconSize.md} color="white" />}>Estimates</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="payments" size={iconSize.md} color="white" />}>Payments</Sidebar.Item>
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
            <Button variant="ghost" aria-label="Global add" leftIcon={<SvgIcon name="circle-plus" size={iconSize.md} color="currentColor" />} />
            <Button variant="ghost" aria-label="Search" leftIcon={<SvgIcon name="search" size={iconSize.md} color="currentColor" />} />
          </AppBar.End>
        </AppBar>

        <Box padding="xl" style={{ flex: 1, overflowY: 'auto', background: theme.background.page || theme.background.subtle }}>
          <HomeBody />
        </Box>
      </Box>
    </Box>
  );
};

export const Default = () => (
  <ThemeProvider defaultName="light">
    <HomeShell />
  </ThemeProvider>
);
Default.storyName = 'Home';
