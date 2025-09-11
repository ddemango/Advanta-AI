import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'audit-output/junit-results.xml' }]
  ],
  use: {
    baseURL: process.env.TARGET_URL || 'https://www.advanta-ai.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results/',
  projects: [
    {
      name: 'desktop-chrome',
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...require('@playwright/test').devices['iPhone 12'],
        viewport: { width: 375, height: 812 }
      },
    },
  ],
});