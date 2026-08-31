import React, { useState, useContext, useMemo, useEffect, useRef, forwardRef } from 'react';

// Foundation
import { ThemeProvider, useTheme, useThemeSwitcher } from '@m-next/theme';
import { Box, Stack, Inline, Divider } from '@m-next/layout';

// m-next components — imported under Raw* names so we can wrap them
// with the Identify HOC and then re-export as the natural name.
import { Container as RawContainer } from '@m-next/container';
import { Text as RawText } from '@m-next/text';
import { InsightCard as RawInsightCard } from '@m-next/insight-card';
import { Button as RawButton } from '@m-next/button';
import { Link as RawLink } from '@m-next/link';
import { Pill as RawPill } from '@m-next/pill';
import { Badge as RawBadge } from '@m-next/badge';
import { Banner as RawBanner } from '@m-next/banner';
import { Alert as RawAlert } from '@m-next/alert';
import { Spinner as RawSpinner } from '@m-next/spinner';
import { Skeleton as RawSkeleton } from '@m-next/loading-skeleton';
import { ToastProvider, useToast } from '@m-next/toast';
import { EmptyState as RawEmptyState } from '@m-next/empty-state';
import { Tooltip as RawTooltip } from '@m-next/tooltip';
import { Input as RawInput } from '@m-next/input';
import { Textarea as RawTextarea } from '@m-next/input-area';
import { Checkbox as RawCheckbox } from '@m-next/checkbox';
import { Toggle as RawToggle } from '@m-next/toggle';
import { SearchInput as RawSearchInput } from '@m-next/search-input';
import { SegmentedControl as RawSegmentedControl } from '@m-next/pill-tab';
import { FormField as RawFormField } from '@m-next/form-field';
import { FormSection as RawFormSection } from '@m-next/field-block';
import { Breadcrumbs as RawBreadcrumbs } from '@m-next/bread-crumbs';
import { Tabs as RawTabs } from '@m-next/tabs';
import { Stepper as RawStepper } from '@m-next/stepper';
import { Drawer as RawDrawer } from '@m-next/drawer';
import { Dialog as RawDialog } from '@m-next/dialog';
import { Sidebar as RawSidebar } from '@m-next/sidebar';
import { AppBar as RawAppBar } from '@m-next/app-bar';
import { AppActivationBanner as RawAppActivationBanner } from '@m-next/app-activation-banner';
import { HeroBanner as RawHeroBanner } from '@m-next/hero-banner';
import { SectionHeader as RawSectionHeader } from '@m-next/section-header';
import { Pagination as RawPagination } from '@m-next/pagination';
import { AvatarPill as RawAvatarPill } from '@m-next/avatar-pill';
import { Grid as RawGrid } from '@m-next/grid';
import { FieldTypeIds, sortTypes } from '@m-next/types';
import { MethodLogo as RawMethodLogo } from '@m-next/brand';
import { SvgIcon } from '@m-next/svg-icon';

// =====================================================================
// Inspect mode — global toggle that overlays a label + dashed outline
// on every m-next component instance on the page. Color-coded by
// category. Unlabeled regions = inline styles / native HTML / local
// helpers (the audit signal).
// =====================================================================

const InspectContext = React.createContext(false);

const CATEGORY_COLORS = {
  foundation: '#7c3aed',
  action: '#0D71C8',
  display: '#0e7490',
  feedback: '#D97706',
  form: '#137E58',
  overlay: '#be185d',
  navigation: '#A10007',
  local: '#9ca3af',
};

const Identify = ({ name, category = 'action', block = false, style, children }) => {
  const on = useContext(InspectContext);
  // When inspect is OFF, use display:contents so the wrapper produces no
  // layout box — the wrapped component becomes a direct child of the real
  // parent and inherits flex behavior cleanly. When inspect is ON, switch
  // back to block/inline-block so the outline + badge render.
  // (data-* attributes still work in contents mode — DOM queries find them.)
  const color = CATEGORY_COLORS[category];
  const Wrapper = block ? 'div' : 'span';
  const displayMode = on ? (block ? 'block' : 'inline-block') : 'contents';
  return (
    <Wrapper
      data-mnext-category={category}
      data-mnext-name={name}
      style={{
        position: on ? 'relative' : 'static',
        display: displayMode,
        outline: on ? `1.5px dashed ${color}` : 'none',
        outlineOffset: on ? 2 : 0,
        borderRadius: 2,
        ...style,
      }}
    >
      {on && (
        <span
          style={{
            position: 'absolute',
            top: -11,
            left: 0,
            fontSize: 9,
            background: color,
            color: 'white',
            padding: '1px 5px',
            borderRadius: 3,
            zIndex: 100,
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {name}
        </span>
      )}
      {children}
    </Wrapper>
  );
};

// HOC: wraps a component so it auto-identifies in inspect mode.
const labeled = (Comp, name, category, block = false) => {
  const Wrapped = forwardRef((props, ref) => (
    <Identify name={name} category={category} block={block}>
      <Comp ref={ref} {...props} />
    </Identify>
  ));
  Wrapped.displayName = `Identified(${name})`;
  return Wrapped;
};

// Identified versions of each m-next component. JSX below uses the
// natural name (Button, Pill, etc.) — labels appear when inspect on.
const Container = labeled(RawContainer, 'Container', 'foundation', true);
const Text = labeled(RawText, 'Text', 'foundation');
const InsightCard = labeled(RawInsightCard, 'InsightCard', 'display', true);
const Button = labeled(RawButton, 'Button', 'action');
const Link = labeled(RawLink, 'Link', 'action');
const Pill = labeled(RawPill, 'Pill', 'display');
const Badge = labeled(RawBadge, 'Badge', 'display');
const Banner = labeled(RawBanner, 'Banner', 'feedback', true);
const Alert = labeled(RawAlert, 'Alert', 'feedback', true);
const Spinner = labeled(RawSpinner, 'Spinner', 'feedback');
const Skeleton = labeled(RawSkeleton, 'Skeleton', 'feedback', true);
const EmptyState = labeled(RawEmptyState, 'EmptyState', 'feedback', true);
const Tooltip = labeled(RawTooltip, 'Tooltip', 'feedback');
const Input = labeled(RawInput, 'Input', 'form');
const Textarea = labeled(RawTextarea, 'Textarea', 'form');
const Checkbox = labeled(RawCheckbox, 'Checkbox', 'form');
const Toggle = labeled(RawToggle, 'Toggle', 'form');
const SearchInput = labeled(RawSearchInput, 'SearchInput', 'form');
const SegmentedControl = labeled(RawSegmentedControl, 'SegmentedControl', 'form', true);
const FormField = labeled(RawFormField, 'FormField', 'form', true);
const FormSection = labeled(RawFormSection, 'FormSection', 'form', true);
const Breadcrumbs = labeled(RawBreadcrumbs, 'Breadcrumbs', 'navigation');
const Tabs = labeled(RawTabs, 'Tabs', 'navigation', true);
const Stepper = labeled(RawStepper, 'Stepper', 'navigation', true);
const Sidebar = labeled(RawSidebar, 'Sidebar', 'navigation', true);
const AppBar = labeled(RawAppBar, 'AppBar', 'navigation', true);
const AppActivationBanner = labeled(RawAppActivationBanner, 'AppActivationBanner', 'feedback', true);
const HeroBanner = labeled(RawHeroBanner, 'HeroBanner', 'feedback', true);
const SectionHeader = labeled(RawSectionHeader, 'SectionHeader', 'display', true);
const Pagination = labeled(RawPagination, 'Pagination', 'navigation', true);
const AvatarPill = labeled(RawAvatarPill, 'AvatarPill', 'display');
const Grid = labeled(RawGrid, 'Grid', 'display', true);
const MethodLogo = labeled(RawMethodLogo, 'MethodLogo', 'display');
// Compound sub-components — pass through; no need to label individually since
// the shell wrappers (Sidebar, AppBar) already get the inspect outline.
Sidebar.Header = RawSidebar.Header;
Sidebar.Body = RawSidebar.Body;
Sidebar.Footer = RawSidebar.Footer;
Sidebar.Divider = RawSidebar.Divider;
Sidebar.Group = RawSidebar.Group;
Sidebar.Item = RawSidebar.Item;
AppBar.Start = RawAppBar.Start;
AppBar.Center = RawAppBar.Center;
AppBar.End = RawAppBar.End;

// Drawer and Dialog are portal-rendered overlays — labeling their
// React element won't show in the visible tree. Their contents below
// still get labeled when open.
const Drawer = RawDrawer;
const Dialog = RawDialog;

// =====================================================================
// Data
// =====================================================================

const FAKE_INVOICES = [
  { id: 'INV-2049', amount: 1250.0, status: 'paid', dueDate: '2026-04-12' },
  { id: 'INV-2050', amount: 4800.0, status: 'open', dueDate: '2026-05-30' },
  { id: 'INV-2047', amount: 980.5, status: 'overdue', dueDate: '2026-05-12' },
  { id: 'INV-2042', amount: 2100.0, status: 'paid', dueDate: '2026-04-01' },
  { id: 'INV-2051', amount: 670.0, status: 'open', dueDate: '2026-06-15' },
];

const FAKE_ACTIVITY = [
  { id: 'a1', who: 'Alex Chen', what: 'paid invoice #2049', when: '10 minutes ago' },
  { id: 'a2', who: 'Robin Park', what: 'created invoice #2050', when: '1 hour ago' },
  { id: 'a3', who: 'Jamie Lee', what: 'marked invoice #2047 overdue', when: '3 hours ago' },
  { id: 'a4', who: 'Sam Rivera', what: 'sent reminder for #2042', when: 'Yesterday' },
];

const STATUS_TO_PILL = {
  paid: { label: 'Paid', scheme: 'green' },
  open: { label: 'Open', scheme: 'blue' },
  overdue: { label: 'Overdue', scheme: 'red' },
};

// =====================================================================
// Inspect-mode legend — appears at the top right when inspect is on
// =====================================================================

const InspectLegend = () => {
  // Position state — pixels from top-left. Default = top-right corner of
  // viewport. Persisted to localStorage so the user's preferred spot
  // sticks across reloads / inspect toggles.
  const [pos, setPos] = useState(() => {
    if (typeof window === 'undefined') return { x: 0, y: 60 };
    try {
      const saved = window.localStorage.getItem('m-next-inspect-legend-pos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore localStorage parse errors
    }
    return { x: window.innerWidth - 220, y: 60 };
  });
  const dragRef = useRef(null);
  const dragState = useRef({ offsetX: 0, offsetY: 0, active: false });

  // Live counts of m-next components on the page, keyed by category.
  // Recomputed whenever the DOM changes (MutationObserver), so the
  // numbers reflect the currently-rendered screen.
  const on = useContext(InspectContext);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!on || typeof document === 'undefined') return undefined;
    const recount = () => {
      const nodes = document.querySelectorAll('[data-mnext-category]');
      const next = {};
      nodes.forEach((n) => {
        const c = n.getAttribute('data-mnext-category');
        if (!c) return;
        next[c] = (next[c] || 0) + 1;
      });
      setCounts(next);
    };
    recount();
    const observer = new MutationObserver(recount);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-mnext-category'],
    });
    return () => observer.disconnect();
  }, [on]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    try {
      window.localStorage.setItem('m-next-inspect-legend-pos', JSON.stringify(pos));
    } catch (e) {
      // localStorage may be unavailable (private mode etc) — silently ignore
    }
    return undefined;
  }, [pos]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = dragRef.current.getBoundingClientRect();
    dragState.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      active: true,
    };
    const onMove = (ev) => {
      if (!dragState.current.active) return;
      // Clamp inside viewport so the legend can't be lost off-screen.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const legendW = rect.width;
      const legendH = rect.height;
      const nextX = Math.max(0, Math.min(w - legendW, ev.clientX - dragState.current.offsetX));
      const nextY = Math.max(0, Math.min(h - legendH, ev.clientY - dragState.current.offsetY));
      setPos({ x: nextX, y: nextY });
    };
    const onUp = () => {
      dragState.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!on) return null;
  const entries = [
    { label: 'Foundation', category: 'foundation' },
    { label: 'Action', category: 'action' },
    { label: 'Display', category: 'display' },
    { label: 'Feedback', category: 'feedback' },
    { label: 'Form', category: 'form' },
    { label: 'Overlay', category: 'overlay' },
    { label: 'Navigation', category: 'navigation' },
    { label: 'Local helper / native HTML', category: 'local' },
  ];
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        background: 'white',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
        fontSize: 11,
        userSelect: 'none',
        padding: 8,
        minWidth: 180,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          cursor: 'grab',
          background: '#F3F4F6',
          borderRadius: 4,
          padding: '6px 8px',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
        title="Drag to move"
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 10,
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Legend
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#6b7280',
              background: '#E5E7EB',
              borderRadius: 999,
              padding: '1px 6px',
            }}
            title="Total m-next instances on screen"
          >
            {total}
          </span>
          <span
            aria-hidden='true'
            style={{
              color: '#9ca3af',
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            ⋮⋮
          </span>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {entries.map((e) => {
          const count = counts[e.category] || 0;
          return (
            <div
              key={e.category}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: `1.5px dashed ${CATEGORY_COLORS[e.category]}`,
                  borderRadius: 2,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#374151', flex: 1 }}>{e.label}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: count > 0 ? CATEGORY_COLORS[e.category] : '#9ca3af',
                  background: count > 0 ? `${CATEGORY_COLORS[e.category]}14` : 'transparent',
                  borderRadius: 999,
                  padding: '1px 6px',
                  minWidth: 22,
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================================
// Header
// =====================================================================

const Header = ({ onDelete, onEdit, inspectOn, setInspectOn }) => {
  const theme = useTheme();
  const { current, setTheme, available } = useThemeSwitcher();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <Stack gap="md">
      {!bannerDismissed && (
        <Banner status="warning" onClose={() => setBannerDismissed(true)}>
          This customer has 2 overdue invoices. Total outstanding: $24,650.
        </Banner>
      )}

      <Inline justify="spaceBetween" align="center" wrap gap="md">
        <Breadcrumbs
          crumbs={[
            { label: 'Dashboard', href: '#' },
            { label: 'Customers', href: '#' },
            { label: 'Acme Corp' },
          ]}
        />
        <Inline gap="md" align="center">
          <Inline gap="xs" align="center">
            <Text fontColor={theme.content.subtle}>Theme:</Text>
            {available.map((name) => (
              <Button
                key={name}
                variant={current === name ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTheme(name)}
              >
                {name}
              </Button>
            ))}
          </Inline>
        </Inline>
      </Inline>

      <Container bordered padding="24px">
        <Inline justify="spaceBetween" align="center" wrap gap="md">
          <Inline gap="md" align="center">
            <Box
              width={56}
              height={56}
              background={theme.informative.iconBackground}
              style={{
                borderRadius: theme.radius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.informative.icon,
                fontSize: 22,
                fontWeight: theme.fontWeight.semibold,
              }}
              aria-hidden="true"
            >
              AC
            </Box>
            <Stack gap="xs">
              <Inline gap="sm" align="center">
                <Text
                  as="H1"
                  fontSize="24px"
                  lineHeight="28px"
                  fontWeight={theme.fontWeight.semibold}
                  fontColor={theme.content.emphasize}
                  mt="0px"
                  mb="0px"
                >
                  Acme Corp
                </Text>
                <Pill colorScheme="green" variant="subtle">Active</Pill>
                <Badge colorScheme="blue" variant="subtle">VIP</Badge>
              </Inline>
              <Text fontSize="14px" lineHeight="20px" fontColor={theme.content.subtle}>
                alex@acme.com · +1 555 0100 · Customer since 2023
              </Text>
            </Stack>
          </Inline>

          <Inline gap="sm">
            <Tooltip content="Edit customer profile">
              <Button variant="secondary" onClick={onEdit}>Edit</Button>
            </Tooltip>
            <Tooltip content="More actions">
              <Button variant="ghost" aria-label="More actions">⋯</Button>
            </Tooltip>
            <Tooltip content="Delete customer">
              <Button variant="ghost" onClick={onDelete}>Delete</Button>
            </Tooltip>
          </Inline>
        </Inline>
      </Container>
    </Stack>
  );
};

// =====================================================================
// Tabs (Overview / Edit / Invoices / Activity)
// =====================================================================

const OverviewTab = ({ loading }) => {
  const theme = useTheme();
  return (
    <Stack gap="lg">
      <Inline gap="md" wrap>
        <Box style={{ flex: '1 1 220px', minWidth: 220 }}>
          <InsightCard
            title="Total spent"
            value="$24,650"
            delta={{ value: '12%', label: 'from last month' }}
          />
        </Box>
        <Box style={{ flex: '1 1 220px', minWidth: 220 }}>
          <InsightCard
            title="Open invoices"
            value="8"
            delta={{ value: -3, label: 'fewer than last week' }}
          />
        </Box>
        <Box style={{ flex: '1 1 220px', minWidth: 220 }}>
          <InsightCard title="Last payment" value="3 days ago" />
        </Box>
      </Inline>

      <Container bordered padding="24px">
        <Stack gap="md">
          <Inline justify="spaceBetween" align="center">
            <Text
              as="H2"
              fontSize="16px"
              lineHeight="20px"
              fontWeight={theme.fontWeight.semibold}
              fontColor={theme.content.primary}
              mt="0px"
              mb="0px"
            >
              Recent activity
            </Text>
            <Link href="#">View all</Link>
          </Inline>
          <Divider spacing="none" color={theme.content.border} />
          {loading ? (
            <Stack gap="sm">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={48} />
              ))}
            </Stack>
          ) : (
            <Stack gap="none">
              {FAKE_ACTIVITY.map((a) => (
                <Inline
                  key={a.id}
                  gap="md"
                  align="center"
                  style={{ padding: `${theme.spacing.sm}px 0` }}
                >
                  <Box
                    width={32}
                    height={32}
                    background={theme.informative.iconBackground}
                    style={{
                      borderRadius: theme.radius.full,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.informative.icon,
                      fontSize: 13,
                      fontWeight: theme.fontWeight.semibold,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {a.who.slice(0, 1)}
                  </Box>
                  <Stack gap="none" style={{ flex: 1 }}>
                    <Text fontSize="14px" lineHeight="20px">
                      <strong style={{ fontWeight: theme.fontWeight.semibold }}>{a.who}</strong>
                      {' '}{a.what}
                    </Text>
                    <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
                      {a.when}
                    </Text>
                  </Stack>
                  <Tooltip content="Add follow-up note">
                    <Button variant="ghost" size="sm" aria-label="Add note">＋</Button>
                  </Tooltip>
                </Inline>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Stack>
  );
};

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'churned', label: 'Churned' },
];

const EditTab = ({ form, setForm, formError }) => {
  const update = (key) => (eventOrValue) => {
    const v =
      eventOrValue && eventOrValue.target ? eventOrValue.target.value : eventOrValue;
    setForm((f) => ({ ...f, [key]: v }));
  };

  return (
    <Stack gap="lg">
      {formError && <Alert status="error" title="Couldn't save">{formError}</Alert>}

      <FormSection
        title="Customer details"
        description="Visible to anyone with access to this account."
      >
        <Stack gap="md">
          <FormField label="Company name" required>
            <Input value={form.name} onChange={update('name')} />
          </FormField>

          <FormField label="Email" required>
            <Input type="email" value={form.email} onChange={update('email')} />
          </FormField>

          <FormField label="Status">
            <SegmentedControl
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              aria-label="Customer status"
            />
          </FormField>

          <FormField label="Internal notes" description="Only visible to your team.">
            <Textarea
              value={form.notes}
              onChange={update('notes')}
              rows={4}
              placeholder="Add context that helps the team work with this customer…"
            />
          </FormField>
        </Stack>
      </FormSection>

      <FormSection
        title="Preferences"
        description="How this customer should be contacted."
      >
        <Stack gap="md">
          <Checkbox
            checked={form.newsletter}
            onChange={(v) => setForm((f) => ({ ...f, newsletter: v }))}
            label="Subscribed to monthly newsletter"
          />
          <Toggle
            checked={form.active}
            onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            label="Account is active"
          />
        </Stack>
      </FormSection>
    </Stack>
  );
};

const INVOICE_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

const InvoicesTab = ({ onSelectInvoice }) => {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = FAKE_INVOICES.filter((inv) => {
    if (filter !== 'all' && inv.status !== filter) return false;
    if (search && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Stack gap="lg">
      <Container bordered padding="16px">
        <Inline gap="md" wrap align="center" justify="spaceBetween">
          <Box style={{ minWidth: 240, flex: 1 }}>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number…"
            />
          </Box>
          <SegmentedControl
            options={INVOICE_FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
            aria-label="Filter invoices by status"
          />
        </Inline>
      </Container>

      <Container bordered padding="16px">
        {filtered.length === 0 ? (
          <EmptyState
            variant="subtle"
            title="No invoices match"
            description="Try a different filter or clear your search."
            action={
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <Stack gap="none">
            {filtered.map((inv, idx) => {
              const status = STATUS_TO_PILL[inv.status];
              return (
                <React.Fragment key={inv.id}>
                  <Inline
                    gap="md"
                    align="center"
                    justify="spaceBetween"
                    style={{ padding: `${theme.spacing.sm}px 0` }}
                  >
                    <Stack gap="none">
                      <Text
                        fontSize="14px"
                        lineHeight="20px"
                        fontWeight={theme.fontWeight.medium}
                      >
                        {inv.id}
                      </Text>
                      <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
                        Due {inv.dueDate}
                      </Text>
                    </Stack>
                    <Inline gap="md" align="center">
                      <Text
                        fontSize="14px"
                        lineHeight="20px"
                        fontWeight={theme.fontWeight.semibold}
                      >
                        ${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Text>
                      <Pill colorScheme={status.scheme} variant="subtle">
                        {status.label}
                      </Pill>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectInvoice(inv)}
                      >
                        View
                      </Button>
                    </Inline>
                  </Inline>
                  {idx < filtered.length - 1 && (
                    <Divider spacing="none" color={theme.content.border} />
                  )}
                </React.Fragment>
              );
            })}
          </Stack>
        )}
      </Container>
    </Stack>
  );
};

const ONBOARDING_STEPS = [
  { label: 'Account created' },
  { label: 'Profile completed' },
  { label: 'First invoice sent' },
  { label: 'First payment received' },
];

const ActivityTab = () => {
  const theme = useTheme();
  const [showEmpty, setShowEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const SectionHeading = ({ children }) => (
    <Text
      as="H2"
      fontSize="16px"
      lineHeight="20px"
      fontWeight={theme.fontWeight.semibold}
      fontColor={theme.content.primary}
      mt="0px"
      mb="0px"
    >
      {children}
    </Text>
  );

  return (
    <Stack gap="lg">
      <Container bordered padding="24px">
        <Stack gap="md">
          <SectionHeading>Onboarding progress</SectionHeading>
          <Stepper steps={ONBOARDING_STEPS} activeStep={3} showLabels />
        </Stack>
      </Container>

      <Container bordered padding="24px">
        <Stack gap="md">
          <Inline justify="spaceBetween" align="center">
            <SectionHeading>Activity feed</SectionHeading>
            <Inline gap="sm" align="center">
              <Button variant="ghost" size="sm" onClick={() => setShowEmpty((s) => !s)}>
                {showEmpty ? 'Show activity' : 'Demo empty state'}
              </Button>
              <Button variant="secondary" size="sm" disabled={refreshing} onClick={refresh}>
                {refreshing ? (
                  <Inline gap="xs" align="center">
                    <Spinner size="sm" color="#0D71C8" />
                    <span>Refreshing…</span>
                  </Inline>
                ) : (
                  'Refresh'
                )}
              </Button>
            </Inline>
          </Inline>
          <Divider spacing="none" color={theme.content.border} />
          {showEmpty ? (
            <EmptyState
              variant="bordered"
              title="No activity yet"
              description="As this customer interacts with your team, events will appear here. Try sending an invoice to get started."
              action={<Button variant="primary">Send first invoice</Button>}
            />
          ) : (
            <Stack gap="md">
              {FAKE_ACTIVITY.map((a) => (
                <Inline key={a.id} gap="md" align="flex-start">
                  <Box
                    width={8}
                    height={8}
                    style={{
                      marginTop: 8,
                      borderRadius: theme.radius.full,
                      background: theme.informative.secondary,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  <Stack gap="none" style={{ flex: 1 }}>
                    <Text fontSize="14px" lineHeight="20px">
                      <strong style={{ fontWeight: theme.fontWeight.semibold }}>{a.who}</strong>
                      {' '}{a.what}
                    </Text>
                    <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
                      {a.when}
                    </Text>
                  </Stack>
                </Inline>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      <Alert status="info">
        Activity is captured automatically. Read more in the{' '}
        <Link href="#">Method activity log docs</Link>.
      </Alert>
    </Stack>
  );
};

const InvoiceDrawerBody = ({ invoice, onClose }) => {
  const theme = useTheme();
  const { success } = useToast();
  const [number, setNumber] = useState(invoice?.id || '');
  const [amount, setAmount] = useState(invoice ? String(invoice.amount) : '');
  const [note, setNote] = useState('');

  const handleSave = () => {
    success(`Saved ${number}`, { title: 'Invoice updated' });
    onClose();
  };

  return (
    <Box padding="lg">
      <Stack gap="lg">
        <Inline gap="sm" align="center">
          <Pill
            colorScheme={STATUS_TO_PILL[invoice?.status || 'open'].scheme}
            variant="subtle"
          >
            {STATUS_TO_PILL[invoice?.status || 'open'].label}
          </Pill>
          <Text fontSize="14px" lineHeight="20px" fontColor={theme.content.subtle}>
            Due {invoice?.dueDate}
          </Text>
        </Inline>

        <FormField label="Invoice number" description="Used for accounting reconciliation." required>
          <Input value={number} onChange={(e) => setNumber(e.target.value)} />
        </FormField>

        <FormField label="Amount">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            rightContent="USD"
          />
        </FormField>

        <FormField
          label="Internal note"
          description="Only visible to your team."
          errorMessage={note.length > 200 ? 'Notes must be 200 characters or fewer.' : undefined}
        >
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add context for this invoice…"
          />
        </FormField>

        <Divider spacing="md" color={theme.content.border} />

        <Inline justify="end" gap="sm">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save invoice</Button>
        </Inline>
      </Stack>
    </Box>
  );
};

// =====================================================================
// CustomersListScreen — production "Customers & Leads" list view
// =====================================================================

// Grid columns + data for the Customers & Leads list. Shape matches the
// @m-next/grid contract — `name` matches a key on each data row record.
const CUSTOMERS_COLUMNS = [
  {
    primary: true,
    name: 'RecordID',
    fieldType: FieldTypeIds.Integer,
    visible: false,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Contact',
    caption: 'Contact',
    fieldType: FieldTypeIds.Text,
    visible: true,
    columnAlign: 'left',
    width: 'md',
    editable: false,
  },
  {
    primary: false,
    name: 'ContactType',
    caption: 'Contact type',
    fieldType: FieldTypeIds.Text,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Email',
    caption: 'Email',
    fieldType: FieldTypeIds.Email,
    visible: true,
    columnAlign: 'left',
    width: 'md',
    editable: false,
  },
  {
    primary: false,
    name: 'Phone',
    caption: 'Phone',
    fieldType: FieldTypeIds.Phone,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Tags',
    caption: 'Tags',
    fieldType: FieldTypeIds.Tags,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'LifetimeValue',
    caption: 'Lifetime value',
    fieldType: FieldTypeIds.Money,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'HealthScore',
    caption: 'Health score',
    fieldType: FieldTypeIds.Integer,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    editable: false,
  },
];

const COMPANIES_COLUMNS = [
  {
    primary: true,
    name: 'RecordID',
    fieldType: FieldTypeIds.Integer,
    visible: false,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Company',
    caption: 'Company',
    fieldType: FieldTypeIds.Text,
    visible: true,
    columnAlign: 'left',
    width: 'md',
    editable: false,
  },
  {
    primary: false,
    name: 'Industry',
    caption: 'Industry',
    fieldType: FieldTypeIds.Text,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Email',
    caption: 'Primary email',
    fieldType: FieldTypeIds.Email,
    visible: true,
    columnAlign: 'left',
    width: 'md',
    editable: false,
  },
  {
    primary: false,
    name: 'Phone',
    caption: 'Phone',
    fieldType: FieldTypeIds.Phone,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Tags',
    caption: 'Tags',
    fieldType: FieldTypeIds.Tags,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'AnnualRevenue',
    caption: 'Annual revenue',
    fieldType: FieldTypeIds.Money,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    editable: false,
  },
  {
    primary: false,
    name: 'Employees',
    caption: 'Employees',
    fieldType: FieldTypeIds.Integer,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    editable: false,
  },
];

const COMPANIES_DATA = [
  {
    RecordID: 1,
    Company: 'Northwind Traders',
    Industry: 'Wholesale',
    Email: 'hello@northwind.com',
    Phone: '416 555 0142',
    Tags: 'VIP,Enterprise',
    AnnualRevenue: 4250000,
    Employees: 142,
  },
  {
    RecordID: 2,
    Company: 'Contoso Software',
    Industry: 'Software',
    Email: 'sales@contoso.io',
    Phone: '647 555 0188',
    Tags: 'Renewal',
    AnnualRevenue: 1830000,
    Employees: 48,
  },
  {
    RecordID: 3,
    Company: 'Bellworks Studio',
    Industry: 'Creative agency',
    Email: 'hello@bellworks.co',
    Phone: '212 555 0119',
    Tags: 'Hot lead',
    AnnualRevenue: '',
    Employees: 12,
  },
  {
    RecordID: 4,
    Company: 'Reyes Studio',
    Industry: 'Architecture',
    Email: 'studio@reyesstudio.com',
    Phone: '305 555 0177',
    Tags: 'VIP,Net 30',
    AnnualRevenue: 2100000,
    Employees: 26,
  },
  {
    RecordID: 5,
    Company: 'Okafor Logistics',
    Industry: 'Logistics',
    Email: 'info@okaforlogistics.com',
    Phone: '',
    Tags: 'Cold lead',
    AnnualRevenue: '',
    Employees: 85,
  },
  {
    RecordID: 6,
    Company: 'Brightlabs',
    Industry: 'Biotech',
    Email: 'contact@brightlabs.io',
    Phone: '604 555 0163',
    Tags: 'Enterprise,Net 30',
    AnnualRevenue: 8740000,
    Employees: 220,
  },
  {
    RecordID: 7,
    Company: 'Morrison Build',
    Industry: 'Construction',
    Email: 'jake@morrisonbuild.com',
    Phone: '780 555 0144',
    Tags: 'Hot lead,VIP',
    AnnualRevenue: 980000,
    Employees: 34,
  },
  {
    RecordID: 8,
    Company: 'Harborstack',
    Industry: 'Cloud services',
    Email: 'team@harborstack.com',
    Phone: '604 555 0102',
    Tags: 'Renewal,VIP',
    AnnualRevenue: 3450000,
    Employees: 92,
  },
  {
    RecordID: 9,
    Company: 'Park Agency',
    Industry: 'Marketing',
    Email: 'hello@parkagency.co',
    Phone: '416 555 0123',
    Tags: 'Net 30',
    AnnualRevenue: 1120000,
    Employees: 18,
  },
  {
    RecordID: 10,
    Company: 'Mahmoud CPA',
    Industry: 'Accounting',
    Email: 'office@mahmoudcpa.com',
    Phone: '',
    Tags: 'Cold lead',
    AnnualRevenue: '',
    Employees: 7,
  },
  {
    RecordID: 11,
    Company: 'Rivera & Co',
    Industry: 'Consulting',
    Email: 'hello@rivera-co.com',
    Phone: '212 555 0156',
    Tags: 'Overdue',
    AnnualRevenue: 640000,
    Employees: 14,
  },
  {
    RecordID: 12,
    Company: 'Voss Design',
    Industry: 'Industrial design',
    Email: 'hello@vossdesign.com',
    Phone: '647 555 0107',
    Tags: 'Hot lead',
    AnnualRevenue: '',
    Employees: 9,
  },
  {
    RecordID: 13,
    Company: 'Lee Creative',
    Industry: 'Creative agency',
    Email: 'hi@leecreative.com',
    Phone: '416 555 0191',
    Tags: 'Renewal',
    AnnualRevenue: 1480000,
    Employees: 22,
  },
  {
    RecordID: 14,
    Company: 'Alvarez Roofing',
    Industry: 'Construction',
    Email: 'office@alvarezroofing.com',
    Phone: '305 555 0148',
    Tags: 'VIP',
    AnnualRevenue: 2680000,
    Employees: 41,
  },
  {
    RecordID: 15,
    Company: 'Bennett Legal',
    Industry: 'Legal services',
    Email: 'intake@bennettlegal.co',
    Phone: '',
    Tags: 'Cold lead',
    AnnualRevenue: '',
    Employees: 16,
  },
  {
    RecordID: 16,
    Company: 'Kowalski Electric',
    Industry: 'Trades',
    Email: 'noah@kowalskielectric.com',
    Phone: '780 555 0130',
    Tags: 'Hot lead,Net 30',
    AnnualRevenue: 1240000,
    Employees: 28,
  },
  {
    RecordID: 17,
    Company: 'Tanaka Consulting',
    Industry: 'Consulting',
    Email: 'office@tanakaconsulting.com',
    Phone: '604 555 0175',
    Tags: 'Enterprise',
    AnnualRevenue: 5300000,
    Employees: 110,
  },
  {
    RecordID: 18,
    Company: 'Mendes Architects',
    Industry: 'Architecture',
    Email: 'studio@mendesarchitects.com',
    Phone: '416 555 0166',
    Tags: 'Renewal,VIP',
    AnnualRevenue: 3120000,
    Employees: 38,
  },
];

const CUSTOMERS_TAGS = [
  { colour: '#A9D9BF', name: 'Hot lead' },
  { colour: '#84F3FF', name: 'Cold lead' },
  { colour: '#BACAD0', name: 'VIP' },
  { colour: '#B3E5FF', name: 'Net 30' },
  { colour: '#FFCDAB', name: 'Overdue' },
  { colour: '#FFE3A3', name: 'Renewal' },
  { colour: '#D6C7FF', name: 'Enterprise' },
];

const CUSTOMERS_DATA = [
  {
    RecordID: 1,
    Contact: 'Tyler Copeland',
    ContactType: 'Customer Lead',
    Email: 'copelandmedia@gmail.com',
    Phone: '',
    Tags: '',
    LifetimeValue: '',
    HealthScore: 10,
  },
  {
    RecordID: 2,
    Contact: 'Alex Chen',
    ContactType: 'Customer',
    Email: 'alex.chen@northwind.com',
    Phone: '416 555 0142',
    Tags: 'VIP,Enterprise',
    LifetimeValue: 84250.5,
    HealthScore: 92,
  },
  {
    RecordID: 3,
    Contact: 'Priya Sharma',
    ContactType: 'Customer',
    Email: 'priya@contoso.io',
    Phone: '647 555 0188',
    Tags: 'Renewal',
    LifetimeValue: 31200,
    HealthScore: 78,
  },
  {
    RecordID: 4,
    Contact: 'Marcus Bell',
    ContactType: 'Customer Lead',
    Email: 'marcus.bell@bellworks.co',
    Phone: '212 555 0119',
    Tags: 'Hot lead',
    LifetimeValue: '',
    HealthScore: 45,
  },
  {
    RecordID: 5,
    Contact: 'Sofia Reyes',
    ContactType: 'Customer',
    Email: 'sofia@reyesstudio.com',
    Phone: '305 555 0177',
    Tags: 'VIP,Net 30',
    LifetimeValue: 42800,
    HealthScore: 88,
  },
  {
    RecordID: 6,
    Contact: 'Daniel Okafor',
    ContactType: 'Prospect',
    Email: 'd.okafor@okaforlogistics.com',
    Phone: '',
    Tags: 'Cold lead',
    LifetimeValue: '',
    HealthScore: 22,
  },
  {
    RecordID: 7,
    Contact: 'Emma Thompson',
    ContactType: 'Customer',
    Email: 'emma.t@brightlabs.io',
    Phone: '604 555 0163',
    Tags: 'Enterprise,Net 30',
    LifetimeValue: 156400,
    HealthScore: 96,
  },
  {
    RecordID: 8,
    Contact: 'Jake Morrison',
    ContactType: 'Customer Lead',
    Email: 'jake@morrisonbuild.com',
    Phone: '780 555 0144',
    Tags: 'Hot lead,VIP',
    LifetimeValue: '',
    HealthScore: 67,
  },
  {
    RecordID: 9,
    Contact: 'Lin Wei',
    ContactType: 'Customer',
    Email: 'lin.wei@harborstack.com',
    Phone: '604 555 0102',
    Tags: 'Renewal,VIP',
    LifetimeValue: 67500,
    HealthScore: 81,
  },
  {
    RecordID: 10,
    Contact: 'Robin Park',
    ContactType: 'Customer',
    Email: 'robin@parkagency.co',
    Phone: '416 555 0123',
    Tags: 'Net 30',
    LifetimeValue: 18900,
    HealthScore: 71,
  },
  {
    RecordID: 11,
    Contact: 'Aisha Mahmoud',
    ContactType: 'Prospect',
    Email: 'a.mahmoud@mahmoudcpa.com',
    Phone: '',
    Tags: 'Cold lead',
    LifetimeValue: '',
    HealthScore: 33,
  },
  {
    RecordID: 12,
    Contact: 'Sam Rivera',
    ContactType: 'Customer',
    Email: 'sam.rivera@rivera-co.com',
    Phone: '212 555 0156',
    Tags: 'Overdue',
    LifetimeValue: 9800,
    HealthScore: 38,
  },
  {
    RecordID: 13,
    Contact: 'Hannah Voss',
    ContactType: 'Customer Lead',
    Email: 'hannah@vossdesign.com',
    Phone: '647 555 0107',
    Tags: 'Hot lead',
    LifetimeValue: '',
    HealthScore: 58,
  },
  {
    RecordID: 14,
    Contact: 'Jamie Lee',
    ContactType: 'Customer',
    Email: 'jamie.lee@leecreative.com',
    Phone: '416 555 0191',
    Tags: 'Renewal',
    LifetimeValue: 24300,
    HealthScore: 74,
  },
  {
    RecordID: 15,
    Contact: 'Mateo Alvarez',
    ContactType: 'Customer',
    Email: 'mateo@alvarezroofing.com',
    Phone: '305 555 0148',
    Tags: 'VIP',
    LifetimeValue: 52100,
    HealthScore: 85,
  },
  {
    RecordID: 16,
    Contact: 'Olivia Bennett',
    ContactType: 'Prospect',
    Email: 'olivia.b@bennettlegal.co',
    Phone: '',
    Tags: 'Cold lead',
    LifetimeValue: '',
    HealthScore: 28,
  },
  {
    RecordID: 17,
    Contact: 'Noah Kowalski',
    ContactType: 'Customer Lead',
    Email: 'noah@kowalskielectric.com',
    Phone: '780 555 0130',
    Tags: 'Hot lead,Net 30',
    LifetimeValue: '',
    HealthScore: 62,
  },
  {
    RecordID: 18,
    Contact: 'Yuki Tanaka',
    ContactType: 'Customer',
    Email: 'yuki@tanakaconsulting.com',
    Phone: '604 555 0175',
    Tags: 'Enterprise',
    LifetimeValue: 98700,
    HealthScore: 90,
  },
  {
    RecordID: 19,
    Contact: 'Carla Mendes',
    ContactType: 'Customer',
    Email: 'carla.mendes@mendesarchitects.com',
    Phone: '416 555 0166',
    Tags: 'Renewal,VIP',
    LifetimeValue: 73200,
    HealthScore: 82,
  },
  {
    RecordID: 20,
    Contact: 'Devon Walsh',
    ContactType: 'Customer Lead',
    Email: 'devon.walsh@walshmedia.io',
    Phone: '',
    Tags: 'Hot lead',
    LifetimeValue: '',
    HealthScore: 51,
  },
  {
    RecordID: 21,
    Contact: 'Isabel Carrasco',
    ContactType: 'Customer',
    Email: 'isabel@carrascolaw.com',
    Phone: '212 555 0193',
    Tags: 'Net 30,VIP',
    LifetimeValue: 38600,
    HealthScore: 77,
  },
  {
    RecordID: 22,
    Contact: 'Owen Pritchard',
    ContactType: 'Prospect',
    Email: 'owen@pritchardcrm.com',
    Phone: '',
    Tags: 'Cold lead',
    LifetimeValue: '',
    HealthScore: 19,
  },
  {
    RecordID: 23,
    Contact: 'Zara Khan',
    ContactType: 'Customer',
    Email: 'zara.khan@khanwellness.co',
    Phone: '647 555 0184',
    Tags: 'Renewal',
    LifetimeValue: 21500,
    HealthScore: 69,
  },
  {
    RecordID: 24,
    Contact: 'Logan Pearce',
    ContactType: 'Customer',
    Email: 'logan@pearceplumbing.com',
    Phone: '780 555 0152',
    Tags: 'Overdue,Net 30',
    LifetimeValue: 14200,
    HealthScore: 41,
  },
  {
    RecordID: 25,
    Contact: 'Mira Patel',
    ContactType: 'Customer Lead',
    Email: 'mira@patelevents.com',
    Phone: '305 555 0139',
    Tags: 'Hot lead,Enterprise',
    LifetimeValue: '',
    HealthScore: 64,
  },
];

// =====================================================================
// Home screen data
// =====================================================================

// Onboarding hero art. Served from public/ as a real file rather than an
// inline data URI: @m-next/image explicitly rejects `data:image` values
// (Image.jsx: `if (!value || value.indexOf('data:image') > -1) return
// getPlaceholderSvg(...)`) and swaps in its own generic placeholder. Replace
// with the real asset when it exists.
const ONBOARDING_IMAGE = '/onboarding-hero.svg';

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
// Activities data
// =====================================================================

const ACTIVITY_TAGS = [
  { colour: '#FFCDAB', name: 'Overdue' },
  { colour: '#A9D9BF', name: 'Follow-up' },
  { colour: '#B3E5FF', name: 'Urgent' },
  { colour: '#D6C7FF', name: 'Internal' },
  { colour: '#FFE3A3', name: 'Awaiting reply' },
];

const ACTIVITIES_COLUMNS = [
  { primary: true, name: 'RecordID', fieldType: FieldTypeIds.Integer, visible: false, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'ActivityType', caption: 'Type', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'Subject', caption: 'Subject', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'lg', editable: false },
  { primary: false, name: 'Contact', caption: 'Contact', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'Status', caption: 'Status', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'DueDate', caption: 'Due', fieldType: FieldTypeIds.Date, visible: true, columnAlign: 'left', width: 'sm', editable: false },
  { primary: false, name: 'AssignedTo', caption: 'Assigned to', fieldType: FieldTypeIds.Text, visible: true, columnAlign: 'left', width: 'md', editable: false },
  { primary: false, name: 'Tags', caption: 'Tags', fieldType: FieldTypeIds.Tags, visible: true, columnAlign: 'left', width: 'md', editable: false },
];

const ACTIVITIES_OPEN = [
  { RecordID: 1, ActivityType: 'Phone Call', Subject: 'Follow up on proposal', Contact: 'Alex Chen', Status: 'Overdue', DueDate: '2026-05-28', AssignedTo: 'Tyler Copeland', Tags: 'Overdue,Follow-up' },
  { RecordID: 2, ActivityType: 'Email', Subject: 'Send renewal terms', Contact: 'Priya Sharma', Status: 'Open', DueDate: '2026-06-04', AssignedTo: 'Robin Park', Tags: 'Follow-up' },
  { RecordID: 3, ActivityType: 'Meeting', Subject: 'Quarterly review', Contact: 'Sofia Reyes', Status: 'Open', DueDate: '2026-06-05', AssignedTo: 'Tyler Copeland', Tags: '' },
  { RecordID: 4, ActivityType: 'Task', Subject: 'Prepare site visit notes', Contact: 'Jake Morrison', Status: 'Open', DueDate: '2026-06-03', AssignedTo: 'Sam Rivera', Tags: 'Urgent' },
  { RecordID: 5, ActivityType: 'Phone Call', Subject: 'Discuss invoicing schedule', Contact: 'Emma Thompson', Status: 'Open', DueDate: '2026-06-08', AssignedTo: 'Robin Park', Tags: '' },
  { RecordID: 6, ActivityType: 'Email', Subject: 'Share contract draft', Contact: 'Lin Wei', Status: 'Open', DueDate: '2026-06-04', AssignedTo: 'Tyler Copeland', Tags: 'Awaiting reply' },
  { RecordID: 7, ActivityType: 'Note', Subject: 'Customer mentioned competitor', Contact: 'Marcus Bell', Status: 'Open', DueDate: '2026-06-02', AssignedTo: 'Tyler Copeland', Tags: 'Internal' },
  { RecordID: 8, ActivityType: 'Task', Subject: 'Send onboarding deck', Contact: 'Hannah Voss', Status: 'Overdue', DueDate: '2026-05-30', AssignedTo: 'Sam Rivera', Tags: 'Overdue' },
  { RecordID: 9, ActivityType: 'Meeting', Subject: 'Discovery call', Contact: 'Devon Walsh', Status: 'Open', DueDate: '2026-06-10', AssignedTo: 'Robin Park', Tags: '' },
  { RecordID: 10, ActivityType: 'Phone Call', Subject: 'Resolve billing question', Contact: 'Sam Rivera', Status: 'Open', DueDate: '2026-06-04', AssignedTo: 'Jamie Lee', Tags: 'Urgent' },
  { RecordID: 11, ActivityType: 'Email', Subject: 'Follow up on demo', Contact: 'Noah Kowalski', Status: 'Open', DueDate: '2026-06-06', AssignedTo: 'Tyler Copeland', Tags: 'Follow-up' },
  { RecordID: 12, ActivityType: 'Task', Subject: 'Update CRM with new contact info', Contact: 'Mira Patel', Status: 'Open', DueDate: '2026-06-03', AssignedTo: 'Sam Rivera', Tags: 'Internal' },
];

const ACTIVITIES_CLOSED = [
  { RecordID: 101, ActivityType: 'Phone Call', Subject: 'Initial introduction', Contact: 'Alex Chen', Status: 'Completed', DueDate: '2026-05-12', AssignedTo: 'Tyler Copeland', Tags: '' },
  { RecordID: 102, ActivityType: 'Meeting', Subject: 'Kickoff workshop', Contact: 'Emma Thompson', Status: 'Completed', DueDate: '2026-05-15', AssignedTo: 'Tyler Copeland', Tags: '' },
  { RecordID: 103, ActivityType: 'Email', Subject: 'Sent welcome packet', Contact: 'Robin Park', Status: 'Completed', DueDate: '2026-05-20', AssignedTo: 'Sam Rivera', Tags: 'Follow-up' },
  { RecordID: 104, ActivityType: 'Task', Subject: 'Reviewed contract', Contact: 'Lin Wei', Status: 'Completed', DueDate: '2026-05-22', AssignedTo: 'Tyler Copeland', Tags: 'Internal' },
  { RecordID: 105, ActivityType: 'Note', Subject: 'Logged feedback from demo', Contact: 'Sofia Reyes', Status: 'Completed', DueDate: '2026-05-24', AssignedTo: 'Robin Park', Tags: '' },
  { RecordID: 106, ActivityType: 'Phone Call', Subject: 'Confirmed signed agreement', Contact: 'Jake Morrison', Status: 'Completed', DueDate: '2026-05-26', AssignedTo: 'Jamie Lee', Tags: '' },
  { RecordID: 107, ActivityType: 'Email', Subject: 'Shared onboarding video', Contact: 'Priya Sharma', Status: 'Completed', DueDate: '2026-05-28', AssignedTo: 'Sam Rivera', Tags: 'Follow-up' },
];

// Mirrors packages/grid/stories/GridWrapper.jsx — wires Grid's pagination,
// selection, sort, and search state so the prototype gets the same behavior
// as the canonical Readonly story. The Grid here owns all the chrome
// (view filter, search, reload, columns toggle, inline export, pagination).
const ReadonlyContactsGrid = ({
  id,
  data,
  columns,
  viewFilters,
  selectedView,
  tagsList,
  onRowClick,
  initialPageSize = 10,
}) => {
  const [sort, setSort] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRecordIDs, setSelectedRecordIDs] = useState([]);
  const [allExcept, setAllExcept] = useState(false);
  const [transformedData, setTransformedData] = useState(data);
  const [searchText, setSearchText] = useState(null);

  useEffect(() => {
    setTransformedData(data);
  }, [data]);

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

  const handleSelectPage = (isChecked) => {
    let ids = [...selectedRecordIDs];
    const total = transformedData.length;
    const start = (pageNumber - 1) * pageSize;
    const end = Math.min(total, pageNumber * pageSize);
    for (let i = start; i < end; i++) {
      const rid = transformedData[i].RecordID;
      if (isChecked) ids.push(rid);
      else ids = ids.filter((x) => x !== rid);
    }
    setSelectedRecordIDs(ids);
  };

  const handleSelect = (recordId, rowIdx, isChecked) => {
    let ids = [...selectedRecordIDs];
    let rows = [...selectedRows];
    if (recordId) {
      if (isChecked) ids.push(recordId);
      else ids = ids.filter((x) => x !== recordId);
    } else {
      if (isChecked) rows.push(rowIdx);
      else rows = rows.filter((x) => x !== rowIdx);
    }
    if (allExcept && recordId) {
      ids = isChecked ? ids.filter((x) => x !== recordId) : [...ids, recordId];
    }
    setSelectedRecordIDs(ids);
    setSelectedRows(rows);
  };

  // Wrapper div: @m-next/tabs renders its content panel as a flex-row
  // container, so a bare block child (the Grid's Identify wrapper) collapses
  // to its content width. flex: 1 + minWidth: 0 makes the grid span the full
  // tab panel width while still allowing inner scrolling.
  return (
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
      onSelect={handleSelect}
      onSelectPage={handleSelectPage}
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

const ListIconButton = ({ name, ariaLabel }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    style={{
      background: 'transparent',
      border: '1px solid #BACAD0',
      borderRadius: 4,
      cursor: 'pointer',
      width: 32,
      height: 32,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#545F67',
      padding: 0,
    }}
  >
    <SvgIcon name={name} size={14} color="#545F67" />
  </button>
);

const CustomersListScreen = ({ onSelectContact }) => {
  const theme = useTheme();
  const [activationDismissed, setActivationDismissed] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <Stack gap="lg" style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      {!activationDismissed && (
        <AppActivationBanner
          iconName="contacts"
          title="Turn more prospects into paying customers"
          description="Customers and Leads helps you capture, organize, and act on every potential opportunity so no prospect falls through the cracks. Stay focused on what matters — building pipeline and closing more business — with a clear, centralized view of all your leads and customer interactions."
          bulletPoints={[
            { id: 'bp1', text: 'Capture and organize leads while interest is high' },
            { id: 'bp2', text: 'Track lead status from inquiry to opportunity' },
            { id: 'bp3', text: 'Manage communications and follow-ups in one place' },
            { id: 'bp4', text: 'Auto-sync to keep contacts current' },
          ]}
          primaryCTA={{
            id: 'add-first-contact',
            text: 'Add your first contact',
            onClick: () => {},
          }}
          secondaryCTA={{
            id: 'learn-more',
            text: 'Learn more',
            onClick: () => {},
          }}
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
            onClick={() => {}}
          >
            Add contact
          </Button>
        </Inline>
      </Inline>

      {/* Real @m-next/tabs — Contacts / Companies. Content lives INSIDE
          the tab panel via onRenderTabContent so switching tabs swaps
          the right data view. */}
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
              <ReadonlyContactsGrid
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
          // Contacts tab — uses the Grid's canonical Readonly story wiring
          // (pagination, selection, sort, search) so the built-in chrome
          // does the heavy lifting instead of being duplicated by a custom
          // header row.
          return (
            <ReadonlyContactsGrid
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
              onRowClick={() => onSelectContact('tc')}
            />
          );
        }}
      />
    </Stack>
  );
};

// =====================================================================
// HomeScreen — mirrors MethodUI's HomeV2Container layout (greeting +
// HeroBanner + nested tabs + InsightCard row + Todos + Quick actions)
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

// To-Do row — mirrors MethodUI's TodoCard pattern exactly
// (MethodUI/public/react/pages/dashboard/home/components/TodoCard.js).
// Uses Checkbox `rounded` for the circle shape, SvgIcon CircleCheck for
// the completed state, and the production visual treatment (background +
// border + opacity per state). Layout is title + status pill on row 1,
// description + calendar-icon + due-date on row 2.
const TodoRow = ({ todo, checked, onToggle }) => {
  const pill = TODO_STATUS_PILL[todo.status];
  const completed = todo.status === 'completed';
  const dueLabelText = todo.dueLabel.replace(/^(Overdue|Due):\s*/, '');
  return (
    <Box
      style={{
        padding: 12,
        borderRadius: 8,
        background: completed ? '#E7F5F0' : '#FFFFFF',
        border: `1px solid ${completed ? '#A9D9BF' : '#E5E5E5'}`,
        opacity: completed ? 0.75 : 1,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Inline gap="sm" align="flex-start" style={{ width: '100%', minWidth: 0 }}>
        <Box style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }}>
          {completed ? (
            <SvgIcon name="CircleCheck" size={16} color="#007B4A" />
          ) : (
            <Checkbox
              checked={checked}
              onChange={onToggle}
              ariaLabel={todo.title}
              hideLabel
              rounded
            />
          )}
        </Box>
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Inline gap="md" align="flex-start" justify="spaceBetween" style={{ width: '100%' }}>
            <Text
              fontSize="14px"
              lineHeight="16px"
              fontWeight={600}
              fontColor="#0F1B31"
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
              fontSize="12px"
              lineHeight="16px"
              fontColor="#545F67"
              style={{ flex: 1, minWidth: 0 }}
            >
              {todo.description}
            </Text>
            <Inline gap="xs" align="center" style={{ flexShrink: 0 }}>
              <SvgIcon
                name="calendar-V4"
                size={8}
                color={todo.overdue ? '#DA211E' : '#545F67'}
              />
              <Text
                fontSize="12px"
                lineHeight="16px"
                fontWeight={400}
                fontColor={todo.overdue ? '#DA211E' : '#545F67'}
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

// Quick-action row — mirrors MethodUI's QuickLinksContainer pattern.
const QuickActionRow = ({ action }) => {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={() => {}}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '8px 12px',
        background: 'transparent', border: 'none', borderRadius: 6,
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        color: theme.content.emphasize,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F4F7'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <Box
        style={{
          width: 32, height: 32, borderRadius: 6, background: '#E5F0FA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <SvgIcon name={action.iconName} size={18} color="#0D71C8" />
      </Box>
      <Text fontSize="14px" lineHeight="20px" fontWeight={500}>
        {action.label}
      </Text>
    </button>
  );
};

const HomeScreen = () => {
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
    // gap="xl" (24) matches the Containers' internal padding. With gap="lg"
    // (16) the cards sat closer to each other than their own content sat to
    // their edges, which reads as one blurred band rather than three sections.
    <Stack gap="lg" style={{ flex: 1, minWidth: 0, width: '100%' }}>
      {/* One card holds greeting -> hero -> Insights. Keeping them in a
          single surface is what gives the page its two-band structure;
          floating the greeting and hero loose on the page background made
          the rhythm read wrong no matter how the gaps were tuned. */}
      <Container borderless={false} padding="24px">
      <Stack gap="lg" style={{ width: '100%' }}>
      <Inline justify="spaceBetween" align="flex-start" wrap gap="md">
        <Stack gap="xs">
          <Text fontSize="12px" lineHeight="16px" fontColor={theme.content.subtle}>
            {formatGreetingDate(today)}
          </Text>
          <Text as="H1" fontSize="24px" lineHeight="28px" fontWeight={700} mt="0px" mb="0px">
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
        contentStyle={{ padding: 0, border: 'none', minHeight: 0 }}
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
          <Container borderless={false} padding="24px">
            <Stack gap="md">
              <Inline justify="spaceBetween" align="center">
                <Text as="H2" fontSize="20px" lineHeight="24px" fontWeight={700} mt="0px" mb="0px">
                  To-Dos
                </Text>
                <Button variant="ghost" size="sm" aria-label="To-Dos settings"
                  leftIcon={<SvgIcon name="cog" size={16} color="currentColor" />} />
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
              {HOME_TODOS.length > 6 && (
                <Box style={{ textAlign: 'center' }}>
                  <Button
                    variant="tertiary"
                    onClick={() => setShowAllTodos((v) => !v)}
                    rightIcon={
                      <SvgIcon
                        name={showAllTodos ? 'chevron-up' : 'chevron-down'}
                        size={12}
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
          <Container borderless={false} padding="16px">
            <Stack gap="sm">
              <Inline justify="spaceBetween" align="center">
                <Text as="H2" fontSize="16px" lineHeight="20px" fontWeight={700} mt="0px" mb="0px">
                  Quick actions
                </Text>
                <Button variant="ghost" size="sm" aria-label="Quick actions settings"
                  leftIcon={<SvgIcon name="cog" size={16} color="currentColor" />} />
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
      {/* Top-level tabs: Home / Apps / Insights — pinned to the very top
          per production. Greeting + sync status live inside the Home tab
          body via renderHomeBody(). */}
      <Tabs
        width="100%"
        tabList={[
          { id: 'home', caption: 'Home' },
          { id: 'apps', caption: 'Apps' },
          { id: 'insights', caption: 'Insights' },
        ]}
        selectedTab={activeTopTab}
        onChange={setActiveTopTab}
        contentStyle={{ padding: 0, border: 'none', minHeight: 0 }}
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
// ActivitiesListScreen — sibling of CustomersListScreen for Activities
// =====================================================================

const ActivitiesListScreen = () => {
  const [activeTab, setActiveTab] = useState('open');

  return (
    <Stack gap="lg" style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
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
            leftIcon={<SvgIcon name="filter" size={16} color="currentColor" />}
          >
            Filter
          </Button>
          <Button
            variant="primary"
            leftIcon={<SvgIcon name="circle-plus" size={14} color="currentColor" />}
            onClick={() => {}}
          >
            Add activity
          </Button>
        </Inline>
      </Inline>

      <Tabs
        tabList={[
          { id: 'open', caption: 'Open' },
          { id: 'closed', caption: 'Closed' },
        ]}
        selectedTab={activeTab}
        onChange={setActiveTab}
        onRenderTabContent={() => {
          if (activeTab === 'closed') {
            return (
              <ReadonlyContactsGrid
                id="activities-closed-grid"
                data={ACTIVITIES_CLOSED}
                columns={ACTIVITIES_COLUMNS}
                viewFilters={[
                  { id: 'shared-closed', name: 'Shared - All Closed' },
                  { id: 'my-closed', name: 'My Closed Activities' },
                  { id: 'this-week', name: 'Closed This Week' },
                ]}
                selectedView="shared-closed"
                tagsList={ACTIVITY_TAGS}
              />
            );
          }
          return (
            <ReadonlyContactsGrid
              id="activities-open-grid"
              data={ACTIVITIES_OPEN}
              columns={ACTIVITIES_COLUMNS}
              viewFilters={[
                { id: 'shared-open', name: 'Shared - All Open' },
                { id: 'my-open', name: 'My Open Activities' },
                { id: 'overdue', name: 'Overdue Only' },
              ]}
              selectedView="shared-open"
              tagsList={ACTIVITY_TAGS}
            />
          );
        }}
      />
    </Stack>
  );
};

// =====================================================================
// ContactDetailScreen — production contact detail view (Tyler Copeland)
// =====================================================================

const FieldRow = ({ label, value, isLink, isEmpty }) => (
  <Stack gap="none">
    <Text fontSize="14px" lineHeight="20px" fontWeight={600} fontColor="#0F1B31">
      {label}
    </Text>
    {!isEmpty && (
      <Text
        fontSize="14px"
        lineHeight="20px"
        fontColor={isLink ? '#0D71C8' : '#0F1B31'}
        mt="2px"
      >
        {value}
      </Text>
    )}
  </Stack>
);

const EditWithDropdown = () => (
  <Inline gap="none" align="center">
    <Button variant="secondary" size="sm">
      Edit
    </Button>
    <button
      type="button"
      aria-label="More edit actions"
      style={{
        background: 'transparent',
        border: '1px solid #0D71C8',
        borderLeft: 'none',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        cursor: 'pointer',
        padding: '6px 10px',
        marginLeft: -1,
        color: '#0D71C8',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <SvgIcon name="chevron-down" size={12} color="#0D71C8" />
    </button>
  </Inline>
);

const ContactDetailTabs = [
  { id: 'activities-open', caption: 'Activities Open' },
  { id: 'activities-closed', caption: 'Activities Closed' },
  { id: 'opportunities', caption: 'Opportunities' },
  { id: 'proposals', caption: 'Proposals' },
  { id: 'estimates', caption: 'Estimates' },
  { id: 'work-orders', caption: 'Work Orders' },
  { id: 'invoices', caption: 'Invoices' },
  { id: 'more', caption: 'More ▼' },
];

const ContactDetailScreen = ({ onBack }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('activities-open');
  const [showMore, setShowMore] = useState(false);

  return (
    <Inline gap="lg" align="stretch" style={{ width: '100%' }}>
      {/* LEFT — contact info */}
      <Box style={{ flex: '0 0 480px', minWidth: 380 }}>
        <Stack gap="lg">
          <Box style={{ alignSelf: 'flex-start' }}>
            <Button
              variant="tertiary"
              onClick={onBack}
              leftIcon={<SvgIcon name="chevron-left" size={12} color="currentColor" />}
            >
              Back
            </Button>
          </Box>

          {/* Avatar + name + main contact */}
          <Inline gap="md" align="center">
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: '#A5DFEB',
                color: '#0F1B31',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              TC
            </Box>
            <Stack gap="none">
              <Text
                as="H1"
                fontSize="24px"
                lineHeight="28px"
                fontWeight={700}
                fontColor="#0F1B31"
                mt="0px"
                mb="0px"
              >
                Tyler Copeland
              </Text>
              <Text fontSize="12px" lineHeight="16px" fontColor="#545F67" mt="2px">
                Main Contact
              </Text>
            </Stack>
          </Inline>

          <Divider spacing="none" color="#EEF5F7" />

          {/* Health Score */}
          <Inline gap="md" align="center">
            <Box
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: '#FFF3F0',
                color: '#A10007',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              10
            </Box>
            <Stack gap="none">
              <Inline gap="xs" align="center">
                <Text
                  fontSize="16px"
                  lineHeight="20px"
                  fontWeight={600}
                  fontColor="#0F1B31"
                  mt="0px"
                  mb="0px"
                >
                  Health Score
                </Text>
                <Text fontSize="12px" lineHeight="16px" fontColor="#545F67">
                  (Updated today at 10:40 PM)
                </Text>
              </Inline>
              <Text fontSize="12px" lineHeight="16px" fontColor="#545F67" mt="2px">
                No change in health score compared to last week.
              </Text>
            </Stack>
          </Inline>

          <Divider spacing="none" color="#EEF5F7" />

          {/* Contact Details section */}
          <Stack gap="md">
            <Inline justify="spaceBetween" align="center">
              <Text
                as="H2"
                fontSize="20px"
                lineHeight="24px"
                fontWeight={700}
                fontColor="#0F1B31"
                mt="0px"
                mb="0px"
              >
                Contact Details
              </Text>
              <EditWithDropdown />
            </Inline>
            <Inline gap="lg" wrap>
              <Box style={{ flex: '1 1 200px' }}>
                <FieldRow label="Phone" isEmpty />
              </Box>
              <Box style={{ flex: '1 1 200px' }}>
                <FieldRow label="Alt Phone" isEmpty />
              </Box>
            </Inline>
            <FieldRow label="Mobile" isEmpty />
            <FieldRow label="Email" value="copelandmedia@gmail.com" isLink />
            <FieldRow label="Website" isEmpty />
            <FieldRow label="Tags" isEmpty />

            <Stack gap="xs">
              <Inline gap="xs" align="center">
                <Text fontSize="14px" lineHeight="20px" fontWeight={600} fontColor="#0F1B31">
                  Portal Link
                </Text>
                <SvgIcon name="question" size={14} color="#545F67" />
              </Inline>
              <Text fontSize="14px" lineHeight="20px" fontColor="#0D71C8" mt="2px">
                https://Mlurl.cc/yGa5jZqml
              </Text>
            </Stack>
          </Stack>

          {/* Customer Lead Details section */}
          <Stack gap="md">
            <Inline justify="spaceBetween" align="center">
              <Text
                as="H2"
                fontSize="20px"
                lineHeight="24px"
                fontWeight={700}
                fontColor="#0F1B31"
                mt="0px"
                mb="0px"
              >
                Customer Lead Details
              </Text>
              <EditWithDropdown />
            </Inline>
            <Inline gap="lg" wrap>
              <Box style={{ flex: '1 1 200px' }}>
                <FieldRow label="Lead Status" value="Open" />
              </Box>
              <Box style={{ flex: '1 1 200px' }}>
                <FieldRow label="Lead Rating" value="Warm" />
              </Box>
            </Inline>
            <FieldRow label="Lead Source" isEmpty />
            <FieldRow label="Assigned To" value="Tyler Copeland" />
            <FieldRow label="Name in QuickBooks" value="Tyler Copeland" />
            {showMore && (
              <>
                <FieldRow label="Billing" isEmpty />
                <FieldRow label="Shipping" isEmpty />
                <FieldRow label="Last Activity" value="—" />
              </>
            )}
            {!showMore && <FieldRow label="Billing" isEmpty />}
          </Stack>

          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              color: '#0D71C8',
              fontFamily: 'inherit',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              alignSelf: 'flex-start',
            }}
          >
            <SvgIcon name={showMore ? 'chevron-up' : 'chevron-down'} size={12} color="#0D71C8" />
            Show {showMore ? 'less' : 'more'}
          </button>
        </Stack>
      </Box>

      {/* RIGHT — tabs + data table */}
      <Box style={{ flex: '1 1 auto', minWidth: 0 }}>
        <Container bordered padding="0px">
          <Stack gap="none">
            {/* Real @m-next/tabs — Activities Open / Closed / Opportunities / etc.
                No onRenderTabContent: the action row + table render as siblings
                below the tab strip rather than inside the panel. */}
            <Tabs
              tabList={ContactDetailTabs}
              selectedTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Action row */}
            <Box padding="md">
              <Inline justify="spaceBetween" align="center" wrap gap="md">
                <Box />
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#0D71C8',
                    fontFamily: 'inherit',
                    fontSize: 14,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <SvgIcon name="circle-plus" size={16} color="#0D71C8" />
                  New Activity
                </button>
              </Inline>

              <Inline gap="sm" align="center" style={{ marginTop: 12 }}>
                <ListIconButton name="cog" ariaLabel="Settings" />
                <Box style={{ flex: 1, maxWidth: 360 }}>
                  <SearchInput value="" onChange={() => {}} placeholder="Search" />
                </Box>
                <button
                  type="button"
                  aria-label="Run search"
                  style={{
                    background: '#0D71C8',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    width: 32,
                    height: 32,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgIcon name="search" size={14} color="white" />
                </button>
              </Inline>
            </Box>

            {/* Table header */}
            <Box
              padding="md"
              style={{ background: '#EEF5F7', borderTop: '1px solid #BACAD0' }}
            >
              <Inline gap="md" align="center">
                <Box style={{ flex: '1 1 110px' }}>
                  <Text fontSize="12px" lineHeight="16px" fontWeight={600} fontColor="#0D71C8">
                    Start Date
                  </Text>
                </Box>
                <Box style={{ flex: '1 1 140px' }}>
                  <Text fontSize="12px" lineHeight="16px" fontWeight={600} fontColor="#0D71C8">
                    Contact
                  </Text>
                </Box>
                <Box style={{ flex: '2 1 220px' }}>
                  <Text fontSize="12px" lineHeight="16px" fontWeight={600} fontColor="#0D71C8">
                    Type / Status / Assigned To
                  </Text>
                </Box>
                <Box style={{ flex: '1 1 120px' }}>
                  <Text fontSize="12px" lineHeight="16px" fontWeight={600} fontColor="#0D71C8">
                    Comments
                  </Text>
                </Box>
              </Inline>
            </Box>

            {/* Empty state */}
            <Box padding="md">
              <Text fontSize="14px" lineHeight="20px" fontColor="#545F67">
                No records to display.
              </Text>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Inline>
  );
};

// =====================================================================
// Main CustomerDetail screen
// =====================================================================

const CustomerDetail = ({ inspectOn, setInspectOn }) => {
  const theme = useTheme();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // View router — selects which screen renders in the main content area.
  // Sidebar items + row clicks + back links update this.
  const [currentScreen, setCurrentScreen] = useState('home');

  const [form, setForm] = useState({
    name: 'Acme Corp',
    email: 'alex@acme.com',
    notes: '',
    status: 'active',
    newsletter: true,
    active: true,
  });
  const [formError, setFormError] = useState(null);

  const tabList = [
    { id: 'overview', caption: 'Overview' },
    { id: 'edit', caption: 'Edit details' },
    { id: 'invoices', caption: 'Invoices' },
    { id: 'activity', caption: 'Activity' },
  ];

  const renderActiveTab = () => {
    if (activeTab === 'overview') return <OverviewTab loading={false} />;
    if (activeTab === 'edit') {
      return (
        <Stack gap="lg">
          <EditTab form={form} setForm={setForm} formError={formError} />
          <Inline justify="end" gap="sm">
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save changes</Button>
          </Inline>
        </Stack>
      );
    }
    if (activeTab === 'invoices') return <InvoicesTab onSelectInvoice={openInvoice} />;
    if (activeTab === 'activity') return <ActivityTab />;
    return null;
  };

  const openInvoice = (inv) => {
    setSelectedInvoice(inv);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setFormError('Company name is required.');
      return;
    }
    setFormError(null);
    success(`${form.name} saved`, { title: 'Customer updated' });
  };

  const handleCancel = () => info('Changes discarded');
  const handleDelete = () => setDialogOpen(true);
  const confirmDelete = () => {
    setDialogOpen(false);
    info('Delete cancelled — this is just a demo');
  };

  // Page title shown in AppBar.Start — depends on the active screen.
  const pageTitle =
    currentScreen === 'home' ? 'Home'
      : currentScreen === 'acme-detail' ? 'Acme Corp'
        : currentScreen === 'activities-list' ? 'Activities'
          : 'Contacts';

  return (
    <InspectContext.Provider value={inspectOn}>
      <Stack
        gap="none"
        style={{
          height: '100vh',
          width: '100%',
          fontFamily: theme.fontFamily,
        }}
      >
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        {/* Left rail — Method-style Sidebar with @m-next/svg-icon glyphs. */}
        <Sidebar>
          <Sidebar.Header>
            <MethodLogo height={20} />
            <button
              type="button"
              aria-label="Toggle sidebar"
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SvgIcon name="navbar" size={20} color="white" />
            </button>
          </Sidebar.Header>
          <Sidebar.Item
            icon={<SvgIcon name="dashboard" size={20} color="white" />}
            active={currentScreen === 'home'}
            onClick={() => setCurrentScreen('home')}
          >
            Home
          </Sidebar.Item>
          <Sidebar.Divider />
          <Sidebar.Body>
            <Sidebar.Item
              icon={<SvgIcon name="contacts" size={20} color="white" />}
              active={currentScreen === 'customers-list' || currentScreen === 'contact-detail'}
              onClick={() => setCurrentScreen('customers-list')}
            >
              Contacts
            </Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="opportunity" size={20} color="white" />}>Opportunities</Sidebar.Item>
            <Sidebar.Item
              icon={<SvgIcon name="activities" size={20} color="white" />}
              active={currentScreen === 'activities-list'}
              onClick={() => setCurrentScreen('activities-list')}
            >
              Activities
            </Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="invoice" size={20} color="white" />}>Invoices</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="estimate" size={20} color="white" />}>Estimates</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="receipts" size={20} color="white" />}>Sales Receipts</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="payments" size={20} color="white" />}>Payments</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="email" size={20} color="white" />}>Email Marketing</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="opportunity" size={20} color="white" />}>Donor Pages</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="calendar" size={20} color="white" />}>Time Tracking</Sidebar.Item>
            <Sidebar.Item icon={<SvgIcon name="chevron-down" size={20} color="white" />}>More Apps</Sidebar.Item>
          </Sidebar.Body>
          <Sidebar.Divider />
          <Sidebar.Footer>
            <Sidebar.Item icon={<SvgIcon name="customize" size={20} color="white" />}>App Marketplace</Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar>

        {/* Right column — AppBar on top + scrollable content below. */}
        <Box
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <AppBar>
            <AppBar.Start>
              <button
                type="button"
                aria-label={`Configure ${pageTitle}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px 4px 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#022266',
                  fontFamily: 'inherit',
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {pageTitle}
                <SvgIcon name="chevron-down" size={14} color="#022266" />
              </button>
            </AppBar.Start>
            <AppBar.End>
              <button
                type="button"
                aria-label="Global add"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, color: '#545F67' }}
              >
                <SvgIcon name="circle-plus" size={20} color="#545F67" />
              </button>
              <button
                type="button"
                aria-label="Search"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, color: '#545F67' }}
              >
                <SvgIcon name="search" size={20} color="#545F67" />
              </button>
              <button
                type="button"
                aria-label="Help and support"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, color: '#545F67' }}
              >
                <SvgIcon name="question" size={20} color="#545F67" />
              </button>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 1, height: 24, background: '#BACAD0', margin: '0 4px' }} />
              <button
                type="button"
                aria-label="User menu"
                style={{
                  background: '#E5F0FA',
                  color: '#022266',
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                TC
              </button>
            </AppBar.End>
          </AppBar>

          <Box
            padding="xl"
            background={theme.background.page || theme.background.subtle}
            style={{ flex: 1, overflowY: 'auto' }}
          >
            <InspectLegend />
            {currentScreen === 'home' && <HomeScreen />}
            {currentScreen === 'customers-list' && (
              <CustomersListScreen
                onSelectContact={() => setCurrentScreen('contact-detail')}
              />
            )}
            {currentScreen === 'contact-detail' && (
              <ContactDetailScreen onBack={() => setCurrentScreen('customers-list')} />
            )}
            {currentScreen === 'activities-list' && <ActivitiesListScreen />}
            {currentScreen === 'acme-detail' && (
              <Stack gap="lg" style={{ maxWidth: 1120, marginLeft: 'auto', marginRight: 'auto' }}>
                <Header
                  onDelete={handleDelete}
                  onEdit={() => setActiveTab('edit')}
                  inspectOn={inspectOn}
                  setInspectOn={setInspectOn}
                />

                <Tabs
                  tabList={tabList}
                  selectedTab={activeTab}
                  onChange={setActiveTab}
                  onRenderTabContent={renderActiveTab}
                />

                <Box
                  padding="lg"
                  background={theme.background.secondary}
                  style={{
                    borderRadius: theme.radius.md,
                    border: `1px dashed ${theme.content.border}`,
                  }}
                >
                  <Stack gap="xs">
                    <Text
                      as="H2"
                      fontSize="14px"
                      lineHeight="20px"
                      fontWeight={theme.fontWeight.semibold}
                      fontColor={theme.content.primary}
                      mt="0px"
                      mb="0px"
                    >
                      How to audit this screen
                    </Text>
                    <Text
                      as="P"
                      fontSize="14px"
                      lineHeight="20px"
                      fontColor={theme.content.subtle}
                      style={{ maxWidth: 720 }}
                      mt="0px"
                      mb="0px"
                    >
                      Toggle <strong>Inspect</strong> at the top right. Every m-next component on the
                      page gets a dashed outline + a color-coded label. Anything without a label is
                      either a foundation layout primitive (Box, Stack, Inline, Divider) or native HTML
                      — those signal where the design system has gaps.
                    </Text>
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>
        </Box>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="right"
          size="md"
          title={selectedInvoice ? `Invoice ${selectedInvoice.id}` : 'Invoice'}
        >
          <InvoiceDrawerBody invoice={selectedInvoice} onClose={() => setDrawerOpen(false)} />
        </Drawer>

        <Dialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Delete Acme Corp?"
        >
          <Box padding="lg">
            <Stack gap="md">
              <Text fontSize="14px" lineHeight="20px">
                This will permanently remove the customer, their invoices, and all related activity.
                This action cannot be undone.
              </Text>
              <Alert status="warning">
                5 open invoices totalling $4,800 will be cancelled.
              </Alert>
              <Inline justify="end" gap="sm">
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Keep customer</Button>
                <Button variant="primary" onClick={confirmDelete}>Delete</Button>
              </Inline>
            </Stack>
          </Box>
        </Dialog>
      </Box>
      </Stack>
    </InspectContext.Provider>
  );
};

const AppMNext = ({ inspectOn, setInspectOn }) => (
  <ThemeProvider defaultName="light">
    <ToastProvider position="top-right" defaultDuration={4500}>
      <CustomerDetail inspectOn={inspectOn} setInspectOn={setInspectOn} />
    </ToastProvider>
  </ThemeProvider>
);

export default AppMNext;
