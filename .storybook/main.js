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
