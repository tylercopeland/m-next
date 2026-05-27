import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("storybook-addon-designs"),
    getAbsolutePath("@storybook/addon-storyshots"),
    getAbsolutePath("storybook-addon-remix-react-router"),
  ],

  framework: getAbsolutePath("@storybook/react-webpack5")
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

