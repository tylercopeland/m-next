/* eslint-disable import/no-extraneous-dependencies */
const { defineConfig, devices } = require('@playwright/test');

// Storybook on :6007 must be running before invoking `npx playwright test`.
// Set BASE_URL to override (e.g. for CI against a hosted Storybook build).

module.exports = defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'list' : 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:6007',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 200,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
