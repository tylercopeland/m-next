const { dirname, join } = require('path');

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config = {
  framework: getAbsolutePath('@storybook/react-webpack5'),
  // Scoped to m-next-built packages only. The inherited m-one packages have
  // pre-existing ENOENT errors from per-package nested node_modules that didn't
  // survive the workspace hoist. Add new packages to this list as Phase 2+ ships.
  stories: [
    '../packages/@(tokens|theme|layout|spinner|badge|tooltip|empty-state|link|alert|button|input|checkbox|toggle|radio-button|dropdown|multi-select|select)/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/@(tokens|theme|layout|spinner|badge|tooltip|empty-state|link|alert|button|input|checkbox|toggle|radio-button|dropdown|multi-select|select)/stories/**/*.mdx',
  ],

  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  docs: {
    autodocs: true
  },

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};

module.exports = config;

