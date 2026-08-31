import React, { useState } from 'react';
import { ThemeProvider, useTheme } from '@m-next/theme';
import { Box, Stack, Inline } from '@m-next/layout';
import { Sidebar } from '@m-next/sidebar';
import { AppBar } from '@m-next/app-bar';
import { AppActivationBanner } from '@m-next/app-activation-banner';
import { Button } from '@m-next/button';
import { Tabs } from '@m-next/tabs';
import { Grid } from '@m-next/grid';
import { FieldTypeIds, sortTypes } from '@m-next/types';
import { EmptyState } from '@m-next/empty-state';
import { MethodLogo } from '@m-next/brand';
import { SvgIcon } from '@m-next/svg-icon';

export default {
  title: 'm-next/Compositions/CustomersList',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'List view composition: AppBar + Sidebar shell, an activation banner over the top, and a tabs surface (Contacts / Companies) wrapping a real m-next Grid. Demonstrates how Method renders a primary list-view screen end-to-end.',
      },
    },
  },
};

// =====================================================================
// Mock data — Contacts
// =====================================================================

const CUSTOMERS_TAGS = [
  { colour: '#A9D9BF', name: 'Hot lead' },
  { colour: '#84F3FF', name: 'Cold lead' },
  { colour: '#BACAD0', name: 'VIP' },
  { colour: '#B3E5FF', name: 'Net 30' },
  { colour: '#FFCDAB', name: 'Overdue' },
  { colour: '#FFE3A3', name: 'Renewal' },
  { colour: '#D6C7FF', name: 'Enterprise' },
];

const CUSTOMERS_COLUMNS = [
  { primary: true, name: 'RecordID', fieldType: FieldTypeIds.Integer, visible: false, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Contact', caption: 'Contact', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'ContactType', caption: 'Contact type', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Email', caption: 'Email', fieldType: FieldTypeIds.Email, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'Phone', caption: 'Phone', fieldType: FieldTypeIds.Phone, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Tags', caption: 'Tags', fieldType: FieldTypeIds.Tags, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'LifetimeValue', caption: 'Lifetime value', fieldType: FieldTypeIds.Money, visible: true, columnAlign: 'right', width: 'sm', editable: false },
  { primary: false, name: 'HealthScore', caption: 'Health score', fieldType: FieldTypeIds.Integer, visible: true, columnAlign: 'right', width: 'sm', editable: false },
];

const CUSTOMERS_DATA = [
  { RecordID: 1, Contact: 'Tyler Copeland', ContactType: 'Customer Lead', Email: 'copelandmedia@gmail.com', Phone: '', Tags: '', LifetimeValue: '', HealthScore: 10 },
  { RecordID: 2, Contact: 'Alex Chen', ContactType: 'Customer', Email: 'alex.chen@northwind.com', Phone: '416 555 0142', Tags: 'VIP,Enterprise', LifetimeValue: 84250.5, HealthScore: 92 },
  { RecordID: 3, Contact: 'Priya Sharma', ContactType: 'Customer', Email: 'priya@contoso.io', Phone: '647 555 0188', Tags: 'Renewal', LifetimeValue: 31200, HealthScore: 78 },
  { RecordID: 4, Contact: 'Marcus Bell', ContactType: 'Customer Lead', Email: 'marcus.bell@bellworks.co', Phone: '212 555 0119', Tags: 'Hot lead', LifetimeValue: '', HealthScore: 45 },
  { RecordID: 5, Contact: 'Sofia Reyes', ContactType: 'Customer', Email: 'sofia@reyesstudio.com', Phone: '305 555 0177', Tags: 'VIP,Net 30', LifetimeValue: 42800, HealthScore: 88 },
  { RecordID: 6, Contact: 'Daniel Okafor', ContactType: 'Prospect', Email: 'd.okafor@okaforlogistics.com', Phone: '', Tags: 'Cold lead', LifetimeValue: '', HealthScore: 22 },
  { RecordID: 7, Contact: 'Emma Thompson', ContactType: 'Customer', Email: 'emma.t@brightlabs.io', Phone: '604 555 0163', Tags: 'Enterprise,Net 30', LifetimeValue: 156400, HealthScore: 96 },
  { RecordID: 8, Contact: 'Jake Morrison', ContactType: 'Customer Lead', Email: 'jake@morrisonbuild.com', Phone: '780 555 0144', Tags: 'Hot lead,VIP', LifetimeValue: '', HealthScore: 67 },
  { RecordID: 9, Contact: 'Lin Wei', ContactType: 'Customer', Email: 'lin.wei@harborstack.com', Phone: '604 555 0102', Tags: 'Renewal,VIP', LifetimeValue: 67500, HealthScore: 81 },
  { RecordID: 10, Contact: 'Robin Park', ContactType: 'Customer', Email: 'robin@parkagency.co', Phone: '416 555 0123', Tags: 'Net 30', LifetimeValue: 18900, HealthScore: 71 },
  { RecordID: 11, Contact: 'Aisha Mahmoud', ContactType: 'Prospect', Email: 'a.mahmoud@mahmoudcpa.com', Phone: '', Tags: 'Cold lead', LifetimeValue: '', HealthScore: 33 },
  { RecordID: 12, Contact: 'Sam Rivera', ContactType: 'Customer', Email: 'sam.rivera@rivera-co.com', Phone: '212 555 0156', Tags: 'Overdue', LifetimeValue: 9800, HealthScore: 38 },
];

// =====================================================================
// Mock data — Companies
// =====================================================================

const COMPANIES_COLUMNS = [
  { primary: true, name: 'RecordID', fieldType: FieldTypeIds.Integer, visible: false, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Company', caption: 'Company', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'Industry', caption: 'Industry', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Email', caption: 'Primary email', fieldType: FieldTypeIds.Email, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'Phone', caption: 'Phone', fieldType: FieldTypeIds.Phone, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Tags', caption: 'Tags', fieldType: FieldTypeIds.Tags, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'AnnualRevenue', caption: 'Annual revenue', fieldType: FieldTypeIds.Money, visible: true, columnAlign: 'right', width: 'sm', editable: false },
  { primary: false, name: 'Employees', caption: 'Employees', fieldType: FieldTypeIds.Integer, visible: true, columnAlign: 'right', width: 'sm', editable: false },
];

const COMPANIES_DATA = [
  { RecordID: 1, Company: 'Northwind Traders', Industry: 'Wholesale', Email: 'hello@northwind.com', Phone: '416 555 0142', Tags: 'VIP,Enterprise', AnnualRevenue: 4250000, Employees: 142 },
  { RecordID: 2, Company: 'Contoso Software', Industry: 'Software', Email: 'sales@contoso.io', Phone: '647 555 0188', Tags: 'Renewal', AnnualRevenue: 1830000, Employees: 48 },
  { RecordID: 3, Company: 'Bellworks Studio', Industry: 'Creative agency', Email: 'hello@bellworks.co', Phone: '212 555 0119', Tags: 'Hot lead', AnnualRevenue: '', Employees: 12 },
  { RecordID: 4, Company: 'Reyes Studio', Industry: 'Architecture', Email: 'studio@reyesstudio.com', Phone: '305 555 0177', Tags: 'VIP,Net 30', AnnualRevenue: 2100000, Employees: 26 },
  { RecordID: 5, Company: 'Okafor Logistics', Industry: 'Logistics', Email: 'info@okaforlogistics.com', Phone: '', Tags: 'Cold lead', AnnualRevenue: '', Employees: 85 },
  { RecordID: 6, Company: 'Brightlabs', Industry: 'Biotech', Email: 'contact@brightlabs.io', Phone: '604 555 0163', Tags: 'Enterprise,Net 30', AnnualRevenue: 8740000, Employees: 220 },
];

// =====================================================================
// ReadonlyGrid — local wrapper that mirrors packages/grid/stories/GridWrapper.jsx
// so the Grid in this composition has the same canonical wiring as the
// Readonly story (pagination, selection, sort, search state).
// =====================================================================

const ReadonlyGrid = ({ id, data, columns, viewFilters, selectedView, tagsList, onRowClick }) => {
  const [sort, setSort] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRecordIDs, setSelectedRecordIDs] = useState([]);
  const [allExcept, setAllExcept] = useState(false);
  const [transformedData, setTransformedData] = useState(data);
  const [searchText, setSearchText] = useState(null);

  const handleSort = (sortField, sortType) => {
    setSort({ sortField, sortType });
    const next = [...transformedData];
    next.sort((a, b) => {
      const first = a[sortField] || '';
      const second = b[sortField] || '';
      if (first < second) return sortType === sortTypes.Descending ? 1 : -1;
      if (first > second) return sortType === sortTypes.Descending ? -1 : 1;
      return 0;
    });
    setTransformedData(next);
  };

  return (
    // Wrapper makes Grid fill the tab panel — Tabs renders content as a
    // flex-row container, so a bare block child collapses to its content width.
    <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
      <Grid
        id={id}
        isMobile={false}
        isLoading={false}
        editable={false}
        width="100%"
        data={transformedData}
        errorData={null}
        columns={columns}
        onRenderRow={null}
        viewFilters={viewFilters}
        selectedView={selectedView}
        showReload
        showExport={false}
        showViewFilter
        selectable
        columnTotals={[]}
        tagsList={tagsList}
        showInlineExport
        showShowHideColumns
        searchable
        searchValue={searchText}
        onGridSearch={setSearchText}
        onRefresh={() => {}}
        onSelectAll={setAllExcept}
        onSelectedRecords={(ids, rows) => {
          setSelectedRecordIDs(ids);
          setSelectedRows(rows);
        }}
        invertSelection={allExcept}
        selectedRecordIds={selectedRecordIDs}
        selectedRows={selectedRows}
        totalRecords={transformedData.length}
        pageNumber={pageNumber}
        pageSize={pageSize}
        showPageSize
        showPagination
        onPageChange={setPageNumber}
        onPageLengthChange={(v) => {
          setPageNumber(1);
          setPageSize(v);
        }}
        isPartialCount={false}
        sorting={sort}
        onChangeColumnSorting={handleSort}
        responsive
        onRowClick={onRowClick}
        fillParentHeight
        variant="modern"
      />
    </div>
  );
};

// =====================================================================
// Screen body
// =====================================================================

const CustomersListBody = () => {
  const theme = useTheme();
  const [activationDismissed, setActivationDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <Stack
      gap="lg"
      style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
    >
      {!activationDismissed && (
        <AppActivationBanner
          iconName="contacts"
          title="Turn more prospects into paying customers"
          description="Customers and Leads helps you capture, organize, and act on every potential opportunity so no prospect falls through the cracks."
          bulletPoints={[
            { id: 'bp1', text: 'Capture and organize leads while interest is high' },
            { id: 'bp2', text: 'Track lead status from inquiry to opportunity' },
            { id: 'bp3', text: 'Manage communications and follow-ups in one place' },
          ]}
          primaryCTA={{ id: 'add-first-contact', text: 'Add your first contact', onClick: () => {} }}
          secondaryCTA={{ id: 'learn-more', text: 'Learn more', onClick: () => {} }}
          dismissible
          onClose={() => setActivationDismissed(true)}
        />
      )}

      <Inline justify="spaceBetween" align="center">
        <Button
          variant="tertiary"
          leftIcon={<SvgIcon name="chevron-left" size={12} color="currentColor" />}
        >
          Back
        </Button>

        <Inline gap="md" align="center">
          <Button
            variant="tertiary"
            leftIcon={<SvgIcon name="cloud-save" size={16} color="currentColor" />}
          >
            Import contacts
          </Button>
          <Button
            variant="primary"
            leftIcon={<SvgIcon name="circle-plus" size={14} color="currentColor" />}
          >
            Add contact
          </Button>
        </Inline>
      </Inline>

      <Tabs
        tabList={[
          { id: 'contacts', caption: 'Contacts' },
          { id: 'companies', caption: 'Companies' },
        ]}
        selectedTab={activeTab}
        onChange={setActiveTab}
        onRenderTabContent={() => {
          if (activeTab === 'companies') {
            return (
              <ReadonlyGrid
                id="companies-grid"
                data={COMPANIES_DATA}
                columns={COMPANIES_COLUMNS}
                viewFilters={[
                  { id: 'shared-active', name: 'Shared - Active Companies' },
                  { id: 'shared-all', name: 'Shared - All Companies' },
                  { id: 'my-active', name: 'My Companies' },
                ]}
                selectedView="shared-active"
                tagsList={CUSTOMERS_TAGS}
              />
            );
          }
          return (
            <ReadonlyGrid
              id="customers-grid"
              data={CUSTOMERS_DATA}
              columns={CUSTOMERS_COLUMNS}
              viewFilters={[
                { id: 'shared-active', name: 'Shared - Active Contacts' },
                { id: 'shared-all', name: 'Shared - All Contacts' },
                { id: 'my-active', name: 'My Contacts' },
              ]}
              selectedView="shared-active"
              tagsList={CUSTOMERS_TAGS}
              onRowClick={() => {}}
            />
          );
        }}
      />
    </Stack>
  );
};

// =====================================================================
// Full shell: Sidebar + AppBar + screen body
// =====================================================================

const CustomersListShell = () => {
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
          <Sidebar.Item icon={<SvgIcon name="items-shelf" size={20} color="white" />}>Items</Sidebar.Item>
          <Sidebar.Item icon={<SvgIcon name="building" size={20} color="white" />}>Accounts</Sidebar.Item>
        </Sidebar.Body>
      </Sidebar>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <AppBar>
          <AppBar.Start>
            {/* Page-title trigger uses Button variant="tertiary" since this opens
                a view-config menu (a Method production pattern). */}
            <Button
              variant="tertiary"
              rightIcon={<SvgIcon name="chevron-down" size={14} color="currentColor" />}
            >
              Customers &amp; Leads
            </Button>
          </AppBar.Start>
          <AppBar.End>
            <Button
              variant="ghost"
              aria-label="Global add"
              leftIcon={<SvgIcon name="circle-plus" size={20} color="currentColor" />}
            />
            <Button
              variant="ghost"
              aria-label="Search"
              leftIcon={<SvgIcon name="search" size={20} color="currentColor" />}
            />
            {/* Audit signal: m-next has no dedicated "user-menu avatar button"
                pattern. AvatarPill is tag-style; the circular menu trigger in
                production AppBars is a gap. Using inline element until the
                pattern is canonized. */}
            <button
              type="button"
              aria-label="User menu"
              style={{
                background: '#E5F0FA', color: '#022266', width: 36, height: 36,
                borderRadius: 18, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 12,
              }}
            >
              TC
            </button>
          </AppBar.End>
        </AppBar>

        <Box padding="xl" style={{ flex: 1, overflowY: 'auto', background: theme.background.page || theme.background.subtle }}>
          <CustomersListBody />
        </Box>
      </Box>
    </Box>
  );
};

export const Default = () => (
  <ThemeProvider defaultName="light">
    <CustomersListShell />
  </ThemeProvider>
);
Default.storyName = 'Customers list';
