import React, { useState } from 'react';
import { ThemeProvider, useTheme } from '@m-next/theme';
import { Box, Stack, Inline, Divider } from '@m-next/layout';
import { Sidebar } from '@m-next/sidebar';
import AppBar from '@m-next/app-bar';
import Button from '@m-next/button';
import Tabs from '@m-next/tabs';
import Text from '@m-next/text';
import Container from '@m-next/container';
import { FormField } from '@m-next/form-field';
import Input from '@m-next/input';
import Pill from '@m-next/pill';
import { EmptyState } from '@m-next/empty-state';
import { SearchInput } from '@m-next/search-input';
import MethodLogo from '@m-next/brand';
import SvgIcon from '@m-next/svg-icon';

export default {
  title: 'm-next/Compositions/ContactDetail',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Split-view detail screen for a single record. Left rail shows identity + grouped detail fields rendered with <FormField> + <Text>. Right pane uses <Tabs> over an action area and an <EmptyState>. Demonstrates the canonical Method "primary record" layout.',
      },
    },
  },
};

const CONTACT = {
  initials: 'TC',
  name: 'Tyler Copeland',
  email: 'copelandmedia@gmail.com',
  phone: '',
  altPhone: '',
  mobile: '',
  website: '',
  tags: '',
  portalLink: 'https://Mlurl.cc/yGa5jZqml',
  healthScore: 10,
  healthScoreUpdated: 'Updated today at 10:40 PM',
  healthScoreNote: 'No change in health score compared to last week.',
  leadStatus: 'Open',
  leadRating: 'Warm',
  leadSource: '',
  assignedTo: 'Tyler Copeland',
  quickbooksName: 'Tyler Copeland',
};

const CONTACT_DETAIL_TABS = [
  { id: 'activities-open', caption: 'Activities Open' },
  { id: 'activities-closed', caption: 'Activities Closed' },
  { id: 'opportunities', caption: 'Opportunities' },
  { id: 'proposals', caption: 'Proposals' },
  { id: 'estimates', caption: 'Estimates' },
  { id: 'work-orders', caption: 'Work Orders' },
  { id: 'invoices', caption: 'Invoices' },
];

const SectionHeading = ({ children }) => (
  <Text as="H2" fontSize="18px" lineHeight="24px" fontWeight={700} mt="0px" mb="0px">
    {children}
  </Text>
);

const ContactDetailBody = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('activities-open');

  return (
    <Inline gap="lg" align="stretch" style={{ width: '100%' }}>
      {/* LEFT — identity + detail fields */}
      <Box style={{ flex: '0 0 460px', minWidth: 380 }}>
        <Stack gap="lg">
          <Button
            variant="tertiary"
            leftIcon={<SvgIcon name="chevron-left" size={12} color="currentColor" />}
            style={{ alignSelf: 'flex-start' }}
          >
            Back
          </Button>

          {/* Avatar + name. Audit signal: m-next has no dedicated Avatar
              component for an initials circle of this size. AvatarPill is
              tag-shaped. Inline div until the pattern is canonized. */}
          <Inline gap="md" align="center">
            <Box
              style={{
                width: 64, height: 64, borderRadius: 32, background: '#A5DFEB',
                color: '#0F1B31', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 22,
              }}
            >
              {CONTACT.initials}
            </Box>
            <Stack gap="none">
              <Text as="H1" fontSize="24px" lineHeight="28px" fontWeight={700} mt="0px" mb="0px">
                {CONTACT.name}
              </Text>
              <Text fontSize="13px" lineHeight="16px" fontColor={theme.content.subtle} mt="2px">
                Main Contact
              </Text>
            </Stack>
          </Inline>

          <Divider spacing="none" />

          {/* Health score — Pill with subtle scheme communicates the metric */}
          <Inline gap="md" align="center">
            <Pill colorScheme="red" variant="subtle" size="md">
              {String(CONTACT.healthScore)}
            </Pill>
            <Stack gap="none">
              <Inline gap="xs" align="center">
                <Text fontSize="16px" lineHeight="20px" fontWeight={600}>
                  Health Score
                </Text>
                <Text fontSize="13px" lineHeight="16px" fontColor={theme.content.subtle}>
                  ({CONTACT.healthScoreUpdated})
                </Text>
              </Inline>
              <Text fontSize="13px" lineHeight="16px" fontColor={theme.content.subtle} mt="2px">
                {CONTACT.healthScoreNote}
              </Text>
            </Stack>
          </Inline>

          <Divider spacing="none" />

          {/* Contact Details */}
          <Stack gap="md">
            <Inline justify="spaceBetween" align="center">
              <SectionHeading>Contact Details</SectionHeading>
              <Button variant="secondary" size="sm">Edit</Button>
            </Inline>
            <Inline gap="lg" wrap>
              <Box style={{ flex: '1 1 200px' }}>
                <FormField label="Phone">
                  <Input value={CONTACT.phone} readOnly />
                </FormField>
              </Box>
              <Box style={{ flex: '1 1 200px' }}>
                <FormField label="Alt Phone">
                  <Input value={CONTACT.altPhone} readOnly />
                </FormField>
              </Box>
            </Inline>
            <FormField label="Mobile">
              <Input value={CONTACT.mobile} readOnly />
            </FormField>
            <FormField label="Email">
              <Input value={CONTACT.email} readOnly />
            </FormField>
            <FormField label="Website">
              <Input value={CONTACT.website} readOnly />
            </FormField>
            <FormField label="Tags">
              <Input value={CONTACT.tags} readOnly />
            </FormField>
            <FormField label="Portal Link" description="Shareable link for portal access.">
              <Input value={CONTACT.portalLink} readOnly />
            </FormField>
          </Stack>

          {/* Customer Lead Details */}
          <Stack gap="md">
            <Inline justify="spaceBetween" align="center">
              <SectionHeading>Customer Lead Details</SectionHeading>
              <Button variant="secondary" size="sm">Edit</Button>
            </Inline>
            <Inline gap="lg" wrap>
              <Box style={{ flex: '1 1 200px' }}>
                <FormField label="Lead Status">
                  <Input value={CONTACT.leadStatus} readOnly />
                </FormField>
              </Box>
              <Box style={{ flex: '1 1 200px' }}>
                <FormField label="Lead Rating">
                  <Input value={CONTACT.leadRating} readOnly />
                </FormField>
              </Box>
            </Inline>
            <FormField label="Lead Source">
              <Input value={CONTACT.leadSource} readOnly />
            </FormField>
            <FormField label="Assigned To">
              <Input value={CONTACT.assignedTo} readOnly />
            </FormField>
            <FormField label="Name in QuickBooks">
              <Input value={CONTACT.quickbooksName} readOnly />
            </FormField>
          </Stack>
        </Stack>
      </Box>

      {/* RIGHT — Tabs + action area + empty state */}
      <Box style={{ flex: '1 1 auto', minWidth: 0 }}>
        <Container bordered padding="0px">
          <Stack gap="none">
            {/* Tabs is used as a navigation strip only (no panel content) — the
                content below renders as siblings. To render content INSIDE the
                tab panel instead, pass onRenderTabContent. */}
            <Tabs
              tabList={CONTACT_DETAIL_TABS}
              selectedTab={activeTab}
              onChange={setActiveTab}
            />

            <Box padding="md">
              <Inline justify="spaceBetween" align="center" wrap gap="md">
                <Box style={{ flex: 1, maxWidth: 360 }}>
                  <SearchInput value="" onChange={() => {}} placeholder="Search" />
                </Box>
                <Button
                  variant="tertiary"
                  leftIcon={<SvgIcon name="circle-plus" size={16} color="currentColor" />}
                >
                  New Activity
                </Button>
              </Inline>
            </Box>

            <Divider spacing="none" />

            <Box padding="xl">
              <EmptyState
                variant="subtle"
                title="No activities yet"
                description="Activities you log for this contact will appear here. Start by logging a call, email, or meeting."
                action={<Button variant="primary">Log first activity</Button>}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Inline>
  );
};

const ContactDetailShell = () => {
  const theme = useTheme();
  return (
    <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', fontFamily: theme.fontFamily }}>
      <Sidebar>
        <Sidebar.Header>
          <MethodLogo height={20} />
        </Sidebar.Header>
        <Sidebar.Item icon={<SvgIcon name="dashboard" size={20} color="white" />}>Home</Sidebar.Item>
        <Sidebar.Item icon={<SvgIcon name="customize" size={20} color="white" />}>App Studio</Sidebar.Item>
        <Sidebar.Divider />
        <Sidebar.Body>
          <Sidebar.Item icon={<SvgIcon name="opportunity" size={20} color="white" />}>Opportunities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="activities" size={20} color="white" />}>Activities</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="contacts" size={20} color="white" />} active>
            Customers &amp; Leads
          </Sidebar.Item>
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
              Customers &amp; Leads
            </Button>
          </AppBar.Start>
          <AppBar.End>
            <Button variant="ghost" aria-label="Global add" leftIcon={<SvgIcon name="circle-plus" size={20} color="currentColor" />} />
            <Button variant="ghost" aria-label="Search" leftIcon={<SvgIcon name="search" size={20} color="currentColor" />} />
          </AppBar.End>
        </AppBar>

        <Box padding="xl" style={{ flex: 1, overflowY: 'auto', background: theme.background.page || theme.background.subtle }}>
          <ContactDetailBody />
        </Box>
      </Box>
    </Box>
  );
};

export const Default = () => (
  <ThemeProvider defaultName="light">
    <ContactDetailShell />
  </ThemeProvider>
);
Default.storyName = 'Contact detail';
