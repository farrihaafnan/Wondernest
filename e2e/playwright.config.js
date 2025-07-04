// playwright.config.js
// @ts-check
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  timeout: 60000,
  retries: 1,
  workers: 1,
  use: {
    headless: true,
    baseURL: 'http://localhost:3000', // dynamic base URL
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { open: 'never' }]],
};

module.exports = config;
