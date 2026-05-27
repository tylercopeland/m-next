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
    '../packages/tokens/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/theme/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/layout/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/spinner/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/badge/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/tooltip/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/empty-state/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/link/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/alert/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-themes")
  ],

  docs: {
    autodocs: true
  },

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};

module.exports = config;

