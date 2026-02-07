import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/results',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro - mobile first
  },
  projects: [
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
