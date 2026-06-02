const { dirname, join } = require('path');

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

// Scoped to m-next-built packages only. The inherited m-one packages have
// pre-existing ENOENT errors from per-package nested node_modules that didn't
// survive the workspace hoist. Add new packages here as Phase 2+ ships.
//
// Note: a single brace-expansion glob with all packages hits a filesystem
// path-length limit (ENAMETOOLONG). We iterate per-package to keep each glob
// short.
const M_NEXT_PACKAGES = [
  // Foundation
  'tokens', 'theme', 'layout',
  // Phase 2 missing components
  'spinner', 'badge', 'tooltip', 'empty-state', 'link', 'alert',
  'toast', 'drawer', 'form-field',
  // Phase 3 cleaned: form family
  'button', 'input', 'checkbox', 'toggle', 'radio-button',
  'dropdown', 'multi-select', 'select', 'caption', 'validation',
  // Phase 3 cleaned: non-form
  'banner', 'dialog', 'pill', 'tabs', 'card',
  // Phase 3 cleaned: typography / structure
  'text', 'container', 'bread-crumbs', 'field-block',
  'hero-banner', 'content-card', 'stepper',
  // Phase 3 cleaned: smaller-surface
  'chips-filter', 'pill-tab', 'menu', 'popover',
  'search-input', 'tag-widget',
  // Phase 3 cleaned: domain-y
  'address', 'address-lookup', 'phone-input',
  // Phase 3 cleaned: audit-rename wave
  'input-area', 'svg-icon', 'loading-skeleton', 'button-group',
  // Used by Foundation prototype but not yet Phase-3 cleaned
  'insight-card',
  // Phase 3 cleaned: datepicker wrappers (4 of 5 components).
  // DatePicker itself deferred — its prop surface needs careful per-prop
  // assessment, not mechanical soft-shimming.
  'datepicker',
  // Phase 3 cleaned: wave 1 (small)
  'gallery', 'app-activation-banner', 'app-activation-overlay',
  // Phase 3 cleaned: wave 2 (medium)
  'attachments', 'map', 'signature',
  // Phase 3 cleaned: small follow-ups (4 packages, parallel-agent wave)
  // - attachments sub-components already covered by 'attachments' above
  // - typeography is deprecated, fires a one-time console.warn on render
  'sync-widget', 'typeography', 'html-editor',
  // New design-system packages extracted from MethodUI shells
  'sidebar', 'app-bar',
  // New design-system packages ported from MethodUI/shared/ primitives
  'section-header', 'scrollbar', 'carousel',
  // MethodUI/shared/ ports wave 2
  'pagination', 'avatar-pill',
  // Wave 2 (large port + envelope additions)
  'accordion', 'image',
  // Wave 4 — broken-inherited cluster (Syncfusion + Highcharts heavies)
  'color-picker', 'chart-drilldown', 'chart', 'calendar', 'grid',
];

const stories = M_NEXT_PACKAGES.flatMap((pkg) => [
  `../packages/${pkg}/stories/**/*.stories.@(js|jsx|ts|tsx)`,
  `../packages/${pkg}/stories/**/*.mdx`,
]);

const config = {
  framework: getAbsolutePath('@storybook/react-webpack5'),
  stories,

  addons: [
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  docs: {
    autodocs: true,
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

module.exports = config;
