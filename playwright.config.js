import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/specs',
  outputDir: './e2e/results',
  timeout: 45000,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['html', { outputFolder: 'e2e/reports', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Auth setup — runs once, saves session for reuse
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    // Smoke — no auth needed, runs independently
    {
      name: 'smoke',
      testMatch: /tier1-smoke\/.*/,
      use: { viewport: { width: 390, height: 844 } },
    },
    // Mobile — authenticated tests
    {
      name: 'mobile-chrome',
      testDir: './e2e/specs',
      testIgnore: /tier1-smoke\//,
      use: {
        ...devices['iPhone 14'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    // Desktop — authenticated tests
    {
      name: 'desktop-chrome',
      testDir: './e2e/specs',
      testIgnore: /tier1-smoke\//,
      use: {
        viewport: { width: 1280, height: 720 },
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
