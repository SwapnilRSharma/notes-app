import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5199',
    video: 'on',
    trace: 'on',
    screenshot: 'only-on-failure',
    headless: true,
  },
  webServer: {
    command: 'npm run start:e2e',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
